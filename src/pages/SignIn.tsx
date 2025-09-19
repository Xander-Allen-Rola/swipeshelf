import './SignIn.css'
import swipeShelfLogo from '../assets/SwipeShelf.png'
import Button from '../components/Button'

function SignIn() {
  return (
    <>
        <div className="sign-in-container">
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

export default SignIn;