import './ShelfBook.css';

interface ShelfBookProps {
  title: string;
  coverURL: string;
  description: string;
  status?: string;
}

function ShelfBook({ title, coverURL, description, status }: ShelfBookProps) {
  return (
    <div className="shelf-book">
      <img src={coverURL} alt={title} className="cover" />
    </div>
  );
}

export default ShelfBook;
