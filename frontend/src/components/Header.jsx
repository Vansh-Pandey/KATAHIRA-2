import { React, useState,useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Link } from 'react-router-dom';
const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const { authUser, checkAuth,logout } = useAuthStore();
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    const openPanel = () => {
        if (authUser) {
            navigate("/home"); // Redirect to /home if user is already authenticated
        } else {
            setIsPanelOpen(true); // Otherwise, open login panel
        }
    };
    const closePanel = () => {
        setIsPanelOpen(false);
    };
    const handleLogout = async () => {
    await logout();
    navigate("/");
  };
    return (
        <header className={`px-6 py-3 flex justify-between items-center sticky top-0 z-50 ${darkMode ? 'bg-gray-800 shadow-md shadow-black/30' : 'bg-white shadow-md'}`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>KataHira</div>
            <nav className="hidden md:flex space-x-4">
                <Link to="/" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Home</Link>
              <Link to="/about" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">About</Link>
              <Link to="/contact" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Contact</Link>
              <Link to="/support" className="text-stone-600 hover:text-amber-700 transition-colors font-medium">Community</Link>
            </nav>
            <div className="flex items-center gap-3">
                {/* {!authUser && <button onClick={openPanel} className={`px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-amber-100 hover:bg-amber-200'} transition-colors`}>
                    Log in
                </button>}
                {!authUser && <button onClick={openPanel} className={`px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700'} text-white transition-colors hidden md:block`}>
                    Sign up free
                </button>} */}
                {authUser && <button onClick={handleLogout} className={`px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700'} text-white transition-colors hidden md:block`}>
                    Logout
                </button>}
            </div>
        </header>
    )
}

export default Header
