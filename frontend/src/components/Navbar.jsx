import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Store, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg">
                    <Store className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                    Roxiler Rating
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-text-muted">
                    {user.role === 'ADMIN' && <Shield size={18} className="text-primary" />}
                    {user.role === 'USER' && <User size={18} className="text-success" />}
                    <span className="text-sm font-medium">{user.name}</span>
                </div>

                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2 text-text-muted hover:text-danger transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
