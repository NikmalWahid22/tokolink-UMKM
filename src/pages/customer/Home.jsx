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

// Komponen Animasi Angka (Warna disesuaikan tema bumi/earthy)
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
    <div ref={ref} className="p-6 flex flex-col items-center justify-center">
      <div className="text-4xl md:text-5xl font-serif font-bold mb-3 text-[#2C2420] tracking-tight flex items-center">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="text-sm md:text-base font-medium text-[#7A6F66]">
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

  // Tema warna: 
  // Background utama: #FDFBF7 (Off-white/Beige)
  // Teks utama: #2C2420 (Dark warm brown / Charcoal)
  // Aksen: #8C6239 (Muted terracotta / wood)
  
  return (
    <div className="bg-[#FDFBF7] min-h-screen flex flex-col font-sans antialiased text-[#2C2420] scroll-smooth">
      <Navbar />

      <main className="flex-grow">
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="max-w-[1200px] mx-auto px-6 pt-20 md:pt-32 pb-24 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl space-y-8"
          >
            <div className="inline-block px-4 py-1.5 mb-2 rounded-full border border-[#D9CFC4] bg-[#F4EFEB] text-[#8C6239] text-xs font-semibold tracking-widest uppercase">
              Studio Kerajinan & Kriya
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#2C2420] tracking-tight leading-tight">
              Keindahan abadi yang lahir dari tangan pengrajin.
            </h1>
            <p className="text-[#5C534C] max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Setiap karya yang kami hasilkan bukan sekadar barang, melainkan cerita, dedikasi, dan apresiasi terhadap material alam yang otentik.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <button 
                onClick={() => document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#2C2420] text-[#FDFBF7] px-10 py-4 rounded-full font-medium text-base hover:bg-[#4A3F38] transition-colors shadow-sm"
              >
                Jelajahi Karya
              </button>
            </div>
          </motion.div>
        </section>

        {/* --- STATS SECTION (Estetik & Organik) --- */}
        <section className="border-y border-[#EAE3DB] bg-[#F8F5F0]">
          <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-[#D9CFC4]">
              <AnimatedStat end={15} suffix="+" label="Tahun Pengalaman" />
              <AnimatedStat end={100} suffix="%" label="Material Alami" />
              <AnimatedStat end={12} suffix="k+" label="Karya Tercipta" />
            </div>
          </div>
        </section>

        {/* --- KATALOG SECTION --- */}
        <section id="katalog" className="py-24">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2420] mb-4">Koleksi Terbaru</h2>
                <p className="text-[#7A6F66] text-lg">Pilihan karya buatan tangan terbaik yang siap melengkapi sudut estetika ruang Anda.</p>
              </div>
              <button className="hidden md:block border-b border-[#2C2420] text-[#2C2420] font-medium pb-1 hover:text-[#8C6239] hover:border-[#8C6239] transition-colors">
                Lihat Semua Koleksi &rarr;
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#D9CFC4]">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Mempersiapkan etalase...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/5] bg-[#F4EFEB] rounded-sm overflow-hidden mb-5">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={48} className="text-[#D9CFC4]" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-[#FDFBF7]/95 px-3 py-1.5 rounded-full text-sm font-semibold text-[#2C2420] shadow-sm backdrop-blur-md">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C2420] mb-2 group-hover:text-[#8C6239] transition-colors">{product.name}</h3>
                      <p className="text-[#7A6F66] text-sm line-clamp-2">Karya otentik buatan tangan.</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#F8F5F0] rounded-lg border border-[#EAE3DB] border-dashed">
                <p className="text-[#7A6F66] text-lg font-serif">Belum ada karya yang dipajang.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- KEUNGGULAN SECTION (Redesigned - Less "SaaS", More "Artisan") --- */}
        <section id="keunggulan" className="bg-[#2C2420] text-[#FDFBF7] py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl mb-20">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-[#FDFBF7]">Nilai Seni Kami</h2>
              <p className="text-[#B3A89F] text-lg md:text-xl">
                Kami percaya bahwa barang yang dibuat dengan hati akan membawa kehangatan ke dalam rumah Anda. Inilah dedikasi kami dalam setiap sentuhan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col">
                <Leaf className="text-[#D4A373] mb-6" size={36} strokeWidth={1.5} />
                <h3 className="text-2xl font-serif font-bold mb-3">Material Alami</h3>
                <p className="text-[#B3A89F] leading-relaxed">Menggunakan kayu, rotan, dan tanah liat berkualitas yang bersumber secara etis dari alam tanpa merusak ekosistem.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col">
                <Hammer className="text-[#D4A373] mb-6" size={36} strokeWidth={1.5} />
                <h3 className="text-2xl font-serif font-bold mb-3">100% Buatan Tangan</h3>
                <p className="text-[#B3A89F] leading-relaxed">Setiap pahatan dan anyaman dikerjakan dengan presisi oleh tangan terampil pengrajin lokal berdedikasi tinggi.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col">
                <Palette className="text-[#D4A373] mb-6" size={36} strokeWidth={1.5} />
                <h3 className="text-2xl font-serif font-bold mb-3">Desain Eksklusif</h3>
                <p className="text-[#B3A89F] leading-relaxed">Tidak ada dua produk yang persis sama. Keunikan tekstur dan warna menjadikan setiap karya milik Anda seutuhnya.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col">
                <Recycle className="text-[#D4A373] mb-6" size={36} strokeWidth={1.5} />
                <h3 className="text-2xl font-serif font-bold mb-3">Ramah Lingkungan</h3>
                <p className="text-[#B3A89F] leading-relaxed">Dari proses produksi hingga pengemasan, kami meminimalisir limbah dan menggunakan bahan yang mudah terurai.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="flex flex-col">
                <Sparkles className="text-[#D4A373] mb-6" size={36} strokeWidth={1.5} />
                <h3 className="text-2xl font-serif font-bold mb-3">Kualitas Premium</h3>
                <p className="text-[#B3A89F] leading-relaxed">Setiap inci produk melewati pengecekan kualitas yang ketat untuk memastikan keawetan benda seni yang Anda beli.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex flex-col">
                <HeartHandshake className="text-[#D4A373] mb-6" size={36} strokeWidth={1.5} />
                <h3 className="text-2xl font-serif font-bold mb-3">Pesanan Custom</h3>
                <p className="text-[#B3A89F] leading-relaxed">Punya visi khusus untuk ruangan Anda? Kami siap berdiskusi dan mewujudkan desain kriya impian Anda.</p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section id="testimoni" className="py-24 bg-[#FDFBF7]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2420]">Cerita Mereka</h2>
              <p className="text-[#7A6F66] mt-4 text-lg">Apa kata mereka yang telah menghiasi ruangannya dengan karya kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#F8F5F0] p-10 rounded-sm">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="italic text-[#5C534C] mb-8 leading-relaxed text-lg">
                  "Vas keramiknya sangat indah. Teksturnya kasar tapi elegan, persis seperti yang saya cari untuk mempercantik meja ruang tamu saya. Karya seni sungguhan."
                </p>
                <div>
                  <div className="font-bold font-serif text-[#2C2420] text-lg">Amelia Rosa</div>
                  <div className="text-sm text-[#7A6F66]">Kolektor Seni</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#F8F5F0] p-10 rounded-sm">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="italic text-[#5C534C] mb-8 leading-relaxed text-lg">
                  "Memesan kursi kayu custom di sini adalah keputusan terbaik. Detail ukirannya sangat rapi, kayunya solid, dan aromanya sangat menenangkan."
                </p>
                <div>
                  <div className="font-bold font-serif text-[#2C2420] text-lg">Bagas Pradana</div>
                  <div className="text-sm text-[#7A6F66]">Pemilik Studio Kopi</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-[#F8F5F0] p-10 rounded-sm">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="#D4A373" className="text-[#D4A373]" />)}
                </div>
                <p className="italic text-[#5C534C] mb-8 leading-relaxed text-lg">
                  "Packagingnya sangat aman dan ramah lingkungan. Ketika kotaknya dibuka, ada kartu ucapan tulisan tangan. Sentuhan personal yang jarang ditemukan."
                </p>
                <div>
                  <div className="font-bold font-serif text-[#2C2420] text-lg">Citra Kirana</div>
                  <div className="text-sm text-[#7A6F66]">Desainer Interior</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="pb-24 px-6 pt-12">
          <div className="max-w-[1200px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-[#D4A373] rounded-sm p-16 md:p-24 text-center relative overflow-hidden"
            >
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2420] mb-6">
                  Wujudkan ide desain Anda.
                </h2>
                <p className="text-[#2C2420]/80 mb-10 text-lg">
                  Punya inspirasi perabot atau kerajinan tangan khusus? Mari berdiskusi dengan pengrajin kami.
                </p>
                <button className="bg-[#2C2420] text-[#FDFBF7] px-10 py-4 rounded-full font-medium text-base hover:bg-[#1A1512] transition-colors shadow-lg">
                  Konsultasi Gratis
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#2C2420] text-[#FDFBF7] py-12 border-t border-[#4A3F38]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif font-bold text-2xl tracking-tight">
            Kala Karya.
          </div>
          <div className="flex gap-6 text-sm text-[#B3A89F]">
            <a href="#" className="hover:text-[#D4A373] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-[#D4A373] transition-colors">Email</a>
          </div>
          <div className="text-sm text-[#7A6F66]">
            © 2026 Kala Karya. Dibuat dengan hati.
          </div>
        </div>
      </footer>

    </div>
  );
}