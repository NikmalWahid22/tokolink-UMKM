import React, { useState } from 'react';
import { ChevronDown, UploadCloud, CreditCard, Truck, User, Lock } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'Payments', 'Shipping', 'Profile'];

  // Komponen Toggle Switch biar gak ngetik ulang terus
  const ToggleSwitch = ({ id, label, description, defaultChecked }) => (
    <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl bg-zinc-50">
      <div>
        <label htmlFor={id} className="font-semibold text-zinc-900 block text-sm cursor-pointer">{label}</label>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id={id} className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
      </label>
    </div>
  );

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
                    <input type="text" defaultValue="Artisan Store" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                    <p className="text-xs text-zinc-500 mt-1.5">This is the name that will appear to your customers.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Support Email</label>
                    <input type="email" defaultValue="support@artisanstore.com" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Regional</h3>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Base Currency</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none cursor-pointer">
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
                  <ToggleSwitch id="pay-transfer" label="Manual Bank Transfer" description="Accept payments directly to your bank account." defaultChecked={true} />
                  <ToggleSwitch id="pay-ewallet" label="E-Wallet (QRIS / GoPay / OVO)" description="Enable digital wallet payments." defaultChecked={true} />
                  <ToggleSwitch id="pay-cod" label="Cash on Delivery (COD)" description="Customers pay when they receive the package." defaultChecked={false} />
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Bank Account Details</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Bank Name</label>
                      <input type="text" defaultValue="BCA" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Account Number</label>
                      <input type="text" defaultValue="1234567890" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Account Holder Name</label>
                    <input type="text" defaultValue="PT Artisan Store Indonesia" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
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
                    <input type="number" defaultValue="15000" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                    <p className="text-xs text-zinc-500 mt-1.5">Charge a fixed fee for standard domestic shipping.</p>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-5 pb-4 border-b border-zinc-100">Free Shipping</h3>
                <div className="space-y-5">
                  <ToggleSwitch id="ship-free" label="Enable Free Shipping" description="Offer free shipping for orders over a certain amount." defaultChecked={true} />
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Minimum Order Amount (Rp)</label>
                    <input type="number" defaultValue="300000" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
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
                    <input type="text" defaultValue="Admin" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email Address</label>
                    <input type="email" defaultValue="admin@artisanstore.com" className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
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
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors">
              Discard
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm">
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}