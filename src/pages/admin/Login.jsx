import React, { useState } from 'react';
import { Store, Mail, Lock, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Nanti di sini kita pasang fungsi login ke Supabase
    console.log('Login attempt with:', email, password);
    // Dummy redirect sementara
    navigate('/admin/dashboard');
  };

  return (
    // 1. BAGIAN BODY & BACKGROUND (Fix: Pakai w-screen)
    <div className="relative min-h-screen w-screen flex items-center justify-center p-4 bg-zinc-900 overflow-hidden font-sans">
      
      {/* Background Foto + Overlay Gelap */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* 2. KARTU FORM LOGIN (Fix: Pakai strict width w-[90%] sm:w-[420px]) */}
      <div className="z-10 w-[90%] sm:w-[420px] bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8 sm:p-10 flex flex-col gap-6 relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-1">
          <div className="p-3 bg-zinc-100 rounded-xl mb-2 text-zinc-900">
            <Store size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500">Sign in to TokoLink Admin Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
              </div>
              <input 
                className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none" 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tokolink.com" 
                required 
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <a className="text-xs font-medium text-zinc-900 hover:underline transition-colors" href="#">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
              </div>
              <input 
                className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all outline-none" 
                id="password" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between my-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer" 
                id="remember-me" 
                type="checkbox"
              />
              <span className="text-xs text-zinc-600">Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-zinc-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-zinc-800 active:scale-[0.99] transition-all shadow-md mt-2"
          >
            Sign In
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-400 border-t border-zinc-100 pt-4">
          <p>
            Protected by TokoLink Security. <br/>
            Need help? <a className="text-zinc-900 hover:underline font-medium" href="#">Contact Support</a>
          </p>
        </div>

      </div>
    </div>
  );
}