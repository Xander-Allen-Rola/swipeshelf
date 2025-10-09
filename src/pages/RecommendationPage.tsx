import './RecommendationPage.css';
import Logo from '../components/Logo';
import NavigationPane from '../components/NavigationPane';
import BookCard from '../components/BookCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';

interface Book {
  title: string;
  authors: string;
  publishedDate: string | null;
  isbn: string | null;
  coverUrl: string;
  googleBooksId: string;
  description: string;
  averageRating: number;
  categories: string[];
}

function RecommendationPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPrefetching, setIsPrefetching] = useState(false); // ✅ separate state for prefetch
  const [swipedStack, setSwipedStack] = useState<Book[]>([]);

  const didFetch = useRef(false);

  const userId = Number(localStorage.getItem("userId") || 0);

  const fetchRecommendations = async (append = false) => {
    try {
      if (!append) setLoading(true);
      else setIsPrefetching(true);

      const res = await axios.get(
        `http://localhost:5000/api/recommendations/fetch/${userId}`
      );

      if (Array.isArray(res.data)) {
        setBooks(prev => (append ? [...prev, ...res.data] : res.data));
      }
    } catch (err) {
      console.error('❌ Failed to fetch recommendations:', err);
    } finally {
      if (!append) setLoading(false);
      else setIsPrefetching(false);
    }
  };

  // initial fetch
  useEffect(() => {
    if (didFetch.current) return; // already fetched
    didFetch.current = true;

    console.log("🔥 useEffect triggered: fetching recommendations...");
    fetchRecommendations(false);
  }, []);

  // prefetch when only 10 cards remain
  useEffect(() => {
    if (books.length === 0) return; // skip until initial load finishes

    const remaining = books.length - currentIndex;

    if (remaining <= 3 && !isPrefetching && currentIndex > 0) {
      console.log('⚡ Prefetching more recommendations...');
      fetchRecommendations(true);
    }
  }, [currentIndex, books.length]);

  const handleSwipe = async (dir: string, book: Book) => {
    console.log(`Swiped ${dir} on ${book.title}`);
    // Push swiped card to stack for undo
    setSwipedStack(prev => [book, ...prev]);
    if (dir === 'right') {
      try {
        await axios.post("http://localhost:5000/api/shelves/add-to-to-read", {
          userId,
          book: {
            googleBooksId: book.googleBooksId,
            title: book.title,
            coverUrl: book.coverUrl,
            description: book.description,
          },
        });
        console.log(`✅ Book ${book.title} added to To Read shelf`);
      } catch (err) {
        console.error("❌ Failed to add book to To Read shelf:", err);
      }
    }

    try {
      await axios.post("http://localhost:5000/api/markSeen", {
        userId,
        googleBooksId: book.googleBooksId,
      });
      console.log(`✅ Book ${book.title} marked as seen`);
    } catch (err) {
      console.error("❌ Failed to mark book as seen:", err);
    }
  };

  const handleUndo = () => {
    if (swipedStack.length === 0) return;

    const [lastSwiped, ...rest] = swipedStack;

    setSwipedStack(rest);
    setCurrentIndex(prev => prev - 1); // go back to previous card
  };


  return (
    <>
      <Logo position="top" />
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0 },
          }}
        className="recommendation-page">
        {books.length > 0 && currentIndex < books.length && (
          <BookCard
            key={books[currentIndex].googleBooksId}
            title={books[currentIndex].title}
            author={books[currentIndex].authors}
            release={books[currentIndex].publishedDate ?? 'Unknown'}
            description={books[currentIndex].description}
            image={books[currentIndex].coverUrl}
            genres={books[currentIndex].categories}
            onSwipe={(dir) => handleSwipe(dir, books[currentIndex])}
            onSwipedComplete={() => setCurrentIndex(prev => prev + 1)}
            onUndo={handleUndo}
            style={{ zIndex: books.length - currentIndex }}
          />
        )}

        {/* optional small overlay when prefetching */}
        {/* ✅ Show message during initial load or prefetch */}
        {(loading || isPrefetching) && (
          <div className="prefetch-indicator">Loading more books</div>
        )}

        </motion.div>

        <NavigationPane />
    </>
  );
}

export default RecommendationPage;
