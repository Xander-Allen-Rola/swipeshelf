import './NavigationPane.css';
import personalShelf from '../assets/navigation_personal_shelf.png';
import searchBook from '../assets/navigation_search_book.png';
import recommendation from '../assets/navigation_recommendations.png';
import friends from '../assets/navigation_friends.png';
import profile from '../assets/navigation_profile.png';

function NavigationPane() {
  return (
    <nav className="navigation-pane">
      <img src={personalShelf} alt="Home" className="nav-icon" />
      <img src={searchBook} alt="Search" className="nav-icon" />
      <img src={recommendation} alt="Recommendations" className="nav-icon" />
      <img src={friends} alt="Friends" className="nav-icon" />
      <img src={profile} alt="Profile" className="nav-icon" />
    </nav>
  );
}
export default NavigationPane;