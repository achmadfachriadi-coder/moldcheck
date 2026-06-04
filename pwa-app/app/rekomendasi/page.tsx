// app/rekomendasi/page.tsx
import Link from 'next/link';

export default function RekomendasiPage() {
  const recommendations = [
    {
      id: 1,
      title: "Perbaiki Ventilasi",
      desc: "Buka jendela minimal 20 menit setiap pagi agar sirkulasi udara membaik dan kelembapan menurun."
    },
    {
      id: 2,
      title: "Bersihkan Jamur / Black Mold",
      desc: "Gunakan cairan antijamur dan sikat lembut. Gunakan sarung tangan saat membersihkan."
    },
    {
      id: 3,
      title: "Kurangi Kelembapan",
      desc: "Gunakan dehumidifier atau silica gel untuk menyerap kelembapan."
    },
    {
      id: 4,
      title: "Gunakan Exhaust Fan",
      desc: "Nyalakan exhaust fan saat mandi dan memasak untuk membuang udara lembap."
    },
    {
      id: 5,
      title: "Jemur Perlengkapan",
      desc: "Jemur sprei, handuk, dan pakaian secara rutin di bawah sinar matahari."
    }
  ];

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans p-6 md:p-8 flex flex-col pb-10">
      
      {/* Header & Back Button */}
      <header className="mb-8 mt-2">
        <Link href="/detail-hasil" className="inline-flex items-center text-[#78B5D6] font-bold text-sm mb-6 hover:opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </Link>
        <h1 className="text-4xl font-extrabold text-white tracking-wide mb-1 drop-shadow-sm leading-tight max-w-xs">
          Rekomendasi untuk Anda.
        </h1>
      </header>

      {/* List Rekomendasi */}
      <div className="flex-1 space-y-5 mb-8">
        {recommendations.map((item) => (
          <div key={item.id} className="flex gap-4">
            {/* Nomor Bulat */}
            <div className="flex-shrink-0 w-8 h-8 bg-[#FF9B71] rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm mt-1">
              {item.id}
            </div>
            {/* Teks */}
            <div>
              <h3 className="text-[#6C96C2] font-black text-lg mb-1">{item.title}</h3>
              <p className="text-[#84A982] font-medium text-xs leading-relaxed max-w-[250px]">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol See All (SUDAH DISAMBUNGKAN KE EDUKASI) */}
      <div className="mt-auto flex justify-center">
        <Link href="/edukasi" className="w-2/3 block">
          <button className="w-full bg-[#F9D66F] border-[5px] border-[#78B5D6] py-3 rounded-full text-[#FF7AA2] font-black text-xl shadow-sm hover:scale-105 active:scale-95 transition-transform">
            See All
          </button>
        </Link>
      </div>

    </main>
  );
}