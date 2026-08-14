import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 w-full border-b border-zinc-200 shadow-sm z-40">
      {/* Menggunakan max-w-7xl atau max-w-[1200px] dengan px-6 agar jarak ke pinggir layar lebih proporsional */}
      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 py-4">
        
        {/* Logo */}
        <div className="text-[20px] font-bold text-black tracking-tight">
          UMKM Catalog
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#" className="text-black font-semibold border-b-2 border-black pb-0.5 hover:text-black transition-colors duration-200 text-[15px]">
            Home
          </a>
          <a href="#" className="text-zinc-600 font-medium hover:text-black transition-colors duration-200 text-[15px]">
            Platform
          </a>
          <a href="#" className="text-zinc-600 font-medium hover:text-black transition-colors duration-200 text-[15px]">
            Artisans
          </a>
          <a href="#" className="text-zinc-600 font-medium hover:text-black transition-colors duration-200 text-[15px]">
            Resources
          </a>
          <a href="#" className="text-zinc-600 font-medium hover:text-black transition-colors duration-200 text-[15px]">
            Contact
          </a>
        </nav>

        {/* Actions (Keranjang & Tombol Sign In dengan rounded-xl) */}
        <div className="flex items-center gap-5">
          <button className="text-zinc-800 hover:text-black transition-colors duration-200 active:scale-95">
            <ShoppingCart size={22} strokeWidth={2} />
          </button>
          
          <Link 
            to="/admin/login" 
            className="hidden md:block bg-[#1a1b22] text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-black transition-colors shadow-sm"
          >
            Sign In
          </Link>
        </div>
        
      </div>
    </header>
  );
}   