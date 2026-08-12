import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, UploadCloud, Image as ImageIcon, PackageSearch } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  // State Data Form
  const [formData, setFormData] = useState({ 
    id: null, 
    nama: '', 
    deskripsi: '', 
    harga: 0,
    stok: 0,
    category_id: '',
  });
  
  // State File Upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 1. Ambil Data Kategori (Untuk Dropdown)
  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, nama');
    if (data) setCategories(data);
  };

  // 2. Ambil Data Produk
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, nama: '', deskripsi: '', harga: 0, stok: 0, category_id: '' });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setModalMode('edit');
    setFormData({ 
      id: product.id, 
      nama: product.nama || '', 
      deskripsi: product.deskripsi || '', 
      harga: product.harga || 0,
      stok: product.stok || 0,
      category_id: product.category_id || '',
    });
    setImageFile(null);
    // SESUAIKAN DENGAN NAMA KOLOM DI DB LU: foto_url
    setImagePreview(product.foto_url || '');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = imagePreview;

      // Proses Upload ke Bucket 'products'
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `prod_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('products') 
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        finalImageUrl = publicURLData.publicUrl;
      }

      // SESUAIKAN PAYLOAD DENGAN NAMA KOLOM DI DB LU
      const payload = { 
        nama: formData.nama, 
        deskripsi: formData.deskripsi,
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok),
        category_id: formData.category_id || null, 
        foto_url: finalImageUrl // <-- Udah diganti jadi foto_url
      };

      if (modalMode === 'add') {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', formData.id);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error.message);
      alert("Gagal menyimpan produk: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin mau hapus produk ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchProducts();
    }
  };

  // Filter Search Lokal
  const filteredProducts = products.filter(prod => {
    const name = prod.nama || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Cari nama kategori dari category_id
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.nama : 'Uncategorized';
  };

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Products</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your catalog, pricing, and stock.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={18} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-zinc-900 outline-none" 
              placeholder="Search products..." 
            />
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Main Content Box (Tabel) */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-zinc-400 flex flex-col items-center gap-3">
            <PackageSearch size={32} className="animate-pulse" />
            Memuat data produk...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-sm text-zinc-400">Tidak ada produk ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Stock</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                        {/* PASTIKAN MANGGIL foto_url */}
                        {prod.foto_url ? (
                          <img src={prod.foto_url} alt={prod.nama} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-3 text-zinc-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{prod.nama}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-[200px]">{prod.deskripsi || '-'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-700">
                      <span className="bg-zinc-100 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200">
                        {getCategoryName(prod.category_id)}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-zinc-900">
                      Rp {prod.harga?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${prod.stok <= 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {prod.stok}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleOpenEdit(prod)} className="text-zinc-400 hover:text-zinc-900 p-2 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(prod.id)} className="text-zinc-400 hover:text-red-600 p-2 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL FORM PRODUCT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col flex-shrink-0 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-2 rounded-full transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <form id="productForm" onSubmit={handleSave} className="overflow-y-auto p-6 md:p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Basic Info</h3>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Description</label>
                    <textarea rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Category</label>
                    <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none">
                      <option value="">-- Select Category --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-100" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Pricing & Inventory</h3>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Price (Rp) <span className="text-red-500">*</span></label>
                    <input type="number" required min="0" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Stock <span className="text-red-500">*</span></label>
                    <input type="number" required min="0" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none" />
                  </div>
                </div>
              </div>

              <hr className="border-zinc-100" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Product Image</h3>
                </div>
                <div className="md:col-span-2">
                  <label className="relative border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group min-h-[200px] overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity" />
                    ) : (
                      <>
                        <UploadCloud className="text-zinc-400 mb-4" size={32} />
                        <h4 className="font-semibold text-zinc-900">Upload product image</h4>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

            </form>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100">Cancel</button>
              <button type="submit" form="productForm" className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800">Save Product</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}