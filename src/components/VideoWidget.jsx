import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

function VideoWidget({ accentColor, onViewMenu }) {
  const [playing,    setPlaying]    = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sceneIdx,   setSceneIdx]   = useState(0);
  const [progress,   setProgress]   = useState(0);
  const [liked,      setLiked]      = useState(false);
  const intervalRef  = useRef(null);

  const scene = videoScenes[sceneIdx];

  useEffect(() => {
    if (!playing) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + 0.55;
        if (next >= 100) {
          setPlaying(false);
          setSceneIdx(0);
          return 0;
        }

        setSceneIdx(Math.min(
          Math.floor((next / 100) * videoScenes.length), videoScenes.length - 1
        ));
        return next;
      });
    }, 80);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const toggle = () => {
    if (progress >= 100) { setProgress(0); setSceneIdx(0); }
    setPlaying(p => !p);
  };

  const currentChapterIdx = videoChapters.reduce((acc, ch, i) => progress >= ch.pct ? i : acc, 0);
  const currentChapter    = videoChapters[currentChapterIdx];

  if (fullscreen) return (
    <div
      onClick={() => { setFullscreen(false); setPlaying(false); }}
      style={{
        position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"modalFadeIn 0.25s ease",
      }}
    >
      <div onClick={e=>e.stopPropagation()} style={{
        width:"min(760px,94vw)", background:"#0d0d1a", borderRadius:28, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.8)", border:"1px solid rgba(255,255,255,0.07)", animation:"modalSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>

        <div style={{
          height:340, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background: scene.bg, cursor:"pointer",
        }} onClick={toggle}>

          <div style={{
            position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 50%, ${accentColor}18 0%, transparent 70%)`, opacity: playing ? 1 : 0.5, transition:"opacity 0.4s",
          }}/>

          <div style={{
            fontSize:130, zIndex:2, userSelect:"none", filter:`drop-shadow(0 8px 32px ${accentColor}55)`, animation: playing ? "sceneFloat 3s ease-in-out infinite" : "none", transition:"font-size 0.3s",
          }}>{scene.emoji}</div>

          {!playing && (
            <div style={{
              position:"absolute", inset:0, zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.35)",
            }}>
              <div style={{
                width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, boxShadow:`0 8px 28px ${accentColor}66`, animation:"playPulse 2s ease-in-out infinite",
              }}>▶</div>
            </div>
          )}

          <div style={{
            position:"absolute", bottom:16, left:0, right:0, textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.55)", fontStyle:"italic", letterSpacing:"0.3px",
          }}>{scene.desc}</div>

          <button onClick={()=>{ setFullscreen(false); setPlaying(false); }} style={{
            position:"absolute", top:14, right:14, zIndex:10, width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>

        <div style={{ padding:"20px 24px" }}>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>{currentChapter.emoji}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{currentChapter.title}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>
                  Smart Restaurant · Est. 2025
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"rgba(255,255,255,0.35)" }}>
              {playing && (
                <span style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"liveDot2 1.4s ease-in-out infinite" }}/>
              )}
              {playing ? "LIVE" : `${Math.floor(progress)}% watched`}
            </div>
          </div>

          <div
            style={{ height:5, background:"rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden", marginBottom:14, cursor:"pointer" }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct  = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, pct)));
              setSceneIdx(Math.min(Math.floor((pct/100)*videoScenes.length), videoScenes.length-1));
            }}
          >
            <div style={{
              height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${accentColor},${accentColor}cc)`, borderRadius:10, transition:"width 0.12s linear", boxShadow:`0 0 8px ${accentColor}66`,
            }}/>
          </div>

          <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
            {videoChapters.map((ch, i) => (
              <button key={i} onClick={()=>{ setProgress(ch.pct); setSceneIdx(Math.floor((ch.pct/100)*videoScenes.length)); }} style={{
                padding:"4px 10px", borderRadius:20, border:"none", background: currentChapterIdx===i ? `linear-gradient(135deg,${ch.color},${ch.color}cc)` : "rgba(255,255,255,0.07)", color: currentChapterIdx===i ? "#fff" : "rgba(255,255,255,0.4)", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
              }}>{ch.emoji} {ch.title}</button>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={toggle} style={{
              flex:1, padding:"11px", borderRadius:12, border:"none", background: playing
                ? "rgba(255,255,255,0.08)"
                : `linear-gradient(135deg,${accentColor},${accentColor}cc)`, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow: playing ? "none" : `0 6px 20px ${accentColor}44`,
            }}>
              {playing ? "⏸ Pause" : progress > 0 ? "▶ Resume" : "▶ Play"}
            </button>
            <button onClick={()=>setLiked(l=>!l)} style={{
              padding:"11px 16px", borderRadius:12, border:"none", background: liked ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)", color: liked ? "#ef4444" : "rgba(255,255,255,0.5)", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit",
            }}>
              {liked ? "❤️" : "🤍"}
            </button>
            <button onClick={()=>{ setFullscreen(false); setPlaying(false); onViewMenu && onViewMenu(); }} style={{
              padding:"11px 16px", borderRadius:12, border:`1px solid ${accentColor}55`, background:"transparent", color:accentColor, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
            }}>
              Menu →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes modalSlideUp { from{transform:translateY(40px) scale(0.95);opacity:0} to{transform:none;opacity:1} }
        @keyframes playPulse    { 0%,100%{box-shadow:0 4px 20px ${accentColor}66} 50%{box-shadow:0 4px 32px ${accentColor}aa,0 0 0 12px ${accentColor}18} }
        @keyframes sceneFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes liveDot2     { 0%,100%{box-shadow:0 0 0 2px #22c55e33} 50%{box-shadow:0 0 0 6px #22c55e11} }
        @keyframes bgPulse      { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes videoScene   { 0%{transform:scale(0.88);opacity:0.5} 100%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );

  return (
    <div style={{ margin:"12px 16px 0" }}>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:14 }}>🎬</span>
          <span style={{ fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.55)", letterSpacing:"1px", textTransform:"uppercase" }}>
            Our Restaurant
          </span>
        </div>
        {playing && (
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, color:"#22c55e" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"liveDot2 1.4s ease-in-out infinite" }}/>
            LIVE
          </div>
        )}
      </div>

      <div style={{
        borderRadius:16, overflow:"hidden", background: scene.bg, border:`1px solid ${accentColor}33`, boxShadow:`0 6px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)`, cursor:"pointer",
      }}>

        <div style={{ height:118, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}
          onClick={toggle}>

          <div style={{
            position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 40%, ${accentColor}1a 0%, transparent 65%)`, opacity: playing ? 1 : 0.5, transition:"opacity 0.35s",
          }}/>

          <div style={{
            fontSize:60, zIndex:2, userSelect:"none", filter:`drop-shadow(0 6px 16px ${accentColor}44)`, animation: playing ? "sceneFloat 3s ease-in-out infinite" : "none", transition:"font-size 0.25s",
          }}>{scene.emoji}</div>

          {!playing && (
            <div style={{
              position:"absolute", inset:0, zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.3)",
            }}>
              <div style={{
                width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 4px 18px ${accentColor}66`, animation:"playPulse 2s ease-in-out infinite",
              }}>▶</div>
            </div>
          )}

          <div style={{
            position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)", padding:"10px 10px 6px", display:"flex", justifyContent:"space-between", alignItems:"flex-end",
          }}>
            <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.65)" }}>
              {currentChapter.emoji} {currentChapter.title}
            </span>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>
              {Math.floor(progress)}%
            </span>
          </div>
        </div>

        <div style={{ height:3, background:"rgba(255,255,255,0.08)", position:"relative" }}>
          <div style={{
            height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${accentColor},${accentColor}cc)`, transition:"width 0.12s linear", boxShadow:`0 0 6px ${accentColor}88`,
          }}/>
        </div>

        <div style={{
          padding:"9px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(0,0,0,0.25)",
        }}>
          <button onClick={toggle} style={{
            padding:"5px 12px", borderRadius:8, border:"none", background: playing ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg,${accentColor},${accentColor}cc)`, color:"#fff", fontWeight:700, fontSize:10, cursor:"pointer", fontFamily:"inherit",
          }}>
            {playing ? "⏸" : progress > 0 ? "▶ Resume" : "▶ Watch"}
          </button>
          <button
            onClick={()=>{ setFullscreen(true); setPlaying(true); }}
            style={{
              padding:"5px 10px", borderRadius:8, border:`1px solid ${accentColor}44`, background:"transparent", color:accentColor, fontWeight:700, fontSize:10, cursor:"pointer", fontFamily:"inherit",
            }}>
            ⛶ Full
          </button>
        </div>
      </div>
    </div>
  );
}


export default VideoWidget;
