import { useState } from 'react';

// ─── ORBIT ────────────────────────────────────────────────────────────────────

function OrbitDisplay({ slide, centerEmoji, accentColor }) {
  const ORBIT_R=100, SMALL_R=32, CENTER=140, SIZE=CENTER*2, N=slide.length;
  const positions = slide.map((_,i) => {
    const a = (2*Math.PI*i)/N - Math.PI/2;
    return { x: CENTER+ORBIT_R*Math.cos(a), y: CENTER+ORBIT_R*Math.sin(a) };
  });
  return (
    <div style={{ position:"relative", width:SIZE, height:SIZE, flexShrink:0 }}>
      <svg width={SIZE} height={SIZE} style={{ position:"absolute",top:0,left:0,pointerEvents:"none" }}>
        <circle cx={CENTER} cy={CENTER} r={ORBIT_R} fill="none" stroke={accentColor+"44"} strokeWidth={1.5} strokeDasharray="6 5"/>
      </svg>
      {positions.map((pos,i) => (
        <div key={i} title={slide[i].name} style={{
          position:"absolute", left:pos.x-SMALL_R, top:pos.y-SMALL_R,
          width:SMALL_R*2, height:SMALL_R*2, borderRadius:"50%",
          background:"rgba(255,255,255,0.93)", border:"2px solid rgba(255,255,255,0.98)",
          boxShadow:"0 4px 14px rgba(0,0,0,0.1)", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:24, overflow:"hidden",
          animation:`floatOrbit ${3.5+(i%3)*0.5}s ease-in-out ${i*0.18}s infinite`,
        }}>
          {slide[i].image ? (
            <img src={slide[i].image} alt={slide[i].name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          ) : slide[i].emoji}
        </div>
      ))}
      <div style={{
        position:"absolute", left:CENTER-56, top:CENTER-56, width:112, height:112,
        borderRadius:"50%", background:"rgba(255,255,255,0.97)",
        border:"4px solid #fff", boxShadow:"0 8px 32px rgba(0,0,0,0.13)",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, overflow:"hidden",
        transition:"all 0.45s cubic-bezier(0.34,1.56,0.64,1)", zIndex:2,
      }}>
        {typeof centerEmoji === "string" && centerEmoji.startsWith("/") ? (
          <img src={centerEmoji} alt="Featured dish" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        ) : centerEmoji}
      </div>
    </div>
  );
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────

function Stars({ rating, color="#f5a623", size=14 }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:size, color: i <= Math.floor(rating) ? color : i-0.5 <= rating ? color : "#ddd" }}>
          {i <= Math.floor(rating) ? "★" : i-0.5 <= rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

// Stars function eka define kalata PASSE StarRow ekata assign karanna
const StarRow = Stars;

export { OrbitDisplay, Stars, StarRow };