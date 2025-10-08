import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import './ShelfCard.css';
import './ShelfOptions';
import ShelfOptions from './ShelfOptions';
import SearchOptions from './SearchOptions'; 

interface ShelfCardProps {
  id: number;
  googleBooksId: string;
  title: string;
  coverURL: string;
  description: string;
  status?: string;
  variation: "shelf" | "search"; // 👈 new prop
  onClose: () => void;
}

const ShelfCard = ({ id, googleBooksId, title, coverURL, variation, description, onClose }: ShelfCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // Fade in on mount
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleClose = () => {
    // Start fade out animation
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      onClose();
    }, 300); // Match this with your CSS transition duration
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showOptions) {
      setShowOptions(false);
    } else {
      setShowOptions(true);
    }
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
            <div className="shelf-options" onClick={handleOptionsClick} >
              <div className="option-line" />
              <div className="option-line" />
              <div className="option-line" />
            </div>            
            <h2>{title}</h2>
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
              id={id}
              title={title}
              coverURL={coverURL}
              description={description}
              key="search-options" />
          ))}
      </AnimatePresence>
    </div>
    </>
  );
};

export default ShelfCard;
