import React, { useEffect, useState } from 'react';
import './AddFavorites.css';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup';

type Props = {
  isVisible?: boolean;
  onClose?: () => void;
  onFavoritesAdded?: (books: Book[]) => void;
};

type Book = {
  id: number;
  googleBooksId: string;
  title: string;
  coverURL: string;
  description?: string;
  status?: string;
  shelfName?: string;
  addedAt?: string;
};

function AddFavoriteBookPopup({ isVisible = true, onClose, onFavoritesAdded }: Props) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
            setShowPopup(false);
            }, 3000); // ⏳ auto-close after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [showPopup]);


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

    const toggleBookSelect = (bookId: number) => {
        setSelectedBooks((prev) =>
        prev.includes(bookId)
            ? prev.filter((id) => id !== bookId)
            : [...prev, bookId]
        );
    };

    const handleConfirm = async () => {
        if (selectedBooks.length === 0) return;

        const userId = Number(localStorage.getItem('userId') || 0);
        const selected = books.filter((b) => selectedBooks.includes(b.id));

        try {
            setSubmitting(true);
            const response = await fetch('http://localhost:5000/api/shelves/add-to-favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                books: selected.map((b) => ({
                googleBooksId: b.googleBooksId,
                title: b.title,
                coverUrl: b.coverURL,
                description: b.description ?? null,
                })),
            }),
            });

            const data = await response.json();
            if (response.ok) {
            console.log('✅ Favorites added:', data);

            // 🧼 clear selection and remove added books from grid
            setSelectedBooks([]);
            setBooks((prev) => prev.filter((b) => !selectedBooks.includes(b.id)));
            onFavoritesAdded?.(selected);
            // ✅ close popup
            onClose?.();
            } else {
            console.error('❌ Failed to add favorites:', data);
            setPopupMessage(data.error || 'Failed to add favorites');
            setShowPopup(true);
            }
        } catch (err: any) {
            console.error('❌ Error adding favorites:', err);
            setPopupMessage(err.message || 'An unexpected error occurred');
            setShowPopup(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isVisible) return null;
    if (loading) return null; 

  return (
    <>
      {/* 🔲 Background Overlay */}
      <motion.div
        className="popup-background"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut',
        }}
      />

      {/* 🪟 Popup Container */}
      <motion.div
        className="add-favorite-book-container"
        style={{
          top: '50%',
          left: '50%',
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.4,
          scale: { type: 'spring', visualDuration: 0.4, bounce: 0 },
        }}
      >
        <div className="add-fav-header">
          <h3 style={{ margin: 0 }}>Add your Favorite Book/s</h3>
          <div className="fav-indicators">
            <button
                className="close-button"
                onClick={onClose}
            >
                Cancel
            </button>
            <div className="selected-count">
                {selectedBooks.length > 0 && `${selectedBooks.length} selected`}
            </div>
            <button
                className="confirm-button"
                disabled={selectedBooks.length === 0 || submitting}
                onClick={handleConfirm}
            >
                Done
            </button>
          </div>
        </div>

        {/* 📚 Book Grid */}
          <div className="favorites-grid">
            {books.map((b) => (
              <div
                key={b.id}
                className={`favorite-book-wrapper ${
                  selectedBooks.includes(b.id) ? 'selected' : ''
                }`}
                onClick={() => toggleBookSelect(b.id)}
              >
                <img
                  src={b.coverURL}
                  alt={b.title}
                  className="favorite-cover"
                />
                {selectedBooks.includes(b.id) && (
                  <motion.div
                    className="check-overlay"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
      </motion.div>
        <AnimatePresence>
          {showPopup && 
            <Popup 
            text={popupMessage || ''}
            variation="error" />}
        </AnimatePresence>

    </>
  );
}

export default AddFavoriteBookPopup;
