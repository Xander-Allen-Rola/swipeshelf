import { useNavigate } from "react-router-dom";
import './BackArrow.css';
import backArrow from '../assets/back_arrow.svg';

function BackArrow() {
  const navigate = useNavigate();

  return (
    <div 
      className="back-arrow-container" 
      onClick={() => navigate("/")}
      style={{ cursor: "pointer" }}
    >
      <img src={backArrow} className="back-arrow" alt="Back arrow" />
    </div>
  );
}

export default BackArrow;
