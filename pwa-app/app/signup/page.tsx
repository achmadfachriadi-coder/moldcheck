// app/signup/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  
  // State untuk form & RBAC
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'penghuni' | 'admin'>('penghuni');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!email || !password) {
      alert("Email dan Password wajib diisi!");
      return;
    }

    // SIMULASI DATABASE & PENYIMPANAN SESI (SESSION)
    // Di aplikasi nyata, ini dikirim ke Supabase Auth.
    // Untuk prototipe, kita simpan role-nya di localStorage agar dikenali halaman lain.
    const userSession = {
      email: email,
      role: role,
      isLoggedIn: true
    };
    
    localStorage.setItem('userSession', JSON.stringify(userSession));
    
    // Arahkan langsung ke dashboard setelah berhasil daftar
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      
      {/* Wrapper seukuran HP (max-w-md) */}
      <div className="w-full max-w-md p-6 md:p-8 flex flex-col min-h-screen justify-center relative">
        
        {/* Tombol Back */}
        <Link href="/login" className="inline-flex items-center text-white font-bold text-sm mb-6 hover:opacity-70 transition-opacity w-fit bg-black/10 px-4 py-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
          Kembali ke Login
        </Link>

        {/* Header Section */}
        <div className="bg-white/40 p-6 rounded-[32px] border-4 border-white/50 border-dashed mb-8">
          <h1 className="text-4xl font-black text-white drop-shadow-sm mb-2">Daftar Akun</h1>
          <p className="text-[#6C96C2] font-bold text-sm leading-relaxed">
            Pilih peran Anda dan buat akun untuk mulai memantau kondisi kos.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignUp} className="space-y-6">
          
          {/* RBAC ROLE SELECTION (Toggling Button) */}
          <div className="space-y-2">
            <label className="text-white font-extrabold text-sm drop-shadow-sm ml-2">Peran Anda</label>
            <div className="flex gap-3 bg-white/30 p-2 rounded-full border-4 border-[#78B5D6]">
              <button
                type="button"
                onClick={() => setRole('penghuni')}
                className={`flex-1 py-3 rounded-full font-black text-sm transition-all duration-300 ${
                  role === 'penghuni' 
                    ? 'bg-[#FF7AA2] text-white shadow-sm scale-100' 
                    : 'bg-transparent text-[#6C96C2] hover:bg-white/40 scale-95'
                }`}
              >
                Anak Kos
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 rounded-full font-black text-sm transition-all duration-300 ${
                  role === 'admin' 
                    ? 'bg-[#F9D66F] text-[#FF9B71] shadow-sm scale-100' 
                    : 'bg-transparent text-[#6C96C2] hover:bg-white/40 scale-95'
                }`}
              >
                Penjaga Kos
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white font-extrabold text-sm drop-shadow-sm ml-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email" 
              className="w-full bg-white border-[4px] border-[#78B5D6] rounded-[24px] px-6 py-4 text-[#FF7AA2] font-bold placeholder-[#FFB6B9] focus:outline-none focus:border-[#FF9B71] transition-colors shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white font-extrabold text-sm drop-shadow-sm ml-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Buat password" 
              className="w-full bg-white border-[4px] border-[#78B5D6] rounded-[24px] px-6 py-4 text-[#FF7AA2] font-bold placeholder-[#FFB6B9] focus:outline-none focus:border-[#FF9B71] transition-colors shadow-sm"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#F9D66F] border-[6px] border-[#78B5D6] py-4 rounded-full text-[#FF7AA2] font-black text-xl shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Buat Akun
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}