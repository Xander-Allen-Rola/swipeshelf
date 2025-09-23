import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './VerificationPage.css'
import Button from '../components/Button'
import BackArrow from '../components/BackArrow'
import Logo from '../components/Logo'

function VerificationPage() {
  const [code, setCode] = useState(Array(6).fill(''));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  
  // ✅ Get email from navigation state
  const location = useLocation();
  const email = location.state?.email;
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const handleChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join("");
    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codeString }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
      } else {
        setSuccess(data.message);
        setTimeout(() => {
          navigate("/profile"); // or next page
        }, 1000);
      }
    } catch (err) {
      setError("Unable to reach server");
    }
  };

  return (
    <>
      <BackArrow className="back-arrow" />
      <Logo position="top" />
      <div className="container">
        <h1>Enter Verification Code</h1>
        <div className="code-inputs">
          {code.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="code-input"
              value={digit}
              onChange={e => handleChange(e.target.value, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              ref={el => (inputsRef.current[idx] = el)}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <p>Please check your email for the verification code we sent.</p>
        <Button
          text="CONTINUE"
          variant={code.some(digit => digit === '') ? "invalid-primary" : "primary"}
          onClick={handleVerify}
          disabled={code.some(digit => digit === '')}
        />
      </div>
    </>
  )
}

export default VerificationPage;
