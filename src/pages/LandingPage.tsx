import './LandingPage.css'
import swipeShelfLogo from '../assets/SwipeShelf.png'
import Button from '../components/Button'

function LandingPage() {
  return (
    <>
        <div className="container">
            <img src={swipeShelfLogo} className="logo" alt="SwipeShelf logo" />
            <div className="buttons">
              <Button text="SIGN IN" />
              <Button text="REGISTER" />
              <Button text="CONTINUE AS GUEST" />
            </div>
        </div>
    </>
  )
}

export default LandingPage;