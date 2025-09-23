import './SignIn.css'
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import Logo from '../components/Logo';

function SignIn() {
  return (
    <>
    <BackArrow />
    <Logo position='top'/>
    <div className="sign-in-container">
      <h1>SIGN IN</h1>
        <div className="sign-in-field-container">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
        </div>
        <div className="forgot-password">Forgot password?</div>
        <Button text="SIGN IN" variant="primary" />
    </div>
    </>
  );
}

export default SignIn;