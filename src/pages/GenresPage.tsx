import { useState } from 'react';
import './GenresPage.css';
import Genre from '../components/Genre'; 
import Button from '../components/Button';   
import Logo from '../components/Logo';
import BackArrow from '../components/BackArrow';

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Horror",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Historical",
  "Adventure",
  "Biography / Memoir",
  "Self-Help",
  "Poetry",
  "Drama / Play",
  "Classics",
  "Young Adult (YA)",
  "Children’s",
  "Religion / Spirituality",
  "Philosophy",
  "Science / Technology",
  "Travel",
  "True Crime",
  "Essays"
];

function GenresPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleGenreClick = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <>
      <BackArrow />
      <Logo position="top" />
      <div className="genres-page">
        <h1>Genres</h1>
        <p>What genres of books are you interested in?</p>
        <div className="genres-list">
          {genres.map((genre) => (
            <Genre
              key={genre}
              name={genre}
              selected={selectedGenres.includes(genre)}
              onClick={() => handleGenreClick(genre)}
            />
          ))}
        </div>
        <Button
          text="CONTINUE"
          variant={selectedGenres.length > 0 ? "primary" : "invalid-primary"}
        />
      </div>
    </>
  );
}

export default GenresPage;