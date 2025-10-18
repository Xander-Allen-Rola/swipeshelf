import React from 'react';
import './ConfirmPopup.css';

interface DeleteConfirmPopupProps {
  isVisible: boolean;
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmPopup = ({
  isVisible,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: DeleteConfirmPopupProps) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="delete-backdrop" onClick={onCancel} />
      <div className="delete-popup">
        <h3>{title}</h3>
        <p>{content}</p>
        <div className="delete-popup-buttons">
          <button className="cancel-button" onClick={onCancel}>{cancelText}</button>
          <button className="confirm-delete-button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmPopup;
