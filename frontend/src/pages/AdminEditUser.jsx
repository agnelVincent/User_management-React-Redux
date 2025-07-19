import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import styles from './AdminEditUser.module.css';

function AdminEditUser() {
  const { id } = useParams();
  const { accessToken } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // 🚀 Validation logic
  const validateForm = () => {
    if (!username.trim()) return 'Username cannot be empty or only spaces.';
    if (username.length < 3) return 'Username must be at least 3 characters.';
    if (username.includes(' ')) return 'Username should not contain spaces.';
    if (/^\d+$/.test(username)) return 'Username cannot contain only numbers.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required.';
    if (!emailRegex.test(email)) return 'Invalid email format.';

    return null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`admin/users/${id}/`);
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data.');
      }
    };

    fetchUser();
  }, [id, accessToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.put(`admin/users/${id}/`, { username, email });
      navigate('/admin');
    } catch (err) {
      const res = err.response;
      if (res && res.data) {
        let msg = '';
        for (const key in res.data) {
          msg += `${key}: ${res.data[key]}\n`;
        }
        setError(msg);
      } else {
        setError('Something went wrong while updating.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit User</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleUpdate} className={styles.form} noValidate>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Update User</button>
      </form>
    </div>
  );
}

export default AdminEditUser;
