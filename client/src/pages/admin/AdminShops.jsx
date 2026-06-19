import { useState, useEffect, useRef } from "react";

// SVG Icons
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const FilterIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>);
const ExportIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>);
const PlusIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const DeleteIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const EditIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const ImageIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>);
const ShopsIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const ChevronDown = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);
const UserIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const PackageIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const PhoneIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const EmailIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);

function AdminShops() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShopVerified, setFilterShopVerified] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAddShop, setShowAddShop] = useState(false);
  const [showEditShop, setShowEditShop] = useState(null);
  const [shopForm, setShopForm] = useState({ shop_name: "", description: "", category: "", location: "", phone: "", email: "", poster_image: "" });
  const [shopPosterFile, setShopPosterFile] = useState(null);
  const [shopPosterPreview, setShopPosterPreview] = useState("");
  const [shopFormLoading, setShopFormLoading] = useState(false);
  const [shopFormError, setShopFormError] = useState("");
  const [shopFormSuccess, setShopFormSuccess] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const categories = ["Electronics", "Fashion", "Groceries", "Home & Living", "Beauty & Personal Care", "Agriculture", "Automotive", "Sports & Fitness", "Books & Educational", "Other"];

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => { fetchShops(); }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/shops", { credentials: "include" });
      const data = await res.json(); 
      if (data.success) setShops(data.shops);
    } catch (err) {} finally { setLoading(false); }
  };

  const verifyShop = async (shopId) => {
    try { 
      await fetch(`http://localhost:5000/api/shops/${shopId}`, { 
        method: "PUT", headers: { "Content-Type": "application/json" }, 
        credentials: "include", body: JSON.stringify({ is_verified: true }) 
      }); 
      setMessage("Shop verified!"); 
      setTimeout(() => setMessage(""), 3000); 
      fetchShops(); 
    } catch (err) {}
  };

  const deleteShop = async (shopId) => {
    if (!confirm("Delete this shop permanently?")) return;
    try { 
      await fetch(`http://localhost:5000/api/shops/${shopId}`, { method: "DELETE", credentials: "include" }); 
      setMessage("Shop deleted!"); 
      setTimeout(() => setMessage(""), 3000); 
      fetchShops(); 
    } catch (err) {}
  };

  const handleExport = () => { window.open("http://localhost:5000/api/admin/export/shops", "_blank"); };

  const handleShopPosterChange = (e) => { 
    const file = e.target.files[0]; 
    if (file) { setShopPosterFile(file); setShopPosterPreview(URL.createObjectURL(file)); } 
  };
  
  const uploadPosterToCloudinary = async () => { 
    if (!shopPosterFile) return shopForm.poster_image || ""; 
    const fd = new FormData(); fd.append("image", shopPosterFile); 
    const r = await fetch("http://localhost:5000/api/upload/single", { method: "POST", credentials: "include", body: fd }); 
    const d = await r.json(); 
    if (d.success) return d.imageUrl; 
    throw new Error("Upload failed"); 
  };

  const handleCreateShop = async (e) => {
    e.preventDefault(); 
    if (!shopForm.shop_name.trim()) { setShopFormError("Shop name is required"); return; }
    setShopFormLoading(true); setShopFormError("");
    try {
      let posterUrl = shopForm.poster_image; 
      if (shopPosterFile) posterUrl = await uploadPosterToCloudinary();
      const res = await fetch("http://localhost:5000/api/shops", { 
        method: "POST", headers: { "Content-Type": "application/json" }, 
        credentials: "include", body: JSON.stringify({ ...shopForm, poster_image: posterUrl }) 
      });
      const data = await res.json();
      if (data.success) { 
        setShopFormSuccess("Shop created!"); 
        setShopForm({ shop_name: "", description: "", category: "", location: "", phone: "", email: "", poster_image: "" }); 
        setShopPosterFile(null); setShopPosterPreview(""); 
        setTimeout(() => { setShowAddShop(false); setShopFormSuccess(""); fetchShops(); }, 1500); 
      } else { setShopFormError(data.message); }
    } catch (err) { setShopFormError("Failed to create shop"); } finally { setShopFormLoading(false); }
  };

  const handleEditShop = (shop) => { 
    setShopForm({ 
      shop_name: shop.shop_name || "", description: shop.description || "", 
      category: shop.category || "", location: shop.location || "", 
      phone: shop.phone || "", email: shop.email || "", poster_image: shop.poster_image || "" 
    }); 
    setShopPosterPreview(shop.poster_image || ""); 
    setShopPosterFile(null); 
    setShowEditShop(shop); 
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault(); 
    if (!shopForm.shop_name.trim()) { setShopFormError("Shop name is required"); return; }
    setShopFormLoading(true); setShopFormError("");
    try {
      let posterUrl = shopForm.poster_image; 
      if (shopPosterFile) posterUrl = await uploadPosterToCloudinary();
      const res = await fetch(`http://localhost:5000/api/shops/${showEditShop.id}`, { 
        method: "PUT", headers: { "Content-Type": "application/json" }, 
        credentials: "include", body: JSON.stringify({ ...shopForm, poster_image: posterUrl }) 
      });
      const data = await res.json();
      if (data.success) { 
        setShopFormSuccess("Shop updated!"); 
        setShowEditShop(null); setShopPosterFile(null); setShopPosterPreview(""); 
        setTimeout(() => { setShopFormSuccess(""); fetchShops(); }, 1500); 
      } else { setShopFormError(data.message); }
    } catch (err) { setShopFormError("Failed to update shop"); } finally { setShopFormLoading(false); }
  };

  const filteredShops = shops.filter(s => {
    const matchesSearch = s.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.owner_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = filterShopVerified === "all" || (filterShopVerified === "yes" ? s.is_verified : !s.is_verified);
    return matchesSearch && matchesVerified;
  });

  const verifiedCount = shops.filter(s => s.is_verified).length;
  const pendingCount = shops.filter(s => !s.is_verified).length;

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

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(0,227,9,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(0,227,9,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#00E309', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Verified Shops</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00E309', margin: '0.3rem 0 0' }}>{verifiedCount}</p>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#f59e0b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Pending Shops</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', margin: '0.3rem 0 0' }}>{pendingCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'rgba(255,255,255,0.03)', borderRadius: 14, 
          border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem 1rem',
          flex: 1, minWidth: 220, maxWidth: 400
        }}>
          <SearchIcon />
          <input type="text" placeholder="Search shops by name or owner..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'white', outline: 'none' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <XIcon />
            </button>
          )}
        </div>

        <select value={filterShopVerified} onChange={e => setFilterShopVerified(e.target.value)}
          style={{ padding: '0.55rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="yes">Verified</option>
          <option value="no">Pending</option>
        </select>

        <button onClick={handleExport}
          style={{ padding: '0.55rem 1.2rem', borderRadius: 14, border: '1px solid rgba(0,227,9,0.3)', background: 'rgba(0,227,9,0.08)', color: '#00E309', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
          <ExportIcon /> Export
        </button>

        <button onClick={() => setShowAddShop(true)}
          style={{ padding: '0.55rem 1.2rem', borderRadius: 14, border: 'none', background: '#00E309', color: '#000', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
          <PlusIcon /> Create Shop
        </button>
      </div>

      {/* Add/Edit Shop Modal */}
      {(showAddShop || showEditShop) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: 'rgba(20,20,40,0.95)', backdropFilter: 'blur(24px)', 
            borderRadius: 24, padding: '2rem', maxWidth: 600, width: '90%', 
            maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {showEditShop ? <><EditIcon /> Edit Shop</> : <><PlusIcon /> Create New Shop</>}
              </h2>
              <button onClick={() => { setShowAddShop(false); setShowEditShop(null); setShopFormError(""); }}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XIcon />
              </button>
            </div>

            {shopFormError && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 12, color: '#ff4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><XIcon /> {shopFormError}</div>}
            {shopFormSuccess && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(0,227,9,0.06)', border: '1px solid rgba(0,227,9,0.2)', borderRadius: 12, color: '#00E309', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckIcon /> {shopFormSuccess}</div>}

            <form onSubmit={showEditShop ? handleUpdateShop : handleCreateShop} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Shop Name *</label>
                <input type="text" value={shopForm.shop_name} onChange={e => setShopForm(p => ({...p, shop_name: e.target.value}))} placeholder="Enter shop name"
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description</label>
                <textarea value={shopForm.description} onChange={e => setShopForm(p => ({...p, description: e.target.value}))} rows={3} placeholder="Describe the shop..."
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div ref={categoryRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category</label>
                <button type="button" onClick={() => setCategoryOpen(!categoryOpen)}
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: shopForm.category ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FilterIcon /> {shopForm.category || "Select category"}</span>
                  <ChevronDown />
                </button>
                {categoryOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(20,20,40,0.98)', backdropFilter: 'blur(20px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 20, maxHeight: 200, overflowY: 'auto', padding: '0.3rem', marginTop: '0.3rem', animation: 'slideDown 0.15s ease' }}>
                    {categories.map(cat => (
                      <div key={cat} onClick={() => { setShopForm(p => ({...p, category: cat})); setCategoryOpen(false); }}
                        style={{ padding: '0.5rem 0.8rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', color: shopForm.category === cat ? '#00E309' : 'white', background: shopForm.category === cat ? 'rgba(0,227,9,0.08)' : 'transparent', fontWeight: shopForm.category === cat ? 600 : 400 }}>
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location</label>
                  <input type="text" value={shopForm.location} onChange={e => setShopForm(p => ({...p, location: e.target.value}))} placeholder="e.g. Kigali"
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Phone</label>
                  <input type="text" value={shopForm.phone} onChange={e => setShopForm(p => ({...p, phone: e.target.value}))} placeholder="e.g. 0789564312"
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email</label>
                <input type="email" value={shopForm.email} onChange={e => setShopForm(p => ({...p, email: e.target.value}))} placeholder="shop@example.com"
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.85rem', color: 'white', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Poster Image</label>
                {shopPosterPreview && (
                  <div style={{ position: 'relative', width: '100%', height: 150, borderRadius: 12, overflow: 'hidden', marginBottom: '0.8rem', background: 'rgba(0,0,0,0.2)' }}>
                    <img src={shopPosterPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => { setShopPosterFile(null); setShopPosterPreview(""); setShopForm(p => ({...p, poster_image: ""})); }}
                      style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                      <XIcon />
                    </button>
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
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{shopPosterPreview ? "Change Poster" : "Upload Poster"}</span>
                  <input type="file" accept="image/*" onChange={handleShopPosterChange} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', paddingTop: '0.5rem' }}>
                <button type="submit" disabled={shopFormLoading}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: 14, border: 'none', background: shopFormLoading ? 'rgba(0,227,9,0.4)' : '#00E309', color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: shopFormLoading ? 'not-allowed' : 'pointer' }}>
                  {shopFormLoading ? "Saving..." : showEditShop ? "Update Shop" : "Create Shop"}
                </button>
                <button type="button" onClick={() => { setShowAddShop(false); setShowEditShop(null); setShopFormError(""); }}
                  style={{ padding: '0.8rem 1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shops Table */}
      <div style={{ 
        background: 'rgba(26,26,46,0.5)', backdropFilter: 'blur(16px)',
        borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Shop</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Owner</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Category</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Products</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Status</th>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#00E309', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.8rem', fontSize: '0.8rem' }}>Loading shops...</p>
                  </td>
                </tr>
              ) : filteredShops.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
                    <ShopsIcon />
                    <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', fontWeight: 500 }}>No shops found</p>
                  </td>
                </tr>
              ) : (
                filteredShops.map(s => (
                  <tr key={s.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.8rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ 
                          width: 36, height: 36, borderRadius: 8, 
                          background: 'rgba(255,255,255,0.03)', overflow: 'hidden', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {s.poster_image ? <img src={s.poster_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShopsIcon />}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: 'white', fontSize: '0.8rem' }}>{s.shop_name}</span>
                          {s.location && (
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.1rem' }}>
                              <LocationIcon /> {s.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <UserIcon /> {s.owner_name}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                      {s.category || "N/A"}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                        background: 'rgba(0,227,9,0.08)', color: '#00E309',
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                      }}>
                        <PackageIcon /> {s.product_count || 0}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600,
                        background: s.is_verified ? 'rgba(0,227,9,0.1)' : 'rgba(245,158,11,0.1)',
                        color: s.is_verified ? '#00E309' : '#f59e0b',
                        border: `1px solid ${s.is_verified ? 'rgba(0,227,9,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        {s.is_verified ? <><CheckIcon /> Verified</> : "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEditShop(s)}
                          style={{ padding: '0.4rem 0.9rem', borderRadius: 20, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <EditIcon /> Edit
                        </button>
                        {!s.is_verified && (
                          <button onClick={() => verifyShop(s.id)}
                            style={{ padding: '0.4rem 0.9rem', borderRadius: 20, border: '1px solid rgba(0,227,9,0.3)', background: 'rgba(0,227,9,0.08)', color: '#00E309', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckIcon /> Verify
                          </button>
                        )}
                        <button onClick={() => deleteShop(s.id)}
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
          <span>Showing {filteredShops.length} of {shops.length} shops</span>
          <span>{verifiedCount} verified • {pendingCount} pending</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminShops;