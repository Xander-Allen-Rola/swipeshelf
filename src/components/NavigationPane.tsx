import './NavigationPane.css';
import personalShelf from '../assets/navigation_personal_shelf.png';
import searchBook from '../assets/navigation_search_book.png';
import recommendation from '../assets/navigation_recommendations.png';
import friends from '../assets/navigation_friends.png';
import profile from '../assets/navigation_profile.png';
import { Link, useLocation } from "react-router-dom"; // ✅ import Link from react-router

function NavigationPane() {
  const location = useLocation(); // ✅ get current URL

  return (
    <nav className="navigation-pane">

      {/* Recommendations */}
      <Link to="/recommendations">
        <img
          src={recommendation}
          alt="Recommendations"
          className={`nav-icon ${location.pathname === "/recommendations" ? "active" : ""}`}
        />
      </Link>

      {/* Search (placeholder → you can adjust the path later) */}
      <Link to="/search">
        <img
          src={searchBook}
          alt="Search"
          className={`nav-icon ${location.pathname === "/search" ? "active" : ""}`}
        />
      </Link>

      {/* Personal Shelf */}
      <Link to="/shelf">
        <img
          src={personalShelf}
          alt="Personal Shelf"
          className={`nav-icon ${location.pathname === "/shelf" ? "active" : ""}`}
        />
      </Link>

      {/* Friends 
      <Link to="/friends">
        <img
          src={friends}
          alt="Friends"
          className={`nav-icon ${location.pathname === "/friends" ? "active" : ""}`}
        />
      </Link>*/}

      {/* Profile */}
      <Link to="/profile">
        <img
          src={profile}
          alt="Profile"
          className={`nav-icon ${location.pathname === "/profile" ? "active" : ""}`}
        />
      </Link>
    </nav>
  );
}

export default NavigationPane;