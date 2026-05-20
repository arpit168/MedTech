import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '14px 40px', 
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Heart size={28} color="#fff" />
          <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>
            MedTech
          </span>
        </Link>
        
        {/* Links */}
        {token && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link to="/prescription" style={{ textDecoration: 'none', color: '#f9fafb', fontWeight: 500 }}>Prescription</Link>
            <Link to="/symptom-tracker" style={{ textDecoration: 'none', color: '#f9fafb', fontWeight: 500 }}>Symptoms</Link>
            <Link to="/reports" style={{ textDecoration: 'none', color: '#f9fafb', fontWeight: 500 }}>Reports</Link>
            
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
              <User size={20} color="#fff" />
              <span style={{ fontWeight: 500 }}>{user.name || 'User'}</span>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center' 
                }}
              >
                <LogOut size={20} color="#f87171" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
