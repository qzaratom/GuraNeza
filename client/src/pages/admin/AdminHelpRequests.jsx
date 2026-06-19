import { useState, useEffect } from "react";

// SVG Icons
const HelpIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>);
const SendIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const MessageIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const SearchIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>);
const UserIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const ShieldIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const FilterIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>);

function AdminHelpRequests() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [responses, setResponses] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["General", "Account", "Selling", "Buying", "Shops", "Payments", "Safety", "Technical", "Other"];

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTicket) fetchResponses(activeTicket.id);
  }, [activeTicket]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/help/tickets/all", { credentials: "include" });
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (err) {} finally { setLoading(false); }
  };

  const fetchResponses = async (ticketId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/help/tickets/${ticketId}/responses`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setResponses(data.responses);
    } catch (err) {}
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !activeTicket) return;
    setSendingReply(true);
    try {
      const res = await fetch(`http://localhost:5000/api/help/tickets/${activeTicket.id}/responses`, {
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
    } catch (err) {} finally { setSendingReply(false); }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      await fetch(`http://localhost:5000/api/help/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      setMessage(`Ticket ${status === 'resolved' ? 'resolved' : 'closed'}!`);
      setTimeout(() => setMessage(""), 3000);
      fetchTickets();
      if (activeTicket?.id === ticketId) {
        setActiveTicket(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {}
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'in_progress': return 'bg-blue-900/50 text-blue-300 border-blue-700';
      case 'resolved': return 'bg-green-900/50 text-green-300 border-green-700';
      case 'closed': return 'bg-gray-700 text-gray-400 border-gray-600';
      default: return 'bg-gray-700 text-gray-400 border-gray-600';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'open': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-black px-6 py-3 rounded-lg shadow-lg font-bold">
          {message}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total Tickets</p>
          <p className="text-2xl font-bold text-white">{tickets.length}</p>
        </div>
        <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-800">
          <p className="text-sm text-yellow-400">Open</p>
          <p className="text-2xl font-bold text-yellow-300">{openCount}</p>
        </div>
        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800">
          <p className="text-sm text-blue-400">In Progress</p>
          <p className="text-2xl font-bold text-blue-300">{inProgressCount}</p>
        </div>
        <div className="bg-green-900/30 rounded-xl p-4 border border-green-800">
          <p className="text-sm text-green-400">Resolved</p>
          <p className="text-2xl font-bold text-green-300">{tickets.filter(t => t.status === 'resolved').length}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Tickets List Panel */}
        <div className="w-96 flex-shrink-0">
          {/* Filters */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <HelpIcon /> Support Tickets
              </h3>
              <span className="text-xs text-gray-400">{filteredTickets.length} tickets</span>
            </div>
            <div className="max-h-[65vh] overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageIcon />
                  <p className="mt-2 text-sm">No tickets found</p>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => { setActiveTicket(ticket); fetchResponses(ticket.id); }}
                    className={`w-full p-4 text-left border-b border-gray-700/50 hover:bg-gray-750 transition-all flex items-start gap-3 ${
                      activeTicket?.id === ticket.id ? 'bg-green-900/20 border-l-[3px] border-l-green-500' : 'border-l-[3px] border-l-transparent'
                    }`}
                  >
                    {/* Status Dot */}
                    <div className="mt-1.5 flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStatusDot(ticket.status) }}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white truncate">{ticket.subject}</span>
                        {parseInt(ticket.total_responses) > 0 && (
                          <span className="bg-green-600 text-black text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0 px-1">
                            {ticket.total_responses}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <UserIcon /> {ticket.user_name || ticket.user_email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">{ticket.category}</span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <ClockIcon /> {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ticket Detail / Chat Panel */}
        <div className="flex-1">
          {!activeTicket ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <HelpIcon />
              </div>
              <h3 className="text-lg font-bold text-white">Select a Ticket</h3>
              <p className="text-gray-400 text-sm mt-1">
                Choose a support ticket from the list to view details and respond
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              {/* Ticket Header */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-white text-lg">{activeTicket.subject}</h3>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <UserIcon /> {activeTicket.user_name || activeTicket.user_email}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-400">{activeTicket.user_email}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusColor(activeTicket.status)}`}>
                      {activeTicket.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">{activeTicket.category}</span>
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <ClockIcon /> {new Date(activeTicket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(activeTicket.id, 'resolved')}
                        className="px-3 py-1.5 bg-green-600 text-black rounded-lg text-xs font-bold hover:bg-green-500 transition flex items-center gap-1"
                      >
                        <CheckIcon /> Resolve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(activeTicket.id, 'closed')}
                        className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-500 transition"
                      >
                        Close
                      </button>
                    </>
                  )}
                  {activeTicket.status === 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(activeTicket.id, 'closed')}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-500 transition"
                    >
                      Close Permanently
                    </button>
                  )}
                  {activeTicket.status === 'closed' && (
                    <button
                      onClick={() => handleUpdateStatus(activeTicket.id, 'open')}
                      className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-bold hover:bg-yellow-500 transition"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Original Message */}
                <div className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="bg-green-600 text-black rounded-2xl rounded-br-md px-4 py-3">
                      <p className="text-sm font-medium mb-1">User's Message</p>
                      <p className="text-sm whitespace-pre-wrap">{activeTicket.message}</p>
                      <p className="text-xs opacity-60 mt-2 text-right">
                        {new Date(activeTicket.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Responses */}
                {responses.map(resp => (
                  <div key={resp.id} className={`flex ${resp.is_admin ? 'justify-start' : 'justify-end'}`}>
                    <div className="max-w-[75%]">
                      <div className={`rounded-2xl px-4 py-3 ${
                        resp.is_admin
                          ? 'bg-blue-900/40 text-blue-100 border border-blue-800 rounded-bl-md'
                          : 'bg-green-600 text-black rounded-br-md'
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          {resp.is_admin ? (
                            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                              <ShieldIcon /> Admin Response
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-black/70 flex items-center gap-1">
                              <UserIcon /> {resp.username || "User"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{resp.message}</p>
                        <p className="text-xs opacity-60 mt-2 text-right">
                          {new Date(resp.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {responses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageIcon />
                    <p className="mt-2 text-sm">No responses yet. Send a reply to the user.</p>
                  </div>
                )}
              </div>

              {/* Reply Input */}
              {activeTicket.status !== 'closed' && (
                <div className="p-4 border-t border-gray-700 bg-gray-850 flex gap-3">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the user..."
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                    className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 text-sm outline-none focus:border-green-500 transition"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="w-11 h-11 rounded-full bg-green-600 text-black flex items-center justify-center disabled:opacity-40 hover:bg-green-500 transition flex-shrink-0"
                  >
                    <SendIcon />
                  </button>
                </div>
              )}

              {activeTicket.status === 'closed' && (
                <div className="p-4 border-t border-gray-700 bg-gray-850 text-center">
                  <p className="text-gray-500 text-sm">This ticket is closed. Reopen it to send messages.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHelpRequests;