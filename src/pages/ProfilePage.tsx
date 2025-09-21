import './ProfilePage.css'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import Button from '../components/Button'
import BackArrow from '../components/BackArrow'
import Logo from '../components/Logo'

function ProfilePage() {
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
    <BackArrow />
    <Logo position="top" />
    <div className="profile-page-container">
      <h1>Add your Profile Picture</h1>
      <div className="profile-picture-placeholder" onClick={handleIconClick} style={{ cursor: 'pointer' }}>
        {image ? (
          <img src={image} alt="Profile" className="profile-picture-img" />
        ) : (
          <FontAwesomeIcon icon={faCircleUser} size="2xl" style={{ color: "#8b5e3c", width: '300px', height: '300px' }} />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button text="CONTINUE" variant="invalid-primary" />
    </div>
    </>
  )
}

export default ProfilePage;