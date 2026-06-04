// app/checklist/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Data pertanyaan
const questions = [
  { id: 'q1', category: 'fisik', text: 'Dinding lembap?' },
  { id: 'q2', category: 'fisik', text: 'Ada black mold / jamur?' },
  { id: 'q3', category: 'fisik', text: 'Ada rembesan air?' },
  { id: 'q4', category: 'fisik', text: 'Cat mengelupas?' },
  { id: 'q5', category: 'udara', text: 'Ventilasi buruk?' },
  { id: 'q6', category: 'udara', text: 'Ruangan terasa pengap?' },
];

export default function ChecklistPage() {
  // State untuk menyimpan jawaban (Yes/No)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // Hitung apakah semua pertanyaan sudah dijawab
  const isAllAnswered = Object.keys(answers).length === questions.length;

  const handleNext = () => {
    // Simpan data checklist ke localStorage (bisa dipakai untuk analisis gabungan nanti)
    localStorage.setItem('checklistKamar', JSON.stringify(answers));
    router.push('/camera');
  };

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      
      {/* Wrapper seukuran HP */}
      <div className="w-full max-w-md p-6 md:p-8 flex flex-col min-h-screen pb-10 relative">
        
        {/* Header & Back Button */}
        <header className="mb-8 mt-2 flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="w-12 h-12 bg-white rounded-full border-4 border-[#78B5D6] flex items-center justify-center shadow-sm text-[#FF7AA2] hover:scale-105 transition-transform shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-sm leading-tight">
              Checklist Fisik
            </h1>
            <p className="text-[#6C96C2] font-bold text-sm">
              Evaluasi kondisi awal kamar.
            </p>
          </div>
        </header>

        {/* Form Area */}
        <div className="flex-1 space-y-8">
          
          {/* KONDISI FISIK */}
          <div>
            {/* Label Kategori */}
            <div className="bg-white inline-block px-5 py-2 rounded-full mb-4 shadow-sm border-2 border-white/50">
              <h2 className="text-[#FF7AA2] font-black text-base uppercase tracking-wider">Kondisi Fisik</h2>
            </div>
            
            <div className="space-y-4 px-1">
              {questions.filter(q => q.category === 'fisik').map((q) => (
                <div key={q.id} className="flex items-center justify-between bg-white/40 p-3 rounded-2xl border-2 border-white/50 border-dashed">
                  <span className="text-white font-extrabold text-sm w-3/5 drop-shadow-sm">{q.text}</span>
                  <div className="flex gap-2 w-2/5 justify-end">
                    <button 
                      onClick={() => handleAnswer(q.id, 'yes')}
                      className={`px-4 py-1.5 rounded-full text-xs font-black border-[3px] transition-colors ${
                        answers[q.id] === 'yes' 
                          ? 'bg-[#FF7AA2] border-[#FF7AA2] text-white shadow-inner' 
                          : 'bg-white border-[#78B5D6] text-[#FF7AA2] hover:bg-[#f0f0f0]'
                      }`}
                    >
                      YA
                    </button>
                    <button 
                      onClick={() => handleAnswer(q.id, 'no')}
                      className={`px-4 py-1.5 rounded-full text-xs font-black border-[3px] transition-colors ${
                        answers[q.id] === 'no' 
                          ? 'bg-[#78B5D6] border-[#78B5D6] text-white shadow-inner' 
                          : 'bg-white border-[#78B5D6] text-[#FF7AA2] hover:bg-[#f0f0f0]'
                      }`}
                    >
                      TDK
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KONDISI UDARA */}
          <div>
            <div className="bg-white inline-block px-5 py-2 rounded-full mb-4 shadow-sm border-2 border-white/50">
              <h2 className="text-[#FF7AA2] font-black text-base uppercase tracking-wider">Kondisi Udara</h2>
            </div>
            
            <div className="space-y-4 px-1">
              {questions.filter(q => q.category === 'udara').map((q) => (
                <div key={q.id} className="flex items-center justify-between bg-white/40 p-3 rounded-2xl border-2 border-white/50 border-dashed">
                  <span className="text-white font-extrabold text-sm w-3/5 drop-shadow-sm">{q.text}</span>
                  <div className="flex gap-2 w-2/5 justify-end">
                    <button 
                      onClick={() => handleAnswer(q.id, 'yes')}
                      className={`px-4 py-1.5 rounded-full text-xs font-black border-[3px] transition-colors ${
                        answers[q.id] === 'yes' 
                          ? 'bg-[#FF7AA2] border-[#FF7AA2] text-white shadow-inner' 
                          : 'bg-white border-[#78B5D6] text-[#FF7AA2] hover:bg-[#f0f0f0]'
                      }`}
                    >
                      YA
                    </button>
                    <button 
                      onClick={() => handleAnswer(q.id, 'no')}
                      className={`px-4 py-1.5 rounded-full text-xs font-black border-[3px] transition-colors ${
                        answers[q.id] === 'no' 
                          ? 'bg-[#78B5D6] border-[#78B5D6] text-white shadow-inner' 
                          : 'bg-white border-[#78B5D6] text-[#FF7AA2] hover:bg-[#f0f0f0]'
                      }`}
                    >
                      TDK
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Tombol Next (Terkunci jika belum dijawab semua) */}
        <div className="mt-10 flex justify-center pb-4">
          <button 
            onClick={handleNext}
            disabled={!isAllAnswered}
            className={`w-full border-[6px] py-4 rounded-full font-black text-2xl shadow-sm transition-transform flex items-center justify-center gap-3 ${
              isAllAnswered 
                ? 'bg-[#F9D66F] border-[#78B5D6] text-[#FF7AA2] hover:scale-105 active:scale-95' 
                : 'bg-[#e0e0e0] border-[#c0c0c0] text-[#a0a0a0] cursor-not-allowed'
            }`}
          >
            {isAllAnswered ? 'Lanjut ke Kamera' : 'Jawab Semua Dulu'}
            {isAllAnswered && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}