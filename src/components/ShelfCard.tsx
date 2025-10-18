import React, { useState, useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import './ShelfCard.css';
import ShelfOptions from './ShelfOptions';
import SearchOptions from './SearchOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import Popup from './Popup';

interface ShelfCardProps {
  id: number;
  googleBooksId: string;
  title: string;
  coverURL: string;
  description: string;
  status?: string;
  variation: "shelf" | "search";
  onClose: () => void;
}

const ShelfCard = ({ id, googleBooksId, title, coverURL, variation, description, onClose }: ShelfCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // Check if the book is already favorited
    const checkFavoriteStatus = async () => {
      try {
        const params = new URLSearchParams({
          userId: String(localStorage.getItem("userId") || 0),
          googleBooksId
        });
        const response = await fetch(`http://localhost:5000/api/shelves/is-favorited?${params.toString()}`);
        const data = await response.json();
        if (response.ok) setIsFavorited(data.isFavorited);
      } catch (err) {
        console.error("❌ Error checking favorite status:", err);
      }
    };
    if (variation === "shelf") checkFavoriteStatus();
  }, [googleBooksId, variation]);

  const handleClose = () => {
    setIsVisible(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => onClose(), 300);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = Number(localStorage.getItem("userId") || 0);

    try {
      if (isFavorited) {
        const response = await fetch("http://localhost:5000/api/shelves/remove-from-favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, googleBooksId }),
        });
        if (response.ok) {
          setIsFavorited(false);
          setShowFavoritesPopup(true);
        }
      } else {
        const response = await fetch("http://localhost:5000/api/shelves/add-to-favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            book: { googleBooksId, title, coverUrl: coverURL ?? null, description: description ?? null }
          }),
        });
        if (response.ok) {
          setIsFavorited(true);
          setShowFavoritesPopup(true);
        }
      }
    } catch (err) {
      console.error("❌ Error toggling favorite:", err);
    }
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(true);
  };

  return (
    <>
    <div className="shelf-card-container">
      <div className={`shelf-backdrop ${isVisible ? 'visible' : ''}`}
          onClick={handleClose} />
      <div
        className={`shelf-flip-card${flipped ? ' flipped' : ''} ${isVisible ? 'visible' : ''}`}
        onClick={() => { setFlipped(f => !f); setShowOptions(false); }}
      >
        <div className="shelf-flip-card-front">
          {coverURL && <div className="shelf-card-image" style={{ backgroundImage: `url(${coverURL})` }} />}
          <div className="shelf-card-content regular">
          </div>
        </div>
        <div className="shelf-flip-card-back">
          <div className="shelf-card-content flipped">
            {variation === "shelf" ? (
              <FontAwesomeIcon 
                icon={isFavorited ? solidStar : regularStar}
                style={{ color: "#556B2F", cursor: "pointer", marginBottom: "10px" }}
                onClick={handleToggleFavorite}
                className="favorites-star"
              />
            ) : (
              <div className="shelf-options" onClick={handleOptionsClick}>
                <div className="option-line" />
                <div className="option-line" />
                <div className="option-line" />
              </div>
            )}           
            <h2
            style={{ textAlign: "center" }}>{title}</h2>
            <p className="shelf-book-description">{description}</p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showOptions &&
          (variation === "shelf" ? (
            <ShelfOptions 
            id={id}
            googleBooksId={googleBooksId}
            title={title}
            coverURL={coverURL}
            description={description}
            key="shelf-options" 
            onClose={() => setShowOptions(false)} />
          ) : (
            <SearchOptions 
              googleBooksId={googleBooksId}
              title={title}
              coverURL={coverURL}
              description={description}
              key="search-options" />
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {showFavoritesPopup && (
          <Popup 
            text={isFavorited ? `${title} added to your Favorites shelf!` : `${title} removed from your Favorites shelf!`} 
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default ShelfCard;
