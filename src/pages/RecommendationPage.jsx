import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

// ─── RECOMMENDATION PAGE ──────────────────────────────────────────────────────

const moodProfiles = {
  Happy: {
    emoji: "😄",
    color: "#f5a623",
    bg: "linear-gradient(135deg,#fff3e0,#ffe0a0)",
    label: "You're Happy!",
    subtitle: "Celebrate with something indulgent!",
    tags: ["Sweet", "Rich", "Celebratory"],
    dishes: [
      { name: "Chocolate Fondant", image: "/images/Chocolate Fondant.jpg", price: "Rs. 1,450", reason: "A rich lava cake to match your bright mood!", id: 301, emoji: "🍫" },
      { name: "Blueberry Pancakes", image: "/images/pancake2.jpg", price: "Rs. 1,850", reason: "Sweet stacks — pure joy on a plate.", id: 1, emoji: "🥞" },
      { name: "Waffles & Cream", image: "/images/Waffles & Cream.jpg", price: "Rs. 1,670", reason: "Crispy, creamy, and celebratory!", id: 11, emoji: "🧇" },
      { name: "Mango Bubble Tea", image: "/images/Mango Bubble Tea.jpg", price: "Rs. 940", reason: "A sweet tropical treat for your smile.", id: 402, emoji: "🧋" },
    ],
  },
  Sad: {
    emoji: "😢",
    color: "#0277bd",
    bg: "linear-gradient(135deg,#e3f2fd,#b3e5fc)",
    label: "Feeling Down?",
    subtitle: "Comfort food is what you need right now.",
    tags: ["Comforting", "Warm", "Hearty"],
    dishes: [
      { name: "Tom Kha Soup", image: "/images/Tom Kha Soup.jpg", price: "Rs. 1,600", reason: "Warm, creamy broth — a hug in a bowl.", id: 104, emoji: "🥘" },
      { name: "Grilled Ribeye", image: "/images/Grilled Ribeye.jpg", price: "Rs. 4,800", reason: "A hearty steak to lift your spirits!", id: 201, emoji: "🥩" },
      { name: "Shakshuka", image: "/images/Shakshuka.jpg", price: "Rs. 2,050", reason: "Warm spiced eggs — deeply comforting.", id: 12, emoji: "🍳" },
      { name: "Tiramisu", image: "/images/Tiramisu.jpg", price: "Rs. 1,305", reason: "Sweet espresso dessert to cheer you up.", id: 308, emoji: "🍰" },
    ],
  },
  Angry: {
    emoji: "😠",
    color: "#c62828",
    bg: "linear-gradient(135deg,#fbe9e7,#ffccbc)",
    label: "Feeling Tense?",
    subtitle: "Cool down with something refreshing.",
    tags: ["Cooling", "Light", "Refreshing"],
    dishes: [
      { name: "Acai Bowl", image: "/images/Acai Bowl.jpg", price: "Rs. 2,000", reason: "Cold, fresh and energising — perfect reset.", id: 5, emoji: "🥣" },
      { name: "Fresh Fruit Platter", image: "/images/Fresh Fruit Platter.jpg", price: "Rs. 1,300", reason: "Light and calming natural sweetness.", id: 10, emoji: "🍇" },
      { name: "Matcha Latte", image: "/images/Matcha Latte.jpg", price: "Rs. 1,015", reason: "L-theanine in matcha naturally soothes.", id: 406, emoji: "🍵" },
      { name: "Garden Fresh Salad", image: "/images/Garden Fresh Salad.jpg", price: "Rs. 1,450", reason: "Clean, crisp and stress-relieving.", id: 101, emoji: "🥗" },
    ],
  },
  Surprised: {
    emoji: "😲",
    color: "#ad1457",
    bg: "linear-gradient(135deg,#fce4ec,#f8bbd0)",
    label: "Full of Energy!",
    subtitle: "Try something adventurous and exciting!",
    tags: ["Bold", "Adventurous", "Exciting"],
    dishes: [
      { name: "Lobster Thermidor", image: "/images/Lobster Thermidor.jpg", price: "Rs. 7,100", reason: "An adventurous luxurious choice!", id: 204, emoji: "🦞" },
      { name: "Duck Confit", image: "/images/Duck Confit.jpg", price: "Rs. 4,350", reason: "Bold rich flavours for your bold energy.", id: 208, emoji: "🦆" },
      { name: "Shakshuka", image: "/images/Shakshuka.jpg", price: "Rs. 2,050", reason: "Boldly spiced and deeply satisfying.", id: 12, emoji: "🍳" },
      { name: "Espresso Martini", image: "/images/Espresso Martini.jpg", price: "Rs. 1,885", reason: "An exciting kick to match your energy!", id: 408, emoji: "🍸" },
    ],
  },
  Neutral: {
    emoji: "😐",
    color: "#43a047",
    bg: "linear-gradient(135deg,#e8f5e9,#c8e6c9)",
    label: "Feeling Balanced",
    subtitle: "A wholesome balanced meal is perfect for you.",
    tags: ["Balanced", "Wholesome", "Nutritious"],
    dishes: [
      { name: "Avocado Toast", image: "/images/Avocado Toast.jpg", price: "Rs. 1,600", reason: "Clean, balanced and nutritious.", id: 3, emoji: "🥑" },
      { name: "Grain Buddha Bowl", image: "/images/Grain Buddha Bowl.jpg", price: "Rs. 1,960", reason: "A perfectly balanced wholesome bowl.", id: 106, emoji: "🥙" },
      { name: "Salmon Teriyaki", image: "/images/Salmon Teriyaki.jpg", price: "Rs. 3,620", reason: "Lean protein and healthy fats — balanced.", id: 205, emoji: "🍣" },
      { name: "Green Smoothie", image: "/images/Green Smoothie.jpg", price: "Rs. 1,160", reason: "Nutrient-packed and energising.", id: 403, emoji: "🥤" },
    ],
  },
  Tired: {
    emoji: "😴",
    color: "#5c6bc0",
    bg: "linear-gradient(135deg,#ede7f6,#d1c4e9)",
    label: "Feeling Tired?",
    subtitle: "Energise yourself with power-packed foods!",
    tags: ["Energising", "Protein-Rich", "Power"],
    dishes: [
      { name: "Eggs Benedict", image: "/images/Eggs Benedict.jpg", price: "Rs. 2,100", reason: "Protein-rich to wake you right up!", id: 2, emoji: "🥚" },
      { name: "Cold Brew Coffee", image: "/images/Cold Brew Coffee.jpg", price: "Rs. 870", reason: "The perfect caffeine boost you need.", id: 401, emoji: "☕" },
      { name: "Grilled Ribeye", image: "/images/Grilled Ribeye.jpg", price: "Rs. 4,800", reason: "Iron-rich steak to fuel your energy.", id: 201, emoji: "🥩" },
      { name: "Beef Burger", image: "/images/Beef Burger.jpg", price: "Rs. 2,900", reason: "Hearty and filling — recharge mode on.", id: 999, emoji: "🍔" },
    ],
  },
};

const moodEmojis = ["😄","😢","😠","😲","😐","😴"];
const moodKeys   = ["Happy","Sad","Angry","Surprised","Neutral","Tired"];

function RecommendationPage({ onBack, accentColor, onDishSelect, onViewCart, cartItems = [], setCartItems }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const animationFrameRef = useRef(null);
  const dotIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const videoReadyRef = useRef(false);

  const [stage, setStage]         = useState("intro");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState(0);
  const [detectedMood, setDetectedMood] = useState(null);
  const [cameraError, setCameraError]   = useState(null);
  const [scanDots, setScanDots]   = useState([]);
  const [faceBox, setFaceBox]     = useState(null);
  const [manualMood, setManualMood] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api models (original)
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log("✅ Models loaded successfully");
      } catch (error) {
        console.error("Failed to load face-api models:", error);
      }
    };
    loadModels();
  }, []);

  const scanPhrases = [
    "Initialising camera…",
    "Detecting face…",
    "Analysing facial features…",
    "Reading micro-expressions…",
    "Mapping emotion vectors…",
    "Consulting flavour AI…",
    "Crafting your recommendations…",
  ];

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (dotIntervalRef.current) clearInterval(dotIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current && streamRef.current.getTracks) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    videoReadyRef.current = false;
  };

  const startCamera = async () => {
    if (!modelsLoaded) {
      setCameraError("AI models are still loading. Please wait a moment and try again.");
      return;
    }

    setCameraError(null);
    setStage("scanning");
    setScanProgress(0);
    setScanPhase(0);
    setScanDots([]);
    setFaceBox(null);
    videoReadyRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode:"user", width:640, height:480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve).catch(resolve);
          };
          setTimeout(resolve, 1500);
        });

        // Ensure video dimensions
        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Set canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth || 640;
          canvasRef.current.height = videoRef.current.videoHeight || 480;
        }

        videoReadyRef.current = true;
        console.log("✅ Video ready, starting scan...");
        setTimeout(() => runScanAnimation(), 300);
      }
    } catch (e) {
      console.error("Camera error:", e);
      setCameraError("Camera access denied. Please allow camera permissions and try again.");
      setStage("intro");
    }
  };

  const pickMoodFromEmotions = (expressions) => {
    if (!expressions) return "Neutral";
    const emotionToMood = {
      happy: "Happy",
      sad: "Sad",
      angry: "Angry",
      surprised: "Surprised",
      fearful: "Tired",
      disgusted: "Angry",
      neutral: "Neutral"
    };

    let maxConfidence = 0;
    let detectedEmotion = "neutral";
    Object.entries(expressions).forEach(([emotion, confidence]) => {
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        detectedEmotion = emotion;
      }
    });
    return emotionToMood[detectedEmotion] || "Neutral";
  };

  // ─── SCANNING ANIMATION (canvas-based detection) ──────────────────────────
  const runScanAnimation = () => {
    if (!isMountedRef.current) return;
    if (!videoReadyRef.current) {
      setTimeout(() => runScanAnimation(), 300);
      return;
    }
    if (!modelsLoaded) {
      setCameraError("Models not loaded. Please wait and try again.");
      setStage("intro");
      return;
    }

    console.log("🔄 Starting scan animation...");

    const startTime = Date.now();
    const detectionDuration = 4000; // 4 seconds

    if (dotIntervalRef.current) clearInterval(dotIntervalRef.current);
    dotIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setScanDots(prev => {
        const newDots = [...prev, {
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          id: Date.now() + Math.random(),
        }].slice(-20);
        return newDots;
      });
    }, 180);

    setTimeout(() => setFaceBox({ x: 22, y: 12, w: 56, h: 70 }), 800);

    let isFinished = false;

    const detectFace = async () => {
      if (!isMountedRef.current) return;

      const elapsed = Date.now() - startTime;
      let progress = Math.min((elapsed / detectionDuration) * 100, 95);

      // Draw video frame on canvas and detect
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        try {
          const detections = await faceapi
            .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detections.length > 0) {
            progress = Math.min(progress + 10, 95);
            const box = detections[0].detection.box;
            const vw = canvas.width;
            const vh = canvas.height;
            setFaceBox({
              x: (box.x / vw) * 100,
              y: (box.y / vh) * 100,
              w: (box.width / vw) * 100,
              h: (box.height / vh) * 100,
            });
          }
        } catch (error) {
          console.error("Detection error:", error);
        }
      }

      setScanProgress(Math.min(progress, 100));
      const newPhase = Math.floor((Math.min(progress, 100) / 100) * (scanPhrases.length - 1));
      setScanPhase(newPhase);

      // ─── FINALIZE AFTER 4 SECONDS ──────────────────────────────────────
      if (elapsed >= detectionDuration && !isFinished) {
        isFinished = true;
        console.log("⏰ Scan complete!");

        if (dotIntervalRef.current) {
          clearInterval(dotIntervalRef.current);
          dotIntervalRef.current = null;
        }

        if (!isMountedRef.current) return;

        setScanProgress(100);
        setScanPhase(scanPhrases.length - 1);

        // Final detection on canvas
        try {
          const canvas = canvasRef.current;
          if (!canvas) throw new Error("Canvas not available");
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          const detections = await faceapi
            .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          let picked = "Neutral";
          if (detections.length > 0) {
            const emotions = detections[0].expressions;
            picked = pickMoodFromEmotions(emotions);
            console.log("🎯 Detected mood:", picked);
          } else {
            console.warn("⚠️ No face detected!");
            setCameraError("No face detected. Please try again or select mood manually.");
            stopCamera();
            setStage("intro");
            return;
          }

          stopCamera();
          setDetectedMood(picked);
          setTimeout(() => {
            if (isMountedRef.current) {
              console.log("✅ Setting stage to result");
              setStage("result");
            }
          }, 100);

        } catch (error) {
          console.error("Final detection error:", error);
          setCameraError("Detection failed. Please try again or select mood manually.");
          stopCamera();
          setStage("intro");
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(detectFace);
    };

    detectFace();
  };

  // Helper
  const activeMood = detectedMood || manualMood || "Neutral";
  const profile = moodProfiles[activeMood] || moodProfiles.Neutral;

  const handleMoodSelect = (mood) => {
    setManualMood(mood);
    setDetectedMood(null);
    setStage("result");
  };

  // ─── ADD TO CART ──────────────────────────────────────────────────────────
  const addToCart = (dishId) => {
    if (!setCartItems || !profile) return;
    const dish = profile.dishes.find(d => d.id === dishId);
    if (!dish) return;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === dishId);
      if (existing) {
        return prev.map(i => i.id === dishId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [
        ...prev,
        {
          id: dishId,
          name: dish.name,
          emoji: dish.emoji || '🍽️',
          price: parseInt(String(dish.price).replace(/[^0-9]/g, '')),
          category: 'Recommendation',
          qty: 1,
        },
      ];
    });
    if (onDishSelect) onDishSelect(dish);
  };

  // ── INTRO ────────────────────────────────────────────────────────────────────
  const IntroScreen = () => (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"48px 24px", textAlign:"center" }}>
      <div style={{ position:"relative", width:160, height:160, margin:"0 auto 36px" }}>
        <div style={{
          width:160, height:160, borderRadius:"50%",
          background:`linear-gradient(135deg,${accentColor}22,${accentColor}0a)`,
          border:`2px solid ${accentColor}33`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:72,
        }}>🤳</div>
        <div style={{
          position:"absolute", inset:-8, borderRadius:"50%",
          border:`3px solid transparent`,
          borderTopColor: accentColor,
          borderRightColor: accentColor + "44",
          animation:"rotateSlow 2s linear infinite",
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", inset:-16, borderRadius:"50%",
          border:`2px solid ${accentColor}22`,
          animation:"rotateSlow 3s linear infinite reverse",
          pointerEvents:"none",
        }}/>
      </div>

      <h1 style={{ fontSize:30, fontWeight:900, color:"#111827", margin:"0 0 12px", letterSpacing:"-0.5px" }}>
        AI Mood-Based Food Recommender
      </h1>
      <p style={{ fontSize:15, color:"#6b7280", lineHeight:1.7, margin:"0 0 32px", maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>
        Our AI reads your facial expression to detect your current mood and recommends the perfect dish just for you. It takes only 3 seconds!
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:36 }}>
        {[
          { icon:"📸", step:"1", title:"Allow Camera",  desc:"Grant camera access for a quick scan" },
          { icon:"🧠", step:"2", title:"AI Scans You",  desc:"Our AI reads your facial expressions"  },
          { icon:"🍽️", step:"3", title:"Get Dishes",    desc:"Receive mood-matched recommendations"  },
        ].map(s => (
          <div key={s.step} style={{
            background:"#fff", borderRadius:18, padding:"20px 16px",
            border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 10px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width:44, height:44, borderRadius:12, margin:"0 auto 10px",
              background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
            }}>{s.icon}</div>
            <div style={{ fontSize:13, fontWeight:800, color:"#111827", marginBottom:4 }}>{s.title}</div>
            <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {cameraError && (
        <div style={{
          background:"#fff5f5", border:"1px solid #fed7d7", borderRadius:12,
          padding:"12px 16px", marginBottom:20, fontSize:13, color:"#c53030",
        }}>⚠️ {cameraError}</div>
      )}

      {!modelsLoaded && (
        <div style={{
          background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:12,
          padding:"12px 16px", marginBottom:20, fontSize:13, color:"#92400e",
          display:"flex", alignItems:"center", gap:8,
        }}>
          <span style={{ animation:"spin 1s linear infinite" }}>⚙️</span>
          Loading AI models... This may take a few seconds.
        </div>
      )}

      <button onClick={startCamera} disabled={!modelsLoaded} style={{
        padding:"16px 48px", borderRadius:16, border:"none",
        background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
        color:"#fff", fontWeight:800, fontSize:16, cursor:modelsLoaded?"pointer":"not-allowed",
        fontFamily:"inherit", boxShadow:`0 8px 28px ${accentColor}55`,
        display:"inline-flex", alignItems:"center", gap:10,
        transition:"transform 0.15s",
        marginBottom:16,
        opacity:modelsLoaded?1:0.6,
      }}
        onMouseEnter={e=>modelsLoaded&&(e.currentTarget.style.transform="scale(1.03)")}
        onMouseLeave={e=>modelsLoaded&&(e.currentTarget.style.transform="scale(1)")}
      >
        📸 Scan My Mood
      </button>

      <div style={{ marginTop:8 }}>
        <button onClick={()=>setStage("manual")} style={{
          background:"none", border:`1px solid ${accentColor}44`, borderRadius:10,
          padding:"9px 20px", color:accentColor, fontWeight:600, fontSize:13,
          cursor:"pointer", fontFamily:"inherit",
        }}>
          😊 Choose Mood Manually Instead
        </button>
      </div>

      <p style={{ fontSize:11, color:"#d1d5db", marginTop:20 }}>
        🔒 Camera feed is processed locally — we never store or upload your images.
      </p>
    </div>
  );

  // ── SCANNING ─────────────────────────────────────────────────────────────────
  const ScanningScreen = () => (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"36px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, color:`${accentColor}bb`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>AI Face Analysis</div>
        <h2 style={{ fontSize:22, fontWeight:900, color:"#111827", margin:0 }}>Scanning your expression…</h2>
      </div>

      <div style={{ position:"relative", borderRadius:24, overflow:"hidden", background:"#0d1117", marginBottom:20, aspectRatio:"4/3", maxHeight:420 }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scaleX(-1)" }}/>

        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} style={{
              position:"absolute",
              [v]: "15%", [h]: "20%",
              width:30, height:30,
              borderTop: v==="top" ? `3px solid ${accentColor}` : "none",
              borderBottom: v==="bottom" ? `3px solid ${accentColor}` : "none",
              borderLeft: h==="left" ? `3px solid ${accentColor}` : "none",
              borderRight: h==="right" ? `3px solid ${accentColor}` : "none",
              borderRadius: v==="top"&&h==="left"?"6px 0 0 0":v==="top"&&h==="right"?"0 6px 0 0":v==="bottom"&&h==="left"?"0 0 0 6px":"0 0 6px 0",
            }}/>
          ))}

          {faceBox && (
            <div style={{
              position:"absolute",
              left:`${faceBox.x}%`, top:`${faceBox.y}%`,
              width:`${faceBox.w}%`, height:`${faceBox.h}%`,
              border:`2px solid ${accentColor}`,
              borderRadius:8,
              boxShadow:`0 0 0 4px ${accentColor}22, 0 0 20px ${accentColor}44`,
              animation:"facePulse 1.5s ease-in-out infinite",
            }}>
              <div style={{
                position:"absolute", top:-22, left:"50%", transform:"translateX(-50%)",
                background:accentColor, color:"#fff", fontSize:9, fontWeight:800,
                padding:"2px 8px", borderRadius:6, whiteSpace:"nowrap", letterSpacing:"0.5px",
              }}>FACE DETECTED</div>
            </div>
          )}

          <div style={{
            position:"absolute", left:0, right:0, height:2,
            background:`linear-gradient(90deg,transparent,${accentColor},transparent)`,
            boxShadow:`0 0 10px ${accentColor}`,
            animation:"scanLine 2s ease-in-out infinite",
          }}/>

          {scanDots.map(dot => (
            <div key={dot.id} style={{
              position:"absolute",
              left:`${dot.x}%`, top:`${dot.y}%`,
              width:4, height:4, borderRadius:"50%",
              background:accentColor, opacity:0.8,
              boxShadow:`0 0 6px ${accentColor}`,
            }}/>
          ))}

          {faceBox && [
            {x:38,y:30,label:"LEFT EYE"},
            {x:58,y:30,label:"RIGHT EYE"},
            {x:48,y:45,label:"NOSE"},
            {x:48,y:62,label:"MOUTH"},
          ].map(pt=>(
            <div key={pt.label} style={{ position:"absolute", left:`${pt.x}%`, top:`${pt.y}%` }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:accentColor,boxShadow:`0 0 8px ${accentColor}` }}/>
              <div style={{
                position:"absolute", left:10, top:-2,
                fontSize:8, fontWeight:700, color:accentColor,
                background:"rgba(0,0,0,0.6)", padding:"1px 5px", borderRadius:4,
                whiteSpace:"nowrap", letterSpacing:"0.5px",
              }}>{pt.label}</div>
            </div>
          ))}

          <div style={{
            position:"absolute", top:14, left:14,
            display:"flex", alignItems:"center", gap:6,
            background:"rgba(0,0,0,0.6)", borderRadius:20, padding:"5px 12px",
          }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"liveDot 1.2s ease-in-out infinite" }}/>
            <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>LIVE</span>
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>{scanPhrases[scanPhase]}</span>
          <span style={{ fontSize:13, fontWeight:800, color:accentColor }}>{Math.floor(scanProgress)}%</span>
        </div>
        <div style={{ height:8, background:"#f3f4f6", borderRadius:10, overflow:"hidden", marginBottom:14 }}>
          <div style={{
            height:"100%", background:`linear-gradient(90deg,${accentColor},${accentColor}88)`,
            borderRadius:10, transition:"width 0.15s ease",
            width:`${scanProgress}%`,
            boxShadow:`0 0 10px ${accentColor}66`,
          }}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {scanPhrases.map((ph,i)=>(
            <div key={i} style={{
              padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600,
              background: i <= scanPhase ? `${accentColor}18` : "#f3f4f6",
              color: i <= scanPhase ? accentColor : "#9ca3af",
              border: i === scanPhase ? `1px solid ${accentColor}44` : "1px solid transparent",
              transition:"all 0.6s",
            }}>{ph.replace("…","")}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── MANUAL MOOD PICKER ────────────────────────────────────────────────────────
  const ManualScreen = () => (
    <div style={{ maxWidth:600, margin:"0 auto", padding:"40px 24px", textAlign:"center" }}>
      <h2 style={{ fontSize:24, fontWeight:900, color:"#111827", margin:"0 0 8px" }}>How are you feeling?</h2>
      <p style={{ fontSize:14, color:"#9ca3af", margin:"0 0 32px" }}>Tap your current mood and we'll find the perfect dish.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>
        {moodKeys.map((mood,i) => {
          const mp = moodProfiles[mood];
          return (
            <button key={mood} onClick={()=>{setManualMood(mood);setStage("result");}} style={{
              padding:"22px 12px", borderRadius:18,
              background: manualMood===mood ? mp.bg : "#fff",
              border: manualMood===mood ? `2.5px solid ${mp.color}` : "2px solid #f3f4f6",
              cursor:"pointer", fontFamily:"inherit",
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
              boxShadow: manualMood===mood ? `0 0 0 4px ${mp.color}18` : "0 2px 8px rgba(0,0,0,0.04)",
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${mp.color}22`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=manualMood===mood?`0 0 0 4px ${mp.color}18`:"0 2px 8px rgba(0,0,0,0.04)";}}
            >
              <span style={{ fontSize:44 }}>{moodEmojis[i]}</span>
              <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{mood}</span>
              <span style={{ fontSize:10, color:"#9ca3af", lineHeight:1.4 }}>{mp.subtitle}</span>
            </button>
          );
        })}
      </div>
      <button onClick={()=>setStage("intro")} style={{
        background:"none", border:"1px solid #e5e7eb", borderRadius:10,
        padding:"9px 20px", color:"#6b7280", fontWeight:600, fontSize:13,
        cursor:"pointer", fontFamily:"inherit",
      }}>← Back</button>
    </div>
  );

  // ── RESULT ───────────────────────────────────────────────────────────────────
  // ── FIXED: Shows images with fallback to emoji ─────────────────────────────
  const ResultScreen = () => {
    if (!profile) return null;

    const moodDishes = profile.dishes || [];
    const totalCartItems = cartItems.reduce((sum, i) => sum + (i.qty || 1), 0);

    return (
      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>

        {/* Mood hero card */}
        <div style={{
          background: profile.bg,
          borderRadius:24, padding:"28px 32px", marginBottom:28,
          border:`1.5px solid ${profile.color}33`,
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:20,
          flexWrap:"wrap",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{
              width:80, height:80, borderRadius:"50%",
              background:`linear-gradient(135deg,${profile.color},${profile.color}cc)`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:40,
              boxShadow:`0 8px 24px ${profile.color}55`,
              animation:"moodPop 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            }}>{profile.emoji}</div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:profile.color, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:4 }}>
                {detectedMood ? "AI Detected Mood" : "Your Selected Mood"}
              </div>
              <h2 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:"#111827" }}>{profile.label}</h2>
              <p style={{ margin:0, fontSize:14, color:"#6b7280" }}>{profile.subtitle}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {profile.tags.map(t=>(
              <span key={t} style={{
                padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700,
                background:`${profile.color}18`, color:profile.color,
                border:`1px solid ${profile.color}33`,
              }}>{t}</span>
            ))}
          </div>
          <button onClick={()=>{setDetectedMood(null);setManualMood(null);setStage("intro");}} style={{
            padding:"9px 18px", borderRadius:12, border:"none",
            background:`linear-gradient(135deg,${profile.color},${profile.color}cc)`,
            color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
            boxShadow:`0 4px 14px ${profile.color}44`,
          }}>🔄 Rescan</button>
        </div>

        <h3 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:"0 0 16px" }}>
          🍽️ Perfect Dishes for Your Mood
        </h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:28 }}>
          {moodDishes.map((dish, i) => {
            const id = dish.id;
            const inCart = cartItems.some(item => item.id === id);
            return (
              <div key={i} style={{
                background:"#fff", borderRadius:20, overflow:"hidden",
                border:"1px solid rgba(0,0,0,0.06)",
                boxShadow:"0 2px 14px rgba(0,0,0,0.05)",
                display:"flex", flexDirection:"column",
                transition:"transform 0.2s, box-shadow 0.2s",
                cursor:"pointer",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px ${profile.color}22`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 14px rgba(0,0,0,0.05)";}}
                onClick={()=>{ if (onDishSelect) onDishSelect(dish); }}
              >
                {/* ─── IMAGE DISPLAY WITH FALLBACK ────────────────────────── */}
                <div style={{
                  height:180,
                  background:'#f3f4f6',
                  overflow:'hidden',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  borderBottom:`1px solid ${profile.color}22`,
                  position:'relative',
                }}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{
                      width:'100%',
                      height:'100%',
                      objectFit:'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      // Show fallback emoji
                      const parent = e.target.parentNode;
                      if (parent) {
                        const fallback = document.createElement('span');
                        fallback.style.fontSize = '64px';
                        fallback.textContent = dish.emoji || '🍽️';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  {/* Fallback if image fails (inline) */}
                  <div style={{ display: 'none' }} className="fallback-emoji">
                    <span style={{ fontSize:64 }}>{dish.emoji || '🍽️'}</span>
                  </div>
                </div>

                <div style={{ padding:"18px 18px", flex:1, display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{
                      width:24, height:24, borderRadius:"50%",
                      background:`linear-gradient(135deg,${profile.color},${profile.color}cc)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, fontWeight:800, color:"#fff",
                    }}>{i+1}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:profile.color,
                      background:`${profile.color}12`, borderRadius:8, padding:"2px 8px" }}>
                      AI Pick
                    </div>
                  </div>

                  <h4 style={{ margin:"0 0 6px", fontSize:16, fontWeight:800, color:"#111827" }}>{dish.name}</h4>
                  <p style={{ margin:"0 0 12px", fontSize:12, color:"#9ca3af", lineHeight:1.55, flex:1 }}>
                    💡 {dish.reason}
                  </p>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:17, fontWeight:900, color:profile.color }}>{dish.price}</span>
                    <button onClick={(e)=>{ e.stopPropagation(); addToCart(id); }} style={{
                      padding:"8px 16px", borderRadius:10, border:"none",
                      background: inCart ? "linear-gradient(135deg,#22c55e,#16a34a)" : `linear-gradient(135deg,${profile.color},${profile.color}cc)`,
                      color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                      boxShadow: inCart ? "0 4px 12px #22c55e44" : `0 4px 12px ${profile.color}44`,
                      transition:"all 0.2s",
                    }}>
                      {inCart ? "✓ Added" : "+ Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalCartItems > 0 && (
          <div style={{
            background:`linear-gradient(135deg,${profile.color}18,${profile.color}08)`,
            border:`1.5px solid ${profile.color}33`,
            borderRadius:16, padding:"16px 22px",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>
              🛒 {totalCartItems} dish{totalCartItems > 1 ? "es" : ""} added to cart!
            </span>
            <button onClick={onViewCart || onBack} style={{
              padding:"9px 20px", background:`linear-gradient(135deg,${profile.color},${profile.color}cc)`,
              border:"none", borderRadius:10, color:"#fff", fontWeight:700, fontSize:13,
              cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 14px ${profile.color}44`,
            }}>View Cart →</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f4f1ed", fontFamily:"'Trebuchet MS',sans-serif", color:"#111827" }}>

      {/* Top bar */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(0,0,0,0.06)",
        padding:"0 36px", height:64,
        display:"flex", alignItems:"center", gap:14,
        boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:7,
          background:"#f3f4f6", border:"none", borderRadius:10,
          padding:"8px 14px", color:"#555", cursor:"pointer",
          fontSize:13, fontWeight:600, fontFamily:"inherit",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="#e5e7eb"}
          onMouseLeave={e=>e.currentTarget.style.background="#f3f4f6"}
        >← Home</button>
        <div style={{ fontSize:13, color:"#d1d5db" }}>
          <span style={{ color:"#6b7280" }}>Home</span>
          <span style={{ margin:"0 6px" }}>›</span>
          <span style={{ color:accentColor, fontWeight:700 }}>AI Recommendation</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:20 }}>🛒</span>
            <span style={{
              position:"absolute", top:-4, right:-4,
              background:accentColor, color:"#fff",
              borderRadius:"50%",
              width:18, height:18,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:9, fontWeight:800,
            }}>{cartItems.reduce((s,i)=>s+(i.qty||1),0)}</span>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{
        background:`linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)`,
        padding:"28px 40px 32px", position:"relative", overflow:"hidden",
      }}>
        {[["-30px",null,"160px",`${accentColor}12`],[null,"10px","130px","rgba(255,255,255,0.025)"]].map(([l,r,sz,bg],i)=>(
          <div key={i} style={{position:"absolute",top:"-20px",left:l||undefined,right:r||undefined,width:sz,height:sz,borderRadius:"50%",background:bg,pointerEvents:"none"}}/>
        ))}
        <div style={{ position:"relative", zIndex:1, maxWidth:900, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:10,fontWeight:700,color:`${accentColor}bb`,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6 }}>Powered by AI</div>
            <h1 style={{ margin:"0 0 6px",fontSize:24,fontWeight:900,color:"#fff",letterSpacing:"-0.5px" }}>Smart Food Recommendation 🧠</h1>
            <p style={{ margin:0,color:"rgba(255,255,255,0.4)",fontSize:13 }}>Face detection · Mood analysis · Personalised dishes</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {["😄","😢","😠","😴"].map((e,i)=>(
              <div key={i} style={{ width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20, animation:`float${i} ${2+i*0.3}s ease-in-out infinite` }}>{e}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FIXED CANVAS ──────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position:'absolute',
          opacity:0,
          pointerEvents:'none',
          width:'640px',
          height:'480px',
        }}
      />

      {/* Page content */}
      {stage === "intro"    && <IntroScreen/>}
      {stage === "scanning" && <ScanningScreen/>}
      {stage === "manual"   && <ManualScreen/>}
      {stage === "result"   && <ResultScreen/>}

      {/* Footer */}
      <div style={{ background:"#fff",borderTop:"1px solid #f0f0f0",padding:"22px 40px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,marginTop:40 }}>
        {[
          {icon:"🕐",title:"Hours",    lines:["Mon–Sun","10 AM – 11 PM"]},
          {icon:"📞",title:"Contact",  lines:["+94 77 599 5735","info@smartrestaurant.lk"]},
          {icon:"📍",title:"Location", lines:["123, Galle Road","Colombo 03, Sri Lanka"]},
          {icon:"🌐",title:"Follow Us", social:true},
        ].map((col,i)=>(
          <div key={i}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
              <span style={{color:accentColor,fontSize:16}}>{col.icon}</span>
              <span style={{fontSize:12,fontWeight:700,color:"#374151"}}>{col.title}</span>
            </div>
            {col.lines?.map((l,j)=><div key={j} style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>{l}</div>)}
            {col.social&&<div style={{display:"flex",gap:7,marginTop:3}}>{["🔵","📸","🐦","▶️"].map((s,j)=><div key={j} style={{width:28,height:28,borderRadius:"50%",background:`${accentColor}12`,border:`1px solid ${accentColor}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer"}}>{s}</div>)}</div>}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rotateSlow { to { transform:rotate(360deg) } }
        @keyframes scanLine   { 0%{top:10%} 50%{top:85%} 100%{top:10%} }
        @keyframes facePulse  { 0%,100%{box-shadow:0 0 0 4px ${accentColor}22,0 0 20px ${accentColor}44} 50%{box-shadow:0 0 0 8px ${accentColor}11,0 0 30px ${accentColor}22} }
        @keyframes liveDot    { 0%,100%{box-shadow:0 0 0 3px #22c55e33} 50%{box-shadow:0 0 0 6px #22c55e11} }
        @keyframes moodPop    { 0%{transform:scale(0) rotate(-15deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes float0     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes float1     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes float2     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes float3     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin       { to { transform:rotate(360deg) } }
      `}</style>
    </div>
  );
}

export { RecommendationPage };