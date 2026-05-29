import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ── Google Fonts ── inject once */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap';
document.head.appendChild(fontLink);

/* ── Keyframe CSS ── */
const css = `
  @keyframes floatUp {
    from { opacity: 0; transform: translateY(32px); filter: blur(4px); }
    to   { opacity: 1; transform: translateY(0);   filter: blur(0); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes orbit {
    from { transform: rotate(0deg)   translateX(120px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  @keyframes orbitReverse {
    from { transform: rotate(0deg)    translateX(80px) rotate(0deg); }
    to   { transform: rotate(-360deg) translateX(80px) rotate(360deg); }
  }
  @keyframes bgDrift {
    0%, 100% { background-position: 0% 50%; transform: translate(0, 0); }
    25%      { background-position: 100% 50%; transform: translate(10px, -10px); }
    50%      { background-position: 50% 100%; transform: translate(-5px, 15px); }
    75%      { background-position: 0% 100%; transform: translate(-15px, -5px); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; }
    50%      { opacity: 0.8; }
  }
  .rg-input {
    transition: all 0.25s cubic-bezier(0.2, 0.8, 0.4, 1);
  }
  .rg-input:focus {
    outline: none;
    border-color: #a78bfa !important;
    box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.15);
  }
  .rg-input:hover:not(:focus) {
    border-color: rgba(167, 139, 250, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
  .rg-input::placeholder {
    color: #475569;
    font-weight: 400;
  }
  .rg-btn {
    background: linear-gradient(105deg, #6d28d9, #4f46e5, #06b6d4, #3b82f6);
    background-size: 300% auto;
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.4, 1);
  }
  .rg-btn:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-3px);
    box-shadow: 0 20px 35px -12px rgba(109, 40, 217, 0.5);
  }
  .rg-btn:active:not(:disabled) {
    transform: translateY(0);
    transition: 0.05s;
  }
  .rg-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  .rg-field {
    animation: slideIn 0.5s ease both;
  }
  .rg-field:nth-child(1) { animation-delay: 0.05s; }
  .rg-field:nth-child(2) { animation-delay: 0.12s; }
  .rg-field:nth-child(3) { animation-delay: 0.19s; }
  .rg-field:nth-child(4) { animation-delay: 0.26s; }
  .rg-card {
    animation: floatUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .role-btn {
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.4, 1);
  }
  .role-btn:hover:not(.active) {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #e2e8f0 !important;
  }
  .strength-bar {
    transition: background 0.3s ease, width 0.3s ease;
  }
`;

const StyleTag = () => <style>{css}</style>;

/* ── Floating Particles / Medical Orbs ── */
const FloatingOrbs = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        top: `${15 + (i * 11)}%`,
        left: `${Math.sin(i) * 20 + 50}%`,
        width: 4 + (i % 3) * 3,
        height: 4 + (i % 3) * 3,
        borderRadius: '50%',
        background: `hsla(${260 + i * 15}, 80%, 65%, ${0.3 + (i % 3) * 0.15})`,
        animation: `orbit ${12 + i * 2}s linear infinite`,
        animationDelay: `${i * -1.5}s`,
        filter: 'blur(2px)',
        opacity: 0.5,
      }} />
    ))}
    {[...Array(5)].map((_, i) => (
      <div key={`rev-${i}`} style={{
        position: 'absolute',
        bottom: `${10 + i * 12}%`,
        right: `${20 + i * 8}%`,
        width: 6 + i * 2,
        height: 6 + i * 2,
        borderRadius: '50%',
        background: `hsla(${180 + i * 30}, 75%, 60%, 0.35)`,
        animation: `orbitReverse ${9 + i * 3}s linear infinite`,
        animationDelay: `${i * -1.2}s`,
        filter: 'blur(1.5px)',
      }} />
    ))}
  </div>
);

/* ── Medical Cross Decoration ── */
const MedicalCross = ({ size = 20, color = 'rgba(167, 139, 250, 0.2)', style = {} }) => (
  <div style={{ width: size, height: size, position: 'relative', ...style }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '20%',
      right: '20%',
      height: '2px',
      background: color,
      transform: 'translateY(-50%)',
      borderRadius: '2px',
    }} />
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '20%',
      bottom: '20%',
      width: '2px',
      background: color,
      transform: 'translateX(-50%)',
      borderRadius: '2px',
    }} />
  </div>
);

/* ── Heart Pulse Icon with Animation ── */
const HeartPulseIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="url(#heartGradient)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <polyline points="2 12 6 12 8 7 11 17 13 12 15 14 16 12 22 12" stroke="url(#heartGradient)" strokeWidth="1.4" />
  </svg>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  /* password strength calculation */
  useEffect(() => {
    const p = formData.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    setStrength(s);
  }, [formData.password]);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#f87171', '#fbbf24', '#4ade80', '#22c55e'];
  const strengthWidth = ['0%', '25%', '50%', '75%', '100%'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome aboard! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1.5px solid rgba(71, 85, 105, 0.3)',
    borderRadius: '14px',
    color: '#f1f5f9',
    fontSize: '15px',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: '500',
    boxSizing: 'border-box',
    backdropFilter: 'blur(4px)',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  return (
    <>
      <StyleTag />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        background: 'radial-gradient(ellipse at 20% 30%, #0a0f1c, #030712)',
        overflow: 'hidden',
        fontFamily: 'DM Sans, sans-serif',
      }}>

        {/* Animated Gradient Blobs */}
        <div style={{
          position: 'absolute',
          width: '70vw',
          height: '70vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109, 40, 217, 0.4) 0%, transparent 70%)',
          top: '-20%',
          left: '-20%',
          filter: 'blur(80px)',
          animation: 'bgDrift 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          maxWidth: '600px',
          maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          bottom: '-15%',
          right: '-15%',
          filter: 'blur(80px)',
          animation: 'bgDrift 22s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          maxWidth: '450px',
          maxHeight: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
          top: '50%',
          left: '60%',
          filter: 'blur(70px)',
          animation: 'bgDrift 25s ease-in-out infinite',
        }} />

        {/* Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(71, 85, 105, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(71, 85, 105, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        }} />

        {/* Decorative Crosses */}
        <MedicalCross size={28} style={{ position: 'absolute', top: '6%', left: '8%', opacity: 0.4 }} />
        <MedicalCross size={18} style={{ position: 'absolute', top: '20%', right: '12%', opacity: 0.3 }} />
        <MedicalCross size={22} style={{ position: 'absolute', bottom: '15%', left: '10%', opacity: 0.35 }} />
        <MedicalCross size={14} style={{ position: 'absolute', bottom: '25%', right: '8%', opacity: 0.25 }} />
        <MedicalCross size={16} style={{ position: 'absolute', top: '45%', left: '5%', opacity: 0.2 }} />
        <MedicalCross size={20} style={{ position: 'absolute', bottom: '8%', right: '18%', opacity: 0.3 }} />

        <FloatingOrbs />

        {/* Main Card */}
        <div className="rg-card" style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(10, 15, 27, 0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(71, 85, 105, 0.25)',
          borderRadius: '32px',
          padding: '44px 40px',
          position: 'relative',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}>

          {/* Card Top Glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), rgba(56, 189, 248, 0.6), transparent)',
          }} />

          {/* Card Bottom Glow */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.4), rgba(56, 189, 248, 0.4), transparent)',
          }} />

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '20px' }}>
              <div style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '50%',
                background: 'rgba(167, 139, 250, 0.15)',
                animation: 'pulseRing 2.5s ease-out infinite',
              }} />
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, rgba(109, 40, 217, 0.35), rgba(6, 182, 212, 0.25))',
                border: '1.5px solid rgba(167, 139, 250, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              }}>
                <HeartPulseIcon />
              </div>
            </div>

            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '34px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 8px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}>
              Create Account
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px',
              letterSpacing: '0.02em',
            }}>
              Join{' '}
              <span style={{
                background: 'linear-gradient(90deg, #c084fc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}>
                MedTech
              </span>
              {' '}today
            </p>
          </div>

          {/* Role Toggle */}
          <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <p style={{ ...labelStyle, textAlign: 'center', marginBottom: '14px', color: '#7e8ba0' }}>
              Account Type
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '60px',
              padding: '5px',
            }}>
              {['patient', 'doctor'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`role-btn ${formData.role === r ? 'active' : ''}`}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    letterSpacing: '0.03em',
                    transition: 'all 0.25s',
                    background: formData.role === r
                      ? 'linear-gradient(120deg, #6d28d9, #4f46e5)'
                      : 'transparent',
                    color: formData.role === r ? '#fff' : '#7e8ba0',
                    boxShadow: formData.role === r
                      ? '0 6px 18px rgba(109, 40, 217, 0.4)'
                      : 'none',
                  }}
                >
                  {r === 'patient' ? '🧑‍⚕️ Patient' : '👨‍⚕️ Doctor'}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            {/* Full Name */}
            <div className="rg-field" style={{ marginBottom: '22px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}>👤</span>
                <input
                  className="rg-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  style={{ ...inputStyle, paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="rg-field" style={{ marginBottom: '22px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}>📧</span>
                <input
                  className="rg-input"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  style={{ ...inputStyle, paddingLeft: '44px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="rg-field" style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}>🔒</span>
                <input
                  className="rg-input"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '52px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#7e8ba0',
                    fontSize: '18px',
                    lineHeight: 1,
                    padding: '8px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7e8ba0'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '6px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '20px',
                    padding: '2px',
                  }}>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '20px',
                      background: strength >= 1 ? strengthColor[strength] : 'rgba(71, 85, 105, 0.3)',
                      width: strengthWidth[strength],
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: strengthColor[strength] || '#64748b',
                    }}>
                      {strengthLabel[strength]}
                    </span>
                    <span style={{ fontSize: '10px', color: '#475569' }}>
                      {strength === 4 ? 'Excellent!' : strength === 3 ? 'Good!' : 'Add more characters'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="rg-btn"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: '0.03em',
                cursor: loading ? 'default' : 'pointer',
                marginTop: '32px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'orbit 0.8s linear infinite',
                  }} />
                  Creating account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '32px 0 20px',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(71, 85, 105, 0.3)' }} />
            <span style={{ color: '#475569', fontSize: '12px', fontWeight: 500 }}>already a member?</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(71, 85, 105, 0.3)' }} />
          </div>

          {/* Sign In Link */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                borderRadius: '40px',
                background: 'linear-gradient(120deg, rgba(109, 40, 217, 0.15), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(167, 139, 250, 0.35)',
                color: '#c084fc',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(120deg, rgba(109, 40, 217, 0.25), rgba(59, 130, 246, 0.2))';
                e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
                e.currentTarget.style.color = '#e9d5ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(120deg, rgba(109, 40, 217, 0.15), rgba(59, 130, 246, 0.1))';
                e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.35)';
                e.currentTarget.style.color = '#c084fc';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;