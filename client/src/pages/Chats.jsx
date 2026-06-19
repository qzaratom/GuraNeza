import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

// SVG Icons
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const SendIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const MessageIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const DeleteIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>);
const DoubleCheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3l-8 8-3-3M23 3l-8 8-3-3"/></svg>);
const LockIcon = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>);
const XIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const LocationIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const EmailIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const ArrowDownIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>);

function Chats() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [convSearch, setConvSearch] = useState("");
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const otherUserId = searchParams.get("user");

  useEffect(() => {
    if (!user) return;
    fetchConversations();
    const interval = setInterval(() => {
      if (activeConversation) fetchMessages(activeConversation.id, true);
      fetchConversations();
      window.dispatchEvent(new CustomEvent("chatUpdated"));
    }, 3000);
    return () => clearInterval(interval);
  }, [user, activeConversation]);

  useEffect(() => {
    if (otherUserId && user && user.id !== otherUserId) {
      startConversation(otherUserId);
    }
  }, [otherUserId, user]);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (el) {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowScrollDown(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/conversations", { credentials: "include" });
      const data = await response.json();
      if (data.success) setConversations(data.conversations);
    } catch (err) {} finally { setLoading(false); }
  };

  const startConversation = async (userId) => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/conversations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ otherUserId: userId }),
      });
      const data = await response.json();
      if (data.success) {
        setActiveConversation(data.conversation);
        fetchMessages(data.conversation.id);
        fetchConversations();
        setShowSidebar(false);
      }
    } catch (err) {}
  };

  const fetchMessages = async (conversationId, isPolling = false) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}/messages`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        if (!isPolling) {
          setMessages(data.messages);
          setTimeout(() => scrollToBottom(), 100);
        } else {
          setMessages(data.messages);
        }
      }
    } catch (err) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    setSending(true);
    try {
      const response = await fetch("http://localhost:5000/api/chat/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ conversation_id: activeConversation.id, message: newMessage }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
        setTimeout(() => scrollToBottom(), 50);
      }
    } catch (err) {} finally { setSending(false); }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}`, {
        method: "DELETE", credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        if (activeConversation?.id === conversationId) { setActiveConversation(null); setMessages([]); }
        setConversations(prev => prev.filter(c => c.id !== conversationId));
        setShowDeleteConfirm(null);
      }
    } catch (err) {}
  };

  const getOtherUser = (conv) => {
    if (!user) return {};
    if (conv.user1_id === user.id) {
      return { id: conv.user2_id, name: conv.user2_name, picture: conv.user2_picture, email: conv.user2_email, location: conv.user2_location, created_at: conv.user2_created_at };
    }
    return { id: conv.user1_id, name: conv.user1_name, picture: conv.user1_picture, email: conv.user1_email, location: conv.user1_location, created_at: conv.user1_created_at };
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date(); const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMemberDuration = (dateString) => {
    if (!dateString) return "New";
    const now = new Date(); const date = new Date(dateString);
    const months = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return "New member";
    if (months < 12) return `${months} months`;
    return `${Math.floor(months / 12)} years`;
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherUser(conv);
    return (other.name || "").toLowerCase().includes(convSearch.toLowerCase());
  });

  const textColor = darkMode ? 'white' : '#1a1a2e';
  const textMuted = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const bgBlur = darkMode ? 'rgba(0,1,36,0.5)' : 'rgba(255,255,255,0.5)';
  const dropdownBg = darkMode ? 'rgba(0,1,36,0.95)' : 'rgba(255,255,255,0.95)';
  const cardBg = darkMode ? 'rgba(26,26,46,0.4)' : 'rgba(255,255,255,0.9)';
  const accent = '#00E309';
  const accentBg = darkMode ? 'rgba(0,227,9,0.1)' : 'rgba(0,227,9,0.08)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const sidebarBg = darkMode ? 'rgba(15,15,30,0.7)' : 'rgba(248,248,250,0.9)';
  const chatBg = darkMode ? 'rgba(10,10,20,0.5)' : 'rgba(245,245,247,0.8)';
  const receivedBg = darkMode ? 'rgba(26,26,46,0.6)' : 'white';

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", background: darkMode ? '#0a0a14' : '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${borderColor}`, maxWidth: 400 }}>
          <LockIcon />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: textColor, marginTop: '1rem' }}>Please sign in</h2>
          <p style={{ color: textMuted, fontSize: '0.85rem', marginTop: '0.3rem' }}>You need to be logged in to chat</p>
          <button onClick={() => navigate("/login")} style={{ marginTop: '1.5rem', padding: '0.7rem 2rem', borderRadius: 30, background: accent, color: '#000', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
        </div>
      </div>
    );
  }

  const otherUser = activeConversation ? getOtherUser(activeConversation) : {};

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: textColor, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.06; } 95% { opacity: 0.06; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        .conv-item:hover { background: ${accentBg} !important; }
        .msg-sent { border-bottom-right-radius: 4px !important; }
        .msg-received { border-bottom-left-radius: 4px !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-conversations { display: flex !important; }
          .desktop-chat-area { display: none !important; }
          .mobile-chat-area { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-conversations { display: none !important; }
          .desktop-chat-area { display: flex !important; }
          .mobile-chat-area { display: none !important; }
        }
      `}</style>

      {/* Video Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.08 : 0.03 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(10,10,20,0.94)' : 'rgba(245,245,245,0.9)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 90}%`, bottom: '-30px', animation: `bagRise ${4 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.03 }}>
            <svg width={10 + Math.random() * 10} height={10 + Math.random() * 10} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5z"/></svg>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 20, padding: '1.8rem', maxWidth: 400, width: '90%', border: `1px solid ${borderColor}`, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}><DeleteIcon /></div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem', color: textColor }}>Delete Conversation?</h3>
            <p style={{ color: textMuted, fontSize: '0.8rem', margin: '0 0 1.5rem' }}>All messages will be permanently deleted.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleDeleteConversation(showDeleteConfirm)} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: '#ff4444', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}><DeleteIcon /> Delete</button>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: 14, background: 'transparent', border: `1px solid ${borderColor}`, color: textColor, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && otherUser.id && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: dropdownBg, backdropFilter: 'blur(24px)', borderRadius: 24, padding: '2rem', maxWidth: 360, width: '90%', border: `1px solid ${borderColor}`, textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#000', margin: '0 auto 1rem', overflow: 'hidden' }}>
              {otherUser.picture ? <img src={otherUser.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (otherUser.name || "U")[0].toUpperCase()}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: textColor, margin: 0 }}>{otherUser.name || "Unknown"}</h3>
            {otherUser.email && <p style={{ color: textMuted, fontSize: '0.8rem', margin: '0.3rem 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}><EmailIcon /> {otherUser.email}</p>}
            {otherUser.location && <p style={{ color: textMuted, fontSize: '0.8rem', margin: '0.2rem 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}><LocationIcon /> {otherUser.location}</p>}
            <p style={{ color: textMuted, fontSize: '0.75rem', margin: '0.3rem 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}><ClockIcon /> Member for {getMemberDuration(otherUser.created_at)}</p>
            <button onClick={() => setShowProfile(false)} style={{ marginTop: '1.2rem', padding: '0.6rem 2rem', borderRadius: 25, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* ============ DESKTOP LAYOUT ============ */}
        <div className="desktop-sidebar" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 400 }}>
          
          {/* Sidebar */}
          <div style={{ width: 320, flexShrink: 0, background: sidebarBg, backdropFilter: 'blur(20px)', borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.2rem', borderBottom: `1px solid ${borderColor}`, flexShrink: 0 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: textColor }}>
                <MessageIcon /> Messages
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: inputBg, borderRadius: 16, border: `1px solid ${borderColor}`, padding: '0.45rem 0.8rem' }}>
                <SearchIcon />
                <input type="text" placeholder="Search conversations..." value={convSearch} onChange={(e) => setConvSearch(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.75rem', outline: 'none', color: textColor }} />
                {convSearch && <button onClick={() => setConvSearch("")} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer', padding: '0.2rem' }}><XIcon /></button>}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ width: 32, height: 32, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: textMuted, fontSize: '0.8rem' }}>
                  <MessageIcon />
                  <p style={{ marginTop: '0.5rem' }}>{conversations.length === 0 ? "No conversations yet" : "No conversations match"}</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherUser(conv);
                  return (
                    <button key={conv.id} onClick={() => { setActiveConversation(conv); fetchMessages(conv.id); setShowProfile(false); }}
                      className="conv-item"
                      style={{
                        width: '100%', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.7rem',
                        border: 'none', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer', textAlign: 'left',
                        background: activeConversation?.id === conv.id ? accentBg : 'transparent',
                        borderLeft: activeConversation?.id === conv.id ? `3px solid ${accent}` : '3px solid transparent',
                        transition: 'all 0.15s ease', color: textColor
                      }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#000', flexShrink: 0, overflow: 'hidden' }}>
                        {other.picture ? <img src={other.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (other.name || "U")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{other.name || "Unknown"}</span>
                          <span style={{ fontSize: '0.6rem', color: textMuted, flexShrink: 0, marginLeft: '0.5rem' }}>{conv.last_message_time ? getTimeAgo(conv.last_message_time) : ""}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.15rem' }}>
                          <span style={{ fontSize: '0.7rem', color: textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                            {conv.last_message || "No messages yet"}
                          </span>
                          {conv.unread_count > 0 && (
                            <span style={{ background: accent, color: '#000', fontSize: '0.55rem', minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, marginLeft: '0.4rem', padding: '0 4px' }}>
                              {conv.unread_count > 99 ? "99+" : conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area - Desktop */}
          <div className="desktop-chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: chatBg, minWidth: 0 }}>
            {activeConversation ? (
              <>
                <div style={{ padding: '0.9rem 1.2rem', background: cardBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <button onClick={() => setShowProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', background: 'transparent', border: 'none', cursor: 'pointer', color: textColor, padding: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#000', overflow: 'hidden' }}>
                      {otherUser.picture ? <img src={otherUser.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (otherUser.name || "U")[0].toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{otherUser.name || "Unknown"}</div>
                      <div style={{ fontSize: '0.65rem', color: accent }}>Tap to view profile</div>
                    </div>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(activeConversation.id)}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: 20, border: `1px solid #ff4444`, background: 'transparent', color: '#ff4444', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <DeleteIcon /> Delete
                  </button>
                </div>

                <div ref={messagesContainerRef} onScroll={handleMessagesScroll}
                  style={{ flex: 1, overflowY: 'auto', padding: '1rem', position: 'relative' }}>
                  {showScrollDown && (
                    <button onClick={scrollToBottom}
                      style={{ position: 'sticky', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 36, height: 36, borderRadius: '50%', background: accent, color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,227,9,0.3)', zIndex: 5, margin: '0 auto' }}>
                      <ArrowDownIcon />
                    </button>
                  )}
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: textMuted }}>
                      <MessageIcon />
                      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Send a message to start</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {messages.map((msg) => (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '70%', padding: '0.6rem 0.9rem', borderRadius: 18,
                            background: msg.sender_id === user.id ? accent : receivedBg,
                            color: msg.sender_id === user.id ? '#000' : textColor,
                            border: msg.sender_id === user.id ? 'none' : `1px solid ${borderColor}`,
                            wordBreak: 'break-word'
                          }} className={msg.sender_id === user.id ? 'msg-sent' : 'msg-received'}>
                            <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>{msg.message}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem', fontSize: '0.6rem', opacity: 0.7, justifyContent: 'flex-end' }}>
                              <span>{formatTime(msg.created_at)}</span>
                              {msg.is_read && msg.sender_id === user.id && <DoubleCheckIcon />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} style={{ padding: '0.8rem 1rem', background: cardBg, backdropFilter: 'blur(16px)', borderTop: `1px solid ${borderColor}`, display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
                    style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: 25, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.82rem', outline: 'none', color: textColor }} />
                  <button type="submit" disabled={sending || !newMessage.trim()}
                    style={{ width: 42, height: 42, borderRadius: '50%', background: sending ? `${accent}60` : accent, color: '#000', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SendIcon />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                <div style={{ textAlign: 'center' }}>
                  <MessageIcon />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '0.8rem' }}>Select a conversation</h2>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>Or click "Chat with Seller" on a product</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============ MOBILE LAYOUT ============ */}
        <div className="mobile-conversations" style={{ flex: 1, display: 'none', flexDirection: 'column', overflow: 'hidden', minHeight: 400 }}>
          
          {/* Mobile Conversations List (shows when no active chat) */}
          {!activeConversation ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: sidebarBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: `1px solid ${borderColor}`, flexShrink: 0 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: textColor }}>
                  <MessageIcon /> Messages
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: inputBg, borderRadius: 16, border: `1px solid ${borderColor}`, padding: '0.4rem 0.7rem' }}>
                  <SearchIcon />
                  <input type="text" placeholder="Search..." value={convSearch} onChange={(e) => setConvSearch(e.target.value)}
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.75rem', outline: 'none', color: textColor }} />
                  {convSearch && <button onClick={() => setConvSearch("")} style={{ background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}><XIcon /></button>}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: 32, height: 32, border: `2px solid ${borderColor}`, borderTopColor: accent, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: textMuted, fontSize: '0.8rem' }}>
                    <MessageIcon />
                    <p style={{ marginTop: '0.5rem' }}>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const other = getOtherUser(conv);
                    return (
                      <button key={conv.id} onClick={() => { setActiveConversation(conv); fetchMessages(conv.id); }}
                        className="conv-item"
                        style={{
                          width: '100%', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.7rem',
                          border: 'none', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer', textAlign: 'left',
                          background: 'transparent', transition: 'all 0.15s ease', color: textColor
                        }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#000', flexShrink: 0, overflow: 'hidden' }}>
                          {other.picture ? <img src={other.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (other.name || "U")[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{other.name || "Unknown"}</span>
                            <span style={{ fontSize: '0.6rem', color: textMuted }}>{conv.last_message_time ? getTimeAgo(conv.last_message_time) : ""}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.15rem' }}>
                            <span style={{ fontSize: '0.7rem', color: textMuted }}>{conv.last_message || "No messages"}</span>
                            {conv.unread_count > 0 && (
                              <span style={{ background: accent, color: '#000', fontSize: '0.55rem', minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                {conv.unread_count > 99 ? "99+" : conv.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Mobile Chat View */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: chatBg, overflow: 'hidden' }}>
              {/* Mobile Chat Header */}
              <div style={{ padding: '0.7rem 1rem', background: cardBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                <button onClick={() => { setActiveConversation(null); setMessages([]); setShowSidebar(true); }}
                  style={{ background: 'transparent', border: 'none', color: textColor, cursor: 'pointer', padding: '0.3rem', fontSize: '1.2rem' }}>
                  ←
                </button>
                <button onClick={() => setShowProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: textColor, padding: 0, flex: 1 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #22c55e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#000', overflow: 'hidden' }}>
                    {otherUser.picture ? <img src={otherUser.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (otherUser.name || "U")[0].toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{otherUser.name || "Unknown"}</div>
                    <div style={{ fontSize: '0.6rem', color: accent }}>Tap for profile</div>
                  </div>
                </button>
                <button onClick={() => setShowDeleteConfirm(activeConversation.id)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: 15, border: `1px solid #ff4444`, background: 'transparent', color: '#ff4444', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <DeleteIcon /> Del
                </button>
              </div>

              {/* Mobile Messages */}
              <div ref={messagesContainerRef} onScroll={handleMessagesScroll}
                style={{ flex: 1, overflowY: 'auto', padding: '0.8rem' }}>
                {showScrollDown && (
                  <button onClick={scrollToBottom}
                    style={{ position: 'sticky', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 32, height: 32, borderRadius: '50%', background: accent, color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,227,9,0.3)', zIndex: 5, margin: '0 auto' }}>
                    <ArrowDownIcon />
                  </button>
                )}
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: textMuted }}>
                    <MessageIcon />
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Send a message to start</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '80%', padding: '0.5rem 0.7rem', borderRadius: 16,
                          background: msg.sender_id === user.id ? accent : receivedBg,
                          color: msg.sender_id === user.id ? '#000' : textColor,
                          border: msg.sender_id === user.id ? 'none' : `1px solid ${borderColor}`,
                          wordBreak: 'break-word'
                        }}>
                          <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{msg.message}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem', fontSize: '0.55rem', opacity: 0.7, justifyContent: 'flex-end' }}>
                            <span>{formatTime(msg.created_at)}</span>
                            {msg.is_read && msg.sender_id === user.id && <DoubleCheckIcon />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Mobile Input */}
              <form onSubmit={handleSendMessage} style={{ padding: '0.6rem 0.8rem', background: cardBg, backdropFilter: 'blur(16px)', borderTop: `1px solid ${borderColor}`, display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
                  style={{ flex: 1, padding: '0.55rem 0.8rem', borderRadius: 20, border: `1px solid ${borderColor}`, background: inputBg, fontSize: '0.78rem', outline: 'none', color: textColor }} />
                <button type="submit" disabled={sending || !newMessage.trim()}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: sending ? `${accent}60` : accent, color: '#000', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <SendIcon />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ position: 'relative', zIndex: 10, background: bgBlur, backdropFilter: 'blur(20px) saturate(200%)', padding: '1rem 1.5rem 0.8rem', borderTop: `1px solid ${borderColor}`, flexShrink: 0 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '0.8rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <img src={logo} alt="GuraNeza" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: textColor }}>GURANEZA</span>
                </div>
                <p style={{ fontSize: '0.6rem', color: textMuted, margin: 0 }}>Rwanda's trusted marketplace.</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.62rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', color: textColor }}>Quick Links</h4>
                <Link to="/home" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.2rem' }}>Home</Link>
                <Link to="/shops" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.2rem' }}>Shops</Link>
                <Link to="/sell" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Sell</Link>
              </div>
              <div>
                <h4 style={{ fontSize: '0.62rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', color: textColor }}>Categories</h4>
                <Link to="/home" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block', marginBottom: '0.2rem' }}>Electronics</Link>
                <Link to="/home" style={{ fontSize: '0.6rem', color: textMuted, textDecoration: 'none', display: 'block' }}>Fashion</Link>
              </div>
              <div>
                <h4 style={{ fontSize: '0.62rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', color: textColor }}>Connect</h4>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {["M23 3a10.9","M22.54 6.42","M16 4H8"].map((d, i) => (
                    <a key={i} href="#" style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '0.5rem', textAlign: 'center', fontSize: '0.55rem', color: textMuted }}>&copy; 2026 GuraNeza. Made in Rwanda</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Chats;