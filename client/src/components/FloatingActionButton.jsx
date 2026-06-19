import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2.5" fill="#00E309"/>
    <circle cx="12" cy="12" r="2.5" fill="#00E309"/>
    <circle cx="12" cy="19" r="2.5" fill="#00E309"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UpgradeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);

function FloatingActionButton() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [posY, setPosY] = useState(window.innerHeight - 100);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const initialPosY = useRef(0);
  const hasMoved = useRef(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Listen for notification updates
  useEffect(() => {
    const handleNotificationUpdate = () => fetchUnreadCount();
    window.addEventListener("notificationRead", handleNotificationUpdate);
    window.addEventListener("cartUpdated", handleNotificationUpdate);
    return () => {
      window.removeEventListener("notificationRead", handleNotificationUpdate);
      window.removeEventListener("cartUpdated", handleNotificationUpdate);
    };
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("https://guraneza.onrender.com/api/notifications", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const unread = data.notifications.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {}
  };

  const handleLogout = async () => { await logout(); navigate("/"); setIsOpen(false); };
  const handleUpgrade = () => { navigate("/upgrade"); setIsOpen(false); };
  const handleHelp = () => { navigate("/help"); setIsOpen(false); };
  const handleNotifications = () => { navigate("/notifications"); setIsOpen(false); };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    hasMoved.current = false;
    dragStartY.current = e.clientY;
    initialPosY.current = posY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;
    if (Math.abs(deltaY) > 3) hasMoved.current = true;
    setPosY(Math.max(60, Math.min(window.innerHeight - 60, initialPosY.current + deltaY)));
  };

  const handleMouseUp = () => setTimeout(() => setIsDragging(false), 0);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    hasMoved.current = false;
    dragStartY.current = touch.clientY;
    initialPosY.current = posY;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (Math.abs(deltaY) > 3) hasMoved.current = true;
    setPosY(Math.max(60, Math.min(window.innerHeight - 60, initialPosY.current + deltaY)));
  };

  const handleTouchEnd = () => setTimeout(() => setIsDragging(false), 0);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  const handleMainClick = () => {
    if (!hasMoved.current) setIsOpen(!isOpen);
  };

  const accent = '#00E309';
  const bgColor = darkMode ? '#000124' : '#ffffff';
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const fabBg = darkMode ? '#000124' : '#1a1a2e';

  const menuItems = [
    { label: "Notifications", icon: <NotificationIcon />, onClick: handleNotifications, show: true, badge: unreadCount },
    { label: "Upgrade Plan", icon: <UpgradeIcon />, onClick: handleUpgrade, show: true },
    { label: darkMode ? "Light Mode" : "Dark Mode", icon: darkMode ? <SunIcon /> : <MoonIcon />, onClick: toggleDarkMode, show: true },
    { label: "Help", icon: <HelpIcon />, onClick: handleHelp, show: true },
    { label: "Logout", icon: <LogoutIcon />, onClick: handleLogout, show: !!user, color: '#ef4444' },
  ];

  const visibleMenuItems = menuItems.filter(item => item.show);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fab-item { transition: all 0.2s ease; }
        .fab-item:hover { transform: translateX(-4px) !important; }
      `}</style>

      <div style={{
        position: 'fixed',
        right: 16,
        bottom: window.innerHeight - posY,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem',
      }}>
        
        {/* Menu - Always ABOVE */}
        {isOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', order: 0 }}>
            {visibleMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="fab-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.75rem', borderRadius: 20,
                  border: `1px solid ${borderColor}`,
                  background: bgColor, color: item.color || textColor,
                  cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
                  whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  animation: `fadeUp 0.15s ease ${index * 0.03}s both`,
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#ef4444', color: 'white',
                    fontSize: '0.5rem', minWidth: 16, height: 16,
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, padding: '0 4px'
                  }}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Button - Below the menu */}
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleMainClick}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            border: `1px solid ${darkMode ? 'rgba(0,227,9,0.15)' : 'rgba(0,0,0,0.1)'}`,
            background: fabBg,
            cursor: isDragging ? 'grabbing' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            userSelect: 'none',
            order: 1,
            position: 'relative',
          }}
          title="Drag vertically to move"
        >
          {isOpen ? <CloseIcon /> : <DotsIcon />}
          {/* Red dot on main button if notifications */}
          {!isOpen && unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              width: 10, height: 10, borderRadius: '50%',
              background: '#ef4444', border: '1.5px solid ' + fabBg
            }} />
          )}
        </button>
      </div>
    </>
  );
}

export default FloatingActionButton;