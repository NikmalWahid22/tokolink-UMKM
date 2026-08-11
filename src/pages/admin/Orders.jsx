import React, { useState } from 'react';
import { Search, Filter, Eye, Download, ChevronLeft, ChevronRight, Calendar, X, MapPin, Printer } from 'lucide-react';
import { formatRupiah } from '../../lib/utils';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');
  
  // State untuk Modal Detail
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dummy Data (Gw tambahin detail pesanan biar modalnya ada isinya)
  const dummyOrders = [
    { 
      id: 'ORD-2026-001', customer: 'Budi Santoso', email: 'budi@example.com', phone: '08123456789', date: '11 Aug 2026, 14:30', 
      total: 150000, status: 'Pending', items: 3,
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      products: [
        { name: 'Kopi Susu Gula Aren', qty: 2, price: 50000 },
        { name: 'Croissant Butter', qty: 1, price: 50000 }
      ]
    },
    { 
      id: 'ORD-2026-002', customer: 'Siti Aminah', email: 'siti.a@example.com', phone: '08198765432', date: '11 Aug 2026, 10:15', 
      total: 85000, status: 'Processing', items: 1,
      address: 'Apartemen Sudirman Tower B, Jakarta Pusat',
      products: [
        { name: 'Woven Linen Throw', qty: 1, price: 85000 }
      ]
    },
  ];

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const StatusBadge = ({ status }) => {
    const styles = {
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
      'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
      'Shipped': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide uppercase border ${styles[status] || 'bg-zinc-100 text-zinc-500'}`}>
        {status}
      </span>
    );
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
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
                activeTab === tab ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'
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
            <input type="text" placeholder="Search by Order ID or Customer..." className="w-full bg-white border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" />
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
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors group cursor-pointer" onClick={() => handleOpenDetail(order)}>
                  <td className="py-4 px-6 font-semibold text-zinc-900">{order.id}</td>
                  <td className="py-4 px-6 text-zinc-500">{order.date.split(',')[0]}</td>
                  <td className="py-4 px-6 font-medium text-zinc-700">{order.customer}</td>
                  <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
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
      </div>

      {/* --- ORDER DETAIL MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-50 rounded-2xl shadow-2xl w-[90%] sm:w-[600px] flex-shrink-0 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-zinc-200">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Order {selectedOrder.id}</h2>
                <p className="text-xs text-zinc-500 mt-1">{selectedOrder.date}</p>
              </div>
              <button onClick={handleCloseDetail} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-2 rounded-full transition-colors">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Status Update Card */}
              <div className="bg-white p-5 rounded-xl border border-zinc-200 flex items-center justify-between shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-500 uppercase">Current Status</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <select className="bg-zinc-50 border border-zinc-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-900 font-medium text-zinc-700">
                    <option value="Pending">Mark as Pending</option>
                    <option value="Processing">Mark as Processing</option>
                    <option value="Shipped">Mark as Shipped</option>
                    <option value="Delivered">Mark as Delivered</option>
                    <option value="Cancelled">Mark as Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col gap-3">
                <h3 className="font-bold text-zinc-900 text-sm">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 text-xs">Name</p>
                    <p className="font-medium text-zinc-900">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Contact</p>
                    <p className="font-medium text-zinc-900">{selectedOrder.phone}</p>
                    <p className="text-zinc-500 text-xs">{selectedOrder.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-500 text-xs flex items-center gap-1"><MapPin size={12} /> Shipping Address</p>
                    <p className="font-medium text-zinc-900 mt-0.5">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="font-bold text-zinc-900 text-sm mb-4">Purchased Items</h3>
                <div className="flex flex-col gap-3">
                  {selectedOrder.products?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg border border-zinc-200"></div>
                        <div>
                          <p className="font-medium text-zinc-900">{item.name}</p>
                          <p className="text-xs text-zinc-500">{formatRupiah(item.price)} x {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-zinc-900">{formatRupiah(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between items-center">
                  <span className="font-semibold text-zinc-700 text-sm">Total Amount</span>
                  <span className="font-bold text-lg text-zinc-900">{formatRupiah(selectedOrder.total)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-200 bg-white flex justify-between items-center">
              <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 hover:bg-zinc-100 rounded-lg transition-colors">
                <Printer size={16} /> Print Invoice
              </button>
              <button onClick={handleCloseDetail} className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">
                Save & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}