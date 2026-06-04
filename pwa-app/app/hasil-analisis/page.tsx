// app/hasil-analisis/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HasilAI {
  skor: number;
  status_risiko: string;
  area_terdeteksi?: string[];
  insight_ai?: string;
  rekomendasi?: string[];
  faktor?: {
    kelembapan: number;
    jamur: number;
    ventilasi: number;
    kebersihan: number;
  };
}

export default function HasilAnalisisPage() {
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
        <p className="text-white font-black text-xl animate-pulse">Memuat hasil...</p>
      </main>
    );
  }

  // Logika 3 Kondisi Tema: Aman, Sedang, Tinggi
  const dapatkanTema = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('tinggi')) {
      return {
        temaWarna: 'tinggi',
        cardBg: 'bg-[#F9D66F]',
        borderColor: 'border-red-400',
        textColor: 'text-red-500',
        badgeBg: 'bg-red-400',
        pesan: 'Peringatan Bahaya! Kondisi ini memerlukan tindakan pembersihan segera.',
        dampakTitle: 'Risiko Kesehatan',
        dampak: [
          "Memicu serangan asma akut",
          "Iritasi parah pada saluran pernapasan",
          "Mata merah, berair, dan gatal hebat",
          "Sakit kepala kronis karena mikotoksin"
        ]
      };
    } else if (s.includes('sedang')) {
      return {
        temaWarna: 'sedang',
        cardBg: 'bg-[#FFF9E6]',
        borderColor: 'border-[#FF9B71]', // Oranye
        textColor: 'text-[#FF9B71]',
        badgeBg: 'bg-[#FF9B71]',
        pesan: 'Waspada! Ada indikasi awal jamur. Segera perbaiki sirkulasi udara.',
        dampakTitle: 'Potensi Gangguan',
        dampak: [
          "Potensi alergi & bersin-bersin pagi hari",
          "Risiko iritasi mata ringan",
          "Menurunkan kualitas konsentrasi",
          "Memicu bau apek pada pakaian"
        ]
      };
    } else {
      // AMAN / BERSIH
      return {
        temaWarna: 'aman',
        cardBg: 'bg-white',
        borderColor: 'border-[#84A982]', // Hijau
        textColor: 'text-[#84A982]',
        badgeBg: 'bg-[#84A982]',
        pesan: 'Bagus sekali! Dinding kamar Anda terdeteksi bersih dan aman.',
        dampakTitle: 'Benefit Ruangan Sehat',
        dampak: [
          "Kualitas udara pernapasan sangat baik",
          "Tidur menjadi lebih nyenyak",
          "Bebas dari risiko alergi spora jamur",
          "Barang & pakaian awet dari pelapukan"
        ]
      };
    }
  };

  const tema = dapatkanTema(dataHasil.status_risiko);

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      
      {/* Wrapper pembatas seukuran HP (max-w-md) */}
      <div className="w-full max-w-md p-6 md:p-8 flex flex-col min-h-screen pb-12 relative">
        
        {/* Tombol Tutup (X) */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full border-4 border-[#78B5D6] flex items-center justify-center shadow-sm text-[#FF7AA2] hover:scale-105 transition-transform z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Header */}
        <header className="mb-8 mt-2 pr-14">
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-1 drop-shadow-sm leading-tight">
            Hasil Analisis
          </h1>
          <p className="text-[#6C96C2] font-bold text-lg">
            Kondisi kamar kos Anda.
          </p>
        </header>

        {/* Kartu Skor Risiko Dinamis */}
        <div className={`${tema.cardBg} rounded-[32px] border-[6px] ${tema.borderColor} p-6 mb-8 shadow-sm relative overflow-hidden transition-colors duration-500`}>
          <h2 className={`${tema.temaWarna === 'aman' ? 'text-[#84A982]' : 'text-white'} font-black text-xl mb-4 drop-shadow-sm`}>
            Skor Risiko
          </h2>
          
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-6xl font-black drop-shadow-sm ${tema.textColor}`}>
              {dataHasil.skor}
            </span>
            <span className={`${tema.temaWarna === 'aman' ? 'text-[#a0c49f]' : 'text-white/80'} font-black text-2xl`}>/ 100</span>
          </div>
          
          <h3 className={`${tema.textColor} font-black text-3xl mb-3 uppercase tracking-wider`}>
            {dataHasil.status_risiko}
          </h3>
          
          <p className="text-[#6C96C2] font-bold text-sm leading-relaxed bg-white/60 p-3 rounded-2xl border-2 border-white border-dashed">
            {tema.pesan}
          </p>
        </div>

        {/* Area Terdeteksi (Tampil hanya jika data tersedia, atau tampilkan status aman) */}
        <div className="mb-8 bg-white/40 p-5 rounded-[24px] border-4 border-white/50 border-dashed">
          <h2 className="text-white font-extrabold text-xl mb-4 drop-shadow-sm">Status Area</h2>
          <div className="flex flex-wrap gap-2">
            {tema.temaWarna === 'aman' ? (
               <span className="bg-[#84A982] text-white font-black px-4 py-2 rounded-full border-[3px] border-white shadow-sm text-sm uppercase tracking-wider flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 Semua Titik Aman
               </span>
            ) : (
              (dataHasil.area_terdeteksi && dataHasil.area_terdeteksi.length > 0) ? (
                dataHasil.area_terdeteksi.map((item, index) => (
                  <span key={index} className={`${tema.badgeBg} text-white font-black px-4 py-1.5 rounded-full border-[3px] border-white shadow-sm text-xs uppercase tracking-wider`}>
                    {item}
                  </span>
                ))
              ) : (
                 <span className={`${tema.badgeBg} text-white font-black px-4 py-2 rounded-full border-[3px] border-white shadow-sm text-sm uppercase tracking-wider`}>
                   Bercak Terdeteksi
                 </span>
              )
            )}
          </div>
        </div>

        {/* Dampak Kesehatan Dinamis */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center border-4 ${tema.borderColor} ${tema.textColor}`}>
              {tema.temaWarna === 'aman' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m19 14-4-4a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2-4 4"/><path d="M12 21V9"/><path d="m6 16-2 2a2 2 0 0 1-3-3l2-2"/><path d="M12 9V5"/><path d="m20 2-2 2"/><path d="m22 4-2-2"/></svg>
              )}
            </div>
            <h2 className="text-white font-extrabold text-2xl drop-shadow-sm">{tema.dampakTitle}</h2>
          </div>
          
          <ul className="space-y-3">
            {tema.dampak.map((dampakItem, idx) => (
              <li key={idx} className={`flex items-start gap-3 bg-white p-4 rounded-2xl border-4 ${tema.borderColor} shadow-sm transition-colors duration-500`}>
                <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border-2 border-white shadow-sm ${tema.badgeBg}`}></div>
                <span className="text-[#6C96C2] font-bold text-sm">{dampakItem}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tombol Lihat Detail */}
        <div className="mt-auto pt-4">
          <Link href="/detail-hasil" className="block">
            <button className="w-full bg-white border-[6px] border-[#78B5D6] py-4 rounded-full text-[#FF7AA2] font-black text-xl shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3">
              Detail & Faktor Risiko
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}