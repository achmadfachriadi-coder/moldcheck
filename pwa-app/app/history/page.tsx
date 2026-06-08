'use client';

import { useEffect, useState } from 'react'; 
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface Riwayat {
  id: number;
  skor: number;
  status_risiko: string;
  image_url: string;
}

export default function HistoryPage() {
  const [dataRiwayat, setDataRiwayat] = useState<Riwayat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ambilDataRiwayat = async () => {
      try {
        // 1. Cek identitas akun yang sedang login saat ini
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Jika tidak ada yang login, hentikan proses loading
        if (authError || !user) {
          console.warn("User belum login atau sesi habis.");
          setIsLoading(false);
          return;
        }

        // 2. Ambil data HANYA milik user tersebut (Filter dengan .eq)
        const { data, error } = await supabase
          .from('riwayat_deteksi')
          .select('*')
          .eq('user_id', user.id) // INI KUNCI PENGAMANNYA!
          .order('id', { ascending: false });

        if (error) {
          console.error("Gagal mengambil data:", error.message);
        } else if (data) {
          setDataRiwayat(data);
        }
      } catch (err) {
        console.error("Terjadi kesalahan sistem:", err);
      } finally {
        setIsLoading(false);
      }
    };

    ambilDataRiwayat();
  }, []);

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      
      <div className="w-full max-w-md p-6 md:p-8 pb-32 flex flex-col min-h-screen">
        
        <header className="mb-8 mt-4">
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-1 drop-shadow-sm">
            Riwayat
          </h1>
          <p className="text-[#6C96C2] font-bold text-lg">
            Catatan kondisi kamar kos Anda.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-white font-black text-xl animate-pulse">Memuat data...</p>
          </div>
        ) : dataRiwayat.length === 0 ? (
          <div className="bg-white/40 rounded-3xl p-8 text-center border-4 border-white/50 border-dashed">
            <p className="text-[#84A982] font-bold text-lg mb-2">Belum ada riwayat.</p>
            <p className="text-[#84A982] text-sm">Coba lakukan deteksi pertamamu sekarang!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dataRiwayat.map((item) => (
              <div key={item.id} className="bg-white rounded-[32px] p-4 border-[6px] border-[#78B5D6] shadow-sm flex items-center justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-4 w-full">
                  
                  <div className="w-20 h-20 bg-gray-100 rounded-[20px] overflow-hidden border-4 border-[#78B5D6] flex-shrink-0 relative">
                    {item.image_url && item.image_url !== "foto_sementara.jpg" ? (
                      <img 
                        src={item.image_url} 
                        alt="Foto Kamar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/150?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FFF9E6] text-[#FF9B71] text-[10px] font-black text-center p-1">
                        No Photo
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow overflow-hidden">
                    <h3 className={`font-extrabold text-xl uppercase tracking-wider mb-0.5 truncate ${
                      item.status_risiko === 'Berbahaya' || item.status_risiko === 'Tinggi' ? 'text-red-500' : 
                      item.status_risiko === 'Waspada' || item.status_risiko === 'Sedang' ? 'text-[#FF9B71]' : 
                      'text-[#84A982]'
                    }`}>
                      {item.status_risiko}
                    </h3>
                    <p className="text-[#6C96C2] font-bold text-xs truncate">
                      ID Deteksi: #{item.id}
                    </p>
                  </div>

                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[4px] shadow-inner flex-shrink-0 ${
                    item.skor >= 60 ? 'bg-[#FFB6B9] border-[#FF7AA2] text-[#A61C40]' : 
                    item.skor >= 30 ? 'bg-[#F9D66F] border-white text-[#B56D35]' : 
                    'bg-[#BDD16D] border-white text-[#4A6B48]'
                  }`}>
                    <span className="font-black text-xl">{item.skor}</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 w-full max-w-md bg-[#F9D66F] border-t-4 border-[#78B5D6] flex justify-around p-4 rounded-t-[40px] shadow-lg z-50 left-1/2 -translate-x-1/2">
        <Link href="/dashboard" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></Link>
        <Link href="/history" className="text-[#FF7AA2]"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></Link>
        <Link href="/camera" className="bg-[#78B5D6] p-3 rounded-2xl -mt-10 border-4 border-white shadow-md text-white hover:scale-105 transition-transform"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></Link>
        <Link href="/edukasi" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></Link>
        <Link href="/profile" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></Link>
      </nav>

    </main>
  );
}