import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const SearchIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const ChevronDown = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>);
const TagIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01"/></svg>);
const CheckIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const DollarIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>);
const StarIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
const CartIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>);
const LocationIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const ClockIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const ShopIcon = () => (<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const UserIcon = () => (<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const FilterIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>);
const ResetIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>);
const ArrowUpIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
const PackageIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);

// Lazy Image Component
function LazyImage({ src, alt, style, className }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {inView ? (
        <img
          src={src}
          alt={alt}
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          className={className}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: 'rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} />
      )}
      {inView && !loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: 24,
            height: 24,
            border: '2px solid rgba(0,0,0,0.1)',
            borderTopColor: '#00E309',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
        </div>
      )}
    </div>
  );
}

function Home() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterNegotiable, setFilterNegotiable] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterVIP, setFilterVIP] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const catRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => { const handleScroll = () => setShowScrollTop(window.scrollY > 300); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => { const handleClick = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); if (badgeRef.current && !badgeRef.current.contains(e.target)) setBadgeOpen(false); }; document.addEventListener("click", handleClick); return () => document.removeEventListener("click", handleClick); }, []);
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => { try { setLoading(true); const res = await fetch("http://localhost:5000/api/products", { credentials: "include" }); const data = await res.json(); if (data.success) { const sorted = data.products.sort((a, b) => { const getTierScore = (p) => { if (p.vip_badge) return 6; if (p.premium_badge) return 5; if (p.verified_product_badge) return 4; if (p.verified_seller_badge) return 3; if (p.shop_badge) return 2; return 1; }; const scoreDiff = getTierScore(b) - getTierScore(a); if (scoreDiff !== 0) return scoreDiff; return new Date(b.created_at) - new Date(a.created_at); }); setAllProducts(sorted); } } catch (err) {} finally { setLoading(false); } };

  const categories = useMemo(() => ["All", ...new Set(allProducts.map((p) => p.category).filter(Boolean))], [allProducts]);

  const filteredProducts = useMemo(() => { let filtered = allProducts; if (selectedCategory !== "All") filtered = filtered.filter((p) => p.category === selectedCategory); if (search.trim()) { const term = search.toLowerCase(); filtered = filtered.filter((p) => p.name?.toLowerCase().includes(term) || (p.owner_name || "").toLowerCase().includes(term)); } if (minPrice) filtered = filtered.filter(p => Number(p.price) >= Number(minPrice)); if (maxPrice) filtered = filtered.filter(p => Number(p.price) <= Number(maxPrice)); if (filterNegotiable) filtered = filtered.filter(p => p.negotiable); if (filterVerified) filtered = filtered.filter(p => p.verified || p.verified_product_badge); if (filterVIP) filtered = filtered.filter(p => p.vip_badge); return filtered; }, [allProducts, search, selectedCategory, minPrice, maxPrice, filterNegotiable, filterVerified, filterVIP]);

  const handleAddToCart = async (productId, e) => { e.preventDefault(); e.stopPropagation(); if (!user) { setCartMessage("Please sign in"); setTimeout(() => setCartMessage(""), 2000); return; } try { const res = await fetch("http://localhost:5000/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ product_id: productId, quantity: 1 }) }); const data = await res.json(); if (data.success) { setCartMessage("Added to cart"); window.dispatchEvent(new CustomEvent("cartUpdated")); } else setCartMessage(data.message || "Failed"); setTimeout(() => setCartMessage(""), 2000); } catch (err) { setCartMessage("Error"); setTimeout(() => setCartMessage(""), 2000); } };
  const getTimeAgo = (d) => { if (!d) return ""; const s = Math.floor((new Date() - new Date(d)) / 1000); if (s < 60) return "Now"; if (s < 3600) return `${Math.floor(s/60)}m`; if (s < 86400) return `${Math.floor(s/3600)}h`; return `${Math.floor(s/86400)}d`; };
  const resetFilters = () => { setSearch(""); setMinPrice(""); setMaxPrice(""); setSelectedCategory("All"); setFilterNegotiable(false); setFilterVerified(false); setFilterVIP(false); };
  const activeBadgeCount = (filterNegotiable ? 1 : 0) + (filterVerified ? 1 : 0) + (filterVIP ? 1 : 0);

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const filterBg = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.85)' : 'rgba(255,255,255,0.85)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.35)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.06; } 95% { opacity: 0.06; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        .hover-btn { transition: all 0.2s ease; cursor: pointer; }
        .hover-btn:hover { background: ${accentBg} !important; color: ${accent} !important; }
        .hover-btn:hover svg { stroke: ${accent} !important; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.12 : 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(10,10,20,0.92)' : 'rgba(245,245,245,0.88)' }} />
      </div>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(10)].map((_, i) => (<div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.04 }}><svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg></div>))}
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {cartMessage && (<div style={{ position: 'fixed', top: 70, right: 16, zIndex: 300, background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 12, padding: '10px 16px', border: `1px solid ${borderColor}`, fontSize: '0.8rem', fontWeight: 500, animation: 'fadeIn 0.2s ease' }}>{cartMessage}</div>)}

        {/* Filter Bar */}
        <div style={{ position: 'sticky', top: 52, zIndex: 90, padding: '0.6rem 1rem' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ background: filterBg, backdropFilter: 'blur(20px) saturate(200%)', borderRadius: 40, border: `1px solid ${borderColor}`, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '0.45rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
              
              {/* Search */}
              <div style={{ flex: '1 1 200px', maxWidth: 350, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SearchIcon />
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.78rem', padding: '0.35rem 0', outline: 'none', color: textColor }} />
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0 0.5rem', borderLeft: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}>
                <TagIcon />
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: 48, border: 'none', padding: '0.3rem 0', fontSize: '0.68rem', outline: 'none', background: 'transparent', textAlign: 'center', borderBottom: `1px dashed ${borderColor}`, color: textColor }} />
                <span style={{ color: textMuted, fontSize: '0.55rem' }}>—</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: 48, border: 'none', padding: '0.3rem 0', fontSize: '0.68rem', outline: 'none', background: 'transparent', textAlign: 'center', borderBottom: `1px dashed ${borderColor}`, color: textColor }} />
              </div>

              {/* Category */}
              <div ref={catRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={(e) => { e.stopPropagation(); setCatOpen(!catOpen); }} className="hover-btn" style={{ background: 'transparent', border: `1px solid ${borderColor}`, borderRadius: 18, fontSize: '0.68rem', fontWeight: 500, color: textColor, padding: '0.35rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                  {selectedCategory === "All" ? "Categories" : selectedCategory} <ChevronDown />
                </button>
                {catOpen && (<div style={{ position: 'absolute', top: 'calc(100% + 0.3rem)', left: 0, minWidth: 180, maxHeight: 280, overflowY: 'auto', background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 14, padding: '0.4rem 0', zIndex: 10, border: `1px solid ${borderColor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>{categories.map((cat) => (<div key={cat} onClick={() => { setSelectedCategory(cat); setCatOpen(false); }} className="hover-btn" style={{ padding: '0.4rem 1.2rem', cursor: 'pointer', fontSize: '0.7rem', color: textColor }}>{cat === "All" ? "All Categories" : cat}</div>))}</div>)}
              </div>

              {/* Badges */}
              <div ref={badgeRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={(e) => { e.stopPropagation(); setBadgeOpen(!badgeOpen); }} className="hover-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: activeBadgeCount > 0 ? accentBg : 'transparent', border: activeBadgeCount > 0 ? `1px solid ${accent}` : `1px solid ${borderColor}`, borderRadius: 18, fontSize: '0.65rem', fontWeight: 500, color: activeBadgeCount > 0 ? accent : textColor, padding: '0.35rem 0.7rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <FilterIcon /> Badges {activeBadgeCount > 0 && <span style={{ background: accent, color: '#000', fontSize: '0.45rem', minWidth: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{activeBadgeCount}</span>}
                </button>
                {badgeOpen && (<div style={{ position: 'absolute', top: 'calc(100% + 0.3rem)', right: 0, minWidth: 190, background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 14, padding: '0.5rem', zIndex: 10, border: `1px solid ${borderColor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <button onClick={() => { setFilterNegotiable(!filterNegotiable); }} className="hover-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.6rem', borderRadius: 10, border: filterNegotiable ? `1px solid ${accent}` : '1px solid transparent', background: filterNegotiable ? accentBg : 'transparent', color: filterNegotiable ? accent : textColor, cursor: 'pointer', fontSize: '0.7rem', fontWeight: filterNegotiable ? 600 : 400 }}><DollarIcon /> Negotiable {filterNegotiable && <span style={{ marginLeft: 'auto' }}><CheckIcon /></span>}</button>
                  <button onClick={() => { setFilterVerified(!filterVerified); }} className="hover-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.6rem', borderRadius: 10, border: filterVerified ? `1px solid ${accent}` : '1px solid transparent', background: filterVerified ? accentBg : 'transparent', color: filterVerified ? accent : textColor, cursor: 'pointer', fontSize: '0.7rem', fontWeight: filterVerified ? 600 : 400 }}><CheckIcon /> Verified {filterVerified && <span style={{ marginLeft: 'auto' }}><CheckIcon /></span>}</button>
                  <button onClick={() => { setFilterVIP(!filterVIP); }} className="hover-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.6rem', borderRadius: 10, border: filterVIP ? `1px solid ${accent}` : '1px solid transparent', background: filterVIP ? accentBg : 'transparent', color: filterVIP ? accent : textColor, cursor: 'pointer', fontSize: '0.7rem', fontWeight: filterVIP ? 600 : 400 }}><StarIcon /> VIP {filterVIP && <span style={{ marginLeft: 'auto' }}><CheckIcon /></span>}</button>
                  {(filterNegotiable || filterVerified || filterVIP) && (<div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.3rem' }}><button onClick={() => { setFilterNegotiable(false); setFilterVerified(false); setFilterVIP(false); }} className="hover-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem', borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, cursor: 'pointer', fontSize: '0.65rem' }}><ResetIcon /> Clear</button></div>)}
                </div>)}
              </div>

              {/* Reset + Scroll */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                <button onClick={resetFilters} title="Reset" className="hover-btn" style={{ width: 30, height: 30, borderRadius: 30, background: 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem' }}><ResetIcon /></button>
                <button onClick={scrollToTop} className="hover-btn" style={{ width: 30, height: 30, borderRadius: 30, background: accent, color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,227,9,0.25)', opacity: showScrollTop ? 1 : 0, visibility: showScrollTop ? 'visible' : 'hidden', transition: 'all 0.3s ease' }}><ArrowUpIcon /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div style={{ flex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 1rem 1.5rem', width: '100%' }}>
          {loading ? (<div style={{ textAlign: 'center', padding: '4rem', color: textMuted, background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, border: `1px solid ${borderColor}` }}><div style={{ width: 32, height: 32, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} /><p style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>Loading products...</p></div>) : filteredProducts.length === 0 ? (<div style={{ textAlign: 'center', padding: '4rem', color: textMuted, background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, border: `1px solid ${borderColor}` }}><PackageIcon /><h3 style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>{allProducts.length === 0 ? "No products yet" : "No products match"}</h3></div>) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.9rem' }}>
              <style>{`@media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
              {filteredProducts.map(product => (
                <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} style={{ background: cardBg, backdropFilter: 'blur(16px) saturate(160%)', borderRadius: 14, border: `1px solid ${borderColor}`, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.25s' }}>
                  <div style={{ position: 'relative', aspectRatio: '1/1', background: 'rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                    {product.image_urls?.[0] ? (
                      <LazyImage src={product.image_urls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PackageIcon /></div>
                    )}
                    <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>{product.vip_badge && <span style={{ padding: '3px 8px', borderRadius: 14, fontSize: '0.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, border: '1px solid #eab308', background: '#eab308', color: '#000' }}><StarIcon /> VIP</span>}{product.verified_product_badge && <span style={{ padding: '3px 8px', borderRadius: 14, fontSize: '0.45rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(255,255,255,0.15)', background: '#22c55e', color: 'white' }}><CheckIcon /> Product</span>}{product.verified && <span style={{ padding: '3px 8px', borderRadius: 14, fontSize: '0.45rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(255,255,255,0.15)', background: accent, color: '#0a0a14' }}><CheckIcon /> Verified</span>}</div>
                    {product.negotiable && <span style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', borderRadius: 14, fontSize: '0.45rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.15)', color: '#eab308' }}><DollarIcon /> NEG</span>}
                    <button onClick={(e) => handleAddToCart(product.id, e)} style={{ position: 'absolute', bottom: 8, right: 8, padding: '4px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: `1px solid ${accent}40`, color: 'white', fontSize: '0.55rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><CartIcon /> Add</button>
                  </div>
                  <div style={{ padding: '0.65rem', flex: 1 }}><h3 style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3><div style={{ color: textMuted, fontSize: '0.65rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '1.6rem', maxHeight: '1.6rem', marginBottom: '0.5rem' }}>{product.description || "No description"}</div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', paddingTop: '0.45rem', borderTop: `1px dashed ${borderColor}` }}><span style={{ fontWeight: 700, fontSize: '0.85rem', color: accent }}>{Number(product.price).toLocaleString()} RWF</span><span style={{ background: 'rgba(0,227,9,0.06)', border: '1px solid rgba(0,227,9,0.15)', borderRadius: 14, padding: '0.15rem 0.5rem', fontSize: '0.5rem', fontWeight: 600, color: accent, textTransform: 'uppercase' }}>{product.negotiable ? "Neg" : "Fixed"}</span></div></div>
                  <div style={{ background: 'rgba(0,0,0,0.01)', borderTop: `1px solid ${borderColor}`, padding: '0.45rem 0.7rem', fontSize: '0.6rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, marginBottom: 3, fontSize: '0.7rem' }}><div style={{ width: 16, height: 16, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 700, color: '#0a0a14', flexShrink: 0 }}>{(product.shop_name || product.owner_name || "U")[0]}</div>{product.shop_name || product.owner_name || "Unknown"}<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '0.12rem 0.35rem', borderRadius: 12, fontSize: '0.45rem', fontWeight: 600, marginLeft: '0.3rem', background: product.shop_name ? 'rgba(0,227,9,0.08)' : 'rgba(255,255,255,0.04)', color: product.shop_name ? accent : textMuted }}>{product.shop_name ? <ShopIcon /> : <UserIcon />} {product.shop_name ? "Shop" : "Indiv"}</span>{product.verified_seller_badge && <span style={{ color: accent }}><CheckIcon /></span>}</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, color: textMuted, fontSize: '0.55rem' }}>{product.owner_location && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><LocationIcon />{product.owner_location}</span>}<span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><ClockIcon />{getTimeAgo(product.created_at)}</span></div></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ background: filterBg, backdropFilter: 'blur(20px) saturate(200%)', padding: '1.2rem 1rem 0.8rem', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}><img src={logo} alt="GuraNeza" style={{ width: 24, height: 24, objectFit: 'contain' }} /><span style={{ fontWeight: 600, fontSize: '0.85rem', color: textColor }}>GURANEZA</span></div><p style={{ fontSize: '0.6rem', color: textMuted }}>Rwanda's trusted marketplace.</p></div>
              <div><h4 style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', color: textColor }}>Quick Links</h4><Link to="/home" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Home</Link><Link to="/shops" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Shops</Link><Link to="/sell" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Sell</Link></div>
              <div><h4 style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', color: textColor }}>Categories</h4><Link to="/home" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Electronics</Link><Link to="/home" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Fashion</Link></div>
              <div><h4 style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', color: textColor }}>Connect</h4><div style={{ display: 'flex', gap: '0.3rem' }}>{["M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21","M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z","M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29.94 29.94 0 001 11.75a29.94 29.94 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29.94 29.94 0 00.46-5.25 29.94 29.94 0 00-.46-5.33z","M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 16a4 4 0 110-8 4 4 0 010 8zM17.5 6.5h.01"].map((d, i) => (<a key={i} href="#" target="_blank" rel="noopener noreferrer" style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg></a>))}</div></div>
            </div>
            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.5rem', textAlign: 'center', fontSize: '0.55rem', color: textMuted }}>&copy; 2026 GuraNeza. Made in Rwanda</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;