import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

// SVG Icons
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const FilterIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>);
const ExportIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>);
const PlusIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const DeleteIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const ImageIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>);
const ProductsIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const EyeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const ChevronDown = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);

function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock_quantity: "1", category: "", negotiable: false });
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productFormSuccess, setProductFormSuccess] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const categories = ["Electronics", "Fashion", "Groceries", "Home & Living", "Beauty & Personal Care", "Agriculture", "Motorcycle Parts", "Construction Materials", "Office & School Supplies", "Baby & Kids", "Gaming", "Sports & Fitness", "Automotive", "Pet Supplies", "Kitchen & Dining", "Books & Educational", "Gifts & Crafts", "Music & Audio Equipment", "Electrical & Solar", "Health & Wellness", "Other"];

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://guraneza.onrender.com/api/admin/products", { credentials: "include" });
      const data = await res.json(); 
      if (data.success) setProducts(data.products);
    } catch (err) {} finally { setLoading(false); }
  };

  const verifyProduct = async (productId) => {
    try { 
      await fetch(`https://guraneza.onrender.com/api/admin/products/${productId}/verify`, { method: "PUT", credentials: "include" }); 
      setMessage("Product verified!"); 
      setTimeout(() => setMessage(""), 3000); 
      fetchProducts(); 
    } catch (err) {}
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Delete this product permanently?")) return;
    try { 
      await fetch(`https://guraneza.onrender.com/api/products/${productId}`, { method: "DELETE", credentials: "include" }); 
      setMessage("Product deleted!"); 
      setTimeout(() => setMessage(""), 3000); 
      fetchProducts(); 
    } catch (err) {}
  };

  const handleExport = () => { window.open("https://guraneza.onrender.com/api/admin/export/products", "_blank"); };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length > 5) { setProductFormError("Maximum 5 images allowed"); return; }
    setProductImages(prev => [...prev, ...files]);
    setProductImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  
  const removeProductImage = (i) => { 
    setProductImages(prev => prev.filter((_, idx) => idx !== i)); 
    setProductImagePreviews(prev => prev.filter((_, idx) => idx !== i)); 
  };
  
  const uploadImagesToCloudinary = async (imgs) => { 
    if (!imgs.length) return []; 
    const fd = new FormData(); 
    imgs.forEach(i => fd.append("images", i)); 
    const r = await fetch("https://guraneza.onrender.com/api/upload/multiple", { method: "POST", credentials: "include", body: fd }); 
    const d = await r.json(); 
    if (d.success) return d.images.map(i => i.url); 
    throw new Error("Upload failed"); 
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) { setProductFormError("Product name is required"); return; }
    if (!productForm.price || Number(productForm.price) <= 0) { setProductFormError("Valid price required"); return; }
    if (!productForm.category) { setProductFormError("Category required"); return; }
    setProductFormLoading(true); setProductFormError("");
    try {
      let imageUrls = []; 
      if (productImages.length > 0) imageUrls = await uploadImagesToCloudinary(productImages);
      const res = await fetch("https://guraneza.onrender.com/api/products", { 
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", 
        body: JSON.stringify({ 
          name: productForm.name.trim(), description: productForm.description.trim(), 
          price: Number(productForm.price), stock_quantity: Number(productForm.stock_quantity) || 1, 
          category: productForm.category, negotiable: productForm.negotiable, 
          owner_id: user.id, image_urls: imageUrls 
        }) 
      });
      const data = await res.json();
      if (data.success) { 
        setProductFormSuccess("Product added!"); 
        setProductForm({ name: "", description: "", price: "", stock_quantity: "1", category: "", negotiable: false }); 
        setProductImages([]); setProductImagePreviews([]); 
        setTimeout(() => { setShowAddProduct(false); setProductFormSuccess(""); fetchProducts(); }, 1500); 
      } else { setProductFormError(data.message); }
    } catch (err) { setProductFormError("Failed to add product"); } finally { setProductFormLoading(false); }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = filterVerified === "all" || (filterVerified === "yes" ? p.verified : !p.verified);
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesVerified && matchesCategory;
  });

  return (
    <div>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .table-row:hover { background: rgba(255,255,255,0.02) !important; }
        input:focus, textarea:focus { border-color: #00E309 !important; outline: none; }
      `}</style>

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: 'rgba(0,227,9,0.15)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '12px 20px', border: '1px solid rgba(0,227,9,0.3)', color: '#00E309', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <CheckIcon /> {message}
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'rgba(255,255,255,0.03)', borderRadius: 14, 
          border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem 1rem',
          flex: 1, minWidth: 220, maxWidth: 400
        }}>
          <SearchIcon />
          <input type="text" placeholder="Search products or sellers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'white', outline: 'none' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <XIcon />
            </button>
          )}
        </div>

        <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)}
          style={{ padding: '0.55rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="yes">Verified</option>
          <option value="no">Pending</option>
        </select>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: '0.55rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button onClick={handleExport}
          style={{ padding: '0.55rem 1.2rem', borderRadius: 14, border: '1px solid rgba(0,227,9,0.3)', background: 'rgba(0,227,9,0.08)', color: '#00E309', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
          <ExportIcon /> Export
        </button>

        <button onClick={() => setShowAddProduct(true)}
          style={{ padding: '0.55rem 1.2rem', borderRadius: 14, border: 'none', background: '#00E309', color: '#000', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
          <PlusIcon /> Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: 'rgba(20,20,40,0.95)', backdropFilter: 'blur(24px)', 
            borderRadius: 24, padding: '2rem', maxWidth: 650, width: '90%', 
            maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusIcon /> Add New Product
              </h2>
              <button onClick={() => { setShowAddProduct(false); setProductFormError(""); }}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XIcon />
              </button>
            </div>

            {productFormError && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 12, color: '#ff4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><XIcon /> {productFormError}</div>}
            {productFormSuccess && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(0,227,9,0.06)', border: '1px solid rgba(0,227,9,0.2)', borderRadius: 12, color: '#00E309', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckIcon /> {productFormSuccess}</div>}

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Product Name *</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm(p => ({...p, name: e.target.value}))} placeholder="Enter product name"
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm(p => ({...p, description: e.target.value}))} rows={3} placeholder="Describe the product..."
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Price (RWF) *</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm(p => ({...p, price: e.target.value}))} placeholder="0"
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Stock</label>
                  <input type="number" value={productForm.stock_quantity} onChange={e => setProductForm(p => ({...p, stock_quantity: e.target.value}))} placeholder="1"
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div ref={categoryRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category *</label>
                <button type="button" onClick={() => setCategoryOpen(!categoryOpen)}
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: productForm.category ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FilterIcon /> {productForm.category || "Select category"}</span>
                  <ChevronDown />
                </button>
                {categoryOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(20,20,40,0.98)', backdropFilter: 'blur(20px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 20, maxHeight: 200, overflowY: 'auto', padding: '0.3rem', marginTop: '0.3rem', animation: 'slideDown 0.15s ease' }}>
                    {categories.map(cat => (
                      <div key={cat} onClick={() => { setProductForm(p => ({...p, category: cat})); setCategoryOpen(false); }}
                        style={{ padding: '0.5rem 0.8rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', color: productForm.category === cat ? '#00E309' : 'white', background: productForm.category === cat ? 'rgba(0,227,9,0.08)' : 'transparent', fontWeight: productForm.category === cat ? 600 : 400 }}>
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div onClick={() => setProductForm(p => ({...p, negotiable: !p.negotiable}))}
                  style={{ width: 20, height: 20, borderRadius: 6, border: productForm.negotiable ? '2px solid #00E309' : '2px solid rgba(255,255,255,0.2)', background: productForm.negotiable ? '#00E309' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  {productForm.negotiable && <CheckIcon />}
                </div>
                <label style={{ fontSize: '0.8rem', color: 'white', cursor: 'pointer' }} onClick={() => setProductForm(p => ({...p, negotiable: !p.negotiable}))}>Price is negotiable</label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Images (Max 5)</label>
                {productImagePreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    {productImagePreviews.map((preview, i) => (
                      <div key={i} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden' }}>
                        <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeProductImage(i)}
                          style={{ position: 'absolute', top: 3, right: 3, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                          <XIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '1.5rem', borderRadius: 14, border: '2px dashed rgba(255,255,255,0.1)', 
                  cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.02)'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00E309'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                  <ImageIcon />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Upload images</span>
                  <input type="file" accept="image/*" multiple onChange={handleProductImageChange} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', paddingTop: '0.5rem' }}>
                <button type="submit" disabled={productFormLoading}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: 14, border: 'none', background: productFormLoading ? 'rgba(0,227,9,0.4)' : '#00E309', color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: productFormLoading ? 'not-allowed' : 'pointer' }}>
                  {productFormLoading ? "Adding..." : "Add Product"}
                </button>
                <button type="button" onClick={() => { setShowAddProduct(false); setProductFormError(""); }}
                  style={{ padding: '0.8rem 1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ 
        background: 'rgba(26,26,46,0.5)', backdropFilter: 'blur(16px)',
        borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Product</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Price</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Category</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Seller</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Status</th>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#00E309', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.8rem', fontSize: '0.8rem' }}>Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
                    <ProductsIcon />
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.8rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.03)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ProductsIcon />}
                        </div>
                        <span style={{ fontWeight: 500, color: 'white', fontSize: '0.8rem' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: '#00E309', fontWeight: 600, whiteSpace: 'nowrap' }}>{Number(p.price).toLocaleString()} RWF</td>
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{p.category || "N/A"}</td>
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{p.username}</td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ 
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600,
                        background: p.verified ? 'rgba(0,227,9,0.1)' : 'rgba(245,158,11,0.1)',
                        color: p.verified ? '#00E309' : '#f59e0b',
                        border: `1px solid ${p.verified ? 'rgba(0,227,9,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        display: 'inline-flex', alignItems: 'center', gap: '0.2rem'
                      }}>
                        {p.verified ? <><CheckIcon /> Verified</> : "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {!p.verified && (
                          <button onClick={() => verifyProduct(p.id)}
                            style={{ padding: '0.4rem 0.9rem', borderRadius: 20, border: '1px solid rgba(0,227,9,0.3)', background: 'rgba(0,227,9,0.08)', color: '#00E309', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckIcon /> Verify
                          </button>
                        )}
                        <button onClick={() => deleteProduct(p.id)}
                          style={{ padding: '0.4rem 0.9rem', borderRadius: 20, border: '1px solid rgba(255,0,0,0.3)', background: 'rgba(255,0,0,0.06)', color: '#ff4444', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <DeleteIcon /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div style={{ padding: '0.7rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>{products.filter(p => p.verified).length} verified • {products.filter(p => !p.verified).length} pending</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminProducts;