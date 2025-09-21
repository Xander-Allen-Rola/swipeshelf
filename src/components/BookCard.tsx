import React, { useState } from 'react';
import './BookCard.css';
import releaseDate from '../assets/release_date.png';
import bookAuthor from '../assets/author.png';
import likeIcon from '../assets/like.png';
import dislikeIcon from '../assets/dislike.png';
import undoIcon from '../assets/undo.png';

const BookCard = ({ title, author, release, description, genres = [] }) => {
  const [flipped, setFlipped] = useState(false);

  return (
      <div className={`flip-card${flipped ? ' flipped' : ''}`}  onClick={() => setFlipped(f => !f)}>
        <div className="flip-card-front">
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
                <img src={dislikeIcon} alt="Dislike" className="dislike-button" />
                <img src={undoIcon} alt="Undo" className="undo-button" />
                <img src={likeIcon} alt="Like" className="like-button" />
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