import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Banknote,
    Package,
    Users,
    Wallet,
    TrendingUp,
    TrendingDown,
    BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatRupiah } from '../../lib/utils';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        activeOrders: 0,
        newCustomers: 0,
        revenue: 0,
    });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // 1. Ambil data orders dari Supabase
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            if (ordersData && ordersData.length > 0) {
                // Hitung total sales / revenue dari total_amount di tabel orders
                const totalRevenue = ordersData.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);

                // Hitung total order aktif (status pending atau processing)
                const activeCount = ordersData.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

                setStats({
                    totalSales: totalRevenue,
                    salesTrend: 12.5, // Bisa dihitung dinamis jika ada data bulan lalu
                    activeOrders: activeCount,
                    ordersTrend: 3.2,
                    newCustomers: ordersData.length, // Estimasi unik customer dari total order
                    customersTrend: 1.4,
                    revenue: totalRevenue,
                    revenueTrend: 8.9,
                });

                // Ambil 5 order terbaru untuk ditampilkan di list
                const formattedOrders = ordersData.slice(0, 5).map(item => ({
                    id: `#${item.id.substring(0, 6).toUpperCase()}`,
                    product: item.customer_name ? `Pesanan oleh ${item.customer_name}` : 'Order Customer',
                    status: item.status || 'Pending',
                    price: item.total_amount || 0
                }));

                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error("Gagal mengambil data dari Supabase:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-sm font-medium text-zinc-500 animate-pulse">Menghubungkan ke Supabase...</div>;
    }

    const TrendBadge = ({ value }) => {
        const isPositive = value >= 0;
        return (
            <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(value)}%
            </span>
        );
    };

    const StatusBadge = ({ status }) => {
        let style = "bg-zinc-100 text-zinc-700 border-zinc-200";
        if (status === 'Pending') style = "bg-amber-50 text-amber-700 border-amber-200";
        if (status === 'Processing') style = "bg-blue-50 text-blue-700 border-blue-200";
        if (status === 'Delivered' || status === 'Shipped') style = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === 'Cancelled') style = "bg-red-50 text-red-700 border-red-200";

        return (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">

            {/* Header Halaman */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Overview</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Data sinkron langsung dari database Supabase.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-sm"
                >
                    Refresh Data
                </button>
            </div>

            {/* Grid 4 Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">Total Sales</span>
                        <Banknote className="text-zinc-400" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 mt-1">{formatRupiah(stats.totalSales)}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <TrendBadge value={stats.salesTrend} /> from last month
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">Active Orders</span>
                        <Package className="text-zinc-400" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 mt-1">{stats.activeOrders}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <TrendBadge value={stats.ordersTrend} /> from last month
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">Total Orders</span>
                        <Users className="text-zinc-400" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 mt-1">{stats.newCustomers}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <TrendBadge value={stats.customersTrend} /> from last month
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">Revenue</span>
                        <Wallet className="text-zinc-400" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 mt-1">{formatRupiah(stats.revenue)}</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <TrendBadge value={stats.revenueTrend} /> from last month
                    </div>
                </div>

            </div>

            {/* Grid Bawah: Chart & Tabel Order */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Grafik Penjualan */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col gap-4 min-h-[400px]">
                    <h3 className="text-lg font-bold text-zinc-900">Sales Trends</h3>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={orders.slice().reverse()}> {/* Data order dibalik biar urutan waktu bener */}
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                <XAxis
                                    dataKey="id"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#71717a' }}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                                    tick={{ fill: '#71717a' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [formatRupiah(value), "Total"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#18181b"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List Recent Orders dari Database */}
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-zinc-200 bg-white">
                        <h3 className="text-lg font-bold text-zinc-900">Recent Orders</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[360px]">
                        {orders.length === 0 ? (
                            <div className="p-8 text-center text-sm text-zinc-400">Belum ada pesanan masuk di database.</div>
                        ) : (
                            <ul className="flex flex-col">
                                {orders.map((order, index) => (
                                    <li key={index} className="p-5 border-b border-zinc-100 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer last:border-b-0">
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">{order.id}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{order.product}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <StatusBadge status={order.status} />
                                            <span className="text-sm font-semibold text-zinc-900">{formatRupiah(order.price)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-4 border-t border-zinc-200 text-center bg-zinc-50">
                        <button className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                            View All Orders
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}