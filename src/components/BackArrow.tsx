import './BackArrow.css'
import backArrow from '../assets/back_arrow.svg'

function BackArrow() {
  return (
    <img src={backArrow} className="back-arrow" alt="Back arrow" />
  )
}

export default BackArrow;