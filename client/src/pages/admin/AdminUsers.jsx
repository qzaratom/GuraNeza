import { useState, useEffect } from "react";

// SVG Icons
const SearchIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const ExportIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>);
const StarIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const EmailIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const PhoneIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const ShieldIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const UserIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, subsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/users", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/subscriptions", { credentials: "include" }),
      ]);
      const usersData = await usersRes.json(); 
      if (usersData.success) setUsers(usersData.users);
      const subsData = await subsRes.json(); 
      if (subsData.success) setSubscriptions(subsData.subscriptions);
    } catch (err) {} finally { setLoading(false); }
  };

  const updateSubscription = async (userId, subscriptionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/subscription`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ subscription_id: subscriptionId }),
      });
      const data = await res.json();
      if (data.success) { 
        setMessage("Subscription updated!"); 
        setTimeout(() => setMessage(""), 3000); 
        fetchData(); 
      }
    } catch (err) {}
  };

  const handleExport = () => { window.open("http://localhost:5000/api/admin/export/users", "_blank"); };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role !== 'admin').length;

  return (
    <div>
      <style>{`
        .table-row:hover { background: rgba(255,255,255,0.02) !important; }
        select:focus { outline: none; border-color: #00E309 !important; }
      `}</style>

      {/* Toast */}
      {message && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: 'rgba(0,227,9,0.15)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '12px 20px', border: '1px solid rgba(0,227,9,0.3)', color: '#00E309', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <CheckIcon /> {message}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(0,227,9,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(0,227,9,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#00E309', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Total Users</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#00E309', margin: '0.3rem 0 0' }}>{users.length}</p>
        </div>
        <div style={{ background: 'rgba(59,130,246,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#3b82f6', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Regular Users</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', margin: '0.3rem 0 0' }}>{userCount}</p>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.08)', backdropFilter: 'blur(16px)', borderRadius: 16, padding: '1.2rem', border: '1px solid rgba(168,85,247,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#a855f7', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>Admins</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#a855f7', margin: '0.3rem 0 0' }}>{adminCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'rgba(255,255,255,0.03)', borderRadius: 14, 
          border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem 1rem',
          flex: 1, minWidth: 220, maxWidth: 400
        }}>
          <SearchIcon />
          <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'white', outline: 'none' }} />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <XIcon />
            </button>
          )}
        </div>

        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          style={{ padding: '0.55rem 1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleExport}
          style={{ padding: '0.55rem 1.2rem', borderRadius: 14, border: '1px solid rgba(0,227,9,0.3)', background: 'rgba(0,227,9,0.08)', color: '#00E309', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
          <ExportIcon /> Export
        </button>
      </div>

      {/* Users Table */}
      <div style={{ 
        background: 'rgba(26,26,46,0.5)', backdropFilter: 'blur(16px)',
        borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>User</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Contact</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Role</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Plan</th>
                <th style={{ padding: '0.9rem 1.5rem', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.5)' }}>Assign Plan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#00E309', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.8rem', fontSize: '0.8rem' }}>Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
                    <UsersIcon />
                    <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', fontWeight: 500 }}>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {/* User */}
                    <td style={{ padding: '0.8rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{ 
                          width: 38, height: 38, borderRadius: 10, 
                          background: u.role === 'admin' ? 'rgba(168,85,247,0.15)' : 'rgba(0,227,9,0.12)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: u.role === 'admin' ? '#a855f7' : '#00E309', 
                          fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          {u.profile_picture ? <img src={u.profile_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (u.username || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'white', fontSize: '0.82rem', margin: 0 }}>{u.username}</p>
                          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', margin: '0.1rem 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <UserIcon /> Joined {new Date(u.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <EmailIcon /> {u.email}
                        </span>
                        {u.phone_number && (
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <PhoneIcon /> {u.phone_number}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize',
                        background: u.role === 'admin' ? 'rgba(168,85,247,0.12)' : 'rgba(0,227,9,0.08)',
                        color: u.role === 'admin' ? '#a855f7' : '#00E309',
                        border: `1px solid ${u.role === 'admin' ? 'rgba(168,85,247,0.25)' : 'rgba(0,227,9,0.15)'}`,
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        {u.role === 'admin' ? <ShieldIcon /> : <UserIcon />}
                        {u.role || "user"}
                      </span>
                    </td>

                    {/* Plan */}
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.75rem', color: u.plan_name && u.plan_name !== 'Free' ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                        fontWeight: 500
                      }}>
                        <StarIcon /> {u.plan_name || "Free"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.8rem 1.5rem' }}>
                      <select 
                        value={u.subscription_id || ""} 
                        onChange={e => updateSubscription(u.id, e.target.value)}
                        style={{ 
                          padding: '0.5rem 1rem', borderRadius: 12, 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          background: 'rgba(255,255,255,0.03)', 
                          color: 'white', fontSize: '0.72rem', 
                          outline: 'none', cursor: 'pointer',
                          minWidth: 180
                        }}>
                        <option value="">Assign Plan</option>
                        {subscriptions.map(s => (
                          <option key={s.id} value={s.id} style={{ background: '#1a1a2e', color: 'white' }}>
                            {s.plan_name} ({s.price.toLocaleString()} RWF)
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div style={{ padding: '0.7rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>
          <span>Showing {filteredUsers.length} of {users.length} users</span>
          <span>{userCount} users • {adminCount} admins</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminUsers;