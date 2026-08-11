import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import TopbarAdmin from './TopbarAdmin';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      
      {/* Sidebar (Fixed di Kiri) */}
      <SidebarAdmin />

      {/* Area Konten Utama (Didorong ke kanan selebar sidebar 64) */}
      <div className="ml-64 flex flex-col min-h-screen">
        
        {/* Topbar yang baru kita buat (Berlaku untuk semua halaman) */}
        <TopbarAdmin />
        
        {/* Konten Halaman Dinamis (Dashboard, Products, dll) */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}