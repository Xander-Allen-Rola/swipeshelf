import { motion } from "framer-motion";
import './ShelfOptions.css';
import DeleteConfirmPopup from './ConfirmPopup';
import { useState } from "react";

interface ShelfOptionsProps {
  id: number; // shelfBookId
  onClose?: () => void;
}

function ShelfOptions({ id, onClose }: ShelfOptionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ Move to Finished
  const handleFinished = async () => {
    try {
      console.log("📦 Moving to Finished...");

      const response = await fetch("http://localhost:5000/api/shelves/move-book", {
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
      window.location.reload();
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

      const response = await fetch("http://localhost:5000/api/shelves/delete-books", {
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
        window.location.reload();
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
        <div className="shelf-option-text">Recommend to Friends</div>
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
    </>
  );
}

export default ShelfOptions;
