'use client';

import Link from 'next/link';
import { use } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Article = {
  title: string;
  titleEN: string;
  category: string;
  categoryEN: string;
  img: string;
  content: React.ReactNode;
  contentEN: React.ReactNode;
};

const databaseArtikel: Record<string, Article> = {
  "black-mold-101": {
    title: "Bahaya Black Mold terhadap Kesehatan",
    titleEN: "Black Mold Dangers to Health",
    category: "Jamur",
    categoryEN: "Mold",
    img: "/images/black-mold.jpg",
    content: (
      <>
        <p className="mb-4">Black mold atau <em>Stachybotrys chartarum</em> bukan sekadar noda hitam kotor di dinding kos. Secara medis, jamur ini melepaskan mikotoksin (racun jamur) dan spora mikroskopis ke udara yang kita hirup setiap hari saat tidur atau mengerjakan tugas.</p>
        <p className="mb-4">Paparan jangka panjang terhadap spora ini dapat mengiritasi saluran pernapasan bagian atas. Gejala awalnya sering kali disalahartikan sebagai flu biasa atau alergi debu, seperti: hidung meler, bersin-bersin, mata gatal dan kemerahan, hingga batuk kering yang tidak kunjung sembuh.</p>
        <p>Bagi individu dengan riwayat asma atau sistem imun yang sedang menurun, paparan mikotoksin ini bisa memicu sesak napas yang serius. Oleh karena itu, deteksi dini sangat krusial sebelum sporanya menyebar ke pakaian dan kasur.</p>
      </>
    ),
    contentEN: (
      <>
        <p className="mb-4">Black mold or <em>Stachybotrys chartarum</em> is not just a dirty black stain on your room wall. Medically, this fungus releases mycotoxins (mold toxins) and microscopic spores into the air we breathe every day while sleeping or doing tasks.</p>
        <p className="mb-4">Long-term exposure to these spores can irritate the upper respiratory tract. The initial symptoms are often mistaken for a common cold or dust allergy, such as: runny nose, sneezing, itchy and red eyes, and a persistent dry cough.</p>
        <p>For individuals with a history of asthma or a weakened immune system, exposure to mycotoxins can trigger serious breathing difficulties. Therefore, early detection is crucial before the spores spread to clothing and mattresses.</p>
      </>
    ),
  },
  "ventilasi-baik": {
    title: "Cara Menjaga Ventilasi Kamar Kos Tetap Baik",
    titleEN: "How to Keep Your Room's Ventilation Good",
    category: "Ventilasi",
    categoryEN: "Ventilation",
    img: "/images/ventilasi.jpg",
    content: (
      <>
        <p className="mb-4">Kamar kos yang tertutup rapat (terutama yang menggunakan AC terus-menerus tanpa pernah membuka jendela) adalah habitat sempurna bagi jamur. Udara yang terperangkap akan meningkatkan konsentrasi kelembapan dan polutan dalam ruangan.</p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Aturan 30 Menit:</strong> Buka pintu atau jendela kamar minimal 30 menit setiap pagi hari. Sinar matahari pagi dan pergantian udara segar sangat ampuh membunuh bibit jamur.</li>
          <li><strong>Gunakan Exhaust Fan:</strong> Jika kamar kosmu tidak memiliki jendela luar (hanya ventilasi ke lorong dalam), <em>exhaust fan</em> wajib dinyalakan, terutama setelah mandi jika kamar mandi berada di dalam.</li>
          <li><strong>Jarak Perabotan:</strong> Jangan menempelkan lemari pakaian atau rak buku langsung ke dinding, beri jarak sekitar 5-10 cm agar udara bisa mengalir.</li>
        </ul>
      </>
    ),
    contentEN: (
      <>
        <p className="mb-4">A tightly sealed room (especially one using air conditioning continuously without ever opening the windows) is the perfect habitat for mold. Trapped air will increase humidity concentration and pollutants inside the room.</p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>The 30-Minute Rule:</strong> Open the door or window for at least 30 minutes every morning. Morning sunlight and fresh air exchange are very effective at killing mold seeds.</li>
          <li><strong>Use an Exhaust Fan:</strong> If your room has no outer window (only ventilation to the inner corridor), an exhaust fan must be turned on, especially after showering if the bathroom is inside.</li>
          <li><strong>Furniture Spacing:</strong> Don't place wardrobes or bookshelves directly against the wall — leave about 5-10 cm so air can flow through.</li>
        </ul>
      </>
    ),
  },
  "kurangi-lembap": {
    title: "Tips Praktis Mengurangi Kelembapan di Kos",
    titleEN: "Practical Tips to Reduce Humidity in Your Room",
    category: "Kelembapan",
    categoryEN: "Humidity",
    img: "/images/kelembapan.jpg",
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
    ),
    contentEN: (
      <>
        <p className="mb-4">The ideal humidity level for an enclosed room is between 40% and 60%. If it exceeds this, mold will start to multiply within just 24-48 hours.</p>
        <p className="mb-4">Some practical prevention steps:</p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Never Dry Clothes Indoors:</strong> Wet towels or laundry hung inside the room will evaporate water directly into the room air.</li>
          <li><strong>Use Moisture Absorbers:</strong> Buy calcium chloride-based moisture absorbers and place them in damp corners such as inside wardrobes.</li>
          <li><strong>Monitor in Real-Time:</strong> Installing a simple DHT11/DHT22 sensor on your study desk can be a great solution for monitoring humidity directly.</li>
        </ul>
      </>
    ),
  },
  "kenali-tanda": {
    title: "Kenali Tanda Awal Dinding Mulai Berjamur",
    titleEN: "Recognize Early Signs of Mold on Walls",
    category: "Jamur",
    categoryEN: "Mold",
    img: "/images/tanda-jamur.jpg",
    content: (
      <>
        <p className="mb-4">Sebelum <em>black mold</em> muncul sebagai bercak hitam pekat, ia mengirimkan beberapa sinyal peringatan dini.</p>
        <p className="mb-4"><strong>1. Perubahan Warna Samar:</strong> Perhatikan sudut-sudut langit-langit. Jika ada noda kekuningan, cokelat pudar, atau titik-titik hijau keabu-abuan, itu adalah fase awal koloni jamur.</p>
        <p className="mb-4"><strong>2. Cat Menggelembung atau Mengelupas:</strong> Kelembapan yang meresap ke dalam dinding akan mendorong cat ke luar, membuatnya menggelembung atau retak-retak.</p>
        <p><strong>3. Uji Bau:</strong> Jika kamu masuk ke kamar dan langsung mencium bau "apek" mirip bau tanah basah padahal kamar sudah bersih, itu adalah indikasi kuat adanya spora jamur.</p>
      </>
    ),
    contentEN: (
      <>
        <p className="mb-4">Before <em>black mold</em> appears as dense black patches, it sends several early warning signals.</p>
        <p className="mb-4"><strong>1. Subtle Color Changes:</strong> Pay attention to the ceiling corners. Yellowish stains, faded brown, or grayish-green dots are the early phases of a mold colony.</p>
        <p className="mb-4"><strong>2. Bubbling or Peeling Paint:</strong> Moisture seeping into the wall will push the paint outward, causing it to bubble or crack.</p>
        <p><strong>3. The Smell Test:</strong> If you walk into your room and immediately smell a "musty" odor similar to wet soil even though the room is clean, that is a strong indication of mold spores.</p>
      </>
    ),
  }
};

export default function DetailArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLanguage();
  const isEN = lang === 'EN';
  const artikel = databaseArtikel[id];

  if (!artikel) {
    return (
      <main className="min-h-screen bg-[#BDD16D] font-sans flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black text-white mb-4">404</h1>
        <p className="text-[#84A982] font-bold mb-8">{isEN ? "Article not found." : "Artikel tidak ditemukan."}</p>
        <Link href="/edukasi">
          <button className="bg-[#FF7AA2] text-white px-8 py-3 rounded-full font-black border-4 border-white shadow-sm hover:scale-105 transition-transform">
            {isEN ? "Back" : "Kembali"}
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
            {isEN ? artikel.categoryEN : artikel.category}
          </span>

          <h1 className="text-3xl font-black text-[#6C96C2] leading-tight mb-6">
            {isEN ? artikel.titleEN : artikel.title}
          </h1>

          <div className="w-16 h-2 bg-[#FF7AA2] rounded-full mb-6"></div>

          <div className="text-neutral-600 font-medium leading-relaxed text-lg">
            {isEN ? artikel.contentEN : artikel.content}
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-8 mt-4">
          <div className="bg-[#FFF9E6] p-6 rounded-[24px] border-4 border-[#F9D66F] text-center">
            <h3 className="text-[#FF9B71] font-black mb-2">
              {isEN ? "Check Your Room Now!" : "Cek Kondisi Kosmu Sekarang!"}
            </h3>
            <p className="text-sm text-[#84A982] font-semibold mb-4">
              {isEN ? "Early detection is better than curing." : "Deteksi dini lebih baik daripada mengobati."}
            </p>
            <Link href="/camera">
              <button className="bg-[#78B5D6] text-white px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform">
                {isEN ? "Start Scan" : "Mulai Scan"}
              </button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
