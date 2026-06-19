import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const PackageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const PlusIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>);
const EditIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const DeleteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const EyeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const DownloadIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const ArrowLeftIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
const HandshakeIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>);

function MyProducts() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState({ count: 0, limit: 10, canAdd: true });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    if (!user) return;
    fetchMyProducts();
    fetchProductCount();
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products?owner_id=${user.id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const fetchProductCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subscriptions/product-count", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) setProductCount(data);
    } catch (err) {}
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE", credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId));
        setDeleteConfirm(null);
        fetchProductCount();
      }
    } catch (err) {}
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDownloadExcel = () => {
    // Create CSV content
    const headers = ["Product Name", "Description", "Price (RWF)", "Category", "Status", "Verified", "Negotiable", "Views", "Stock", "Created At"];
    const rows = filteredProducts.map(p => [
      p.name || "",
      (p.description || "").replace(/,/g, " ").substring(0, 100),
      p.price || 0,
      p.category || "",
      p.status || "active",
      p.verified ? "Yes" : "No",
      p.negotiable ? "Yes" : "No",
      p.views || 0,
      p.stock_quantity || 1,
      p.created_at ? new Date(p.created_at).toLocaleDateString() : ""
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `my-products-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredProducts = products
    .filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (sortField === "price" || sortField === "views") {
        valA = Number(valA); valB = Number(valB);
      }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

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
  const tableHeaderBg = darkMode ? 'rgba(0,227,9,0.06)' : 'rgba(0,227,9,0.04)';
  const tableRowHover = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

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
        .table-row:hover { background: ${tableRowHover} !important; }
        .sort-btn:hover { color: ${accent} !important; }
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
            <svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/sell" style={{ 
                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', 
                borderRadius: 20, border: `1px solid ${borderColor}`, color: textMuted, 
                textDecoration: 'none', fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.2s'
              }}>
                <ArrowLeftIcon /> Back
              </Link>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PackageIcon />
                  </div>
                  My Products
                </h1>
                <p style={{ color: textMuted, fontSize: '0.75rem', marginTop: '0.2rem', marginLeft: '0.2rem' }}>
                  {productCount.count} / {productCount.limit === 999999 ? "Unlimited" : productCount.limit} products
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleDownloadExcel}
                style={{
                  padding: '0.55rem 1.2rem', borderRadius: 25, fontSize: '0.75rem', fontWeight: 600,
                  border: `1px solid ${accent}`, background: 'transparent', color: accent,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}>
                <DownloadIcon /> Export Excel
              </button>
              <Link to={productCount.canAdd ? "/sell" : "#"}
                onClick={(e) => {
                  if (!productCount.canAdd) {
                    e.preventDefault();
                    alert(`You've reached your limit (${productCount.count}/${productCount.limit}). Upgrade your plan to add more.`);
                  }
                }}
                style={{
                  padding: '0.55rem 1.2rem', borderRadius: 25, fontSize: '0.75rem', fontWeight: 700,
                  background: productCount.canAdd ? accent : 'rgba(255,255,255,0.05)',
                  color: productCount.canAdd ? '#000' : textMuted,
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  pointerEvents: productCount.canAdd ? 'auto' : 'none'
                }}>
                <PlusIcon /> Add Product
              </Link>
            </div>
          </div>

          {/* Product Limit Warning */}
          {!productCount.canAdd && (
            <div style={{ marginBottom: '1.5rem', padding: '0.8rem 1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠</span> You've reached your product limit ({productCount.count}/{productCount.limit}). 
              <Link to="/profile" style={{ color: accent, fontWeight: 600, textDecoration: 'underline' }}>Upgrade your plan</Link> to add more.
            </div>
          )}

          {/* Search Bar */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: bgBlur, backdropFilter: 'blur(20px)', borderRadius: 16,
            border: `1px solid ${borderColor}`, padding: '0.5rem 1rem', marginBottom: '1.5rem',
            maxWidth: 400
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', outline: 'none', color: textColor }} />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }}>
                <XIcon />
              </button>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
              <div style={{ width: 40, height: 40, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
              <p style={{ color: textMuted, marginTop: '0.8rem' }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
              <PackageIcon />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.8rem' }}>No products yet</h2>
              <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>Start selling by adding your first product</p>
              <Link to="/sell" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.5rem', borderRadius: 25, background: accent, color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                <PlusIcon /> Add Product
              </Link>
            </div>
          ) : (
            <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
              
              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: tableHeaderBg, borderBottom: `2px solid ${borderColor}` }}>
                      <th style={{ padding: '0.8rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Product</th>
                      <th onClick={() => handleSort("price")} className="sort-btn" style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted, cursor: 'pointer' }}>
                        Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("category")} className="sort-btn" style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted, cursor: 'pointer' }}>
                        Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Status</th>
                      <th onClick={() => handleSort("views")} className="sort-btn" style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted, cursor: 'pointer' }}>
                        Views {sortField === "views" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="table-row" style={{ borderBottom: `1px solid ${borderColor}`, transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '0.7rem 1rem' }}>
                          <Link to={`/product/${product.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', background: 'rgba(0,0,0,0.05)', flexShrink: 0 }}>
                              {product.image_urls?.[0] ? (
                                <img src={product.image_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PackageIcon /></div>
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                              <div style={{ fontSize: '0.65rem', color: textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                                {(product.description || "No description").substring(0, 50)}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center', fontWeight: 700, color: accent, whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                          {Number(product.price).toLocaleString()} RWF
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.65rem', background: accentBg, color: accent, fontWeight: 500 }}>
                            {product.category || "—"}
                          </span>
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                            <span style={{ 
                              padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 500,
                              background: product.status === 'active' ? accentBg : 'rgba(255,255,255,0.04)',
                              color: product.status === 'active' ? accent : textMuted,
                              textTransform: 'capitalize'
                            }}>
                              {product.status || "active"}
                            </span>
                            {product.verified && <span style={{ padding: '2px 6px', borderRadius: 20, fontSize: '0.6rem', background: accent, color: '#000' }}><CheckIcon /></span>}
                            {product.negotiable && <span style={{ padding: '2px 6px', borderRadius: 20, fontSize: '0.6rem', background: accentBg, color: accent, display: 'flex', alignItems: 'center', gap: 2 }}><HandshakeIcon /></span>}
                          </div>
                        </td>
                        <td style={{ padding: '0.7rem 0.5rem', textAlign: 'center', color: textMuted }}>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                            <EyeIcon /> {product.views || 0}
                          </span>
                        </td>
                        <td style={{ padding: '0.7rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <Link to={`/edit-product/${product.id}`}
                              style={{
                                padding: '0.4rem 0.8rem', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
                                border: `1px solid ${accent}`, color: accent, textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s'
                              }}>
                              <EditIcon /> Edit
                            </Link>
                            <button onClick={() => setDeleteConfirm(product.id)}
                              style={{
                                padding: '0.4rem 0.8rem', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
                                border: '1px solid #ff4444', color: '#ff4444', background: 'transparent',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s'
                              }}>
                              <DeleteIcon /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && searchTerm && (
                <div style={{ textAlign: 'center', padding: '2rem', color: textMuted, fontSize: '0.8rem' }}>
                  No products match your search
                </div>
              )}

              {/* Table Footer */}
              <div style={{ padding: '0.7rem 1rem', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: textMuted }}>
                <span>Showing {filteredProducts.length} of {products.length} products</span>
                <span>Click column headers to sort</span>
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

      {/* Delete Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 20, padding: '1.8rem', maxWidth: 400, width: '90%', border: `1px solid ${borderColor}`, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <DeleteIcon />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>Delete Product?</h3>
            <p style={{ color: textMuted, fontSize: '0.8rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: '#ff4444', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}><DeleteIcon /> Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProducts;