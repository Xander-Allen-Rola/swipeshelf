import './Genre.css';

function Genre({ name, selected, onClick }) {
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