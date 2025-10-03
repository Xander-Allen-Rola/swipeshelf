import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import VerificationPage from './pages/VerificationPage';
import RegistrationPage from './pages/RegistrationPage';
import SignIn from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import GenresPage from './pages/GenresPage';
import ShelfPage from './pages/ShelfPage';
import RecommendationPage from './pages/RecommendationPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/registration/pfp" element={<ProfilePage />} />
          <Route path="/registration/pfp/genres" element={<GenresPage />} />

          {/* Protected */}
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationPage />
              </ProtectedRoute>
            }
          />
          {/* Protected */}
          <Route
            path="/shelf"
            element={
              <ProtectedRoute>
                <ShelfPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
