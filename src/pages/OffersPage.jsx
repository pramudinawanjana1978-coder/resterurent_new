import React, { useState } from 'react';

const currentOffers = [
  { id:"o1", title:"Weekend Family Feast",  emoji:"👨‍👩‍👧‍👦", color:"#f97316", bg:"linear-gradient(135deg,#fff7ed,#fed7aa)", discount:"25% OFF",     desc:"Any order over Rs. 5,000 on Saturdays & Sundays", code:"FAMILY25",  expires:"Every weekend",       tag:"🔥 Popular",
    items:[
      { id:"oi1", name:"Mixed Rice & Curry",   image: "/images/Marble Cake Slice.jpg", price:1400, qty:4, originalPrice:1750, category:"Dinner"   },
      { id:"oi2", name:"Chicken Kottu",        image: "/images/Marble Cake Slice.jpg", price:1200, qty:2, originalPrice:1500, category:"Dinner"   },
      { id:"oi3", name:"Fresh Fruit Platter",   image: "/images/Marble Cake Slice.jpg", price:850,  qty:1, originalPrice:1050, category:"Desserts" },
    ]
  },
  { id:"o2", title:"Happy Hour Drinks",     emoji:"🍹", color:"#0277bd", bg:"linear-gradient(135deg,#e3f2fd,#b3e5fc)", discount:"Buy 1 Get 1",  desc:"All mocktails & juices — 3 PM to 5 PM daily",     code:"HAPPYHR",   expires:"Daily 3–5 PM",        tag:"⏰ Time-Limited",
    items:[
      { id:"oi4", name:"Virgin Mojito",        image: "/images/Marble Cake Slice.jpg",price:600,  qty:2, originalPrice:1200, category:"Drinks"   },
      { id:"oi5", name:"Mango Juice",           image: "/images/Marble Cake Slice.jpg", price:450,  qty:2, originalPrice:900,  category:"Drinks"   },
      { id:"oi6", name:"King Coconut (Thambili)",image: "/images/Marble Cake Slice.jpg", price:300,  qty:2, originalPrice:600,  category:"Drinks"   },
    ]
  },
  { id:"o3", title:"First Order Bonus",     emoji:"🎉", color:"#ad1457", bg:"linear-gradient(135deg,#fce4ec,#f8bbd0)", discount:"20% OFF",     desc:"New customers — 20% off your very first order",   code:"WELCOME20",  expires:"New customers only",  tag:"🆕 New Here?",
    items:[
      { id:"oi7", name:"Blueberry Pancakes",    image: "/images/Marble Cake Slice.jpg", price:1850, qty:1, originalPrice:2310, category:"Breakfast"},
      { id:"oi8", name:"Ceylon Black Tea",       image: "/images/Marble Cake Slice.jpg", price:250,  qty:1, originalPrice:310,  category:"Drinks"   },
      { id:"oi9", name:"Watalappan",            image: "/images/Marble Cake Slice.jpg", price:650,  qty:1, originalPrice:810,  category:"Desserts" },
    ]
  },
  { id:"o4", title:"Dessert Lovers Combo",  emoji:"🍰", color:"#7c3aed", bg:"linear-gradient(135deg,#f5f3ff,#ddd6fe)", discount:"15% OFF",     desc:"Any 2 desserts from our full desserts menu",      code:"SWEET15",    expires:"Ongoing",             tag:"🍰 Sweet Deal",
    items:[
      { id:"oi10",name:"Tiramisu",               image: "/images/Marble Cake Slice.jpg", price:1050, qty:1, originalPrice:1235, category:"Desserts" },
      { id:"oi11",name:"Chocolate Brownie",      image: "/images/Marble Cake Slice.jpg", price:800,  qty:1, originalPrice:940,  category:"Desserts" },
    ]
  },
  { id:"o5", title:"Lunch Express Deal",    emoji:"⚡", color:"#16a34a", bg:"linear-gradient(135deg,#f0fdf4,#bbf7d0)", discount:"Rs. 300 OFF", desc:"Any lunch combo, 11:30 AM – 2 PM on weekdays",    code:"LUNCH300",   expires:"Weekdays 11:30–2",    tag:"⚡ Quick Save",
    items:[
      { id:"oi12",name:"Chicken Wrap",           image: "/images/Marble Cake Slice.jpg", emoji:"🥙", price:1750, qty:1, originalPrice:2050, category:"Lunch"    },
      { id:"oi13",name:"Orange Juice",           image: "/images/Marble Cake Slice.jpg", emoji:"🍊", price:400,  qty:1, originalPrice:700,  category:"Drinks"   },
    ]
  },
  { id:"o6", title:"Birthday Special",      emoji:"🎂", color:"#db2777", bg:"linear-gradient(135deg,#fdf2f8,#fbcfe8)", discount:"Free Dessert", desc:"Show your ID on your birthday for a free dessert",code:"BDAYFREE",   expires:"Your birthday only",  tag:"🎂 Celebrate",
    items:[
      { id:"oi14",name:"Watalappan",             image: "/images/Watalappan.jpg", emoji:"🍮", price:0,    qty:1, originalPrice:650,  category:"Desserts" },
      { id:"oi15",name:"Cappuccino",             image: "/images/Marble Cake Slice.jpg", emoji:"☕", price:500,  qty:1, originalPrice:500,  category:"Drinks"   },
    ]
  },
];

const initialOfferSuggestions = [
  { id:1, name:"Kasun Perera", title:"Loyalty Punch Card", desc:"After 10 visits, give a free main course! Would keep me coming back every week.", category:"Loyalty", votes:34, status:"Under Review", date:"3 days ago" },
  { id:2, name:"Nethmi Silva", title:"Student Discount",   desc:"10% off for students with valid ID — lots of university students nearby would love this.", category:"Discount", votes:51, status:"Approved", date:"1 week ago" },
  { id:3, name:"Tharindu Fernando", title:"Bring a Friend Combo", desc:"Two mains + two drinks at a bundled price to encourage group dining.", category:"Combo", votes:19, status:"Under Review", date:"2 weeks ago" },
];

const offerCategories = ["Discount","Combo","Loyalty","Seasonal","Other"];

export default function OffersPage({ onBack, accentColor = "#f97316", onGoToCart, cartItems = [], setCartItems }) {
  const cartCount = cartItems.reduce((count, item) => count + (item.qty || 1), 0);
  const [activeTab, setActiveTab] = useState("browse");
  const [addedItems,  setAddedItems]  = useState({});
  const [addedOffers, setAddedOffers] = useState({});
  const [suggestions, setSuggestions] = useState(initialOfferSuggestions);
  const [votedIds, setVotedIds]       = useState([]);

  const [form, setForm]   = useState({ name:"", title:"", desc:"", category:"Discount" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const addOfferItem = (item, offerTitle) => {
    if (!setCartItems) return;
    const cartItem = { ...item, color: item.color || "#FFF8E1", spice:"None", toppings:[], removedIngredients:[], note:`From offer: ${offerTitle}` };
    setCartItems(previousItems => {
      const existingItem = previousItems.find(existing => existing.id === cartItem.id);
      if (existingItem) {
        return previousItems.map(existing => existing.id === cartItem.id
          ? { ...existing, qty: existing.qty + (cartItem.qty || 1) }
          : existing
        );
      }
      return [...previousItems, { ...cartItem, qty: cartItem.qty || 1 }];
    });
  };

  const statusColors = {
    "Under Review": { color:"#d97706", bg:"#fffbeb", icon:"⏳" },
    "Approved":     { color:"#16a34a", bg:"#f0fdf4", icon:"✅" },
    "Declined":     { color:"#dc2626", bg:"#fef2f2", icon:"❌" },
  };

  const toggleVote = (id) => {
    setVotedIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        setSuggestions(sug => sug.map(s => s.id === id ? { ...s, votes: s.votes - 1 } : s));
        return prev.filter(item => item !== id);
      } else {
        setSuggestions(sug => sug.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s));
        return [...prev, id];
      }
    });
  };

  const submitOffer = () => {
    let errs = {};
    if (!form.title.trim()) errs.title = "Offer title is required";
    if (form.desc.trim().length < 15) errs.desc = "Description must be at least 15 characters";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newOffer = {
      id: Date.now(),
      name: form.name.trim() || "Anonymous",
      title: form.title,
      desc: form.desc,
      category: form.category,
      votes: 1,
      status: "Under Review",
      date: "Just now"
    };

    setSuggestions(prev => [newOffer, ...prev]);
    setVotedIds(prev => [...prev, newOffer.id]);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setForm({ name:"", title:"", desc:"", category:"Discount" });
      setErrors({});
      setActiveTab("mine");
    }, 2000);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f4f1ed", fontFamily:"'Trebuchet MS',sans-serif", color:"#111827" }}>

      {/* Hero */}
      <div style={{
        background:`linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)`,
        padding:"32px 40px 36px", position:"relative", overflow:"hidden",
      }}>{[["-30px",null,"180px",`${accentColor}12`],[null,"20px","150px","rgba(255,255,255,0.025)"]].map(([l,r,sz,bg],i)=>(
          <div key={i} style={{position:"absolute",top:"-20px",left:l||undefined,right:r||undefined,width:sz,height:sz,borderRadius:"50%",background:bg,pointerEvents:"none"}}/>
        ))}
        <div style={{ position:"relative", zIndex:1, maxWidth:1140, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:20, marginBottom:24 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:`${accentColor}bb`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>Exclusive Deals</div>
              <h1 style={{ margin:"0 0 6px", fontSize:26, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>Offers & Deals 🏷️</h1>
              <p style={{ margin:0, color:"rgba(255,255,255,0.4)", fontSize:13 }}>Grab a deal and add your favourite offer items straight to your cart</p>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[["6","Live Offers"],["Rs.2,000+","Max Savings"],["100%","Legit Deals"]].map(([v,l])=>(
                <div key={l} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, color:accentColor }}>{v}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display:"flex", gap:10 }}>
            {[
              { id: "browse", label: "🏷️ Browse Offers" },
              { id: "submit", label: "💡 Suggest an Offer" },
              { id: "mine",   label: "💬 Community Ideas" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding:"10px 18px", borderRadius:12, border:"none",
                background: activeTab === tab.id ? accentColor : "rgba(255,255,255,0.1)",
                color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
                fontFamily:"inherit", transition:"all 0.2s",
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"32px 40px 56px" }}>

        {/* ──────── BROWSE CURRENT OFFERS ──────── */}
        {activeTab === "browse" && (
          <div>
            <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
            {currentOffers.map(o => { 
              const allAdded   = addedOffers[o.id];
              const totalSaved = o.items.reduce((s,i) => s + ((i.originalPrice||i.price) - i.price) * i.qty, 0);
              const totalPrice = o.items.reduce((s,i) => s + i.price * i.qty, 0);

              return (
                <div key={o.id} style={{
                  background:"#fff", borderRadius:24, overflow:"hidden",
                  boxShadow:"0 4px 22px rgba(0,0,0,0.07)",
                  border: allAdded ? "2px solid #22c55e" : "1px solid rgba(0,0,0,0.05)",
                  transition:"box-shadow 0.25s",
                }}>

                  {/* Card top banner */}
                  <div style={{
                    background: o.bg,
                    padding:"20px 24px 16px",
                    display:"flex", alignItems:"center", gap:16,
                    position:"relative", overflow:"hidden",
                  }}>
                    <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:`${o.color}15`, pointerEvents:"none" }}/>
                    <div style={{ fontSize:42 }}>{o.emoji}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:22, fontWeight:900, color:o.color, letterSpacing:"-0.5px" }}>{o.discount}</span>
                        <span style={{ fontSize:10, fontWeight:800, color:o.color, background:`${o.color}18`, borderRadius:20, padding:"2px 9px" }}>{o.tag}</span>
                      </div>
                      <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>{o.title}</div>
                      <div style={{ fontSize:11.5, color:"#6b7280", marginTop:3 }}>{o.desc}</div>
                    </div>
                  </div>

                  {/* Included dishes */}
                  <div style={{ padding:"16px 24px" }}>
                    <div style={{ fontSize:11, fontWeight:800, color:"#374151", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:12 }}>
                      📦 Included in this offer
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                      {o.items.map(item => {
                        const itemAdded = addedItems[item.id];
                        const saving = ((item.originalPrice||item.price) - item.price) * item.qty;
                        return (
                          <div key={item.id} style={{
                            display:"flex", alignItems:"center", gap:12,
                            padding:"10px 14px", borderRadius:14,
                            background: itemAdded ? "#f0fdf4" : `${o.color}08`,
                            border: itemAdded ? "1.5px solid #86efac" : `1px solid ${o.color}18`,
                            transition:"all 0.25s",
                          }}>
                            <div style={{
                              width:44, height:44, borderRadius:12, flexShrink:0,
                              background: itemAdded ? "linear-gradient(135deg,#22c55e,#16a34a)" : `linear-gradient(135deg,${o.color}33,${o.color}18)`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:22, transition:"background 0.25s",
                            }}>{itemAdded ? "✓" : item.emoji}</div>

                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>
                                {item.name}
                                {item.qty > 1 && <span style={{ fontSize:11, color:"#9ca3af", marginLeft:6 }}>× {item.qty}</span>}
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
                                <span style={{ fontSize:13, fontWeight:800, color:o.color }}>Rs. {(item.price*item.qty).toLocaleString()}</span>
                                {saving > 0 && ( 
                                  <>
                                    <span style={{ fontSize:11, color:"#9ca3af", textDecoration:"line-through" }}>Rs. {((item.originalPrice||item.price)*item.qty).toLocaleString()}</span>
                                    <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", background:"#dcfce7", borderRadius:6, padding:"1px 6px" }}>Save Rs. {saving.toLocaleString()}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <button onClick={() => {
                              addOfferItem(item, o.title);
                              setAddedItems(p=>({...p,[item.id]:true}));
                            }} style={{
                              padding:"7px 14px", borderRadius:10, border:"none",
                              background: itemAdded
                                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                : `linear-gradient(135deg,${o.color},${o.color}cc)`,
                              color:"#fff", fontWeight:700, fontSize:11, cursor:"pointer",
                              fontFamily:"inherit", flexShrink:0,
                              boxShadow: itemAdded ? "0 3px 10px rgba(34,197,94,0.4)" : `0 3px 10px ${o.color}44`,
                              transition:"all 0.2s",
                              display:"flex", alignItems:"center", gap:5,
                            }}>
                              {itemAdded ? "✓ Added" : "+ Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total + Add All button */}
                    <div style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"14px 16px",
                      background: allAdded ? "#f0fdf4" : `${o.color}08`,
                      border: allAdded ? "1.5px solid #86efac" : `1.5px solid ${o.color}22`,
                      borderRadius:14,
                      gap:14, flexWrap:"wrap",
                    }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>Offer Total:</span>
                          <span style={{ fontSize:18, fontWeight:900, color:o.color }}>Rs. {totalPrice.toLocaleString()}</span>
                          {totalSaved > 0 && (
                            <span style={{ fontSize:11, fontWeight:700, color:"#16a34a", background:"#dcfce7", borderRadius:8, padding:"2px 8px" }}>
                              🎉 Save Rs. {totalSaved.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>📅 {o.expires}</div>
                      </div>

                      <button onClick={() => {
                        o.items.forEach(item => {
                          addOfferItem(item, o.title);
                          setAddedItems(p=>({...p,[item.id]:true}));
                        });
                        setAddedOffers(p=>({...p,[o.id]:true}));
                      }} style={{
                        padding:"11px 24px", borderRadius:13, border:"none",
                        background: allAdded
                          ? "linear-gradient(135deg,#22c55e,#16a34a)"
                          : `linear-gradient(135deg,${o.color},${o.color}cc)`,
                        color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer",fontFamily:"inherit", flexShrink:0,
                        boxShadow: allAdded ? "0 6px 20px rgba(34,197,94,0.45)" : `0 6px 20px ${o.color}44`,
                        transform: allAdded ? "scale(1.02)" : "scale(1)",
                        transition:"all 0.3s",
                        display:"flex", alignItems:"center", gap:8,
                      }}
                        onMouseEnter={e=>{ if(!allAdded) e.currentTarget.style.transform="scale(1.04)"; }}
                        onMouseLeave={e=>e.currentTarget.style.transform= allAdded ? "scale(1.02)" : "scale(1)"}
                      >
                        {allAdded ? "✅ All Added to Cart!" : "🛒 Add All to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* ──────── SUBMIT AN OFFER ──────── */}
        {activeTab === "submit" && (
          <div style={{ maxWidth:640, margin:"0 auto" }}>
            {submitted ? (
              <div style={{
                background:"#fff", borderRadius:24, padding:"48px 36px", textAlign:"center",
                boxShadow:"0 8px 32px rgba(0,0,0,0.08)", border:`2px solid #22c55e33`,
              }}>
                <div style={{ fontSize:64, marginBottom:16, animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
                <h2 style={{ fontSize:22, fontWeight:900, color:"#111827", margin:"0 0 8px" }}>Thanks for the idea!</h2>
                <p style={{ fontSize:13, color:"#6b7280", margin:0 }}>Our team will review your suggestion. Redirecting you to "Community Ideas"…</p>
              </div> ) : (
              <div style={{ background:"#fff", borderRadius:24, padding:"32px 30px", boxShadow:"0 4px 24px rgba(0,0,0,0.06)", border:"1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>💡</div>
                  <div>
                    <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:"#111827" }}>Got an offer idea?</h2>
                    <p style={{ margin:"2px 0 0", fontSize:12, color:"#9ca3af" }}>Tell us what kind of deal you'd love to see</p>
                  </div>
                </div>

                {/* Name */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>Your Name <span style={{fontWeight:400,color:"#9ca3af"}}>(optional)</span></label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Kasun Perera"
                    style={{ width:"100%", boxSizing:"border-box", background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#374151", outline:"none", fontFamily:"inherit" }}/>
                </div>

                {/* Category */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>Offer Category</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {offerCategories.map(c=>(
                      <button key={c} onClick={()=>setForm(f=>({...f,category:c}))} style={{
                        padding:"7px 16px", borderRadius:20, border:"none",
                        background: form.category===c ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#f3f4f6",
                        color: form.category===c ? "#fff" : "#6b7280",
                        fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                        boxShadow: form.category===c ? `0 4px 12px ${accentColor}44` : "none",
                        transition:"all 0.2s",
                      }}>{c}</button>
                    ))}  
                  </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>Offer Title</label>
                  <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Free Dessert with Every Family Meal"
                    style={{ width:"100%", boxSizing:"border-box", background:"#f9fafb", border:`1.5px solid ${errors.title?"#ef4444":"#e5e7eb"}`, borderRadius:10, padding:"11px 14px", fontSize:13, color:"#374151", outline:"none", fontFamily:"inherit" }}/>
                  {errors.title && <div style={{ fontSize:11, color:"#ef4444", marginTop:5 }}>{errors.title}</div>}
                </div>

                {/* Description */}
                <div style={{ marginBottom:22 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:"#374151" }}>Describe your idea</label>
                    <span style={{ fontSize:11, color: form.desc.length>=15 ? "#22c55e" : "#9ca3af" }}>{form.desc.length}/300</span>
                  </div>
                  <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value.slice(0,300)}))}
                    placeholder="What would this offer include? Who is it for? Why would customers love it?"
                    rows={4}
                    style={{ width:"100%", boxSizing:"border-box", background:"#f9fafb", border:`1.5px solid ${errors.desc?"#ef4444":form.desc.length>=15?"#22c55e":"#e5e7eb"}`, borderRadius:10, padding:"11px 14px", fontSize:13, color:"#374151", outline:"none", resize:"none", fontFamily:"inherit", lineHeight:1.6 }}/>
                  {errors.desc && <div style={{ fontSize:11, color:"#ef4444", marginTop:5 }}>{errors.desc}</div>}
                </div>

                <button onClick={submitOffer} style={{
                  width:"100%", padding:"14px", borderRadius:13, border:"none",
                  background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                  boxShadow:`0 8px 24px ${accentColor}44`,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"transform 0.15s",
                }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.015)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                >🚀 Submit My Offer Idea</button>
              </div>
            )}
          </div>
        )}

        {/* ──────── ALL SUGGESTIONS (community board) ──────── */}
        {activeTab === "mine" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <h2 style={{ fontSize:17, fontWeight:900, color:"#111827", margin:0 }}>Community Offer Ideas</h2>
              <button onClick={()=>setActiveTab("submit")} style={{
                padding:"9px 18px", borderRadius:11, border:"none",
                background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                color:"#fff", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit",
                boxShadow:`0 4px 14px ${accentColor}44`,
              }}>💡 Add Your Idea</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {suggestions
                .slice()
                .sort((a,b)=>b.votes-a.votes)
                .map(s => {
                  const sc = statusColors[s.status] || statusColors["Under Review"];
                  const voted = votedIds.includes(s.id);
                  return (
                    <div key={s.id} style={{
                      background:"#fff", borderRadius:18, padding:"18px 20px",
                      border:"1px solid rgba(0,0,0,0.05)",
                      boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
                      display:"flex", gap:16, alignItems:"flex-start",
                    }}>
                      {/* Vote button */}
                      <button onClick={()=>toggleVote(s.id)} style={{
                        display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                        background: voted ? `${accentColor}15` : "#f9fafb",
                        border: voted ? `1.5px solid ${accentColor}55` : "1.5px solid #e5e7eb",
                        borderRadius:12, padding:"8px 14px", cursor:"pointer", fontFamily:"inherit",
                        flexShrink:0, transition:"all 0.2s", minWidth:54,
                      }}>
                        <span style={{ fontSize:16, color: voted ? accentColor : "#9ca3af" }}>{voted ? "▲" : "△"}</span>
                        <span style={{ fontSize:13, fontWeight:800, color: voted ? accentColor : "#374151" }}>{s.votes}</span>
                      </button>

                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                          <span style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{s.title}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:accentColor, background:`${accentColor}12`, borderRadius:7, padding:"2px 8px" }}>{s.category}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:sc.color, background:sc.bg, borderRadius:7, padding:"2px 8px" }}>{sc.icon} {s.status}</span>
                        </div>
                        <p style={{ margin:"0 0 8px", fontSize:12.5, color:"#6b7280", lineHeight:1.6 }}>{s.desc}</p>
                        <div style={{ fontSize:11, color:"#9ca3af" }}>— {s.name} · {s.date}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn      { 0%{transform:scale(0) rotate(-15deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes slideDown  { from{transform:translateY(-20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes cartSlide  { from{transform:translateX(-50%) translateY(80px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }`}</style>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div style={{
          position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
          background:`linear-gradient(135deg,${accentColor},${accentColor}dd)`,
          borderRadius:24, padding:"14px 28px",
          display:"flex", alignItems:"center", gap:20,
          boxShadow:`0 8px 40px ${accentColor}55`,
          zIndex:300, animation:"cartSlide 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          backdropFilter:"blur(12px)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:34, height:34, borderRadius:"50%",
              background:"rgba(255,255,255,0.25)", border:"1.5px solid rgba(255,255,255,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:900, color:"#fff",
            }}>🛒</div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>
                {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)" }}>
                Offer items saved — ready to order!
              </div>
            </div>
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.3)" }}/>
          <button onClick={onGoToCart} style={{
            padding:"10px 22px", borderRadius:14, border:"none",
            background:"rgba(255,255,255,0.95)",
            color:accentColor, fontWeight:800, fontSize:13,
            cursor:"pointer", fontFamily:"inherit",
            display:"flex", alignItems:"center", gap:6,
            boxShadow:"0 4px 14px rgba(0,0,0,0.15)",
            transition:"transform 0.15s",
          }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            View Cart →
          </button>
        </div>
      )}

    </div>
  );
}