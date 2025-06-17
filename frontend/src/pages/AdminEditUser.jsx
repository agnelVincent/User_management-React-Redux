import React , {useState , useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../services/api'
import styles from './AdminEditUser.module.css'

function AdminEditUser() {

    const {id} = useParams()
    const {accessToken} = useSelector(state => state.auth)
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    useEffect(()=>{
        const fetchUser = async () => {
            try{
                const res = await api.get(`admin/users/${id}/`)
                setUsername(res.data.username)
                setEmail(res.data.email)
            }
            catch(err){
                console.log(err)
                setError('Failed to update user')
            }
        }
        fetchUser()
    },[id , accessToken])

    const handleUpdate = async (e) => {
        e.preventDefault()
        setError('')

        if(!username || !email){
            setError('Username and email are required')
            return
        }

        try{
            await api.put(`admin/users/${id}/`,
                {
                    username,
                    email,
                },
            )
            navigate('/admin')
        }
        catch(err){
            console.log(err)
            setError('Falied editing user')
        }
    }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit User</h2>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleUpdate} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />


        <button type="submit" className={styles.button}>Update User</button>
      </form>
    </div>
  )
}

export default AdminEditUser
