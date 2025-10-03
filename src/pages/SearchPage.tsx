import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import NavigationPane from "../components/NavigationPane";
import ShelfCard from "../components/ShelfCard";
import "./SearchPage.css";

interface Book {
  title: string;
  authors: string;
  publishedDate: string | null;
  coverUrl: string | null;
  googleBooksId: string;
  description: string;
  categories: string[];
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // 🔍 Fetch search results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/search/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchBooks, 500); // ⏳ debounce: wait 500ms after typing
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <Logo position="top" />
      
      <div className="search-container">
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="search-input"
        />

        {loading && <p className="loading">Loading...</p>}

        <div className="search-results-container">
            {results.map((book) => (
            <>
            <div key={book.googleBooksId} className="search-book-card" onClick={() => setSelectedBook(book)}>
                {book.coverUrl && (
                <img src={book.coverUrl} alt={book.title} className="search-book-cover" />
                )}
                <div className="search-book-info">
                    <div className="search-book-title">{book.title}</div>
                    <div className="search-book-authors">{book.authors}</div>
                </div>
            </div>
            <div className="divider" />
            </>
            ))}
        </div>
      </div>
      {selectedBook && (
        <ShelfCard
          id={Number(selectedBook.googleBooksId)} // or generate unique id if needed
          title={selectedBook.title}
          coverURL={selectedBook.coverUrl ?? ""}
          description={selectedBook.description}
          status="reading"
          variation="search" // 👈 shows SearchOptions
          onClose={() => setSelectedBook(null)} // closes the card
        />
      )}
      <NavigationPane />
    </>
  );
}

export default SearchPage;
