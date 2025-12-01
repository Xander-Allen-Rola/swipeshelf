import { AnimatePresence, motion } from "framer-motion";
import './SearchOptions.css';    
import Popup from "./Popup";
import axios from "axios";
import { useState } from "react";

interface SearchOptionsProps {
  googleBooksId: string; // bookId
  title: string;
  coverURL: string;
  description: string;
}

function SearchOptions({ googleBooksId, title, coverURL, description }: SearchOptionsProps) {
  const userId = Number(localStorage.getItem("userId") || 0);
  const token = localStorage.getItem("token"); // ✅ get JWT token
  const [showShelfPopup, setShowShelfPopup] = useState(false);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);

  const handleAddToShelf = async () => {
    if (!token) {
      console.error("❌ No auth token found");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/shelves/add-to-to-read`,
        {
          userId,
          book: {
            googleBooksId,
            title,
            coverUrl: coverURL,
            description,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`✅ Book ${googleBooksId} ${title} added to To Read shelf`);
      setShowShelfPopup(true);
      setTimeout(() => setShowShelfPopup(false), 3000);

    } catch (err) {
      console.error("❌ Failed to add book to To Read shelf:", err);
    }
  };

  const handleMarkAsFinished = async () => {
    if (!token) {
      console.error("❌ No auth token found");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/shelves/add-to-finished`,
        {
          userId,
          book: {
            googleBooksId,
            title,
            coverUrl: coverURL,
            description,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`✅ Book ${googleBooksId} (${title}) added to Finished shelf`);
      setShowFinishedPopup(true);
      setTimeout(() => setShowFinishedPopup(false), 3000);

    } catch (err) {
      console.error("❌ Failed to add book to Finished shelf:", err);
    }
  };

  return (
    <>
      <motion.div
        className="search-options-container"
        initial={{ opacity: 0, y: -10, x: -5 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -10, x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="search-option-text"
          onClick={handleAddToShelf}
        >
          Add to Shelf
        </div>
        <div 
          className="search-option-text"
          onClick={handleMarkAsFinished}
        >Mark as Finished</div>
        {/*<div className="search-option-text">Recommend to Friends</div>*/}
      </motion.div>
      <AnimatePresence>
      {showShelfPopup && (
        <Popup
          text={`${title} added to your To Read shelf!`}
        />
      )}
      {showFinishedPopup && <Popup text={`${title} added to your Finished shelf!`} />}
      </AnimatePresence>
    </>
  );
}

export default SearchOptions;
