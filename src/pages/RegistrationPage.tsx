import { useState } from "react";
import './RegistrationPage.css';
import Button from '../components/Button';
import BackArrow from '../components/BackArrow';
import Logo from '../components/Logo';
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [dob, setDob] = useState({ year: "", month: "", day: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // Frontend validation
    if (!firstName || !lastName || !email || !password) {
      setError("First name, last name, email, and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const dobString = `${dob.year}-${dob.month.padStart(2, "0")}-${dob.day.padStart(2, "0")}`;

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          suffix,
          dob: dobString,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess(`Registered successfully! User ID: ${data.id}`);
        // Optional: clear form
        setFirstName("");
        setLastName("");
        setSuffix("");
        setDob({ year: "", month: "", day: "" });
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Navigate to recommendations page
        navigate("/recommendations");
      }
    } catch (err) {
      setError("Unable to reach server");
    }
  };

  return (
    <>
      <BackArrow className="back-arrow" />
      <Logo position="top" />
      <div className="registration-container">
        <h1>REGISTRATION</h1>

        <div className="personal-info">
          <div className="name-container">
            <input
              type="text"
              placeholder="First Name"
              style={{ width: '100%' }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              style={{ width: '80%' }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Suffix"
              style={{ width: '25%' }}
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
            />
          </div>

          <div className="date-container">
            <input
              type="text"
              maxLength={4}
              placeholder="YYYY"
              className="date-input"
              inputMode="numeric"
              pattern="\d*"
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: e.target.value })}
            />
            <span className="date-separator">/</span>
            <input
              type="text"
              maxLength={2}
              placeholder="MM"
              className="date-input"
              inputMode="numeric"
              pattern="\d*"
              value={dob.month}
              onChange={(e) => setDob({ ...dob, month: e.target.value })}
            />
            <span className="date-separator">/</span>
            <input
              type="text"
              maxLength={2}
              placeholder="DD"
              className="date-input"
              inputMode="numeric"
              pattern="\d*"
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: e.target.value })}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={{ width: '100%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            style={{ width: '100%' }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <p>We will send an email with a verification code.</p>

        <Button text="CONTINUE" variant="primary" onClick={handleRegister} />
      </div>
    </>
  );
}

export default RegistrationPage;
