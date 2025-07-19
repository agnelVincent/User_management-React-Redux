import React, { useState , useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useDispatch } from 'react-redux'
import styles from './LoginPage.module.css'
import { setTokens } from '../redux/slices/authSlice'


function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()



    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { isAuthenticated, isAdmin } = useSelector(state => state.auth)

    useEffect(() => {
        console.log(isAuthenticated, isAdmin)
        if (isAuthenticated) {
            if (isAdmin) {
                navigate('/admin', { replace: true })
            } else {
                navigate('/home', { replace: true })
            }
        }
    }, [isAuthenticated, isAdmin, navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await api.post('login/', { email, password })
            const { access, refresh } = response.data

            dispatch(setTokens({ access, refresh }))

            localStorage.setItem('accessToken', access)
            localStorage.setItem('refreshToken', refresh)
        } catch (err) {
            setError('Invalid Email entry or password')
        }
    }

    return (
    <div className={styles.container}>

      <h2 className={styles.title}>Login</h2>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleLogin} className={styles.form} noValidate>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>

      <p className={styles.footerText}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
    )
}


export default LoginPage