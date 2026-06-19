import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

const translations = {
  en: { signIn: "Sign In", getStarted: "Get Started", marketplace: "Rwanda's #1 Marketplace", heroTitle: "Buy & Sell", heroTitleSpan: "Anything", heroTitleEnd: "in Rwanda", heroDesc: "The safest way to buy and sell in Rwanda. Join thousands already trading.", startSelling: "Start Selling Now", browseProducts: "Browse Products", users: "Users", products: "Products", shops: "Shops", searchPlaceholder: "Search products, sellers...", allCategories: "All Categories", filter: "Filter", negotiable: "Negotiable", fixed: "Fixed", verified: "Verified", product: "Product", shop: "Shop", individual: "Individual", vip: "VIP", noDescription: "No description", loadingProducts: "Loading products...", noProducts: "No products yet", noMatch: "No products match", tryAdjusting: "Try adjusting your search or filters", viewAll: "View All Products", ctaTitle: "Ready to", ctaTitleSpan: "Sell?", ctaDesc: "Join thousands of Rwandans on GuraNeza.", createAccount: "Create Free Account", quickLinks: "Quick Links", categories: "Categories", connect: "Connect", footerBrand: "Rwanda's trusted marketplace.", copyright: "Made in Rwanda", menu: "Menu", language: "Language", appearance: "Appearance", darkMode: "Dark Mode", lightMode: "Light Mode" },
  fr: { signIn: "Connexion", getStarted: "Commencer", marketplace: "Place de Marché #1 du Rwanda", heroTitle: "Achetez & Vendez", heroTitleSpan: "Tout", heroTitleEnd: "au Rwanda", heroDesc: "Le moyen le plus sûr d'acheter et de vendre au Rwanda.", startSelling: "Commencer à Vendre", browseProducts: "Parcourir", users: "Utilisateurs", products: "Produits", shops: "Boutiques", searchPlaceholder: "Rechercher produits, vendeurs...", allCategories: "Toutes Catégories", filter: "Filtrer", negotiable: "Négociable", fixed: "Fixe", verified: "Vérifié", product: "Produit", shop: "Boutique", individual: "Individuel", vip: "VIP", noDescription: "Pas de description", loadingProducts: "Chargement...", noProducts: "Aucun produit", noMatch: "Aucun résultat", tryAdjusting: "Essayez d'ajuster vos filtres", viewAll: "Voir Tout", ctaTitle: "Prêt à", ctaTitleSpan: "Vendre?", ctaDesc: "Rejoignez des milliers de Rwandais sur GuraNeza.", createAccount: "Créer un Compte", quickLinks: "Liens Rapides", categories: "Catégories", connect: "Connecter", footerBrand: "Place de marché de confiance du Rwanda.", copyright: "Fait au Rwanda", menu: "Menu", language: "Langue", appearance: "Apparence", darkMode: "Mode Sombre", lightMode: "Mode Clair" },
  rw: { signIn: "Injira", getStarted: "Tangira", marketplace: "Isoko #1 mu Rwanda", heroTitle: "Gura & Gurisha", heroTitleSpan: "Icyo", heroTitleEnd: "mu Rwanda", heroDesc: "Uburyo bwizewe bwo kugura no kugurisha mu Rwanda.", startSelling: "Tangira Kugurisha", browseProducts: "Reba Ibicuruzwa", users: "Abakoresha", products: "Ibicuruzwa", shops: "Amaduka", searchPlaceholder: "Shakisha ibicuruzwa, abagurisha...", allCategories: "Ibyiciro Byose", filter: "Tonga", negotiable: "Birahuzwa", fixed: "Birakomeye", verified: "Byagenzuwe", product: "Igicuruzwa", shop: "Iduka", individual: "Ku Giti", vip: "VIP", noDescription: "Nta bisobanuro", loadingProducts: "Birabika...", noProducts: "Nta bicuruzwa", noMatch: "Nta byahuye", tryAdjusting: "Gerageza guhindura ibyiciro", viewAll: "Reba Byose", ctaTitle: "Witeguye", ctaTitleSpan: "Kugurisha?", ctaDesc: "Ifatanye n'abantu benshi bo mu Rwanda kuri GuraNeza.", createAccount: "Fungura Konti", quickLinks: "Ahabanza", categories: "Ibyiciro", connect: "Twandikire", footerBrand: "Isoko ryizewe mu Rwanda.", copyright: "Yakozwe mu Rwanda", menu: "Ibikubiyemo", language: "Ururimi", appearance: "Ishusho", darkMode: "Ijoro", lightMode: "Amanywa" },
};

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

function Landing() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, products: 0, shops: 0 });
  const [displayedStats, setDisplayedStats] = useState({ users: 0, products: 0, shops: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [catOpen, setCatOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("guraneza_language") || "en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const catRef = useRef(null);
  const langRef = useRef(null);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  const langLabels = { en: "EN", fr: "FR", rw: "RW" };

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  useEffect(() => { if (user) navigate("/home"); }, [user, navigate]);

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/public/stats"),
        ]);
        const productsData = await productsRes.json();
        const statsData = await statsRes.json();
        if (productsData.success) {
          const sorted = productsData.products.sort((a, b) => {
            const getTierScore = (p) => {
              if (p.vip_badge) return 6;
              if (p.premium_badge) return 5;
              if (p.verified_product_badge) return 4;
              if (p.verified_seller_badge) return 3;
              if (p.shop_badge) return 2;
              return 1;
            };
            const scoreDiff = getTierScore(b) - getTierScore(a);
            if (scoreDiff !== 0) return scoreDiff;
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setProducts(sorted.slice(0, 12));
        }
        if (statsData.success && statsData.stats) { setStats(statsData.stats); setStatsLoaded(true); }
      } catch (error) {}
    };
    fetchData();
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || !statsLoaded) return;
    const duration = 1500; const steps = 30; let step = 0;
    const timer = setInterval(() => {
      step++; const progress = step / steps;
      setDisplayedStats({ users: Math.round(stats.users * progress), products: Math.round(stats.products * progress), shops: Math.round(stats.shops * progress) });
      if (step >= steps) { setDisplayedStats({ ...stats }); clearInterval(timer); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isLoading, statsLoaded, stats]);

  const changeLanguage = (l) => { setLang(l); localStorage.setItem("guraneza_language", l); setLangOpen(false); };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== "All") filtered = filtered.filter((p) => p.category === selectedCategory);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => p.name?.toLowerCase().includes(term) || (p.owner_name || "").toLowerCase().includes(term));
    }
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const handleSearch = (e) => { e.preventDefault(); navigate("/login"); };
  const handleProductClick = () => navigate("/login");
  const getTimeAgo = (dateString) => {
    if (!dateString) return ""; const now = new Date(); const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000); if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const bgColor = darkMode ? '#0a0a14' : '#f5f5f5';
  const cardBg = darkMode ? 'rgba(26,26,46,0.35)' : 'rgba(255,255,255,0.9)';
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  const borderColor = darkMode ? 'rgba(0,227,9,0.08)' : 'rgba(0,0,0,0.08)';
  const navBg = darkMode ? 'rgba(26,26,46,0.35)' : 'rgba(255,255,255,0.8)';
  const heroBg = darkMode ? '#0a0a14' : '#f0f0f0';
  const searchBg = darkMode ? 'rgba(26,26,46,0.35)' : 'rgba(255,255,255,0.9)';
  const accentColor = '#00E309';
  const sidebarBg = darkMode ? 'rgba(26,26,46,0.98)' : 'rgba(255,255,255,0.98)';

  const ProductCard = ({ product }) => (
    <div onClick={handleProductClick} style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 6px 20px rgba(0,0,0,0.1)', border: `1px solid ${borderColor}`, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'all 0.25s' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: 'rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {product.image_urls?.[0] ? (
          <LazyImage 
            src={product.image_urls[0]} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="1"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {product.vip_badge && <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2, backdropFilter: 'blur(6px)', border: '1px solid #eab308', background: '#eab308', color: '#000' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="#000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> {t("vip")}</span>}
          {product.verified_product_badge && <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', background: '#22c55e', color: 'white' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> {t("product")}</span>}
          {product.verified && <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', background: accentColor, color: '#0a0a14' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> {t("verified")}</span>}
          {product.shop_verified && <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', background: '#a855f7', color: 'white' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> {t("shop")}</span>}
        </div>
        {product.negotiable && <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 7px', borderRadius: 20, fontSize: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, backdropFilter: 'blur(6px)', border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.15)', color: '#eab308' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> {t("negotiable")}</span>}
      </div>
      <div style={{ padding: '0.8rem', flex: 1 }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
        <div style={{ color: textMuted, fontSize: '0.65rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '1.8rem', maxHeight: '1.8rem', marginBottom: '0.5rem' }}>{product.description || t("noDescription")}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem', paddingTop: '0.5rem', borderTop: `1px dashed ${borderColor}` }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: accentColor }}>{Number(product.price).toLocaleString()} RWF</span>
          <span style={{ background: 'rgba(0,227,9,0.06)', border: '1px solid rgba(0,227,9,0.15)', borderRadius: 20, padding: '0.15rem 0.5rem', fontSize: '0.5rem', fontWeight: 600, color: accentColor, textTransform: 'uppercase' }}>{product.negotiable ? t("negotiable") : t("fixed")}</span>
        </div>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.01)', borderTop: `1px solid ${borderColor}`, padding: '0.5rem 0.8rem', fontSize: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, marginBottom: 3, fontSize: '0.7rem' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 700, color: '#0a0a14', flexShrink: 0 }}>{(product.shop_name || product.owner_name || "U")[0]}</div>
          {product.shop_name || product.owner_name || "Unknown"}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '0.12rem 0.35rem', borderRadius: 12, fontSize: '0.45rem', fontWeight: 600, marginLeft: '0.3rem', background: product.shop_name ? 'rgba(0,227,9,0.08)' : 'rgba(255,255,255,0.04)', color: product.shop_name ? accentColor : textMuted, border: product.shop_name ? '1px solid rgba(0,227,9,0.15)' : '1px solid rgba(255,255,255,0.1)' }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{product.shop_name ? <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/> : <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>}</svg>
            {product.shop_name ? t("shop") : t("individual")}
          </span>
          {product.verified_seller_badge && <span style={{ color: accentColor }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></span>}
          {product.premium_badge && <span style={{ color: '#eab308' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, color: textMuted, fontSize: '0.55rem' }}>
          {product.owner_location && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{product.owner_location}</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{getTimeAgo(product.created_at)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bgColor, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor }}>
      
      <style>{`
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.1; } 95% { opacity: 0.1; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .show-mobile { display: flex !important; } .product-grid-mobile { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; } }
        @media (min-width: 769px) { .product-grid-desktop { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; gap: 1rem !important; } }
      `}</style>

      {/* Mobile Sidebar */}
      {sidebarOpen && <><div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, width: 260, height: '100%', zIndex: 250, background: sidebarBg, backdropFilter: 'blur(20px)', boxShadow: '-4px 0 30px rgba(0,0,0,0.3)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${borderColor}`, animation: 'slideIn 0.25s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${borderColor}` }}><span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t("menu")}</span><button onClick={() => setSidebarOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✕</button></div>
        <div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '0.7rem', color: textMuted, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t("language")}</p><div style={{ display: 'flex', gap: '0.3rem' }}>{Object.entries(langLabels).map(([code, label]) => (<button key={code} onClick={() => changeLanguage(code)} style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: lang === code ? `1px solid ${accentColor}` : `1px solid ${borderColor}`, background: lang === code ? `${accentColor}20` : 'transparent', color: lang === code ? accentColor : textColor, cursor: 'pointer', fontSize: '0.7rem', fontWeight: lang === code ? 600 : 400 }}>{label}</button>))}</div></div>
        <div style={{ marginBottom: '1.5rem' }}><p style={{ fontSize: '0.7rem', color: textMuted, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t("appearance")}</p><button onClick={toggleDarkMode} style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>{darkMode ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> {t("lightMode")}</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> {t("darkMode")}</>}</button></div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}><Link to="/login" onClick={() => setSidebarOpen(false)} style={{ padding: '0.6rem', textAlign: 'center', borderRadius: 24, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, color: textColor, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>{t("signIn")}</Link><Link to="/login" onClick={() => setSidebarOpen(false)} style={{ padding: '0.6rem', textAlign: 'center', borderRadius: 24, color: '#0a0a14', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', background: accentColor }}>{t("getStarted")}</Link></div>
      </div></>}

      {/* Loading */}
      {isLoading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' }}>
          <div style={{ position: 'absolute', inset: 0 }}><img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,20,0.88)' }} /></div>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>{[...Array(20)].map((_, i) => (<div key={i} style={{ position: 'absolute', left: `${Math.random() * 95}%`, bottom: '-40px', animation: `bagRise ${3 + Math.random() * 4}s linear infinite`, animationDelay: `${Math.random() * 3}s`, opacity: 0.08 }}><svg width={12 + Math.random() * 16} height={12 + Math.random() * 16} viewBox="0 0 24 24" fill="white"><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg></div>))}</div>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 128, height: 128, margin: '0 auto 24px' }}>
              <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, animation: 'spin 2.5s linear infinite' }}><circle cx="50" cy="50" r="46" fill="none" stroke="#00E309" strokeWidth="1.5" strokeDasharray="180 100" strokeLinecap="round" opacity="0.5"/></svg>
              <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 6, animation: 'spin 3s linear infinite reverse' }}><circle cx="50" cy="50" r="40" fill="none" stroke="#00E309" strokeWidth="1" strokeDasharray="150 80" strokeLinecap="round" opacity="0.3"/></svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={logo} alt="GuraNeza" style={{ width: 56, height: 56, objectFit: 'contain' }} /></div>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>GURANEZA</h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontWeight: 300, marginTop: 4 }}>BuySmart</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: navBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${borderColor}`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: textColor, flexShrink: 0 }}><img src={logo} alt="GuraNeza" style={{ width: 32, height: 32, objectFit: 'contain' }} /><span style={{ fontWeight: 650, fontSize: '1rem' }}>GuraNeza <span style={{ color: accentColor, fontWeight: 300 }}>| BuySmart</span></span></a>
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div ref={langRef} style={{ position: 'relative' }}><button onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.5rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600, color: textColor }}>{langLabels[lang]}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></button>
              {langOpen && <div style={{ position: 'absolute', top: 'calc(100% + 0.3rem)', right: 0, minWidth: 90, background: cardBg, backdropFilter: 'blur(16px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', borderRadius: 12, padding: '0.3rem 0', zIndex: 20, border: `1px solid ${borderColor}` }}>{Object.entries(langLabels).map(([code, label]) => (<div key={code} onClick={() => changeLanguage(code)} style={{ padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.65rem', color: lang === code ? accentColor : textColor, fontWeight: lang === code ? 600 : 400 }}>{label} {lang === code && '✓'}</div>))}</div>}
            </div>
            <button onClick={toggleDarkMode} style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{darkMode ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>}</button>
            <Link to="/login" style={{ padding: '0.35rem 1rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, borderRadius: 24, color: textColor, fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>{t("signIn")}</Link>
            <Link to="/login" style={{ padding: '0.35rem 1rem', border: 'none', borderRadius: 24, color: '#0a0a14', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', background: accentColor }}>{t("getStarted")}</Link>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="show-mobile" style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: heroBg }}>
        <div style={{ position: 'absolute', inset: 0 }}><img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.25 : 0.12 }} /><div style={{ position: 'absolute', inset: 0, background: darkMode ? 'linear-gradient(180deg, rgba(10,10,20,0.8) 0%, rgba(10,10,20,0.95) 100%)' : 'linear-gradient(180deg, rgba(245,245,245,0.6) 0%, rgba(245,245,245,0.9) 100%)' }} /></div>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>{[...Array(12)].map((_, i) => (<div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${3 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: darkMode ? 0.05 : 0.04 }}><svg width={10 + Math.random() * 14} height={10 + Math.random() * 14} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg></div>))}</div>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '3rem 1rem', maxWidth: 700 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: 24, border: '1px solid rgba(0,227,9,0.2)', background: 'rgba(0,227,9,0.05)', marginBottom: '1.5rem' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor }} /><span style={{ fontSize: '0.7rem', color: accentColor, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t("marketplace")}</span></div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>{t("heroTitle")}<br /><span style={{ color: accentColor }}>{t("heroTitleSpan")}</span> {t("heroTitleEnd")}</h1>
          <p style={{ fontSize: '0.9rem', color: textMuted, maxWidth: 500, margin: '0 auto 2rem', fontWeight: 300, lineHeight: 1.6 }}>{t("heroDesc")}</p>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}><Link to="/login" style={{ padding: '0.6rem 1.8rem', border: 'none', borderRadius: 24, color: '#0a0a14', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', background: accentColor }}>{t("startSelling")}</Link><Link to="/login" style={{ padding: '0.6rem 1.8rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, borderRadius: 24, color: textColor, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>{t("browseProducts")}</Link></div>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor }}>{displayedStats.users > 0 ? displayedStats.users.toLocaleString() : "..."}</div><div style={{ fontSize: '0.6rem', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{t("users")}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor }}>{displayedStats.products > 0 ? displayedStats.products.toLocaleString() : "..."}</div><div style={{ fontSize: '0.6rem', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{t("products")}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor }}>{displayedStats.shops > 0 ? displayedStats.shops.toLocaleString() : "..."}</div><div style={{ fontSize: '0.6rem', color: textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{t("shops")}</div></div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '2rem 1rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ position: 'sticky', top: 60, zIndex: 90, background: searchBg, backdropFilter: 'blur(16px)', borderRadius: 40, boxShadow: '0 6px 20px rgba(0,0,0,0.1)', marginBottom: '2rem', border: `1px solid ${borderColor}` }}>
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', padding: '0.3rem 0.5rem 0.3rem 1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder={t("searchPlaceholder")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', padding: '0.4rem 0', outline: 'none', color: textColor }} />
            <div ref={catRef} style={{ position: 'relative', flexShrink: 0 }}><button onClick={(e) => { e.stopPropagation(); setCatOpen(!catOpen); }} style={{ background: 'transparent', border: 'none', fontSize: '0.75rem', fontWeight: 500, color: textColor, padding: '0.4rem 1.5rem 0.4rem 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>{selectedCategory === "All" ? t("allCategories") : selectedCategory}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></button>
              {catOpen && <div style={{ position: 'absolute', top: 'calc(100% + 0.3rem)', left: 0, minWidth: 180, maxHeight: 300, overflowY: 'auto', background: cardBg, backdropFilter: 'blur(16px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', borderRadius: 12, padding: '0.3rem 0', zIndex: 15, border: `1px solid ${borderColor}` }}>{categories.map((cat) => (<div key={cat} onClick={() => { setSelectedCategory(cat); setCatOpen(false); }} style={{ padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.7rem', color: textColor }}>{cat}</div>))}</div>}
            </div>
            <button onClick={handleSearch} style={{ background: accentColor, border: 'none', color: '#0a0a14', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: 30, cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap', flexShrink: 0 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>{t("filter")}</button>
          </div>
        </div>

        {isLoading ? (
          <div className="product-grid-desktop product-grid-mobile" style={{ display: 'grid', gap: '1rem' }}><div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: textMuted, background: cardBg, borderRadius: 18, border: `1px solid ${borderColor}` }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" style={{ margin: '0 auto 0.8rem', opacity: 0.6 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><h3>{t("loadingProducts")}</h3></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="product-grid-desktop product-grid-mobile" style={{ display: 'grid', gap: '1rem' }}><div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: textMuted, background: cardBg, borderRadius: 18, border: `1px solid ${borderColor}` }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" style={{ margin: '0 auto 0.8rem', opacity: 0.6 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg><h3>{products.length === 0 ? t("noProducts") : t("noMatch")}</h3><p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>{t("tryAdjusting")}</p></div></div>
        ) : (
          <div className="product-grid-desktop product-grid-mobile" style={{ display: 'grid' }}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}><Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 2rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, borderRadius: 24, color: textColor, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>{t("viewAll")}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link></div>
      </section>

      {/* CTA */}
      <section style={{ padding: '3rem 1rem', background: heroBg, borderTop: `1px solid ${borderColor}`, textAlign: 'center' }}><h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t("ctaTitle")} <span style={{ color: accentColor }}>{t("ctaTitleSpan")}</span></h2><p style={{ color: textMuted, fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 300 }}>{t("ctaDesc")}</p><Link to="/login" style={{ padding: '0.7rem 2.5rem', border: 'none', borderRadius: 24, color: '#0a0a14', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', background: accentColor, display: 'inline-block' }}>{t("createAccount")}</Link></section>

      {/* Footer */}
      <footer style={{ background: cardBg, backdropFilter: 'blur(16px)', padding: '1.5rem 1rem 0.8rem', borderTop: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}><img src={logo} alt="GuraNeza" style={{ width: 28, height: 28, objectFit: 'contain' }} /><span style={{ fontWeight: 600, fontSize: '0.95rem' }}>GURANEZA</span></div><p style={{ fontSize: '0.7rem', color: textMuted, fontWeight: 300 }}>{t("footerBrand")}</p></div>
            <div><h4 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.8rem', textTransform: 'uppercase' }}>{t("quickLinks")}</h4><Link to="/login" style={{ fontSize: '0.7rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.4rem' }}>{t("signIn")}</Link><Link to="/login" style={{ fontSize: '0.7rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.4rem' }}>{t("getStarted")}</Link></div>
            <div><h4 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.8rem', textTransform: 'uppercase' }}>{t("categories")}</h4><Link to="/login" style={{ fontSize: '0.7rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.4rem' }}>Electronics</Link><Link to="/login" style={{ fontSize: '0.7rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.4rem' }}>Fashion</Link></div>
            <div><h4 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.8rem', textTransform: 'uppercase' }}>{t("connect")}</h4><div style={{ display: 'flex', gap: '0.4rem' }}>{[{ href: "https://wa.me/250795583674", d: "M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" },{ href: "https://x.com/guraneza", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },{ href: "https://youtube.com/@guraneza", d: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29.94 29.94 0 001 11.75a29.94 29.94 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29.94 29.94 0 00.46-5.25 29.94 29.94 0 00-.46-5.33z" },{ href: "https://instagram.com/guraneza", d: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 16a4 4 0 110-8 4 4 0 010 8zM17.5 6.5h.01" }].map((s, i) => (<a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={s.d}/></svg></a>))}</div></div>
          </div>
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6rem', color: textMuted, flexWrap: 'wrap', gap: '0.5rem' }}><span>&copy; 2026 GuraNeza. {t("copyright")}</span><div style={{ display: 'flex', gap: '0.3rem' }}>{[...Array(3)].map((_, i) => (<svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" style={{ animation: 'bounce 1.5s infinite', animationDelay: `${i * 0.2}s`, opacity: 0.3 + i * 0.2 }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>))}</div></div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;