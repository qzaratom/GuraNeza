import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingActionButton from "./components/FloatingActionButton";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Shops from "./pages/Shops";
import Sell from "./pages/Sell";
import EditProduct from "./pages/EditProduct";
import MyProducts from "./pages/MyProducts";
import Chats from "./pages/Chats";
import Cart from "./pages/Cart";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import SellerProfile from "./pages/SellerProfile";
import Upgrade from "./pages/Upgrade";
import ShopView from "./pages/ShopView";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminShops from "./pages/admin/AdminShops";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminHelpRequests from "./pages/admin/AdminHelpRequests";


function App() {
  const location = useLocation();

  // Only hide navbar on landing, login, and admin pages
  const hideNavbar = location.pathname === "/" || 
                     location.pathname === "/login" || 
                     location.pathname.startsWith("/admin");

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/shop/:id" element={<ShopView />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/upgrade" element={<Upgrade />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="help" element={<AdminHelpRequests />} />
        </Route>
      </Routes>
      
      {!hideNavbar && <FloatingActionButton />}
    </div>
  );
}

export default App;