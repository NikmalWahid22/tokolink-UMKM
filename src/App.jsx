import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// IMPORT PAGES - CUSTOMER
// ==========================================
import Home from './pages/customer/Home';

// ==========================================
// IMPORT PAGES - ADMIN
// ==========================================
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders'; 
import Settings from './pages/admin/Settings';

// ==========================================
// IMPORT COMPONENTS - ADMIN
// ==========================================
import AdminLayout from './components/admin/AdminLayout';
// import ProtectedRoute from './components/admin/ProtectedRoute'; // Nanti kita aktifkan pas nyambungin Auth Supabase

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ===================================== */}
        {/* AREA CUSTOMER (Katalog UMKM)          */}
        {/* ===================================== */}
        <Route path="/" element={<Home />} />


        {/* ===================================== */}
        {/* AREA ADMIN (Dashboard & Manajemen)    */}
        {/* ===================================== */}
        {/* Halaman Login Admin terpisah dari layout utama */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* AdminLayout membungkus semua halaman dalam /admin agar Sidebar & Topbar konsisten */}
        <Route path="/admin" element={<AdminLayout />}>
          
          {/* Jika user mengakses /admin saja, otomatis arahkan ke /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Nested routes untuk halaman-halaman admin */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} /> {/* <-- Ini route untuk halamannya */}
          <Route path="settings" element={<Settings />} />
        </Route>


        {/* ===================================== */}
        {/* FALLBACK ROUTE (404)                  */}
        {/* ===================================== */}
        {/* Jika user ngetik URL ngasal, lempar balik ke halaman utama katalog */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}