import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>);
const PackageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ImageIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>);
const CheckIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const ChevronDown = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);
const UserIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const ShopIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const TagIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);

function Sell() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "1",
    category: "",
    negotiable: false,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productCount, setProductCount] = useState({ count: 0, limit: 10, canAdd: true });
  const [listingType, setListingType] = useState("individual");
  const [myShop, setMyShop] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const categories = [
    "Electronics", "Fashion", "Groceries", "Home & Living",
    "Beauty & Personal Care", "Agriculture", "Motorcycle Parts & Accessories",
    "Construction Materials", "Office & School Supplies", "Baby & Kids",
    "Gaming", "Sports & Fitness", "Automotive", "Pet Supplies",
    "Kitchen & Dining", "Books & Educational Materials", "Gifts & Crafts",
    "Music & Audio Equipment", "Electrical & Solar Equipment", "Health & Wellness", "Other",
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (user) {
      fetchProductCount();
      fetchMyShop();
    }
  }, [user]);

  const fetchProductCount = async () => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/subscriptions/product-count", { credentials: "include" });
      const data = await response.json();
      if (data.success) setProductCount(data);
    } catch (err) {}
  };

  const fetchMyShop = async () => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/shops/my-shop", { credentials: "include" });
      const data = await response.json();
      if (data.success && data.shop) {
        setMyShop(data.shop);
        setListingType("shop");
      }
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    if (images.length === 0) return [];
    setUploading(true);
    const fd = new FormData();
    images.forEach((image) => fd.append("images", image));
    try {
      const response = await fetch("https://guraneza.onrender.com/api/upload/multiple", {
        method: "POST", credentials: "include", body: fd,
      });
      const data = await response.json();
      if (data.success) return data.images.map((img) => img.url);
      throw new Error(data.message || "Image upload failed");
    } catch (err) {
      throw new Error("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!formData.name.trim()) { setError("Product name is required"); return; }
    if (!formData.description.trim()) { setError("Description is required"); return; }
    if (!formData.price || Number(formData.price) <= 0) { setError("Please enter a valid price"); return; }
    if (!formData.category) { setError("Please select a category"); return; }

    if (listingType === "shop" && !myShop) {
      setError("You need to create a shop first. Go to Shops page to create one.");
      return;
    }

    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        try { imageUrls = await uploadImagesToCloudinary(); }
        catch (uploadErr) { setError(uploadErr.message); setLoading(false); return; }
      }

      const response = await fetch("https://guraneza.onrender.com/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity) || 1,
          category: formData.category,
          negotiable: formData.negotiable,
          owner_id: user.id,
          shop_id: listingType === "shop" ? myShop?.id : null,
          listing_type: listingType,
          image_urls: imageUrls,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(`Product listed successfully as ${listingType === "shop" ? "Shop Product" : "Individual Product"}!`);
        setFormData({ name: "", description: "", price: "", stock_quantity: "1", category: "", negotiable: false });
        setImages([]);
        setImagePreviews([]);
        fetchProductCount();
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setError(data.message || "Failed to create product");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Theme colors
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.95)' : 'rgba(255,255,255,0.95)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const formBg = darkMode ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.95)';

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, maxWidth: 400 }}>
          <LockIcon />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: darkMode ? 'white' : '#1a1a2e', marginTop: '1rem' }}>Please sign in</h2>
          <p style={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '0.85rem', marginTop: '0.3rem' }}>You need to be logged in to sell products</p>
          <button onClick={() => navigate("/login")} style={{ marginTop: '1.5rem', padding: '0.7rem 2rem', borderRadius: 30, background: '#00E309', color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.06; } 95% { opacity: 0.06; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .hover-btn { transition: all 0.2s ease; cursor: pointer; }
        .hover-btn:hover { background: ${accentBg} !important; color: ${accent} !important; }
        input:focus, textarea:focus { border-color: ${accent} !important; outline: none; }
      `}</style>

      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.12 : 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(10,10,20,0.92)' : 'rgba(245,245,245,0.88)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.04 }}>
            <svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.02em' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusIcon />
                </div>
                Sell a Product
              </h1>
              <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', marginLeft: '0.3rem' }}>Fill in the details below to list your product</p>
            </div>
            <Link to="/my-products" style={{ 
              padding: '0.55rem 1.3rem', borderRadius: 25, fontSize: '0.75rem', fontWeight: 600,
              border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'transparent', transition: 'all 0.2s ease'
            }}>
              <PackageIcon /> My Products
            </Link>
          </div>

          {/* Listing Type Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.5rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>List Product As</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => { setListingType("individual"); setError(""); }}
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: 14, fontSize: '0.8rem', fontWeight: 600,
                  border: listingType === "individual" ? `2px solid ${accent}` : `1px solid ${borderColor}`,
                  background: listingType === "individual" ? accentBg : inputBg,
                  color: listingType === "individual" ? accent : textColor,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <UserIcon /> Individual Seller
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!myShop) { setError("You need to create a shop first. Go to Shops page to create one."); return; }
                  setListingType("shop"); setError("");
                }}
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: 14, fontSize: '0.8rem', fontWeight: 600,
                  border: listingType === "shop" ? `2px solid ${accent}` : `1px solid ${borderColor}`,
                  background: listingType === "shop" ? accentBg : inputBg,
                  color: listingType === "shop" ? accent : textColor,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <ShopIcon /> {myShop ? myShop.shop_name : "Shop (Create First)"}
              </button>
            </div>
            {listingType === "shop" && myShop && (
              <p style={{ fontSize: '0.68rem', color: accent, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckIcon /> Listing as shop product from <strong>{myShop.shop_name}</strong>
              </p>
            )}
          </div>

          {/* Product Limit Warning */}
          {!productCount.canAdd && (
            <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⚠</span>
              You've reached your product limit ({productCount.count}/{productCount.limit}). 
              <Link to="/profile" style={{ color: accent, fontWeight: 600, textDecoration: 'underline' }}>Upgrade your plan</Link> to add more.
            </div>
          )}

          {/* Form Card */}
          <div style={{ background: formBg, backdropFilter: 'blur(20px) saturate(180%)', borderRadius: 24, padding: '2.2rem', border: `1px solid ${borderColor}`, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            
            {/* Success/Error Messages */}
            {success && (
              <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1rem', background: accentBg, border: `1px solid ${accent}40`, borderRadius: 14, color: accent, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon /></div>
                {success}
              </div>
            )}
            {error && (
              <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 14, color: '#ff4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <XIcon /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Product Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. iPhone 14 Pro Max"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your product in detail..." rows={4}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, resize: 'vertical', minHeight: 100, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
              </div>

              {/* Price + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Price (RWF) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" min="0"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Stock Quantity</label>
                  <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="1" min="1"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                </div>
              </div>

              {/* Category - Custom Dropdown */}
              <div ref={categoryRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category *</label>
                <button 
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  style={{ 
                    width: '100%', padding: '0.75rem 1rem', borderRadius: 14, 
                    border: `1px solid ${categoryOpen ? accent : borderColor}`,
                    background: inputBg, fontSize: '0.85rem', outline: 'none', 
                    color: formData.category ? textColor : textMuted, 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'space-between', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TagIcon />
                    {formData.category || "Select a category"}
                  </span>
                  <ChevronDown />
                </button>
                {categoryOpen && (
                  <div style={{ 
                    position: 'absolute', top: 'calc(100% + 0.4rem)', left: 0, right: 0,
                    background: dropdownBg, backdropFilter: 'blur(24px) saturate(200%)',
                    borderRadius: 14, border: `1px solid ${borderColor}`, 
                    boxShadow: '0 12px 32px rgba(0,0,0,0.2)', zIndex: 20,
                    maxHeight: 240, overflowY: 'auto', padding: '0.4rem',
                    animation: 'slideDown 0.15s ease'
                  }}>
                    {categories.map(cat => (
                      <div 
                        key={cat}
                        onClick={() => { setFormData(prev => ({ ...prev, category: cat })); setCategoryOpen(false); setError(""); }}
                        style={{ 
                          padding: '0.55rem 1rem', borderRadius: 10, cursor: 'pointer',
                          fontSize: '0.78rem', color: formData.category === cat ? accent : textColor,
                          background: formData.category === cat ? accentBg : 'transparent',
                          fontWeight: formData.category === cat ? 600 : 400,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { if (formData.category !== cat) e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}
                        onMouseLeave={(e) => { if (formData.category !== cat) e.currentTarget.style.background = 'transparent'; }}
                      >
                        {cat}
                        {formData.category === cat && <CheckIcon />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Negotiable Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, negotiable: !prev.negotiable }))}
                  style={{ 
                    width: 22, height: 22, borderRadius: 6, cursor: 'pointer',
                    border: formData.negotiable ? `2px solid ${accent}` : `2px solid ${borderColor}`,
                    background: formData.negotiable ? accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease', flexShrink: 0
                  }}
                >
                  {formData.negotiable && <CheckIcon />}
                </div>
                <label style={{ fontSize: '0.82rem', color: textColor, cursor: 'pointer' }} onClick={() => setFormData(prev => ({ ...prev, negotiable: !prev.negotiable }))}>
                  Price is negotiable
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.5rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Product Images (Max 5)</label>
                
                {imagePreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden' }}>
                        <img src={preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeImage(index)} 
                          style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                          <XIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imagePreviews.length < 5 && (
                  <label style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '1.5rem', borderRadius: 16, border: `2px dashed ${borderColor}`, cursor: 'pointer', 
                    transition: 'all 0.2s ease', background: inputBg, minHeight: 100
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = borderColor}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 500, margin: 0, color: textColor }}>Upload Product Images</p>
                      <p style={{ fontSize: '0.65rem', color: textMuted, margin: '0.2rem 0 0' }}>PNG, JPG or WebP • Max 5 images</p>
                    </div>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={loading || uploading || !productCount.canAdd}
                  style={{ 
                    flex: 1, padding: '0.85rem', borderRadius: 14, border: 'none',
                    background: (loading || uploading || !productCount.canAdd) ? `${accent}60` : accent,
                    color: '#000', fontWeight: 700, fontSize: '0.9rem', 
                    cursor: (loading || uploading || !productCount.canAdd) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    transition: 'all 0.2s ease'
                  }}>
                  {uploading ? "Uploading images..." : loading ? "Listing Product..." : <><PlusIcon /> List Product</>}
                </button>
                <Link to="/my-products" style={{ 
                  padding: '0.85rem 1.5rem', borderRadius: 14, 
                  border: `1px solid ${borderColor}`, background: 'transparent',
                  color: textColor, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}>
                  <PackageIcon /> My Products
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, background: bgBlur, backdropFilter: 'blur(20px) saturate(200%)', padding: '1.5rem 1.5rem 1rem', borderTop: `1px solid ${borderColor}`, marginTop: 'auto' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <img src={logo} alt="GuraNeza" style={{ width: 26, height: 26, objectFit: 'contain' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: textColor }}>GURANEZA</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: textMuted, margin: 0, lineHeight: 1.5 }}>Rwanda's trusted marketplace for buying and selling.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor, letterSpacing: '0.04em' }}>Quick Links</h4>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Home</Link>
              <Link to="/shops" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Shops</Link>
              <Link to="/sell" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Sell</Link>
              <Link to="/cart" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Cart</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor, letterSpacing: '0.04em' }}>Categories</h4>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Electronics</Link>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Fashion</Link>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Home & Living</Link>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Automotive</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor, letterSpacing: '0.04em' }}>Connect</h4>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {["M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21","M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z","M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29.94 29.94 0 001 11.75a29.94 29.94 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29.94 29.94 0 00.46-5.25 29.94 29.94 0 00-.46-5.33z","M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 16a4 4 0 110-8 4 4 0 010 8zM17.5 6.5h.01"].map((d, i) => (
                  <a key={i} href="#" target="_blank" rel="noopener noreferrer" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted, transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = accentBg; e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = textMuted; }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.8rem', textAlign: 'center', fontSize: '0.6rem', color: textMuted }}>&copy; 2026 GuraNeza. Made in Rwanda</div>
        </div>
      </footer>
    </div>
  );
}

export default Sell;