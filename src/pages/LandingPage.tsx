import { useNavigate } from "react-router-dom";
import './LandingPage.css'
import swipeShelfLogo from '../assets/SwipeShelf.png'
import Button from '../components/Button'

function LandingPage() {
  const navigate = useNavigate(); // hook for navigation

  return (
    <div className="landing-page-container">
      <img src={swipeShelfLogo} className="landing-page-logo" alt="SwipeShelf logo" />
      <div className="landing-page-buttons">
        {/* Navigate to SignIn page */}
        <Button text="SIGN IN" variant="secondary" onClick={() => navigate("/signin")} width="100%" height="48px" padding="12px" />

        {/* Navigate to Register page */}
        <Button text="REGISTER" variant="secondary" onClick={() => navigate("/registration")} width="100%" height="48px" padding="12px" />

        {/* Navigate to Guest flow
        <Button text="CONTINUE AS GUEST" variant="secondary" onClick={() => navigate("/recommendations")} />*/}
      </div>
    </div>
  )
}

export default LandingPage;
