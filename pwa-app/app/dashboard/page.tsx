'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

// Fungsi untuk menarik 1 data riwayat paling baru milik user yang sedang login
const fetchLatestScan = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('riwayat_deteksi')
    .select('*')
    .eq('user_id', user.id)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [userName, setUserName] = useState("Anak Kos");
  const [userInitial, setUserInitial] = useState("AK");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning,";
    if (hour >= 12 && hour < 15) return "Good Afternoon,";
    if (hour >= 15 && hour < 18) return "Good Evening,";
    return "Good Night,";
  };

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
          <p className="text-sm text-[#84A982] font-bold">{getGreeting()}</p>
          <h1 className="text-3xl font-black text-white drop-shadow-sm truncate">
            {userName} 👋
          </h1>
        </div>
        <Link href="/profile" className="w-14 h-14 bg-[#F9D66F] rounded-full flex items-center justify-center shadow-md border-4 border-white shrink-0 hover:scale-105 transition-transform">
          <span className="font-black text-[#FF7AA2] text-sm">{userInitial}</span>
        </Link>
      </header>

      <div className="w-full max-w-md mx-auto flex-1 space-y-8">
        
        {/* Main Status Card */}
        <div className="bg-[#F9D66F] rounded-[32px] border-[6px] border-[#78B5D6] p-6 text-white shadow-sm relative overflow-hidden flex items-center justify-between">
          <div className="w-2/3">
            <h2 className="text-[#FF9B71] font-black text-xl mb-1">{t.risikoHariIni}</h2>
            {isLoading ? (
               <p className="text-2xl font-black text-white/50 mb-4 animate-pulse">...</p>
            ) : (
               <p className={`text-4xl font-black mb-4 drop-shadow-sm ${textColorStatus}`}>
                 {statusRisiko === 'Belum Scan' ? t.belumScan : statusRisiko}
               </p>
            )}
            <Link href="/history" className="inline-block">
              <button className="text-xs bg-white/40 px-4 py-2 rounded-full border-2 border-[#78B5D6] flex items-center gap-2 hover:bg-white/60 transition-colors font-bold text-[#FF7AA2]">
                {t.details}
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
          <h3 className="text-white font-extrabold text-2xl mb-4 drop-shadow-sm">{t.quickActions}</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Tombol Kamera */}
            <Link href="/camera" className="bg-white p-5 rounded-[32px] border-4 border-[#78B5D6] flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform shadow-sm group">
              <div className="w-14 h-14 bg-[#FFF9E6] rounded-2xl flex items-center justify-center text-[#FF9B71] border-2 border-[#F9D66F]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <span className="font-black text-[#FF7AA2] text-sm text-center">{t.deteksiKamera}</span>
            </Link>

            {/* Tombol Checklist */}
            <Link href="/checklist" className="bg-white p-5 rounded-[32px] border-4 border-[#78B5D6] flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform shadow-sm group">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#84A982] border-2 border-[#C1E2A4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <span className="font-black text-[#FF7AA2] text-sm text-center">{t.checklistFisik}</span>
            </Link>
          </div>
        </div>

        {/* Insight AI */}
        <div className="bg-white rounded-[32px] border-[6px] border-[#78B5D6] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#78B5D6] to-[#6C96C2] px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 1 8 8c0 3.5-2 6.5-5 7.7V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.3C6 16.5 4 13.5 4 10a8 8 0 0 1 8-8z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>
            </div>
            <div>
              <h3 className="text-white font-black text-lg leading-none">{t.insightAI}</h3>
              <p className="text-white/70 text-xs font-semibold mt-0.5">{t.analisisKondisi}</p>
            </div>
            <div className="ml-auto bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white text-xs font-black">BETA</span>
            </div>
          </div>

          <div className="p-6">
            {!scanTerbaru || !scanTerbaru.insight_ai ? (
              /* Empty state — belum ada scan */
              <div className="flex flex-col items-center text-center py-2 gap-4">
                <div className="w-20 h-20 bg-[#FFF9E6] rounded-full border-4 border-[#F9D66F] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F9D66F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <div>
                  <p className="text-[#6C96C2] font-black text-base mb-1">{t.belumAdaData}</p>
                  <p className="text-[#84A982] font-semibold text-sm">{t.belumAdaDataDesc}</p>
                </div>
                <Link href="/camera" className="bg-[#FF7AA2] text-white font-black text-sm px-6 py-3 rounded-2xl border-4 border-white shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  {t.mulaiScan}
                </Link>
              </div>
            ) : (
              /* Ada data insight */
              <div className="space-y-4">
                {/* Quote insight */}
                <div className="bg-[#F0F7FF] rounded-2xl p-4 border-l-4 border-[#78B5D6]">
                  <p className="text-[#6C96C2] font-bold text-sm leading-relaxed italic">
                    "{scanTerbaru.insight_ai}"
                  </p>
                </div>

                {/* Rekomendasi */}
                {scanTerbaru.rekomendasi && scanTerbaru.rekomendasi.length > 0 && (
                  <div>
                    <p className="text-[#FF7AA2] font-black text-sm mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      {t.rekomendasiCepat}
                    </p>
                    <div className="space-y-2">
                      {scanTerbaru.rekomendasi.map((rek: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-[#F6FFF4] rounded-xl p-3 border-2 border-[#BDD16D]/50">
                          <div className="w-6 h-6 bg-[#BDD16D] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-black mt-0.5">{idx + 1}</div>
                          <span className="text-sm font-bold text-neutral-600 leading-snug">{rek}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tips Cepat Anti Black Mold */}
        <div>
          <h3 className="text-white font-extrabold text-2xl mb-4 drop-shadow-sm">{t.tipsHarian}</h3>
          <div className="space-y-3">
            {[
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
                color: "bg-[#FFF9E6] border-[#F9D66F] text-[#FF9B71]",
                iconBg: "bg-[#F9D66F]/30",
                title: t.tip1Title, desc: t.tip1Desc
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>,
                color: "bg-[#F0F7FF] border-[#78B5D6] text-[#6C96C2]",
                iconBg: "bg-[#78B5D6]/20",
                title: t.tip2Title, desc: t.tip2Desc
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                color: "bg-[#F6FFF4] border-[#BDD16D] text-[#84A982]",
                iconBg: "bg-[#BDD16D]/30",
                title: t.tip3Title, desc: t.tip3Desc
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                color: "bg-[#FFF0F5] border-[#FF7AA2] text-[#FF7AA2]",
                iconBg: "bg-[#FF7AA2]/15",
                title: t.tip4Title, desc: t.tip4Desc
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                color: "bg-[#F5F0FF] border-[#9B8FC4] text-[#9B8FC4]",
                iconBg: "bg-[#9B8FC4]/15",
                title: t.tip5Title, desc: t.tip5Desc
              },
            ].map((tip, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-[20px] border-4 ${tip.color} bg-white`}>
                <div className={`w-11 h-11 ${tip.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <span className={tip.color.split(' ')[2]}>{tip.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm ${tip.color.split(' ')[2]}`}>{tip.title}</p>
                  <p className="text-neutral-500 font-semibold text-xs mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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