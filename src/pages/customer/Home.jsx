import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/customer/Navbar';
import { supabase } from '../../lib/supabase';
import { 
  Leaf, 
  Hammer, 
  Palette, 
  HeartHandshake, 
  Recycle, 
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Star 
} from 'lucide-react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

// Komponen Animasi Angka 
const AnimatedStat = ({ end, suffix, label, decimals = 0, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, { duration: duration, ease: "easeOut" });
      return controls.stop; 
    }
  }, [isInView, end, duration, count]);

  return (
    <div ref={ref} className="p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#2C2420] tracking-tight flex items-center">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="text-sm font-medium text-[#7A6F66]">
        {label}
      </div>
    </div>
  );
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error.message);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen flex flex-col font-sans antialiased text-[#2C2420] scroll-smooth">
      <Navbar />

      <main className="flex-grow">
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="max-w-[1200px] mx-auto px-6 pt-10 md:pt-14 pb-20 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-5"
          >
            <div className="inline-block px-4 py-1.5 mb-1 rounded-full border border-[#D9CFC4] bg-[#F4EFEB] text-[#8C6239] text-xs font-semibold tracking-widest uppercase">
              Studio Kerajinan & Kriya
            </div>
            
            {/* Ukuran font diturunkan jadi 4xl/5xl biar lebih proporsional dan elegan */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2420] tracking-tight leading-tight">
              Keindahan abadi yang lahir dari tangan pengrajin.
            </h1>
            
            {/* Teks paragraf juga dikecilin sedikit biar ngimbangin judul */}
            <p className="text-[#5C534C] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Setiap karya yang kami hasilkan bukan sekadar barang, melainkan cerita, dedikasi, dan apresiasi terhadap material alam yang otentik.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button 
                onClick={() => document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#2C2420] text-[#FDFBF7] px-8 py-3 rounded-full font-medium text-sm hover:bg-[#4A3F38] transition-colors shadow-sm"
              >
                Jelajahi Karya
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="border-y border-[#EAE3DB] bg-[#F8F5F0]">
          <div className="max-w-[1000px] mx-auto px-6 py-10 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#D9CFC4]">
              <AnimatedStat end={15} suffix="+" label="Tahun Pengalaman" />
              <AnimatedStat end={100} suffix="%" label="Material Alami" />
              <AnimatedStat end={12} suffix="k+" label="Karya Tercipta" />
            </div>
          </div>
        </section>

        {/* --- KATALOG SECTION --- */}
        <section id="katalog" className="py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2420] mb-3">Koleksi Terbaru</h2>
                <p className="text-[#7A6F66] text-base">Pilihan karya buatan tangan terbaik yang siap melengkapi sudut estetika ruang Anda.</p>
              </div>
              <button className="hidden md:block border-b border-[#2C2420] text-[#2C2420] font-medium text-sm pb-1 hover:text-[#8C6239] hover:border-[#8C6239] transition-colors">
                Lihat Semua Koleksi &rarr;
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#D9CFC4]">
                <Loader2 className="animate-spin mb-4" size={28} />
                <p className="text-sm">Mempersiapkan etalase...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/5] bg-[#F4EFEB] rounded-sm overflow-hidden mb-4">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={40} className="text-[#D9CFC4]" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-[#FDFBF7]/95 px-3 py-1 rounded-full text-xs font-semibold text-[#2C2420] shadow-sm backdrop-blur-md">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2C2420] mb-1 group-hover:text-[#8C6239] transition-colors">{product.name}</h3>
                      <p className="text-[#7A6F66] text-xs line-clamp-2">Karya otentik buatan tangan.</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#F8F5F0] rounded-sm border border-[#EAE3DB] border-dashed">
                <p className="text-[#7A6F66] text-base font-serif">Belum ada karya yang dipajang.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- KEUNGGULAN SECTION --- */}
        <section id="keunggulan" className="bg-[#2C2420] text-[#FDFBF7] py-20 md:py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#FDFBF7]">Nilai Seni Kami</h2>
              <p className="text-[#B3A89F] text-base md:text-lg">
                Kami percaya bahwa barang yang dibuat dengan hati akan membawa kehangatan ke dalam rumah Anda. Inilah dedikasi kami dalam setiap sentuhan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col">
                <Leaf className="text-[#D4A373] mb-4" size={32} strokeWidth={1.5} />
                <h3 className="text-xl font-serif font-bold mb-2">Material Alami</h3>
                <p className="text-[#B3A89F] text-sm md:text-base leading-relaxed">Menggunakan kayu, rotan, dan tanah liat berkualitas yang bersumber secara etis dari alam tanpa merusak ekosistem.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col">
                <Hammer className="text-[#D4A373] mb-4" size={32} strokeWidth={1.5} />
                <h3 className="text-xl font-serif font-bold mb-2">100% Buatan Tangan</h3>
                <p className="text-[#B3A89F] text-sm md:text-base leading-relaxed">Setiap pahatan dan anyaman dikerjakan dengan presisi oleh tangan terampil pengrajin lokal berdedikasi tinggi.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col">
                <Palette className="text-[#D4A373] mb-4" size={32} strokeWidth={1.5} />
                <h3 className="text-xl font-serif font-bold mb-2">Desain Eksklusif</h3>
                <p className="text-[#B3A89F] text-sm md:text-base leading-relaxed">Tidak ada dua produk yang persis sama. Keunikan tekstur dan warna menjadikan setiap karya milik Anda seutuhnya.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col">
                <Recycle className="text-[#D4A373] mb-4" size={32} strokeWidth={1.5} />
                <h3 className="text-xl font-serif font-bold mb-2">Ramah Lingkungan</h3>
                <p className="text-[#B3A89F] text-sm md:text-base leading-relaxed">Dari proses produksi hingga pengemasan, kami meminimalisir limbah dan menggunakan bahan yang mudah terurai.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="flex flex-col">
                <Sparkles className="text-[#D4A373] mb-4" size={32} strokeWidth={1.5} />
                <h3 className="text-xl font-serif font-bold mb-2">Kualitas Premium</h3>
                <p className="text-[#B3A89F] text-sm md:text-base leading-relaxed">Setiap inci produk melewati pengecekan kualitas yang ketat untuk memastikan keawetan benda seni yang Anda beli.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex flex-col">
                <HeartHandshake className="text-[#D4A373] mb-4" size={32} strokeWidth={1.5} />
                <h3 className="text-xl font-serif font-bold mb-2">Pesanan Custom</h3>
                <p className="text-[#B3A89F] text-sm md:text-base leading-relaxed">Punya visi khusus untuk ruangan Anda? Kami siap berdiskusi dan mewujudkan desain kriya impian Anda.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section id="testimoni" className="py-20 bg-[#FDFBF7]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2420]">Cerita Mereka</h2>
              <p className="text-[#7A6F66] mt-3 text-base">Apa kata mereka yang telah menghiasi ruangannya dengan karya kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#F8F5F0] p-8 rounded-sm">
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="italic text-[#5C534C] mb-6 leading-relaxed text-sm md:text-base">
                  "Vas keramiknya sangat indah. Teksturnya kasar tapi elegan, persis seperti yang saya cari untuk mempercantik meja ruang tamu saya. Karya seni sungguhan."
                </p>
                <div>
                  <div className="font-bold font-serif text-[#2C2420] text-base">Amelia Rosa</div>
                  <div className="text-xs text-[#7A6F66]">Kolektor Seni</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#F8F5F0] p-8 rounded-sm">
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="italic text-[#5C534C] mb-6 leading-relaxed text-sm md:text-base">
                  "Memesan kursi kayu custom di sini adalah keputusan terbaik. Detail ukirannya sangat rapi, kayunya solid, dan aromanya sangat menenangkan."
                </p>
                <div>
                  <div className="font-bold font-serif text-[#2C2420] text-base">Bagas Pradana</div>
                  <div className="text-xs text-[#7A6F66]">Pemilik Studio Kopi</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-[#F8F5F0] p-8 rounded-sm">
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="italic text-[#5C534C] mb-6 leading-relaxed text-sm md:text-base">
                  "Packagingnya sangat aman dan ramah lingkungan. Ketika kotaknya dibuka, ada kartu ucapan tulisan tangan. Sentuhan personal yang jarang ditemukan."
                </p>
                <div>
                  <div className="font-bold font-serif text-[#2C2420] text-base">Citra Kirana</div>
                  <div className="text-xs text-[#7A6F66]">Desainer Interior</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="pb-20 px-6 pt-10">
          <div className="max-w-[1200px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#D4A373] rounded-sm p-12 md:p-16 text-center relative overflow-hidden"
            >
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2420] mb-4">
                  Wujudkan ide desain Anda.
                </h2>
                <p className="text-[#2C2420]/80 mb-8 text-sm md:text-base">
                  Punya inspirasi perabot atau kerajinan tangan khusus? Mari berdiskusi dengan pengrajin kami.
                </p>
                <button className="bg-[#2C2420] text-[#FDFBF7] px-8 py-3 rounded-full font-medium text-sm hover:bg-[#1A1512] transition-colors shadow-lg">
                  Konsultasi Gratis
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#2C2420] text-[#FDFBF7] py-12 border-t border-[#4A3F38]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Kiri - Logo */}
          <div className="font-serif font-bold text-2xl tracking-tight text-center md:text-left">
            Kala Karya.
          </div>
          
          {/* Tengah - Links */}
          <div className="flex justify-center gap-8 text-sm text-[#B3A89F]">
            <a href="#" className="hover:text-[#FDFBF7] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#FDFBF7] transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-[#FDFBF7] transition-colors">Email</a>
          </div>
          
          {/* Kanan - Copyright */}
          <div className="text-xs text-[#7A6F66] text-center md:text-right">
            © 2026 Kala Karya. Dibuat dengan hati.
          </div>
          
        </div>
      </footer>

    </div>
  );
}