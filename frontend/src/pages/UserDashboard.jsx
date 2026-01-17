import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Edit3, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [addressTerm, setAddressTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [rating, setRating] = useState(5);
    const { user } = useAuth();

    const fetchStores = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/users/stores', {
                params: { name: searchTerm, address: addressTerm }
            });
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStores();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, addressTerm]);

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/ratings', {
                storeId: selectedStore.id,
                value: rating
            });
            setSelectedStore(null);
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit rating');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Welcome, {user.name.split(' ')[0]}</h1>
                    <p className="text-text-muted">Find and rate your favorite stores</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            className="input-field pl-10"
                            placeholder="Search stores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative md:w-64">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            className="input-field pl-10"
                            placeholder="Search address..."
                            value={addressTerm}
                            onChange={(e) => setAddressTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-text-muted">Loading stores...</div>
                ) : stores.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-text-muted">No stores found</div>
                ) : stores.map((store) => (
                    <div key={store.id} className="card glass group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-primary/10 p-3 rounded-xl">
                                <Star className="text-primary" size={24} fill={parseFloat(store.overallRating) > 0 ? "currentColor" : "none"} />
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-white">{store.overallRating}</span>
                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Overall</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-1">{store.name}</h3>
                        <div className="flex items-center gap-1 text-text-muted text-sm mb-6">
                            <MapPin size={14} />
                            <span className="truncate">{store.address}</span>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Your Rating</p>
                                <div className="flex items-center gap-1 font-bold">
                                    {store.userSubmittedRating ? (
                                        <>
                                            <Star size={14} fill="#f59e0b" className="text-accent" />
                                            <span className="text-accent">{store.userSubmittedRating}</span>
                                        </>
                                    ) : (
                                        <span className="text-text-muted font-normal text-sm italic">Not rated</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => { setSelectedStore(store); setRating(store.userSubmittedRating || 5); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                            >
                                <Edit3 size={16} />
                                {store.userSubmittedRating ? 'Modify' : 'Rate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rating Modal */}
            {selectedStore && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
                    <div className="card glass w-full max-w-sm p-8 text-center animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-end -mt-4 -mr-4">
                            <button onClick={() => setSelectedStore(null)} className="text-text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Edit3 className="text-primary" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">{selectedStore.userSubmittedRating ? 'Update Rating' : 'Submit Rating'}</h2>
                        <p className="text-text-muted text-sm mb-8">How was your experience at {selectedStore.name}?</p>

                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-transform active:scale-95"
                                >
                                    <Star
                                        size={36}
                                        fill={star <= rating ? "#f59e0b" : "none"}
                                        className={star <= rating ? "text-accent" : "text-white/10"}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedStore(null)}
                                className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitRating}
                                className="flex-1 btn-primary py-3 rounded-xl"
                            >
                                {selectedStore.userSubmittedRating ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
