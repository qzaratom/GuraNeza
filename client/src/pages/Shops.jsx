import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const SearchIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const ShopIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const PackageIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const ChevronDown = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const PhoneIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const EmailIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const CategoryIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"/></svg>);
const EyeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const PlusIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>);
const EditIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const DeleteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const StoreIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const ImageIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>);
const ArrowUpIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
const UserIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const XIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>);

function Shops() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("market");
  const [shops, setShops] = useState([]);
  const [myShop, setMyShop] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [manageMode, setManageMode] = useState(false);
  const [searchShop, setSearchShop] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  
  const [formData, setFormData] = useState({
    shop_name: "",
    description: "",
    category: "",
    location: "",
    phone: "",
    email: "",
    poster_image: "",
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const categories = [
    "Electronics", "Fashion", "Groceries", "Home & Living",
    "Beauty & Personal Care", "Agriculture", "Automotive",
    "Sports & Fitness", "Books & Educational", "Other"
  ];

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    fetchShops();
    if (user) fetchMyShop();
  }, [user]);

  const fetchShops = async () => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/shops", { credentials: "include" });
      const data = await response.json();
      if (data.success) setShops(data.shops);
    } catch (err) {} finally { setLoading(false); }
  };

  const fetchMyShop = async () => {
    try {
      const response = await fetch("https://guraneza.onrender.com/api/shops/my-shop", { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setMyShop(data.shop);
        setMyProducts(data.products || []);
        if (data.shop) {
          setFormData({
            shop_name: data.shop.shop_name || "",
            description: data.shop.description || "",
            category: data.shop.category || "",
            location: data.shop.location || user?.location || "",
            phone: data.shop.phone || user?.phone_number || "",
            email: data.shop.email || user?.email || "",
            poster_image: data.shop.poster_image || "",
          });
          if (data.shop.poster_image) setPosterPreview(data.shop.poster_image);
        }
      }
    } catch (err) {}
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
      setFormError("");
    }
  };

  const uploadPosterToCloudinary = async () => {
    if (!posterFile) return formData.poster_image || "";
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", posterFile);
    try {
      const response = await fetch("https://guraneza.onrender.com/api/upload/single", {
        method: "POST", credentials: "include", body: uploadFormData,
      });
      const data = await response.json();
      if (data.success) return data.imageUrl;
      throw new Error("Upload failed");
    } catch (err) { throw new Error("Poster upload failed"); }
    finally { setUploading(false); }
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!formData.shop_name.trim()) { setFormError("Shop name is required"); return; }
    setFormLoading(true); setFormError(""); setFormSuccess("");
    try {
      let posterUrl = formData.poster_image;
      if (posterFile) posterUrl = await uploadPosterToCloudinary();
      const response = await fetch("https://guraneza.onrender.com/api/shops", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ ...formData, poster_image: posterUrl }),
      });
      const data = await response.json();
      if (data.success) {
        setFormSuccess("Shop created!");
        setShowCreateForm(false);
        setPosterFile(null); setPosterPreview("");
        fetchMyShop(); fetchShops();
      } else setFormError(data.message);
    } catch (err) { setFormError("Failed to create shop"); }
    finally { setFormLoading(false); }
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    if (!formData.shop_name.trim()) { setFormError("Shop name is required"); return; }
    setFormLoading(true); setFormError(""); setFormSuccess("");
    try {
      let posterUrl = formData.poster_image;
      if (posterFile) posterUrl = await uploadPosterToCloudinary();
      const response = await fetch(`https://guraneza.onrender.com/api/shops/${myShop.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ ...formData, poster_image: posterUrl }),
      });
      const data = await response.json();
      if (data.success) {
        setFormSuccess("Shop updated!");
        setShowEditForm(false);
        setPosterFile(null);
        fetchMyShop(); fetchShops();
      } else setFormError(data.message);
    } catch (err) { setFormError("Failed to update shop"); }
    finally { setFormLoading(false); }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://guraneza.onrender.com/api/products/${productId}`, {
        method: "DELETE", credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setMyProducts(prev => prev.filter(p => p.id !== productId));
        setDeleteConfirm(null);
      }
    } catch (err) {}
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date(); const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const resetForm = () => {
    setFormError(""); setFormSuccess("");
    setPosterFile(null); setPosterPreview("");
  };

  const filteredShops = shops.filter(shop => 
    shop.shop_name?.toLowerCase().includes(searchShop.toLowerCase()) ||
    shop.description?.toLowerCase().includes(searchShop.toLowerCase())
  );

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

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.06; } 95% { opacity: 0.06; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .hover-btn { transition: all 0.2s ease; cursor: pointer; }
        .hover-btn:hover { background: ${accentBg} !important; color: ${accent} !important; transform: translateY(-1px); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.25) !important; border-color: ${accent}40 !important; }
        input:focus, textarea:focus { border-color: ${accent} !important; outline: none; }
        .custom-select:focus { border-color: ${accent} !important; }
      `}</style>

      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.12 : 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(10,10,20,0.92)' : 'rgba(245,245,245,0.88)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.04 }}>
            <svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg>
          </div>
        ))}
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, width: 44, height: 44, borderRadius: '50%', background: accent, color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,227,9,0.3)' }}>
          <ArrowUpIcon />
        </button>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.02em' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShopIcon />
              </div>
              Shops
            </h1>
            <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', marginLeft: '0.3rem' }}>Browse marketplace shops or manage your own store</p>
          </div>

          {/* Search + Tabs Row */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.6rem', 
              background: bgBlur, backdropFilter: 'blur(20px) saturate(200%)', 
              borderRadius: 16, border: `1px solid ${borderColor}`, 
              padding: '0.6rem 1.2rem', flex: 1, minWidth: 250,
              boxSizing: 'border-box'
            }}>
              <SearchIcon />
              <input 
                type="text" 
                placeholder="Search shops by name or description..." 
                value={searchShop} 
                onChange={(e) => setSearchShop(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', padding: '0.3rem 0', outline: 'none', color: textColor }}
              />
              {searchShop && (
                <button onClick={() => setSearchShop("")} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }}>
                  <XIcon />
                </button>
              )}
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '0.3rem', background: bgBlur, backdropFilter: 'blur(20px) saturate(200%)', borderRadius: 14, padding: '0.3rem', border: `1px solid ${borderColor}`, flexShrink: 0 }}>
              <button 
                onClick={() => setActiveTab("market")} 
                style={{ 
                  padding: '0.55rem 1.4rem', borderRadius: 11, fontSize: '0.78rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeTab === "market" ? accent : 'transparent',
                  color: activeTab === "market" ? '#000' : textColor,
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <ShopIcon /> Market
              </button>
              <button 
                onClick={() => { setActiveTab("myshop"); if (!user) navigate("/login"); }} 
                style={{ 
                  padding: '0.55rem 1.4rem', borderRadius: 11, fontSize: '0.78rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeTab === "myshop" ? accent : 'transparent',
                  color: activeTab === "myshop" ? '#000' : textColor,
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <PackageIcon /> My Shop
              </button>
            </div>
          </div>

          {/* ============ MARKET TAB ============ */}
          {activeTab === "market" && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
                  <div style={{ width: 40, height: 40, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                  <p style={{ color: textMuted, marginTop: '1rem', fontSize: '0.85rem' }}>Loading shops...</p>
                </div>
              ) : filteredShops.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
                  <StoreIcon />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.8rem' }}>{shops.length === 0 ? "No shops yet" : "No shops match"}</h2>
                  <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>
                    {shops.length === 0 ? "Be the first to create a shop!" : "Try a different search term"}
                  </p>
                  {shops.length === 0 && (
                    <button onClick={() => { setActiveTab("myshop"); if (!user) navigate("/login"); else setShowCreateForm(true); }} style={{ marginTop: '1.2rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PlusIcon /> Create Shop</button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
                  {filteredShops.map((shop) => (
                    <div 
                      key={shop.id} 
                      className="card-hover"
                      onClick={() => navigate(`/shop/${shop.id}`)}
                      style={{ 
                        background: cardBg, backdropFilter: 'blur(16px) saturate(160%)', 
                        borderRadius: 18, border: `1px solid ${borderColor}`, 
                        overflow: 'hidden', cursor: 'pointer'
                      }}
                    >
                      {/* Banner */}
                      <div style={{ height: 140, background: darkMode ? 'rgba(0,227,9,0.04)' : 'rgba(0,227,9,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {shop.poster_image ? (
                          <img src={shop.poster_image} alt={shop.shop_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                            <StoreIcon />
                            <span style={{ fontSize: '0.65rem', color: textMuted }}>No poster</span>
                          </div>
                        )}
                        {/* Verified Badge */}
                        {shop.is_verified ? (
                          <span style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 700, background: accent, color: '#000', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)' }}>
                            <CheckIcon /> Verified
                          </span>
                        ) : (
                          <span style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600, background: 'rgba(245,158,11,0.9)', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)' }}>
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <h3 style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0, lineHeight: 1.2 }}>{shop.shop_name}</h3>
                          {shop.category && (
                            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 500, background: accentBg, color: accent, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '0.5rem' }}>
                              {shop.category}
                            </span>
                          )}
                        </div>
                        <p style={{ color: textMuted, fontSize: '0.72rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem', margin: '0.4rem 0 0 0' }}>
                          {shop.description || "No description provided"}
                        </p>

                        {/* Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.8rem', borderTop: `1px solid ${borderColor}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>
                              {(shop.owner_name || "S")[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.72rem', lineHeight: 1.2 }}>{shop.owner_name || "Unknown"}</div>
                              {shop.location && (
                                <div style={{ fontSize: '0.6rem', color: textMuted, display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                                  <LocationIcon /> {shop.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.68rem', color: textMuted }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, background: accentBg, padding: '4px 10px', borderRadius: 20, color: accent }}>
                              <PackageIcon /> {shop.product_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ MY SHOP TAB ============ */}
          {activeTab === "myshop" && (
            <div>
              {!user ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <UserIcon />
                  </div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '1rem' }}>Sign in required</h2>
                  <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>Please sign in to manage your shop</p>
                  <button onClick={() => navigate("/login")} style={{ marginTop: '1.2rem', padding: '0.7rem 2.5rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Sign In</button>
                </div>
              ) : !myShop && !showCreateForm ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <StoreIcon />
                  </div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '1rem' }}>No shop yet</h2>
                  <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem', maxWidth: 400, margin: '0.3rem auto 0' }}>Create your shop to start selling professionally with a dedicated storefront</p>
                  <button onClick={() => setShowCreateForm(true)} style={{ marginTop: '1.2rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PlusIcon /> Create My Shop</button>
                </div>
              ) : showCreateForm || showEditForm ? (
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                  {/* Form Card */}
                  <div style={{ background: formBg, backdropFilter: 'blur(20px) saturate(180%)', borderRadius: 24, padding: '2.2rem', border: `1px solid ${borderColor}`, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    
                    {/* Form Header */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.3rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 14, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {showEditForm ? <EditIcon /> : <StoreIcon />}
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                          {showEditForm ? "Edit Shop" : "Create Your Shop"}
                        </h2>
                      </div>
                      <p style={{ color: textMuted, fontSize: '0.75rem', margin: '0.3rem 0 0 3.2rem' }}>
                        {showEditForm ? "Update your shop information" : "Fill in the details to set up your shop"}
                      </p>
                    </div>

                    {/* Alerts */}
                    {formError && (
                      <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 14, color: '#ff4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <XIcon /> {formError}
                      </div>
                    )}
                    {formSuccess && (
                      <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', background: accentBg, border: `1px solid ${accent}40`, borderRadius: 14, color: accent, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckIcon /> {formSuccess}
                      </div>
                    )}

                    <form onSubmit={showEditForm ? handleUpdateShop : handleCreateShop} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      
                      {/* Shop Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Shop Name *</label>
                        <input type="text" name="shop_name" value={formData.shop_name} onChange={handleFormChange} placeholder="Enter your shop name" 
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                      </div>

                      {/* Description */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Describe what your shop offers..." rows={3}
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, resize: 'vertical', minHeight: 80, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                      </div>

                      {/* Category - Custom Dropdown */}
                      <div ref={categoryRef} style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category</label>
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
                            <CategoryIcon />
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
                            maxHeight: 220, overflowY: 'auto', padding: '0.4rem',
                            animation: 'slideDown 0.15s ease'
                          }}>
                            {categories.map(cat => (
                              <div 
                                key={cat}
                                onClick={() => { setFormData(prev => ({ ...prev, category: cat })); setCategoryOpen(false); }}
                                style={{ 
                                  padding: '0.6rem 1rem', borderRadius: 10, cursor: 'pointer',
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

                      {/* Location + Phone */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location</label>
                          <input type="text" name="location" value={formData.location} onChange={handleFormChange} placeholder="e.g. Kigali, Rwanda"
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Phone</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="e.g. 0789564312"
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="e.g. shop@example.com"
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
                      </div>

                      {/* Poster Upload */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.5rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {showEditForm ? "Poster Image" : "Poster Image"}
                        </label>
                        {posterPreview ? (
                          <div style={{ position: 'relative', width: '100%', height: 170, borderRadius: 16, overflow: 'hidden', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.05)' }}>
                            <img src={posterPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" onClick={() => { setPosterFile(null); setPosterPreview(""); setFormData(prev => ({...prev, poster_image: ""})); }} 
                              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                              <XIcon />
                            </button>
                          </div>
                        ) : (
                          <label style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', 
                            padding: '2rem', borderRadius: 16, border: `2px dashed ${borderColor}`, cursor: 'pointer', 
                            transition: 'all 0.2s ease', background: inputBg, minHeight: 120
                          }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = borderColor}
                          >
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ImageIcon />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '0.8rem', fontWeight: 500, margin: 0 }}>Upload Poster Image</p>
                              <p style={{ fontSize: '0.65rem', color: textMuted, margin: '0.2rem 0 0' }}>PNG, JPG or WebP • Max 5MB</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handlePosterChange} style={{ display: 'none' }} />
                          </label>
                        )}
                        {posterPreview && (
                          <label style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                            padding: '0.7rem', borderRadius: 14, border: `1px solid ${borderColor}`, cursor: 'pointer', 
                            fontSize: '0.75rem', color: textMuted, transition: 'all 0.2s ease'
                          }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = borderColor}
                          >
                            <ImageIcon /> Change Poster
                            <input type="file" accept="image/*" onChange={handlePosterChange} style={{ display: 'none' }} />
                          </label>
                        )}
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button type="submit" disabled={formLoading || uploading} 
                          style={{ 
                            flex: 1, padding: '0.8rem', borderRadius: 14, border: 'none',
                            background: formLoading || uploading ? `${accent}60` : accent,
                            color: '#000', fontWeight: 700, fontSize: '0.85rem', 
                            cursor: (formLoading || uploading) ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                            transition: 'all 0.2s ease'
                          }}>
                          {uploading ? "Uploading..." : formLoading ? "Saving..." : showEditForm ? "Save Changes" : "Create Shop"}
                        </button>
                        <button type="button" onClick={() => { showEditForm ? setShowEditForm(false) : setShowCreateForm(false); resetForm(); }} 
                          style={{ 
                            padding: '0.8rem 1.8rem', borderRadius: 14, 
                            border: `1px solid ${borderColor}`, background: 'transparent',
                            color: textColor, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Shop Banner */}
                  <div onClick={() => navigate(`/shop/${myShop.id}`)} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: '1.8rem', cursor: 'pointer' }} className="card-hover">
                    <div style={{ height: 220, background: darkMode ? 'rgba(0,227,9,0.04)' : 'rgba(0,227,9,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {myShop.poster_image ? (
                        <img src={myShop.poster_image} alt={myShop.shop_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <StoreIcon />
                      )}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '1.5rem 1.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ color: 'white' }}>
                          <h2 style={{ fontSize: '1.7rem', fontWeight: 700, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{myShop.shop_name}</h2>
                          <p style={{ fontSize: '0.82rem', opacity: 0.9, margin: '0.3rem 0', maxWidth: 500, lineHeight: 1.4 }}>{myShop.description || "No description"}</p>
                          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', fontSize: '0.7rem', opacity: 0.8, flexWrap: 'wrap' }}>
                            {myShop.category && <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 20 }}><CategoryIcon /> {myShop.category}</span>}
                            {myShop.location && <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 20 }}><LocationIcon /> {myShop.location}</span>}
                            {myShop.is_verified && <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: accent, color: '#000', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}><CheckIcon /> Verified</span>}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setShowEditForm(true); }} 
                          style={{ padding: '0.6rem 1.5rem', borderRadius: 30, background: 'white', color: '#1a1a2e', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <EditIcon /> Edit Shop
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.4rem', border: `1px solid ${borderColor}`, marginBottom: '1.8rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em', color: textMuted }}>
                      Contact Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem', borderRadius: 14, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><EmailIcon /></div>
                        <div><div style={{ fontSize: '0.6rem', color: textMuted, textTransform: 'uppercase' }}>Email</div><div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{myShop.email || "N/A"}</div></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem', borderRadius: 14, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><PhoneIcon /></div>
                        <div><div style={{ fontSize: '0.6rem', color: textMuted, textTransform: 'uppercase' }}>Phone</div><div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{myShop.phone || "N/A"}</div></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem', borderRadius: 14, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LocationIcon /></div>
                        <div><div style={{ fontSize: '0.6rem', color: textMuted, textTransform: 'uppercase' }}>Location</div><div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{myShop.location || "N/A"}</div></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem', borderRadius: 14, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: myShop.is_verified ? accentBg : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckIcon /></div>
                        <div><div style={{ fontSize: '0.6rem', color: textMuted, textTransform: 'uppercase' }}>Status</div><div style={{ fontWeight: 600, fontSize: '0.8rem', color: myShop.is_verified ? accent : '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>{myShop.is_verified ? <><CheckIcon /> Verified</> : "Pending"}</div></div>
                      </div>
                    </div>
                  </div>

                  {/* Products Section */}
                  <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.4rem', border: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <PackageIcon /> Products ({myProducts.length})
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setManageMode(!manageMode)}
                          style={{
                            padding: '0.5rem 1.2rem', borderRadius: 25, fontSize: '0.72rem', fontWeight: 600,
                            border: manageMode ? '1px solid #ff4444' : `1px solid ${borderColor}`,
                            background: manageMode ? 'rgba(255,0,0,0.06)' : 'transparent',
                            color: manageMode ? '#ff4444' : textColor, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s ease'
                          }}>
                          {manageMode ? "Done" : "Manage"}
                        </button>
                        <Link to="/sell" style={{ padding: '0.5rem 1.2rem', borderRadius: 25, fontSize: '0.72rem', fontWeight: 700, background: accent, color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <PlusIcon /> Add Product
                        </Link>
                      </div>
                    </div>

                    {myProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <PackageIcon />
                        <p style={{ color: textMuted, marginTop: '0.8rem', fontSize: '0.85rem' }}>No products in your shop yet</p>
                        <Link to="/sell" style={{ marginTop: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.6rem 1.5rem', borderRadius: 25, background: accent, color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem' }}><PlusIcon /> Add Your First Product</Link>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.9rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.3rem' }}>
                        {myProducts.map((product) => (
                          <div key={product.id} className="card-hover" style={{ background: formBg, backdropFilter: 'blur(12px)', borderRadius: 14, overflow: 'hidden', border: `1px solid ${borderColor}`, position: 'relative' }}>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <div style={{ aspectRatio: '1/1', background: 'rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {product.image_urls?.[0] ? (
                                  <img src={product.image_urls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <PackageIcon />
                                )}
                              </div>
                              <div style={{ padding: '0.8rem' }}>
                                <h4 style={{ fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{product.name}</h4>
                                <p style={{ fontWeight: 700, fontSize: '0.82rem', color: accent, margin: '0.3rem 0' }}>{Number(product.price).toLocaleString()} RWF</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: textMuted }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><ClockIcon /> {getTimeAgo(product.created_at)}</span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><EyeIcon /> {product.views || 0}</span>
                                </div>
                              </div>
                            </Link>

                            {manageMode && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0, transition: 'opacity 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                                <Link to={`/edit-product/${product.id}`} style={{ padding: '0.5rem 1rem', borderRadius: 10, background: 'white', color: '#1a1a2e', textDecoration: 'none', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <EditIcon /> Edit
                                </Link>
                                <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: '0.5rem 1rem', borderRadius: 10, background: '#ff4444', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <DeleteIcon /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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
            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.8rem', textAlign: 'center', fontSize: '0.6rem', color: textMuted }}>&copy; 2026 GuraNeza. Made in Rwanda 🇷🇼</div>
          </div>
        </footer>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 20, padding: '1.8rem', maxWidth: 400, width: '90%', border: `1px solid ${borderColor}`, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <DeleteIcon />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Delete Product?</h3>
            <p style={{ color: textMuted, fontSize: '0.8rem', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>This action cannot be undone. The product will be permanently removed from your shop.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleDeleteProduct(deleteConfirm)} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: '#ff4444', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}><DeleteIcon /> Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shops;