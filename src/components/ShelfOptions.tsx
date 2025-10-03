import { motion } from "framer-motion";
import './ShelfOptions.css';

interface ShelfOptionsProps {
  onClose?: () => void;
}

function ShelfOptions({ onClose }: ShelfOptionsProps) {
  return (
    <motion.div
      className="shelf-options-container"
      initial={{ opacity: 0, y: -10, x: -5 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -10, x: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="shelf-option-text">Mark as Finished</div>
      <div className="shelf-option-text">Recommend to Friends</div>
      <div className="shelf-option-text" style={{ color: 'red' }}>Delete</div>
    </motion.div>
  );
}

export default ShelfOptions;
