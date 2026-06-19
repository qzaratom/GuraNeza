import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const ShopIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const PackageIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const PhoneIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const EmailIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const CategoryIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const CartIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>);
const HandshakeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>);
const MessageIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const ArrowUpIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
const ArrowLeftIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
const ResetIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>);
const EyeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);

function ShopView() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const shopId = id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentShop, setCurrentShop] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    if (!shopId) {
      setError("No shop ID provided");
      setLoading(false);
      return;
    }
    fetchShopData();
  }, [shopId]);

  const fetchShopData = async () => {
    setLoading(true);
    setError("");
    try {
      const shopRes = await fetch(`http://localhost:5000/api/shops/${shopId}`, { 
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      
      if (shopRes.ok) {
        const shopData = await shopRes.json();
        if (shopData.success && shopData.shop) {
          setCurrentShop(shopData.shop);
        } else if (shopData.shop) {
          setCurrentShop(shopData.shop);
        }
      }

      if (!currentShop) {
        const altRes = await fetch("http://localhost:5000/api/shops", { credentials: "include" });
        const altData = await altRes.json();
        if (altData.success && altData.shops) {
          const found = altData.shops.find(s => s.id == shopId || s.shop_id == shopId);
          if (found) {
            setCurrentShop(found);
          } else {
            setError("Shop not found");
            setLoading(false);
            return;
          }
        }
      }

      // Fetch products
      let products = [];
      const prodRes = await fetch(`http://localhost:5000/api/shops/${shopId}/products`, { 
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && prodData.products) {
          products = prodData.products;
        }
      }

      if (products.length === 0) {
        const allProdRes = await fetch("http://localhost:5000/api/products", { credentials: "include" });
        const allProdData = await allProdRes.json();
        if (allProdData.success && allProdData.products) {
          const shop = currentShop || {};
          products = allProdData.products.filter(p => 
            p.shop_id == shopId || p.shopId == shopId || p.owner_id == shop.owner_id
          );
        }
      }

      // Sort by newest first
      products.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
      setShopProducts(products);
      setFilteredProducts(products);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load shop data");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { 
      setCartMessage("Please sign in to add items"); 
      setTimeout(() => setCartMessage(""), 2500); 
      return; 
    }
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setCartMessage("Added to cart successfully");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        setCartMessage(data.message || "Failed to add item");
      }
      setTimeout(() => setCartMessage(""), 2500);
    } catch (err) {
      setCartMessage("Error adding to cart");
      setTimeout(() => setCartMessage(""), 2500);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = [...shopProducts];
    
    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
      );
    }

    // Sort
    switch(sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt));
        break;
      case "price-low":
        filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [shopProducts, searchTerm, sortBy]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  // Theme
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.95)' : 'rgba(255,255,255,0.95)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';

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
        input:focus { border-color: ${accent} !important; outline: none; }
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

      {/* Cart Toast */}
      {cartMessage && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 300, background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 14, padding: '12px 20px', border: `1px solid ${borderColor}`, fontSize: '0.8rem', fontWeight: 500, animation: 'fadeIn 0.2s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon />
          </div>
          {cartMessage}
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, width: 44, height: 44, borderRadius: '50%', background: accent, color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,227,9,0.3)' }}>
          <ArrowUpIcon />
        </button>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '1.5rem 1.5rem', width: '100%' }}>
          
          {/* Back Button */}
          <button 
            onClick={() => navigate("/shops")} 
            className="hover-btn"
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
              background: bgBlur, backdropFilter: 'blur(16px)',
              border: `1px solid ${borderColor}`, borderRadius: 20, 
              padding: '0.5rem 1.2rem', fontSize: '0.78rem', 
              fontWeight: 500, color: textColor, cursor: 'pointer', marginBottom: '1.5rem' 
            }}
          >
            <ArrowLeftIcon /> Back to Shops
          </button>

          {/* LOADING */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 24, border: `1px solid ${borderColor}` }}>
              <div style={{ width: 44, height: 44, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
              <p style={{ color: textMuted, marginTop: '1rem', fontSize: '0.85rem', fontWeight: 500 }}>Loading shop...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 24, border: `1px solid ${borderColor}` }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <XIcon />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '1rem' }}>Error Loading Shop</h2>
              <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>{error}</p>
              <button onClick={() => navigate("/shops")} style={{ marginTop: '1.5rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <ArrowLeftIcon /> Go to Shops
              </button>
            </div>
          )}

          {/* SHOP CONTENT */}
          {!loading && !error && currentShop && (
            <div>
              {/* Shop Banner */}
              <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                <div style={{ height: 260, background: darkMode ? 'rgba(0,227,9,0.04)' : 'rgba(0,227,9,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {currentShop.poster_image ? (
                    <img src={currentShop.poster_image} alt={currentShop.shop_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', opacity: 0.4 }}>
                      <ShopIcon />
                      <span style={{ fontSize: '0.7rem', color: textMuted }}>No poster available</span>
                    </div>
                  )}
                </div>
                {/* Gradient Overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent 20%, rgba(0,0,0,0.9))', padding: '2rem 2rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ color: 'white', flex: 1, minWidth: 250 }}>
                      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.4)', letterSpacing: '-0.02em' }}>
                        {currentShop.shop_name}
                      </h1>
                      {currentShop.owner_name && (
                        <p style={{ fontSize: '0.8rem', opacity: 0.75, margin: '0.3rem 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          by {currentShop.owner_name}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {currentShop.category && (
                          <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CategoryIcon /> {currentShop.category}
                          </span>
                        )}
                        {currentShop.is_verified || currentShop.verified ? (
                          <span style={{ padding: '4px 12px', borderRadius: 20, background: accent, color: '#000', fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckIcon /> Verified
                          </span>
                        ) : (
                          <span style={{ padding: '4px 12px', borderRadius: 20, background: '#f59e0b', color: '#1a1a2e', fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '0.6rem 1.2rem', borderRadius: 16, color: 'white', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center', padding: '0 0.8rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{shopProducts.length}</div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Products</div>
                      </div>
                      <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
                      <div style={{ textAlign: 'center', padding: '0 0.8rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{shopProducts.filter(p => p.verified).length}</div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Details + About Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                
                {/* Contact Details */}
                <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.5rem', border: `1px solid ${borderColor}` }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.04em', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShopIcon /> Contact Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {currentShop.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem', borderRadius: 12, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <LocationIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.58rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location</div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{currentShop.location}</div>
                        </div>
                      </div>
                    )}
                    {currentShop.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem', borderRadius: 12, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <PhoneIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.58rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Phone</div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{currentShop.phone}</div>
                        </div>
                      </div>
                    )}
                    {currentShop.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem', borderRadius: 12, background: inputBg }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <EmailIcon />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.58rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email</div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{currentShop.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* About */}
                {currentShop.description && (
                  <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.5rem', border: `1px solid ${borderColor}` }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.8rem 0', textTransform: 'uppercase', letterSpacing: '0.04em', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShopIcon /> About This Shop
                    </h3>
                    <p style={{ color: textMuted, fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
                      {currentShop.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Products Section Header */}
              <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.3rem 1.5rem', border: `1px solid ${borderColor}`, marginBottom: '1.5rem' }}>
                
                {/* Search + Sort Row */}
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                  {/* Search */}
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: inputBg, borderRadius: 16, border: `1px solid ${borderColor}`, 
                    padding: '0.55rem 1rem', flex: 1, minWidth: 220
                  }}>
                    <SearchIcon />
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                      style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', padding: '0.2rem 0', outline: 'none', color: textColor }} />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }}>
                        <XIcon />
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div ref={sortRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button onClick={() => setSortOpen(!sortOpen)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.55rem 1rem', borderRadius: 16, 
                        border: `1px solid ${sortOpen ? accent : borderColor}`,
                        background: inputBg, fontSize: '0.78rem', fontWeight: 500,
                        color: textColor, cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'border-color 0.2s'
                      }}>
                      Sort: {sortOptions.find(o => o.value === sortBy)?.label || "Newest"}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    {sortOpen && (
                      <div style={{ 
                        position: 'absolute', top: 'calc(100% + 0.4rem)', right: 0, minWidth: 200,
                        background: dropdownBg, backdropFilter: 'blur(24px) saturate(200%)',
                        borderRadius: 14, border: `1px solid ${borderColor}`, 
                        boxShadow: '0 12px 32px rgba(0,0,0,0.2)', zIndex: 20,
                        padding: '0.4rem', animation: 'slideDown 0.15s ease'
                      }}>
                        {sortOptions.map(option => (
                          <div key={option.value}
                            onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                            style={{ 
                              padding: '0.55rem 1rem', borderRadius: 10, cursor: 'pointer',
                              fontSize: '0.75rem', color: sortBy === option.value ? accent : textColor,
                              background: sortBy === option.value ? accentBg : 'transparent',
                              fontWeight: sortBy === option.value ? 600 : 400,
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => { if (sortBy !== option.value) e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}
                            onMouseLeave={(e) => { if (sortBy !== option.value) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {option.label}
                            {sortBy === option.value && <CheckIcon />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Count */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: textMuted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <PackageIcon /> Showing {filteredProducts.length} of {shopProducts.length} products
                  </span>
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} style={{ background: 'transparent', border: 'none', color: accent, cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500 }}>
                      Clear search
                    </button>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', paddingBottom: '1rem' }}>
                {filteredProducts.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, border: `1px solid ${borderColor}` }}>
                    <PackageIcon />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.8rem' }}>No products found</h3>
                    <p style={{ color: textMuted, fontSize: '0.78rem', marginTop: '0.3rem' }}>
                      {searchTerm ? "Try adjusting your search terms" : "This shop has no products listed yet"}
                    </p>
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: 20, background: accent, color: '#000', border: 'none', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id || product.firebaseKey} className="card-hover" 
                      onClick={() => navigate(`/product/${product.id || product.productId}`)} 
                      style={{ background: cardBg, backdropFilter: 'blur(16px) saturate(160%)', borderRadius: 16, border: `1px solid ${borderColor}`, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Image */}
                      <div style={{ position: 'relative', aspectRatio: '1/1', background: 'rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {product.image_urls?.[0] || product.images?.[0] ? (
                          <img src={product.image_urls?.[0] || product.images?.[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <PackageIcon />
                        )}
                        {/* Verified Badge */}
                        <span style={{ 
                          position: 'absolute', top: 10, right: 10, padding: '4px 10px', borderRadius: 20, 
                          fontSize: '0.58rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
                          background: product.verified ? accent : '#f59e0b',
                          color: product.verified ? '#000' : '#1a1a2e',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {product.verified ? <><CheckIcon /> Verified</> : 'Pending'}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </h4>
                        
                        <p style={{ 
                          color: textMuted, fontSize: '0.68rem', lineHeight: 1.4, 
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden', margin: '0.35rem 0', flex: 1, minHeight: '1.8rem'
                        }}>
                          {product.description ? 
                            (product.description.length > 70 ? product.description.substring(0, 70) + "..." : product.description) 
                            : "No description"}
                        </p>

                        {/* Price + Negotiable */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: accent }}>
                            {Number(product.price || 0).toLocaleString()} RWF
                          </span>
                          {product.negotiable && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 20, background: accentBg, color: accent, fontSize: '0.58rem', fontWeight: 600 }}>
                              <HandshakeIcon /> NEG
                            </span>
                          )}
                        </div>

                        {/* Category + Time */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.62rem', color: textMuted, marginBottom: '0.6rem' }}>
                          {product.category && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: inputBg, padding: '2px 8px', borderRadius: 20 }}>
                              <CategoryIcon /> {product.category}
                            </span>
                          )}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <ClockIcon /> {product.created_at ? (() => {
                              const s = Math.floor((new Date() - new Date(product.created_at)) / 1000);
                              if (s < 60) return "Now";
                              if (s < 3600) return `${Math.floor(s/60)}m`;
                              if (s < 86400) return `${Math.floor(s/3600)}h`;
                              return `${Math.floor(s/86400)}d`;
                            })() : "N/A"}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto' }}>
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id || product.productId}`); }} 
                            style={{ flex: 1, padding: '0.5rem', borderRadius: 20, background: accent, color: '#000', border: 'none', fontWeight: 600, fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <MessageIcon /> View
                          </button>
                          <button onClick={(e) => addToCart(product.id || product.productId, e)} 
                            style={{ flex: 1, padding: '0.5rem', borderRadius: 20, background: 'transparent', color: accent, border: `1px solid ${accent}`, fontWeight: 600, fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <CartIcon /> Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.8rem', textAlign: 'center', fontSize: '0.6rem', color: textMuted }}>&copy; 2026 GuraNeza. Made in Rwanda</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ShopView;