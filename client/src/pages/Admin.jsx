import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

// SVG Icons
const DashboardIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>);
const UsersIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>);
const ProductsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ShopsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>);
const StarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const RequestsIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
const HelpIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>);
const ExportIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>);
const PlusIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>);
const SendIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const ClockIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const MessageIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>);
const ArrowLeftIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterShopVerified, setFilterShopVerified] = useState("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddShop, setShowAddShop] = useState(false);
  const [showEditShop, setShowEditShop] = useState(null);
  const [showEditPlan, setShowEditPlan] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");

  // Help/Support state
  const [helpTickets, setHelpTickets] = useState([]);
  const [activeHelpTicket, setActiveHelpTicket] = useState(null);
  const [ticketResponses, setTicketResponses] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [helpSearchTerm, setHelpSearchTerm] = useState("");
  const [helpFilterStatus, setHelpFilterStatus] = useState("all");
  const [helpFilterCategory, setHelpFilterCategory] = useState("all");

  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", stock_quantity: "1", category: "", negotiable: false });
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productFormSuccess, setProductFormSuccess] = useState("");

  const [shopForm, setShopForm] = useState({ shop_name: "", description: "", category: "", location: "", phone: "", email: "", poster_image: "" });
  const [shopPosterFile, setShopPosterFile] = useState(null);
  const [shopPosterPreview, setShopPosterPreview] = useState("");
  const [shopFormLoading, setShopFormLoading] = useState(false);
  const [shopFormError, setShopFormError] = useState("");
  const [shopFormSuccess, setShopFormSuccess] = useState("");

  const [planForm, setPlanForm] = useState({ plan_name: "", price: "", product_limit: "", verified_seller_badge: false, verified_product_badge: false, premium_badge: false, shop_badge: false, shop_enabled: false, vip_badge: false });
  const [planFormLoading, setPlanFormLoading] = useState(false);
  const [planFormError, setPlanFormError] = useState("");
  const [planFormSuccess, setPlanFormSuccess] = useState("");

  const categories = ["Electronics", "Fashion", "Groceries", "Home & Living", "Beauty & Personal Care", "Agriculture", "Motorcycle Parts", "Construction Materials", "Office & School Supplies", "Baby & Kids", "Gaming", "Sports & Fitness", "Automotive", "Pet Supplies", "Kitchen & Dining", "Books & Educational", "Gifts & Crafts", "Music & Audio Equipment", "Electrical & Solar", "Health & Wellness", "Other"];

  const helpCategories = ["General", "Account", "Selling", "Buying", "Shops", "Payments", "Safety", "Technical", "Other"];

  useEffect(() => { if (!user || user.role !== "admin") return; fetchAllData(); if (activePage === "help") fetchHelpTickets(); }, [user, activePage]);

  useEffect(() => { if (activeHelpTicket) fetchTicketResponses(activeHelpTicket.id); }, [activeHelpTicket]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, subsRes, shopsRes, reqRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/users", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/products", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/subscriptions", { credentials: "include" }),
        fetch("http://localhost:5000/api/shops", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/feedback/subscription-requests", { credentials: "include" }),
      ]);
      const statsData = await statsRes.json(); if (statsData.success) setStats(statsData.stats);
      const usersData = await usersRes.json(); if (usersData.success) setUsers(usersData.users);
      const productsData = await productsRes.json(); if (productsData.success) setProducts(productsData.products);
      const subsData = await subsRes.json(); if (subsData.success) setSubscriptions(subsData.subscriptions);
      const shopsData = await shopsRes.json(); if (shopsData.success) setShops(shopsData.shops);
      const reqData = await reqRes.json(); if (reqData.success) setRequests(reqData.requests);
    } catch (err) { console.error("Error:", err); } finally { setLoading(false); }
  };

  const fetchHelpTickets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/help/tickets/all", { credentials: "include" });
      const data = await res.json();
      if (data.success) setHelpTickets(data.tickets);
    } catch (err) {}
  };

  const fetchTicketResponses = async (ticketId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/help/tickets/${ticketId}/responses`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setTicketResponses(data.responses);
    } catch (err) {}
  };

  const handleSendHelpReply = async () => {
    if (!replyMessage.trim() || !activeHelpTicket) return;
    setSendingReply(true);
    try {
      const res = await fetch(`http://localhost:5000/api/help/tickets/${activeHelpTicket.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketResponses(prev => [...prev, data.response]);
        setReplyMessage("");
        fetchHelpTickets();
      }
    } catch (err) {} finally { setSendingReply(false); }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      await fetch(`http://localhost:5000/api/help/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      setMessage(`Ticket ${status === 'resolved' ? 'resolved' : 'closed'}!`);
      setTimeout(() => setMessage(""), 3000);
      fetchHelpTickets();
      if (activeHelpTicket?.id === ticketId) setActiveHelpTicket(null);
    } catch (err) {}
  };

  const updateSubscription = async (userId, subscriptionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/subscription`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ subscription_id: subscriptionId }) });
      const data = await res.json();
      if (data.success) { setMessage("Subscription updated!"); setTimeout(() => setMessage(""), 3000); fetchAllData(); }
    } catch (err) {}
  };

  const verifyProduct = async (productId) => {
    try { const res = await fetch(`http://localhost:5000/api/admin/products/${productId}/verify`, { method: "PUT", credentials: "include" }); if ((await res.json()).success) { setMessage("Product verified!"); setTimeout(() => setMessage(""), 3000); fetchAllData(); } } catch (err) {}
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Delete this product?")) return;
    try { await fetch(`http://localhost:5000/api/products/${productId}`, { method: "DELETE", credentials: "include" }); setMessage("Product deleted!"); setTimeout(() => setMessage(""), 3000); fetchAllData(); } catch (err) {}
  };

  const verifyShop = async (shopId) => {
    try { await fetch(`http://localhost:5000/api/shops/${shopId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ is_verified: true }) }); setMessage("Shop verified!"); setTimeout(() => setMessage(""), 3000); fetchAllData(); } catch (err) {}
  };

  const deleteShop = async (shopId) => {
    if (!confirm("Delete this shop?")) return;
    try { await fetch(`http://localhost:5000/api/shops/${shopId}`, { method: "DELETE", credentials: "include" }); setMessage("Shop deleted!"); setTimeout(() => setMessage(""), 3000); fetchAllData(); } catch (err) {}
  };

  const handleExport = (type) => { window.open(`http://localhost:5000/api/admin/export/${type}`, "_blank"); };

  const handleApprove = (req) => { setShowApproveModal(req); setAdminMessage("Your subscription upgrade has been approved! Welcome to " + req.plan_name + " plan."); };
  const handleReject = (req) => { setShowRejectModal(req); setAdminMessage(""); };

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
      fetchAllData();
    } catch (err) {}
  };

  const handleProductImageChange = (e) => { const files = Array.from(e.target.files); if (files.length + productImages.length > 5) { setProductFormError("Max 5 images"); return; } setProductImages(prev => [...prev, ...files]); setProductImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]); };
  const removeProductImage = (i) => { setProductImages(prev => prev.filter((_, idx) => idx !== i)); setProductImagePreviews(prev => prev.filter((_, idx) => idx !== i)); };
  const uploadImagesToCloudinary = async (imgs) => { if (!imgs.length) return []; const fd = new FormData(); imgs.forEach(i => fd.append("images", i)); const r = await fetch("http://localhost:5000/api/upload/multiple", { method: "POST", credentials: "include", body: fd }); const d = await r.json(); if (d.success) return d.images.map(i => i.url); throw new Error("Upload failed"); };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price || !productForm.category) { setProductFormError("Fill required fields"); return; }
    setProductFormLoading(true);
    try {
      let urls = []; if (productImages.length) urls = await uploadImagesToCloudinary(productImages);
      const r = await fetch("http://localhost:5000/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name: productForm.name.trim(), description: productForm.description.trim(), price: Number(productForm.price), stock_quantity: Number(productForm.stock_quantity)||1, category: productForm.category, negotiable: productForm.negotiable, owner_id: user.id, image_urls: urls }) });
      if ((await r.json()).success) { setProductFormSuccess("Added!"); setProductForm({ name: "", description: "", price: "", stock_quantity: "1", category: "", negotiable: false }); setProductImages([]); setProductImagePreviews([]); setTimeout(() => { setShowAddProduct(false); setProductFormSuccess(""); fetchAllData(); }, 1500); }
    } catch (err) { setProductFormError("Failed"); } finally { setProductFormLoading(false); }
  };

  const handleShopPosterChange = (e) => { const f = e.target.files[0]; if (f) { setShopPosterFile(f); setShopPosterPreview(URL.createObjectURL(f)); } };
  const uploadPoster = async () => { if (!shopPosterFile) return shopForm.poster_image || ""; const fd = new FormData(); fd.append("image", shopPosterFile); const r = await fetch("http://localhost:5000/api/upload/single", { method: "POST", credentials: "include", body: fd }); const d = await r.json(); if (d.success) return d.imageUrl; throw new Error("Failed"); };

  const handleCreateShop = async (e) => {
    e.preventDefault(); if (!shopForm.shop_name.trim()) { setShopFormError("Name required"); return; }
    setShopFormLoading(true);
    try { let poster = shopForm.poster_image; if (shopPosterFile) poster = await uploadPoster(); const r = await fetch("http://localhost:5000/api/shops", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({...shopForm, poster_image: poster}) }); if ((await r.json()).success) { setShopFormSuccess("Created!"); setShopForm({ shop_name: "", description: "", category: "", location: "", phone: "", email: "", poster_image: "" }); setShopPosterFile(null); setShopPosterPreview(""); setTimeout(() => { setShowAddShop(false); setShopFormSuccess(""); fetchAllData(); }, 1500); } } catch (err) { setShopFormError("Failed"); } finally { setShopFormLoading(false); }
  };

  const handleEditShop = (shop) => { setShopForm({ shop_name: shop.shop_name||"", description: shop.description||"", category: shop.category||"", location: shop.location||"", phone: shop.phone||"", email: shop.email||"", poster_image: shop.poster_image||"" }); setShopPosterPreview(shop.poster_image||""); setShopPosterFile(null); setShowEditShop(shop); };

  const handleUpdateShop = async (e) => {
    e.preventDefault(); if (!shopForm.shop_name.trim()) { setShopFormError("Name required"); return; }
    setShopFormLoading(true);
    try { let poster = shopForm.poster_image; if (shopPosterFile) poster = await uploadPoster(); const r = await fetch(`http://localhost:5000/api/shops/${showEditShop.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({...shopForm, poster_image: poster}) }); if ((await r.json()).success) { setShopFormSuccess("Updated!"); setShowEditShop(null); setTimeout(() => { setShopFormSuccess(""); fetchAllData(); }, 1500); } } catch (err) { setShopFormError("Failed"); } finally { setShopFormLoading(false); }
  };

  const handleEditPlan = (plan) => { setPlanForm({ plan_name: plan.plan_name, price: plan.price, product_limit: plan.product_limit, verified_seller_badge: plan.verified_seller_badge, verified_product_badge: plan.verified_product_badge, premium_badge: plan.premium_badge, shop_badge: plan.shop_badge, shop_enabled: plan.shop_enabled, vip_badge: plan.vip_badge }); setShowEditPlan(plan); };

  const handleUpdatePlan = async (e) => {
    e.preventDefault(); setPlanFormLoading(true);
    try { await fetch(`http://localhost:5000/api/admin/subscriptions/${showEditPlan.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(planForm) }); setPlanFormSuccess("Updated!"); setShowEditPlan(null); setTimeout(() => { setPlanFormSuccess(""); fetchAllData(); }, 1500); } catch (err) { setPlanFormError("Failed"); } finally { setPlanFormLoading(false); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-600';
      case 'in_progress': return 'bg-blue-100 text-blue-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      case 'closed': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const filteredUsers = users.filter(u => (u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())) && (filterRole === "all" || u.role === filterRole));
  const filteredProducts = products.filter(p => (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.username?.toLowerCase().includes(searchTerm.toLowerCase())) && (filterVerified === "all" || (filterVerified === "yes" ? p.verified : !p.verified)) && (filterCategory === "all" || p.category === filterCategory));
  const filteredShops = shops.filter(s => (s.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())) && (filterShopVerified === "all" || (filterShopVerified === "yes" ? s.is_verified : !s.is_verified)));
  
  const filteredHelpTickets = helpTickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(helpSearchTerm.toLowerCase()) || t.user_name?.toLowerCase().includes(helpSearchTerm.toLowerCase()) || t.user_email?.toLowerCase().includes(helpSearchTerm.toLowerCase());
    const matchesStatus = helpFilterStatus === "all" || t.status === helpFilterStatus;
    const matchesCategory = helpFilterCategory === "all" || t.category === helpFilterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const helpPendingCount = helpTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  if (!user || user.role !== "admin") return (<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-center"><span className="text-6xl">🚫</span><h2 className="text-2xl font-bold text-white mt-4">Access Denied</h2><button onClick={() => navigate("/")} className="mt-6 px-6 py-3 bg-green-500 text-black rounded-full font-bold">Go Home</button></div></div>);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "users", label: "User Management", icon: <UsersIcon /> },
    { id: "products", label: "Product Management", icon: <ProductsIcon /> },
    { id: "shops", label: "Shop Management", icon: <ShopsIcon /> },
    { id: "subscriptions", label: "Subscription Plans", icon: <StarIcon /> },
    { id: "feedback", label: "Subscription Requests", icon: <RequestsIcon /> },
    { id: "help", label: "Help & Support", icon: <HelpIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gray-950 text-white flex flex-col fixed inset-y-0 left-0 z-50 border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="GuraNeza" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold">GURANEZA</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-lg">
              {user.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-green-400">Administrator</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => { setActivePage(item.id); setSearchTerm(""); setFilterVerified("all"); setFilterCategory("all"); setFilterRole("all"); setFilterShopVerified("all"); setActiveHelpTicket(null); if (item.id === "help") fetchHelpTickets(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activePage === item.id ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              {item.icon}
              {item.label}
              {item.id === "feedback" && requests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{requests.filter(r => r.status === 'pending').length}</span>
              )}
              {item.id === "help" && helpPendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{helpPendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link to="/home" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition w-full">🏠 Back to Site</Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition w-full">👤 My Profile</Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 ml-72">
        <div className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{sidebarItems.find(i => i.id === activePage)?.label}</h2>
            <Link to="/home" className="text-sm text-gray-400 hover:text-green-400">View Site</Link>
          </div>
        </div>
        {message && (<div className="fixed top-4 right-4 z-50 bg-green-500 text-black px-6 py-3 rounded-lg shadow-lg font-bold">{message}</div>)}

        <div className="p-8">
          {/* Dashboard */}
          {activePage === "dashboard" && (<div>{stats && (<div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">{[{l:"Users",v:stats.users,c:"blue",i:<UsersIcon/>},{l:"Products",v:stats.products,c:"green",i:<ProductsIcon/>},{l:"Shops",v:stats.shops,c:"purple",i:<ShopsIcon/>},{l:"Requests",v:requests.filter(r=>r.status==='pending').length,c:"red",i:<RequestsIcon/>},{l:"Help Tickets",v:helpPendingCount,c:"yellow",i:<HelpIcon/>}].map((s,i)=>(<div key={i} className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700"><div className="flex justify-between"><div><p className="text-sm text-gray-400">{s.l}</p><p className="text-3xl font-bold text-white">{s.v}</p></div><span className="text-3xl text-gray-500">{s.i}</span></div></div>))}</div>)}</div>)}

          {/* Users */}
          {activePage === "users" && (<div><div className="flex flex-wrap items-center gap-4 mb-6"><input type="text" placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400" /><select value={filterRole} onChange={e=>setFilterRole(e.target.value)} className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"><option value="all">All Roles</option><option value="user">User</option><option value="admin">Admin</option></select><button onClick={()=>handleExport("users")} className="px-4 py-3 bg-green-600 text-black rounded-lg flex items-center gap-2 font-bold"><ExportIcon/> Export</button></div><div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden"><table className="w-full"><thead className="bg-gray-700 border-b border-gray-600"><tr><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">User</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Email</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Role</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Plan</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-700">{filteredUsers.map(u=>(<tr key={u.id} className="hover:bg-gray-750"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="text-sm font-medium text-white">{u.username}</span></div></td><td className="px-6 py-4 text-sm text-gray-400">{u.email}</td><td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${u.role==='admin'?'bg-red-900 text-red-300':'bg-gray-700 text-gray-300'}`}>{u.role||"user"}</span></td><td className="px-6 py-4 text-sm text-gray-300">{u.plan_name||"Free"}</td><td className="px-6 py-4"><select value={u.subscription_id||""} onChange={e=>updateSubscription(u.id,e.target.value)} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white"><option value="">Assign</option>{subscriptions.map(s=><option key={s.id} value={s.id}>{s.plan_name} ({s.price.toLocaleString()} RWF)</option>)}</select></td></tr>))}</tbody></table></div></div>)}

          {/* Products */}
          {activePage === "products" && (<div><div className="flex flex-wrap items-center gap-4 mb-6"><input type="text" placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400" /><select value={filterVerified} onChange={e=>setFilterVerified(e.target.value)} className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"><option value="all">All</option><option value="yes">Verified</option><option value="no">Pending</option></select><select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"><option value="all">All Categories</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select><button onClick={()=>handleExport("products")} className="px-4 py-3 bg-green-600 text-black rounded-lg flex items-center gap-2 font-bold"><ExportIcon/> Export</button><button onClick={()=>setShowAddProduct(true)} className="px-4 py-3 bg-green-500 text-black rounded-lg flex items-center gap-2 font-bold"><PlusIcon/> Add</button></div>
            {showAddProduct && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700"><h2 className="text-2xl font-bold mb-6 text-white">Add Product</h2><form onSubmit={handleAddProduct} className="space-y-4"><div><label className="block text-sm font-medium mb-1 text-gray-300">Name *</label><input type="text" value={productForm.name} onChange={e=>setProductForm(p=>({...p,name:e.target.value}))} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div><div><label className="block text-sm font-medium mb-1 text-gray-300">Description</label><textarea value={productForm.description} onChange={e=>setProductForm(p=>({...p,description:e.target.value}))} rows={3} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1 text-gray-300">Price *</label><input type="number" value={productForm.price} onChange={e=>setProductForm(p=>({...p,price:e.target.value}))} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div><div><label className="block text-sm font-medium mb-1 text-gray-300">Stock</label><input type="number" value={productForm.stock_quantity} onChange={e=>setProductForm(p=>({...p,stock_quantity:e.target.value}))} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div></div><div><label className="block text-sm font-medium mb-1 text-gray-300">Category *</label><select value={productForm.category} onChange={e=>setProductForm(p=>({...p,category:e.target.value}))} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"><option value="">Select...</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></div><div className="flex items-center gap-2"><input type="checkbox" checked={productForm.negotiable} onChange={e=>setProductForm(p=>({...p,negotiable:e.target.checked}))} className="w-5 h-5" /><label className="text-sm text-gray-300">Negotiable</label></div><div className="flex gap-3"><button type="submit" disabled={productFormLoading} className="flex-1 py-3 bg-green-600 text-black rounded-lg font-bold disabled:opacity-50">{productFormLoading?"Adding...":"Add Product"}</button><button type="button" onClick={()=>{setShowAddProduct(false);setProductFormError("");}} className="px-6 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">Cancel</button></div></form></div></div>)}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden"><table className="w-full"><thead className="bg-gray-700 border-b border-gray-600"><tr><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Product</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Price</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Seller</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Status</th><th className="text-left px-6 py-3 text-xs font-medium text-gray-300 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-700">{filteredProducts.map(p=>(<tr key={p.id} className="hover:bg-gray-750"><td className="px-6 py-4"><span className="text-sm font-medium text-white">{p.name}</span></td><td className="px-6 py-4 text-sm text-gray-300">{Number(p.price).toLocaleString()} RWF</td><td className="px-6 py-4 text-sm text-gray-300">{p.username}</td><td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${p.verified?'bg-green-900 text-green-300':'bg-yellow-900 text-yellow-300'}`}>{p.verified?"Verified":"Pending"}</span></td><td className="px-6 py-4"><div className="flex gap-2">{!p.verified&&<button onClick={()=>verifyProduct(p.id)} className="text-xs px-3 py-1.5 bg-green-600 text-black rounded-lg font-bold">Verify</button>}<button onClick={()=>deleteProduct(p.id)} className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold">Delete</button></div></td></tr>))}</tbody></table></div></div>)}

          {/* Shops, Subscriptions, Feedback tabs remain the same but with dark theme classes */}
          {/* ... (keep existing code for these sections, just update className to dark theme) ... */}

          {/* ============ HELP & SUPPORT SECTION ============ */}
          {activePage === "help" && (
            <div className="flex gap-6">
              {/* Tickets List */}
              <div className="w-96 flex-shrink-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <input type="text" placeholder="Search tickets..." value={helpSearchTerm} onChange={e => setHelpSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm" />
                  <select value={helpFilterStatus} onChange={e => setHelpFilterStatus(e.target.value)}
                    className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select value={helpFilterCategory} onChange={e => setHelpFilterCategory(e.target.value)}
                    className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                    <option value="all">All Categories</option>
                    {helpCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-bold text-white">Support Tickets ({filteredHelpTickets.length})</h3>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {filteredHelpTickets.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        <MessageIcon />
                        <p className="mt-2">No tickets found</p>
                      </div>
                    ) : (
                      filteredHelpTickets.map(ticket => (
                        <button key={ticket.id} onClick={() => { setActiveHelpTicket(ticket); fetchTicketResponses(ticket.id); }}
                          className={`w-full p-4 text-left border-b border-gray-700 hover:bg-gray-750 transition flex items-start gap-3 ${
                            activeHelpTicket?.id === ticket.id ? 'bg-green-900/30 border-l-4 border-l-green-500' : ''
                          }`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-white truncate">{ticket.subject}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{ticket.user_name || ticket.user_email}</p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <ClockIcon /> {new Date(ticket.created_at).toLocaleDateString()} • {ticket.category}
                            </p>
                          </div>
                          {parseInt(ticket.total_responses) > 0 && (
                            <span className="bg-green-600 text-black text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                              {ticket.total_responses}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Detail / Chat */}
              <div className="flex-1">
                {!activeHelpTicket ? (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <HelpIcon />
                    <h3 className="text-lg font-bold text-white mt-4">Select a Ticket</h3>
                    <p className="text-gray-400 text-sm mt-1">Choose a support ticket from the list to view and respond</p>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {/* Ticket Header */}
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white">{activeHelpTicket.subject}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">{activeHelpTicket.user_name || activeHelpTicket.user_email}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{activeHelpTicket.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(activeHelpTicket.status)}`}>
                            {activeHelpTicket.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {activeHelpTicket.status !== 'resolved' && activeHelpTicket.status !== 'closed' && (
                          <>
                            <button onClick={() => handleUpdateTicketStatus(activeHelpTicket.id, 'resolved')}
                              className="px-3 py-1.5 bg-green-600 text-black rounded-lg text-xs font-bold hover:bg-green-500">
                              <CheckIcon /> Resolve
                            </button>
                            <button onClick={() => handleUpdateTicketStatus(activeHelpTicket.id, 'closed')}
                              className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-500">
                              Close
                            </button>
                          </>
                        )}
                        {activeHelpTicket.status === 'resolved' && (
                          <button onClick={() => handleUpdateTicketStatus(activeHelpTicket.id, 'closed')}
                            className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-bold">
                              Close
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Original Message */}
                      <div className="flex justify-end">
                        <div className="max-w-[70%] bg-green-600 text-black rounded-2xl rounded-br-md px-4 py-2.5">
                          <p className="text-sm">{activeHelpTicket.message}</p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {new Date(activeHelpTicket.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Responses */}
                      {ticketResponses.map(resp => (
                        <div key={resp.id} className={`flex ${resp.is_admin ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            resp.is_admin 
                              ? 'bg-blue-900/40 text-blue-200 border border-blue-800 rounded-bl-md' 
                              : 'bg-green-600 text-black rounded-br-md'
                          }`}>
                            {resp.is_admin && (
                              <p className="text-xs font-bold text-blue-400 mb-1">Admin Response</p>
                            )}
                            {!resp.is_admin && (
                              <p className="text-xs font-bold text-black/70 mb-1">{resp.username || "User"}</p>
                            )}
                            <p className="text-sm">{resp.message}</p>
                            <p className="text-xs opacity-70 mt-1 text-right">
                              {new Date(resp.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    {activeHelpTicket.status !== 'closed' && (
                      <div className="p-4 border-t border-gray-700 flex gap-3">
                        <input type="text" value={replyMessage} onChange={e => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..." onKeyDown={e => e.key === 'Enter' && handleSendHelpReply()}
                          className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 text-sm outline-none focus:border-green-500" />
                        <button onClick={handleSendHelpReply} disabled={sendingReply || !replyMessage.trim()}
                          className="w-10 h-10 rounded-full bg-green-600 text-black flex items-center justify-center disabled:opacity-50 hover:bg-green-500 transition flex-shrink-0">
                          <SendIcon />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;