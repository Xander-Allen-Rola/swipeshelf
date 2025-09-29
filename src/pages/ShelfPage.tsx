import './ShelfPage.css';
import Logo from "../components/Logo";
import NavigationPane from '../components/NavigationPane';
import ShelfBook from '../components/ShelfBook';

const shelfBooks = [
  {
    id: 1,
    shelfId: 1,
    bookId: 101,
    status: "reading",
    addedAt: new Date("2025-01-05T10:15:00Z"),
    title: "The Catcher in the Rye",
    coverURL: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
    description: "A novel by J.D. Salinger about teenage alienation and rebellion."
  },
  {
    id: 2,
    shelfId: 1,
    bookId: 102,
    status: "to-read",
    addedAt: new Date("2025-01-10T08:30:00Z"),
    title: "1984",
    coverURL: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    description: "George Orwell's dystopian classic exploring totalitarianism and surveillance."
  },
  {
    id: 3,
    shelfId: 2,
    bookId: 103,
    status: "completed",
    addedAt: new Date("2025-02-02T14:45:00Z"),
    title: "Pride and Prejudice",
    coverURL: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
    description: "Jane Austen's romantic novel about manners, marriage, and social standing."
  },
  {
    id: 4,
    shelfId: 2,
    bookId: 104,
    status: "reading",
    addedAt: new Date("2025-03-12T19:20:00Z"),
    title: "The Hobbit",
    coverURL: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    description: "J.R.R. Tolkien's fantasy adventure following Bilbo Baggins on his quest."
  },
  {
    id: 5,
    shelfId: 3,
    bookId: 105,
    status: "to-read",
    addedAt: new Date("2025-04-01T11:00:00Z"),
    title: "The Great Gatsby",
    coverURL: "https://covers.openlibrary.org/b/id/6519016-L.jpg",
    description: "F. Scott Fitzgerald’s novel about wealth, love, and the American Dream."
  },
  
];

// ✅ helper: split into chunks of 4
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function ShelfPage() {
  const shelves = chunkArray(shelfBooks, 4);

  return (
    <>
      <Logo position="top" />
      <div className="shelf-label">
        <div className="shelf-label-line" style={{ width: "6%" }} />
          To Read
        <div className="shelf-label-line" style={{ width: "100%" }} />
      </div>
      <div className="shelves-container">
        {shelves.map((shelf, index) => (
          <div className="shelf" key={index}>
            {shelf.map((book) => (
              <ShelfBook
                key={book.id}
                title={book.title}
                coverURL={book.coverURL}
                description={book.description}
                status={book.status}
              />
            ))}
          </div>
        ))}
      </div>
      <NavigationPane />
    </>
  );
}

export default ShelfPage;
