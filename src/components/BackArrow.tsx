import './BackArrow.css'
import backArrow from '../assets/back_arrow.svg'

function BackArrow() {
  return (
    <div className="back-arrow-container">
      <img src={backArrow} className="back-arrow" alt="Back arrow" />
    </div>
  )
}

export default BackArrow;