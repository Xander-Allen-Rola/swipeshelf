import { AnimatePresence, motion } from "framer-motion";
import './SearchOptions.css';    
import Popup from "./Popup";
import axios from "axios";
import { useState } from "react";

interface SearchOptionsProps {
  id: number; // bookId
  title: string;
  coverURL: string;
  description: string;
}

function SearchOptions({ id, title, coverURL, description }: SearchOptionsProps) {
  const userId = Number(localStorage.getItem("userId") || 0);
  const [showShelfPopup, setShowShelfPopup] = useState(false);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);

  const handleAddToShelf = async () => {
    try {
        await axios.post("http://localhost:5000/api/shelves/add-to-to-read", {
          userId,
          book: {
            googleBooksId: String(id),
            title: title,
            coverUrl: coverURL,
            description: description,
          },
        });
        console.log(`✅ Book ${title} added to To Read shelf`);

        setShowShelfPopup(true);
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowShelfPopup(false);
        }, 3000);

      } catch (err) {
        console.error("❌ Failed to add book to To Read shelf:", err);
      }
  };

  const handleMarkAsFinished = async () => {
    try {
        await axios.post("http://localhost:5000/api/shelves/add-to-finished", {
          userId,
          book: {
            googleBooksId: String(id),
            title: title,
            coverUrl: coverURL,
            description: description,
          },
        });
        console.log(`✅ Book ${title} added to Finished shelf`);

        setShowFinishedPopup(true);
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowFinishedPopup(false);
        }, 3000);

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
        onClick={handleMarkAsFinished}>
          Mark as Finished
        </div>
        <div
          className="search-option-text"
          onClick={handleAddToShelf}
        >
          Add to Shelf
        </div>
        <div className="search-option-text">Recommend to Friends</div>
      </motion.div>
      <AnimatePresence>
      {showShelfPopup && (
        <Popup
          text={`${title} added to your To Read shelf!`}
        />
      )}
      {showFinishedPopup && (
        <Popup
          text={`${title} marked as Finished!`}
        />
      )}
      </AnimatePresence>
    </>
  );
}

export default SearchOptions;
