import NavigationPane from "../components/NavigationPane";
import Logo from "../components/Logo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import './UserProfilePage.css';
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ConfirmPopup from "../components/ConfirmPopup";
import ShelfCard from "../components/ShelfCard";
import { motion, AnimatePresence } from "framer-motion";
import AddFavoriteBookPopup from "../components/AddFavorites";

function UserProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [updatedUser, setUpdatedUser] = useState({ firstName: '', lastName: '', bio: '' });
    const [finishedCount, setFinishedCount] = useState<number>(0);
    const [toReadCount, setToReadCount] = useState<number>(0);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [showAddFavoritePopup, setShowAddFavoritePopup] = useState(false);
    const [hydrated, setHydrated] = useState(false); // 👈 for gating render until data is ready

    // 👇 profile picture upload
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) return;

        const fetchUser = fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch user');
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setUpdatedUser({
                    firstName: data.user.firstName || '',
                    lastName: data.user.lastName || '',
                    bio: data.user.bio || '',
                });
                setImage(data.user.profilePicture || null);
            });

        const fetchFinishedCount = fetch(`http://localhost:5000/api/users/${userId}/finished-count`)
            .then(res => res.json())
            .then(data => setFinishedCount(data.count));

        const fetchToReadCount = fetch(`http://localhost:5000/api/users/${userId}/to-read-count`)
            .then(res => res.json())
            .then(data => setToReadCount(data.count));

        const fetchFavorites = fetch(`http://localhost:5000/api/shelves/favorites/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("⭐ Favorite books fetched:", data.books);
                setFavoriteBooks(data.books || []);
            });

        Promise.all([fetchUser, fetchFinishedCount, fetchToReadCount, fetchFavorites])
            .then(() => setHydrated(true))
            .catch(err => console.error("❌ Error fetching profile data:", err));
    }, []);

    const handleIconClick = () => {
        if (isEditing) fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => setImage(event.target?.result as string);
            reader.readAsDataURL(selectedFile);
        }
    };

    const uploadProfilePicture = async () => {
        if (!file) return null;
        const token = localStorage.getItem("token");
        if (!token) return null;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
            const data = await uploadRes.json();
            setLoading(false);
            return data.url;
        } catch (err) {
            console.error("❌ Error uploading profile picture:", err);
            setLoading(false);
            return null;
        }
    };

    const handleSaveProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let profilePicUrl = image;

        if (file) {
            const newUrl = await uploadProfilePicture();
            if (newUrl) {
                profilePicUrl = newUrl;
                await fetch("http://localhost:5000/api/users/profile-picture", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ url: newUrl }),
                });
            }
        }

        const response = await fetch("http://localhost:5000/api/users/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                bio: updatedUser.bio,
            }),
        });

        if (!response.ok) {
            console.error("❌ Failed to update user:", await response.text());
            return;
        }

        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
    };

    return (
        <>
            <Logo position="top" />
            <motion.div
                className="signout-button"
                initial={{ opacity: 0, y: -10 }}        // 👈 start slightly above, invisible
                animate={{ opacity: 1, y: 0 }}         // 👈 fade in and slide down
                transition={{ duration: 0.4, ease: "easeOut" }} // 👈 control speed
                onClick={() => setShowSignOutConfirm(true)}
                >
            <FontAwesomeIcon 
                icon={faRightFromBracket}
                className="signout-button"
                onClick={() => setShowSignOutConfirm(true)}
            />
            </motion.div>
            {hydrated ? (
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0 },
                }}
                className="user-profile-container"
            >
                <div
                    onClick={handleIconClick}
                    style={{ cursor: isEditing ? 'pointer' : 'default' }}
                >
                    {image ? (
                        <img
                            src={image}
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
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="edit-fields"
                            initial={{ opacity: 0, y: -20, rotateX: 90 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, y: 20, rotateX: -90 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="edit-info-container">
                                <input
                                    type="text"
                                    value={updatedUser.firstName}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
                                    className="edit-input"
                                    placeholder="First Name"
                                />
                                <input
                                    type="text"
                                    value={updatedUser.lastName}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
                                    className="edit-input"
                                    placeholder="Last Name"
                                />
                            </div>
                            <textarea
                                value={updatedUser.bio}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}
                                className="edit-textarea"
                                placeholder="Write your bio..."
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="display-fields"
                            initial={{ opacity: 0, y: -20, rotateX: 90 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, y: 20, rotateX: -90 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 style={{ fontSize: '30px' }}>
                                {user && `${user.firstName} ${user.lastName}`}
                            </h2>
                            <p style={{ fontSize: '15px' }}>
                                {user?.bio ? user.bio : "Add your bio here"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="user-profile-buttons">
                    <Button
                        width="150px"
                        height="40px"
                        padding="0px"
                        text={isEditing ? (loading ? "Uploading..." : "Finish Profile") : "Edit Profile"}
                        onClick={() => {
                            if (isEditing) handleSaveProfile();
                            else setIsEditing(true);
                        }}
                    />
                </div>

                <div className="user-stats">
                    <div className="stat">
                        <p style={{ fontWeight: 'bold' }}>{finishedCount}</p>
                        <p>Books Finished</p>
                    </div>
                    <div className="stat-line" />
                    <div className="stat">
                        <p style={{ fontWeight: 'bold' }}>{toReadCount}</p>
                        <p>Books To Read</p>
                    </div>
                </div>

                <div className="favorite-books">
                    <div className="favorite-books-header">
                        <h3 style={{ margin: '5px' }}>Favorite Books </h3>
                        <Button 
                            text="+"
                            width="25px"
                            height="25px"
                            padding="0px"
                            onClick={() => setShowAddFavoritePopup(true)} />
                    </div>
                    <div className="favorite-books-entries">
                        {favoriteBooks.length === 0 ? (
                            <p style={{ opacity: 0.7 }}>No favorites yet</p>
                        ) : (
                            favoriteBooks.map((book) => (
                                <img
                                    key={book.id}
                                    className="favorite-book-cover"
                                    src={book.coverURL}
                                    alt={book.title}
                                    onClick={() => setSelectedBook(book)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </motion.div>
            ) : null}
            
            {selectedBook && (
                <ShelfCard
                    id={selectedBook.googleBooksId}
                    googleBooksId={selectedBook.googleBooksId}
                    title={selectedBook.title}
                    coverURL={selectedBook.coverURL}
                    description={selectedBook.description}
                    variation="none"
                    onClose={() => setSelectedBook(null)}
                /> 
            )}

            <NavigationPane />

            <ConfirmPopup
                isVisible={showSignOutConfirm}
                title="Sign Out"
                content="Are you sure you want to sign out?"
                confirmText="Sign Out"
                cancelText="Cancel"
                onConfirm={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate('/');
                }}
                onCancel={() => setShowSignOutConfirm(false)}
            />

            <AnimatePresence>
                {showAddFavoritePopup && (
                    <AddFavoriteBookPopup
                        isVisible={showAddFavoritePopup}
                        onClose={() => setShowAddFavoritePopup(false)}
                        onFavoritesAdded={(newBooks) => {
                            setFavoriteBooks((prev) => [...prev, ...newBooks]);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default UserProfilePage;
