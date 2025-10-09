import NavigationPane from "../components/NavigationPane";
import Logo from "../components/Logo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import './UserProfilePage.css';
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ConfirmPopup from "../components/ConfirmPopup";
import ShelfCard from "../components/ShelfCard";

function UserProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({ firstName: '', lastName: '', bio: '' });
    const [finishedCount, setFinishedCount] = useState<number>(0);
    const [toReadCount, setToReadCount] = useState<number>(0);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);

    // 👇 new states for profile picture upload
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch user');
                return response.json();
            })
            .then(data => {
                setUser(data.user);
                setUpdatedUser({
                    firstName: data.user.firstName || '',
                    lastName: data.user.lastName || '',
                    bio: data.user.bio || '',
                });
                setImage(data.user.profilePicture || null);
            })
            .catch(error => console.error(error));

        fetch(`http://localhost:5000/api/users/${userId}/finished-count`)
            .then(res => res.json())
            .then(data => setFinishedCount(data.count))
            .catch(err => console.error(err));

        fetch(`http://localhost:5000/api/users/${userId}/to-read-count`)
            .then(res => res.json())
            .then(data => setToReadCount(data.count))
            .catch(err => console.error(err));

        fetch(`http://localhost:5000/api/shelves/favorites/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("⭐ Favorite books fetched:", data.books);
                setFavoriteBooks(data.books || []);
            })
            .catch(err => console.error("❌ Error fetching favorites:", err));
    }, []);

    // 👇 handle clicking the profile pic
    const handleIconClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    // 👇 handle file selection + preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
            console.log("📌 Selected file ready for upload:", selectedFile.name);
        }
    };

    // 👇 upload to Cloudinary & log URL only
    const uploadProfilePicture = async () => {
        if (!file) return null;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No JWT token found. Cannot upload profile picture.");
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("⬆️ Uploading image to backend/Cloudinary...");
            setLoading(true);

            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const text = await uploadRes.text();
                throw new Error(`Upload failed: ${text}`);
            }

            const data = await uploadRes.json();
            const cloudinaryUrl = data.url;
            console.log("✅ New Cloudinary URL:", cloudinaryUrl);

            setLoading(false);
            return cloudinaryUrl;
        } catch (err) {
            console.error("❌ Error uploading profile picture:", err);
            setLoading(false);
            return null;
        }
    };

    // 👇 handle saving profile (including pic)
    // 👇 handle saving profile (including pic)
    const handleSaveProfile = async () => {
        console.log("📄 Updated User Data:", updatedUser);
        const token = localStorage.getItem("token");
        if (!token) return;

        let profilePicUrl = image;

        // 1️⃣ Upload image if a new file was selected
        if (file) {
            const newUrl = await uploadProfilePicture();
            if (newUrl) {
                profilePicUrl = newUrl;
                // 2️⃣ Save profile picture URL to backend
                await fetch("http://localhost:5000/api/users/profile-picture", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ url: newUrl }),
                });
                console.log("🖼️ Profile picture updated on backend");
            }
        }

        // 3️⃣ Update name + bio
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
            const errorText = await response.text();
            console.error("❌ Failed to update user:", errorText);
            return;
        }

        const data = await response.json();
        console.log("✅ User info updated:", data);

        // 4️⃣ Reflect updated info in frontend state
        setUser(data.user);
        setIsEditing(false);
    };

    return (
        <>
            <Logo position="top" />
            <div className="user-profile-container">
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

                {/* hidden file input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                {isEditing ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '30px' }}>
                            {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                        </h2>
                        <p style={{ fontSize: '15px' }}>
                            {user?.bio ? user.bio : "Add your bio here"}
                        </p>
                    </>
                )}

                <div className="user-profile-buttons">
                    <Button
                        width="150px"
                        height="40px"
                        padding="0px"
                        text={isEditing ? (loading ? "Uploading..." : "Finish Profile") : "Edit Profile"}
                        onClick={() => {
                            if (isEditing) {
                                handleSaveProfile();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                    />
                    <Button
                        width="150px"
                        height="40px"
                        padding="0px"
                        text="Sign Out"
                        onClick={() => setShowSignOutConfirm(true)}
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
                    <h3 style={{ margin: '5px' }}>Favorite Books</h3>
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
                                    onClick={() => setSelectedBook(book)} // 👈 opens ShelfCard
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {selectedBook && (
                <ShelfCard
                    id={selectedBook.googleBooksId}
                    googleBooksId={selectedBook.googleBooksId}
                    title={selectedBook.title}
                    coverURL={selectedBook.coverURL}
                    description={selectedBook.description}
                    variation="search"
                    onClose={() => setSelectedBook(null)} // 👈 closes ShelfCard
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
                    navigate('/');
                }}
                onCancel={() => setShowSignOutConfirm(false)}
            />
        </>
    );
}

export default UserProfilePage;
