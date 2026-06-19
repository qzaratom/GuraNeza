import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const UserIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const EmailIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const PhoneIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const LocationIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const StarIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const LogoutIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>);
const DeleteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const ShieldIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const SettingsIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>);
const EditIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);

function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    location: "",
    bio: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      const data = {
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        location: user.location || "",
        bio: user.bio || "",
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleReset = () => {
    setFormData(originalData);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (!formData.username.trim()) {
      setError("Display name is required");
      return;
    }
    setLoading(true); setError(""); setSuccess("");
    try {
      const response = await fetch("https://guraneza.onrender.com/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username.trim(),
          phone_number: formData.phone_number.trim(),
          location: formData.location.trim(),
          bio: formData.bio.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess("Profile updated successfully!");
        setOriginalData(formData);
        await refreshUser();
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://guraneza.onrender.com/api/auth/account", {
        method: "DELETE", credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        await logout();
        navigate("/");
      } else {
        setError(data.message || "Failed to delete account");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, maxWidth: 400 }}>
          <LockIcon />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: textColor, marginTop: '1rem' }}>Please sign in</h2>
          <p style={{ color: textMuted, fontSize: '0.85rem', marginTop: '0.3rem' }}>You need to be logged in to view your profile</p>
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
        .tab-btn:hover { color: ${accent} !important; }
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

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          
          {/* Profile Header Card */}
          <div style={{ 
            background: `linear-gradient(135deg, ${darkMode ? '#0d2b0d' : '#e8ffe8'}, ${darkMode ? '#061a06' : '#d0ffd0'})`,
            borderRadius: 24, padding: '2rem', marginBottom: '1.5rem', border: `1px solid ${borderColor}`,
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <div style={{ 
                width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
                border: `3px solid ${accent}`, flexShrink: 0,
                background: `linear-gradient(135deg, ${accent}, #22c55e)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', fontWeight: 700, color: '#000'
              }}>
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user.username || "U")[0].toUpperCase()
                )}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{user.username}</h1>
                <p style={{ color: textMuted, fontSize: '0.8rem', margin: '0.2rem 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <EmailIcon /> {user.email}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {user.is_verified && (
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 700, background: accent, color: '#000', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckIcon /> Verified
                    </span>
                  )}
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: accentBg, color: accent }}>
                    {user.subscription_type || "Free"} Plan
                  </span>
                  {user.role === "admin" && (
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 700, background: '#eab308', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarIcon /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.5rem', background: bgBlur, backdropFilter: 'blur(16px)', borderRadius: 14, padding: '0.3rem', border: `1px solid ${borderColor}`, width: 'fit-content' }}>
            {[
              { key: "profile", icon: <EditIcon />, label: "Edit Profile" },
              { key: "subscription", icon: <StarIcon />, label: "Subscription" },
              { key: "settings", icon: <SettingsIcon />, label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="tab-btn"
                style={{
                  padding: '0.55rem 1.3rem', borderRadius: 11, fontSize: '0.75rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeTab === tab.key ? accent : 'transparent',
                  color: activeTab === tab.key ? '#000' : textColor,
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, padding: '2rem', overflow: 'hidden' }}>
            
            {activeTab === "profile" && (
              <div style={{ maxWidth: 600 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <EditIcon /> Edit Profile
                </h2>

                {success && (
                  <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', background: accentBg, border: `1px solid ${accent}40`, borderRadius: 14, color: accent, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckIcon /> {success}
                  </div>
                )}
                {error && (
                  <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 14, color: '#ff4444', fontSize: '0.8rem' }}>{error}</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Display Name *</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email Address</label>
                    <input type="email" value={formData.email} disabled
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)', fontSize: '0.85rem', color: textMuted, boxSizing: 'border-box', cursor: 'not-allowed' }} />
                    <p style={{ fontSize: '0.6rem', color: textMuted, marginTop: '0.3rem' }}>Email cannot be changed</p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Phone Number</label>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="e.g. +250 788 123 456"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kigali, Rwanda"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', outline: 'none', color: textColor, resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                    <button onClick={handleSave} disabled={loading || !hasChanges}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: 14, border: 'none', background: (loading || !hasChanges) ? `${accent}60` : accent, color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: (loading || !hasChanges) ? 'not-allowed' : 'pointer' }}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={handleReset} disabled={loading || !hasChanges}
                      style={{ padding: '0.8rem 1.5rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontWeight: 600, fontSize: '0.85rem', cursor: (loading || !hasChanges) ? 'not-allowed' : 'pointer' }}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscription" && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <StarIcon />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '1rem' }}>{user.subscription_type || "Free"} Plan</h3>
                <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', maxWidth: 400, margin: '0.3rem auto 0' }}>
                  {user.subscription_type === "Free" 
                    ? "You are on the Free plan. Upgrade to unlock more features and increase your product limits."
                    : `You are on the ${user.subscription_type} plan with enhanced features.`}
                </p>
                <Link to="/upgrade" style={{ marginTop: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                  <StarIcon /> Manage Subscription
                </Link>
              </div>
            )}

            {activeTab === "settings" && (
              <div style={{ maxWidth: 600 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SettingsIcon /> Account Settings
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: "Username", value: user.username, icon: <UserIcon /> },
                    { label: "Email", value: user.email, icon: <EmailIcon /> },
                    { label: "Phone", value: user.phone_number || "Not set", icon: <PhoneIcon /> },
                    { label: "Role", value: (user.role || "User").charAt(0).toUpperCase() + (user.role || "User").slice(1), icon: <ShieldIcon /> },
                    { label: "Plan", value: (user.subscription_type || "Free").charAt(0).toUpperCase() + (user.subscription_type || "Free").slice(1), icon: <StarIcon /> },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 1rem', borderRadius: 12, background: inputBg }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.6rem', color: textMuted, textTransform: 'uppercase' }}>{item.label}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {user.role === "admin" && (
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.75rem', borderRadius: 14, background: '#eab308', color: '#1a1a2e', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.7rem', boxSizing: 'border-box' }}>
                    <ShieldIcon /> Admin Dashboard
                  </Link>
                )}

                <button onClick={() => { logout(); navigate("/"); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.75rem', borderRadius: 14, background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                  <LogoutIcon /> Logout
                </button>

                {/* Delete Account */}
                <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '1.2rem' }}>
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, padding: 0 }}>
                      <DeleteIcon /> Delete Account
                    </button>
                  ) : (
                    <div style={{ padding: '1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 14 }}>
                      <p style={{ color: '#ff4444', fontWeight: 600, fontSize: '0.8rem', margin: '0 0 0.8rem' }}>Are you sure? This cannot be undone.</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleDeleteAccount} disabled={loading}
                          style={{ flex: 1, padding: '0.5rem', borderRadius: 10, background: '#ff4444', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                          <DeleteIcon /> {loading ? "Deleting..." : "Yes, Delete"}
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)}
                          style={{ flex: 1, padding: '0.5rem', borderRadius: 10, background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
              <p style={{ fontSize: '0.65rem', color: textMuted, margin: 0, lineHeight: 1.5 }}>Rwanda's trusted marketplace for buying and selling.</p>
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

export default Profile;