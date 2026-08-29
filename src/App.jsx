import { useEffect, useState } from 'react';
import { navItems, categories, categoryConfig, allDishes } from './data/data.js';
import { OrbitDisplay, Stars } from './components/Shared.jsx';
import { DishDetailPage } from './pages/DishDetailPage.jsx';
import { CategoryPage } from './pages/CategoryPage.jsx';
import { MenuPage } from './pages/MenuPage.jsx';
import { RecommendationPage } from './pages/RecommendationPage.jsx';
import CartPage from './pages/CartPage.jsx';
import { TrackOrderPage } from './pages/TrackOrderPage.jsx';
import  OrdersPage  from './pages/OrdersPage.jsx';
import ViewFeedbacks from './pages/ViewFeedbacks.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx'; // ✅ Duplicate import එක ඉවත් කළා
import OffersPage from './pages/OffersPage.jsx';
import { useAppStore } from './store/AppStore.jsx';


const buildOrderSummary = (items = [], tipAmt = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const serviceCharge = Math.round(subtotal * 0.10);
  const total = subtotal + serviceCharge + tipAmt;
  return { subtotal, serviceCharge, tipAmt, total };
};

const getTimeBasedCategory = (hour = new Date().getHours()) => {
  if (hour >= 8 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 17) return "Lunch";
  if (hour >= 17 && hour < 23) return "Dinner";
  return "Breakfast";
};

function Sidebar({ accentColor, activeNav, onNavigate, onMoreClick }) {
  return (
    <aside style={{ width:240, flexShrink:0, background:"#1a1a1a", display:"flex", flexDirection:"column", padding:"0 0 24px 0", boxShadow:"4px 0 20px rgba(0,0,0,0.15)", zIndex:10 }}>
      <div style={{ padding:"28px 24px 24px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:16, boxShadow:`0 4px 12px ${accentColor}55` }}>SR</div>
          <span style={{ color:"#fff", fontWeight:600, fontSize:15 }}>Smart Restaurant</span>
        </div>
      </div>
      <nav style={{ flex:1, padding:"0 12px" }}>
        {navItems.map(item => (
          <button key={item.label} onClick={() => onNavigate(item.label)} style={{
            display:"flex", alignItems:"center", gap:14, width:"100%", padding:"12px 14px", borderRadius:12, border:"none",
            background: activeNav===item.label ? accentColor+"22" : "transparent",
            color: activeNav===item.label ? accentColor : "rgba(255,255,255,0.6)",
            cursor:"pointer", marginBottom:4, fontSize:14, fontWeight: activeNav===item.label ? 600 : 400,
            transition:"all 0.2s", textAlign:"left", fontFamily:"inherit",
          }}>
            <span style={{ fontSize:18, width:22, textAlign:"center" }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span style={{ marginLeft:"auto", background:accentColor, color:"#fff", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div style={{ marginTop:"auto", padding:"16px 12px" }}>
        <div style={{ background:"linear-gradient(135deg, #1e1b4b, #311005)", borderRadius:16, padding:14, textAlign:"center", border:"1px solid rgba(234, 88, 12, 0.2)", boxShadow:"0 4px 12px rgba(0,0,0,0.2)" }}>
          <div style={{ color:"#ef4444", fontSize:10, fontWeight:900, letterSpacing:1, marginBottom:8 }}>● LIVE FEED</div>
          <h4 style={{ color:"#fff", margin:"0 0 4px", fontSize:13, fontWeight:700 }}>Smart Kitchen</h4>
          <p style={{ color:"#9ca3af", margin:"0 0 12px", fontSize:11, lineHeight:1.4 }}>Watch how we prepare your delicious food live!</p>
          <button onClick={onMoreClick} style={{ background:"#ea580c", color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", width:"100%", fontSize:11, fontWeight:700, cursor:"pointer" }}>🎥 Watch Preview</button>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const { placeOrder } = useAppStore();
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCategory, setActiveCategory] = useState(() => getTimeBasedCategory(new Date().getHours()));
  const [searchVal, setSearchVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [page, setPage] = useState(null); // null = Home
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedDishCategory, setSelectedDishCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState(null);
  const [orderItemsState, setOrderItemsState] = useState([]);
  const [orderMetaState, setOrderMetaState] = useState(null);
  const [orderSummaryState, setOrderSummaryState] = useState(null);
  
  const [feedbackStats, setFeedbackStats] = useState({ average: 4.8, count: 2000 });

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchFeedbackStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback", { 
          signal: controller.signal 
        });
        if (!response.ok) return;
        const data = await response.json();
        
        if (!data || !Array.isArray(data) || data.length === 0) return;
        
        const count = data.length;
        
        const totalRating = data.reduce((sum, item) => {
          const val = item.rating ?? item.stars ?? 0;
          const num = parseFloat(val);
          return sum + (isNaN(num) ? 0 : num);
        }, 0);

        const average = totalRating / count;
        const finalAvg = isNaN(average) ? 4.8 : Number(average.toFixed(1));
        
        setFeedbackStats({ average: finalAvg, count });
        
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn("Unable to load feedback stats:", error);
        }
      }
    };

    fetchFeedbackStats();
    return () => controller.abort();
  }, []);

  const cfg = categoryConfig[activeCategory] || categoryConfig["Breakfast"] || { accentColor: "#ef4444", bannerGrad: "linear-gradient(135deg, #fff, #eee)", tagline: "Welcome", moodWord: "!", desc: "", slides: [[]] };
  const slides = cfg.slides || [[]];
  const currentSlide = slides[slideIdx % slides.length] || [];
  
  const centerImage = currentSlide[0]?.image || currentSlide[0]?.emoji || "🍽️";

  const changeCategory = (cat) => { 
    setActiveCategory(cat); 
    setSlideIdx(0); 
  };

  const goNext = () => setSlideIdx(i => (i+1)%slides.length);
  const goPrev = () => setSlideIdx(i => (i-1+slides.length)%slides.length);
  
  const openDish = (dish, cat) => {
    setSelectedDish(dish);
    setSelectedDishCategory(cat);
    setPage("dish");
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => { setIsListening(true); };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchVal(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => { setIsListening(false); };
    recognition.start();
  };

  const goToCartPage = () => { setPage("cart"); setActiveNav("Cart"); };
  const onMoreClick = () => { setPage("orders"); setActiveNav("Staff"); };
  const handleStaffLogout = () => { setPage(null); setActiveNav("Home"); };
  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Home") setPage(null);
    if (label === "Track Order") { setPage("track"); setOrderPaymentMethod(null); }
    if (label === "Cart") setPage("cart");
    if (label === "Feedback") setPage("feedback");
    if (label === "Recommendation") setPage("recommendation");
    if (label === "Special Menu") setPage("menu");
    if (label === "Offers") setPage("offers");
    if (label === "Staff") setPage("orders");
    
  };
  const pageShell = (content) => (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f6f3ef" }}>
      <Sidebar accentColor={cfg.accentColor} activeNav={activeNav} onNavigate={handleNav} onMoreClick={onMoreClick} />
      <main style={{ flex:1, minWidth:0 }}>{content}</main>
    </div>
  );

  const handleOrderSaveAndTrack = async (paymentMethod, items, orderMeta, summary) => {
    const trackItems = items || cartItems || [];
    const trackSummary = summary || buildOrderSummary(trackItems, 0);
    const trackMeta = orderMeta || { id: `SR${Date.now().toString().slice(-8)}`, ts: Date.now() };

    placeOrder(trackItems, trackSummary.total, cfg.accentColor, trackMeta);

    const orderPayload = {
      orderId: trackMeta.id,
      items: trackItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        category: item.category || activeCategory
      })),
      summary: trackSummary,
      paymentMethod: paymentMethod || "Cash on Delivery",
      orderedAt: new Date(trackMeta.ts)
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        setOrderPaymentMethod(paymentMethod);
        setOrderItemsState(trackItems);
        setOrderMetaState(trackMeta);
        setOrderSummaryState(trackSummary);
        setCartItems([]);
        setPage("track");
        setActiveNav("Track Order");
      } else {
        alert("Server error: Order එක save කිරීමට නොහැකි විය.");
      }
    } catch (error) {
      console.error("Backend offline, moving to track page locally:", error);
      setOrderPaymentMethod(paymentMethod);
      setOrderItemsState(trackItems);
      setOrderMetaState(trackMeta);
      setOrderSummaryState(trackSummary);
      setPage("track");
      setActiveNav("Track Order");
    }
  };

  // --- Page Conditional Rendering ---

  if (page === "track") {
    return pageShell(
      <TrackOrderPage
        accentColor={cfg.accentColor}
        paymentMethod={orderPaymentMethod}
        orderItems={orderItemsState}
        orderMeta={orderMetaState}
        orderSummary={orderSummaryState}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
      />
    );
  }

  if (page === "cart") {
    return pageShell(
      <CartPage
        accentColor={cfg.accentColor}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onTrack={(method, items, meta, summary) => handleOrderSaveAndTrack(method, items, meta, summary)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    );
  }

  if (page === "feedback") {
    return pageShell(
      <FeedbackPage
        accentColor={cfg.accentColor}
        orderedItems={cartItems.length > 0 ? cartItems : orderItemsState}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onViewFeedbacks={() => setPage("view-feedbacks")}
      />
    );
  }

  if (page === "view-feedbacks") {
    return pageShell(
      <ViewFeedbacks 
        accentColor={cfg.accentColor}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onViewWriteReview={() => setPage("feedback")}
      />
    );
  }

  if (page === "menu") {
    return pageShell(
      <MenuPage
        accentColor={cfg.accentColor}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onDishSelect={openDish}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onViewCart={goToCartPage}
      />
    );
  }

  if (page === "dish" && selectedDish) {
    const cat = selectedDishCategory || activeCategory;
    return pageShell(
      <DishDetailPage
        dish={selectedDish}
        category={cat}
        accentColor={categoryConfig[cat]?.accentColor || "#f5a623"}
        onBack={() => setPage(selectedDishCategory ? `category:${selectedDishCategory}` : null)}
        onTrack={(method, items, meta, summary) => handleOrderSaveAndTrack(method, items, meta, summary)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onViewCart={goToCartPage}
      />
    );
  }

  if (page && page.startsWith("category:")) {
    const cat = page.replace("category:","");
    return pageShell(
      <CategoryPage
        category={cat}
        onBack={() => setPage(null)}
        onDishSelect={openDish}
        onViewCart={goToCartPage}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    );
  }

  if (page === "recommendation") {
    return pageShell(
      <RecommendationPage
        accentColor={cfg.accentColor}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onDishSelect={openDish}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onViewCart={goToCartPage}
      />
    );
  }

  if (page === "orders") {
    return pageShell(
      <OrdersPage
        accentColor={cfg.accentColor}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onLogout={handleStaffLogout}
      />
    );
  }

  if (page === "offers") {
    return pageShell(
      <OffersPage
        accentColor={cfg.accentColor}
        onBack={() => { setPage(null); setActiveNav("Home"); }}
        onGoToCart={goToCartPage}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    );
  }

  const popularDishes = (allDishes[activeCategory]||[]).slice(0,4);

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Trebuchet MS', sans-serif", background:"#faf8f5", overflow:"hidden" }}>

      {/* Sidebar */}
      <aside style={{ width:240, background:"#1a1a1a", display:"flex", flexDirection:"column", padding:"0 0 24px 0", boxShadow:"4px 0 20px rgba(0,0,0,0.15)", zIndex:10 }}>
        <div style={{ padding:"28px 24px 24px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, background:`linear-gradient(135deg,${cfg.accentColor},${cfg.accentColor}bb)`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:16, boxShadow:`0 4px 12px ${cfg.accentColor}55`, transition:"background 0.4s" }}>SR</div>
            <span style={{ color:"#fff", fontWeight:600, fontSize:15 }}>Smart Restaurant</span>
          </div>
        </div>
        <nav style={{ flex:1, padding:"0 12px" }}>
          {navItems.map(item => (
            <button key={item.label} onClick={() => {
              setActiveNav(item.label);
              // ✅ Home එක click කළ විට Reset වන ලෙස සැකසුවා
              if (item.label === "Home") setPage(null); 
              if (item.label === "Track Order") { setPage("track"); setOrderPaymentMethod(null); }
              if (item.label === "Cart") setPage("cart");
              if (item.label === "Feedback") setPage("feedback");
              if (item.label === "Recommendation") setPage("recommendation");
              if (item.label === "Special Menu") setPage("menu");
              if (item.label === "Offers") setPage("offers");
              if (item.label === "Staff") setPage("orders");
            }} style={{
              display:"flex", alignItems:"center", gap:14, width:"100%", padding:"12px 14px", borderRadius:12, border:"none",
              background: activeNav===item.label ? cfg.accentColor+"22" : "transparent",
              color: activeNav===item.label ? cfg.accentColor : "rgba(255,255,255,0.6)",
              cursor:"pointer", marginBottom:4, fontSize:14, fontWeight: activeNav===item.label ? 600 : 400,
              transition:"all 0.2s", textAlign:"left", fontFamily:"inherit",
            }}>
              <span style={{ fontSize:18, width:22, textAlign:"center" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span style={{ marginLeft:"auto", background:cfg.accentColor, color:"#fff", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b, #311005)',
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
            border: '1px solid rgba(234, 88, 12, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{
                width: '8px', height: '8px', backgroundColor: '#ef4444', 
                borderRadius: '50%', display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }}></span>
              <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: '900', letterSpacing: '1px' }}>LIVE FEED</span>
            </div>
            <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700' }}>Smart Kitchen</h4>
            <p style={{ color: '#9ca3af', margin: '0 0 12px 0', fontSize: '11px', lineHeight: '1.4' }}>Watch how we prepare your delicious food live!</p>
            <button 
              onClick={onMoreClick}
              style={{
                background: '#ea580c', color: '#fff', border: 'none', borderRadius: '10px',
                padding: '8px 14px', width: '100%', fontSize: '11px',
                fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>🎥</span> Watch Preview
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        <header style={{ display:"flex", alignItems:"center", padding:"0 32px", height:72, background:"#fff", borderBottom:"1px solid rgba(0,0,0,0.06)", gap:24, flexShrink:0 }}>
          <div style={{ display:"flex", gap:22 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => changeCategory(cat)} style={{
                background:"none", border:"none", fontSize:14, fontWeight:500,
                color: activeCategory===cat ? cfg.accentColor : "#555",
                cursor:"pointer", padding:"4px 0",
                borderBottom: activeCategory===cat ? `2px solid ${cfg.accentColor}` : "2px solid transparent",
                transition:"all 0.25s", fontFamily:"inherit",
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ flex:1, maxWidth:360, display:"flex", alignItems:"center", background:"#f5f5f5", borderRadius:12, padding:"0 16px", gap:8 }}>
            <span style={{ color:"#aaa" }}>🔍</span>
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search for food, drinks..." style={{ flex:1, border:"none", background:"none", fontSize:14, color:"#333", outline:"none", padding:"10px 0", fontFamily:"inherit" }}/>
          </div>
          <div style={{ display:"flex", gap:10, marginLeft:"auto" }}>
            <a href="https://wa.me/945995735?text=I%20need%20some%20help%20with%20my%20order" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 18px", background:"#25D366", borderRadius:25, color:"#fff", fontWeight:600, fontSize:13, textDecoration:"none", cursor:"pointer", fontFamily:"inherit", transition:"background 0.4s" }}>
              💬 Chat via WhatsApp
            </a>
            <button onClick={handleVoiceSearch} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 18px", background:isListening ? "#ff4d4d" : "transparent", border:`2px solid ${cfg.accentColor}`, borderRadius:25, color:isListening ? "#fff" : cfg.accentColor, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.4s" }}>
              {isListening ? '🛑 Listening...' : '🎙️ Voice'}
            </button>
          </div>
        </header>

        <div style={{ flex:1, overflowY:"auto", overflowX:"visible", padding:"28px 32px" }}>

          {/* Hero */}
          <div style={{ background:cfg.bannerGrad, borderRadius:24, padding:"40px 40px 50px 48px", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:380, marginBottom:40, transition:"background 0.5s" }}>
            <div style={{ maxWidth:380, flexShrink:0, zIndex:2 }}>
              <h1 style={{ fontSize:44, fontWeight:900, lineHeight:1.15, color:"#1a1a1a", margin:"0 0 16px", letterSpacing:"-1px", whiteSpace:"pre-line" }}>
                {cfg.tagline}<span style={{ color:cfg.accentColor, transition:"color 0.4s" }}>{cfg.moodWord}</span>
              </h1>
              <p style={{ fontSize:14, color:"#777", lineHeight:1.65, margin:"0 0 28px" }}>{cfg.desc}</p>
              <button onClick={() => setPage(`category:${activeCategory}`)} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 26px", background:`linear-gradient(135deg,${cfg.accentColor},${cfg.accentColor}bb)`, border:"none", borderRadius:14, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:`0 6px 20px ${cfg.accentColor}44`, fontFamily:"inherit", transition:"transform 0.15s, background 0.4s" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >View All →</button>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:28 }}>
                <div style={{ display:"flex" }}>
                  {["👨","👩","🧑"].map((f,i) => (
                    <div key={i} style={{ width:36, height:36, borderRadius:"50%", background:"#e0d0c0", border:"2px solid #fff", marginLeft:i>0?-10:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{f}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ color:cfg.accentColor }}>★</span>
                    <span style={{ fontWeight:700, color:"#1a1a1a" }}>{feedbackStats.average}</span>
                  </div>
                  <div style={{ fontSize:12, color:"#999" }}>
                    {feedbackStats.count >= 1000 ? `${Math.round(feedbackStats.count/100)/10}K+` : `${feedbackStats.count}+`} Happy Customers
                  </div>
                </div>
              </div>
            </div>
            
            {/* Orbit Display */}
            <div style={{ display:"flex", alignItems:"center", gap:8, zIndex:2, flexShrink:0 }}>
              <button onClick={goPrev} style={{ width:38, height:38, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.9)", cursor:"pointer", fontSize:20, boxShadow:"0 2px 10px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >‹</button>
              <OrbitDisplay slide={currentSlide} centerEmoji={centerImage} accentColor={cfg.accentColor}/>
              <button onClick={goNext} style={{ width:38, height:38, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.9)", cursor:"pointer", fontSize:20, boxShadow:"0 2px 10px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >›</button>
            </div>

            <div style={{ position:"absolute", bottom:20, right:20, display:"flex", gap:6 }}>
              {slides.map((_,i) => (
                <div key={i} onClick={() => setSlideIdx(i)} style={{ width:slideIdx===i?20:8, height:8, borderRadius:4, background:slideIdx===i?cfg.accentColor:"rgba(0,0,0,0.2)", cursor:"pointer", transition:"all 0.3s" }}/>
              ))}
            </div>
          </div>

          {/* Popular Dishes */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h2 style={{ fontSize:24, fontWeight:800, color:"#1a1a1a", margin:0, letterSpacing:"-0.5px" }}>Popular {activeCategory}</h2>
            <button onClick={() => setPage(`category:${activeCategory}`)} style={{ background:"none", border:"none", color:cfg.accentColor, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>View All →</button>
          </div>
          
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {popularDishes.map(dish => (
              <div key={dish.id} style={{ background:dish.color, borderRadius:20, padding:"34px 30px", cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s", border:"1px solid rgba(0,0,0,0.04)" }}
                onClick={() => openDish(dish, activeCategory)}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
              >
                <div style={{ height:100, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    style={{ maxHeight:"100%", maxWidth:"100%", objectFit:"contain", borderRadius:12 }}
                    onError={(e) => { 
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, background:cfg.accentColor+"22", color:cfg.accentColor, fontSize:10, fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:6, transition:"all 0.4s" }}>{activeCategory}</div>
                <h3 style={{ margin:"0 0 4px", fontSize:15, fontWeight:700, color:"#1a1a1a" }}>{dish.name}</h3>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
                  <Stars rating={dish.rating} color={cfg.accentColor} size={11}/>
                  <span style={{ fontSize:12, color:"#999" }}>({dish.reviews}+)</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:16, fontWeight:800, color:cfg.accentColor, transition:"color 0.4s" }}>{dish.price}</span>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setCartItems(currentItems => {
                      const existing = currentItems.find(item => item.id === dish.id);
                      if (existing) {
                        return currentItems.map(item => item.id === dish.id ? { ...item, qty: item.qty + 1 } : item);
                      }
                      return [...currentItems, {
                        ...dish,
                        price: typeof dish.price === "string"
                          ? parseInt(dish.price.replace(/[^0-9]/g, ""), 10) || 0
                          : dish.price,
                        qty: 1,
                      }];
                    });
                  }} style={{ width:32, height:32, background:`linear-gradient(135deg,${cfg.accentColor},${cfg.accentColor}bb)`, border:"none", borderRadius:"50%", color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 10px ${cfg.accentColor}44`, transition:"background 0.4s" }}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes floatOrbit { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(1); opacity: 0.9; } }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:3px}
      `}</style>
    </div>
  );
}