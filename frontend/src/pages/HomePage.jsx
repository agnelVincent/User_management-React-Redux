import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { replace, useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'


function HomePage() {

    const {userId , accessToken} = useSelector(state => state.auth)
    const [profile , setProfile] = useState(null)
    const [newUsername , setNewUsername] = useState('')
    const [profileImage , setProfileImage] = useState(null)
    const [message , setMessage] = useState('')
    const [timestamp, setTimestamp] = useState(Date.now())

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchProfile = async () => {
            try{
              const res = await api.get(`profile/`)
                setProfile(res.data)
                setNewUsername(res.data.username)
                setTimestamp(Date.now())
            }
            catch(err){
                console.log('Failed to fetch profile' , err)
            }}
            fetchProfile()
    },[userId , accessToken])

    const handleUpdate = async (e) =>{
        e.preventDefault()
        const formData = new FormData()
        formData.append('username',newUsername)
        if(profileImage){
            formData.append('profile_picture',profileImage)
        }

        try{
            const res = await api.put(`profile/`,formData , {
                headers:{
                    'Content-Type' : 'multipart/form-data'
                },
            })
            setProfile(res.data)
            setMessage('Profile Picture updated successfully')
            setTimestamp(Date.now())
        }
        catch(err){
            console.log('Failed to updata profile',err)
            setMessage('Update failed')
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login', {replace: true})
    }

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h2>Welcome {profile?.username}</h2>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </div>

      {profile?.profile_picture && (
        <img
          src={`http://localhost:8000${profile.profile_picture}?timestamp=${timestamp}`}
          alt="Profile"
          className={styles.profileImage}
        />
      )}

      <form onSubmit={handleUpdate} className={styles.form}>
        <input
          type="text"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          placeholder="Update Username"
          required
          className={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setProfileImage(e.target.files[0])}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Update Profile</button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default HomePage
