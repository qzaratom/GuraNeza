import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/logo.png";
import videoGif from "../../assets/video.gif";

// SVG Icons
const DashboardIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>);
const UsersIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>);
const ProductsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ShopsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const StarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const RequestsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
const HelpIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>);
const HomeIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const ProfileIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const LogoutIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>);
const ShieldIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);

function AdminLayout() {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [helpPendingCount, setHelpPendingCount] = useState(0);
  const [requestsPendingCount, setRequestsPendingCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchPendingCounts();
    const interval = setInterval(fetchPendingCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingCounts = async () => {
    try {
      const helpRes = await fetch("http://localhost:5000/api/help/tickets/all", { credentials: "include" });
      const helpData = await helpRes.json();
      if (helpData.success) {
        const pending = helpData.tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
        setHelpPendingCount(pending);
      }

      const reqRes = await fetch("http://localhost:5000/api/admin/feedback/subscription-requests", { credentials: "include" });
      const reqData = await reqRes.json();
      if (reqData.success) {
        setRequestsPendingCount(reqData.requests.filter(r => r.status === 'pending').length);
      }
    } catch (err) {}
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { id: "users", label: "User Management", icon: <UsersIcon />, path: "/admin/users" },
    { id: "products", label: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { id: "shops", label: "Shops", icon: <ShopsIcon />, path: "/admin/shops" },
    { id: "subscriptions", label: "Plans", icon: <StarIcon />, path: "/admin/subscriptions" },
    { id: "requests", label: "Sub Requests", icon: <RequestsIcon />, path: "/admin/requests", badge: requestsPendingCount },
    { id: "help", label: "Help & Support", icon: <HelpIcon />, path: "/admin/help", badge: helpPendingCount },
  ];

  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/admin") return "dashboard";
    const found = sidebarItems.find(item => path.startsWith(item.path) && item.path !== "/admin");
    return found ? found.id : "dashboard";
  };

  const activePage = getActivePage();

  // Theme
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const accent = '#00E309';
  const accentBg = 'rgba(0,227,9,0.1)';

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: '#0a0a14', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,20,0.94)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '3rem', background: 'rgba(26,26,46,0.6)', backdropFilter: 'blur(20px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <ShieldIcon />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginTop: '1rem' }}>Access Denied</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Admin access required</p>
          <button onClick={() => navigate("/")} style={{ marginTop: '1.5rem', padding: '0.7rem 2rem', borderRadius: 30, background: '#00E309', color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", display: 'flex', position: 'relative', background: '#0a0a14' }}>
      
      <style>{`
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.04; } 95% { opacity: 0.04; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        .sidebar-link { transition: all 0.2s ease; }
        .sidebar-link:hover { background: rgba(0,227,9,0.08) !important; color: #00E309 !important; }
        .sidebar-link:hover svg { stroke: #00E309 !important; }
      `}</style>

      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,20,0.95)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.03 }}>
            <svg width={10 + Math.random() * 10} height={10 + Math.random() * 10} viewBox="0 0 24 24" fill="white"><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5z"/></svg>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{ 
        width: sidebarCollapsed ? 80 : 280, 
        flexShrink: 0,
        position: 'fixed', 
        insetY: 0, 
        left: 0, 
        zIndex: 50,
        background: 'rgba(8,8,24,0.85)',
        backdropFilter: 'blur(24px) saturate(200%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease'
      }}>
        
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? '1.5rem 1rem' : '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: sidebarCollapsed ? '0' : '0.8rem', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
          <img src={logo} alt="GuraNeza" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,227,9,0.3))' }} />
          {!sidebarCollapsed && (
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>GURANEZA</h1>
              <p style={{ fontSize: '0.6rem', color: '#00E309', margin: 0, fontWeight: 500 }}>Admin Panel</p>
            </div>
          )}
        </div>

        {/* User */}
        <div style={{ padding: sidebarCollapsed ? '1rem 0.5rem' : '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: sidebarCollapsed ? '0' : '0.8rem', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,227,9,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E309', fontWeight: 700, fontSize: '1rem', flexShrink: 0, border: '1px solid rgba(0,227,9,0.3)' }}>
            {user.username?.[0]?.toUpperCase() || "A"}
          </div>
          {!sidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</p>
              <p style={{ fontSize: '0.6rem', color: '#00E309', margin: 0, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckIcon /> Admin
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: sidebarCollapsed ? '1rem 0.5rem' : '1rem 0.8rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="sidebar-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? '0' : '0.7rem',
                padding: sidebarCollapsed ? '0.7rem' : '0.65rem 1rem',
                borderRadius: 12,
                fontSize: '0.78rem',
                fontWeight: activePage === item.id ? 600 : 400,
                color: activePage === item.id ? '#00E309' : 'rgba(255,255,255,0.6)',
                background: activePage === item.id ? 'rgba(0,227,9,0.1)' : 'transparent',
                border: activePage === item.id ? '1px solid rgba(0,227,9,0.2)' : '1px solid transparent',
                textDecoration: 'none',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                position: 'relative'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{ 
                      background: '#ff4444', 
                      color: 'white', 
                      fontSize: '0.55rem', 
                      minWidth: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700,
                      padding: '0 5px'
                    }}>
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}
              {sidebarCollapsed && item.badge > 0 && (
                <span style={{ 
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#ff4444', 
                  color: 'white', 
                  fontSize: '0.45rem', 
                  minWidth: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700
                }}>
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: sidebarCollapsed ? '1rem 0.5rem' : '1rem 0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Link to="/home" className="sidebar-link"
            style={{
              display: 'flex', alignItems: 'center', gap: sidebarCollapsed ? '0' : '0.6rem',
              padding: sidebarCollapsed ? '0.6rem' : '0.55rem 1rem',
              borderRadius: 12, fontSize: '0.73rem', color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none', justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
            }}>
            <HomeIcon /> {!sidebarCollapsed && "Back to Site"}
          </Link>
          <button onClick={handleLogout} className="sidebar-link"
            style={{
              display: 'flex', alignItems: 'center', gap: sidebarCollapsed ? '0' : '0.6rem',
              padding: sidebarCollapsed ? '0.6rem' : '0.55rem 1rem',
              borderRadius: 12, fontSize: '0.73rem', color: 'rgba(255,255,255,0.5)',
              background: 'transparent', border: 'none', cursor: 'pointer', width: '100%',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
            }}>
            <LogoutIcon /> {!sidebarCollapsed && "Logout"}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(0,227,9,0.2)',
            border: '1px solid rgba(0,227,9,0.3)',
            color: '#00E309',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            zIndex: 60,
            backdropFilter: 'blur(8px)'
          }}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarCollapsed ? 80 : 280, transition: 'margin-left 0.3s ease', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Top Bar */}
        <div style={{ 
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(8,8,24,0.75)', 
          backdropFilter: 'blur(20px) saturate(200%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                {sidebarItems.find(item => item.id === activePage)?.label || "Admin"}
              </h2>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                {activePage === 'dashboard' ? 'Overview of your platform' : 
                 activePage === 'users' ? 'Manage user accounts' :
                 activePage === 'products' ? 'Manage product listings' :
                 activePage === 'shops' ? 'Manage shop profiles' :
                 activePage === 'subscriptions' ? 'Manage subscription plans' :
                 activePage === 'requests' ? 'Review subscription requests' :
                 activePage === 'help' ? 'Respond to support tickets' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1rem', borderRadius: 20,
                background: 'rgba(0,227,9,0.08)', border: '1px solid rgba(0,227,9,0.15)'
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E309', boxShadow: '0 0 8px rgba(0,227,9,0.5)' }} />
                <span style={{ fontSize: '0.65rem', color: '#00E309', fontWeight: 500 }}>Online</span>
              </div>
              <Link to="/home" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <HomeIcon /> View Site
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1rem 2rem', 
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(8,8,24,0.5)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)'
        }}>
          <span>&copy; 2026 GuraNeza Admin</span>
          <span>Made in Rwanda</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;