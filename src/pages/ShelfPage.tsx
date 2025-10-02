import './ShelfPage.css';
import Logo from "../components/Logo";
import NavigationPane from '../components/NavigationPane';
import ShelfBook from '../components/ShelfBook';
import DeleteConfirmPopup from '../components/DeleteConfirmPopup';
import { useState, useEffect } from 'react';

interface ShelfBook {
  id: number;
  googleBooksId: string;
  title: string;
  coverURL: string;
  description: string;
  status: string;
  addedAt: string;
}

// ✅ helper: split into chunks of 4
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function ShelfPage() {
  const [toReadShelfBooks, setToReadShelfBooks] = useState<ShelfBook[]>([]);
  const [finishedShelfBooks, setFinishedShelfBooks] = useState<ShelfBook[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const userId = Number(localStorage.getItem("userId") || 0);

  useEffect(() => {
    const fetchToReadBooks = async () => {
      try {
        console.log('🔄 Fetching To Read books...');
        const response = await fetch(`http://localhost:5000/api/shelves/to-read/${userId}`);
        const data = await response.json();
        console.log('✅ Fetched books:', data);
        setToReadShelfBooks(data.books || []);
      } catch (err) {
        console.error('❌ Error fetching books:', err);
        setToReadShelfBooks([]);
      }
    };

    const fetchFinishedBooks = async () => {
      try {
        console.log('🔄 Fetching Finished books...');
        const response = await fetch(`http://localhost:5000/api/shelves/finished/${userId}`);
        const data = await response.json();
        console.log('✅ Fetched books:', data);
        setFinishedShelfBooks(data.books || []);
      } catch (err) {
        console.error('❌ Error fetching books:', err);
        setFinishedShelfBooks([]);
      }
    };

    fetchToReadBooks();
    fetchFinishedBooks();
  }, [userId]);

  const toReadShelves = chunkArray(toReadShelfBooks, 4);
  const finishedShelves = chunkArray(finishedShelfBooks, 4);

  const handleSelectToggle = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      // Clear selections when exiting select mode
      setSelectedBooks([]);
    }
  };

  const handleBookSelect = (bookId: number) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleFinished = async () => {
    if (selectedBooks.length === 0) return;

    try {
      console.log("📦 Moving books to Finished:", selectedBooks);

      const movedBooks: ShelfBook[] = [];

      for (const shelfBookId of selectedBooks) {
        const response = await fetch("http://localhost:5000/api/shelves/move-book", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            shelfBookId,
            targetShelfName: "Finished",
          }),
        });

        const data = await response.json();

        if (response.ok && data.shelfBook) {
          console.log("✅ Move success:", data);
          movedBooks.push(data.shelfBook);
        } else {
          console.error("❌ Move failed:", data);
        }
      }

      // ✅ Update states once, after all moves are done
      setToReadShelfBooks((prev) =>
        prev.filter((book) => !selectedBooks.includes(book.id))
      );
      setFinishedShelfBooks((prev) => {
        const existingIds = new Set(prev.map((b) => b.id));
        const uniqueNew = movedBooks.filter((b) => !existingIds.has(b.id));
        return [...prev, ...uniqueNew];
      });


    } catch (err) {
      console.error("❌ Error moving books:", err);
    } finally {
      // Clear selection
      setSelectedBooks([]);
    }
  };


  const handleDelete = () => {
    if (selectedBooks.length === 0) {
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('🗑️ Deleting books:', selectedBooks.join(', '), 'from User ID:', userId);
      
      const response = await fetch('http://localhost:5000/api/shelves/delete-books', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          bookIds: selectedBooks
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Delete successful:', data);
        // Refresh the whole page so frontend re-fetches state
        window.location.reload();
      } else {
        console.error('❌ Delete failed:', data);
      }
      
    } catch (err) {
      console.error('❌ Error deleting books:', err);
    } finally {
      setSelectedBooks([]);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Logo position="top" />
      <div className="shelf-page">
        <div className="shelf-controls">
          {isSelectMode && (
            <div className="edit-buttons">
              <div className="finished-button" onClick={handleFinished}>Finished</div>
              <div className="delete-button" onClick={handleDelete}>Delete</div>
            </div>
          )}
          <div className="select-button" onClick={handleSelectToggle}>
            {isSelectMode ? 'Done' : 'Select'}
          </div>
        </div>
        <div className="shelf-container">
          <div className="shelf-label">
            <div className="shelf-label-line" style={{ width: "6%" }} />
              To Read
            <div className="shelf-label-line" style={{ width: "100%" }} />
          </div>
          <div className="shelves-container">
            {toReadShelves.map((shelf, index) => (
              <div className="shelf" key={index}>
                {shelf.map((book) => (
                  <ShelfBook
                    key={book.id}
                    title={book.title}
                    coverURL={book.coverURL}
                    description={book.description}
                    status={book.status}
                    isSelectMode={isSelectMode}
                    isSelected={selectedBooks.includes(book.id)}
                    onSelect={() => handleBookSelect(book.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="shelf-container">
          <div className="shelf-label">
            <div className="shelf-label-line" style={{ width: "6%" }} />
              Finished
            <div className="shelf-label-line" style={{ width: "100%" }} />
          </div>
          <div className="shelves-container">
            {finishedShelves.map((shelf, index) => (
              <div className="shelf" key={index}>
                {shelf.map((book) => (
                  <ShelfBook
                    key={book.id}
                    title={book.title}
                    coverURL={book.coverURL}
                    description={book.description}
                    status={book.status}
                    isSelectMode={isSelectMode}
                    isSelected={selectedBooks.includes(book.id)}
                    onSelect={() => handleBookSelect(book.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <DeleteConfirmPopup
        isVisible={showDeleteConfirm}
        bookCount={selectedBooks.length}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <NavigationPane />
    </>
  );
}

export default ShelfPage;
