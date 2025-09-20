import './SignIn.css'
import swipeShelfLogo from '../assets/SwipeShelf.png'
import Button from '../components/Button'
import BackArrow from '../components/BackArrow'

function SignIn() {
  return (
    <>
      <BackArrow className="back-arrow" />
        <div className="container">
          <h1>REGISTRATION</h1>
          <div className="personal-info">
            <div className="name-container">
              <input type="firstName" placeholder="First Name" style={{ width: '100%' }} />
              <input type="lastName" placeholder="Last Name" style={{ width: '80%' }} />
              <input type="suffix" placeholder="Suffix" style={{ width: '25%' }} />
            </div>
            <div className="date-container">
              <input
                type="text"
                maxLength={4}
                placeholder="YYYY"
                className="date-input"
                inputMode="numeric"
                pattern="\d*"
              />
              <span className="date-separator">/</span>
              <input
                type="text"
                maxLength={2}
                placeholder="MM"
                className="date-input"
                inputMode="numeric"
                pattern="\d*"
              />
              <span className="date-separator">/</span>
              <input
                type="text"
                maxLength={2}
                placeholder="DD"
                className="date-input"
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            <input type="email" placeholder="Email" style={{ width: '100%' }} />
            <input type="username" placeholder="Username" style={{ width: '100%' }} />
            <input type="password" placeholder="Password" style={{ width: '100%' }} />
            <input type="password" placeholder="Confirm Password" style={{ width: '100%' }} />
          </div>
          <p>We will send an email with a verification code.</p>
          <Button text="CONTINUE" variant="primary" />
          <img src={swipeShelfLogo} className="logo" alt="SwipeShelf logo" />
        </div>
    </>
  )
}

export default SignIn;