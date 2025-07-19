import React , { useEffect, useState } from 'react'
import api from '../services/api'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { useDispatch } from 'react-redux' 
import styles from './AdminDashboard.module.css';



function AdminDashboard() {
    const {accessToken , isAdmin} = useSelector(state => state.auth)
    const [users, setUsers] = useState([])
    const [errors , setErrors] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=>{
        const fetchUsers = async () =>{
            try{
                const res = await api.get('admin/users/')
                setUsers(res.data)
            }
            catch(err){
                console.log( 'Failed to load users' , err)
                setErrors('Failed to fetch users list')
            }
        }
        if(isAdmin){
            fetchUsers()
        }
    },[accessToken,isAdmin])

    const handleDelete = async (userId) => {
        if(!window.confirm('Are you sure you want to delete this user? ')) return 
        try{
            await api.delete(`admin/users/${userId}/`)
            setUsers(users.filter(user => user.id !== userId))
        }
        catch(err){
            console.log('Error deleting user',err)
            setErrors('Failed to delete user')
        }
    }

    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

  return (
<div className={styles.container}>
      <h2>Admin Dashboard</h2>
      {errors && <p className={styles.errorText}>{errors}</p>}

      <button className={styles.createBtn} onClick={() => navigate('/admin/create')}>
        + Create New User
      </button>

      <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button className={styles.editBtn} onClick={() => navigate(`/admin/edit/${user.id}`)}>
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AdminDashboard
