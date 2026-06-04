'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { supabase } from '@/utils/supabase';

// Fungsi untuk menarik 1 data riwayat paling baru dari Supabase
const fetchLatestScan = async () => {
  const { data, error } = await supabase
    .from('riwayat_scan')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error; 
  return data;
};

export default function DashboardPage() {
  // State untuk data User Auth
  const [userName, setUserName] = useState("Anak Kos");
  const [userInitial, setUserInitial] = useState("AK");

  // Hook SWR untuk sinkronisasi data scan otomatis setiap 3 detik
  const { data: scanTerbaru, error, isLoading } = useSWR('latest_scan', fetchLatestScan, {
    refreshInterval: 3000, 
  });

  // Ambil data nama user dari Supabase Auth saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const nama = user.user_metadata?.nama || user.user_metadata?.full_name || user.email?.split('@')[0] || "Anak Kos";
        setUserName(nama);
        setUserInitial(nama.substring(0, 2).toUpperCase()); // Ambil 2 huruf pertama untuk inisial baju avatar
      }
    };
    fetchUserData();
  }, []);

  // Nilai default (fallback) jika tabel riwayat scan masih kosong
  const statusRisiko = scanTerbaru?.status_risiko || "Belum Scan";
  const skor = scanTerbaru?.skor || 0;
  
  // Logika pewarnaan dinamis berdasarkan status risiko dari AI
  const textColorStatus = statusRisiko === 'Tinggi' ? 'text-red-500' : 'text-[#FF7AA2]';
  const textColorSkor = statusRisiko === 'Tinggi' ? 'text-red-500' : 'text-[#FF9B71]';

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans pb-32 relative flex flex-col p-6 md:p-8">
      
      {/* Header Profile (Sekarang Dinamis Sesuai User Database!) */}
      <header className="pt-4 pb-6 flex justify-between items-center w-full max-w-md mx-auto">
        <div className="overflow-hidden pr-4">
          <p className="text-sm text-[#84A982] font-bold">Good Morning,</p>
          <h1 className="text-3xl font-black text-white drop-shadow-sm truncate">
            {userName} 👋
          </h1>
        </div>
        <div className="w-14 h-14 bg-[#F9D66F] rounded-full flex items-center justify-center shadow-md border-4 border-white shrink-0">
          <span className="font-black text-[#FF7AA2] text-sm">{userInitial}</span>
        </div>
      </header>

      <div className="w-full max-w-md mx-auto flex-1 space-y-8">
        
        {/* Main Status Card */}
        <div className="bg-[#F9D66F] rounded-[32px] border-[6px] border-[#78B5D6] p-6 text-white shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="w-2/3">
            <h2 className="text-[#FF9B71] font-black text-xl mb-1">Risiko kos hari ini</h2>
            {isLoading ? (
               <p className="text-2xl font-black text-white/50 mb-4 animate-pulse">Memuat...</p>
            ) : (
               <p className={`text-4xl font-black mb-4 drop-shadow-sm ${textColorStatus}`}>
                 {statusRisiko}
               </p>
            )}
            <Link href="/detail-hasil" className="inline-block">
              <button className="text-xs bg-white/40 px-4 py-2 rounded-full border-2 border-[#78B5D6] flex items-center gap-2 hover:bg-white/60 transition-colors font-bold text-[#FF7AA2]">
                Details 
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </Link>
          </div>

          {/* Circular Percentage */}
          <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner border-[6px] border-[#FF7AA2] shrink-0">
            <span className={`text-lg font-black ${textColorSkor}`}>
              {isLoading ? "..." : `${skor}%`}
            </span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-white font-extrabold text-2xl mb-4 drop-shadow-sm">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Tombol Kamera */}
            <Link href="/camera" className="bg-white p-5 rounded-[32px] border-4 border-[#78B5D6] flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform shadow-sm group">
              <div className="w-14 h-14 bg-[#FFF9E6] rounded-2xl flex items-center justify-center text-[#FF9B71] border-2 border-[#F9D66F]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <span className="font-black text-[#FF7AA2] text-sm text-center">Deteksi Kamera</span>
            </Link>

            {/* Tombol Checklist */}
            <Link href="/checklist" className="bg-white p-5 rounded-[32px] border-4 border-[#78B5D6] flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform shadow-sm group">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#84A982] border-2 border-[#C1E2A4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <span className="font-black text-[#FF7AA2] text-sm text-center">Checklist Fisik</span>
            </Link>
          </div>
        </div>

        {/* Insight AI & Rekomendasi Dinamis */}
        {scanTerbaru && scanTerbaru.insight_ai && (
          <div className="bg-white rounded-[32px] border-[6px] border-[#78B5D6] p-6 shadow-sm relative">
            <h3 className="text-[#FF9B71] font-black text-xl mb-3">Insight AI</h3>
            <p className="text-[#84A982] font-bold text-sm leading-relaxed mb-4">
              "{scanTerbaru.insight_ai}"
            </p>
            
            {scanTerbaru.rekomendasi && (
              <div className="space-y-3 pt-3 border-t-2 border-dashed border-gray-200">
                <h4 className="text-[#FF7AA2] font-black text-sm">Rekomendasi Cepat:</h4>
                {scanTerbaru.rekomendasi.map((rek: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#BDD16D] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5">✓</div>
                    <span className="text-sm font-bold text-neutral-600">{rek}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#F9D66F] border-t-4 border-[#78B5D6] flex justify-around p-4 rounded-t-[40px] shadow-lg z-50">
        <Link href="/dashboard" className="text-[#FF7AA2]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </Link>
        <Link href="/history" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </Link>
        <Link href="/camera" className="bg-[#78B5D6] p-3 rounded-2xl -mt-10 border-4 border-white shadow-md text-white hover:scale-105 transition-transform">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </Link>
        <Link href="/edukasi" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </Link>
        <Link href="/profile" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </Link>
      </nav>

    </main>
  );
}