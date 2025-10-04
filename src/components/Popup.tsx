import { motion } from 'motion/react';
import './Popup.css'

interface PopupProps {
    text: string;
}

function Popup({ text }: PopupProps) {
    return (
        <motion.div
        initial={{ opacity: 0, y: -10, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -10, x: "-50%" }}
        transition={{ duration: 0.2 }} 
        className="popup">{text}</motion.div>
    );
}

export default Popup;
