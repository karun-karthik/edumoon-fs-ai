import { useNavigate, useLocation } from 'react-router';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem("userInfo") || "{}"));

    // Listen for profile updates
    useEffect(() => {
        const handleProfileUpdate = () => {
            const updatedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
            setUserInfo(updatedUserInfo);
        };

        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    }, []);

    const isActive = (path: string) => {
        const active = location.pathname === path;
        return active;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Only show sidebar on authenticated routes
    if (!token) {
        return null;
    }

    const menuItems = [
        { label: 'Dashboard', path: '/home' },
        { label: 'Accounts', path: '/home/accounts' },
        { label: 'Transactions', path: '/home/transactions' },
        { label: 'Insights', path: '/home/insights' },
        { label: 'Profile', path: '/home/profile' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h5>Budget Tracker</h5>
                {userInfo.name && <p className="user-name">{userInfo.name}</p>}
                <p className="user-email">{userInfo.email}</p>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <Button variant="danger" size="sm" onClick={handleLogout} className="w-100">
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default SideBar;
