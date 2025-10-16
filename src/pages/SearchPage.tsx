import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import NavigationPane from "../components/NavigationPane";
import ShelfCard from "../components/ShelfCard";
import "./SearchPage.css";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  title: string;
  authors: string;
  publishedDate: string | null;
  coverUrl: string | null;
  googleBooksId: string;
  description: string;
  categories: string[];
}

const accordionVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  show: { opacity: 1, height: "auto", overflow: "hidden" },
  exit: { opacity: 0, height: 0, overflow: "hidden" },
};

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/search/search?query=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchBooks, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <Logo position="top" />

      <div className="search-container">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0 },
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="search-input"
          />
        </motion.div>

        <div className="search-results-container">
          <AnimatePresence>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <motion.div
                    key={`skeleton-${idx}`}
                    variants={accordionVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="search-book-card"
                  >
                    <div className="skeleton-cover shimmer" />
                    <div className="search-book-info">
                      <div className="skeleton-title shimmer" />
                      <div className="skeleton-author shimmer" />
                    </div>
                  </motion.div>
                ))
              : results.map((book) => (
                  <motion.div
                    key={book.googleBooksId}
                    variants={accordionVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <div
                      className="search-book-card"
                      onClick={() => setSelectedBook(book)}
                    >
                      {book.coverUrl && (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="search-book-cover"
                        />
                      )}
                      <div className="search-book-info">
                        <div className="search-book-title">{book.title}</div>
                        <div className="search-book-authors">
                          {book.authors}
                        </div>
                      </div>
                    </div>
                    <div className="divider" />
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedBook && (
        <ShelfCard
          googleBooksId={selectedBook.googleBooksId}
          title={selectedBook.title}
          coverURL={selectedBook.coverUrl ?? ""}
          description={selectedBook.description}
          status="reading"
          variation="search"
          onClose={() => setSelectedBook(null)}
        />
      )}

      <NavigationPane />
    </>
  );
}

export default SearchPage;
