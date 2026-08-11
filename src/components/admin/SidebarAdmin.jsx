import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Layers, ShoppingCart, Settings } from 'lucide-react';

export default function SidebarAdmin() {
  // Fungsi untuk ngatur warna otomatis: kalau aktif warnanya terang, kalau nggak aktif warnanya redup
  const navLinkStyle = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out text-sm ${
      isActive 
        ? 'bg-zinc-800 text-white shadow-sm' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    }`;

  return (
    <nav className="bg-zinc-950 text-zinc-300 h-screen w-64 fixed left-0 top-0 border-r border-zinc-900 shadow-sm flex flex-col p-4 z-50 font-sans">
      
      {/* Header Sidebar */}
      <div className="mb-8 px-4 py-2">
        <h1 className="text-xl font-bold text-white tracking-tight">TokoLink Admin</h1>
        <p className="text-xs text-zinc-500 mt-1">Management Suite</p>
      </div>

      {/* Menu Atas */}
      <div className="flex flex-col gap-1.5 flex-1">
        <NavLink to="/admin/dashboard" className={navLinkStyle}>
          <LayoutDashboard size={20} strokeWidth={1.5} />
          Dashboard
        </NavLink>
        
        <NavLink to="/admin/categories" className={navLinkStyle}>
          <Layers size={20} strokeWidth={1.5} />
          Categories
        </NavLink>
        
        <NavLink to="/admin/products" className={navLinkStyle}>
          <ShoppingCart size={20} strokeWidth={1.5} />
          Products
        </NavLink>
      </div>

      {/* Menu Settings (Otomatis didorong ke paling bawah oleh flex-1 di atas) */}
      <div className="mt-auto">
        <NavLink to="/admin/settings" className={navLinkStyle}>
          <Settings size={20} strokeWidth={1.5} />
          Settings
        </NavLink>
      </div>

    </nav>
  );
}