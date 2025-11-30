import './ShelfBook.css';
import ShelfCard from '../components/ShelfCard';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';

interface ShelfBookProps {
  id: number;
  googleBooksId: string;
  title: string;
  coverURL: string;
  description: string;
  status?: string;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

function ShelfBook({ id, googleBooksId, title, coverURL, description, status, isSelectMode = false, isSelected = false, onSelect }: ShelfBookProps) {
  const [showCard, setShowCard] = useState(false);
  const handleClick = () => {
    if (isSelectMode && onSelect) {
      onSelect();
    } else {
      setShowCard(true);
    }
  };

  return (
    <>
      <div 
        className={`shelf-book ${isSelectMode ? 'select-mode' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}>
        {isSelectMode && (
          <AnimatePresence>
            {isSelected && (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="selection-indicator"
              >
                <FontAwesomeIcon icon={faCheck as import('@fortawesome/fontawesome-svg-core').IconProp} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <img src={coverURL} alt={title} className="cover" />
      </div>

      {showCard && createPortal(
        <ShelfCard
          id={id}
          title={title}
          coverURL={coverURL}
          description={description}
          status={status}
          googleBooksId={googleBooksId}
          variation="shelf" 
          onClose={() => setShowCard(false)}
        />,
        document.body
      )}
    </>
  );
}

export default ShelfBook;
