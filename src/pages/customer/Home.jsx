import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/customer/Navbar';
import { supabase } from '../../lib/supabase';
import { 
  PlayCircle, 
  Handshake, 
  ShieldCheck, 
  Truck, 
  Package, 
  Wallet, 
  Headset,
  Image as ImageIcon,
  Loader2,
  Star // <-- Tambahan icon Bintang buat testimonial
} from 'lucide-react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

// Komponen Khusus untuk Animasi Angka (VERSI ANTI LAG)
const AnimatedStat = ({ end, suffix, label, decimals = 0, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, {
        duration: duration,
        ease: "easeOut",
      });
      return controls.stop; 
    }
  }, [isInView, end, duration, count]);

  return (
    <div ref={ref} className="p-8 flex flex-col items-center justify-center">
      <div className="text-[32px] md:text-[40px] font-bold mb-2 text-white tracking-tight flex items-center">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="text-[14px] font-medium text-zinc-400">
        {label}
      </div>
    </div>
  );
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch 4 produk terbaru dari Supabase
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
    <div className="bg-white min-h-screen flex flex-col font-sans antialiased text-zinc-900">
      <Navbar />

      <main className="flex-grow">
        
        {/* --- Hero Section --- */}
        <section className="max-w-[1200px] mx-auto px-6 pt-12 md:pt-16 pb-16 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-6"
          >
            <h1 className="text-4xl md:text-[56px] md:leading-[64px] font-bold text-zinc-900 tracking-tight">
              Temukan produk UMKM pilihan langsung dari kreator lokal terbaik.
            </h1>
            <p className="text-zinc-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Platform terpercaya untuk mendukung produk-produk kerajinan dan karya orisinal UMKM. Belanja mudah, transparan, dan langsung memberdayakan ekonomi kerakyatan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button className="bg-[#1a1b22] text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-black transition-colors shadow-sm">
                Mulai Belanja
              </button>
              <button className="bg-white text-zinc-900 border border-zinc-200 px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <PlayCircle size={20} className="text-zinc-700" /> 
                Lihat Katalog
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12 w-full border-t border-zinc-100 pt-8"
          >
            <p className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-6 text-center">
              Telah bermitra dengan berbagai brand lokal unggulan
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
              <div className="text-lg font-bold text-zinc-800">KaryaLokal</div>
              <div className="text-lg font-bold text-zinc-800 tracking-widest">NUSANTARA</div>
              <div className="text-lg font-semibold text-zinc-800 italic">KreasiMandiri</div>
              <div className="text-lg font-bold text-zinc-800">WargaCraft</div>
              <div className="text-lg font-medium text-zinc-800 uppercase">UMKM.</div>
            </div>
          </motion.div>
        </section>

        {/* --- Stats Section --- */}
        <section className="bg-[#18181b] border-t border-zinc-800">
          <div className="max-w-[1200px] mx-auto px-6 py-6 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              <AnimatedStat end={500} suffix="+" label="Kreator Lokal Terverifikasi" />
              <AnimatedStat end={10} suffix="k+" label="Produk Unik Tersedia" />
              <AnimatedStat end={99.9} decimals={1} suffix="%" label="Ketepatan Waktu Pengiriman" />
            </div>
          </div>
        </section>

        {/* --- Catalog Showcase Section --- */}
        <section className="bg-white border-t border-zinc-200">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            
            <div className="text-center mb-12">
              <h2 className="text-[32px] font-bold text-zinc-900 mb-4 tracking-tight">Jelajahi Katalog Pilihan</h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Temukan produk berkualitas tinggi yang dikurasi langsung dari para pengrajin dan kreator lokal terbaik.
              </p>
            </div>

            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Memuat katalog produk...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="relative aspect-square bg-zinc-100 flex items-center justify-center p-6 overflow-hidden">
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-zinc-900 z-10 shadow-sm">
                        {formatPrice(product.price)}
                      </div>
                      
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ImageIcon size={48} className="text-zinc-300" />
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <h3 className="font-bold text-zinc-900 mb-4 line-clamp-2">{product.name}</h3>
                      <button className="w-full bg-[#1a1b22] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                        Lihat Detail
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200 border-dashed">
                <p className="text-zinc-500 font-medium">Belum ada produk yang ditambahkan.</p>
                <p className="text-sm text-zinc-400 mt-1">Silakan tambahkan produk melalui halaman Admin.</p>
              </div>
            )}

            <div className="flex justify-center mt-12">
              <button className="bg-[#1a1b22] text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-black transition-colors shadow-sm">
                Lihat Semua Katalog
              </button>
            </div>

          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="bg-zinc-50 max-w-full border-t border-zinc-200">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-[32px] md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
                Platform andalan untuk belanja produk UMKM
              </h2>
              <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                Semua fitur yang Anda butuhkan untuk menemukan, memesan, dan mengelola produk kerajinan lokal dengan mudah.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }} className="p-8 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6"><Handshake className="text-zinc-800" size={24} /></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">Langsung dari Pengrajin</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Terhubung langsung dengan kreator lokal. Memutus perantara untuk memastikan harga yang lebih adil bagi pengrajin dan margin yang lebih baik untuk Anda.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.2 }} className="p-8 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6"><ShieldCheck className="text-zinc-800" size={24} /></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">Kualitas Terjamin</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Setiap produk dan pengrajin telah melewati proses kurasi dan verifikasi yang ketat untuk memastikan standar kualitas terbaik.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.3 }} className="p-8 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6"><Truck className="text-zinc-800" size={24} /></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">Pengiriman Terintegrasi</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Solusi logistik yang aman dan hemat biaya, memastikan pesanan produk UMKM Anda tiba dengan selamat sampai di tangan.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.4 }} className="p-8 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6"><Package className="text-zinc-800" size={24} /></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">Manajemen Stok Real-time</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Sistem kami selalu sinkron dengan inventaris para pengrajin, meminimalisir risiko kehabisan barang saat Anda melakukan pemesanan.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.5 }} className="p-8 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6"><Wallet className="text-zinc-800" size={24} /></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">Pembayaran Transparan</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Tangani transaksi dengan mudah menggunakan sistem pembayaran otomatis kami, lengkap dengan faktur digital yang jelas dan transparan.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.6 }} className="p-8 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6"><Headset className="text-zinc-800" size={24} /></div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">Dukungan Pelanggan 24/7</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Tim layanan pelanggan kami selalu siap sedia membantu Anda mengatasi kendala pesanan, logistik, atau pertanyaan seputar produk.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Testimonials Section --- */}
        <section className="bg-zinc-100 max-w-full border-t border-zinc-200">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-[32px] font-bold text-zinc-900 tracking-tight">
                Dipercaya oleh mitra dan pelanggan kami
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Testimonial 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} strokeWidth={2} className="text-zinc-800" />
                  ))}
                </div>
                <p className="italic text-zinc-600 mb-8 flex-grow leading-relaxed">
                  "Katalog UMKM ini benar-benar mengubah cara kami mencari produk kerajinan untuk toko kami. Kualitasnya luar biasa dan platformnya sangat mudah digunakan."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                    SJ
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">Siti Jamilah</div>
                    <div className="text-sm text-zinc-500">Pemilik, Toko Oleh-oleh Vanguard</div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} strokeWidth={2} className="text-zinc-800" />
                  ))}
                </div>
                <p className="italic text-zinc-600 mb-8 flex-grow leading-relaxed">
                  "Transparansi dan komunikasi langsung dengan pengrajin membuat kami bisa membangun cerita bermakna di balik produk yang kami jual. Sangat direkomendasikan."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                    MR
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">Maulana Ridwan</div>
                    <div className="text-sm text-zinc-500">Founder, Studio Nusantara</div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} strokeWidth={2} className="text-zinc-800" />
                  ))}
                </div>
                <p className="italic text-zinc-600 mb-8 flex-grow leading-relaxed">
                  "Kami berhasil menghemat waktu pengadaan barang hingga 40% sekaligus meningkatkan kualitas inventaris kami. Integrasi sistemnya sangat mulus."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-500">
                    EL
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">Eka Lestari</div>
                    <div className="text-sm text-zinc-500">VP Operations, Acme Corp</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}