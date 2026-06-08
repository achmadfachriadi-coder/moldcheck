// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'penghuni' | 'admin'>('penghuni');
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
        // Baca role dari Supabase metadata
        const userRole = data.user?.user_metadata?.role || 'penghuni';
        localStorage.setItem('userRole', userRole);

        // Arahkan ke halaman yang sesuai
        if (userRole === 'admin') {
          router.push('/dashboard-admin');
        } else {
          router.push('/camera'); // Arahkan penghuni ke halaman kamera
        }
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { role: role } }
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
    <main className="min-h-screen bg-[#BDD16D] font-sans flex items-center justify-center p-4 sm:p-6 border-[6px] sm:border-[8px] border-[#78B5D6]">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 border-4 border-[#78B5D6] shadow-xl relative overflow-hidden">
        
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#6C96C2] drop-shadow-sm mb-2">MoldCheck</h1>
          <p className="text-[#84A982] text-sm sm:text-base font-bold">{isLogin ? 'Masuk ke akunmu' : 'Buat akun baru'}</p>
        </div>

        {!isLogin && (
          <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setRole('penghuni')}
              className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-lg transition-colors ${role === 'penghuni' ? 'bg-[#78B5D6] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            >Anak Kos</button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-lg transition-colors ${role === 'admin' ? 'bg-[#FF7AA2] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            >Penjaga Kos</button>
          </div>
        )}

        {pesanError && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-xl text-red-700 text-sm font-bold text-center">
            {pesanError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 text-base sm:text-lg border-2 border-[#78B5D6] rounded-xl p-3 sm:p-4 font-bold focus:outline-none focus:border-[#6C96C2] focus:ring-2 focus:ring-[#6C96C2]/30 transition-all"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 text-base sm:text-lg border-2 border-[#78B5D6] rounded-xl p-3 sm:p-4 font-bold focus:outline-none focus:border-[#6C96C2] focus:ring-2 focus:ring-[#6C96C2]/30 transition-all"
              placeholder="Password (min 6 huruf)"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full mt-2 bg-[#FF7AA2] text-white font-black text-lg p-4 rounded-xl border-4 border-[#333] shadow-[0_4px_0_#333] active:translate-y-1 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk 🚀' : 'Daftar Sebagai ' + role.toUpperCase())}
          </button>
        </form>

        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-[#84A982] font-bold text-sm sm:text-base hover:text-[#6C96C2] transition-colors"
        >
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
    </main>
  );
}