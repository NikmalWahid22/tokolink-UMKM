import React from 'react';
import { Search, Bell, CircleUser } from 'lucide-react';

export default function TopbarAdmin() {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-6 lg:px-8 z-40 sticky top-0 font-sans w-full">
      
      {/* 1. BLOK KIRI: Nama Toko */}
      <div className="flex-shrink-0 mr-8">
        <span className="text-lg font-bold text-zinc-900 tracking-tight whitespace-nowrap">
          TokoLink Store
        </span>
      </div>
      
      {/* 2. BLOK TENGAH: Search Bar (flex-1 bikin dia membentang otomatis) */}
      <div className="flex-1 max-w-2xl hidden md:block">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" strokeWidth={2} />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
          />
        </div>
      </div>

      {/* 3. BLOK KANAN: Ikon (ml-auto dorong mentok ke kanan) */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        <button className="flex items-center justify-center w-10 h-10 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all">
          <Bell size={20} strokeWidth={1.5} />
        </button>
        <button className="flex items-center justify-center w-10 h-10 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all">
          <CircleUser size={24} strokeWidth={1.5} />
        </button>
      </div>

    </header>
  );
}