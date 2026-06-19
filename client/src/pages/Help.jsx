import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const HelpIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>);
const SendIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const MessageIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const ChevronRightIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>);
const ArrowLeftIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
const ShieldIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const UserIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const ChevronDown = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>);
const FilterIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>);

function Help() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("faq");
  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const categoryRef = useRef(null);

  const categories = ["General", "Account", "Selling", "Buying", "Shops", "Payments", "Safety", "Technical", "Other"];

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchFaqs();
    fetchTickets();
  }, [user]);

  useEffect(() => {
    if (activeTicket) fetchResponses(activeTicket.id);
  }, [activeTicket]);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("https://guraneza.onrender.com/api/help/faqs");
      const data = await res.json();
      if (data.success) setFaqs(data.faqs);
    } catch (err) {}
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch("https://guraneza.onrender.com/api/help/tickets", { credentials: "include" });
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (err) {}
  };

  const fetchResponses = async (ticketId) => {
    try {
      const res = await fetch(`https://guraneza.onrender.com/api/help/tickets/${ticketId}/responses`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setResponses(data.responses);
    } catch (err) {}
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setSending(true); setError(""); setSuccess("");
    try {
      const res = await fetch("https://guraneza.onrender.com/api/help/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject: subject.trim(), message: message.trim(), category }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Ticket created successfully!");
        setSubject(""); setMessage(""); setCategory("General");
        fetchTickets();
        setActiveTicket(data.ticket);
        setActiveTab("chat");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setSending(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !activeTicket) return;
    setSendingReply(true);
    try {
      const res = await fetch(`https://guraneza.onrender.com/api/help/tickets/${activeTicket.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setResponses(prev => [...prev, data.response]);
        setReplyMessage("");
        fetchTickets();
      }
    } catch (err) {} finally {
      setSendingReply(false);
    }
  };

  const handleFaqClick = (question) => {
    setSubject(question);
    setMessage("");
    setCategory("General");
    setActiveTab("tickets");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '#f59e0b30' };
      case 'in_progress': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '#3b82f630' };
      case 'resolved': return { bg: accentBg, color: accent, border: `${accent}30` };
      case 'closed': return { bg: 'rgba(255,255,255,0.04)', color: textMuted, border: borderColor };
      default: return { bg: 'rgba(255,255,255,0.04)', color: textMuted, border: borderColor };
    }
  };

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.95)' : 'rgba(255,255,255,0.95)';

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, maxWidth: 400 }}>
          <LockIcon />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: textColor, marginTop: '1rem' }}>Please sign in</h2>
          <p style={{ color: textMuted, fontSize: '0.85rem', marginTop: '0.3rem' }}>Sign in to access help and support</p>
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
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .faq-item:hover { background: ${accentBg} !important; }
        .ticket-item:hover { background: ${accentBg} !important; }
        input:focus, textarea:focus { border-color: ${accent} !important; outline: none; }
        .msg-sent { border-bottom-right-radius: 4px !important; }
        .msg-received { border-bottom-left-radius: 4px !important; }
      `}</style>

      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.12 : 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(10,10,20,0.92)' : 'rgba(245,245,245,0.88)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.03 }}>
            <svg width={10 + Math.random() * 10} height={10 + Math.random() * 10} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5z"/></svg>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, letterSpacing: '-0.02em' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpIcon />
              </div>
              Help & Support
            </h1>
            <p style={{ color: textMuted, fontSize: '0.82rem', marginTop: '0.3rem', marginLeft: '0.3rem' }}>Get help with common issues or contact our support team</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '2rem', background: bgBlur, backdropFilter: 'blur(16px)', borderRadius: 14, padding: '0.3rem', border: `1px solid ${borderColor}`, width: 'fit-content', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab("faq")}
              style={{ padding: '0.55rem 1.3rem', borderRadius: 11, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === "faq" ? accent : 'transparent', color: activeTab === "faq" ? '#000' : textColor, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpIcon /> FAQ
            </button>
            <button onClick={() => setActiveTab("tickets")}
              style={{ padding: '0.55rem 1.3rem', borderRadius: 11, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === "tickets" ? accent : 'transparent', color: activeTab === "tickets" ? '#000' : textColor, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageIcon /> New Ticket
            </button>
            <button onClick={() => { setActiveTab("chat"); fetchTickets(); }}
              style={{ padding: '0.55rem 1.3rem', borderRadius: 11, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === "chat" ? accent : 'transparent', color: activeTab === "chat" ? '#000' : textColor, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldIcon /> My Tickets
            </button>
          </div>

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ color: textMuted, fontSize: '0.75rem', marginBottom: '0.5rem' }}>Click on a question to expand, or use "Ask about this" to create a ticket</p>
              {faqs.map((faq) => (
                <div key={faq.id} style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="faq-item"
                    style={{ width: '100%', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', color: textColor, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left', gap: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpIcon /> {faq.question}</span>
                    <span style={{ transform: expandedFaq === faq.id ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}><ChevronRightIcon /></span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div style={{ padding: '0 1.2rem 1rem', animation: 'fadeIn 0.2s ease' }}>
                      <p style={{ color: textMuted, fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.8rem' }}>{faq.answer}</p>
                      <button onClick={() => handleFaqClick(faq.question)}
                        style={{ padding: '0.5rem 1.2rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, background: accent, color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MessageIcon /> Ask about this
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Ticket Tab */}
          {activeTab === "tickets" && (
            <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, padding: '2rem', maxWidth: 600 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageIcon /> Create Support Ticket
              </h2>

              {error && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: 12, color: '#ff4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><XIcon /> {error}</div>}
              {success && <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: accentBg, border: `1px solid ${accent}40`, borderRadius: 12, color: accent, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckIcon /> {success}</div>}

              <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Subject *</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', color: textColor, boxSizing: 'border-box' }} />
                </div>

                {/* Category - Custom Dropdown */}
                <div ref={categoryRef} style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category</label>
                  <button 
                    type="button"
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    style={{ 
                      width: '100%', padding: '0.75rem 1rem', borderRadius: 14, 
                      border: `1px solid ${categoryOpen ? accent : borderColor}`,
                      background: inputBg, fontSize: '0.85rem', outline: 'none', 
                      color: category ? textColor : textMuted, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', 
                      justifyContent: 'space-between', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FilterIcon />
                      {category || "Select a category"}
                    </span>
                    <ChevronDown />
                  </button>
                  {categoryOpen && (
                    <div style={{ 
                      position: 'absolute', top: 'calc(100% + 0.4rem)', left: 0, right: 0,
                      background: dropdownBg, backdropFilter: 'blur(24px) saturate(200%)',
                      borderRadius: 14, border: `1px solid ${borderColor}`, 
                      boxShadow: '0 12px 32px rgba(0,0,0,0.2)', zIndex: 20,
                      maxHeight: 220, overflowY: 'auto', padding: '0.4rem',
                      animation: 'slideDown 0.15s ease'
                    }}>
                      {categories.map(cat => (
                        <div 
                          key={cat}
                          onClick={() => { setCategory(cat); setCategoryOpen(false); }}
                          style={{ 
                            padding: '0.55rem 1rem', borderRadius: 10, cursor: 'pointer',
                            fontSize: '0.78rem', color: category === cat ? accent : textColor,
                            background: category === cat ? accentBg : 'transparent',
                            fontWeight: category === cat ? 600 : 400,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { if (category !== cat) e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}
                          onMouseLeave={(e) => { if (category !== cat) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {cat}
                          {category === cat && <CheckIcon />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.4rem', color: textColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Message *</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail..." rows={5}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 14, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.85rem', color: textColor, resize: 'vertical', minHeight: 120, boxSizing: 'border-box' }} />
                </div>

                <button type="submit" disabled={sending}
                  style={{ padding: '0.8rem', borderRadius: 14, border: 'none', background: sending ? `${accent}60` : accent, color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <SendIcon /> {sending ? "Sending..." : "Submit Ticket"}
                </button>
              </form>
            </div>
          )}

          {/* My Tickets Tab - unchanged */}
          {activeTab === "chat" && (
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.2rem', borderBottom: `1px solid ${borderColor}` }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>My Tickets ({tickets.length})</h3>
                </div>
                {tickets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: textMuted, fontSize: '0.8rem' }}>
                    <MessageIcon />
                    <p style={{ marginTop: '0.5rem' }}>No tickets yet. Create one to get help.</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {tickets.map((ticket) => {
                      const statusStyle = getStatusStyle(ticket.status);
                      return (
                        <button key={ticket.id} onClick={() => { setActiveTicket(ticket); fetchResponses(ticket.id); }}
                          className="ticket-item"
                          style={{ width: '100%', padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer', textAlign: 'left', background: activeTicket?.id === ticket.id ? accentBg : 'transparent', borderLeft: activeTicket?.id === ticket.id ? `3px solid ${accent}` : '3px solid transparent', transition: 'all 0.15s ease', color: textColor, gap: '0.5rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{ticket.subject}</div>
                            <div style={{ fontSize: '0.65rem', color: textMuted, marginTop: '0.15rem' }}>{ticket.category} • {new Date(ticket.created_at).toLocaleDateString()}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.58rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            {parseInt(ticket.admin_responses_count) > 0 && (
                              <span style={{ background: accent, color: '#000', fontSize: '0.5rem', minWidth: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                {ticket.admin_responses_count}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {activeTicket && (
                <div style={{ background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.2rem', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{activeTicket.subject}</h4>
                      <span style={{ fontSize: '0.65rem', color: textMuted }}>{activeTicket.category} • <span style={{ textTransform: 'capitalize' }}>{activeTicket.status.replace('_', ' ')}</span></span>
                    </div>
                    <button onClick={() => setActiveTicket(null)}
                      style={{ padding: '0.3rem 0.6rem', borderRadius: 15, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ArrowLeftIcon /> Back
                    </button>
                  </div>

                  <div style={{ padding: '1rem', maxHeight: 350, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ maxWidth: '75%', padding: '0.6rem 0.9rem', borderRadius: 18, background: accent, color: '#000' }} className="msg-sent">
                        <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{activeTicket.message}</p>
                        <div style={{ fontSize: '0.55rem', opacity: 0.7, marginTop: '0.2rem', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                          <ClockIcon /> {new Date(activeTicket.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {responses.map((resp) => (
                      <div key={resp.id} style={{ display: 'flex', justifyContent: resp.is_admin ? 'flex-start' : 'flex-end' }}>
                        <div style={{ maxWidth: '75%', padding: '0.6rem 0.9rem', borderRadius: 18, background: resp.is_admin ? 'rgba(59,130,246,0.15)' : accent, color: resp.is_admin ? '#3b82f6' : '#000', border: resp.is_admin ? '1px solid rgba(59,130,246,0.3)' : 'none' }}
                          className={resp.is_admin ? 'msg-received' : 'msg-sent'}>
                          {resp.is_admin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem', fontSize: '0.6rem', fontWeight: 600 }}>
                              <ShieldIcon /> Admin Response
                            </div>
                          )}
                          {!resp.is_admin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem', fontSize: '0.6rem', fontWeight: 600 }}>
                              <UserIcon /> You
                            </div>
                          )}
                          <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{resp.message}</p>
                          <div style={{ fontSize: '0.55rem', opacity: 0.7, marginTop: '0.2rem', textAlign: 'right' }}>
                            {new Date(resp.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}

                    {responses.filter(r => r.is_admin).length === 0 && (
                      <p style={{ textAlign: 'center', color: textMuted, fontSize: '0.75rem', padding: '1rem' }}>Waiting for admin response. We usually reply within 24 hours.</p>
                    )}
                  </div>

                  {activeTicket.status !== 'closed' && activeTicket.status !== 'resolved' && (
                    <div style={{ padding: '0.8rem 1rem', borderTop: `1px solid ${borderColor}`, display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                        style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 25, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.8rem', color: textColor, outline: 'none' }} />
                      <button onClick={handleSendReply} disabled={sendingReply || !replyMessage.trim()}
                        style={{ width: 40, height: 40, borderRadius: '50%', background: sendingReply ? `${accent}60` : accent, color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <SendIcon />
                      </button>
                    </div>
                  )}
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
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor }}>Quick Links</h4>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Home</Link>
              <Link to="/shops" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Shops</Link>
              <Link to="/sell" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Sell</Link>
              <Link to="/cart" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Cart</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor }}>Categories</h4>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Electronics</Link>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Fashion</Link>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>Home & Living</Link>
              <Link to="/home" style={{ fontSize: '0.65rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Automotive</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', color: textColor }}>Connect</h4>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <a href="#" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
                <a href="#" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 16a4 4 0 110-8 4 4 0 010 8zM17.5 6.5h.01"/></svg>
                </a>
                <a href="#" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29.94 29.94 0 001 11.75a29.94 29.94 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29.94 29.94 0 00.46-5.25 29.94 29.94 0 00-.46-5.33z"/></svg>
                </a>
                <a href="#" style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.8rem', textAlign: 'center', fontSize: '0.6rem', color: textMuted }}>&copy; 2026 GuraNeza. Made in Rwanda</div>
        </div>
      </footer>
    </div>
  );
}

export default Help;