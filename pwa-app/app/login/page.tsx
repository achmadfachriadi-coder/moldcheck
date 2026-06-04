// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'penghuni' | 'admin'>('penghuni'); // State baru untuk RBAC
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesanError('');

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setPesanError(error.message);
      else {
        // Simpan Role ke localStorage agar bisa diakses di halaman Kamera/Dashboard
        localStorage.setItem('userRole', data.user?.user_metadata?.role || 'penghuni');
        router.push('/dashboard');
      }
    } else {
      // PROSES REGISTER DENGAN ROLE
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { role: role } } // Menyimpan 'penghuni' atau 'admin' di metadata
      });
      if (error) setPesanError(error.message);
      else {
        alert("Pendaftaran berhasil! Silakan login.");
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex items-center justify-center p-6 border-[8px] border-[#78B5D6]">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 border-4 border-[#78B5D6] shadow-xl relative overflow-hidden">
        
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-4xl font-black text-[#6C96C2] drop-shadow-sm mb-2">MoldCheck</h1>
          <p className="text-[#84A982] font-bold">{isLogin ? 'Masuk ke akunmu' : 'Buat akun baru'}</p>
        </div>

        {/* Tombol Role (Hanya muncul saat Register) */}
        {!isLogin && (
          <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setRole('penghuni')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg ${role === 'penghuni' ? 'bg-[#78B5D6] text-white' : 'text-gray-500'}`}
            >Anak Kos</button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg ${role === 'admin' ? 'bg-[#FF7AA2] text-white' : 'text-gray-500'}`}
            >Penjaga Kos</button>
          </div>
        )}

        {pesanError && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-xl text-red-700 text-sm font-bold text-center">
            {pesanError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border-2 border-[#78B5D6] rounded-xl p-3 font-bold"
            placeholder="nama@email.com"
          />
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border-2 border-[#78B5D6] rounded-xl p-3 font-bold"
            placeholder="Password (min 6 karakter)"
          />

          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#FF7AA2] text-white font-black text-lg p-4 rounded-xl border-4 border-[#333] shadow-[0_4px_0_#333] active:translate-y-1 active:shadow-none transition-all"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk 🚀' : 'Daftar Sebagai ' + role.toUpperCase())}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-[#84A982] font-bold text-sm hover:underline"
        >
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
    </main>
  );
}