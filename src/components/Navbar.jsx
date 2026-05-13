import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>TaskManager</Link>
      <div style={styles.right}>
        {user && (
          <>
            <span style={styles.username}>👤 {user.name} ({user.role})</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 24px', background: '#1e1e2e', color: 'white',
  },
  brand: {
    color: '#7c6af7', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none',
  },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { fontSize: '14px', color: '#ccc' },
  btn: {
    padding: '6px 14px', background: '#e53e3e', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer',
  },
};

export default Navbar;