import React, { useState } from 'react';
import { Search, Filter, Eye, Download, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatRupiah } from '../../lib/utils';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');

  // Dummy Data UI sebelum disambung ke Supabase
  const dummyOrders = [
    { id: 'ORD-2026-001', customer: 'Budi Santoso', date: '11 Aug 2026', total: 150000, status: 'Pending', items: 3 },
    { id: 'ORD-2026-002', customer: 'Siti Aminah', date: '11 Aug 2026', total: 85000, status: 'Processing', items: 1 },
    { id: 'ORD-2026-003', customer: 'Ahmad Faisal', date: '10 Aug 2026', total: 320000, status: 'Shipped', items: 5 },
    { id: 'ORD-2026-004', customer: 'Diana Putri', date: '09 Aug 2026', total: 45000, status: 'Delivered', items: 1 },
    { id: 'ORD-2026-005', customer: 'Rizky Pratama', date: '08 Aug 2026', total: 120000, status: 'Cancelled', items: 2 },
  ];

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Fungsi untuk mewarnai Badge Status
  const StatusBadge = ({ status }) => {
    const styles = {
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
      'Shipped': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide uppercase border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Orders</h1>
          <p className="text-sm text-zinc-500 mt-1">Track and manage customer orders.</p>
        </div>
        <button className="bg-white border border-zinc-200 text-zinc-700 font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col">
        
        {/* Tabs Filter */}
        <div className="flex overflow-x-auto border-b border-zinc-200 px-2 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-zinc-900 text-zinc-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Date Filter */}
        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-200 bg-zinc-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full bg-white border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-zinc-200 rounded-lg py-2 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
              <Calendar size={16} className="text-zinc-400" /> Date Range
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-zinc-200 rounded-lg py-2 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
              <Filter size={16} className="text-zinc-400" /> More Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-zinc-200">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Items</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {dummyOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6 font-semibold text-zinc-900">{order.id}</td>
                  <td className="py-4 px-6 text-zinc-500">{order.date}</td>
                  <td className="py-4 px-6 font-medium text-zinc-700">{order.customer}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-6 text-zinc-500">{order.items} items</td>
                  <td className="py-4 px-6 font-semibold text-zinc-900">{formatRupiah(order.total)}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-between bg-zinc-50 rounded-b-2xl">
          <span className="text-sm text-zinc-500">Showing 5 of 128 orders</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg text-zinc-400 hover:bg-white hover:text-zinc-900 hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all disabled:opacity-50">
              <ChevronLeft size={20} />
            </button>
            <button className="p-1.5 rounded-lg text-zinc-400 hover:bg-white hover:text-zinc-900 hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}