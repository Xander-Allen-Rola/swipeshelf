import './SignIn.css'
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';

function SignIn() {
  return (
    <>
    <BackArrow />
    <div className="sign-in-container">
      <h1>SIGN IN</h1>
        <div className="sign-in-field-container">
            <input type="email_username" placeholder="Email/Username" required />
            <input type="password" placeholder="Password" required />
        </div>
        <Button text="SIGN IN" variant="primary" />
    </div>
    </>
  );
}

export default SignIn;