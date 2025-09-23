import React, { useRef, useState } from 'react';
import './VerificationPage.css'
import Button from '../components/Button'
import BackArrow from '../components/BackArrow'
import Logo from '../components/Logo'

function VerificationPage() {
  const [code, setCode] = useState(Array(6).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digit
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);

    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <>
      <BackArrow className="back-arrow" />
      <Logo position="top" />
      <div className="container">
        <h1>My Code is</h1>
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
        <p>Please check your email for the verification code we sent.</p>
        <Button text="CONTINUE" variant="primary" />
      </div>
    </>
  )
}

export default VerificationPage;