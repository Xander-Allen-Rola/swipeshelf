import React, { useState, useRef, useEffect } from 'react';
import './BookCard.css';
import releaseDate from '../assets/release_date.png';
import bookAuthor from '../assets/author.png';
import likeIcon from '../assets/like.png';
import dislikeIcon from '../assets/dislike.png';
import undoIcon from '../assets/undo.png';

const BookCard = ({ title, author, release, description, genres = [], image, onSwipe, onSwipedComplete, onUndo, style = {} }) => {
  const [flipped, setFlipped] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [likeOpacity, setLikeOpacity] = useState(0);
  const [dislikeOpacity, setDislikeOpacity] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);

  // Trigger fade-in on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    // reset swipe state on mount or key change
    setPosition({ x: 0, y: 0 });
    setSwiped(false);
    setRemoved(false);
    setLikeOpacity(0);
    setDislikeOpacity(0);
  }, [title]); // or use `key` as dependency

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    setPosition({ x: dx, y: dy });

    if (dx > 0) {
      setLikeOpacity(Math.min(dx / 150, 1));
      setDislikeOpacity(0);
    } else if (dx < 0) {
      setDislikeOpacity(Math.min(-dx / 150, 1));
      setLikeOpacity(0);
    } else {
      setLikeOpacity(0);
      setDislikeOpacity(0);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    setLikeOpacity(0);
    setDislikeOpacity(0);

    if (position.x > 100) {
      setPosition({ x: 1000, y: position.y });
      setSwiped(true);
      onSwipe && onSwipe('right', title);
    } else if (position.x < -100) {
      setPosition({ x: -1000, y: position.y });
      setSwiped(true);
      onSwipe && onSwipe('left', title);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    setPosition({ x: dx, y: dy });

    if (dx > 0) {
      setLikeOpacity(Math.min(dx / 150, 1));
      setDislikeOpacity(0);
    } else if (dx < 0) {
      setDislikeOpacity(Math.min(-dx / 150, 1));
      setLikeOpacity(0);
    } else {
      setLikeOpacity(0);
      setDislikeOpacity(0);
    }
  };

  useEffect(() => {
    if (swiped) {
      const timer = setTimeout(() => {
        setRemoved(true);
        onSwipedComplete && onSwipedComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [swiped]);

  if (removed) return null;

  const handleMouseUpLeft = () => {
    setPosition({ x: -1000, y: 0 });
    setSwiped(true);
    onSwipe && onSwipe('left', title);
  };

  const handleMouseUpRight = () => {
    setPosition({ x: 1000, y: 0 });
    setSwiped(true);
    onSwipe && onSwipe('right', title);
  };

  return (
    <div
      className={`flip-card${flipped ? ' flipped' : ''}`}
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x / 20}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        opacity: swiped ? 0 : fadeIn ? 1 : 0,
      }}
      onClick={() => setFlipped(f => !f)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={(e) => {
        setIsDragging(true);
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div className="like-overlay" style={{ opacity: likeOpacity }}>LIKE</div>
      <div className="dislike-overlay" style={{ opacity: dislikeOpacity }}>NOPE</div>

      <div className="flip-card-front">
        {image && <div className="card-image" style={{ backgroundImage: `url(${image})` }} />}
        <div className="card-gradient" />
        <div className="card-content regular">
          <h2 className="book-title">{title}</h2>
          <div className="sub-container">
            <img src={bookAuthor} alt="Author" className="sub-icon" />
            <p className="book-author">{author}</p>
          </div>
          <div className="sub-container">
            <img src={releaseDate} alt="Release Date" className="sub-icon" />
            <p className="book-release">{release}</p>
          </div>
          <div className="card-buttons">
            <img src={dislikeIcon} alt="Dislike" className="dislike-button" onClick={handleMouseUpLeft} />
            <img src={undoIcon} alt="Undo" className="undo-button" onClick={onUndo} />
            <img src={likeIcon} alt="Like" className="like-button" onClick={handleMouseUpRight} />
          </div>
        </div>
      </div>
      <div className="flip-card-back">
        <div className="card-content flipped">
          <h2>{title}</h2>
          <div className="book-genres">
            {genres.map((genre, idx) => (
              <span className="book-genre" key={idx}>{genre}</span>
            ))}
          </div>
          <p className="book-description">{description}</p>
          <div className="book-review">
            <div className="horizontal-line" style={{ width: '10%' }} />Review<div className="horizontal-line" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
