import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, Users, Calendar, MapPin, Search } from 'lucide-react';

const StoreDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/store/dashboard');
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load dashboard');
            }
            setLoading(false);
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="text-center py-20 text-text-muted">Loading your store data...</div>;
    if (error) return <div className="text-center py-20 text-danger">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <p className="text-primary font-bold uppercase tracking-widest text-xs mb-1">Store Owner Portal</p>
                    <h1 className="text-4xl font-bold mb-2">{data.storeName}</h1>
                    <p className="text-text-muted">Manage your store's reputation and feedback</p>
                </div>

                <div className="card glass px-8 py-4 flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-text-muted uppercase font-bold">Store Average</p>
                        <p className="text-3xl font-black text-white">{data.averageRating}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={20}
                                fill={s <= Math.round(data.averageRating) ? "#f59e0b" : "none"}
                                className={s <= Math.round(data.averageRating) ? "text-accent" : "text-white/10"}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="card glass overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Users size={20} className="text-primary" />
                        Recent Ratings
                    </h2>
                    <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {data.ratings.length} total feedback
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-white/5 bg-white/2">
                                <th className="px-8 py-4 font-bold">Customer</th>
                                <th className="px-8 py-4 font-bold">Address</th>
                                <th className="px-8 py-4 font-bold text-center">Rating</th>
                                <th className="px-8 py-4 font-bold text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {data.ratings.length === 0 ? (
                                <tr><td colSpan="4" className="px-8 py-12 text-center text-text-muted">No ratings received yet.</td></tr>
                            ) : data.ratings.map((r, i) => (
                                <tr key={i} className="hover:bg-white/2 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-white">{r.userName}</p>
                                        <p className="text-xs text-text-muted">{r.userEmail}</p>
                                    </td>
                                    <td className="px-8 py-5 text-text-muted max-w-[250px] truncate">
                                        {r.address}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center items-center gap-1 bg-accent/10 py-1.5 px-3 rounded-lg mx-auto w-fit">
                                            <Star size={14} fill="#f59e0b" className="text-accent" />
                                            <span className="text-accent font-bold">{r.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right text-text-muted whitespace-nowrap">
                                        {new Date(r.date).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StoreDashboard;
