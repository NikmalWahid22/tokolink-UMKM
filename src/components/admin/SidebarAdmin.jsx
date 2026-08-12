import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Pastikan path ini sesuai dengan project lu

export default function SidebarAdmin() {
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = async () => {
    if (window.confirm('Yakin mau keluar dari dashboard?')) {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        navigate('/admin/login'); // Arahin balik ke halaman login
      } else {
        alert('Gagal logout: ' + error.message);
      }
    }
  };

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

      {/* Menu Utama */}
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
          <Package size={20} strokeWidth={1.5} />
          Products
        </NavLink>

        <NavLink to="/admin/orders" className={navLinkStyle}>
          <ShoppingCart size={20} strokeWidth={1.5} />
          Orders
        </NavLink>
      </div>

      {/* Menu Bawah (Settings & Logout) */}
      <div className="mt-auto flex flex-col gap-1.5">
        <NavLink to="/admin/settings" className={navLinkStyle}>
          <Settings size={20} strokeWidth={1.5} />
          Settings
        </NavLink>

        {/* Tombol Logout Baru */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 text-left w-full mt-2 border-t border-zinc-900 pt-4"
        >
          <LogOut size={20} strokeWidth={1.5} />
          Logout
        </button>
      </div>

    </nav>
  );
}