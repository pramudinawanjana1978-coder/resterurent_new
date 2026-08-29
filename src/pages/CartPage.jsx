import { useState } from 'react';
import { PaymentPage } from './PaymentPage.jsx';

// ─── CART PAGE ─────────────────────────────────────────────────────────────────

const promoMap = { "WELCOME20":20, "SAVE10":10, "FIRST15":15 };

const suggestedItems = [
  { id:11, name:"Waffles & Cream",  emoji:"🧇", price:1670, category:"Breakfast" },
  { id:406,name:"Matcha Latte",     emoji:"🍵", price:1015, category:"Drinks"    },
  { id:301,name:"Chocolate Fondant",emoji:"🍫", price:1450, category:"Desserts"  },
  { id:102,name:"Chicken Wrap",     emoji:"🥙", price:1750, category:"Lunch"     },
];

function CartPage({ onBack, onTrack, accentColor, cartItems = [], setCartItems }) {
  const getNumericPrice = (price) => typeof price === "string"
    ? parseInt(price.replace(/[^0-9]/g, ""), 10) || 0
    : Number(price) || 0;
  const items = cartItems.map(item => ({ ...item, price: getNumericPrice(item.price) }));
  const [showPayment, setShowPayment] = useState(false);
  const [removing, setRemoving]       = useState(null);
  const [tip, setTip]                 = useState(10);
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedDate, setSchedDate]     = useState("");
  const [schedTime, setSchedTime]     = useState("");
  const [schedNote, setSchedNote]     = useState("");
  const [schedSaved, setSchedSaved]   = useState(false);

  const subtotal      = items.reduce((s,i) => s + getNumericPrice(i.price) * (i.qty || 0), 0);
  const serviceCharge = Math.round(subtotal * 0.10);
  const tipAmt        = Math.round(subtotal * tip / 100);
  const total         = subtotal + serviceCharge + tipAmt;
  const orderSummary  = { subtotal, serviceCharge, tipAmt, total };

  const catColors = { Breakfast:"#f5a623", Lunch:"#43a047", Dinner:"#c62828", Desserts:"#ad1457", Drinks:"#0277bd" };

  const changeQty = (id, delta) => {
    if (!setCartItems) return;
    setCartItems(prev => prev.map(i => i.id===id ? {...i, qty:Math.max(1, i.qty+delta)} : i));
  };

  const removeItem = (id) => {
    if (!setCartItems) return;
    setRemoving(id);
    setTimeout(() => {
      setCartItems(prev => prev.filter(i => i.id !== id));
      setRemoving(null);
    }, 400);
  };

  if (showPayment) return (
    <PaymentPage
      total={total}
      items={items}
      orderSummary={orderSummary}
      accentColor={accentColor}
      onBack={() => setShowPayment(false)}
      onHome={() => { if (setCartItems) setCartItems([]); onBack(); }}
      onTrack={onTrack}
    />
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f4f1ed", fontFamily:"'Trebuchet MS',sans-serif", color:"#1a1a1a" }}>

      {/* ── Top Bar ── */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(0,0,0,0.06)",
        padding:"0 40px", height:66,
        display:"flex", alignItems:"center", gap:16,
        boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:7,
          background:"#f2f2f2", border:"none", borderRadius:10,
          padding:"8px 16px", color:"#555", cursor:"pointer",
          fontSize:13, fontWeight:600, fontFamily:"inherit", transition:"background 0.2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="#e6e6e6"}
          onMouseLeave={e=>e.currentTarget.style.background="#f2f2f2"}
        >← Home</button>

        <div style={{ fontSize:13, color:"#bbb" }}>
          <span style={{ color:"#888" }}>Menu</span>
          <span style={{ margin:"0 6px" }}>›</span>
          <span style={{ color:accentColor, fontWeight:700 }}>Your Cart</span>
        </div>

        <div style={{ flex:1, maxWidth:340, marginLeft:12 }}>
          <div style={{ display:"flex", alignItems:"center", background:"#f2f2f2", borderRadius:10, padding:"0 14px", gap:8 }}>
            <span style={{ color:"#bbb", fontSize:14 }}>🔍</span>
            <input placeholder="Search for food, drinks..." style={{
              border:"none", background:"none", fontSize:13, color:"#333",
              outline:"none", padding:"9px 0", width:"100%", fontFamily:"inherit",
            }}/>
          </div>
        </div>

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:21, opacity:0.6 }}>🔔</span>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:21 }}>🛒</span>
            <span style={{
              position:"absolute", top:-5, right:-5,
              background:accentColor, color:"#fff", borderRadius:"50%",
              width:16, height:16, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:9, fontWeight:800,
            }}>{items.reduce((s,i)=>s+i.qty,0)}</span>
          </div>
          <div style={{
            width:34, height:34, borderRadius:"50%",
            background:`linear-gradient(135deg,${accentColor},${accentColor}99)`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
          }}>👤</div>
        </div>
      </div>

      {/* ── Hero strip ── */}
      <div style={{
        background:`linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)`,
        padding:"32px 44px 36px", position:"relative", overflow:"hidden",
      }}>
        {/* bg blobs */}
        {[["-30px",null,"180px",`${accentColor}14`],[null,"40px","240px","rgba(255,255,255,0.03)"]].map(([l,r,sz,bg],i)=>(
          <div key={i} style={{ position:"absolute",top:"-40px",left:l||undefined,right:r||undefined,width:sz,height:sz,borderRadius:"50%",background:bg,pointerEvents:"none" }}/>
        ))}
        <div style={{ position:"relative", zIndex:1, maxWidth:1160, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:`${accentColor}cc`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>
              Your Selection
            </div>
            <h1 style={{ margin:"0 0 4px", fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>
              Shopping Cart
            </h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:13 }}>
              {items.reduce((s,i)=>s+i.qty,0)} items · Est. total{" "}
              <span style={{ color:accentColor, fontWeight:700 }}>Rs. {total.toLocaleString()}</span>
            </p>
          </div>
          {/* Mini category breakdown pills */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {Object.entries(
              items.reduce((acc,i)=>{ acc[i.category]=(acc[i.category]||0)+i.qty; return acc; },{})
            ).map(([cat,count])=>(
              <div key={cat} style={{
                background:"rgba(255,255,255,0.08)", border:`1px solid ${catColors[cat]||accentColor}44`,
                borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6,
              }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:catColors[cat]||accentColor,display:"inline-block" }}/>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{cat}</span>
                <span style={{ fontSize:11, color:catColors[cat]||accentColor, fontWeight:800 }}>×{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"32px 44px 56px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 370px", gap:28 }}>

          {/* LEFT — Cart Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <h2 style={{ margin:0, fontSize:17, fontWeight:800, color:"#1a1a1a" }}>
                Cart Items <span style={{ fontWeight:400, color:"#aaa", fontSize:14 }}>({items.length})</span>
              </h2>
              <button onClick={()=>{ if (setCartItems) setCartItems([]); }} style={{
                background:"none", border:"none", color:"#e53935", fontSize:12,
                fontWeight:600, cursor:"pointer", fontFamily:"inherit", opacity:0.7,
              }}>🗑 Clear All</button>
            </div>

            {items.length === 0 && (
              <div style={{
                background:"#fff", borderRadius:20, padding:"60px 30px",
                textAlign:"center", border:"2px dashed #e0e0e0",
              }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#555", marginBottom:8 }}>Your cart is empty</div>
                <div style={{ fontSize:13, color:"#aaa" }}>Add something delicious to get started!</div>
              </div>
            )}

            {items.map((item, idx) => {
              const catColor = catColors[item.category] || accentColor;
              const isRemoving = removing === item.id;
              return (
                <div key={item.id} style={{
                  background:"#fff", borderRadius:20,
                  border:`1px solid rgba(0,0,0,0.05)`,
                  boxShadow:"0 2px 14px rgba(0,0,0,0.05)",
                  overflow:"hidden",
                  opacity: isRemoving ? 0 : 1,
                  transform: isRemoving ? "translateX(60px) scale(0.95)" : "translateX(0) scale(1)",
                  transition:"all 0.38s cubic-bezier(0.4,0,0.2,1)",
                  borderLeft:`4px solid ${catColor}`,
                }}>
                  <div style={{ display:"flex", alignItems:"stretch", gap:0 }}>

                    {/* Emoji thumbnail */}
                    <div style={{
                      width:96, flexShrink:0,
                      background:`linear-gradient(135deg,${item.color},${item.color}aa)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:46,
                    }}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width:"100%", height:"100%", objectFit:"cover" }}
                        />
                      ) : item.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, padding:"16px 18px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            <span style={{
                              fontSize:9, fontWeight:800, color:catColor,
                              background:`${catColor}15`, borderRadius:8,
                              padding:"2px 8px", letterSpacing:"0.5px", textTransform:"uppercase",
                            }}>{item.category}</span>
                            {item.spice !== "None" && (
                              <span style={{
                                fontSize:9, fontWeight:700, color:"#e53935",
                                background:"#ffebee", borderRadius:8, padding:"2px 8px",
                              }}>🌶 {item.spice}</span>
                            )}
                          </div>
                          <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a", marginBottom:2 }}>{item.name}</div>
                          {item.note && (
                            <div style={{ fontSize:11, color:"#aaa", fontStyle:"italic" }}>
                              📝 {item.note}
                            </div>
                          )}
                        </div>
                        <button onClick={()=>removeItem(item.id)} style={{
                          background:"#fff0f0", border:"none", borderRadius:"50%",
                          width:30, height:30, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:14, color:"#e53935", flexShrink:0,
                          transition:"all 0.2s",
                        }}
                          onMouseEnter={e=>{e.currentTarget.style.background="#e53935";e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="#fff0f0";e.currentTarget.style.color="#e53935";}}
                        >✕</button>
                      </div>

                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
                        {/* Qty stepper */}
                        <div style={{ display:"flex", alignItems:"center", gap:0 }}>
                          <button onClick={()=>changeQty(item.id,-1)} style={{
                            width:32, height:32, borderRadius:"10px 0 0 10px",
                            background:`${accentColor}18`, border:`1px solid ${accentColor}33`,
                            borderRight:"none", color:accentColor, cursor:"pointer",
                            fontSize:18, fontWeight:700, fontFamily:"inherit",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            transition:"background 0.2s",
                          }}
                            onMouseEnter={e=>e.currentTarget.style.background=`${accentColor}30`}
                            onMouseLeave={e=>e.currentTarget.style.background=`${accentColor}18`}
                          >−</button>
                          <div style={{
                            width:38, height:32,
                            background:"#fff", border:`1px solid ${accentColor}33`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:14, fontWeight:800, color:"#1a1a1a",
                          }}>{item.qty}</div>
                          <button onClick={()=>changeQty(item.id,1)} style={{
                            width:32, height:32, borderRadius:"0 10px 10px 0",
                            background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                            border:"none", color:"#fff", cursor:"pointer",
                            fontSize:18, fontWeight:700, fontFamily:"inherit",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:`0 2px 8px ${accentColor}44`,
                            transition:"all 0.2s",
                          }}
                            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
                            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                          >+</button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:12, color:"#bbb" }}>
                            Rs. {item.price.toLocaleString()} × {item.qty}
                          </div>
                          <div style={{ fontSize:18, fontWeight:900, color:catColor }}>
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* You May Also Like */}
            {suggestedItems.length > 0 && (
              <div style={{
                background:"#fff", borderRadius:20,
                border:"1px solid rgba(0,0,0,0.05)",
                boxShadow:"0 2px 14px rgba(0,0,0,0.04)",
                padding:"20px 22px", marginTop:4,
              }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:14 }}>
                  ✨ You Might Also Love
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                  {suggestedItems.map(s => {
                    const cc = catColors[s.category] || accentColor;
                    return (
                      <div key={s.id} style={{
                        borderRadius:14, border:`1px solid ${cc}22`,
                        background:`${cc}08`, padding:"14px 12px", textAlign:"center",
                        cursor:"pointer", transition:"all 0.2s",
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 20px ${cc}22`;}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
                      >
                        <div style={{ fontSize:36, marginBottom:8 }}>{s.emoji}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#1a1a1a", marginBottom:4, lineHeight:1.3 }}>{s.name}</div>
                        <div style={{ fontSize:11, fontWeight:700, color:cc, marginBottom:10 }}>Rs. {s.price.toLocaleString()}</div>
                        <button onClick={()=>{
                          if (!setCartItems) return;
                          setCartItems(prev => {
                            const exists = prev.find(i => i.id === s.id);
                            if (exists) {
                              return prev.map(i => i.id === s.id ? { ...i, qty: i.qty + 1 } : i);
                            }
                            return [...prev, { ...s, qty:1, note:"", spice:"None", color:"#FFF8E1", price:getNumericPrice(s.price) }];
                          });
                        }} style={{
                          width:"100%", padding:"6px 0",
                          background:`linear-gradient(135deg,${cc},${cc}cc)`,
                          border:"none", borderRadius:8, color:"#fff",
                          fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                        }}>+ Add</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Order Summary */}
          <div style={{ position:"sticky", top:84, alignSelf:"start", display:"flex", flexDirection:"column", gap:16 }}>

            {/* Tip selector */}
            <div style={{
              background:"#fff", borderRadius:18, padding:"18px 20px",
              border:"1px solid rgba(0,0,0,0.05)",
              boxShadow:"0 2px 14px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:10 }}>
                💝 Add a Tip for Our Chefs
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {[0,5,10,15,20].map(t=>(
                  <button key={t} onClick={()=>setTip(t)} style={{
                    flex:1, padding:"8px 0",
                    background: tip===t ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#f6f6f6",
                    border: tip===t ? "none" : "1px solid #e8e8e8",
                    borderRadius:10, color: tip===t ? "#fff" : "#555",
                    fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                    boxShadow: tip===t ? `0 4px 12px ${accentColor}44` : "none",
                    transition:"all 0.2s",
                  }}>{t===0?"No tip":`${t}%`}</button>
                ))}
              </div>
              {tip>0 && <div style={{ fontSize:11, color:accentColor, fontWeight:700, marginTop:8 }}>Chef tip: Rs. {tipAmt.toLocaleString()}</div>}
            </div>

            {/* Order Summary */}
            <div style={{
              background:"#fff", borderRadius:18, overflow:"hidden",
              border:"1px solid rgba(0,0,0,0.05)",
              boxShadow:"0 4px 24px rgba(0,0,0,0.07)",
            }}>
              {/* Header */}
              <div style={{
                background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                padding:"16px 22px",
              }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", letterSpacing:"1px", textTransform:"uppercase", fontWeight:700 }}>Order Summary</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#fff", marginTop:3 }}>
                  {items.reduce((s,i)=>s+i.qty,0)} items · {Object.keys(items.reduce((a,i)=>{a[i.category]=1;return a},{})).length} categories
                </div>
              </div>

              <div style={{ padding:"18px 20px" }}>

                {/* Breakdown */}
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
                  {/* Subtotal */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, color:"#888" }}>Subtotal</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"#444" }}>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {/* Service charge */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, color:"#888" }}>Service Charge <span style={{ fontSize:10, color:"#bbb" }}>(10%)</span></span>
                    <span style={{ fontSize:13, fontWeight:600, color:"#444" }}>Rs. {serviceCharge.toLocaleString()}</span>
                  </div>
                  {/* Tip row — only when tip > 0 */}
                  {tip > 0 && (
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, color:"#888" }}>Chef Tip <span style={{ fontSize:10, color:"#bbb" }}>({tip}%)</span></span>
                      <span style={{ fontSize:13, fontWeight:600, color:"#444" }}>Rs. {tipAmt.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height:1, background:`linear-gradient(90deg,${accentColor}44,${accentColor}11)`, marginBottom:14 }}/>

                {/* Total */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>Total</span>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:26, fontWeight:900, color:accentColor, lineHeight:1 }}>
                      Rs. {total.toLocaleString()}
                    </div>
                    <div style={{ fontSize:10, color:"#bbb", marginTop:2 }}>Inclusive of all charges</div>
                  </div>
                </div>

                {/* Scheduled label (shown when scheduled) */}
                {schedSaved && (
                  <div style={{
                    marginBottom:14, padding:"10px 14px",
                    background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12,
                    display:"flex", alignItems:"center", gap:8,
                  }}>
                    <span style={{ fontSize:16 }}>📅</span>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#16a34a" }}>Scheduled Order</div>
                      <div style={{ fontSize:11, color:"#6b7280" }}>{schedDate} at {schedTime}</div>
                    </div>
                    <button onClick={()=>setSchedSaved(false)} style={{ marginLeft:"auto", background:"none", border:"none", color:"#9ca3af", cursor:"pointer", fontSize:14 }}>✕</button>
                  </div>
                )}

                {/* Place Order */}
                <button onClick={()=>setShowPayment(true)} style={{
                  width:"100%", padding:"15px",
                  background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  border:"none", borderRadius:14, color:"#fff",
                  fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit",
                  boxShadow:`0 8px 28px ${accentColor}55`,
                  transition:"transform 0.15s, box-shadow 0.15s",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                  letterSpacing:"0.3px", marginBottom:10,
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow=`0 12px 36px ${accentColor}66`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 8px 28px ${accentColor}55`;}}
                >
                  🛒 Place Order
                </button>

                {/* Schedule + Save Cart */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                  <button onClick={()=>setShowSchedule(true)} style={{
                    padding:"11px", borderRadius:12, fontFamily:"inherit",
                    background: schedSaved ? "#f0fdf4" : "#f6f6f6",
                    border: schedSaved ? "1.5px solid #22c55e" : "1px solid #e8e8e8",
                    color: schedSaved ? "#16a34a" : "#555",
                    fontWeight:700, fontSize:12, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    transition:"all 0.2s",
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background=schedSaved?"#dcfce7":"#ebebeb";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=schedSaved?"#f0fdf4":"#f6f6f6";}}
                  >
                    {schedSaved ? "✓ Scheduled" : "📅 Schedule"}
                  </button>
                  <button style={{
                    padding:"11px", background:"transparent",
                    border:`1.5px solid ${accentColor}`, borderRadius:12, color:accentColor,
                    fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  }}>❤️ Save Cart</button>
                </div>

                {/* Trust badges */}
                <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
                  {[["🔒","Secure"],["⚡","Fast"],["✅","Quality"]].map(([icon,label])=>(
                    <div key={label} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18 }}>{icon}</div>
                      <div style={{ fontSize:9, color:"#bbb", fontWeight:600, marginTop:2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Schedule Modal ── */}
      {showSchedule && (
        <div
          onClick={()=>setShowSchedule(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              background:"#fff", borderRadius:24, maxWidth:420, width:"100%",
              boxShadow:"0 32px 80px rgba(0,0,0,0.2)",
              overflow:"hidden",
              animation:"schedPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Modal header */}
            <div style={{
              background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
              padding:"22px 24px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Plan Ahead</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>📅 Schedule Your Order</div>
              </div>
              <button onClick={()=>setShowSchedule(false)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>

            <div style={{ padding:"24px" }}>
              {/* Date */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>📆 Select Date</label>
                <input
                  type="date"
                  value={schedDate}
                  onChange={e=>setSchedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    width:"100%", boxSizing:"border-box",
                    background:"#f9fafb", border:`1.5px solid ${schedDate?"#22c55e":"#e5e7eb"}`,
                    borderRadius:12, padding:"11px 14px", fontSize:14, color:"#374151",
                    outline:"none", fontFamily:"inherit", cursor:"pointer",
                    transition:"border-color 0.2s",
                  }}
                />
              </div>

              {/* Time slots */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:8 }}>🕐 Select Time Slot</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {["12:00 PM","12:30 PM","01:00 PM","01:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM"].map(t=>(
                    <button key={t} onClick={()=>setSchedTime(t)} style={{
                      padding:"9px 6px", borderRadius:10, border:"none",
                      background: schedTime===t ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#f3f4f6",
                      color: schedTime===t ? "#fff" : "#6b7280",
                      fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                      boxShadow: schedTime===t ? `0 4px 10px ${accentColor}44` : "none",
                      transition:"all 0.18s",
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>📝 Special Instructions <span style={{ fontWeight:400, color:"#9ca3af" }}>(optional)</span></label>
                <textarea
                  value={schedNote} onChange={e=>setSchedNote(e.target.value)}
                  placeholder="e.g. Please deliver to Table 5 at the garden area…"
                  rows={3}
                  style={{
                    width:"100%", boxSizing:"border-box",
                    background:"#f9fafb", border:"1.5px solid #e5e7eb",
                    borderRadius:12, padding:"10px 14px", color:"#374151",
                    fontSize:13, resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.6,
                  }}
                />
              </div>

              {/* Summary line */}
              {schedDate && schedTime && (
                <div style={{ marginBottom:18, padding:"10px 14px", background:`${accentColor}0c`, border:`1px solid ${accentColor}22`, borderRadius:12 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:accentColor }}>✓ Your order will arrive on {schedDate} at {schedTime}</span>
                </div>
              )}

              {/* Confirm */}
              <button
                onClick={()=>{
                  if(schedDate && schedTime){ setSchedSaved(true); setShowSchedule(false); }
                }}
                disabled={!schedDate||!schedTime}
                style={{
                  width:"100%", padding:"14px",
                  background: schedDate&&schedTime ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#e5e7eb",
                  border:"none", borderRadius:13, color: schedDate&&schedTime ? "#fff" : "#9ca3af",
                  fontWeight:800, fontSize:15, cursor: schedDate&&schedTime ? "pointer" : "not-allowed",
                  fontFamily:"inherit",
                  boxShadow: schedDate&&schedTime ? `0 6px 20px ${accentColor}44` : "none",
                  transition:"all 0.2s",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}
                onMouseEnter={e=>{ if(schedDate&&schedTime) e.currentTarget.style.transform="scale(1.02)"; }}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              >
                📅 Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes schedPop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>

      {/* ── Footer ── */}
      <div style={{
        background:"#fff", borderTop:"1px solid #efefef",
        padding:"24px 44px",
        display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32,
      }}>
        {[
          { icon:"🕐", title:"Operating Hours", lines:["Mon – Sun","10:00 AM – 11:00 PM"] },
          { icon:"📞", title:"Contact Us",      lines:["+94 77 599 5735","info@smartrestaurant.lk"] },
          { icon:"📍", title:"Our Location",    lines:["123, Galle Road,","Colombo 03, Sri Lanka"] },
          { icon:"👥", title:"Follow Us",       social:true },
        ].map((col,i) => (
          <div key={i}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:17, color:accentColor }}>{col.icon}</span>
              <span style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{col.title}</span>
            </div>
            {col.lines?.map((l,j) => <div key={j} style={{ fontSize:12, color:"#888", marginBottom:3 }}>{l}</div>)}
            {col.social && (
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                {["🔵","📸","🐦","▶️"].map((s,j)=>(
                  <div key={j} style={{
                    width:30, height:30, borderRadius:"50%",
                    background:`${accentColor}12`, border:`1px solid ${accentColor}22`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, cursor:"pointer",
                  }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
}
export default CartPage;