import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ── Google Fonts ── inject once */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap';
document.head.appendChild(fontLink);

/* ── Keyframe CSS ── */
const css = `
  @keyframes floatUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(1);   opacity:.6; }
    100% { transform:scale(1.55);opacity:0;  }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes orbit {
    from { transform:rotate(0deg)   translateX(110px) rotate(0deg); }
    to   { transform:rotate(360deg) translateX(110px) rotate(-360deg); }
  }
  @keyframes orbitReverse {
    from { transform:rotate(0deg)   translateX(75px) rotate(0deg); }
    to   { transform:rotate(-360deg) translateX(75px) rotate(360deg); }
  }
  @keyframes bgDrift {
    0%,100% { background-position: 0% 50%;   }
    50%      { background-position: 100% 50%; }
  }
  .rg-input { transition: border-color .25s, box-shadow .25s; }
  .rg-input:focus {
    outline:none;
    border-color:#a78bfa !important;
    box-shadow:0 0 0 3px rgba(167,139,250,.18);
  }
  .rg-input::placeholder { color:#94a3b8; }
  .rg-btn {
    background: linear-gradient(100deg,#6d28d9,#2563eb,#06b6d4);
    background-size: 200% auto;
    transition: background-position .5s, transform .2s, box-shadow .2s;
  }
  .rg-btn:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(109,40,217,.45);
  }
  .rg-btn:active:not(:disabled) { transform:translateY(0); }
  .rg-btn:disabled { opacity:.65; cursor:not-allowed; }
  .rg-field { animation: floatUp .55s ease both; }
  .rg-field:nth-child(1){ animation-delay:.1s; }
  .rg-field:nth-child(2){ animation-delay:.18s; }
  .rg-field:nth-child(3){ animation-delay:.26s; }
  .rg-field:nth-child(4){ animation-delay:.34s; }
  .rg-card { animation: floatUp .6s ease both; }
`;

const StyleTag = () => <style>{css}</style>;

/* ── Floating DNA / Medical orbs ── */
const OrbField = () => (
  <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
    {/* large slow orbit */}
    {[...Array(6)].map((_,i) => (
      <div key={i} style={{
        position:'absolute',
        top:'50%', left:'50%',
        width: 10 + i*3,
        height: 10 + i*3,
        borderRadius:'50%',
        background:`hsla(${220+i*30},80%,72%,.55)`,
        animation:`orbit ${14+i*4}s linear infinite`,
        animationDelay:`${i * -2.5}s`,
        filter:'blur(1px)',
      }} />
    ))}
    {[...Array(4)].map((_,i) => (
      <div key={i} style={{
        position:'absolute',
        top:'50%', left:'50%',
        width: 6 + i*2,
        height: 6 + i*2,
        borderRadius:'50%',
        background:`hsla(${280+i*20},85%,70%,.5)`,
        animation:`orbitReverse ${10+i*3}s linear infinite`,
        animationDelay:`${i * -1.8}s`,
        filter:'blur(1px)',
      }} />
    ))}
  </div>
);

/* ── Cross / Plus decorations ── */
const Cross = ({ size=18, color='rgba(255,255,255,.18)', style={} }) => (
  <div style={{ width:size, height:size, position:'relative', ...style }}>
    <div style={{ position:'absolute', top:'50%', left:0, right:0, height:2, background:color, transform:'translateY(-50%)' }} />
    <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:2, background:color, transform:'translateX(-50%)' }} />
  </div>
);

/* ── HeartPulse SVG icon ── */
const HeartPulse = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#hg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#38bdf8"/>
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    <polyline points="2 12 6 12 8 7 11 17 13 12 15 14 16 12 22 12" stroke="url(#hg)" strokeWidth="1.4"/>
  </svg>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name:'', email:'', password:'', role:'patient' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);

  /* password strength */
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
  const strengthColor = ['', '#f87171', '#fb923c', '#facc15', '#4ade80'];

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  /* shared input style */
  const inputStyle = {
    width:'100%',
    padding:'12px 14px',
    background:'rgba(255,255,255,.06)',
    border:'1.5px solid rgba(148,163,184,.2)',
    borderRadius:'10px',
    color:'#f1f5f9',
    fontSize:'14.5px',
    fontFamily:'DM Sans, sans-serif',
    boxSizing:'border-box',
  };

  const labelStyle = {
    display:'block',
    marginBottom:'7px',
    fontSize:'12.5px',
    fontWeight:'500',
    color:'#94a3b8',
    letterSpacing:'.06em',
    textTransform:'uppercase',
  };

  return (
    <>
      <StyleTag />

      {/* ── Full-page backdrop ── */}
      <div style={{
        minHeight:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'24px',
        position:'relative',
        background:'#0b0f1a',
        overflow:'hidden',
        fontFamily:'DM Sans, sans-serif',
      }}>

        {/* animated gradient blobs */}
        <div style={{
          position:'absolute', width:600, height:600,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(109,40,217,.35) 0%, transparent 70%)',
          top:'-15%', left:'-10%',
          filter:'blur(40px)',
          animation:'bgDrift 12s ease-in-out infinite',
        }} />
        <div style={{
          position:'absolute', width:500, height:500,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(6,182,212,.25) 0%, transparent 70%)',
          bottom:'-10%', right:'-8%',
          filter:'blur(40px)',
          animation:'bgDrift 16s ease-in-out infinite reverse',
        }} />
        <div style={{
          position:'absolute', width:350, height:350,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(37,99,235,.2) 0%, transparent 70%)',
          top:'40%', left:'60%',
          filter:'blur(40px)',
        }} />

        {/* subtle grid lines */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(148,163,184,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.05) 1px,transparent 1px)',
          backgroundSize:'48px 48px',
        }} />

        {/* decorative crosses */}
        <Cross size={22} style={{ position:'absolute', top:'8%',  left:'12%' }} />
        <Cross size={14} style={{ position:'absolute', top:'18%', right:'14%' }} />
        <Cross size={18} style={{ position:'absolute', bottom:'12%', left:'8%' }} />
        <Cross size={12} style={{ position:'absolute', bottom:'20%', right:'10%' }} />

        {/* ── Card ── */}
        <div className="rg-card" style={{
          width:'100%',
          maxWidth:'440px',
          background:'rgba(15,23,42,.75)',
          backdropFilter:'blur(24px)',
          WebkitBackdropFilter:'blur(24px)',
          border:'1px solid rgba(148,163,184,.12)',
          borderRadius:'20px',
          padding:'40px 36px',
          position:'relative',
          boxShadow:'0 32px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.06)',
          overflow:'hidden',
        }}>

          {/* card inner glow */}
          <div style={{
            position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
            width:'70%', height:2,
            background:'linear-gradient(90deg,transparent,rgba(167,139,250,.6),transparent)',
          }} />

          {/* orbiting dots (card-level) */}
          <div style={{ position:'absolute', top:'50%', left:'50%', pointerEvents:'none' }}>
            <OrbField />
          </div>

          {/* ── Header ── */}
          <div style={{ textAlign:'center', marginBottom:'36px', position:'relative' }}>
            {/* icon halo */}
            <div style={{ position:'relative', display:'inline-flex', marginBottom:'20px' }}>
              <div style={{
                position:'absolute', inset:0,
                borderRadius:'50%',
                background:'rgba(167,139,250,.15)',
                animation:'pulse-ring 2.4s ease-out infinite',
              }} />
              <div style={{
                width:68, height:68,
                borderRadius:'50%',
                background:'linear-gradient(135deg,rgba(109,40,217,.3),rgba(6,182,212,.2))',
                border:'1.5px solid rgba(167,139,250,.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative', zIndex:1,
              }}>
                <HeartPulse />
              </div>
            </div>

            <h1 style={{
              fontFamily:'Playfair Display, serif',
              fontSize:'28px',
              fontWeight:700,
              color:'#f1f5f9',
              margin:'0 0 8px',
              lineHeight:1.15,
              letterSpacing:'-.01em',
            }}>
              Create Account
            </h1>
            <p style={{ margin:0, color:'#64748b', fontSize:'14px', letterSpacing:'.02em' }}>
              Join&nbsp;<span style={{
                background:'linear-gradient(90deg,#a78bfa,#38bdf8)',
                WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent',
                fontWeight:600,
              }}>MedTech</span>&nbsp;today
            </p>
          </div>

          {/* ── Role toggle (pill) ── */}
          <div style={{ marginBottom:'28px', position:'relative', zIndex:1 }}>
            <p style={{ ...labelStyle, textAlign:'center', marginBottom:'12px' }}>I am a</p>
            <div style={{
              display:'flex', gap:'8px',
              background:'rgba(255,255,255,.04)',
              border:'1px solid rgba(148,163,184,.1)',
              borderRadius:'12px',
              padding:'5px',
            }}>
              {['patient','doctor'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({...formData, role:r})}
                  style={{
                    flex:1,
                    padding:'10px',
                    borderRadius:'9px',
                    border:'none',
                    cursor:'pointer',
                    fontSize:'14px',
                    fontWeight:600,
                    fontFamily:'DM Sans, sans-serif',
                    letterSpacing:'.03em',
                    transition:'all .25s',
                    background: formData.role === r
                      ? 'linear-gradient(120deg,#6d28d9,#2563eb)'
                      : 'transparent',
                    color: formData.role === r ? '#fff' : '#64748b',
                    boxShadow: formData.role === r ? '0 4px 14px rgba(109,40,217,.4)' : 'none',
                  }}
                >
                  {r === 'patient' ? '🧑‍⚕️  Patient' : '👨‍💼  Doctor'}
                </button>
              ))}
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ position:'relative', zIndex:1 }}>

            {/* Full Name */}
            <div className="rg-field" style={{ marginBottom:'18px' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:15, opacity:.5 }}>✦</span>
                <input
                  className="rg-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name:e.target.value})}
                  placeholder="Your full name"
                  style={{ ...inputStyle, paddingLeft:'36px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="rg-field" style={{ marginBottom:'18px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:.5 }}>@</span>
                <input
                  className="rg-input"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email:e.target.value})}
                  placeholder="you@example.com"
                  style={{ ...inputStyle, paddingLeft:'36px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="rg-field" style={{ marginBottom:'10px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:.5 }}>🔒</span>
                <input
                  className="rg-input"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password:e.target.value})}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  style={{ ...inputStyle, paddingLeft:'36px', paddingRight:'44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer',
                    color:'#64748b', fontSize:15, lineHeight:1,
                  }}
                >{showPass ? '🙈' : '👁'}</button>
              </div>

              {/* strength bar */}
              {formData.password && (
                <div style={{ marginTop:8 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{
                        flex:1, height:3, borderRadius:99,
                        background: i <= strength ? strengthColor[strength] : 'rgba(148,163,184,.15)',
                        transition:'background .3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ margin:0, fontSize:11.5, color: strengthColor[strength] || '#64748b' }}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="rg-btn"
              disabled={loading}
              style={{
                width:'100%',
                padding:'14px',
                border:'none',
                borderRadius:'12px',
                color:'#fff',
                fontSize:'15px',
                fontWeight:700,
                fontFamily:'DM Sans, sans-serif',
                letterSpacing:'.04em',
                cursor:'pointer',
                marginTop:'24px',
                position:'relative',
                overflow:'hidden',
              }}
            >
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <span style={{
                    width:16, height:16, border:'2.5px solid rgba(255,255,255,.3)',
                    borderTopColor:'#fff', borderRadius:'50%',
                    display:'inline-block',
                    animation:'orbit .75s linear infinite',
                  }} />
                  Creating account…
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          {/* ── Divider ── */}
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            margin:'24px 0 0',
            position:'relative', zIndex:1,
          }}>
            <div style={{ flex:1, height:1, background:'rgba(148,163,184,.1)' }} />
            <span style={{ color:'#334155', fontSize:12 }}>already a member?</span>
            <div style={{ flex:1, height:1, background:'rgba(148,163,184,.1)' }} />
          </div>

          <div style={{ textAlign:'center', marginTop:'14px', position:'relative', zIndex:1 }}>
            <Link to="/login" style={{
              display:'inline-block',
              padding:'10px 28px',
              borderRadius:'9px',
              border:'1.5px solid rgba(167,139,250,.3)',
              color:'#a78bfa',
              fontSize:'14px',
              fontWeight:600,
              textDecoration:'none',
              transition:'all .25s',
              background:'rgba(167,139,250,.06)',
            }}
            onMouseOver={e => { e.currentTarget.style.background='rgba(167,139,250,.15)'; e.currentTarget.style.borderColor='rgba(167,139,250,.6)'; }}
            onMouseOut={e => { e.currentTarget.style.background='rgba(167,139,250,.06)'; e.currentTarget.style.borderColor='rgba(167,139,250,.3)'; }}
            >
              Sign In
            </Link>
          </div>

          {/* bottom glow line */}
          <div style={{
            position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
            width:'60%', height:2,
            background:'linear-gradient(90deg,transparent,rgba(56,189,248,.5),transparent)',
          }} />

        </div>
      </div>
    </>
  );
};

export default Register;
