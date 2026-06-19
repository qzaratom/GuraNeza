import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const PackageIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ShopIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const ShieldIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const CrownIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#1a1a2e" strokeWidth="1"><path d="M2 6l4 8h12l4-8-4.5 4.5L12 4 6.5 10.5 2 6zM4 19h16v2H4z"/></svg>);
const ChevronDown = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);

function Upgrade() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "", shop_description: "", shop_category: "",
    shop_location: "", shop_phone: "", shop_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("plans");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const categories = ["Electronics", "Fashion", "Groceries", "Home & Living", "Beauty & Personal Care", "Agriculture", "Automotive", "Sports & Fitness", "Books & Educational", "Other"];

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchPlans();
    fetchMyRequests();
  }, [user]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subscriptions/plans", { credentials: "include" });
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch (err) {}
  };

  const fetchMyRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subscription-requests/my-requests", { credentials: "include" });
      const data = await res.json();
      if (data.success) setMyRequests(data.requests);
    } catch (err) {}
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const needsShop = selectedPlan.shop_badge;
    if (needsShop && !formData.shop_name.trim()) {
      setError("Shop name is required for this plan");
      return;
    }

    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/subscription-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ requested_plan_id: selectedPlan.id, ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Request submitted! Admin will review it soon.");
        setShowForm(false);
        setSelectedPlan(null);
        setFormData({ shop_name: "", shop_description: "", shop_category: "", shop_location: "", shop_phone: "", shop_email: "" });
        fetchMyRequests();
        setActiveTab("requests");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.95)' : 'rgba(255,255,255,0.95)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const vipBg = darkMode ? 'rgba(234,179,8,0.15)' : 'rgba(234,179,8,0.1)';

  if (!user) return null;

  const pendingCount = myRequests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.06; } 95% { opacity: 0.06; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .plan-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.3) !important; }
        input:focus, textarea:focus { border-color: ${accent} !important; outline: none; }
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

      {/* Request Form Modal */}
      {showForm && selectedPlan && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 24, padding: '2rem', maxWidth: 500, width: '90%', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${borderColor}`, animation: 'fadeIn 0.2s ease' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.3rem' }}>Request {selectedPlan.plan_name} Plan</h2>
            <p style={{ color: textMuted, fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              {selectedPlan.shop_badge ? "A shop is required for this plan." : "Submit your request for review."}
            </p>

            {error && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 12, color: '#ff4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><XIcon /> {error}</div>}
            {success && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: accentBg, border: `1px solid ${accent}40`, borderRadius: 12, color: accent, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckIcon /> {success}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedPlan.shop_badge && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Shop Name *</label>
                    <input type="text" name="shop_name" value={formData.shop_name} onChange={handleFormChange} placeholder="Enter shop name"
                      style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 12, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description</label>
                    <textarea name="shop_description" value={formData.shop_description} onChange={handleFormChange} rows={2} placeholder="Describe your shop..."
                      style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 12, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: textColor, resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div ref={categoryRef} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category</label>
                    <button type="button" onClick={() => setCategoryOpen(!categoryOpen)}
                      style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 12, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: formData.shop_category ? textColor : textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                      {formData.shop_category || "Select category"} <ChevronDown />
                    </button>
                    {categoryOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: dropdownBg, backdropFilter: 'blur(20px)', borderRadius: 12, border: `1px solid ${borderColor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 10, maxHeight: 180, overflowY: 'auto', padding: '0.3rem', animation: 'slideDown 0.15s ease' }}>
                        {categories.map(cat => (
                          <div key={cat} onClick={() => { setFormData(prev => ({ ...prev, shop_category: cat })); setCategoryOpen(false); }}
                            style={{ padding: '0.5rem 0.8rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', color: formData.shop_category === cat ? accent : textColor, background: formData.shop_category === cat ? accentBg : 'transparent', fontWeight: formData.shop_category === cat ? 600 : 400 }}>
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location</label>
                      <input type="text" name="shop_location" value={formData.shop_location} onChange={handleFormChange} placeholder="e.g. Kigali"
                        style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 12, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: textColor, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Phone</label>
                      <input type="text" name="shop_phone" value={formData.shop_phone} onChange={handleFormChange} placeholder="e.g. 0789564312"
                        style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 12, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: textColor, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email</label>
                    <input type="email" name="shop_email" value={formData.shop_email} onChange={handleFormChange} placeholder="shop@example.com"
                      style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 12, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: textColor, boxSizing: 'border-box' }} />
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.5rem' }}>
                <button type="submit" disabled={loading}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 14, border: 'none', background: loading ? `${accent}60` : accent, color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setSelectedPlan(null); }}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.02em' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarIcon />
              </div>
              Upgrade Your Plan
            </h1>
            <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', marginLeft: '0.3rem' }}>Choose a plan that works for you and unlock more features</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '2rem', background: bgBlur, backdropFilter: 'blur(16px)', borderRadius: 14, padding: '0.3rem', border: `1px solid ${borderColor}`, width: 'fit-content' }}>
            <button onClick={() => setActiveTab("plans")}
              style={{ padding: '0.55rem 1.3rem', borderRadius: 11, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === "plans" ? accent : 'transparent', color: activeTab === "plans" ? '#000' : textColor, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <StarIcon /> Plans
            </button>
            <button onClick={() => setActiveTab("requests")}
              style={{ padding: '0.55rem 1.3rem', borderRadius: 11, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === "requests" ? accent : 'transparent', color: activeTab === "requests" ? '#000' : textColor, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PackageIcon /> My Requests {pendingCount > 0 && <span style={{ background: accent, color: '#000', fontSize: '0.55rem', minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{pendingCount}</span>}
            </button>
          </div>

          {/* Plans Tab */}
          {activeTab === "plans" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {plans.map((plan) => {
                const isCurrent = plan.plan_name === user?.subscription_type;
                const isFree = plan.plan_name === "Free";
                const isVip = plan.vip_badge;

                return (
                  <div key={plan.id} className="plan-card"
                    style={{
                      background: isVip ? vipBg : cardBg,
                      backdropFilter: 'blur(16px)', borderRadius: 20, padding: '1.5rem',
                      border: isCurrent ? `2px solid ${accent}` : isVip ? '2px solid #eab308' : `1px solid ${borderColor}`,
                      textAlign: 'center', position: 'relative', transition: 'all 0.3s ease', cursor: 'default'
                    }}>
                    
                    {/* VIP Crown */}
                    {isVip && (
                      <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
                        <CrownIcon />
                      </div>
                    )}

                    {/* Current Badge */}
                    {isCurrent && (
                      <span style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', borderRadius: 20, fontSize: '0.55rem', fontWeight: 700, background: accent, color: '#000' }}>
                        Current
                      </span>
                    )}

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: `${isVip ? '1.2rem 0 0' : '0 0 0.8rem'}`, color: isVip ? '#eab308' : textColor }}>
                      {plan.plan_name}
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: accent, marginBottom: '0.2rem' }}>
                      {Number(plan.price).toLocaleString()} RWF
                    </div>
                    <div style={{ fontSize: '0.65rem', color: textMuted, marginBottom: '1rem' }}>/month</div>

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.7rem', marginBottom: '1.2rem', textAlign: 'left', padding: '0 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <PackageIcon /> {plan.product_limit === 999999 ? "Unlimited" : plan.product_limit} products
                      </div>
                      {[
                        { key: 'verified_seller_badge', label: 'Verified Seller' },
                        { key: 'verified_product_badge', label: 'Verified Products' },
                        { key: 'premium_badge', label: 'Premium Badge' },
                        { key: 'shop_badge', label: 'Shop Badge' },
                        { key: 'shop_enabled', label: 'Shop Enabled' },
                        { key: 'vip_badge', label: 'VIP Badge' },
                      ].map(feature => (
                        <div key={feature.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {plan[feature.key] ? (
                            <span style={{ color: accent }}><CheckIcon /></span>
                          ) : (
                            <span style={{ color: textMuted, opacity: 0.4 }}><XIcon /></span>
                          )}
                          <span style={{ color: plan[feature.key] ? textColor : textMuted, opacity: plan[feature.key] ? 1 : 0.5 }}>
                            {feature.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent || isFree}
                      style={{
                        width: '100%', padding: '0.6rem', borderRadius: 25, fontSize: '0.75rem', fontWeight: 700,
                        border: 'none', cursor: (isCurrent || isFree) ? 'not-allowed' : 'pointer',
                        background: (isCurrent || isFree) ? inputBg : accent,
                        color: (isCurrent || isFree) ? textMuted : '#000',
                        transition: 'all 0.2s ease'
                      }}>
                      {isCurrent ? 'Current Plan' : isFree ? 'Default' : 'Upgrade'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div>
              {myRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}` }}>
                  <PackageIcon />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.8rem' }}>No requests yet</h2>
                  <p style={{ color: textMuted, fontSize: '0.8rem', marginTop: '0.3rem' }}>Submit a plan upgrade request to see it here</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {myRequests.map((req) => (
                    <div key={req.id} style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 18, padding: '1.3rem 1.5rem', border: `1px solid ${borderColor}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{req.plan_name} Plan</h3>
                          <p style={{ color: textMuted, fontSize: '0.7rem', margin: '0.15rem 0 0' }}>{req.price?.toLocaleString()} RWF/month</p>
                        </div>
                        <span style={{
                          padding: '4px 14px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize',
                          background: req.status === 'approved' ? accentBg : req.status === 'rejected' ? 'rgba(255,0,0,0.08)' : 'rgba(245,158,11,0.1)',
                          color: req.status === 'approved' ? accent : req.status === 'rejected' ? '#ff4444' : '#f59e0b',
                          border: `1px solid ${req.status === 'approved' ? accent : req.status === 'rejected' ? '#ff4444' : '#f59e0b'}30`
                        }}>
                          {req.status}
                        </span>
                      </div>

                      {req.shop_name && (
                        <div style={{ padding: '0.7rem 1rem', borderRadius: 12, background: inputBg, marginBottom: '0.8rem' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <ShopIcon /> {req.shop_name}
                          </p>
                          {req.shop_description && <p style={{ color: textMuted, fontSize: '0.68rem', margin: '0.2rem 0 0' }}>{req.shop_description}</p>}
                        </div>
                      )}

                      {req.admin_message && (
                        <div style={{
                          padding: '0.7rem 1rem', borderRadius: 12, fontSize: '0.75rem',
                          background: req.status === 'approved' ? accentBg : 'rgba(255,0,0,0.06)',
                          color: req.status === 'approved' ? accent : '#ff4444',
                          border: `1px solid ${req.status === 'approved' ? accent : '#ff4444'}30`
                        }}>
                          <p style={{ fontWeight: 600, margin: '0 0 0.2rem' }}>Admin Response:</p>
                          <p style={{ margin: 0 }}>{req.admin_message}</p>
                        </div>
                      )}

                      <p style={{ color: textMuted, fontSize: '0.62rem', marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ClockIcon /> Submitted {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                {["M3 21l1.65-3.8","M23 3a10.9","M22.54 6.42","M16 4H8"].map((d, i) => (
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

export default Upgrade;