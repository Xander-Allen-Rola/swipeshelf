import './ShelfBook.css';
import ShelfCard from '../components/ShelfCard';
import { useState } from 'react';

interface ShelfBookProps {
  title: string;
  coverURL: string;
  description: string;
  status?: string;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

function ShelfBook({ title, coverURL, description, status, isSelectMode = false, isSelected = false, onSelect }: ShelfBookProps) {
  const [showCard, setShowCard] = useState(false);
  const handleClick = () => {
    if (isSelectMode && onSelect) {
      onSelect();
    } else {
      setShowCard(true); // Changed from setModalOpen to setShowCard
    }
  };

  return (
    <>
      <div 
        className={`shelf-book ${isSelectMode ? 'select-mode' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}>
        {isSelectMode && (
          <div className="selection-indicator">
            {isSelected ? '✓' : ''}
          </div>
        )}
        <img src={coverURL} alt={title} className="cover" />
      </div>

        {showCard && (
          <ShelfCard
            title={title}
            coverURL={coverURL}
            description={description}
            status={status}
            onClose={() => setShowCard(false)}
          />
        )}
    </>
  );
}

export default ShelfBook;
