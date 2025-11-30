import { useNavigate } from "react-router-dom";
import './BackArrow.css';
import backArrow from '../assets/back_arrow.svg';

interface BackArrowProps {
  className?: string;
}

function BackArrow({ className }: BackArrowProps) {
  const navigate = useNavigate();

  return (
    <div 
      className={`back-arrow-container${className ? ' ' + className : ''}`}
      onClick={() => navigate(-1)}   // ✅ Go back in history
      style={{ cursor: "pointer" }}
    >
      <img src={backArrow} className="back-arrow" alt="Back arrow" />
    </div>
  );
}

export default BackArrow;
