import { useState, useEffect } from 'react';
import './GenresPage.css';
import Genre from '../components/Genre'; 
import Button from '../components/Button';   
import Logo from '../components/Logo';
import BackArrow from '../components/BackArrow';
import { useNavigate } from "react-router-dom";
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from "../contexts/AuthContext"; // 👈 import auth context

type GenreType = {
  id: number;
  name: string;
};

function GenresPage() {
  // ...existing code...
  const navigate = useNavigate();
  const { setUser } = useAuth(); // 👈 grab setUser from context
  // ...existing code...

  const [genres, setGenres] = useState<GenreType[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch genres from backend
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/genres`);
        const data = await res.json();
        setGenres(data); // API should return [{ id: 1, name: "Fiction" }, ...]
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (id: number) => {
    setSelectedGenres(prev =>
      prev.includes(id)
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
  };

  const handleContinue = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("❌ No userId found.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user-genres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: Number(userId), genreIds: selectedGenres }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to save user genres: ${text}`);
      }

      console.log("✅ Genres saved successfully");

      // Keep the user logged in so protected routes (like /search) work.
      const token = localStorage.getItem("token");
      if (token) {
        setUser({ id: userId, token });
      }

      navigate("/search", { replace: true, state: { fromGenres: true } });
    } catch (err) {
      console.error("❌ Error saving genres:", err);
    }

    console.log("📚 Selected:", selectedGenres);
  };

  return (
    <>
      <LoadingOverlay show={loading} text="Retrieving..." />
      <BackArrow />
      <Logo position="top" />
      <div className="genres-page">
        <h1>Genres</h1>
        <p>What genres of books are you interested in?</p>
        <p>Please select at least 5 genres.</p>
        <div className="genres-list">
          {genres.map((genre) => (
            <Genre
              key={genre.id}
              name={genre.name}
              selected={selectedGenres.includes(genre.id)}
              onClick={() => handleGenreClick(genre.id)}
            />
          ))}
        </div>
        <Button
          text="CONTINUE"
          variant={selectedGenres.length > 4 ? "primary" : "invalid-primary"}
          disabled={selectedGenres.length <= 4}
          onClick={handleContinue}
          width="100%"
          height="48px"
          padding="12px"
        />
      </div>
    </>
  );
}

export default GenresPage;
