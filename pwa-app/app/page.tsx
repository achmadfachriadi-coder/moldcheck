// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF7AA2]/30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="w-full max-w-md flex flex-col items-center z-10 text-center">
        
        {/* Logo/Icon Area */}
        <div className="bg-white p-6 rounded-[40px] shadow-xl border-[8px] border-[#78B5D6] mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF7AA2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>

        {/* Text Section */}
        <div className="space-y-4 mb-10">
          <h1 className="text-5xl font-black text-white leading-tight drop-shadow-md">
            Selamatkan <br/> Kamar Kosmu!
          </h1>
          <p className="text-[#FF7AA2] font-black text-lg bg-white/90 px-6 py-2 rounded-full inline-block shadow-sm">
            Deteksi Jamur Hitam secara Cepat
          </p>
          <p className="text-white/90 font-bold text-base leading-relaxed px-4">
            Lindungi paru-parumu! Gunakan AI untuk memindai setiap sudut kamar dan cegah pertumbuhan <em>Black Mold</em> sebelum terlambat.
          </p>
        </div>

        {/* CTA Button */}
        <Link href="/onboarding/1" className="w-full">
          <button className="w-full bg-[#F9D66F] border-[6px] border-[#78B5D6] py-5 rounded-full text-[#FF7AA2] font-black text-2xl shadow-[0_6px_0_#78B5D6] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
            Mulai Sekarang
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </Link>

        {/* Footer */}
        <p className="mt-8 text-white/60 font-bold text-sm">
          Aplikasi Proteksi Kamar Kos v1.0
        </p>

      </div>
    </main>
  );
}