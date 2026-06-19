import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// SVG Icons
const UsersIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>);
const ProductsIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ShopsIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const RequestsIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>);
const HelpIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>);
const CheckIcon = () => (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const ArrowUpIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>);
const ArrowDownIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);
const EyeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [requests, setRequests] = useState([]);
  const [helpTickets, setHelpTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, productsRes, shopsRes, reqRes, helpRes] = await Promise.all([
        fetch("https://guraneza.onrender.com/api/admin/stats", { credentials: "include" }),
        fetch("https://guraneza.onrender.com/api/admin/users", { credentials: "include" }),
        fetch("https://guraneza.onrender.com/api/admin/products", { credentials: "include" }),
        fetch("https://guraneza.onrender.com/api/shops", { credentials: "include" }),
        fetch("https://guraneza.onrender.com/api/admin/feedback/subscription-requests", { credentials: "include" }),
        fetch("https://guraneza.onrender.com/api/help/tickets/all", { credentials: "include" }),
      ]);
      
      const statsData = await statsRes.json(); 
      if (statsData.success) setStats(statsData.stats);
      
      const usersData = await usersRes.json(); 
      if (usersData.success) setUsers(usersData.users);
      
      const productsData = await productsRes.json(); 
      if (productsData.success) setProducts(productsData.products);
      
      const shopsData = await shopsRes.json(); 
      if (shopsData.success) setShops(shopsData.shops);
      
      const reqData = await reqRes.json(); 
      if (reqData.success) setRequests(reqData.requests);
      
      const helpData = await helpRes.json(); 
      if (helpData.success) setHelpTickets(helpData.tickets || []);
    } catch (err) { 
      console.error("Error:", err); 
    } finally { 
      setLoading(false); 
    }
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
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const pendingHelpTickets = helpTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const verifiedProducts = products.filter(p => p.verified).length;
  const verifiedShops = shops.filter(s => s.is_verified).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#00E309', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '0.85rem' }}>Loading dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Users", 
      value: stats?.users || 0, 
      icon: <UsersIcon />, 
      accent: '#00E309',
      bg: 'rgba(0,227,9,0.08)',
      border: 'rgba(0,227,9,0.2)',
      link: "/admin/users"
    },
    { 
      label: "Total Products", 
      value: stats?.products || 0, 
      sub: `${verifiedProducts} verified`,
      icon: <ProductsIcon />, 
      accent: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.2)',
      link: "/admin/products"
    },
    { 
      label: "Total Shops", 
      value: stats?.shops || 0, 
      sub: `${verifiedShops} verified`,
      icon: <ShopsIcon />, 
      accent: '#a855f7',
      bg: 'rgba(168,85,247,0.08)',
      border: 'rgba(168,85,247,0.2)',
      link: "/admin/shops"
    },
    { 
      label: "Sub Requests", 
      value: pendingRequests, 
      sub: `${requests.length} total`,
      icon: <RequestsIcon />, 
      accent: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      link: "/admin/requests"
    },
    { 
      label: "Help Tickets", 
      value: pendingHelpTickets, 
      sub: `${helpTickets.length} total`,
      icon: <HelpIcon />, 
      accent: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.2)',
      link: "/admin/help"
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            style={{ 
              background: 'rgba(26,26,46,0.5)', 
              backdropFilter: 'blur(16px)',
              borderRadius: 18, 
              padding: '1.4rem', 
              border: `1px solid ${stat.border}`,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3)`;
              e.currentTarget.style.borderColor = stat.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = stat.border;
            }}
          >
            {/* Glow effect */}
            <div style={{ 
              position: 'absolute', top: -20, right: -20, 
              width: 80, height: 80, borderRadius: '50%',
              background: stat.accent, opacity: 0.06, filter: 'blur(20px)'
            }} />
            
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.accent, margin: '0.3rem 0 0', lineHeight: 1 }}>
                  {stat.value.toLocaleString()}
                </p>
                {stat.sub && (
                  <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', margin: '0.3rem 0 0' }}>
                    {stat.sub}
                  </p>
                )}
              </div>
              <div style={{ 
                width: 44, height: 44, borderRadius: 12, 
                background: stat.bg, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.2rem' }}>
        
        {/* Recent Users */}
        <div style={{ 
          background: 'rgba(26,26,46,0.5)', 
          backdropFilter: 'blur(16px)',
          borderRadius: 18, 
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1.2rem 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UsersIcon /> Recent Users
            </h3>
            <Link to="/admin/users" style={{ fontSize: '0.7rem', color: '#00E309', textDecoration: 'none', fontWeight: 500 }}>
              View All →
            </Link>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {users.slice(0, 5).map((u, i) => (
              <div key={u.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '0.8rem', 
                padding: '0.7rem 1.5rem',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ 
                  width: 36, height: 36, borderRadius: 10, 
                  background: 'rgba(0,227,9,0.12)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#00E309', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {u.profile_picture ? <img src={u.profile_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (u.username || "U")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.username}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: '0.1rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.email}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <span style={{ 
                    padding: '2px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600,
                    background: u.role === 'admin' ? 'rgba(239,68,68,0.15)' : 'rgba(0,227,9,0.08)',
                    color: u.role === 'admin' ? '#ef4444' : '#00E309',
                    border: `1px solid ${u.role === 'admin' ? 'rgba(239,68,68,0.3)' : 'rgba(0,227,9,0.15)'}`
                  }}>
                    {u.role || "user"}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <ClockIcon /> {getTimeAgo(u.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div style={{ 
          background: 'rgba(26,26,46,0.5)', 
          backdropFilter: 'blur(16px)',
          borderRadius: 18, 
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '1.2rem 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ProductsIcon /> Recent Products
            </h3>
            <Link to="/admin/products" style={{ fontSize: '0.7rem', color: '#00E309', textDecoration: 'none', fontWeight: 500 }}>
              View All →
            </Link>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {products.slice(0, 5).map((p, i) => (
              <div key={p.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '0.8rem', 
                padding: '0.7rem 1.5rem',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ 
                  width: 36, height: 36, borderRadius: 10, 
                  background: 'rgba(255,255,255,0.04)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0
                }}>
                  {p.image_urls?.[0] ? (
                    <img src={p.image_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ProductsIcon />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: '0.1rem 0 0' }}>
                    {Number(p.price).toLocaleString()} RWF • {p.username}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <span style={{ 
                    padding: '2px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600,
                    background: p.verified ? 'rgba(0,227,9,0.08)' : 'rgba(245,158,11,0.08)',
                    color: p.verified ? '#00E309' : '#f59e0b',
                    border: `1px solid ${p.verified ? 'rgba(0,227,9,0.15)' : 'rgba(245,158,11,0.15)'}`,
                    display: 'flex', alignItems: 'center', gap: '0.2rem'
                  }}>
                    {p.verified ? <><CheckIcon /> Verified</> : "Pending"}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <EyeIcon /> {p.views || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;