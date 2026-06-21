'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfilePage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const isEN = lang === 'EN';

  const [userName, setUserName] = useState("Memuat...");
  const [userEmail, setUserEmail] = useState("Memuat...");
  const [userInitial, setUserInitial] = useState("-");
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editNoKamar, setEditNoKamar] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        const nama = user.user_metadata?.nama || user.user_metadata?.full_name || user.email?.split('@')[0] || "Pengguna";
        const kamar = user.user_metadata?.nomor_kamar || "";
        setUserName(nama);
        setUserInitial(nama.charAt(0).toUpperCase());
        setEditNama(nama);
        setEditNoKamar(kamar);
      } else {
        setUserName("Tamu");
        setUserEmail("Silakan login terlebih dahulu");
        setUserInitial("?");
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    const { error } = await supabase.auth.updateUser({
      data: { nama: editNama, nomor_kamar: editNoKamar }
    });
    if (error) {
      setSaveMsg(t.gagalMenyimpan + error.message);
    } else {
      setUserName(editNama);
      setUserInitial(editNama.charAt(0).toUpperCase());
      setSaveMsg(t.berhasilDisimpan);
      setTimeout(() => { setSaveMsg(""); setShowEditPanel(false); }, 1500);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const faqItems = isEN ? [
    { q: "How do I scan for mold?", a: "Tap the camera icon at the bottom of the screen. Point your camera at a wall or ceiling corner and take a photo — the AI will analyze it automatically." },
    { q: "What does the risk level mean?", a: "\"Safe / Clean\" means no mold signs detected. \"Caution\" means there are early indicators. \"High Risk\" means significant mold presence — immediate action recommended." },
    { q: "How accurate is the AI detection?", a: "Our AI model is trained on mold datasets and achieves over 85% accuracy. However, it is still a screening tool — consult a professional for critical cases." },
    { q: "Why does my history show someone else's data?", a: "This should not happen — each account only sees their own scan history. If it occurs, please log out and log back in." },
    { q: "Can I use MoldCheck without internet?", a: "An internet connection is required for AI analysis and saving scan history to the server. The education page can be read offline once loaded." },
  ] : [
    { q: "Bagaimana cara melakukan scan jamur?", a: "Tekan ikon kamera di bagian bawah layar. Arahkan kamera ke sudut dinding atau langit-langit lalu ambil foto — AI akan menganalisis secara otomatis." },
    { q: "Apa arti level risiko yang ditampilkan?", a: "\"Aman / Bersih\" artinya tidak terdeteksi tanda jamur. \"Waspada\" berarti ada indikator awal. \"Tinggi\" berarti jamur sudah signifikan — segera ambil tindakan." },
    { q: "Seberapa akurat deteksi AI-nya?", a: "Model AI kami dilatih dengan dataset jamur dan mencapai akurasi di atas 85%. Namun ini tetap alat screening — konsultasikan ke profesional untuk kasus kritis." },
    { q: "Kenapa riwayat saya menampilkan data orang lain?", a: "Seharusnya tidak terjadi — setiap akun hanya melihat riwayat scan miliknya sendiri. Jika terjadi, coba logout dan login kembali." },
    { q: "Apakah MoldCheck bisa digunakan tanpa internet?", a: "Koneksi internet diperlukan untuk analisis AI dan menyimpan riwayat scan ke server. Halaman edukasi bisa dibaca offline setelah dimuat." },
  ];

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans p-6 pb-32">

      {/* Header Profile */}
      <div className="bg-white rounded-[40px] p-8 flex items-center gap-6 border-[6px] border-[#78B5D6] mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#FFF9E6] rounded-full opacity-50 border-4 border-[#F9D66F]"></div>
        <div className="w-24 h-24 bg-[#F9D66F] rounded-full border-[6px] border-[#BDD16D] flex items-center justify-center overflow-hidden z-10 shadow-inner shrink-0">
          <span className="text-4xl font-black text-[#FF7AA2]">{userInitial}</span>
        </div>
        <div className="z-10 overflow-hidden w-full">
          <h2 className="text-3xl font-black text-[#FF7AA2] truncate">{userName}</h2>
          <p className="text-[#6C96C2] font-extrabold text-sm mt-1 truncate">{userEmail}</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-3 mb-12">

        {/* Informasi Akun */}
        <div>
          <button
            onClick={() => { setShowEditPanel(!showEditPanel); setSaveMsg(""); }}
            className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/80 rounded-[24px] border-4 border-transparent hover:border-[#78B5D6] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-[#FF9B71]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="text-[#121212] font-black text-lg">{t.informasiAkun}</span>
            </div>
            <svg className={`w-6 h-6 text-[#121212] opacity-50 transition-transform duration-300 ${showEditPanel ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          {showEditPanel && (
            <div className="mt-2 bg-white rounded-[24px] border-4 border-[#78B5D6] p-5 space-y-4 shadow-sm">
              <div>
                <label className="text-[#84A982] font-black text-sm mb-1 block">{t.namaLabel}</label>
                <input type="text" value={editNama} onChange={(e) => setEditNama(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 border-2 border-[#78B5D6] rounded-xl p-3 font-bold focus:outline-none focus:border-[#6C96C2] focus:ring-2 focus:ring-[#6C96C2]/30 transition-all"
                  placeholder={t.namaPlaceholder} />
              </div>
              <div>
                <label className="text-[#84A982] font-black text-sm mb-1 block">{t.nomorKamarLabel}</label>
                <input type="text" value={editNoKamar} onChange={(e) => setEditNoKamar(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 border-2 border-[#FF7AA2] rounded-xl p-3 font-bold focus:outline-none focus:border-[#FF7AA2] focus:ring-2 focus:ring-[#FF7AA2]/30 transition-all"
                  placeholder={t.kamarPlaceholder} />
              </div>
              {saveMsg && (
                <p className={`text-sm font-bold text-center ${saveMsg.startsWith("Gagal") || saveMsg.startsWith("Failed") ? "text-red-500" : "text-[#84A982]"}`}>{saveMsg}</p>
              )}
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full bg-[#78B5D6] text-white font-black text-base py-3 rounded-xl border-4 border-white shadow-md hover:bg-[#6C96C2] transition-colors disabled:opacity-60">
                {saving ? t.menyimpan : t.simpanPerubahan}
              </button>
            </div>
          )}
        </div>

        {/* Bahasa toggle */}
        <div className="w-full flex items-center justify-between p-5 bg-white/40 rounded-[24px] border-4 border-transparent shadow-sm">
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-[#84A982]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="text-[#121212] font-black text-lg">{t.bahasa}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full border-2 border-[#78B5D6] p-1">
            <button onClick={() => setLang('ID')} className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'ID' ? 'bg-[#78B5D6] text-white' : 'text-[#6C96C2]'}`}>ID</button>
            <button onClick={() => setLang('EN')} className={`px-3 py-1 rounded-full text-xs font-black transition-all ${lang === 'EN' ? 'bg-[#FF7AA2] text-white' : 'text-[#6C96C2]'}`}>EN</button>
          </div>
        </div>

        {/* Pusat Bantuan */}
        <div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/80 rounded-[24px] border-4 border-transparent hover:border-[#78B5D6] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-[#FF7AA2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span className="text-[#121212] font-black text-lg">{t.pusatBantuan}</span>
            </div>
            <svg className={`w-6 h-6 text-[#121212] opacity-50 transition-transform duration-300 ${showHelp ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          {showHelp && (
            <div className="mt-2 bg-white rounded-[24px] border-4 border-[#FF7AA2]/40 p-4 shadow-sm space-y-2">
              <p className="text-[#FF7AA2] font-black text-xs uppercase px-1 mb-3">{isEN ? "Frequently Asked Questions" : "Pertanyaan yang Sering Diajukan"}</p>
              {faqItems.map((item, i) => (
                <div key={i} className="rounded-2xl border-2 border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-[#FFF0F5] transition-colors"
                  >
                    <span className="text-[#121212] font-bold text-sm pr-3">{item.q}</span>
                    <svg className={`w-5 h-5 text-[#FF7AA2] shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100">
                      <p className="text-[#84A982] font-semibold text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tentang */}
        <div>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/80 rounded-[24px] border-4 border-transparent hover:border-[#78B5D6] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-[#6C96C2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span className="text-[#121212] font-black text-lg">{t.tentang}</span>
            </div>
            <svg className={`w-6 h-6 text-[#121212] opacity-50 transition-transform duration-300 ${showAbout ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          {showAbout && (
            <div className="mt-2 bg-white rounded-[24px] border-4 border-[#6C96C2]/40 overflow-hidden shadow-sm">
              {/* Hero */}
              <div className="bg-gradient-to-br from-[#78B5D6] to-[#6C96C2] p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-[20px] border-4 border-white/50 flex items-center justify-center shadow-md mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#78B5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </div>
                <h3 className="text-white font-black text-2xl">MoldCheck</h3>
                <span className="text-white/70 text-xs font-semibold mt-1">v1.0.0 Beta</span>
              </div>
              {/* Info */}
              <div className="p-5 space-y-4">
                <p className="text-neutral-600 font-semibold text-sm leading-relaxed text-center">
                  {isEN
                    ? "MoldCheck is an AI-powered mobile app that helps boarding house residents detect mold early, before it becomes a health hazard."
                    : "MoldCheck adalah aplikasi mobile berbasis AI yang membantu penghuni kos mendeteksi jamur lebih awal, sebelum menjadi ancaman kesehatan."}
                </p>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {[
                    { label: isEN ? "Category" : "Kategori", value: isEN ? "Health & Smart Living" : "Kesehatan & Smart Living" },
                    { label: isEN ? "Platform" : "Platform", value: "PWA (Web App)" },
                    { label: isEN ? "AI Technology" : "Teknologi AI", value: "Computer Vision" },
                    { label: isEN ? "Developer" : "Pengembang", value: "Tim MoldCheck 2026" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[#84A982] font-bold text-sm">{row.label}</span>
                      <span className="text-[#6C96C2] font-black text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F0F7FF] rounded-2xl p-4 text-center border-2 border-[#78B5D6]/30">
                  <p className="text-[#6C96C2] font-black text-xs">
                    {isEN ? "Made with ❤️ for healthier boarding houses." : "Dibuat dengan ❤️ untuk kos yang lebih sehat."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Log Out */}
      <div className="flex justify-center">
        <button onClick={handleLogout}
          className="w-full max-w-[250px] bg-[#FF7AA2] hover:bg-[#ff6191] border-[6px] border-white py-4 rounded-[32px] text-white font-black text-2xl shadow-sm hover:scale-105 active:scale-95 transition-all block">
          {t.logOut}
        </button>
      </div>

      {/* Navigasi Bawah */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#F9D66F] border-t-4 border-[#78B5D6] flex justify-around p-4 rounded-t-[40px] shadow-lg z-50">
        <Link href="/dashboard" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></Link>
        <Link href="/history" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></Link>
        <Link href="/camera" className="bg-[#78B5D6] p-3 rounded-2xl -mt-10 border-4 border-white shadow-md text-white hover:scale-105 transition-transform"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></Link>
        <Link href="/edukasi" className="text-[#84A982] hover:text-[#FF7AA2] transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></Link>
        <Link href="/profile" className="text-[#FF7AA2]"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></Link>
      </nav>
    </main>
  );
}
