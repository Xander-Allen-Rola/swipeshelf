import NavigationPane from "../components/NavigationPane";
import Logo from "../components/Logo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import './UserProfilePage.css';
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function UserProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [finishedCount, setFinishedCount] = useState<number>(0);
    const [toReadCount, setToReadCount] = useState<number>(0);

  useEffect(() => {
    const userId = localStorage.getItem('userId');  // 👈 still get it
    if (!userId) {
        return; // ❌ no redirect anymore
    }

    fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return response.json();
        })
        .then(data => {
        setUser(data.user);
        console.log(data);
        })
        .catch(error => {
        console.error(error);
        });

     // 📚 Fetch Finished Count
    fetch(`http://localhost:5000/api/users/${userId}/finished-count`)
      .then(res => res.json())
      .then(data => {
        setFinishedCount(data.count);
        console.log("✅ Finished Count:", data.count);
      })
      .catch(err => console.error(err));

    // 📝 Fetch To Read Count
    fetch(`http://localhost:5000/api/users/${userId}/to-read-count`)
      .then(res => res.json())
      .then(data => {
        setToReadCount(data.count);
        console.log("✅ To Read Count:", data.count);
      })
      .catch(err => console.error(err));
    }, []);


    const handleSignOut = () => {
        // Remove token from local storage
        localStorage.removeItem('token');

        localStorage.clear();

        // Redirect to landing page
        navigate('/');
    };
  return (
    <>
        <Logo position="top" />
        <div className="user-profile-container">
            {user?.profilePicture ? (
                <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="profile-picture"
                    style={{ width: '120px', height: '120px', borderRadius: '50%' }}
                />
                ) : (
                <FontAwesomeIcon
                    icon={faCircleUser}
                    size="xl"
                    style={{ color: "#8b5e3c", width: '125px', height: '125px' }}
                />
                )}
            <h2 style={{ fontSize: '30px' }}>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</h2>
            <p style={{ fontSize: '15px' }}>
                {user?.bio ? user.bio : "Add your bio here"}
            </p>
            <div className="user-profile-buttons">
              <Button 
                width="150px" 
                height="40px" 
                padding="0px" 
                text="Edit Profile" />
              <Button 
                width="150px" 
                height="40px" 
                padding="0px" 
                text="Sign Out"
                onClick={handleSignOut} />
            </div>
            <div className="user-stats">
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>{finishedCount}</p>
                    <p>Books Finished</p>
                </div>
                {/*<div className="stat-line" />
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>//</p>
                    <p>Recommendations</p>
                </div>*/}
                <div className="stat-line" />
                <div className="stat">
                    <p style={{fontWeight: 'bold'}}>{toReadCount}</p>
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