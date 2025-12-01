import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignIn.css';
import BackArrow from '../components/BackArrow';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { useAuth } from "../contexts/AuthContext";
import LoadingOverlay from "../components/LoadingOverlay";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Save JWT + userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      // Update context
      setUser({ id: data.user.id, token: data.token });

      console.log("✅ Login successful:", data);

      // Redirect
      navigate("/recommendations");
      setIsLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={isLoading} text="Signing in..." overlay />
      <BackArrow />
      <Logo position='top'/>
      <div className="sign-in-container">
        <h1>SIGN IN</h1>
        <div className="sign-in-field-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/*<div className="forgot-password">Forgot password?</div>*/}
        <Button text="SIGN IN" variant="primary" onClick={handleSignIn} width="100%" height="48px" padding="12px" />
      </div>
    </>
  );
}

export default SignIn;
