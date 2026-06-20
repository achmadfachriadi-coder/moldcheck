'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'ID' | 'EN';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations['ID'];
}

export const translations = {
  ID: {
    // Dashboard
    risikoHariIni: "Risiko kos hari ini",
    belumScan: "Belum Scan",
    details: "Details",
    quickActions: "Quick Actions",
    deteksiKamera: "Deteksi Kamera",
    checklistFisik: "Checklist Fisik",
    insightAI: "Insight AI",
    analisisKondisi: "Analisis kondisi kosmu",
    belumAdaData: "Belum ada data scan",
    belumAdaDataDesc: "Lakukan scan pertamamu untuk mendapatkan analisis AI tentang kondisi kosmu.",
    mulaiScan: "Mulai Scan Sekarang",
    rekomendasiCepat: "Rekomendasi Cepat",
    tipsHarian: "Tips Harian Kamar Sehat",
    // Tips
    tip1Title: "Buka Jendela Setiap Pagi",
    tip1Desc: "Minimal 30 menit agar udara segar masuk dan spora jamur tidak menumpuk.",
    tip2Title: "Jangan Jemur Pakaian di Dalam",
    tip2Desc: "Handuk & cucian basah di dalam kamar meningkatkan kelembapan hingga 30%.",
    tip3Title: "Cek Sudut & Langit-Langit Rutin",
    tip3Desc: "Periksa setiap minggu. Noda kuning atau bau apek = tanda awal jamur muncul.",
    tip4Title: "Beri Jarak Lemari dari Dinding",
    tip4Desc: "Minimal 5–10 cm agar udara bisa mengalir dan dinding tidak lembap tersembunyi.",
    tip5Title: "Gunakan Penyerap Kelembapan",
    tip5Desc: "Taruh silica gel atau kalsium klorida di sudut kamar dan dalam lemari pakaian.",
    // History
    riwayat: "Riwayat",
    catatanKondisi: "Catatan kondisi kamar kos Anda.",
    memuatData: "Memuat data...",
    belumAdaRiwayat: "Belum ada riwayat.",
    cobaDeteksi: "Coba lakukan deteksi pertamamu sekarang!",
    idDeteksi: "ID Deteksi",
    // Edukasi
    education: "Education",
    pelajariCara: "Pelajari cara menjaga kos sehat.",
    search: "Search...",
    artikelTidakDitemukan: "Artikel tidak ditemukan.",
    // Profile
    informasiAkun: "Informasi Akun",
    bahasa: "Bahasa",
    pusatBantuan: "Pusat Bantuan",
    tentang: "Tentang",
    namaLabel: "Nama",
    nomorKamarLabel: "Nomor Kamar",
    namaPlaceholder: "Nama kamu",
    kamarPlaceholder: "Cth: B-04",
    simpanPerubahan: "Simpan Perubahan",
    menyimpan: "Menyimpan...",
    berhasilDisimpan: "Berhasil disimpan!",
    gagalMenyimpan: "Gagal menyimpan: ",
    logOut: "Log Out",
  },
  EN: {
    // Dashboard
    risikoHariIni: "Today's room risk",
    belumScan: "Not Yet Scanned",
    details: "Details",
    quickActions: "Quick Actions",
    deteksiKamera: "Camera Scan",
    checklistFisik: "Physical Checklist",
    insightAI: "AI Insight",
    analisisKondisi: "Analysis of your room condition",
    belumAdaData: "No scan data yet",
    belumAdaDataDesc: "Do your first scan to get AI analysis about your room condition.",
    mulaiScan: "Start Scanning Now",
    rekomendasiCepat: "Quick Recommendations",
    tipsHarian: "Daily Healthy Room Tips",
    // Tips
    tip1Title: "Open Windows Every Morning",
    tip1Desc: "At least 30 minutes to let fresh air in and prevent mold spores from accumulating.",
    tip2Title: "Don't Dry Clothes Indoors",
    tip2Desc: "Wet towels & laundry inside the room increase humidity by up to 30%.",
    tip3Title: "Check Corners & Ceiling Regularly",
    tip3Desc: "Check weekly. Yellow stains or musty smell = early signs of mold.",
    tip4Title: "Keep Furniture Away from Walls",
    tip4Desc: "At least 5–10 cm so air can circulate and hidden dampness is prevented.",
    tip5Title: "Use Moisture Absorbers",
    tip5Desc: "Place silica gel or calcium chloride in room corners and inside wardrobes.",
    // History
    riwayat: "History",
    catatanKondisi: "Your room condition records.",
    memuatData: "Loading data...",
    belumAdaRiwayat: "No history yet.",
    cobaDeteksi: "Try doing your first detection now!",
    idDeteksi: "Detection ID",
    // Edukasi
    education: "Education",
    pelajariCara: "Learn how to keep your room healthy.",
    search: "Search...",
    artikelTidakDitemukan: "No articles found.",
    // Profile
    informasiAkun: "Account Info",
    bahasa: "Language",
    pusatBantuan: "Help Center",
    tentang: "About",
    namaLabel: "Name",
    nomorKamarLabel: "Room Number",
    namaPlaceholder: "Your name",
    kamarPlaceholder: "E.g: B-04",
    simpanPerubahan: "Save Changes",
    menyimpan: "Saving...",
    berhasilDisimpan: "Saved successfully!",
    gagalMenyimpan: "Failed to save: ",
    logOut: "Log Out",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ID',
  setLang: () => {},
  t: translations['ID'],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ID');

  useEffect(() => {
    const saved = localStorage.getItem('moldcheck_lang') as Lang | null;
    if (saved === 'ID' || saved === 'EN') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('moldcheck_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
