import './ProfilePage.css'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import Button from '../components/Button'
import BackArrow from '../components/BackArrow'
import Logo from '../components/Logo'
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay"; // ✅ import reusable overlay

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation()
  const token = location.state?.token || localStorage.getItem("token") // fallback if you stored it
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null) // store selected file
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false);

  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile) // save file for later upload

      // Preview locally
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
      console.log("📌 Selected file ready for upload:", selectedFile.name)
    }
  }

  const handleContinue = async () => {
    if (!file) {
      console.log("⚠️ No file selected, skipping profile picture upload")
      return
    }

    if (!token) { // use the token from location.state or localStorage
      console.error("❌ No JWT token found. Cannot update profile picture.")
      return
    }
    console.log("JWT token:", token)

    const formData = new FormData()
    formData.append("file", file)

    try {
      console.log("⬆️ Uploading image to backend/Cloudinary...")
      setLoading(true);
      const uploadRes = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const text = await uploadRes.text()
        throw new Error(`Upload failed: ${text}`)
      }

      const data = await uploadRes.json()
      const cloudinaryUrl = data.url
      console.log("✅ Uploaded image URL from Cloudinary:", cloudinaryUrl)

      console.log("⬆️ Sending URL to backend to update user profile...")
      const updateRes = await fetch("http://localhost:5000/api/users/profile-picture", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ url: cloudinaryUrl }),
      })

      if (!updateRes.ok) {
        const text = await updateRes.text()
        throw new Error(`Failed to update user profile: ${text}`)
      }

      console.log("✅ Profile picture successfully saved to database")
      setLoading(false);
      navigate("/registration/pfp/genres", { state: { token } });
    } catch (err) {
      console.error("❌ Error during profile picture update:", err)
    }
  }


  return (
    <>
      <LoadingOverlay show={loading} text="Uploading..." />
      <BackArrow />
      <Logo position="top" />
      <div
        style={{
          position: 'absolute',
          top: '45px',
          right: '20px',
          fontWeight: 'bold',
          fontSize: '18px',
          color: '#2c2c2c',
          cursor: 'pointer'
        }}
        onClick={() => navigate("/registration/pfp/genres", { state: { token } })}
      >
        Skip
      </div>
      <div className="profile-page-container">
        <h1>Add your Profile Picture</h1>
        <div
          className="profile-picture-placeholder"
          onClick={handleIconClick}
          style={{ cursor: 'pointer' }}
        >
          {image ? (
            <img src={image} alt="Profile" className="profile-picture-img" />
          ) : (
            <FontAwesomeIcon
              icon={faCircleUser as import('@fortawesome/fontawesome-svg-core').IconProp}
              size="2xl"
              style={{ color: "#8b5e3c", width: '300px', height: '300px' }}
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
        <Button
          text="CONTINUE"
          variant="primary"
          onClick={handleContinue}
          width="100%"
          height="48px"
          padding="12px"
        />
      </div>
    </>
  )
}

export default ProfilePage
