import './ShelfBook.css';
import ShelfCard from '../components/ShelfCard';
import { useState } from 'react';

interface ShelfBookProps {
  title: string;
  coverURL: string;
  description: string;
  status?: string;
}

function ShelfBook({ title, coverURL, description, status }: ShelfBookProps) {
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <div className="shelf-book"
        onClick={() => setShowCard(true)}>
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
