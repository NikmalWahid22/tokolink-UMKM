import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Fungsi buat deteksi scroll dan set active menu
  useEffect(() => {
    const handleScroll = () => {
      // Efek shadow navbar saat di-scroll
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'katalog', 'keunggulan', 'testimoni'];
      const scrollPosition = window.scrollY + 200; // Offset biar pas

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi buat smooth scroll pas menu diklik
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Kurangi tinggi navbar
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'katalog', label: 'Karya Kami' },
    { id: 'keunggulan', label: 'Nilai Seni' },
    { id: 'testimoni', label: 'Cerita Pelanggan' }
  ];

  return (
    <header className={`bg-[#FDFBF7] sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm py-3' : 'py-5'}`}>
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6">
        
        {/* Logo Toko Kerajinan */}
        <div 
          onClick={() => scrollTo('home')}
          className="text-2xl font-bold text-[#2C2420] tracking-tight cursor-pointer font-serif"
        >
          Kala Karya.
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-[15px] font-medium transition-all duration-300 ${
                activeSection === link.id 
                  ? 'text-[#8C6239] border-b-2 border-[#8C6239] pb-1' 
                  : 'text-[#5C534C] hover:text-[#2C2420]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="text-[#5C534C] hover:text-[#2C2420] transition-colors duration-200 active:scale-95">
            <ShoppingCart size={22} strokeWidth={1.5} />
          </button>
          
          <Link 
            to="/admin/login" 
            className="hidden md:block bg-[#2C2420] text-[#FDFBF7] px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#4A3F38] transition-colors"
          >
            Masuk
          </Link>
        </div>
        
      </div>
    </header>
  );
}