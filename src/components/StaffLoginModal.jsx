import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ─── STAFF LOGIN MODAL ────────────────────────────────────────────────────────

const STAFF_CREDENTIALS = [
  { username:"admin",   password:"admin123",  role:"Manager",         icon:"👔" },
  { username:"chef",    password:"chef123",   role:"Head Chef",       icon:"👨‍🍳" },
  { username:"staff1",  password:"staff123",  role:"Kitchen Staff",   icon:"🧑‍🍳" },
  { username:"waiter1", password:"waiter123", role:"Senior Waiter",   icon:"🍽️" },
];

function StaffLoginModal({ accentColor, onSuccess, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [attempts,  setAttempts]  = useState(0);
  const [locked,    setLocked]    = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Lockout countdown
  useEffect(() => {
    if (!locked) return;
    const t = setInterval(() => {
      setLockTimer(n => {
        if (n <= 1) { setLocked(false); setAttempts(0); clearInterval(t); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [locked]);

  const handleLogin = () => {
    if (locked) return;
    if (!username.trim() || !password.trim()) { setError("Please enter both username and password."); return; }
    setLoading(true);
    setError("");
    // Simulate auth delay
    setTimeout(() => {
      const match = STAFF_CREDENTIALS.find(
        c => c.username === username.trim().toLowerCase() && c.password === password
      );
      if (match) {
        setLoading(false);
        onSuccess(match.role);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setLoading(false);
        if (newAttempts >= 3) {
          setLocked(true);
          setLockTimer(30);
          setError("Too many failed attempts. Locked for 30 seconds.");
        } else {
          setError(`Incorrect username or password. ${3 - newAttempts} attempt${3-newAttempts!==1?"s":""} remaining.`);
        }
      }
    }, 800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:1000,
        background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        animation:"fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"#fff", borderRadius:26, width:"100%", maxWidth:420,
          boxShadow:"0 32px 80px rgba(0,0,0,0.35)",
          overflow:"hidden",
          animation:"loginPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{
          background:`linear-gradient(135deg,#1a1a2e,#16213e)`,
          padding:"32px 32px 28px",
          position:"relative", textAlign:"center",
        }}>
          <button onClick={onClose} style={{
            position:"absolute", top:14, right:14,
            background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%",
            width:32, height:32, cursor:"pointer", color:"rgba(255,255,255,0.7)",
            fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>

          <div style={{
            width:72, height:72, borderRadius:22, margin:"0 auto 16px",
            background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:34, boxShadow:`0 8px 24px ${accentColor}55`,
          }}>🔐</div>

          <div style={{ fontSize:10, fontWeight:700, color:`${accentColor}bb`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>Restricted Access</div>
          <h2 style={{ margin:0, fontSize:22, fontWeight:900, color:"#fff" }}>Staff Dashboard</h2>
          <p style={{ margin:"8px 0 0", fontSize:12, color:"rgba(255,255,255,0.4)" }}>Enter your staff credentials to continue</p>
        </div>

        {/* Form */}
        <div style={{ padding:"28px 32px 32px" }}>

          {/* Username */}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#374151", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.5px" }}>
              👤 Username
            </label>
            <input
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={e => e.key==="Enter" && handleLogin()}
              placeholder="Enter your username"
              autoFocus
              disabled={locked}
              style={{
                width:"100%", boxSizing:"border-box",
                background: locked ? "#f9fafb" : "#f9fafb",
                border:`2px solid ${error&&!loading?"#fca5a5":username?"#bbf7d0":"#e5e7eb"}`,
                borderRadius:13, padding:"12px 16px", fontSize:14, color:"#111827",
                outline:"none", fontFamily:"inherit", transition:"border-color 0.2s",
              }}
              onFocus={e=>e.target.style.borderColor=accentColor}
              onBlur={e=>e.target.style.borderColor=error?"#fca5a5":username?"#bbf7d0":"#e5e7eb"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#374151", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.5px" }}>
              🔑 Password
            </label>
            <div style={{ position:"relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key==="Enter" && handleLogin()}
                placeholder="Enter your password"
                disabled={locked}
                style={{
                  width:"100%", boxSizing:"border-box",
                  background:"#f9fafb",
                  border:`2px solid ${error&&!loading?"#fca5a5":password?"#bbf7d0":"#e5e7eb"}`,
                  borderRadius:13, padding:"12px 46px 12px 16px", fontSize:14, color:"#111827",
                  outline:"none", fontFamily:"inherit", transition:"border-color 0.2s",
                }}
                onFocus={e=>e.target.style.borderColor=accentColor}
                onBlur={e=>e.target.style.borderColor=error?"#fca5a5":password?"#bbf7d0":"#e5e7eb"}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                style={{
                  position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9ca3af",
                }}
              >{showPass ? "🙈" : "👁️"}</button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:"#fff5f5", border:"1px solid #fecaca", borderRadius:11,
              padding:"10px 14px", marginBottom:16, fontSize:12, color:"#dc2626",
              display:"flex", alignItems:"center", gap:8,
            }}>
              <span>⚠️</span>
              <span>{error}</span>
              {locked && <strong style={{ marginLeft:"auto" }}>{lockTimer}s</strong>}
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || locked}
            style={{
              width:"100%", padding:"14px",
              background: locked ? "#e5e7eb" : loading ? `${accentColor}99` : `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
              border:"none", borderRadius:14, color: locked ? "#9ca3af" : "#fff",
              fontWeight:800, fontSize:15, cursor: locked||loading ? "not-allowed" : "pointer",
              fontFamily:"inherit",
              boxShadow: locked ? "none" : `0 6px 20px ${accentColor}44`,
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"all 0.2s", marginBottom:20,
            }}
          >
            {loading ? (
              <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⏳</span> Verifying…</>
            ) : locked ? (
              `🔒 Locked (${lockTimer}s)`
            ) : (
              "🔐 Login to Staff Dashboard"
            )}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes loginPop { 0%{transform:scale(0.85) translateY(20px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes spin     { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}


export default StaffLoginModal;
