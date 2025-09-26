import './RecommendationPage.css';
import Logo from '../components/Logo';
import NavigationPane from '../components/NavigationPane';
import BookCard from '../components/BookCard';
import { useState, useEffect } from 'react';


const books = [
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    release: "1953",
    description: `Fahrenheit 451 is a dystopian novel by Ray Bradbury about a future society where books are banned and 'firemen' burn any that are found. The story follows Guy Montag, a fireman who becomes disillusioned with his job after a series of events—including the death of his neighbor Clarisse and witnessing a woman die with her books—leading him to secretly read books and question society's censorship and focus on superficial entertainment. Montag escapes the mechanical hound sent to capture him and flees to a community of outcasts who have memorized books to preserve them, all while the city he left is destroyed by war.`,
    image: "http://books.google.com/books/content?id=KVGd-NabpW0C&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    genres: ['Dystopian', 'Sci-Fi', 'Classic', 'Literature'],
  },
  {
    title: "1984",
    author: "George Orwell",
    release: "1949",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    image: "https://covers.openlibrary.org/b/id/153541-L.jpg",
    genres: ['Dystopian', 'Political Fiction', 'Classic'],
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    release: "1953",
    description: `Fahrenheit 451 is a dystopian novel by Ray Bradbury about a future society where books are banned and 'firemen' burn any that are found. The story follows Guy Montag, a fireman who becomes disillusioned with his job after a series of events—including the death of his neighbor Clarisse and witnessing a woman die with her books—leading him to secretly read books and question society's censorship and focus on superficial entertainment. Montag escapes the mechanical hound sent to capture him and flees to a community of outcasts who have memorized books to preserve them, all while the city he left is destroyed by war.`,
    image: "http://books.google.com/books/content?id=KVGd-NabpW0C&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    genres: ['Dystopian', 'Sci-Fi', 'Classic', 'Literature'],
  },
  {
    title: "1984",
    author: "George Orwell",
    release: "1949",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    image: "https://covers.openlibrary.org/b/id/153541-L.jpg",
    genres: ['Dystopian', 'Political Fiction', 'Classic'],
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    release: "1953",
    description: `Fahrenheit 451 is a dystopian novel by Ray Bradbury about a future society where books are banned and 'firemen' burn any that are found. The story follows Guy Montag, a fireman who becomes disillusioned with his job after a series of events—including the death of his neighbor Clarisse and witnessing a woman die with her books—leading him to secretly read books and question society's censorship and focus on superficial entertainment. Montag escapes the mechanical hound sent to capture him and flees to a community of outcasts who have memorized books to preserve them, all while the city he left is destroyed by war.`,
    image: "http://books.google.com/books/content?id=KVGd-NabpW0C&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    genres: ['Dystopian', 'Sci-Fi', 'Classic', 'Literature'],
  },
  {
    title: "1984",
    author: "George Orwell",
    release: "1949",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    image: "https://covers.openlibrary.org/b/id/153541-L.jpg",
    genres: ['Dystopian', 'Political Fiction', 'Classic'],
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    release: "1953",
    description: `Fahrenheit 451 is a dystopian novel by Ray Bradbury about a future society where books are banned and 'firemen' burn any that are found. The story follows Guy Montag, a fireman who becomes disillusioned with his job after a series of events—including the death of his neighbor Clarisse and witnessing a woman die with her books—leading him to secretly read books and question society's censorship and focus on superficial entertainment. Montag escapes the mechanical hound sent to capture him and flees to a community of outcasts who have memorized books to preserve them, all while the city he left is destroyed by war.`,
    image: "http://books.google.com/books/content?id=KVGd-NabpW0C&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    genres: ['Dystopian', 'Sci-Fi', 'Classic', 'Literature'],
  },
  {
    title: "1984",
    author: "George Orwell",
    release: "1949",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    image: "https://covers.openlibrary.org/b/id/153541-L.jpg",
    genres: ['Dystopian', 'Political Fiction', 'Classic'],
  },
  // add more books here
];

function RecommendationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
const handleSwipe = (dir: string, title: string) => {
  console.log(`Swiped ${dir} on ${title}`);
};
  return (
    <>
      <Logo position="top" />
      <div className="recommendation-page">
          {currentIndex < books.length && (
            <BookCard
              key={books[currentIndex].title + currentIndex}
              title={books[currentIndex].title}
              author={books[currentIndex].author}
              release={books[currentIndex].release}
              description={books[currentIndex].description}
              image={books[currentIndex].image}
              genres={books[currentIndex].genres}
              onSwipe={handleSwipe} // optional logging
              onSwipedComplete={() => setCurrentIndex(prev => prev + 1)} // increment AFTER animation
              style={{ zIndex: 1 }}
            />
          )}
        <NavigationPane />
      </div>
    </>
  );
}

export default RecommendationPage;
