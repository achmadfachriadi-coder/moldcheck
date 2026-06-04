// app/edukasi/[id]/page.tsx
import Link from 'next/link';

const databaseArtikel: Record<string, any> = {
  "black-mold-101": {
    title: "Bahaya Black Mold terhadap Kesehatan",
    category: "Jamur",
    img: "https://placehold.co/600x400/FFB6B9/white?text=Jamur+Hitam",
    content: (
      <>
        <p className="mb-4">Black mold atau <em>Stachybotrys chartarum</em> bukan sekadar noda hitam kotor di dinding kos. Secara medis, jamur ini melepaskan mikotoksin (racun jamur) dan spora mikroskopis ke udara yang kita hirup setiap hari saat tidur atau mengerjakan tugas.</p>
        <p className="mb-4">Paparan jangka panjang terhadap spora ini dapat mengiritasi saluran pernapasan bagian atas. Gejala awalnya sering kali disalahartikan sebagai flu biasa atau alergi debu, seperti: hidung meler, bersin-bersin, mata gatal dan kemerahan, hingga batuk kering yang tidak kunjung sembuh.</p>
        <p>Bagi individu dengan riwayat asma atau sistem imun yang sedang menurun, paparan mikotoksin ini bisa memicu sesak napas yang serius. Oleh karena itu, deteksi dini sangat krusial sebelum sporanya menyebar ke pakaian dan kasur.</p>
      </>
    )
  },
  "ventilasi-baik": {
    title: "Cara Menjaga Ventilasi Kamar Kos Tetap Baik",
    category: "Ventilasi",
    img: "https://placehold.co/600x400/78B5D6/white?text=Udara+Segar",
    content: (
      <>
        <p className="mb-4">Kamar kos yang tertutup rapat (terutama yang menggunakan AC terus-menerus tanpa pernah membuka jendela) adalah habitat sempurna bagi jamur. Udara yang terperangkap akan meningkatkan konsentrasi kelembapan dan polutan dalam ruangan.</p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Aturan 30 Menit:</strong> Buka pintu atau jendela kamar minimal 30 menit setiap pagi hari. Sinar matahari pagi dan pergantian udara segar sangat ampuh membunuh bibit jamur.</li>
          <li><strong>Gunakan Exhaust Fan:</strong> Jika kamar kosmu tidak memiliki jendela luar (hanya ventilasi ke lorong dalam), <em>exhaust fan</em> wajib dinyalakan, terutama setelah mandi jika kamar mandi berada di dalam.</li>
          <li><strong>Jarak Perabotan:</strong> Jangan menempelkan lemari pakaian atau rak buku langsung ke dinding, beri jarak sekitar 5-10 cm agar udara bisa mengalir.</li>
        </ul>
      </>
    )
  },
  "kurangi-lembap": {
    title: "Tips Praktis Mengurangi Kelembapan di Kos",
    category: "Kelembapan",
    img: "https://placehold.co/600x400/84A982/white?text=Kamar+Kering",
    content: (
      <>
        <p className="mb-4">Tingkat kelembapan ideal untuk ruangan tertutup adalah antara 40% hingga 60%. Jika melebihi angka tersebut, jamur akan mulai berkembang biak hanya dalam waktu 24-48 jam.</p>
        <p className="mb-4">Beberapa langkah pencegahan praktis:</p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Dilarang Keras Menjemur di Dalam:</strong> Handuk basah atau cucian yang digantung di dalam kamar akan menguapkan air langsung ke udara ruangan.</li>
          <li><strong>Gunakan Serbuk Penyerap Air:</strong> Beli penyerap kelembapan berbahan kalsium klorida dan letakkan di sudut-sudut lembap seperti di dalam lemari baju.</li>
          <li><strong>Monitor Secara Real-Time:</strong> Memasang sensor DHT11/DHT22 sederhana di meja belajar bisa jadi solusi keren untuk memantau kelembapan secara langsung.</li>
        </ul>
      </>
    )
  },
  "kenali-tanda": {
    title: "Kenali Tanda Awal Dinding Mulai Berjamur",
    category: "Jamur",
    img: "https://placehold.co/600x400/F9D66F/white?text=Tanda+Awal",
    content: (
      <>
        <p className="mb-4">Sebelum <em>black mold</em> muncul sebagai bercak hitam pekat, ia mengirimkan beberapa sinyal peringatan dini.</p>
        <p className="mb-4"><strong>1. Perubahan Warna Samar:</strong> Perhatikan sudut-sudut langit-langit. Jika ada noda kekuningan, cokelat pudar, atau titik-titik hijau keabu-abuan, itu adalah fase awal koloni jamur.</p>
        <p className="mb-4"><strong>2. Cat Menggelembung atau Mengelupas:</strong> Kelembapan yang meresap ke dalam dinding akan mendorong cat ke luar, membuatnya menggelembung atau retak-retak.</p>
        <p><strong>3. Uji Bau:</strong> Jika kamu masuk ke kamar dan langsung mencium bau "apek" mirip bau tanah basah padahal kamar sudah bersih, itu adalah indikasi kuat adanya spora jamur.</p>
      </>
    )
  }
};

// PENTING: Menambahkan async dan Promise<{ id: string }> untuk standar Next.js 15/16
export default async function DetailArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  // Wajib di-await terlebih dahulu
  const { id } = await params;
  const artikel = databaseArtikel[id];

  if (!artikel) {
    return (
      <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black text-white mb-4">404</h1>
        <p className="text-[#84A982] font-bold mb-8">Artikel tidak ditemukan.</p>
        <Link href="/edukasi">
          <button className="bg-[#FF7AA2] text-white px-8 py-3 rounded-full font-black border-4 border-white shadow-sm hover:scale-105 transition-transform">
            Kembali
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center relative">
      <div className="w-full max-w-md min-h-screen bg-white/90 shadow-2xl relative pb-20">
        
        {/* Foto Hero */}
        <div className="w-full h-64 bg-gray-200 relative rounded-b-[40px] overflow-hidden border-b-[6px] border-[#78B5D6] z-10 shadow-sm">
          <img src={artikel.img} alt="Hero" className="w-full h-full object-cover" />
          
          <Link href="/edukasi" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full border-4 border-[#78B5D6] flex items-center justify-center shadow-sm text-[#FF7AA2] hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
        </div>

        {/* Konten Artikel */}
        <div className="p-8 -mt-6 relative z-20">
          <span className="bg-[#F9D66F] text-[#FF7AA2] text-xs font-black uppercase px-4 py-1.5 rounded-full border-2 border-white shadow-sm inline-block mb-4">
            {artikel.category}
          </span>
          
          <h1 className="text-3xl font-black text-[#6C96C2] leading-tight mb-6">
            {artikel.title}
          </h1>
          
          <div className="w-16 h-2 bg-[#FF7AA2] rounded-full mb-6"></div>
          
          <div className="text-neutral-600 font-medium leading-relaxed text-lg">
            {artikel.content}
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-8 mt-4">
          <div className="bg-[#FFF9E6] p-6 rounded-[24px] border-4 border-[#F9D66F] text-center">
            <h3 className="text-[#FF9B71] font-black mb-2">Cek Kondisi Kosmu Sekarang!</h3>
            <p className="text-sm text-[#84A982] font-semibold mb-4">Deteksi dini lebih baik daripada mengobati.</p>
            <Link href="/camera">
              <button className="bg-[#78B5D6] text-white px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform">
                Mulai Scan
              </button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}