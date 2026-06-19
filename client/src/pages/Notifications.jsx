import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const BellIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>);
const CheckIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const DeleteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const PackageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const CartIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>);
const MessageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const UserIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const LinkIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>);

function Notifications() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    // Listen for new notifications
    const handleUpdate = () => fetchNotifications();
    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("chatUpdated", handleUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("chatUpdated", handleUpdate);
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://guraneza.onrender.com/api/notifications", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`https://guraneza.onrender.com/api/notifications/${id}/read`, {
        method: "PUT", credentials: "include",
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      window.dispatchEvent(new CustomEvent("notificationRead"));
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await fetch("https://guraneza.onrender.com/api/notifications/read-all", {
        method: "PUT", credentials: "include",
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setMessage("All marked as read!");
      setTimeout(() => setMessage(""), 2000);
      window.dispatchEvent(new CustomEvent("notificationRead"));
    } catch (err) {}
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`https://guraneza.onrender.com/api/notifications/${id}`, {
        method: "DELETE", credentials: "include",
      });
      setNotifications(notifications.filter(n => n.id !== id));
      window.dispatchEvent(new CustomEvent("notificationRead"));
    } catch (err) {}
  };

  const clearAllNotifications = async () => {
    try {
      await fetch("https://guraneza.onrender.com/api/notifications/clear-all", {
        method: "DELETE", credentials: "include",
      });
      setNotifications([]);
      setShowClearConfirm(false);
      setMessage("All cleared!");
      setTimeout(() => setMessage(""), 2000);
      window.dispatchEvent(new CustomEvent("notificationRead"));
    } catch (err) {}
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product': return <PackageIcon />;
      case 'order': return <CartIcon />;
      case 'chat': return <MessageIcon />;
      case 'system': return <StarIcon />;
      case 'user': return <UserIcon />;
      default: return <BellIcon />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'product': return 'rgba(0,227,9,0.1)';
      case 'order': return 'rgba(59,130,246,0.1)';
      case 'chat': return 'rgba(168,85,247,0.1)';
      case 'system': return 'rgba(234,179,8,0.1)';
      case 'user': return 'rgba(239,68,68,0.1)';
      default: return 'rgba(0,227,9,0.1)';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const unreadBg = darkMode ? 'rgba(0,227,9,0.05)' : 'rgba(0,227,9,0.04)';

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, maxWidth: 400 }}>
          <LockIcon />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: textColor, marginTop: '1rem' }}>Please sign in</h2>
          <button onClick={() => navigate("/login")} style={{ marginTop: '1.5rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
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
        .notif-item:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>

      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.12 : 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(10,10,20,0.92)' : 'rgba(245,245,245,0.88)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.04 }}>
            <svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5z"/></svg>
          </div>
        ))}
      </div>

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 300, background: 'rgba(0,227,9,0.15)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '12px 20px', border: '1px solid rgba(0,227,9,0.3)', color: accent, fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeIn 0.2s ease' }}>
          <CheckIcon /> {message}
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 650, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.02em' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: '#ef4444', border: '2px solid ' + (darkMode ? '#0a0a14' : '#f5f5f5') }} />
                  )}
                </div>
                Notifications
              </h1>
              <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', marginLeft: '0.3rem' }}>
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead}
                  style={{ padding: '0.5rem 1.2rem', borderRadius: 25, fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${accent}`, background: 'transparent', color: accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckIcon /> Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={() => setShowClearConfirm(true)}
                  style={{ padding: '0.5rem 1.2rem', borderRadius: 25, fontSize: '0.72rem', fontWeight: 600, border: '1px solid #ff4444', background: 'transparent', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <DeleteIcon /> Clear All
                </button>
              )}
            </div>
          </div>

          {/* Clear All Confirmation */}
          {showClearConfirm && (
            <div style={{ marginBottom: '1rem', padding: '1rem 1.2rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
              <p style={{ color: '#ff4444', fontSize: '0.82rem', fontWeight: 500, margin: 0 }}>Delete all notifications? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={clearAllNotifications} style={{ padding: '0.4rem 1rem', borderRadius: 20, background: '#ff4444', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DeleteIcon /> Yes, Delete All</button>
                <button onClick={() => setShowClearConfirm(false)} style={{ padding: '0.4rem 1rem', borderRadius: 20, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
              <div style={{ width: 36, height: 36, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
              <p style={{ color: textMuted, marginTop: '0.8rem', fontSize: '0.85rem' }}>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
              <BellIcon />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.8rem' }}>No notifications yet</h2>
              <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>You're all caught up! Notifications will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className="notif-item"
                  style={{
                    background: n.is_read ? cardBg : unreadBg,
                    backdropFilter: 'blur(16px)',
                    borderRadius: 16,
                    border: `1px solid ${borderColor}`,
                    padding: '1rem 1.2rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    borderLeft: n.is_read ? '3px solid transparent' : `3px solid ${accent}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}>
                  
                  {/* Icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: getNotificationBg(n.type),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: accent
                  }}>
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h4 style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {n.title}
                        {!n.is_read && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                        )}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.6rem', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <ClockIcon /> {getTimeAgo(n.created_at)}
                        </span>
                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          style={{
                            width: 26, height: 26, borderRadius: '50%',
                            border: '1px solid rgba(255,0,0,0.15)', background: 'transparent',
                            color: '#ff4444', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.55rem', opacity: 0.5, transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
                          <XIcon />
                        </button>
                      </div>
                    </div>
                    <p style={{ color: textMuted, fontSize: '0.75rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    {n.type && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                        padding: '2px 8px', borderRadius: 20, fontSize: '0.58rem',
                        fontWeight: 500, marginTop: '0.4rem',
                        background: getNotificationBg(n.type),
                        color: accent, textTransform: 'capitalize'
                      }}>
                        <LinkIcon /> {n.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
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
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor }}>Quick Links</h4>
              <a href="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Home</a>
              <a href="/shops" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Shops</a>
              <a href="/sell" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Sell</a>
              <a href="/cart" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Cart</a>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor }}>Categories</h4>
              <a href="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Electronics</a>
              <a href="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Fashion</a>
              <a href="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Home & Living</a>
              <a href="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Automotive</a>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor }}>Connect</h4>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {["M23 3a10.9","M22.54 6.42","M16 4H8"].map((d, i) => (
                  <a key={i} href="#" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
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

export default Notifications;