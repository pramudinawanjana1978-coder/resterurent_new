import { useState } from 'react';
import { dishVariants, allDishes, categoryConfig } from '../data/data.js';
import { Stars } from "../components/Shared.jsx";
import { PaymentPage } from './PaymentPage.jsx';

const makeVariants = (dish) => [
  { label: "Original",     bg: dish.color + "cc", emoji: dish.emoji, note: dish.desc },
  { label: "Spicy",        bg: "#fbe9e7cc",        emoji: "🌶️",       note: "Extra spicy version" },
  { label: "Large",        bg: dish.color + "cc",  emoji: dish.emoji, note: "Extra large portion" },
  { label: "Chef Special", bg: "#fffde7cc",         emoji: "⭐",        note: "House twist" },
];

// Mock reviews data (Error එක නිවැරදි කර ඇත - likes සඳහා අගයන් ලබා දී ඇත)
const mockReviews = [
  { avatar: "👨", name: "Amal Silva", stars: 5, time: "2 days ago", text: "The food was absolutely delicious and fresh!", likes: 14 },
  { avatar: "👩", name: "Pramudi", stars: 4, time: "1 week ago", text: "Great taste and neat packaging. Will order again.", likes: 8 },
  { avatar: "🧑", name: "Nimal Perera", stars: 5, time: "3 days ago", text: "Highly recommended! Fast preparation too.", likes: 3 }
];

// ─── DISH DETAIL PAGE ─────────────────────────────────────────────────────────

function DishDetailPage({ dish, category, onBack, cartItems, setCartItems, accentColor, onTrack }) {
  const variants = dishVariants[dish.id] ? dishVariants[dish.id].variants : makeVariants(dish);
  const [variantIdx, setVariantIdx]   = useState(0);
  const [animDir, setAnimDir]         = useState(null);
  const [quantity, setQuantity]       = useState(1);
  const [spice, setSpice]             = useState("Medium");
  const [toppings, setToppings]       = useState([]);
  const [remove, setRemove]           = useState([]);
  const [notes, setNotes]             = useState("");
  const [liked, setLiked]             = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgVisible, setImgVisible]   = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  const basePrice = parseInt(dish.price.replace(/[^0-9]/g,""));
  const toppingPrices = { "Extra sweet onion relish": 100, "Extra Ambul thiyal": 100, "Extra milk rice": 150 };
  const toppingTotal = toppings.reduce((s,t) => s+(toppingPrices[t]||0), 0);
  const totalPrice = (basePrice + toppingTotal) * quantity;

  const cv = variants[variantIdx];

  const goVariant = (dir) => {
    setAnimDir(dir);
    setImgVisible(false);
    setTimeout(() => {
      setVariantIdx(i => (i+dir+variants.length)%variants.length);
      setImgVisible(true);
      setAnimDir(null);
    }, 220);
  };

  const similarDishes = Object.values(allDishes).flat()
    .filter(d => d.id !== dish.id && d.id !== dish.id+1)
    .slice(0,4);

  const handleCart = () => {
    if (setCartItems) {
      setCartItems(prev => {
        const existing = prev.find(i => i.id === dish.id);
        if (existing) {
          return prev.map(i => i.id === dish.id ? {
            ...i,
            qty: i.qty + quantity,
            spice,
            toppings,
            removedIngredients: remove,
            note: notes,
          } : i);
        }
        return [
          ...prev,
          {
            ...dish,
            category,
            qty: quantity,
            spice,
            toppings,
            removedIngredients: remove,
            note: notes,
            price: basePrice,
          },
        ];
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const bannerGrad = categoryConfig[category]?.bannerGrad || "linear-gradient(135deg,#fff3e0,#ffe0a0)";

  if (showPayment) {
    const singleItem = [{ ...dish, qty: quantity, price: totalPrice / quantity, color: "#FFF3E0" }];
    return (
      <PaymentPage
        total={totalPrice}
        items={singleItem}
        accentColor={accentColor}
        onBack={() => setShowPayment(false)}
        onHome={onBack}
        onTrack={onTrack}
      />
    );
  }

  return (
    <div style={{
      minHeight:"100vh", background:"#faf8f5",
      fontFamily:"'Trebuchet MS', sans-serif", color:"#1a1a1a",
    }}>
      {/* Top bar */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(0,0,0,0.07)",
        padding:"0 40px", height:64,
        display:"flex", alignItems:"center", gap:20,
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:8,
          background:"#f5f5f5", border:"1px solid rgba(0,0,0,0.08)",
          borderRadius:10, padding:"8px 16px", color:"#555",
          cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          transition:"all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background="#ebebeb"}
          onMouseLeave={e => e.currentTarget.style.background="#f5f5f5"}
        >← Back to Menu</button>
        <div style={{ flex:1 }}>
          <input placeholder="Search for food, drinks..." style={{
            background:"#f5f5f5", border:"1px solid rgba(0,0,0,0.08)",
            borderRadius:10, padding:"8px 18px", color:"#333", fontSize:13,
            outline:"none", width:280, fontFamily:"inherit",
          }}/>
        </div>
        <div style={{ display:"flex", gap:12, marginLeft:"auto" }}>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:22 }}>🔔</span>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:22 }}>🛒</span>
            <span style={{
              position:"absolute", top:-6, right:-6, background:accentColor,
              color:"#fff", borderRadius:"50%", width:16, height:16,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:700,
            }}>3</span>
          </div>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            background:`linear-gradient(135deg,${accentColor},${accentColor}99)`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
          }}>👤</div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32 }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Main image carousel */}
            <div style={{ display:"flex", gap:20, marginBottom:32 }}>

              {/* Photo area */}
              <div style={{ flex:1 }}>
                <div style={{
                  position:"relative", borderRadius:20, overflow:"hidden",
                  background: cv.bg, height:340,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  border:`1px solid ${accentColor}22`,
                  boxShadow:`0 12px 40px ${accentColor}22`,
                }}>
                  {/* Favourite */}
                  <button onClick={() => setLiked(l => !l)} style={{
                    position:"absolute", top:16, right:16, zIndex:3,
                    width:40, height:40, borderRadius:"50%",
                    background:"rgba(255,255,255,0.85)", border:"none",
                    cursor:"pointer", fontSize:18, transition:"transform 0.2s",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform="scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                  >{liked ? "❤️" : "🤍"}</button>

                  {/* Variant label badge */}
                  <div style={{
                    position:"absolute", top:16, left:16, zIndex:3,
                    background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                    color:"#fff", borderRadius:8, padding:"4px 12px",
                    fontSize:11, fontWeight:700, letterSpacing:"0.5px",
                  }}>{cv.label}</div>

                  {/* Giant image or emoji */}
                  {cv.image || dish.image ? (
                    <img 
                      src={cv.image || dish.image} 
                      alt={dish.name}
                      style={{
                        width:"100%",
                        height:"100%",
                        objectFit:"cover",
                        opacity: imgVisible ? 1 : 0,
                        transform: imgVisible ? "scale(1) translateX(0)" : animDir === 1 ? "scale(0.7) translateX(-60px)" : "scale(0.7) translateX(60px)",
                        transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
                        filter:"drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
                        userSelect:"none",
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize:150,
                      opacity: imgVisible ? 1 : 0,
                      transform: imgVisible ? "scale(1) translateX(0)" : animDir === 1 ? "scale(0.7) translateX(-60px)" : "scale(0.7) translateX(60px)",
                      transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
                      filter:"drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
                      userSelect:"none",
                    }}>{cv.emoji}</div>
                  )}

                  {/* Arrows */}
                  {[-1,1].map(dir => (
                    <button key={dir} onClick={() => goVariant(dir)} style={{
                      position:"absolute", top:"50%", transform:"translateY(-50%)",
                      [dir===-1?"left":"right"]: 14, zIndex:3,
                      width:38, height:38, borderRadius:"50%",
                      background:"rgba(255,255,255,0.88)", border:"none",
                      cursor:"pointer", fontSize:18, fontWeight:700,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 4px 14px rgba(0,0,0,0.25)", transition:"transform 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform="translateY(-50%) scale(1.12)"}
                      onMouseLeave={e => e.currentTarget.style.transform="translateY(-50%) scale(1)"}
                    >{dir===-1?"‹":"›"}</button>
                  ))}
                </div>

                <p style={{ margin:"8px 0 0", fontSize:12, color:"#8b9ab8", textAlign:"center" }}>
                  {cv.note}
                </p>
              </div>

              {/* Dish info */}
              <div style={{ flex:1 }}>
                <div style={{
                  display:"inline-block", padding:"3px 12px", borderRadius:20,
                  background:`${accentColor}22`, color:accentColor,
                  fontSize:11, fontWeight:700, letterSpacing:"0.8px",
                  textTransform:"uppercase", marginBottom:10,
                }}>{category}</div>
                <h1 style={{ margin:"0 0 8px", fontSize:30, fontWeight:800, color:"#1a1a1a", lineHeight:1.2 }}>
                  {dish.name}
                </h1>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <Stars rating={dish.rating} color={accentColor} size={16}/>
                  <span style={{ color:accentColor, fontWeight:700, fontSize:15 }}>{dish.rating}</span>
                  <span style={{ color:"#888", fontSize:13 }}>({dish.reviews}+ reviews)</span>
                </div>
                <div style={{ fontSize:28, fontWeight:800, color:accentColor, marginBottom:16 }}>
                  {dish.price}
                </div>

                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:8 }}>Description</div>
                  <p style={{ fontSize:13, color:"#666", lineHeight:1.7, margin:0 }}>{dish.desc}</p>
                </div>

                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:10 }}>Ingredients</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {dish.ingredients.map((ing,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#666" }}>
                        <span style={{ color:accentColor, fontSize:15 }}>✓</span> {ing}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* You May Also Like */}
            <div style={{ marginBottom:36 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#1a1a1a", margin:"0 0 16px", letterSpacing:"-0.3px" }}>
                You May Also Like
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {similarDishes.map(sd => (
                  <div key={sd.id} style={{
                    background:"#fff", borderRadius:16,
                    border:"1px solid rgba(0,0,0,0.06)",
                    padding:"16px 14px", cursor:"pointer",
                    transition:"transform 0.2s, box-shadow 0.2s",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 28px ${accentColor}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"; }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '100px', 
                      display: 'flex', 
                      justify: 'center', 
                      alignItems: 'center', 
                      marginBottom: '10px' 
                    }}>
                      {sd.image ? (
                        <img 
                          src={sd.image} 
                          alt={sd.name} 
                          style={{ 
                            width: '90px', 
                            height: '90px', 
                            objectFit: 'cover', 
                            borderRadius: '12px'
                          }} 
                        />
                      ) : (
                        <span style={{ fontSize: '44px' }}>{sd.emoji || "🍽️"}</span>
                      )}
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>{sd.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
                      <span style={{ color:"#f5a623", fontSize:12 }}>★</span>
                      <span style={{ fontSize:12, color:"#888" }}>{sd.rating}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:accentColor }}>{sd.price}</span>
                     <button
  onClick={(e) => {
    e.stopPropagation();

    if (!setCartItems) {
      console.error("setCartItems is not available");
      return;
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === sd.id);

      if (existingItem) {
        return prev.map(item =>
          item.id === sd.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...sd,
          qty: 1,
          note: "",
          spice: "None",
          color: "#FFF8E1"
        }
      ];
    });
  }}
  style={{
    width:28,
    height:28,
    borderRadius:"50%",
    background:`linear-gradient(135deg,${accentColor},${accentColor}99)`,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:16,
    color:"#fff",
    cursor:"pointer",
    border:"none",
    padding:0
  }}
>
  🛒
</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#1a1a1a", margin:0, letterSpacing:"-0.3px" }}>
                  Customer Reviews <span style={{ color:"#888", fontWeight:400, fontSize:14 }}>({dish.reviews}+)</span>
                </h2>
                <button style={{
                  background:"transparent", border:`1px solid ${accentColor}`,
                  color:accentColor, borderRadius:8, padding:"6px 14px",
                  fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                }}>View All Reviews</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {mockReviews.map((r,i) => (
                  <div key={i} style={{
                    background:"#fff", borderRadius:16,
                    border:"1px solid rgba(0,0,0,0.06)", padding:"18px 16px",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <div style={{
                        width:38, height:38, borderRadius:"50%",
                        background:`linear-gradient(135deg,${accentColor}33,${accentColor}15)`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                      }}>{r.avatar}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{r.name}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <Stars rating={r.stars} color="#f5a623" size={11}/>
                          <span style={{ fontSize:11, color:"#aaa" }}>{r.time}</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:"#666", lineHeight:1.6, margin:"0 0 10px" }}>{r.text}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#aaa" }}>
                      <span>👍</span> <span>{r.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Customize */}
          <div style={{ position:"sticky", top:80, alignSelf:"start" }}>
            <div style={{
              background:"#fff",
              border:`1px solid ${accentColor}22`,
              borderRadius:20, padding:"24px 22px",
              boxShadow:`0 8px 32px ${accentColor}18`,
            }}>
              <h3 style={{ margin:"0 0 20px", fontSize:16, fontWeight:800, color:accentColor, letterSpacing:"0.3px" }}>
                Customize Your Dish
              </h3>

              {/* Extra Toppings */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Extra Toppings
                </div>
                {Object.entries(toppingPrices).map(([t,p]) => (
                  <label key={t} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, cursor:"pointer" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input type="checkbox" checked={toppings.includes(t)}
                        onChange={() => setToppings(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t])}
                        style={{ accentColor }} />
                      <span style={{ fontSize:13, color:"#555" }}>{t}</span>
                    </div>
                    <span style={{ fontSize:12, color:accentColor, fontWeight:600 }}>+ Rs.{p}</span>
                  </label>
                ))}
              </div>

              {/* Remove Ingredients */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Remove Ingredients
                </div>
                {["Onion","Tomato","Sambol"].map(ing => (
                  <label key={ing} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                    <input type="checkbox" checked={remove.includes(ing)}
                      onChange={() => setRemove(prev => prev.includes(ing) ? prev.filter(x=>x!==ing) : [...prev,ing])}
                      style={{ accentColor }} />
                    <span style={{ fontSize:13, color:"#555" }}>{ing}</span>
                  </label>
                ))}
              </div>

              {/* Spice Level */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Spice Level
                </div>
                {[["Mild","🌿"],["Medium","🌶️"],["Hot","🌶️🌶️"],["Extra Hot","🌶️🌶️🌶️"]].map(([lv,icon]) => (
                  <label key={lv} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                    <input type="radio" name="spice" checked={spice===lv}
                      onChange={() => setSpice(lv)} style={{ accentColor }} />
                    <span style={{ fontSize:13, color:"#555" }}>{lv}</span>
                    <span style={{ fontSize:12, marginLeft:"auto" }}>{icon}</span>
                  </label>
                ))}
              </div>

              {/* Quantity */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Quantity
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <button onClick={() => setQuantity(q => Math.max(1,q-1))} style={{
                    width:34, height:34, borderRadius:"50%",
                    background:"#f5f5f5", border:"1px solid rgba(0,0,0,0.1)",
                    color:"#333", cursor:"pointer", fontSize:18, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>−</button>
                  <span style={{ fontSize:18, fontWeight:700, color:"#1a1a1a", minWidth:20, textAlign:"center" }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} style={{
                    width:34, height:34, borderRadius:"50%",
                    background:accentColor, border:"none",
                    color:"#fff", cursor:"pointer", fontSize:18, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:`0 4px 12px ${accentColor}55`,
                  }}>+</button>
                </div>
              </div>

              {/* Special Notes */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#333", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  Special Notes
                </div>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Add your instructions here..."
                  rows={3}
                  style={{
                    width:"100%", boxSizing:"border-box",
                    background:"#f9f9f9", border:"1px solid rgba(0,0,0,0.08)",
                    borderRadius:10, padding:"10px 12px", color:"#333",
                    fontSize:12, resize:"none", outline:"none", fontFamily:"inherit",
                  }}
                />
                <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>(Optional)</div>
              </div>

              {/* Total */}
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                marginBottom:16, padding:"12px 14px",
                background: `${accentColor}0f`, borderRadius:12,
                border:`1px solid ${accentColor}33`,
              }}>
                <span style={{ fontSize:14, fontWeight:600, color:"#333" }}>Total Price</span>
                <span style={{ fontSize:20, fontWeight:800, color:accentColor }}>
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Action buttons */}
              <button onClick={handleCart} style={{
                width:"100%", padding:"13px",
                background: addedToCart ? "linear-gradient(135deg,#4caf50,#388e3c)" : `linear-gradient(135deg,${accentColor},${accentColor}aa)`,
                border:"none", borderRadius:12, color:"#fff",
                fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                boxShadow:`0 6px 20px ${accentColor}44`,
                marginBottom:10, transition:"all 0.3s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                {addedToCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
              <button onClick={() => setShowPayment(true)} style={{
                width:"100%", padding:"13px",
                background:"#f5f5f5",
                border:"1px solid rgba(0,0,0,0.08)", borderRadius:12, color:"#333",
                fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>⚡ Buy Now</button>
              <button onClick={() => setLiked(l=>!l)} style={{
                width:"100%", padding:"13px",
                background:"transparent",
                border:`1px solid ${liked ? "#e91e63" : "rgba(0,0,0,0.1)"}`,
                borderRadius:12, color: liked ? "#e91e63" : "#888",
                fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"all 0.2s",
              }}>{liked ? "❤️ Saved to Favourites" : "🤍 Add to Favourites"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background:"rgba(255,255,255,0.03)", borderTop:"1px solid rgba(255,255,255,0.06)",
        padding:"28px 40px", marginTop:40,
        display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32,
      }}>
        {[
          { icon:"🕐", title:"Operating Hours", lines:["Mon - Sun","10:00 AM - 11:00 PM"] },
          { icon:"📞", title:"Contact Us", lines:["+94 77 599 5735","info@smartrestaurant.lk"] },
          { icon:"📍", title:"Our Location", lines:["123, Galle Road,","Colombo 03, Sri Lanka"] },
        
        ].map((col,i) => (
          <div key={i}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:20, color:accentColor }}>{col.icon}</span>
              <span style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{col.title}</span>
            </div>
            {col.lines?.map((l,j) => <div key={j} style={{ fontSize:12, color:"#666", marginBottom:4 }}>{l}</div>)}
            {col.social && (
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                {["🔵","📸","🐦","▶️"].map((s,j) => (
                  <div key={j} style={{
                    width:32, height:32, borderRadius:"50%",
                    background:"rgba(0,0,0,0.05)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, cursor:"pointer",
                    transition:"background 0.2s",
                  }}></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { DishDetailPage };