import { useState, useEffect } from "react";

// SVG Icons
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const RequestsIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>);
const ShopIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const StarIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const UserIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const MessageIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/feedback/subscription-requests", { credentials: "include" });
      const data = await res.json(); 
      if (data.success) setRequests(data.requests);
    } catch (err) {} finally { setLoading(false); }
  };

  const handleApprove = (req) => { 
    setShowApproveModal(req); 
    setAdminMessage(`Your subscription upgrade to ${req.plan_name} has been approved! Welcome aboard.`); 
  };
  
  const handleReject = (req) => { 
    setShowRejectModal(req); 
    setAdminMessage(""); 
  };

  const submitApproval = async (status) => {
    const req = status === 'approved' ? showApproveModal : showRejectModal;
    try {
      await fetch(`http://localhost:5000/api/admin/feedback/subscription-requests/${req.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ status, admin_message: adminMessage }),
      });
      setMessage(status === 'approved' ? "Request approved!" : "Request rejected!");
      setTimeout(() => setMessage(""), 3000);
      setShowApproveModal(null); setShowRejectModal(null); setAdminMessage("");
      fetchRequests();
    } catch (err) {}
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div>
      <style>{`
        .table-row:hover { background: rgba(255,255,255,0.02) !important; }
        textarea:focus { border-color: #00E309 !important; outline: none; }
      `}</style>

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: 'rgba(0,227,9,0.15)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '12px 20px', border: '1px solid rgba(0,227,9,0.3)', color: '#00E309', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <CheckIcon /> {message}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(245,158,11,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#f59e0b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Pending</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', margin: '0.3rem 0 0' }}>{pendingCount}</p>
        </div>
        <div style={{ background: 'rgba(0,227,9,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(0,227,9,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#00E309', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Approved</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00E309', margin: '0.3rem 0 0' }}>{approvedCount}</p>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#ef4444', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Rejected</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', margin: '0.3rem 0 0' }}>{rejectedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        background: 'rgba(26,26,46,0.5)', backdropFilter: 'blur(16px)',
        borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>User</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Plan</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Shop</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Date</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Status</th>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#00E309', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.8rem', fontSize: '0.8rem' }}>Loading requests...</p>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
                    <RequestsIcon />
                    <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', fontWeight: 500 }}>No subscription requests yet</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Requests will appear here when users apply for plan upgrades</p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {/* User */}
                    <td style={{ padding: '0.8rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{ 
                          width: 36, height: 36, borderRadius: 10, 
                          background: 'rgba(0,227,9,0.12)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#00E309', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          {req.profile_picture ? <img src={req.profile_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (req.username || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'white', fontSize: '0.8rem', margin: 0 }}>{req.username}</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: '0.1rem 0 0', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <UserIcon /> {req.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <StarIcon />
                        <div>
                          <p style={{ fontWeight: 600, color: 'white', fontSize: '0.8rem', margin: 0 }}>{req.plan_name}</p>
                          <p style={{ color: '#00E309', fontSize: '0.65rem', margin: '0.1rem 0 0' }}>{req.price?.toLocaleString()} RWF/mo</p>
                        </div>
                      </div>
                    </td>

                    {/* Shop */}
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                      {req.shop_name ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <ShopIcon /> {req.shop_name}
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>N/A</span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ClockIcon /> {new Date(req.created_at).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize',
                        background: req.status === 'approved' ? 'rgba(0,227,9,0.1)' : req.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: req.status === 'approved' ? '#00E309' : req.status === 'rejected' ? '#ef4444' : '#f59e0b',
                        border: `1px solid ${req.status === 'approved' ? 'rgba(0,227,9,0.2)' : req.status === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        {req.status === 'approved' ? <CheckIcon /> : req.status === 'rejected' ? <XIcon /> : <ClockIcon />}
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.8rem 1.5rem', textAlign: 'right' }}>
                      {req.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleApprove(req)}
                            style={{ padding: '0.45rem 1rem', borderRadius: 20, border: '1px solid rgba(0,227,9,0.3)', background: 'rgba(0,227,9,0.08)', color: '#00E309', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}>
                            <CheckIcon /> Approve
                          </button>
                          <button onClick={() => handleReject(req)}
                            style={{ padding: '0.45rem 1rem', borderRadius: 20, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}>
                            <XIcon /> Reject
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                          <MessageIcon />
                          {req.admin_message ? req.admin_message.substring(0, 40) + '...' : 'No message'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div style={{ padding: '0.7rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>
          <span>Showing {requests.length} requests</span>
          <span>{pendingCount} pending • {approvedCount} approved • {rejectedCount} rejected</span>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: 'rgba(20,20,40,0.95)', backdropFilter: 'blur(24px)', 
            borderRadius: 24, padding: '2rem', maxWidth: 460, width: '90%', 
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,227,9,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckIcon />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Approve Request</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '0.1rem 0 0' }}>
                  {showApproveModal.username}'s request for <strong style={{ color: '#00E309' }}>{showApproveModal.plan_name}</strong>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.4rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Message to user</label>
              <textarea value={adminMessage} onChange={e => setAdminMessage(e.target.value)} rows={3}
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.82rem', color: 'white', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={() => submitApproval('approved')}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 14, border: 'none', background: '#00E309', color: '#000', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <CheckIcon /> Approve
              </button>
              <button onClick={() => setShowApproveModal(null)}
                style={{ padding: '0.75rem 1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            background: 'rgba(20,20,40,0.95)', backdropFilter: 'blur(24px)', 
            borderRadius: 24, padding: '2rem', maxWidth: 460, width: '90%', 
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XIcon />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Reject Request</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '0.1rem 0 0' }}>
                  {showRejectModal.username}'s request for <strong style={{ color: '#ef4444' }}>{showRejectModal.plan_name}</strong>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.4rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Reason (optional)</label>
              <textarea value={adminMessage} onChange={e => setAdminMessage(e.target.value)} rows={3} placeholder="Explain why the request was rejected..."
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontSize: '0.82rem', color: 'white', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={() => submitApproval('rejected')}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 14, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <XIcon /> Reject
              </button>
              <button onClick={() => setShowRejectModal(null)}
                style={{ padding: '0.75rem 1.5rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminRequests;