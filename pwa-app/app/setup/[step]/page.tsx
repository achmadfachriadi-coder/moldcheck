// app/setup/[step]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SetupPage() {
  const params = useParams();
  const router = useRouter();
  const step = params.step as string;
  
  // State untuk menyimpan pilihan (agar tombol menyala saat diklik)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  // Fungsi untuk toggle pilihan
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Konfigurasi Konten Setiap Langkah
  const setupData: Record<string, any> = {
    "1": {
      title: "Who are you?",
      desc: "Pilih peran yang sesuai",
      type: "single-choice",
      options: ["Anak Kos", "Ibu/Bapak Kos", "Pengelola Gedung"],
      nextPath: "/setup/2",
    },
    "2": {
      title: "Room Number?",
      desc: "Masukkan nomor kamar yang ingin dipantau",
      type: "text",
      options: [],
      nextPath: "/setup/3",
    },
    "3": {
      title: "Riwayat Penyakit?",
      desc: "Apakah Anda memiliki riwayat penyakit pernapasan?",
      type: "multi-choice",
      options: ["Asma", "Sinusitis", "Alergi Debu", "Tidak Ada"],
      nextPath: "/setup/4",
    },
    "4": {
      title: "Area Rawan Lembap?",
      desc: "Area kos mana yang sering mengalami kelembapan?",
      type: "multi-choice",
      options: ["Kamar Mandi", "Dapur", "Dekat Jendela", "Plafon Bocor"],
      nextPath: "/dashboard", // Selesai setup, masuk ke Dashboard
    }
  };

  const currentData = setupData[step];

  // Jika langkah tidak ditemukan
  if (!currentData) return <div className="p-10 text-center">Halaman tidak ditemukan</div>;

  // Fungsi Lanjut ke Halaman Berikutnya
  const handleNext = () => {
    router.push(currentData.nextPath);
  };

  // Menentukan apakah tombol Next bisa diklik
  const isNextDisabled = currentData.type === 'text' 
    ? inputText.trim() === '' 
    : selectedOptions.length === 0;

  return (
    <main className="min-h-screen bg-appBg text-appText font-sans p-6 md:p-10 flex flex-col justify-between">
      
      {/* Header & Indikator Progress */}
      <div className="space-y-8 pt-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <div 
              key={num} 
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                num <= parseInt(step) ? "bg-appAccent" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-neutral-900">{currentData.title}</h1>
          <p className="text-neutral-500 text-sm">{currentData.desc}</p>
        </div>
      </div>

      {/* Area Input Interaktif */}
      <div className="flex-1 mt-10 space-y-4">
        {currentData.type === 'text' ? (
          <input 
            type="text" 
            placeholder="Contoh: A-12, B-05" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-appPrimary shadow-sm"
          />
        ) : (
          currentData.options.map((opt: string, index: number) => {
            const isSelected = selectedOptions.includes(opt);
            return (
              <button
                key={index}
                onClick={() => toggleOption(opt)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                  isSelected 
                    ? "bg-[#FFF9E6] border-appPrimary shadow-sm" 
                    : "bg-white border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span className={`font-medium ${isSelected ? "text-neutral-900" : "text-neutral-600"}`}>
                  {opt}
                </span>
                
                {/* Checkmark Icon */}
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? "bg-appPrimary border-appPrimary text-white" : "border-neutral-300"
                }`}>
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Tombol Lanjut */}
      <div className="pt-8">
        <button 
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            isNextDisabled 
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" 
              : "bg-appPrimary hover:bg-appPrimaryHover text-neutral-900 shadow-sm active:scale-[0.98]"
          }`}
        >
          {step === "4" ? "Selesai & Masuk" : "Lanjut"}
        </button>
      </div>

    </main>
  );
}