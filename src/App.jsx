import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// P A G E S  -  C U S T O M E R
// ==========================================
import Home from './pages/customer/Home';

// ==========================================
// P A G E S  -  A D M I N
// ==========================================
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders'; 
import Settings from './pages/admin/Settings';

// ==========================================
// C O M P O N E N T S  -  A D M I N
// ==========================================
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute'; // Satpam rute yang baru kita buat

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ===================================== */}
        {/* PUBLIC ROUTE: AREA CUSTOMER           */}
        {/* Halaman utama katalog untuk pembeli   */}
        {/* ===================================== */}
        <Route path="/" element={<Home />} />


        {/* ===================================== */}
        {/* PUBLIC ROUTE: ADMIN AUTH              */}
        {/* Halaman login admin (tanpa layout)    */}
        {/* ===================================== */}
        <Route path="/admin/login" element={<Login />} />
        
        
        {/* ===================================== */}
        {/* PROTECTED ROUTES: AREA ADMIN          */}
        {/* Rute di bawah ini wajib login (Auth)  */}
        {/* ===================================== */}
        <Route element={<ProtectedRoute />}>
          
          {/* AdminLayout membungkus halaman agar Sidebar & Topbar konsisten */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* Redirect default: /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Nested routes untuk modul-modul manajemen admin */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
            
          </Route>
          
        </Route>


        {/* ===================================== */}
        {/* FALLBACK ROUTE (404 ERROR)            */}
        {/* Redirect URL ngasal ke halaman utama  */}
        {/* ===================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}