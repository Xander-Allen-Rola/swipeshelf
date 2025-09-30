import React from 'react';
import './DeleteConfirmPopup.css';

interface DeleteConfirmPopupProps {
  isVisible: boolean;
  bookCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmPopup = ({ isVisible, bookCount, onConfirm, onCancel }: DeleteConfirmPopupProps) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="delete-backdrop" onClick={onCancel} />
      <div className="delete-popup">
        <h3>Delete Books</h3>
        <p>
          Are you sure you want to delete {bookCount === 1 ? 'this book' : `these ${bookCount} books`}?
        </p>
        <div className="delete-popup-buttons">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-delete-button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmPopup;