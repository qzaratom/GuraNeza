import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const CartIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>);
const PackageIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const DeleteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const UserIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

function Cart() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/cart", { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        setCartItems(data.cart);
      } else {
        setError("Failed to load cart");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(cartId);
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(cartItems.map(item => 
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        ));
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (err) {} finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartId) => {
    setUpdating(cartId);
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE", credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setCartItems(cartItems.filter(item => item.cart_id !== cartId));
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (err) {} finally {
      setUpdating(null);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
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
          <p style={{ color: textMuted, fontSize: '0.85rem', marginTop: '0.3rem' }}>You need to be logged in to view your cart</p>
          <button onClick={() => navigate("/login")} style={{ marginTop: '1.5rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
          <div style={{ width: 40, height: 40, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          <p style={{ color: textMuted, marginTop: '1rem', fontSize: '0.9rem' }}>Loading cart...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.02em' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CartIcon />
              </div>
              Shopping Cart
            </h1>
            <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', marginLeft: '0.3rem' }}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '1.5rem', padding: '0.8rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 14, color: '#ff4444', fontSize: '0.8rem' }}>{error}</div>
          )}

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
              <CartIcon />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.8rem' }}>Your cart is empty</h2>
              <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>Add some products to get started!</p>
              <Link to="/home" style={{ marginTop: '1.2rem', display: 'inline-block', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: tableHeaderBg, borderBottom: `2px solid ${borderColor}` }}>
                        <th style={{ padding: '0.9rem 1.2rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Product</th>
                        <th style={{ padding: '0.9rem 0.8rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Price</th>
                        <th style={{ padding: '0.9rem 0.8rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Quantity</th>
                        <th style={{ padding: '0.9rem 0.8rem', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted }}>Subtotal</th>
                        <th style={{ padding: '0.9rem 1.2rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: textMuted, width: 60 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.cart_id} className="table-row" style={{ borderBottom: `1px solid ${borderColor}`, transition: 'background 0.15s ease' }}>
                          {/* Product */}
                          <td style={{ padding: '0.8rem 1.2rem' }}>
                            <div onClick={() => navigate(`/product/${item.id}`)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: 'rgba(0,0,0,0.05)', flexShrink: 0 }}>
                                {item.image_urls?.[0] ? (
                                  <img src={item.image_urls[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PackageIcon /></div>
                                )}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                <div style={{ fontSize: '0.65rem', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                                  <UserIcon /> {item.owner_name || item.shop_name || "Unknown"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td style={{ padding: '0.8rem 0.8rem', textAlign: 'center', fontWeight: 600, color: accent, whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                            {Number(item.price).toLocaleString()} RWF
                          </td>

                          {/* Quantity */}
                          <td style={{ padding: '0.8rem 0.8rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                              <button
                                onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                                disabled={updating === item.cart_id || item.quantity <= 1}
                                style={{
                                  width: 28, height: 28, borderRadius: '50%', 
                                  border: `1px solid ${borderColor}`, background: 'transparent',
                                  color: textColor, cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.8rem', fontWeight: 500, opacity: item.quantity <= 1 ? 0.4 : 1
                                }}>
                                −
                              </button>
                              <span style={{ fontWeight: 600, fontSize: '0.8rem', minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                disabled={updating === item.cart_id}
                                style={{
                                  width: 28, height: 28, borderRadius: '50%',
                                  border: `1px solid ${borderColor}`, background: 'transparent',
                                  color: textColor, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.8rem', fontWeight: 500
                                }}>
                                +
                              </button>
                            </div>
                          </td>

                          {/* Subtotal */}
                          <td style={{ padding: '0.8rem 0.8rem', textAlign: 'right', fontWeight: 700, color: accent, whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                            {(Number(item.price) * item.quantity).toLocaleString()} RWF
                          </td>

                          {/* Remove */}
                          <td style={{ padding: '0.8rem 1.2rem', textAlign: 'center' }}>
                            <button
                              onClick={() => removeItem(item.cart_id)}
                              disabled={updating === item.cart_id}
                              style={{
                                width: 30, height: 30, borderRadius: '50%',
                                border: '1px solid #ff4444', background: 'transparent',
                                color: '#ff4444', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', opacity: updating === item.cart_id ? 0.5 : 1
                              }}>
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Cart Total</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: accent }}>{totalAmount.toLocaleString()} RWF</div>
                  <div style={{ fontSize: '0.7rem', color: textMuted, marginTop: '0.2rem' }}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</div>
                </div>
                <Link to="/home" style={{ padding: '0.7rem 1.8rem', borderRadius: 30, background: accent, color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CartIcon /> Continue Shopping
                </Link>
              </div>
            </>
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
                {["M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21","M23 3a10.9 10.9 0 01-3.14 1.53","M22.54 6.42a2.78 2.78 0 00-1.94-2","M16 4H8a4 4 0 00-4 4v8"].map((d, i) => (
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

export default Cart;