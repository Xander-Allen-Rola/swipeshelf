import './Genre.css';

interface GenreProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

function Genre({ name, selected, onClick }: GenreProps) {
  return (
    <span
      className={`genre-name${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {name}
    </span>
  );
}

export default Genre;