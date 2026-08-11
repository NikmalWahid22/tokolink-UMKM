import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, 
  ArrowLeft, UploadCloud, Bold, Italic, List as ListIcon, Link as LinkIcon, Image as ImageIcon 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatRupiah } from '../../lib/utils';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    sku: '',
    harga: 0,
    stok: 0,
    category_id: '',
    image_url: '',
    deskripsi: '',
    is_active: true
  });
  
  // State File Upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    const { data: prodData, error } = await supabase
      .from('products')
      .select('*, categories(nama)');
    
    if (!error && prodData) setProducts(prodData);
    setIsLoading(false);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, nama: '', sku: '', harga: '', stok: '', category_id: '', image_url: '', deskripsi: '', is_active: true });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setModalMode('edit');
    setFormData({
      id: product.id,
      nama: product.nama,
      sku: product.sku || '',
      harga: product.harga,
      stok: product.stok,
      category_id: product.category_id,
      image_url: product.image_url || '',
      deskripsi: product.deskripsi || '',
      is_active: product.is_active !== false
    });
    setImageFile(null);
    setImagePreview(product.image_url || '');
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
      let finalImageUrl = imagePreview; // Nanti diganti logika upload ke Supabase Storage

      const payload = {
        nama: formData.nama,
        sku: formData.sku,
        harga: Number(formData.harga),
        stok: Number(formData.stok),
        category_id: formData.category_id,
        image_url: finalImageUrl
        // deskripsi: formData.deskripsi, // Hapus komen jika kolom ini ada di database
        // is_active: formData.is_active  // Hapus komen jika kolom ini ada di database
      };

      if (modalMode === 'add') {
        await supabase.from('products').insert([payload]);
      } else {
        await supabase.from('products').update(payload).eq('id', formData.id);
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin mau hapus produk ini?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  };

  const StatusBadge = ({ stok }) => {
    if (stok > 0) return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] tracking-wide uppercase border border-emerald-200">Active</span>;
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500 font-bold text-[10px] tracking-wide uppercase border border-zinc-200">Out of Stock</span>;
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Products</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your catalog, pricing, and inventory.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-zinc-900 text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col">
        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-200">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <select className="appearance-none bg-zinc-50 border border-zinc-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-zinc-700 focus:border-zinc-900 focus:ring-0 outline-none cursor-pointer">
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nama}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select className="appearance-none bg-zinc-50 border border-zinc-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-zinc-700 focus:border-zinc-900 focus:ring-0 outline-none cursor-pointer">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="empty">Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <input type="text" placeholder="Search products..." className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-sm focus:border-zinc-900 focus:bg-white outline-none transition-colors" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">SKU</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Stock</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-sm">
              {isLoading ? (
                <tr><td colSpan="7" className="py-8 text-center text-zinc-400">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-zinc-400">Belum ada produk.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden border border-zinc-200 flex items-center justify-center">
                          {product.image_url ? <img src={product.image_url} alt={product.nama} className="w-full h-full object-cover" /> : <ImageIcon className="text-zinc-400" size={20} />}
                        </div>
                        <span className="font-semibold text-zinc-900">{product.nama}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 font-medium">{product.sku || '-'}</td>
                    <td className="py-4 px-6 text-zinc-500">{product.categories?.nama || 'Uncategorized'}</td>
                    <td className="py-4 px-6 font-semibold text-zinc-900">{formatRupiah(product.harga)}</td>
                    <td className="py-4 px-6 text-zinc-500">{product.stok}</td>
                    <td className="py-4 px-6"><StatusBadge stok={product.stok} /></td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(product)} className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-2 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- WIDE MODAL FORM (Desain Baru) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          
          <div className="bg-zinc-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col flex-shrink-0 animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-zinc-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-zinc-200 flex-shrink-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-zinc-100 text-zinc-600 rounded-full hover:bg-zinc-200 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                    {modalMode === 'add' ? 'Add Product' : 'Edit Product'}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-0.5">Create a new product listing in your catalog.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors hidden sm:block">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm">Save Product</button>
              </div>
            </div>

            {/* Modal Body (Scrollable Grid) */}
            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                
                {/* --- KOLOM KIRI (Basic Info, Deskripsi, Image) --- */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  
                  {/* Card: Basic Information */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-5">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Product Name</label>
                        <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" placeholder="e.g., Handcrafted Ceramic Mug" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">SKU</label>
                          <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" placeholder="e.g., CER-MUG-001" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Category</label>
                          <div className="relative">
                            <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors cursor-pointer text-zinc-700">
                              <option value="" disabled>Select category</option>
                              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nama}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Description */}
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 pb-4">
                      <h3 className="font-bold text-zinc-900">Description</h3>
                    </div>
                    <div className="px-6 pb-6 flex-1 flex flex-col">
                      <div className="bg-zinc-100/50 p-2 border border-zinc-200 border-b-0 rounded-t-xl flex gap-2">
                        <button className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"><Bold size={16}/></button>
                        <button className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"><Italic size={16}/></button>
                        <button className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"><ListIcon size={16}/></button>
                        <button className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"><LinkIcon size={16}/></button>
                      </div>
                      <textarea value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} rows="5" className="w-full bg-white border border-zinc-200 rounded-b-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none resize-y" placeholder="Describe the product details, materials, and care instructions..."></textarea>
                    </div>
                  </div>

                  {/* Card: Product Images */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-4">Product Images</h3>
                    <label className="relative border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer group min-h-[240px] overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity" />
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform">
                            <UploadCloud className="text-zinc-500" size={24} strokeWidth={1.5} />
                          </div>
                          <h4 className="font-semibold text-zinc-900 mb-1 text-sm">Click to upload or drag and drop</h4>
                          <p className="text-xs text-zinc-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </>
                      )}
                      {imagePreview && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2">
                            <ImageIcon size={16}/> Change Image
                          </span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* --- KOLOM KANAN (Harga, Stok, Visibilitas) --- */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  
                  {/* Card: Pricing & Inventory */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-5">Pricing & Inventory</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Price (IDR)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm font-medium">Rp</span>
                          <input type="number" min="0" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" placeholder="0" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Stock Quantity</label>
                        <input type="number" min="0" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-colors" placeholder="0" />
                      </div>
                    </div>
                  </div>

                  {/* Card: Visibility */}
                  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-4">Visibility</h3>
                    <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl bg-zinc-50">
                      <div>
                        <label className="font-semibold text-zinc-900 block text-sm">Active Status</label>
                        <p className="text-xs text-zinc-500 mt-0.5">Product will be visible in catalog.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                      </label>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}