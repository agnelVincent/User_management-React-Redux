import React , { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import styles from './AdminCreateUser.module.css';

function AdminCreateUser() {
    const { accessToken } = useSelector(state => state.auth)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if(!username || !email || !password){
            setError('All fields are required!!')
            return
        }

        try{
            await api.post('admin/users/',{
                username , email , password , password2 : password
            })
        navigate('/admin')
        }
        catch(err){
            console.log(err)
            setError('Failed to create user')
        }
    }

  return (
<div className={styles.container}>
      <h2>Create New User</h2>
      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create User</button>
      </form>
    </div>
  )
}

export default AdminCreateUser
