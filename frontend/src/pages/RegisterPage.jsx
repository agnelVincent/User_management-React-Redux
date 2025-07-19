import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './RegisterPage.module.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const { username, email, password, password2 } = formData;

    if (!username.trim()) return 'Username cannot be empty or only spaces.';
    if (username.length < 3) return 'Username must be at least 3 characters.';
    if (username.includes(' ')) return 'Username should not contain spaces.';
    if (/^\d+$/.test(username)) return 'Username cannot contain only numbers.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format.';

    if (password !== password2) return 'Passwords do not match.';
    if (password.includes(' ')) return 'Password cannot contain spaces.';

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    }

    return null;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setErrors(validationError);
      return;
    }

    try {
      await api.post('register/', formData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const res = err.response;
      if (res && res.data) {
        let msg = '';
        for (const key in res.data) {
          msg += `${key}: ${res.data[key]}\n`;
        }
        setErrors(msg);
      } else {
        setErrors('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>

      {errors && <p className={styles.errorMessage}>{errors}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Username"
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password2"
          value={formData.password2}
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>

      <p className={styles.footerText}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default RegisterPage;
