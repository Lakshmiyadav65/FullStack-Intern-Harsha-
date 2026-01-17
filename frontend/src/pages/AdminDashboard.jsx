import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, Store, Star, Plus, Filter,
    ChevronDown, ChevronUp, Search, X
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [activeTab, setActiveTab] = useState('stores'); // 'stores' or 'users'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('user'); // 'user' or 'store'

    // Filters
    const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
    const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const statsRes = await axios.get('http://localhost:5000/api/admin/dashboard');
            setStats(statsRes.data);

            const endpoint = activeTab === 'stores' ? 'stores' : 'users';
            const params = { ...filters, sortBy: sort.field, order: sort.order };
            const listRes = await axios.get(`http://localhost:5000/api/admin/${endpoint}`, { params });
            setItems(listRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, sort, filters]);

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC'
        }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const endpoint = modalType === 'store' ? 'stores' : 'users';
            await axios.post(`http://localhost:5000/api/admin/${endpoint}`, data);
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pb-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Users className="text-primary" />} label="Total Users" value={stats.totalUsers} />
                <StatCard icon={<Store className="text-success" />} label="Total Stores" value={stats.totalStores} />
                <StatCard icon={<Star className="text-accent" />} label="Total Ratings" value={stats.totalRatings} />
            </div>

            {/* Main Content */}
            <div className="card glass">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex bg-bg-dark p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('stores')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'stores' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        >
                            Stores
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                        >
                            Users
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setModalType('store'); setShowModal(true); }}
                            className="btn-primary flex items-center gap-2 py-2"
                        >
                            <Plus size={18} /> Add Store
                        </button>
                        <button
                            onClick={() => { setModalType('user'); setShowModal(true); }}
                            className="btn-primary flex items-center gap-2 py-2 bg-indigo-500 hover:bg-indigo-600"
                        >
                            <Plus size={18} /> Add User
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <FilterInput
                        placeholder="Search by Name"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                    <FilterInput
                        placeholder="Search by Email"
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    />
                    <FilterInput
                        placeholder="Search by Address"
                        value={filters.address}
                        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                    />
                    {activeTab === 'users' && (
                        <select
                            className="input-field"
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                            <option value="STORE_OWNER">Store Owner</option>
                        </select>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-text-muted text-sm uppercase tracking-wider">
                                <SortableHeader label="Name" field="name" currentSort={sort} onSort={handleSort} />
                                <SortableHeader label="Email" field="email" currentSort={sort} onSort={handleSort} />
                                <SortableHeader label="Address" field="address" currentSort={sort} onSort={handleSort} />
                                {activeTab === 'stores' ? (
                                    <SortableHeader label="Rating" field="rating" currentSort={sort} onSort={handleSort} />
                                ) : (
                                    <SortableHeader label="Role" field="role" currentSort={sort} onSort={handleSort} />
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="4" className="py-8 text-center text-text-muted">Loading...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan="4" className="py-8 text-center text-text-muted">No items found</td></tr>
                            ) : items.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-medium">{item.name}</td>
                                    <td className="py-4 text-text-muted">{item.email}</td>
                                    <td className="py-4 text-text-muted truncate max-w-[200px]">{item.address}</td>
                                    <td className="py-4">
                                        {activeTab === 'stores' ? (
                                            <div className="flex items-center gap-1 text-accent">
                                                <Star size={14} fill="currentColor" />
                                                <span>{item.averageRating || '0.0'}</span>
                                            </div>
                                        ) : (
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.role === 'ADMIN' ? 'bg-primary/20 text-primary' :
                                                    item.role === 'STORE_OWNER' ? 'bg-accent/20 text-accent' :
                                                        'bg-success/20 text-success'
                                                }`}>
                                                {item.role}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
                    <div className="card glass w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Add New {modalType === 'store' ? 'Store' : 'User'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase font-bold text-text-muted">Name</label>
                                <input name="name" required minLength={modalType === 'user' ? 20 : 2} maxLength={60} className="input-field" placeholder="Full Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase font-bold text-text-muted">Email</label>
                                <input name="email" type="email" required className="input-field" placeholder="email@example.com" />
                            </div>
                            {modalType === 'user' && (
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-text-muted">Password</label>
                                    <input name="password" type="password" required className="input-field" placeholder="At least 8 chars" />
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-xs uppercase font-bold text-text-muted">Address</label>
                                <textarea name="address" required maxLength={400} className="input-field" rows={3} placeholder="Full Address"></textarea>
                            </div>
                            {modalType === 'user' && (
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-text-muted">Role</label>
                                    <select name="role" required className="input-field">
                                        <option value="USER">Normal User</option>
                                        <option value="STORE_OWNER">Store Owner</option>
                                        <option value="ADMIN">System Admin</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="card glass flex items-center gap-4">
        <div className="bg-bg-dark p-4 rounded-2xl shadow-inner">
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div>
            <p className="text-text-muted text-sm font-medium">{label}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
    </div>
);

const FilterInput = ({ placeholder, value, onChange }) => (
    <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
            className="input-field pl-10 text-sm"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

const SortableHeader = ({ label, field, currentSort, onSort }) => (
    <th className="py-4 cursor-pointer hover:text-white transition-colors" onClick={() => onSort(field)}>
        <div className="flex items-center gap-2">
            {label}
            <span className="text-primary">
                {currentSort.field === field ? (
                    currentSort.order === 'ASC' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                ) : (
                    <div className="w-[14px]" />
                )}
            </span>
        </div>
    </th>
);

export default AdminDashboard;
