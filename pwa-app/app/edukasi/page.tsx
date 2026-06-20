'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EdukasiPage() {
  const { t, lang } = useLanguage();
  const isEN = lang === 'EN';

  const categoryKeys = ["All", "Jamur", "Ventilasi", "Kelembapan"];
  const categoryLabels: Record<string, string> = isEN
    ? { All: "All", Jamur: "Mold", Ventilasi: "Ventilation", Kelembapan: "Humidity" }
    : { All: "All", Jamur: "Jamur", Ventilasi: "Ventilasi", Kelembapan: "Kelembapan" };

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const articles = [
    {
      id: "black-mold-101",
      title: isEN ? "Black Mold Dangers to Health" : "Bahaya Black Mold terhadap Kesehatan",
      category: "Jamur",
      img: "/images/black-mold.jpg"
    },
    {
      id: "ventilasi-baik",
      title: isEN ? "How to Keep Your Room's Ventilation Good" : "Cara Menjaga Ventilasi Kamar Kos Tetap Baik",
      category: "Ventilasi",
      img: "/images/ventilasi.jpg"
    },
    {
      id: "kurangi-lembap",
      title: isEN ? "Practical Tips to Reduce Humidity in Your Room" : "Tips Praktis Mengurangi Kelembapan di Kos",
      category: "Kelembapan",
      img: "/images/kelembapan.jpg"
    },
    {
      id: "kenali-tanda",
      title: isEN ? "Recognize Early Signs of Mold on Walls" : "Kenali Tanda Awal Dinding Mulai Berjamur",
      category: "Jamur",
      img: "/images/tanda-jamur.jpg"
    },
  ];

  const filteredArticles = articles.filter(art => {
    const matchCategory = activeCategory === "All" || art.category === activeCategory;
    const matchSearch = searchQuery === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      <div className="w-full max-w-md p-6 md:p-8 pb-32 flex flex-col min-h-screen">
        <header className="mb-6 mt-4">
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-1 drop-shadow-sm">{t.education}</h1>
          <p className="text-[#6C96C2] font-bold text-lg">{t.pelajariCara}</p>
        </header>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9D66F] border-4 border-[#78B5D6] rounded-full py-3 px-12 text-[#FF7AA2] placeholder-[#FF7AA2]/60 font-bold focus:outline-none"
          />
          <svg className="absolute left-4 top-4 text-[#FF7AA2] w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categoryKeys.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full font-bold border-[3px] whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#FF7AA2] text-white border-white' : 'bg-white/40 text-[#6C96C2] border-[#78B5D6]'}`}>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredArticles.length === 0 && (
            <p className="text-center text-white font-bold mt-8">{t.artikelTidakDitemukan}</p>
          )}
          {filteredArticles.map((art) => (
            <Link href={`/edukasi/${art.id}`} key={art.id} className="block group">
              <div className="bg-white rounded-[24px] p-3 flex gap-4 shadow-sm border-[4px] border-[#78B5D6] hover:scale-[1.02] hover:border-[#FF7AA2] transition-all">
                <div className="w-24 h-24 rounded-[16px] overflow-hidden border-2 border-[#78B5D6] shrink-0">
                  <img src={art.img} alt={art.category} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center pr-2">
                  <span className="text-[10px] font-black uppercase text-[#84A982] bg-[#BDD16D]/30 inline-block px-2 py-0.5 rounded-full mb-1 w-max">{categoryLabels[art.category]}</span>
                  <h3 className="text-[#FF7AA2] font-black text-sm leading-tight">{art.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 w-full max-w-md bg-[#F9D66F] border-t-4 border-[#78B5D6] flex justify-around p-4 rounded-t-[40px] shadow-lg z-50 left-1/2 -translate-x-1/2">
        <Link href="/dashboard" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></Link>
        <Link href="/history" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></Link>
        <Link href="/camera" className="bg-[#78B5D6] p-3 rounded-2xl -mt-10 border-4 border-white shadow-md text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></Link>
        <Link href="/edukasi" className="text-[#FF7AA2]"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></Link>
        <Link href="/profile" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></Link>
      </nav>
    </main>
  );
}