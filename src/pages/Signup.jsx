import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input} placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={styles.input} placeholder="Email" type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input} placeholder="Password" type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            style={styles.input}
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.btn} type="submit">Sign Up</button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center', background: '#f0f2f5',
  },
  card: {
    background: 'white', padding: '40px', borderRadius: '12px',
    width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: { marginBottom: '24px', color: '#1e1e2e', textAlign: 'center' },
  input: {
    width: '100%', padding: '10px 14px', marginBottom: '16px',
    border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px', background: '#7c6af7',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer',
  },
  error: { color: 'red', marginBottom: '12px', fontSize: '14px' },
  link: { textAlign: 'center', marginTop: '16px', fontSize: '14px' },
};

export default Signup;
