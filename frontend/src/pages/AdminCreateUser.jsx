import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './AdminCreateUser.module.css';

function AdminCreateUser() {
  const { accessToken } = useSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInput = () => {
    if (!username || !email || !password) {
      return 'All fields are required!';
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      return 'Username must be at least 3 characters long.';
    }

    if (/^\d+$/.test(trimmedUsername)) {
      return 'Username cannot be only numbers.';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return 'Username can only contain letters, numbers, and underscores.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return 'Invalid email format.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.post(
        'admin/users/',
        {
          username: username.trim(),
          email: email.trim(),
          password,
          password2: password
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
      alert('User created successfully');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      const res = err.response;
      if (res && res.data) {
        let msg = '';
        for (const key in res.data) {
          msg += `${key}: ${res.data[key]}\n`;
        }
        setError(msg);
      } else {
        setError('Failed to create user');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create New User</h2>
      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
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
  );
}

export default AdminCreateUser;
