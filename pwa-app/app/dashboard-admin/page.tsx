'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

// Definisi tipe data agar rapi
type Laporan = {
  id: number;
  skor: number;
  status_risiko: string;
  image_url: string;
  created_at: string;
};

export default function DashboardAdmin() {
  const router = useRouter();
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const siapkanDashboard = async () => {
      // 1. CEK IDENTITAS (POS SATPAM LAPIS DUA)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Jika belum login atau bukan admin, tendang ke halaman login
      if (!user || user.user_metadata?.role !== 'admin') {
        alert("Akses Ditolak! Halaman ini khusus Penjaga Kos.");
        router.replace('/login');
        return;
      }

      // 2. AMBIL DATA DARI BRANKAS SUPABASE
      const { data, error } = await supabase
        .from('riwayat_deteksi')
        .select('*')
        .order('created_at', { ascending: false }); // Urutkan dari yang paling baru

      if (error) {
        console.error("Gagal mengambil data:", error);
      } else {
        setLaporan(data || []);
      }
      
      setLoading(false);
    };

    siapkanDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BDD16D]">
        <p className="text-xl font-bold text-white animate-pulse">Menyiapkan Ruang Admin...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-[#78B5D6] mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#A61C40]">Dashboard Penjaga</h1>
          <p className="text-sm font-bold text-gray-500">Pantau Kondisi Seluruh Kamar</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors"
        >
          Keluar
        </button>
      </div>

      {/* Area Daftar Laporan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {laporan.length === 0 ? (
          <div className="col-span-full text-center p-8 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 font-bold">Belum ada laporan kerusakan dari anak kos.</p>
          </div>
        ) : (
          laporan.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 flex flex-col">
              {/* Gambar Jamur */}
              <div className="h-48 w-full bg-gray-200 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt="Foto Kamar" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-bold text-sm">Tanpa Foto</div>
                )}
                
                {/* Badge Status Risiko di Pojok Kanan Atas Gambar */}
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-white font-black text-xs shadow-md ${
                  item.status_risiko === 'Berbahaya' ? 'bg-[#A61C40]' : 
                  item.status_risiko === 'Waspada' ? 'bg-[#F9D66F] text-yellow-900' : 
                  'bg-[#84A982]'
                }`}>
                  {item.status_risiko || 'Aman'}
                </div>
              </div>

              {/* Info Laporan */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-gray-800 font-black text-lg">Skor Kelembapan: {item.skor}%</p>
                </div>
                
                <button className="mt-4 w-full bg-[#78B5D6] text-white py-2 rounded-xl font-bold text-sm hover:bg-[#6C96C2] transition-colors">
                  Tindak Lanjuti
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}