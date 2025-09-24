import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import VerificationPage from './pages/VerificationPage';
import RegistrationPage from './pages/RegistrationPage';
import SignIn from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import GenresPage from './pages/GenresPage';
import RecommendationPage from './pages/RecommendationPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Always start here */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify" element={<VerificationPage />} />

        {/* Registration flow (nested) */}
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/registration/pfp" element={<ProfilePage />} />
        <Route path="/registration/pfp/genres" element={<GenresPage />} />

        {/* After onboarding */}
        <Route path="/recommendations" element={<RecommendationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
