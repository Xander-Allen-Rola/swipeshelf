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

        {/* Other routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
