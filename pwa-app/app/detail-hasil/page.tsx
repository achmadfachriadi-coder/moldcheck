// app/detail-hasil/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HasilAI {
  skor: number;
  status_risiko: string;
  faktor?: {
    kelembapan: number;
    jamur: number;
    ventilasi: number;
    kebersihan: number;
  };
}

export default function DetailHasilPage() {
  const [dataHasil, setDataHasil] = useState<HasilAI | null>(null);
  const router = useRouter();

  useEffect(() => {
    const disimpan = localStorage.getItem('hasilAnalisis');
    if (disimpan) {
      setDataHasil(JSON.parse(disimpan));
    }
  }, []);

  if (!dataHasil) {
    return (
      <main className="min-h-screen bg-[#BDD16D] font-sans flex items-center justify-center">
        <p className="text-white font-black text-xl animate-pulse">Memuat rincian...</p>
      </main>
    );
  }

  const faktor = dataHasil.faktor || {
    kelembapan: 100,
    jamur: dataHasil.skor,
    ventilasi: 100,
    kebersihan: 0
  };

  // 1. TEMA DINAMIS UNTUK KARTU UTAMA
  const dapatkanTema = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('tinggi')) {
      return {
        cardBg: 'bg-[#F9D66F]',
        borderColor: 'border-red-400',
        textColor: 'text-red-500',
        donutActive: '#ef4444', // red-500
        donutBg: '#fca5a5'      // red-300
      };
    } else if (s.includes('sedang')) {
      return {
        cardBg: 'bg-[#FFF9E6]',
        borderColor: 'border-[#FF9B71]',
        textColor: 'text-[#FF9B71]',
        donutActive: '#FF9B71',
        donutBg: '#FFE4D6'
      };
    } else {
      return {
        cardBg: 'bg-white',
        borderColor: 'border-[#84A982]',
        textColor: 'text-[#84A982]',
        donutActive: '#84A982',
        donutBg: '#D3E4D3'
      };
    }
  };

  const tema = dapatkanTema(dataHasil.status_risiko);

  // 2. LOGIKA WARNA & TEKS UNTUK PROGRESS BAR FAKTOR
  // isGoodHigh = true -> Nilai besar itu BAgUS (contoh: Kebersihan, Ventilasi)
  // isGoodHigh = false -> Nilai besar itu BURUK (contoh: Jamur, Kelembapan)
  const getFaktorStyle = (nilai: number, isGoodHigh: boolean) => {
    if (isGoodHigh) {
      if (nilai >= 70) return { label: "Baik", color: "bg-[#84A982]" }; // Hijau
      if (nilai >= 40) return { label: "Sedang", color: "bg-[#FF9B71]" }; // Oranye
      return { label: "Buruk", color: "bg-red-400" }; // Merah
    } else {
      if (nilai <= 30) return { label: "Rendah", color: "bg-[#84A982]" }; // Hijau
      if (nilai <= 60) return { label: "Sedang", color: "bg-[#FF9B71]" }; // Oranye
      return { label: "Tinggi", color: "bg-red-400" }; // Merah
    }
  };

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      <div className="w-full max-w-md p-6 md:p-8 flex flex-col min-h-screen pb-10 relative">
        
        {/* Header */}
        <header className="mb-6 mt-2">
          <button 
            onClick={() => router.push('/hasil-analisis')}
            className="inline-flex items-center text-[#78B5D6] font-bold text-sm mb-4 hover:opacity-70 bg-transparent border-none cursor-pointer transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </button>
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-1 drop-shadow-sm leading-tight">
            Detail Hasil Analisis
          </h1>
          <p className="text-[#6C96C2] font-bold text-lg">
            Kamar kos Anda.
          </p>
        </header>

        {/* Kartu Skor Risiko Dinamis */}
        <div className={`${tema.cardBg} rounded-[32px] border-[6px] ${tema.borderColor} p-6 mb-8 shadow-sm flex items-center justify-between transition-colors duration-500`}>
          <div>
            <h2 className={`${tema.textColor} font-black text-2xl mb-2 opacity-90`}>Skor Risiko</h2>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-5xl font-black ${tema.textColor}`}>{dataHasil.skor}</span>
              <span className={`${tema.textColor} font-black text-lg opacity-60`}>/ 100</span>
            </div>
            <h3 className={`${tema.textColor} font-black text-2xl uppercase`}>{dataHasil.status_risiko}</h3>
          </div>
          
          {/* Grafik Lingkaran (Real Percentage dengan Conic Gradient) */}
          <div 
            className="relative w-24 h-24 rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0"
            style={{
              background: `conic-gradient(${tema.donutActive} ${dataHasil.skor}%, ${tema.donutBg} ${dataHasil.skor}%)`
            }}
          >
             <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center z-10 shadow-sm">
                <span className={`${tema.textColor} font-black text-xl`}>{dataHasil.skor}%</span>
             </div>
          </div>
        </div>

        {/* Faktor Risiko Dinamis */}
        <div className="mb-8 flex-1">
          <h2 className="text-white font-extrabold text-3xl mb-6 drop-shadow-sm">Faktor Risiko</h2>
          
          <div className="space-y-5 bg-white/40 p-5 rounded-[24px] border-4 border-white/50 border-dashed">
            
            {/* Kelembapan (Rendah = Bagus) */}
            {(() => {
              const style = getFaktorStyle(faktor.kelembapan, false);
              return (
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[#6C96C2] font-extrabold text-sm drop-shadow-sm">Kelembapan</span>
                    <span className="text-white font-black text-sm">{faktor.kelembapan}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-xs w-16 ${style.color.replace('bg-', 'text-')}`}>{style.label}</span>
                    <div className="flex-1 h-4 bg-white/60 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${style.color}`} style={{ width: `${faktor.kelembapan}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Jamur (Rendah = Bagus) */}
            {(() => {
              const style = getFaktorStyle(faktor.jamur, false);
              return (
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[#6C96C2] font-extrabold text-sm drop-shadow-sm">Indikasi Jamur</span>
                    <span className="text-white font-black text-sm">{faktor.jamur}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-xs w-16 ${style.color.replace('bg-', 'text-')}`}>{style.label}</span>
                    <div className="flex-1 h-4 bg-white/60 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${style.color}`} style={{ width: `${faktor.jamur}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Ventilasi (Tinggi = Bagus) */}
            {(() => {
              const style = getFaktorStyle(faktor.ventilasi, true);
              return (
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[#6C96C2] font-extrabold text-sm drop-shadow-sm">Ventilasi Udara</span>
                    <span className="text-white font-black text-sm">{faktor.ventilasi}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-xs w-16 ${style.color.replace('bg-', 'text-')}`}>{style.label}</span>
                    <div className="flex-1 h-4 bg-white/60 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${style.color}`} style={{ width: `${faktor.ventilasi}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Kebersihan (Tinggi = Bagus) */}
            {(() => {
              const style = getFaktorStyle(faktor.kebersihan, true);
              return (
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[#6C96C2] font-extrabold text-sm drop-shadow-sm">Kebersihan</span>
                    <span className="text-white font-black text-sm">{faktor.kebersihan}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-xs w-16 ${style.color.replace('bg-', 'text-')}`}>{style.label}</span>
                    <div className="flex-1 h-4 bg-white/60 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-1000 ${style.color}`} style={{ width: `${faktor.kebersihan}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Tombol Lihat Rekomendasi */}
        <div className="mt-4">
          <button 
            onClick={() => router.push('/rekomendasi')}
            className="w-full bg-white border-[6px] border-[#78B5D6] py-4 rounded-full text-[#FF7AA2] font-black text-xl shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            Lihat Rekomendasi
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>

      </div>
    </main>
  );
}