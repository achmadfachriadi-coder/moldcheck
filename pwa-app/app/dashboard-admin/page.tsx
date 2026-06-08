'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

interface Laporan {
  id: number;
  skor: number;
  status_risiko: string;
  image_url: string;
  user_id: string;
  no_kamar: string;
}

export default function DashboardAdmin() {
  const router = useRouter();
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const siapkanDashboard = async () => {
      // 1. Cek izin satpam
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.user_metadata?.role !== 'admin') {
        alert("Akses Ditolak! Halaman ini khusus Penjaga Kos.");
        router.replace('/login');
        return;
      }

      // 2. Ambil semua data laporan dari anak kos
      const { data, error } = await supabase
        .from('riwayat_deteksi')
        .select('*')
        .order('id', { ascending: false }); 

      if (error) {
        console.error("Gagal mengambil data:", error);
      } else {
        setLaporan(data || []);
      }
      
      setIsLoading(false);
    };

    siapkanDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    router.replace('/login');
  };

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      
      {/* Wrapper seukuran HP */}
      <div className="w-full max-w-md p-6 md:p-8 flex flex-col min-h-screen">
        
        {/* Header & Logout Button */}
        <header className="mb-8 mt-4 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-wide mb-1 drop-shadow-sm">
              Admin
            </h1>
            <p className="text-[#6C96C2] font-bold text-lg">
              Pantau seluruh kamar kos.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-[#FF7AA2] border-[4px] border-white text-white font-black px-4 py-2 rounded-[20px] shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
          >
            Keluar
          </button>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-white font-black text-xl animate-pulse">Menarik laporan...</p>
          </div>
        ) : laporan.length === 0 ? (
          <div className="bg-white/40 rounded-3xl p-8 text-center border-4 border-white/50 border-dashed">
            <p className="text-[#84A982] font-bold text-lg mb-2">Aman Terkendali!</p>
            <p className="text-[#84A982] text-sm">Belum ada laporan kerusakan jamur dari anak kos.</p>
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {laporan.map((item) => (
              <div key={item.id} className="bg-white rounded-[32px] p-4 border-[6px] border-[#78B5D6] shadow-sm hover:scale-[1.01] transition-transform">
                
                {/* Gambar Kamar Besar untuk Admin */}
                <div className="w-full h-48 bg-gray-100 rounded-[20px] overflow-hidden border-4 border-[#78B5D6] relative mb-4">
                  {item.image_url && item.image_url !== "foto_sementara.jpg" ? (
                    <img 
                      src={item.image_url} 
                      alt="Laporan Kamar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#FFF9E6] text-[#FF9B71] font-black text-center p-1">
                      Tidak Ada Foto Terlampir
                    </div>
                  )}
                </div>

                {/* Konten & Skor */}
                <div className="flex items-center justify-between">
                  <div className="flex-grow overflow-hidden pr-2">
                    <h3 className={`font-extrabold text-2xl uppercase tracking-wider mb-0.5 truncate ${
                      item.status_risiko === 'Berbahaya' || item.status_risiko === 'Tinggi' ? 'text-red-500' : 
                      item.status_risiko === 'Waspada' || item.status_risiko === 'Sedang' ? 'text-[#FF9B71]' : 
                      'text-[#84A982]'
                    }`}>
                      {item.status_risiko}
                      <div className="flex flex-col gap-1 mt-1">
                      <p className="text-[#A61C40] font-black text-lg truncate bg-[#FFB6B9]/30 w-fit px-2 py-0.5 rounded-lg border-2 border-[#FFB6B9]">
                        Kamar: {item.no_kamar || 'Tidak Diketahui'}
                      </p>
                      <p className="text-[#6C96C2] font-bold text-xs truncate">
                        ID Laporan: #{item.id}
                      </p>
                    </div>
                    </h3>
                    <p className="text-[#6C96C2] font-bold text-sm truncate">
                      ID Laporan: #{item.id}
                    </p>
                  </div>

                  {/* Badge Skor khas GSM MoldCheck */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-[4px] shadow-inner flex-shrink-0 ${
                    item.skor >= 60 ? 'bg-[#FFB6B9] border-[#FF7AA2] text-[#A61C40]' : 
                    item.skor >= 30 ? 'bg-[#F9D66F] border-white text-[#B56D35]' : 
                    'bg-[#BDD16D] border-white text-[#4A6B48]'
                  }`}>
                    <span className="font-black text-2xl">{item.skor}</span>
                  </div>
                </div>

                {/* Tombol Tindak Lanjut Admin */}
                <button className="w-full mt-4 bg-[#F9D66F] border-[4px] border-[#78B5D6] py-3 rounded-full text-[#FF7AA2] font-black text-lg shadow-sm hover:scale-[1.02] active:scale-95 transition-transform">
                  Tindak Lanjuti
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}