import React, { useState, useEffect } from 'react';
import { ChevronDown, UploadCloud, CreditCard, Truck, User, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk menampung seluruh data form settings
  const [settingsData, setSettingsData] = useState({
    store_name: 'Artisan Store',
    support_email: 'support@artisanstore.com',
    currency: 'IDR',
    bank_transfer_enabled: true,
    ewallet_enabled: true,
    cod_enabled: false,
    bank_name: 'BCA',
    account_number: '1234567890',
    account_holder: 'PT Artisan Store Indonesia',
    shipping_flat_rate: 15000,
    free_shipping_enabled: true,
    free_shipping_min: 300000,
    first_name: 'Admin',
    last_name: 'User',
    profile_email: 'admin@artisanstore.com'
  });

  const tabs = ['General', 'Payments', 'Shipping', 'Profile'];

  // 1. Ambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setSettingsData(prev => ({
          ...prev,
          store_name: data.store_name || prev.store_name,
          bank_transfer_enabled: data.bank_transfer_enabled ?? prev.bank_transfer_enabled,
          ewallet_enabled: data.ewallet_enabled ?? prev.ewallet_enabled,
          cod_enabled: data.cod_enabled ?? prev.cod_enabled,
          bank_name: data.bank_name || prev.bank_name,
          account_number: data.account_number || prev.account_number,
          account_holder: data.account_holder || prev.account_holder,
        }));
      }
    } catch (error) {
      console.error('Gagal mengambil data settings:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handler untuk mengubah nilai input teks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Handler untuk mengubah nilai checkbox/toggle
  const handleToggle = (name, checked) => {
    setSettingsData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Ambil baris pertama dari tabel store_settings untuk di-update
      const { data: existingData } = await supabase
        .from('store_settings')
        .select('id')
        .limit(1)
        .single();

      if (!existingData) {
        alert('Data setting utama tidak ditemukan di database.');
        setIsSaving(false);
        return;
      }

      // Payload sekarang ngirim SEMUA data termasuk Shipping & Profile
      const payload = {
        store_name: settingsData.store_name,
        support_email: settingsData.support_email,
        currency: settingsData.currency,
        
        bank_transfer_enabled: settingsData.bank_transfer_enabled,
        ewallet_enabled: settingsData.ewallet_enabled,
        cod_enabled: settingsData.cod_enabled,
        bank_name: settingsData.bank_name,
        account_number: settingsData.account_number,
        account_holder: settingsData.account_holder,
        
        shipping_flat_rate: parseInt(settingsData.shipping_flat_rate) || 0,
        free_shipping_enabled: settingsData.free_shipping_enabled,
        free_shipping_min: parseInt(settingsData.free_shipping_min) || 0,
        
        first_name: settingsData.first_name,
        last_name: settingsData.last_name,
        profile_email: settingsData.profile_email,
        
        updated_at: new Date()
      };

      const { error } = await supabase
        .from('store_settings')
        .update(payload)
        .eq('id', existingData.id);

      if (error) throw error;

      alert('Pengaturan toko berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan settings:', error.message);
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Komponen Toggle Switch dengan state terhubung ke Supabase
  const ToggleSwitch = ({ id, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl bg-zinc-50">
      <div>
        <label htmlFor={id} className="font-semibold text-zinc-900 block text-sm cursor-pointer">{label}</label>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={id} 
          className="sr-only peer" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
      </label>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm">Memuat pengaturan toko...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 relative">
      
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Store Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your store's core details and preferences.</p>
      </div>

      {/* --- Settings Layout: Sidebar Tabs + Content Area --- */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Tabs Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg text-left whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* ========================================= */}
          {/* TAB: GENERAL */}
          {/* ========================================= */}
          {activeTab === 'General' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Store Information</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Store Name</label>
                    <input 
                      type="text" 
                      name="store_name"
                      value={settingsData.store_name} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                    <p className="text-xs text-zinc-500 mt-1.5">This is the name that will appear to your customers.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Support Email</label>
                    <input 
                      type="email" 
                      name="support_email"
                      value={settingsData.support_email} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Regional</h3>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Base Currency</label>
                  <div className="relative">
                    <select 
                      name="currency"
                      value={settingsData.currency}
                      onChange={handleChange}
                      className="w-full appearance-none bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none cursor-pointer"
                    >
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Brand Assets</h3>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-3">Store Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 flex-shrink-0 flex items-center justify-center p-2">
                      <div className="w-full h-full bg-white rounded-lg border border-zinc-100 flex items-center justify-center">
                        <UploadCloud className="text-zinc-300" size={32} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="bg-zinc-900 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-zinc-800 transition-colors w-max shadow-sm">Upload New Logo</button>
                      <p className="text-xs text-zinc-500">Recommended size: 512x512px. PNG or JPG.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB: PAYMENTS */}
          {/* ========================================= */}
          {activeTab === 'Payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-100">
                  <CreditCard size={20} className="text-zinc-900" />
                  <h3 className="text-lg font-bold text-zinc-900">Payment Methods</h3>
                </div>
                <div className="space-y-4">
                  <ToggleSwitch 
                    id="pay-transfer" 
                    label="Manual Bank Transfer" 
                    description="Accept payments directly to your bank account." 
                    checked={settingsData.bank_transfer_enabled}
                    onChange={(val) => handleToggle('bank_transfer_enabled', val)}
                  />
                  <ToggleSwitch 
                    id="pay-ewallet" 
                    label="E-Wallet (QRIS / GoPay / OVO)" 
                    description="Enable digital wallet payments." 
                    checked={settingsData.ewallet_enabled}
                    onChange={(val) => handleToggle('ewallet_enabled', val)}
                  />
                  <ToggleSwitch 
                    id="pay-cod" 
                    label="Cash on Delivery (COD)" 
                    description="Customers pay when they receive the package." 
                    checked={settingsData.cod_enabled}
                    onChange={(val) => handleToggle('cod_enabled', val)}
                  />
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Bank Account Details</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Bank Name</label>
                      <input 
                        type="text" 
                        name="bank_name"
                        value={settingsData.bank_name} 
                        onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Account Number</label>
                      <input 
                        type="text" 
                        name="account_number"
                        value={settingsData.account_number} 
                        onChange={handleChange}
                        className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Account Holder Name</label>
                    <input 
                      type="text" 
                      name="account_holder"
                      value={settingsData.account_holder} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB: SHIPPING */}
          {/* ========================================= */}
          {activeTab === 'Shipping' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-100">
                  <Truck size={20} className="text-zinc-900" />
                  <h3 className="text-lg font-bold text-zinc-900">Shipping Rates</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Standard Flat Rate (Rp)</label>
                    <input 
                      type="number" 
                      name="shipping_flat_rate"
                      value={settingsData.shipping_flat_rate} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                    <p className="text-xs text-zinc-500 mt-1.5">Charge a fixed fee for standard domestic shipping.</p>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Free Shipping</h3>
                <div className="space-y-5">
                  <ToggleSwitch 
                    id="ship-free" 
                    label="Enable Free Shipping" 
                    description="Offer free shipping for orders over a certain amount." 
                    checked={settingsData.free_shipping_enabled}
                    onChange={(val) => handleToggle('free_shipping_enabled', val)}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Minimum Order Amount (Rp)</label>
                    <input 
                      type="number" 
                      name="free_shipping_min"
                      value={settingsData.free_shipping_min} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB: PROFILE */}
          {/* ========================================= */}
          {activeTab === 'Profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-100">
                  <User size={20} className="text-zinc-900" />
                  <h3 className="text-lg font-bold text-zinc-900">Personal Information</h3>
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl font-bold text-zinc-400">
                    AD
                  </div>
                  <button className="bg-white border border-zinc-200 text-zinc-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={settingsData.first_name} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={settingsData.last_name} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="profile_email"
                      value={settingsData.profile_email} 
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" 
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-100">
                  <Lock size={20} className="text-zinc-900" />
                  <h3 className="text-lg font-bold text-zinc-900">Security</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Action Buttons (Muncul di semua tab) */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={fetchSettings} 
              type="button"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleSaveChanges} 
              disabled={isSaving}
              type="button"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving && <Loader2 className="animate-spin" size={16} />}
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}