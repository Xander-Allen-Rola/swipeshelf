import './RecommendationPage.css';
import Logo from '../components/Logo';
import NavigationPane from '../components/NavigationPane';
import BookCard from '../components/BookCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

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


  return (
    <>
      <LoadingOverlay show={loading} text="Fetching recommendations..." />
      <Logo position="top" />
      <div className="recommendation-page">
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
            style={{ zIndex: books.length - currentIndex }}
          />
        )}

        {/* optional small overlay when prefetching */}
        {isPrefetching && (
          <div className="prefetch-indicator">Loading more books</div>
        )}

        <NavigationPane />
      </div>
    </>
  );
}

export default RecommendationPage;
