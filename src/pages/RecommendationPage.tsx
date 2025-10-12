import './RecommendationPage.css';
import Logo from '../components/Logo';
import NavigationPane from '../components/NavigationPane';
import BookCard from '../components/BookCard';
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
  const userId = Number(localStorage.getItem("userId") || 0);

  const CACHE_KEY = `recommendation_cache_${userId}`;
  const INDEX_KEY = `recommendation_index_${userId}`;

  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [swipedStack, setSwipedStack] = useState<Book[]>([]);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const didFetch = useRef(false);

  // Save/load cache
  const saveCache = (bookList: Book[], index: number) => {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(bookList));
    sessionStorage.setItem(INDEX_KEY, index.toString());
  };
  const loadCache = () => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    const cachedIndex = sessionStorage.getItem(INDEX_KEY);
    if (cached) {
      try {
        const parsed: Book[] = JSON.parse(cached);
        setBooks(parsed);
        setCurrentIndex(cachedIndex ? Number(cachedIndex) : 0);
        setLoading(false);
        console.log(`📦 Loaded recommendations from cache for user ${userId}`);
        return true;
      } catch (err) {
        console.error("❌ Failed to parse cache:", err);
      }
    }
    return false;
  };

  const fetchRecommendations = async (append = false) => {
    try {
      if (!append) setLoading(true);
      else setIsPrefetching(true);

      const res = await axios.get(
        `http://localhost:5000/api/recommendations/fetch/${userId}`
      );

      if (Array.isArray(res.data)) {
        setBooks(prev => {
          const seen = new Set(prev.map(b => b.googleBooksId));
          const uniqueNew = res.data.filter(b => !seen.has(b.googleBooksId));
          const updated = append ? [...prev, ...uniqueNew] : res.data;
          saveCache(updated, append ? currentIndex : 0);
          return updated;
        });
      }
    } catch (err) {
      console.error('❌ Failed to fetch recommendations:', err);
    } finally {
      if (!append) setLoading(false);
      else setIsPrefetching(false);
    }
  };

  // initial load
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const foundCache = loadCache();
    if (!foundCache) {
      console.log("🔥 Fetching fresh recommendations...");
      fetchRecommendations(false);
    }
  }, []);

  // prefetch more when low
  useEffect(() => {
    if (books.length === 0) return;

    const remaining = books.length - currentIndex;
    if (remaining <= 5 && !isPrefetching && currentIndex > 0) {
      console.log('⚡ Prefetching more recommendations...');
      fetchRecommendations(true);
    }

    saveCache(books, currentIndex);
  }, [currentIndex, books.length]);

  // Preload current + next 3 book images safely
  useEffect(() => {
    if (books.length === 0 || !books[currentIndex]) return;

    const preloadRange = 3; // number of upcoming books to preload
    const urlsToPreload = books
      .slice(currentIndex, currentIndex + preloadRange + 1)
      .map(b => b.coverUrl)
      .filter(Boolean); // ensure url exists

    urlsToPreload.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    // Also update loadedImage for current card
    setLoadedImage(books[currentIndex].coverUrl ?? '/images/placeholder-cover.png');
  }, [currentIndex, books]);

  const handleSwipe = async (dir: string, book: Book) => {
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
    setCurrentIndex(prev => prev - 1);
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
        className="recommendation-page"
      >
        {books.length > 0 && currentIndex < books.length && (
          <BookCard
            key={books[currentIndex].googleBooksId}
            title={books[currentIndex].title}
            author={books[currentIndex].authors}
            release={books[currentIndex].publishedDate ?? 'Unknown'}
            description={books[currentIndex].description}
            image={loadedImage ?? '/images/placeholder-cover.png'} // show placeholder while loading
            genres={books[currentIndex].categories}
            onSwipe={(dir) => handleSwipe(dir, books[currentIndex])}
            onSwipedComplete={() => setCurrentIndex(prev => prev + 1)}
            onUndo={handleUndo}
            style={{ zIndex: books.length - currentIndex }}
          />
        )}

        {(loading || isPrefetching) && (
          <div className="prefetch-indicator">Loading books</div>
        )}
      </motion.div>

      <NavigationPane />
    </>
  );
}

export default RecommendationPage;
