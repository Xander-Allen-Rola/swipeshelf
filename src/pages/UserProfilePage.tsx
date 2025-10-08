import NavigationPane from "../components/NavigationPane";
import Logo from "../components/Logo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import './UserProfilePage.css';
import Button from '../components/Button';

function UserProfilePage() {
  return (
    <>
        <Logo position="top" />
        <div className="user-profile-container">
            <FontAwesomeIcon
                icon={faCircleUser}
                size="xl"
                style={{ color: "#8b5e3c", width: '120px', height: '120px' }}
            />
            <h2 style={{ fontSize: '30px' }}>John Doe</h2>
            <p style={{ fontSize: '15px' }}>Add your bio here</p>
            <div className="user-profile-buttons">
              <Button width="150px" height="40px" padding="0px" text="Edit Profile" />
              <Button width="150px" height="40px" padding="0px" text="Sign Out" />
            </div>
            <div className="user-stats">
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>24</p>
                    <p>Books Finished</p>
                </div>
                <div className="stat-line" />
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>24</p>
                    <p>Recommendations</p>
                </div>
                <div className="stat-line" />
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>24</p>
                    <p>Books To Read</p>
                </div>
                {/*<div className="stat-line" />
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>24</p>
                    <p>Friends</p>
                </div>*/}
            </div>
            <div className="favorite-books">
                <h3 style={{margin:'5px'}}>Favorite Books</h3>
                <div className="favorite-books-entries">
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                    <img className="favorite-book-cover" src="https://imgv2-1-f.scribdassets.com/img/document/663106463/original/5e4cc5ceca/1?v=1" />
                </div>
            </div>
        </div>
        <NavigationPane />
    </>
  );
}
export default UserProfilePage;