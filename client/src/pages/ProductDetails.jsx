import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const ShopIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const PackageIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const PhoneIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const EmailIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const CategoryIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"/></svg>);
const EyeIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const ClockIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const CartIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>);
const HandshakeIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>);
const MessageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const UserIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const HeartIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>);
const HeartOutlineIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>);
const ArrowLeftIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
const ArrowRightIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
const ArrowUpIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
const StarIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
const VerifiedIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="#00E309" stroke="#000" strokeWidth="1"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z"/></svg>);

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        document.title = `${data.product.name} - GuraNeza`;
        if (data.product.owner_id) fetchSellerProfile(data.product.owner_id);
        if (data.product.category) fetchSimilarProducts(data.product.category, data.product.id);
        recordView();
        fetchLikes();
      } else { setError("Product not found"); }
    } catch (err) { setError("Failed to load product"); }
    finally { setLoading(false); }
  };

  const fetchSellerProfile = async (sellerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/user/${sellerId}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) setSeller(data.user);
    } catch (err) {}
  };

  const recordView = async () => {
    try { await fetch(`http://localhost:5000/api/products/interact/${id}/view`, { method: "POST" }); } catch (err) {}
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/interact/${id}/likes`, { credentials: "include" });
      const data = await response.json();
      if (data.success) { setLikes(data.likes); setUserLiked(data.userLiked); }
    } catch (err) {}
  };

  const handleLike = async () => {
    if (!user) { setCartMessage("Please sign in to like"); setTimeout(() => setCartMessage(""), 3000); return; }
    setLikeLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/interact/${id}/like`, { method: "POST", credentials: "include" });
      const data = await response.json();
      if (data.success) { setUserLiked(data.liked); setLikes(data.liked ? likes + 1 : likes - 1); }
    } catch (err) {} finally { setLikeLoading(false); }
  };

  const fetchSimilarProducts = async (category, currentProductId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(category)}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) setSimilarProducts(data.products.filter(p => p.id !== currentProductId).slice(0, 12));
    } catch (err) {}
  };

  const handleAddToCart = async () => {
    if (!user) { setCartMessage("Please sign in"); setTimeout(() => setCartMessage(""), 3000); return; }
    try {
      const response = await fetch("http://localhost:5000/api/cart", { 
        method: "POST", headers: { "Content-Type": "application/json" }, 
        credentials: "include", body: JSON.stringify({ product_id: product.id, quantity }) 
      });
      const data = await response.json();
      if (data.success) { 
        setCartMessage(`Added ${quantity} to cart!`); 
        setTimeout(() => setCartMessage(""), 2000); 
        window.dispatchEvent(new CustomEvent("cartUpdated")); 
      } else { 
        setCartMessage(data.message || "Failed"); 
        setTimeout(() => setCartMessage(""), 3000); 
      }
    } catch (err) { 
      setCartMessage("Cannot connect"); 
      setTimeout(() => setCartMessage(""), 3000); 
    }
  };

  const handleChatWithSeller = () => {
    if (!user) { navigate("/login"); return; }
    if (product.owner_id) navigate(`/chats?user=${product.owner_id}&name=${product.owner_name}&product=${product.id}`);
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return ""; const now = new Date(); const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000); if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24); if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30); if (months < 12) return `${months}mo ago`; 
    return `${Math.floor(months / 12)}y ago`;
  };

  const getMembershipDuration = (dateString) => {
    if (!dateString) return "New"; const now = new Date(); const date = new Date(dateString);
    const months = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return "New member"; if (months === 1) return "1 month";
    if (months < 12) return `${months} months`; const years = Math.floor(months / 12);
    if (years === 1) return "1 year"; return `${years} years`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenImage === null) return;
      if (e.key === "Escape") setFullscreenImage(null);
      if (e.key === "ArrowLeft" && allImages.length > 1) { const idx = allImages.indexOf(fullscreenImage); setFullscreenImage(allImages[idx > 0 ? idx - 1 : allImages.length - 1]); }
      if (e.key === "ArrowRight" && allImages.length > 1) { const idx = allImages.indexOf(fullscreenImage); setFullscreenImage(allImages[idx < allImages.length - 1 ? idx + 1 : 0]); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
      <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
        <div style={{ width: 44, height: 44, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        <p style={{ color: textMuted, marginTop: '1rem', fontSize: '0.9rem' }}>Loading product...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
      <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, maxWidth: 400 }}>
        <PackageIcon />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: textColor, marginTop: '1rem' }}>{error || "Product not found"}</h2>
        <Link to="/home" style={{ marginTop: '1.5rem', display: 'inline-block', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>Back to Home</Link>
      </div>
    </div>
  );

  const allImages = product.images?.length > 0 ? product.images.map(img => img.image_url) : product.image_urls || [];

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.06; } 95% { opacity: 0.06; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.25) !important; border-color: ${accent}40 !important; }
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

      {/* Toast */}
      {cartMessage && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 300, background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 14, padding: '12px 20px', border: `1px solid ${borderColor}`, fontSize: '0.82rem', fontWeight: 500, animation: 'fadeIn 0.2s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {cartMessage}
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setFullscreenImage(null)}>
          <button onClick={() => setFullscreenImage(null)} style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', zIndex: 10 }}><XIcon /></button>
          <div style={{ position: 'absolute', top: 16, left: 16, color: 'white', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 14px', fontSize: '0.8rem', zIndex: 10 }}>{allImages.indexOf(fullscreenImage) + 1} / {allImages.length}</div>
          {allImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); const idx = allImages.indexOf(fullscreenImage); setFullscreenImage(allImages[idx > 0 ? idx - 1 : allImages.length - 1]); }} style={{ position: 'absolute', left: 16, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', zIndex: 10 }}><ArrowLeftIcon /></button>
              <button onClick={(e) => { e.stopPropagation(); const idx = allImages.indexOf(fullscreenImage); setFullscreenImage(allImages[idx < allImages.length - 1 ? idx + 1 : 0]); }} style={{ position: 'absolute', right: 16, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', zIndex: 10 }}><ArrowRightIcon /></button>
            </>
          )}
          <img src={fullscreenImage} alt={product.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Scroll to Top */}
      {showScrollTop && (
        <button onClick={scrollToTop} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, width: 44, height: 44, borderRadius: '50%', background: accent, color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,227,9,0.3)' }}>
          <ArrowUpIcon />
        </button>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: textMuted, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/home" style={{ color: textMuted, textDecoration: 'none' }}>Home</Link><span>/</span>
            <Link to={`/home?category=${product.category}`} style={{ color: textMuted, textDecoration: 'none' }}>{product.category || "Products"}</Link><span>/</span>
            <span style={{ color: accent }}>{product.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left - Images */}
            <div>
              <div 
                onClick={() => allImages.length > 0 && setFullscreenImage(allImages[selectedImage])}
                style={{ 
                  background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, 
                  border: `1px solid ${borderColor}`, overflow: 'hidden', cursor: allImages.length > 0 ? 'pointer' : 'default',
                  marginBottom: '0.75rem'
                }}
              >
                {allImages.length > 0 ? (
                  <div style={{ position: 'relative' }}>
                    <img src={allImages[selectedImage]} alt={product.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', background: 'rgba(0,0,0,0.02)' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.02)' }}>
                    <PackageIcon />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {allImages.map((img, index) => (
                    <button key={index} onClick={() => setSelectedImage(index)}
                      style={{ 
                        width: 72, height: 72, borderRadius: 12, overflow: 'hidden', 
                        border: selectedImage === index ? `2px solid ${accent}` : `2px solid transparent`,
                        cursor: 'pointer', flexShrink: 0, padding: 0, background: 'transparent',
                        opacity: selectedImage === index ? 1 : 0.6, transition: 'all 0.2s ease'
                      }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.8rem' }}>
                {product.verified && (
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 700, background: accent, color: '#000', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckIcon /> Verified
                  </span>
                )}
                {product.negotiable && (
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: accentBg, color: accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <HandshakeIcon /> Negotiable
                  </span>
                )}
                {product.shop_name ? (
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: accentBg, color: accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShopIcon /> Shop
                  </span>
                ) : (
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: 'rgba(255,255,255,0.04)', color: textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <UserIcon /> Individual
                  </span>
                )}
                {product.vip_badge && (
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 700, background: '#eab308', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarIcon /> VIP
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.6rem', letterSpacing: '-0.02em' }}>{product.name}</h1>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: accent }}>{Number(product.price).toLocaleString()} RWF</span>
                {product.negotiable && <span style={{ fontSize: '0.75rem', color: textMuted }}>(Negotiable)</span>}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.72rem', color: textMuted, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PackageIcon /> Stock: {product.stock_quantity || 1}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><EyeIcon /> {(product.views || 0) + 1} views</span>
                <button onClick={handleLike} disabled={likeLoading} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: userLiked ? '#ff4444' : textMuted, cursor: 'pointer', fontWeight: userLiked ? 600 : 400, fontSize: '0.72rem', padding: 0 }}>
                  {userLiked ? <HeartIcon /> : <HeartOutlineIcon />} {likes}
                </button>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ClockIcon /> {getTimeAgo(product.created_at)}</span>
              </div>

              {/* Description */}
              <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.3rem', border: `1px solid ${borderColor}`, marginBottom: '1.2rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: textMuted }}>Description</h3>
                <p style={{ color: textMuted, fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line', margin: 0 }}>{product.description || "No description provided."}</p>
              </div>

              {/* Category + Status */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 500, background: inputBg, border: `1px solid ${borderColor}` }}>
                  <CategoryIcon /> {product.category || "Uncategorized"}
                </span>
                <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 500, background: inputBg, border: `1px solid ${borderColor}`, textTransform: 'capitalize' }}>
                  {product.status || "Active"}
                </span>
              </div>

              {/* Quantity + Add to Cart */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${borderColor}`, borderRadius: 14, overflow: 'hidden', background: inputBg }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.6rem 1rem', background: 'transparent', border: 'none', color: textColor, cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>−</button>
                  <span style={{ padding: '0.6rem 1rem', fontWeight: 600, fontSize: '0.9rem', minWidth: 40, textAlign: 'center', borderLeft: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.6rem 1rem', background: 'transparent', border: 'none', color: textColor, cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>+</button>
                </div>
                <button onClick={handleAddToCart} style={{ flex: 1, padding: '0.75rem', borderRadius: 14, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <CartIcon /> Add to Cart
                </button>
              </div>

              {/* Seller Info */}
              <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.5rem', border: `1px solid ${borderColor}` }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: textMuted }}>Seller Information</h3>
                
                <Link to={`/seller/${product.owner_id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, color: '#000', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    {product.owner_picture ? <img src={product.owner_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (product.shop_name || product.owner_name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    {product.shop_name ? (
                      <>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <ShopIcon /> {product.shop_name}
                          {product.shop_verified && <CheckIcon />}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: textMuted, margin: '0.15rem 0 0' }}>Owner: {product.owner_name}</p>
                      </>
                    ) : (
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <UserIcon /> {product.owner_name || "Unknown Seller"}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Seller Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {product.verified_seller_badge && <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: accent, color: '#000' }}><CheckIcon /> Verified Seller</span>}
                  {product.premium_badge && <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: '#eab308', color: '#1a1a2e' }}><StarIcon /> Premium</span>}
                </div>

                {/* Contact Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 10, background: inputBg }}>
                    <EmailIcon /><div style={{ fontSize: '0.65rem' }}><div style={{ color: textMuted }}>Email</div><div style={{ fontWeight: 500, fontSize: '0.7rem' }}>{product.owner_email || "N/A"}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 10, background: inputBg }}>
                    <PhoneIcon /><div style={{ fontSize: '0.65rem' }}><div style={{ color: textMuted }}>Phone</div><div style={{ fontWeight: 500, fontSize: '0.7rem' }}>{seller?.phone_number || product.owner_phone || "N/A"}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 10, background: inputBg }}>
                    <LocationIcon /><div style={{ fontSize: '0.65rem' }}><div style={{ color: textMuted }}>Location</div><div style={{ fontWeight: 500, fontSize: '0.7rem' }}>{product.owner_location || seller?.location || "N/A"}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 10, background: inputBg }}>
                    <ClockIcon /><div style={{ fontSize: '0.65rem' }}><div style={{ color: textMuted }}>Member</div><div style={{ fontWeight: 500, fontSize: '0.7rem' }}>{getMembershipDuration(product.owner_created_at)}</div></div>
                  </div>
                </div>

                {/* Seller Stats */}
                {seller && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem', padding: '0.6rem', borderRadius: 10, background: inputBg }}>
                    <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontSize: '0.9rem', color: accent }}>{seller.total_products || 0}</div><div style={{ fontSize: '0.6rem', color: textMuted }}>Products</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontSize: '0.9rem', color: accent }}>{seller.total_views || 0}</div><div style={{ fontSize: '0.6rem', color: textMuted }}>Views</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff4444' }}>{seller.total_likes || 0}</div><div style={{ fontSize: '0.6rem', color: textMuted }}>Likes</div></div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleChatWithSeller} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <MessageIcon /> Chat with Seller
                  </button>
                  <Link to={`/seller/${product.owner_id}`} style={{ padding: '0.7rem 1.2rem', borderRadius: 14, border: `1px solid ${accent}`, color: accent, textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent' }}>
                    <UserIcon /> View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>More in {product.category}</h2>
                <Link to={`/home?category=${encodeURIComponent(product.category)}`} style={{ fontSize: '0.75rem', color: accent, textDecoration: 'none', fontWeight: 500 }}>View All →</Link>
              </div>
              <div style={{ display: 'flex', gap: '0.9rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {similarProducts.map((sp) => (
                  <Link key={sp.id} to={`/product/${sp.id}`} className="card-hover"
                    style={{ 
                      width: 220, flexShrink: 0, textDecoration: 'none', color: 'inherit',
                      background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 16, 
                      border: `1px solid ${borderColor}`, overflow: 'hidden'
                    }}>
                    <div style={{ height: 140, background: 'rgba(0,0,0,0.02)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {sp.image_urls?.[0] ? (
                        <img src={sp.image_urls[0]} alt={sp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <PackageIcon />
                      )}
                    </div>
                    <div style={{ padding: '0.7rem' }}>
                      <h4 style={{ fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{sp.name}</h4>
                      <p style={{ fontWeight: 700, fontSize: '0.78rem', color: accent, margin: '0.3rem 0' }}>{Number(sp.price).toLocaleString()} RWF</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: textMuted }}>
                        <span>{sp.owner_name || "Unknown"}</span>
                        <span>{getTimeAgo(sp.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
              <p style={{ fontSize: '0.65rem', color: textMuted, margin: 0, lineHeight: 1.5 }}>Rwanda's trusted marketplace.</p>
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

export default ProductDetails;