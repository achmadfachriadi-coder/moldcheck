// app/onboarding/[step]/page.tsx
'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Data konten onboarding
const onboardingContent: Record<string, any> = {
  "1": {
    title: "Deteksi Risiko AI",
    desc: "AI menganalisis kondisi kos Anda untuk mendeteksi risiko black mold secara akurat.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF7AA2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m18.5 4.5-3 3"/><path d="M22 12h-4"/><path d="m18.5 19.5-3-3"/><path d="M12 22v-4"/><path d="m5.5 19.5 3-3"/><path d="M2 12h4"/><path d="m5.5 4.5 3 3"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/></svg>
    ),
    nextPath: "/onboarding/2",
    btnText: "Selanjutnya",
  },
  "2": {
    title: "Upload Foto Kos",
    desc: "Foto dinding atau plafon Anda. Sistem akan memprosesnya dalam hitungan detik.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#78B5D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    ),
    nextPath: "/onboarding/3",
    btnText: "Selanjutnya",
  },
  "3": {
    title: "Solusi & Kesehatan",
    desc: "Dapatkan rekomendasi tindakan nyata untuk menjaga kamar tetap sehat dan bebas jamur.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#F9D66F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    nextPath: "/login",
    btnText: "Mulai Sekarang",
  }
};

export default function OnboardingPage({ params }: { params: Promise<{ step: string }> }) {
  // Unwrapping params menggunakan hook use() dari react
  const { step } = use(params);
  const data = onboardingContent[step];

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Skip Button */}
      <div className="absolute top-8 right-6 z-20">
        <Link href="/login" className="text-white font-bold opacity-80 hover:opacity-100 transition-opacity">
          Skip
        </Link>
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Ilustrasi Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-xl border-[6px] border-white mb-10 flex items-center justify-center">
           {data.icon}
        </div>

        {/* Teks Content */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-black text-white leading-tight drop-shadow-md">
            {data.title}
          </h1>
          <p className="text-white/90 font-bold text-lg leading-relaxed px-2">
            {data.desc}
          </p>
        </div>

        {/* Indikator Titik & Tombol */}
        <div className="w-full space-y-8">
            <div className="flex justify-center gap-3">
            {[1, 2, 3].map((num) => (
                <div 
                key={num} 
                className={`h-3 rounded-full transition-all duration-300 ${
                    num === parseInt(step) 
                    ? "w-10 bg-[#FF7AA2]" 
                    : "w-3 bg-white/50"
                }`}
                />
            ))}
            </div>

            <Link href={data.nextPath} className="w-full block">
                <button className="w-full bg-[#F9D66F] border-[6px] border-[#78B5D6] py-4 rounded-full text-[#FF7AA2] font-black text-xl shadow-[0_4px_0_#78B5D6] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                    {data.btnText}
                </button>
            </Link>
        </div>
      </div>
    </main>
  );
}