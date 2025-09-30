import React, { useState, useRef, useEffect } from 'react';
import './ShelfCard.css';

interface ShelfCardProps {
  title: string;
  coverURL: string;
  description: string;
  status?: string;
  onClose: () => void;
}

const ShelfCard = ({ title, coverURL, description, onClose }: ShelfCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in on mount
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    // Start fade out animation
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300); // Match this with your CSS transition duration
  };

  return (
    <>
    <div className={`shelf-backdrop ${isVisible ? 'visible' : ''}`}
        onClick={handleClose} />
    <div
      className={`shelf-flip-card${flipped ? ' flipped' : ''} ${isVisible ? 'visible' : ''}`}
      onClick={() => setFlipped(f => !f)}
    >
      <div className="shelf-flip-card-front">
        {coverURL && <div className="shelf-card-image" style={{ backgroundImage: `url(${coverURL})` }} />}
        <div className="shelf-card-content regular">
        </div>
      </div>
      <div className="shelf-flip-card-back">
        <div className="shelf-card-content flipped">
          <h2>{title}</h2>
          <p className="shelf-book-description">{description}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default ShelfCard;
