import { Activity, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Activity size={24} />
        <span>HealNow</span>
      </Link>

      {isAuthenticated && (
        <div className="navbar-links">
          {role === 'patient' && (
            <>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
              <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''}>Find Doctors</Link>
              <Link to="/contacts" className={location.pathname === '/contacts' ? 'active' : ''}>Contacts</Link>
            </>
          )}
          {role === 'doctor' && (
            <>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Analytics</Link>
              <Link to="/patients" className={location.pathname === '/patients' ? 'active' : ''}>Patients</Link>
              <Link to="/appointments" className={location.pathname === '/appointments' ? 'active' : ''}>Appointments</Link>
              <Link to="/referrals" className={location.pathname === '/referrals' ? 'active' : ''}>Referrals</Link>
            </>
          )}
        </div>
      )}

      <div className="navbar-actions">
        {isAuthenticated ? (
          <div className="navbar-user">
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{role}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
