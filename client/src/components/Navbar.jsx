import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";

// SVG Icons
const HomeIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>);
const ShopsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>);
const SellIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>);
const ProductsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ChatIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>);
const CartIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>);
const BellIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>);
const ProfileIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const UpgradeIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
const AdminIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>);
const LogoutIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>);
const SunIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>);
const MoonIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>);
const DotsIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2.5" fill="#00E309"/><circle cx="12" cy="12" r="2.5" fill="#00E309"/><circle cx="12" cy="19" r="2.5" fill="#00E309"/></svg>);
const CloseIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const ChevronDown = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>);

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("guraneza_language") || "en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const langLabels = { en: "EN", fr: "FR", rw: "RW" };
  const langNames = { en: "English", fr: "Français", rw: "Kinyarwanda" };

  const desktopLinks = [
    { to: "/home", label: "Home", Icon: HomeIcon },
    { to: "/shops", label: "Shops", Icon: ShopsIcon },
    { to: "/sell", label: "Sell", Icon: SellIcon },
    { to: "/my-products", label: "My Products", Icon: ProductsIcon },
  ];

  const mobileBottomLinks = [
    { to: "/home", label: "Home", Icon: HomeIcon },
    { to: "/shops", label: "Shops", Icon: ShopsIcon },
    { to: "/sell", label: "Sell", Icon: SellIcon },
    { to: "/chats", label: "Chats", Icon: ChatIcon, badge: unreadMessages },
    { to: "/cart", label: "Cart", Icon: CartIcon },
  ];

  useEffect(() => {
    if (!user) return;
    fetchCounts();
    const handleCartUpdate = () => fetchCounts();
    const handleChatUpdate = () => fetchUnreadMessages();
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("chatUpdated", handleChatUpdate);
    const interval = setInterval(fetchCounts, 5000);
    return () => { clearInterval(interval); window.removeEventListener("cartUpdated", handleCartUpdate); window.removeEventListener("chatUpdated", handleChatUpdate); };
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const fetchCounts = () => { fetchUnreadNotifications(); fetchUnreadMessages(); };
  const fetchUnreadNotifications = async () => {
    try { const res = await fetch("https://guraneza.onrender.com/api/notifications", { credentials: "include" }); const data = await res.json(); if (data.success) setUnreadNotifications(data.unreadCount); } catch (err) {}
  };
  const fetchUnreadMessages = async () => {
    try { const res = await fetch("https://guraneza.onrender.com/api/chat/unread", { credentials: "include" }); const data = await res.json(); if (data.success) setUnreadMessages(data.unreadCount); } catch (err) {}
  };

  const changeLanguage = (l) => {
    setLang(l);
    localStorage.setItem("guraneza_language", l);
    setLangOpen(false);
  };

  const handleLogout = async () => { await logout(); navigate("/"); setShowDropdown(false); };

  const navBg = darkMode ? 'rgba(0,1,36,0.7)' : 'rgba(255,255,255,0.7)';
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.9)' : 'rgba(255,255,255,0.9)';

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .show-mobile { display: flex !important; } }
        .nav-btn { transition: all 0.2s ease; cursor: pointer; }
        .nav-btn:hover { background: ${accentBg} !important; color: ${accent} !important; }
        .nav-btn:hover svg { stroke: ${accent} !important; }
        .dropdown-item { transition: all 0.15s ease; cursor: pointer; }
        .dropdown-item:hover { background: ${accentBg} !important; }
        .bottom-nav-item { transition: all 0.2s ease; }
        .bottom-nav-item:hover { color: ${accent} !important; }
        .bottom-nav-item:hover svg { stroke: ${accent} !important; }
        .sidebar-item { transition: all 0.15s ease; cursor: pointer; }
        .sidebar-item:hover { background: ${accentBg} !important; color: ${accent} !important; }
        .sidebar-item:hover svg { stroke: ${accent} !important; }
      `}</style>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250 }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 270, height: '100%', background: dropdownBg, backdropFilter: 'blur(24px) saturate(200%)', padding: '1.5rem 1rem', borderLeft: `1px solid ${borderColor}`, animation: 'slideIn 0.25s ease', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={logo} alt="GuraNeza" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: textColor }}>GURANEZA</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CloseIcon /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '1rem' }}>
              <Link to="/my-products" onClick={() => setSidebarOpen(false)} className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.6rem', borderRadius: 8, color: textColor, textDecoration: 'none', fontSize: '0.8rem' }}><ProductsIcon /> My Products</Link>
              <Link to="/notifications" onClick={() => setSidebarOpen(false)} className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.6rem', borderRadius: 8, color: textColor, textDecoration: 'none', fontSize: '0.8rem' }}>
                <BellIcon /> Alerts
                {unreadNotifications > 0 && <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: '0.55rem', minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>}
              </Link>
              <Link to="/upgrade" onClick={() => setSidebarOpen(false)} className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.6rem', borderRadius: 8, color: textColor, textDecoration: 'none', fontSize: '0.8rem' }}><UpgradeIcon /> Upgrade</Link>
            </div>

            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.6rem', color: textMuted, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Language</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Object.entries(langLabels).map(([code, label]) => (
                  <button key={code} onClick={() => changeLanguage(code)} className="sidebar-item" style={{ padding: '0.45rem 0.6rem', borderRadius: 8, border: lang === code ? `1px solid ${accent}` : `1px solid ${borderColor}`, background: lang === code ? accentBg : 'transparent', color: lang === code ? accent : textColor, cursor: 'pointer', fontSize: '0.7rem', fontWeight: lang === code ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {langNames[code]} <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.6rem', color: textMuted, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Appearance</p>
              <button onClick={toggleDarkMode} className="sidebar-item" style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                {darkMode ? <><SunIcon /> Light Mode</> : <><MoonIcon /> Dark Mode</>}
              </button>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '1rem', borderTop: `1px solid ${borderColor}` }}>
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setSidebarOpen(false)} className="sidebar-item" style={{ padding: '0.5rem', borderRadius: 8, border: `1px solid ${borderColor}`, color: textColor, textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><ProfileIcon /> Profile</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setSidebarOpen(false)} className="sidebar-item" style={{ padding: '0.5rem', borderRadius: 8, border: `1px solid ${borderColor}`, color: textColor, textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><AdminIcon /> Admin Panel</Link>
                  )}
                  <button onClick={() => { handleLogout(); setSidebarOpen(false); }} className="sidebar-item" style={{ padding: '0.5rem', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><LogoutIcon /> Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setSidebarOpen(false)} style={{ padding: '0.5rem', textAlign: 'center', borderRadius: 8, background: accent, color: '#000124', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: navBg, backdropFilter: 'blur(16px) saturate(180%)', borderBottom: `1px solid ${borderColor}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          
          {/* Logo */}
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: textColor, flexShrink: 0 }}>
            <img src={logo} alt="GuraNeza" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>GURANEZA</span>
            <span style={{ fontSize: '0.6rem', color: accent, fontWeight: 400 }}>| BuySmart</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
            {desktopLinks.map(link => (
              <Link key={link.to} to={link.to} className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.65rem', borderRadius: 8, color: location.pathname === link.to ? accent : textMuted, textDecoration: 'none', fontSize: '0.75rem', fontWeight: location.pathname === link.to ? 600 : 400, background: location.pathname === link.to ? accentBg : 'transparent' }}>
                <link.Icon /> {link.label}
              </Link>
            ))}
            <Link to="/chats" className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.65rem', borderRadius: 8, color: location.pathname === "/chats" ? accent : textMuted, textDecoration: 'none', fontSize: '0.75rem', fontWeight: location.pathname === "/chats" ? 600 : 400, background: location.pathname === "/chats" ? accentBg : 'transparent', position: 'relative' }}>
              <ChatIcon /> Chat
              {unreadMessages > 0 && <span style={{ position: 'absolute', top: -3, right: -4, background: '#ef4444', color: 'white', fontSize: '0.5rem', minWidth: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadMessages > 9 ? '9+' : unreadMessages}</span>}
            </Link>
            <Link to="/cart" className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.65rem', borderRadius: 8, color: location.pathname === "/cart" ? accent : textMuted, textDecoration: 'none', fontSize: '0.75rem', fontWeight: location.pathname === "/cart" ? 600 : 400, background: location.pathname === "/cart" ? accentBg : 'transparent' }}>
              <CartIcon /> Cart
            </Link>
          </div>

          {/* Desktop Right */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
            {/* Language Switcher */}
            <div ref={langRef} style={{ position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }} className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.35rem 0.5rem', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600, color: textColor }}>
                {langLabels[lang]} <ChevronDown />
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 0.3rem)', right: 0, minWidth: 160, background: dropdownBg, backdropFilter: 'blur(24px) saturate(200%)', borderRadius: 14, padding: '0.4rem 0', zIndex: 20, border: `1px solid ${borderColor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fadeIn 0.15s ease' }}>
                  {Object.entries(langLabels).map(([code, label]) => (
                    <div key={code} onClick={() => changeLanguage(code)} className="dropdown-item" style={{ padding: '0.45rem 1rem', cursor: 'pointer', fontSize: '0.7rem', color: lang === code ? accent : textColor, fontWeight: lang === code ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{langNames[code]}</span>
                      <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>{label}</span>
                      {lang === code && <span style={{ color: accent, fontSize: '0.7rem' }}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleDarkMode} className="nav-btn" style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* User */}
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.4rem', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <img src={user.profile_picture} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${accent}`, objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 500, color: textColor, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</span>
                  <ChevronDown />
                </button>
                {showDropdown && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 0.3rem)', right: 0, minWidth: 180, background: dropdownBg, backdropFilter: 'blur(24px) saturate(200%)', borderRadius: 14, padding: '0.4rem 0', zIndex: 20, border: `1px solid ${borderColor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fadeIn 0.15s ease' }}>
                    <div style={{ padding: '0.5rem 1rem', borderBottom: `1px solid ${borderColor}`, marginBottom: '0.2rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: textColor }}>{user.username}</p>
                      <p style={{ fontSize: '0.6rem', color: textMuted }}>{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: textColor, textDecoration: 'none', fontSize: '0.7rem' }}><ProfileIcon /> Profile</Link>
                    <Link to="/my-products" onClick={() => setShowDropdown(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: textColor, textDecoration: 'none', fontSize: '0.7rem' }}><ProductsIcon /> My Products</Link>
                    <Link to="/upgrade" onClick={() => setShowDropdown(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: textColor, textDecoration: 'none', fontSize: '0.7rem' }}><UpgradeIcon /> Upgrade</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: textColor, textDecoration: 'none', fontSize: '0.7rem' }}><AdminIcon /> Admin</Link>
                    )}
                    <div style={{ borderTop: `1px solid ${borderColor}`, marginTop: '0.2rem', paddingTop: '0.2rem' }}>
                      <button onClick={handleLogout} className="dropdown-item" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem' }}><LogoutIcon /> Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-btn" style={{ padding: '0.4rem 1rem', borderRadius: 20, background: accent, color: '#000124', fontWeight: 600, fontSize: '0.7rem', textDecoration: 'none', letterSpacing: '0.02em' }}>Sign In</Link>
            )}
          </div>

          {/* Mobile Right: Profile + 3-Dots */}
          <div className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
            {user && (
              <Link to="/profile">
                <img src={user.profile_picture} alt="" style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${accent}`, objectFit: 'cover' }} />
              </Link>
            )}
            <button onClick={() => setSidebarOpen(true)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DotsIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="show-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: 'blur(16px) saturate(180%)', borderTop: `1px solid ${borderColor}`, padding: '0.25rem 0.5rem', paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))', display: 'none', justifyContent: 'space-around', alignItems: 'center' }}>
        {mobileBottomLinks.map(link => (
          <Link key={link.to} to={link.to} className="bottom-nav-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', padding: '0.3rem 0.4rem', color: location.pathname === link.to ? accent : textMuted, textDecoration: 'none', fontSize: '0.5rem', fontWeight: location.pathname === link.to ? 600 : 400, position: 'relative' }}>
            <link.Icon /> {link.label}
            {link.badge > 0 && <span style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: 'white', fontSize: '0.45rem', minWidth: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{link.badge > 9 ? '9+' : link.badge}</span>}
          </Link>
        ))}
      </div>
    </>
  );
}

export default Navbar;