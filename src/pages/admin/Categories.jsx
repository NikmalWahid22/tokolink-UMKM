import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Tag, X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  // State Data Form
  const [formData, setFormData] = useState({ 
    id: null, 
    nama: '', 
    deskripsi: '', 
    is_active: true 
  });
  
  // State File Upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data);
    setIsLoading(false);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, nama: '', deskripsi: '', is_active: true });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setModalMode('edit');
    setFormData({ 
      id: category.id, 
      nama: category.nama, 
      deskripsi: category.deskripsi || '', 
      is_active: category.is_active !== false 
    });
    setImageFile(null);
    setImagePreview(category.image_url || ''); // Tampilkan gambar lama jika ada
    setIsModalOpen(true);
  };

  // Handler untuk Preview Image lokal saat user milih file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Bikin URL sementara buat preview
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = imagePreview;

      // TODO: Logika Upload Gambar ke Supabase Storage (Nanti kita buat fungsinya)
      // if (imageFile) {
      //   const { data, error } = await supabase.storage.from('category-images').upload(namaFile, imageFile);
      //   finalImageUrl = url_gambar_dari_storage;
      // }

      const payload = { 
        nama: formData.nama, 
        // deskripsi: formData.deskripsi, // Uncomment jika di tabel categories ada kolom deskripsi
        // is_active: formData.is_active, // Uncomment jika di tabel categories ada kolom is_active
        image_url: finalImageUrl 
      };

      if (modalMode === 'add') {
        await supabase.from('categories').insert([payload]);
      } else {
        await supabase.from('categories').update(payload).eq('id', formData.id);
      }
      
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin mau hapus kategori ini?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* --- Header & Action Bar --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-zinc-400" size={18} />
          <input 
            className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-zinc-900 outline-none" 
            placeholder="Search categories..." 
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-sm whitespace-nowrap"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* --- Grid Kategori --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="h-32 bg-zinc-100 relative">
              {cat.image_url ? (
                <img src={cat.image_url} className="w-full h-full object-cover" alt={cat.nama} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400"><Tag size={40}/></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-3 left-4 text-xl font-bold text-white">{cat.nama}</h3>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Kategori</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(cat)} className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}

        {/* Card Tambah Cepat */}
        <div 
          onClick={handleOpenAdd}
          className="border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer transition-colors"
        >
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 mb-3">
            <Plus size={24} />
          </div>
          <p className="font-semibold text-zinc-900">Create New</p>
          <p className="text-xs text-zinc-500">Setup a new category</p>
        </div>
      </div>

      {/* --- WIDE MODAL FORM (Desain Stitch) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col flex-shrink-0 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Create a new product grouping for your catalog.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-2 rounded-full transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form id="categoryForm" onSubmit={handleSave} className="overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Section 1: Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Category Details</h3>
                  <p className="text-sm text-zinc-500">Basic information to identify and describe this category.</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Category Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none transition-colors"
                      placeholder="e.g., Handcrafted Ceramics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Description</label>
                    <textarea 
                      rows="4"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none transition-colors resize-y"
                      placeholder="Briefly describe what kind of products belong in this category..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-100" />

              {/* Section 2: Media Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Category Image</h3>
                  <p className="text-sm text-zinc-500">This image will appear on the storefront to represent the category.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="relative border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer group overflow-hidden min-h-[200px]">
                    
                    {/* Jika ada preview gambar, tampilkan gambar. Jika kosong, tampilkan ikon upload */}
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity" />
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform">
                          <UploadCloud className="text-zinc-400" size={32} strokeWidth={1.5} />
                        </div>
                        <h4 className="font-semibold text-zinc-900 mb-1">Click to upload image</h4>
                        <p className="text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      </>
                    )}
                    
                    {/* Teks Ganti Gambar jika sudah ada */}
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

              <hr className="border-zinc-100" />

              {/* Section 3: Visibility Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">Visibility</h3>
                  <p className="text-sm text-zinc-500">Control whether this category is visible to customers.</p>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                    <div className="flex-1">
                      <label className="font-semibold text-zinc-900 block text-sm">Active Status</label>
                      <p className="text-xs text-zinc-500 mt-1">If disabled, the category and its products will be hidden from the store.</p>
                    </div>
                    {/* Custom Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                    </label>
                  </div>
                </div>
              </div>

            </form>

            {/* Modal Footer / Actions */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-3 rounded-b-2xl">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="categoryForm"
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm"
              >
                {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}