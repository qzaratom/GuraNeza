import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SellerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellerProfile();
    fetchSellerProducts();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchSellerProfile = async () => {
    try {
      const response = await fetch(`https://guraneza.onrender.com/api/auth/user/${id}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) { setSeller(data.user); document.title = `${data.user.username} - GuraNeza`; }
      else { setError("User not found"); }
    } catch (err) { setError("Failed to load profile"); }
    finally { setLoading(false); }
  };

  const fetchSellerProducts = async () => {
    try {
      const response = await fetch(`https://guraneza.onrender.com/api/auth/user/${id}/products`, { credentials: "include" });
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (err) {}
  };

  const handleChatWithSeller = () => {
    if (!user) { navigate("/login"); return; }
    if (user.id === seller.id) return;
    navigate(`/chats?user=${seller.id}&name=${seller.username}`);
  };

  const getMembershipDuration = (dateString) => {
    if (!dateString) return "New"; const now = new Date(); const date = new Date(dateString);
    const months = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return "New member"; if (months === 1) return "1 month";
    if (months < 12) return `${months} months`; const years = Math.floor(months / 12);
    if (years === 1) return "1 year"; return `${years} years`;
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return ""; const now = new Date(); const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000); if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24); if (days < 30) return `${days}d ago`; return `${Math.floor(days / 30)}mo ago`;
  };

  if (loading) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin text-6xl">⚡</div><p className="text-gray-500 mt-4">Loading profile...</p></div></div>);
  if (error || !seller) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><span className="text-6xl">🔍</span><h2 className="text-2xl font-bold text-gray-700 mt-4">{error || "User not found"}</h2><Link to="/home" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-full">Back to Home</Link></div></div>);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
            {seller.profile_picture ? (<img src={seller.profile_picture} alt={seller.username} className="w-full h-full object-cover" />) : (seller.username?.[0]?.toUpperCase() || "U")}
            {seller.vip_badge && (<span className="absolute -top-1 -right-1 text-3xl">💎</span>)}
          </div>
          <h1 className="text-3xl font-bold">{seller.username}</h1>
          <p className="text-blue-100 mt-1">{seller.email}</p>
          {seller.phone_number && (<p className="text-blue-100 mt-1">📞 {seller.phone_number}</p>)}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {seller.is_verified && (<span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">✓ Verified Account</span>)}
            {seller.verified_seller_badge && (<span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">✓ Verified Seller</span>)}
            {seller.verified_product_badge && (<span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">✓ Verified Products</span>)}
            {seller.premium_badge && (<span className="bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full font-bold">👑 Premium</span>)}
            {seller.shop_badge && (<span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-bold">🏪 Shop Owner</span>)}
            {seller.vip_badge && (<span className="bg-black text-yellow-400 text-xs px-3 py-1 rounded-full font-bold">💎 VIP Member</span>)}
            {seller.role === "admin" && (<span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">🛡️ Admin</span>)}
            {seller.plan_name && seller.plan_name !== "Free" && (<span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{seller.plan_name} Plan</span>)}
            {(!seller.is_verified && !seller.verified_seller_badge && !seller.verified_product_badge && !seller.premium_badge && !seller.shop_badge && !seller.vip_badge && seller.plan_name === "Free") && (<span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Free Plan</span>)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold text-blue-600">{seller.total_products || 0}</p><p className="text-xs text-gray-500">Products</p></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold text-green-600">{seller.total_views || 0}</p><p className="text-xs text-gray-500">Total Views</p></div>
          <div className="bg-white rounded-xl shadow p-4 text-center"><p className="text-2xl font-bold text-red-500">{seller.total_likes || 0}</p><p className="text-xs text-gray-500">Total Likes</p></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏅 Badges & Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[{ key: 'is_verified', label: 'Verified Account', icon: '✅' },
              { key: 'verified_seller_badge', label: 'Verified Seller', icon: '✅' },
              { key: 'verified_product_badge', label: 'Verified Products', icon: '✅' },
              { key: 'premium_badge', label: 'Premium Member', icon: '👑' },
              { key: 'shop_badge', label: 'Shop Owner', icon: '🏪' },
              { key: 'vip_badge', label: 'VIP Member', icon: '💎' }].map((badge) => (
              <div key={badge.key} className={`p-3 rounded-lg text-center ${seller[badge.key] ? (badge.key === 'vip_badge' ? 'bg-black border border-yellow-400' : badge.key === 'premium_badge' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200') : 'bg-gray-50 border border-gray-200 opacity-50'}`}>
                <span className="text-2xl">{seller[badge.key] ? badge.icon : '🔒'}</span>
                <p className={`text-xs font-medium mt-1 ${badge.key === 'vip_badge' && seller[badge.key] ? 'text-yellow-400' : ''}`}>{seller[badge.key] ? badge.label : `No ${badge.label}`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Contact & About</h2>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Email</p><p className="text-gray-700 font-medium">{seller.email}</p></div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Phone</p><p className="text-gray-700 font-medium">{seller.phone_number ? `📞 ${seller.phone_number}` : "Not provided"}</p></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Location</p><p className="text-gray-700 font-medium">{seller.location ? `📍 ${seller.location}` : "Not specified"}</p></div>
            {seller.bio && (<div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Bio</p><p className="text-gray-700">{seller.bio}</p></div>)}
            <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Member since</p><p className="text-gray-700 font-medium">🕐 {getMembershipDuration(seller.created_at)} <span className="text-gray-400 ml-1">(Joined {new Date(seller.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })})</span></p></div>
            {seller.plan_name && seller.plan_name !== "Free" && (<div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Subscription Plan</p><p className="text-gray-700 font-medium">⭐ {seller.plan_name}</p></div>)}
          </div>
          {user && user.id !== seller.id && (<button onClick={handleChatWithSeller} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg flex items-center justify-center gap-2">💬 Chat with {seller.username}</button>)}
        </div>
      </div>

      {products.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Products by {seller.username}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 hover:border-blue-300 group">
                <div className="relative overflow-hidden bg-gray-200 h-40">
                  {product.image_urls?.[0] ? (<img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />) : (<div className="w-full h-full flex items-center justify-center"><span className="text-4xl text-gray-400">📦</span></div>)}
                  {product.verified && <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">✓</span>}
                  {product.negotiable && <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">NEG</span>}
                </div>
                <div className="p-3"><h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3><p className="text-sm font-bold text-blue-600 mt-1">{Number(product.price).toLocaleString()} RWF</p><div className="flex items-center justify-between mt-1 text-xs text-gray-400"><span>👁️ {product.views || 0} views</span><span>{getTimeAgo(product.created_at)}</span></div></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProfile;