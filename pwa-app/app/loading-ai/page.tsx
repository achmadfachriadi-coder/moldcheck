// app/loading-ai/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoadingAIPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // --- SAKLAR PENAHAN UNTUK MENCEGAH DOUBLE UPLOAD ---
  const hasFetched = useRef(false);

  const loadingTexts = [
    "Mendeteksi kelembapan...",
    "Mendeteksi black mold...",
    "Menganalisis ventilasi...",
    "Menghitung skor risiko..."
  ];

  // FUNGSI API UNTUK MENGIRIM KE PYTHON & SUPABASE
  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true; 

    const kirimFotoKeBackend = async () => {
      try {
        const base64Data = localStorage.getItem('fotoKos');
        if (!base64Data) return;

        // Ubah kembali teks Base64 menjadi Blob/File asli
        const res = await fetch(base64Data);
        const blob = await res.blob();
        
        // Siapkan paket pengiriman
        const formData = new FormData();
        formData.append("file", blob, "foto-kamar.jpg");

        // 1. Tembak ke Python API! 🚀
        const pythonRes = await fetch("https://agreeing-untangled-pacifier.ngrok-free.dev/analisis-foto", {
          method: "POST",
          body: formData
        });
        
        const data = await pythonRes.json();
        console.log("Jawaban dari Python:", data);
        
        if (data.hasil_ai) {
          localStorage.setItem('hasilAnalisis', JSON.stringify(data.hasil_ai));

          // --- MULAI KODE UPLOAD & SIMPAN KE SUPABASE (DENGAN AUTH) ---
          console.log("Memulai proses upload ke Supabase...");
          
          const simpanKeDBSupabase = async () => {
            // A. Ambil informasi user yang sedang login saat ini
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
              console.warn("Peringatan: Tidak ada user yang login. Data disimpan tanpa user_id.");
            }

            // B. Buat nama file unik berdasarkan waktu saat ini
            const namaFileUnik = `kamar_${Date.now()}.jpg`;

            // C. Upload file foto ke Storage Supabase
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('foto_kamar')
              .upload(namaFileUnik, blob, {
                contentType: 'image/jpeg',
                upsert: false
              });

            if (uploadError) {
              console.error("Gagal upload foto ke Storage:", uploadError.message);
              return; 
            }

            // D. Ambil link URL publik dari foto yang baru diupload
            const { data: publicUrlData } = supabase
              .storage
              .from('foto_kamar')
              .getPublicUrl(namaFileUnik);
              
            const linkFotoAsli = publicUrlData.publicUrl;

            // E. Simpan hasil skor, link foto, user_id, DAN no_kamar ke tabel Database
            const { error: dbError } = await supabase
              .from('riwayat_deteksi')
              .insert([
                {
                  skor: data.hasil_ai.skor,
                  status_risiko: data.hasil_ai.status_risiko,
                  image_url: linkFotoAsli,
                  user_id: user ? user.id : null,
                  nomor_kamar: user?.user_metadata?.nomor_kamar || null // <-- INI DIA KABEL KETIGANYA!
                }
              ]);

            if (dbError) {
              console.error("Gagal menyimpan data ke tabel:", dbError.message);
            } else {
              console.log("Mantap! Foto dan Data terikat ke akunmu dengan sukses 🚀");
            }
          };
          
          await simpanKeDBSupabase();
          // --- AKHIR KODE SUPABASE ---
        }
      } catch (err) {
        console.error("Gagal terhubung ke Python API atau Supabase:", err);
      }
    };

    kirimFotoKeBackend();
  }, []);

  // Animasi Progress Bar
  useEffect(() => {
    if (progress >= 100) {
      router.push('/hasil-analisis');
      return; 
    }

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 100);

    return () => clearInterval(interval);
  }, [progress, router]);

  // Animasi Teks
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((oldIndex) => (oldIndex + 1) % loadingTexts.length);
    }, 1500);
    return () => clearInterval(textInterval);
  }, [loadingTexts.length]);

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans p-6 flex flex-col items-center justify-center border-[8px] border-[#78B5D6]">
      <div className="text-center w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-12 drop-shadow-sm leading-tight">AI sedang menganalisis<br/>kondisi kos...</h1>

        <div className="flex justify-center mb-12 relative">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-lg">
             <path d="M20 90 L100 30 L180 90" fill="none" stroke="#A61C40" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M30 85 L100 35 L170 85" fill="#C82A52" />
             <rect x="135" y="25" width="20" height="35" fill="#F9D66F" stroke="#333" strokeWidth="4"/>
             <rect x="130" y="20" width="30" height="8" fill="#F9D66F" stroke="#333" strokeWidth="4"/>
             <rect x="40" y="80" width="120" height="90" rx="15" fill="#F9D66F" stroke="#333" strokeWidth="4"/>
             <path d="M65 115 L80 125 L65 135" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M135 115 L120 125 L135 135" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
             <ellipse cx="60" cy="135" rx="8" ry="5" fill="#FF7AA2" opacity="0.6"/>
             <ellipse cx="140" cy="135" rx="8" ry="5" fill="#FF7AA2" opacity="0.6"/>
             <path d="M90 140 Q100 130 110 140 Q115 160 100 160 Q85 160 90 140" fill="#333"/>
             <path d="M95 150 Q100 145 105 150 Q105 158 100 158 Q95 158 95 150" fill="#FF7AA2"/>
           </svg>
        </div>

        <div className="space-y-4 text-left px-4 mb-16">
          {loadingTexts.map((text, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${index <= currentTextIndex ? 'bg-[#FF9B71]' : 'bg-[#E5B58E]'}`}>
                {index <= currentTextIndex && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 6 9 17l-5-5"/></svg>}
              </div>
              <span className={`font-bold text-lg transition-colors duration-500 ${index <= currentTextIndex ? 'text-[#84A982]' : 'text-[#84A982]/50'}`}>{text}</span>
            </div>
          ))}
        </div>

        <div className="px-4">
          <div className="h-6 w-full bg-[#E5B58E] rounded-full border-4 border-[#78B5D6] overflow-hidden p-0.5">
             <div className="h-full bg-[#FF7AA2] rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[#84A982] font-semibold text-sm mt-3">Please wait...</p>
        </div>
      </div>
    </main>
  );
}