import { AnimatePresence, motion } from "framer-motion";
import './ShelfOptions.css';
import DeleteConfirmPopup from './ConfirmPopup';
import { useState } from "react";
import Popup from "./Popup";

interface ShelfOptionsProps {
  id: number; // shelfBookId
  googleBooksId: string;
  title: string;
  coverURL?: string;
  description?: string;
  onClose?: () => void;
}

function ShelfOptions({ id, googleBooksId, title, coverURL, description }: ShelfOptionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // ✅ Move to Finished
  const handleFinished = async () => {
    try {
      console.log("📦 Moving to Finished...");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shelves/move-book`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("userId") || 0),
          shelfBookId: id,
          targetShelfName: "Finished",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Move success:", data);
      } else {
        console.error("❌ Move failed:", data);
      }
    } catch (err) {
      console.error("❌ Error moving book:", err);
    } finally {
      setShowFinishedPopup(true);
    }
  };

  // ✅ Open confirm dialog
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // ✅ Confirm delete
  const confirmDelete = async () => {
    try {
      const userId = Number(localStorage.getItem("userId") || 0);
      console.log("🗑️ Deleting book:", id, "from User ID:", userId);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shelves/delete-books`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bookIds: [id], // single book
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Delete successful:", data);
        setShowDeletePopup(true);
      } else {
        console.error("❌ Delete failed:", data);
      }
    } catch (err) {
      console.error("❌ Error deleting book:", err);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // ✅ Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // ✅ Add to Favorites
  const handleAddToFavorites = async () => {
    try {
      console.log("⭐ Adding to favorites...");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/shelves/add-to-favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("userId") || 0),
          book: {
            googleBooksId,
            title,
            coverUrl: coverURL ?? null,
            description: description ?? null
          }
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Added to favorites:", data);
        // Optional: show toast instead of reload
        setShowFavoritesPopup(true);
      } else {
        console.error("❌ Failed to add to favorites:", data);
      }
    } catch (err) {
      console.error("❌ Error adding to favorites:", err);
    }
  };



  return (
    <>
      <motion.div
        className="shelf-options-container"
        initial={{ opacity: 0, y: -10, x: -5 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -10, x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="shelf-option-text" onClick={handleFinished}>
          Mark as Finished
        </div>
        <div className="shelf-option-text" onClick={handleAddToFavorites}>
          Add to Favorites
        </div>
        {/*<div className="shelf-option-text">Recommend to Friends</div>*/}
        <div
          className="shelf-option-text"
          style={{ color: "red" }}
          onClick={handleDelete}
        >
          Delete
        </div>
      </motion.div>

      {/* ✅ Show confirm popup when deleting */}
      {showDeleteConfirm && (
        <DeleteConfirmPopup
          isVisible={showDeleteConfirm}
          title="Delete Book"
          content="Are you sure you want to delete this book?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <AnimatePresence>
      {showFavoritesPopup && (
        <Popup
          text={`${title} added to your Favorites shelf!`}
        />
      )}
      {showFinishedPopup && (
        <Popup text={`${title} added to your Finished shelf!`} />
      )}
      {showDeletePopup && (
        <Popup text={`${title} deleted from your shelf!`} />
      )}
      </AnimatePresence>
    </>
  );
}

export default ShelfOptions;
