import React, { useEffect, useState } from 'react';
import './AddFavorites.css';
import { motion } from 'framer-motion';

type Props = {
    isVisible?: boolean;
    onClose?: () => void;
}

type Book = {
    id: number;
    googleBooksId: string;
    title: string;
    coverURL: string;
    description?: string;
    status?: string;
    shelfName?: string;
    addedAt?: string;
}

function AddFavoriteBookPopup({ isVisible = true, onClose }: Props) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isVisible) return;

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('User not signed in');
            return;
        }

        const controller = new AbortController();
        const token = localStorage.getItem('token');

        setLoading(true);
        setError(null);

        fetch(`http://localhost:5000/api/shelves/non-favorites/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            signal: controller.signal,
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || 'Failed to fetch books');
                }
                return res.json();
            })
            .then((data) => {
                setBooks(data.books || []);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                console.error('Error fetching non-favorite books:', err);
                setError(err.message || 'Failed to fetch books');
                setLoading(false);
            });

        return () => controller.abort();
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <>
            <motion.div
                className="popup-background"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} // optional if you want it to fade out too
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
            />
                <motion.div 
                    className="add-favorite-book-container"
                    style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%', position: 'fixed' }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}   // 👈 fade & shrink when closing
                    transition={{
                        duration: 0.4,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0 },
                    }}
                >
                    <div className="add-fav-header">
                        <h3 style={{ margin: 0 }}>Add your Favorite Book/s</h3>
                        <button className="close-button" aria-label="Close add favorite" onClick={onClose}>×</button>
                    </div>
                        <div className="favorites-grid">
                            {books.map((b) => (
                                <img
                                    key={b.id}
                                    src={b.coverURL}
                                    alt={b.title}
                                    className="favorite-cover"
                                />
                            ))}
                        </div>
                </motion.div>
        </>
    );
}

export default AddFavoriteBookPopup;