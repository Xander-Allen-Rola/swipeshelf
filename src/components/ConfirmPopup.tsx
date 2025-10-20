import React from 'react';
import './ConfirmPopup.css';
import { AnimatePresence, motion } from 'framer-motion';

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

  return (
    <AnimatePresence>
        {isVisible && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
          className="delete-backdrop" 
          onClick={onCancel} />
          <motion.div 
            style={{
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
              position: 'fixed',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.4,
              scale: { type: 'spring', visualDuration: 0.4, bounce: 0 },
            }}
            className="delete-popup">
            <h3>{title}</h3>
            <p>{content}</p>
            <div className="delete-popup-buttons">
              <button className="confirm-delete-button" onClick={onConfirm}>{confirmText}</button>
              <button className="cancel-button" onClick={onCancel}>{cancelText}</button>
            </div>
          </motion.div>
      </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmPopup;
