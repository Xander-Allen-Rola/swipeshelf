import './SignIn.css'
import swipeShelfLogo from '../assets/SwipeShelf.png'
import Button from '../components/Button'

function SignIn() {
  return (
    <>
        <div className="sign-in-container">
            <img src={swipeShelfLogo} className="logo" alt="SwipeShelf logo" />
            <Button text="SIGN IN" />
        </div>
    </>
  )
}

export default SignIn;