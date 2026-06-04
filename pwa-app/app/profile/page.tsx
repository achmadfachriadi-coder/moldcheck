'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function ProfilePage() {
  const router = useRouter();
  
  // State untuk menyimpan data user dari database
  const [userName, setUserName] = useState("Memuat...");
  const [userEmail, setUserEmail] = useState("Memuat...");
  const [userInitial, setUserInitial] = useState("-");

  // Mengambil data user saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        // Ambil email dari data autentikasi
        setUserEmail(user.email || "Email tidak tersedia");
        
        // Ambil nama dari metadata (jika saat register kamu menyimpan nama)
        // Jika tidak ada, gunakan bagian depan email sebagai nama fallback
        const nama = user.user_metadata?.nama || user.user_metadata?.full_name || user.email?.split('@')[0] || "Pengguna";
        
        setUserName(nama);
        setUserInitial(nama.charAt(0).toUpperCase());
      } else {
        // Jika terdeteksi belum login
        setUserName("Tamu");
        setUserEmail("Silakan login terlebih dahulu");
        setUserInitial("?");
      }
    };

    fetchProfile();
  }, []);

  // Fungsi untuk Log Out sungguhan dari database Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Arahkan kembali ke halaman login
  };

  const menuItems = [
    { 
      title: "Informasi Akun", 
      icon: <svg className="w-6 h-6 text-[#FF9B71]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
    },
    { 
      title: "Pengaturan Notifikasi", 
      icon: <svg className="w-6 h-6 text-[#78B5D6]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> 
    },
    { 
      title: "Bahasa", 
      icon: <svg className="w-6 h-6 text-[#84A982]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, 
      extra: "Indonesia" 
    },
    { 
      title: "Pusat Bantuan", 
      icon: <svg className="w-6 h-6 text-[#FF7AA2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> 
    },
    { 
      title: "Tentang", 
      icon: <svg className="w-6 h-6 text-[#6C96C2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> 
    },
  ];

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans p-6 pb-32">
      
      {/* Header Profile */}
      <div className="bg-white rounded-[40px] p-8 flex items-center gap-6 border-[6px] border-[#78B5D6] mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#FFF9E6] rounded-full opacity-50 border-4 border-[#F9D66F]"></div>
        
        {/* Inisial Dinamis */}
        <div className="w-24 h-24 bg-[#F9D66F] rounded-full border-[6px] border-[#BDD16D] flex items-center justify-center overflow-hidden z-10 shadow-inner shrink-0">
          <span className="text-4xl font-black text-[#FF7AA2]">{userInitial}</span>
        </div>
        
        {/* Nama & Email Dinamis */}
        <div className="z-10 overflow-hidden w-full">
          <h2 className="text-3xl font-black text-[#FF7AA2] truncate">{userName}</h2>
          <p className="text-[#6C96C2] font-extrabold text-sm mt-1 truncate">{userEmail}</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-3 mb-12">
        {menuItems.map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/80 rounded-[24px] border-4 border-transparent hover:border-[#78B5D6] transition-all group shadow-sm">
            <div className="flex items-center gap-4">
               {item.icon}
               <span className="text-[#121212] font-black text-lg">{item.title}</span>
            </div>
            <div className="flex items-center gap-3">
               {item.extra && <span className="text-[#6C96C2] font-bold text-sm bg-white px-3 py-1 rounded-full border-2 border-[#78B5D6]">{item.extra}</span>}
               <svg className="w-6 h-6 text-[#121212] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        ))}
      </div>

      {/* Log Out Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleLogout}
          className="w-full max-w-[250px] bg-[#FF7AA2] hover:bg-[#ff6191] border-[6px] border-white py-4 rounded-[32px] text-white font-black text-2xl shadow-sm hover:scale-105 active:scale-95 transition-all block"
        >
          Log Out
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