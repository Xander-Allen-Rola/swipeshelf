import { motion } from "framer-motion";
import './SearchOptions.css';      

function SearchOptions() {
  return (
    <>
      <motion.div
        className="search-options-container"
        initial={{ opacity: 0, y: -10, x: -5 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -10, x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="search-option-text">
          Mark as Finished
        </div>
        <div className="search-option-text">Recommend to Friends</div>
        <div
          className="search-option-text"
        >
          Add to Shelf
        </div>
      </motion.div>
    </>
  );
}

export default SearchOptions;
