import { useState, useEffect } from 'react';
import { useAppStore } from '../store/AppStore';

// ─── TRACK ORDER PAGE (dynamic) ─────────────────────────────────────────────

// ── Per-dish prep time lookup (minutes) ──────────────────────────────────────
const DISH_PREP_TIMES = {
  // ☕ Drinks — fastest (1–5 min)
  "Ceylon Black Tea":        2, "Green Tea":          2, "Ginger Tea":         3,
  "Milk Tea":                3, "Cappuccino":         4, "Latte":              4,
  "Espresso":                2, "Hot Chocolate":      3, "Mocha Coffee":       4,
  "Iced Coffee":             3, "Iced Latte":         3, "Cold Brew Coffee":   3,
  "Iced Tea":                2, "Iced Mocha":         4, "Chocolate Milkshake":5,
  "Vanilla Milkshake":       5, "Strawberry Milkshake":5, "Mango Juice":       3,
  "Orange Juice":            3, "Pineapple Juice":    3, "Watermelon Juice":   3,
  "Lime Juice":              2, "Mixed Fruit Juice":  4, "Passion Fruit Juice":3,
  "King Coconut (Thambili)": 2, "Faluda":             5, "Virgin Mojito":      5,
  "Tropical Sunset":         5, "Tropical Paradise":  6, "Green Detox Smoothie":5,
  "Coca-Cola":               1, "Sprite":             1, "Fanta Orange":       1,
  "Mineral Water":           1, "Ginger Ale":         1, "Soda Water":         1,

  // 🥗 Light breakfast / cold items (3–8 min)
  "Fresh Fruit Platter":     5, "Acai Bowl":          7, "Granola Parfait":    5,
  "Yogurt Parfait":          5, "Fruit Jelly Cups":   4, "Kiri Pani":          4,
  "Mango Slices with Honey": 3, "Garden Fresh Salad": 6,

  // 🍞 Simple toast / sandwich (6–10 min)
  "Avocado Toast":           7, "Smoked Salmon Bagel":8, "Club Sandwich":      9,
  "Chicken Wrap":            9, "Bruschetta":         7, "Hummus Trio":        6,
  "Fruit Salad with Ice Cream":8,

  // 🥞 Pancakes / waffles / eggs (10–15 min)
  "Blueberry Pancakes":     12, "Chocolate Pancakes": 12, "French Toast":       10,
  "Waffles & Cream":        12, "Eggs Benedict":      13, "Shakshuka":          14,
  "Omelette du Chef":       12, "Breakfast Burrito":  13,

  // 🍳 Fried / grilled light (10–18 min)
  "String Hoppers":         10, "Hoppers (Appa)":     12, "Kiribath":           10,
  "Pol Sambol with Bread":   8, "Crispy Fried Chicken":15, "Grilled Chicken":   16,
  "Fried Fish":             13, "Falafel Pita Bowl":  12,

  // 🍜 Soups / noodles / pasta (12–20 min)
  "Tom Kha Soup":           14, "Soup du Jour":       12, "Street Tacos":       12,
  "Chicken Noodles":        15, "Seafood Noodles":    16, "Mixed Noodles":      16,
  "Vegetable Noodles":      14, "Pasta Primavera":    16, "Caprese Pasta":      15,
  "Creamy Alfredo Pasta":   16, "Prawn Pasta":        18,

  // 🍳 Kottu (hot griddle — 15–20 min)
  "Chicken Kottu":          16, "Cheese Kottu":       15, "Seafood Kottu":      18,
  "Mixed Kottu":            18, "Vegetable Kottu":    14,

  // 🍚 Fried rice (15–20 min)
  "Chicken Fried Rice":     16, "Seafood Fried Rice": 18, "Mixed Fried Rice":   18,
  "Egg Fried Rice":         14, "Vegetable Fried Rice":14,

  // 🍛 Rice & curry / biryani (20–30 min)
  "Chicken Rice & Curry":   22, "Fish Rice & Curry":  22, "Beef Rice & Curry":  28,
  "Pork Rice & Curry":      28, "Vegetable Rice & Curry":20, "Egg Rice & Curry": 18,
  "Mixed Rice & Curry":     25, "Chicken Biryani":    30,

  // 🌶 Devilled / curry dishes (20–28 min)
  "Devilled Chicken":       20, "Chicken Curry":      22, "Devilled Beef":      24,
  "Beef Curry":             26, "Black Pork Curry":   28, "Pork Devilled":      24,
  "Devilled Prawns":        20, "Fish Ambul Thiyal":  25, "Cuttlefish Devilled":22,
  "Prawn Curry":            22,

  // 🍔 Burgers (15–20 min)
  "Beef Burger":            18, "Smash Burger":       15, "Spicy Chicken Burger":17,
  "Cheeseburger Sliders":   15, "Crispy Chicken Wrap":14, "Fish & Chips":       18,

  // 🍰 Desserts — cold (3–8 min)
  "Watalappan":              5, "Kavum":               5, "Aluwa":               3,
  "Dodol":                   3, "Pani Walalu":         4, "Mung Kavum":          4,
  "Vanilla Ice Cream Sundae":5, "Chocolate Ice Cream Bowl":5, "Banana Split":    7,
  "Berry Pavlova":           8, "Cheesecake":          5, "Tiramisu":            6,

  // 🎂 Cakes / baked desserts (8–15 min)
  "Chocolate Fudge Cake":    8, "Black Forest Cake":  8, "Red Velvet Cake":    8,
  "Chocolate Brownie":      10, "Caramel Pudding":    8, "Bread & Butter Pudding":12,
  "Chocolate Fondant":      14, "Ice Cream Waffle":   10,

  // 🥩 Grills / steaks (25–35 min)
  "Grilled Ribeye":         30, "Lamb Rack":          35, "Beef Wellington":    40,
  "Pan-Seared Sea Bass":    22, "Salmon Teriyaki":    20, "Duck Confit":        35,
  "Lobster Thermidor":      35, "Wagyu Beef Tenderloin":35,
};

/** Return prep time in minutes for a dish name (default 20 if unknown) */
const getDishPrepTime = (name) => {
  if (!name) return 20;
  if (DISH_PREP_TIMES[name]) return DISH_PREP_TIMES[name];
  // Partial match fallback
  const key = Object.keys(DISH_PREP_TIMES).find(k => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase()));
  return key ? DISH_PREP_TIMES[key] : 20;
};

const trackSteps = [
  { icon:"📋", label:"Order Received", desc:"Confirmed & logged in our system",     pct:100 },
  { icon:"👨‍🍳", label:"Preparing",      desc:"Chef gathering fresh ingredients",     pct:100 },
  { icon:"🍳", label:"Cooking",        desc:"Your meal is being crafted with love",  pct:60  },
  { icon:"🍽️", label:"Ready",          desc:"Plated & waiting to reach your table",  pct:0   },
  { icon:"✅", label:"Delivered",      desc:"Enjoy every bite — bon appétit!",       pct:0   },
];

function TrackOrderPage({ onBack, accentColor, orderItems = [], orderMeta }) {
  const { store } = useAppStore();
  const [elapsed, setElapsed]   = useState(0);

  const trackedOrder = orderMeta?.id
    ? store.orders.find(order => order.id === orderMeta.id)
    : null;
  const statusIndexes = { Received: 0, Preparing: 1, Cooking: 2, Ready: 3, Delivered: 4 };
  const currentStatus = trackedOrder?.status || "Cooking";
  const activeStep = statusIndexes[currentStatus] ?? 2;

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Per-dish prep time calculation ──────────────────────────────────────────
  const dishTimes = orderItems.map(item => ({
    ...item,
    prepMins: getDishPrepTime(item.name),
  }));

  // Total cook time = longest single dish (parallel cooking) + small queue buffer
  const maxPrepMins = dishTimes.length ? Math.max(...dishTimes.map(d => d.prepMins)) : 0;
  const totalCookMins = maxPrepMins + Math.floor(dishTimes.length / 2); // queue buffer

  // Use the saved order timestamp so the tracking page reflects this order.
  const orderDate = orderMeta?.ts ? new Date(orderMeta.ts) : new Date();
  const addMins = (date, add) => {
    const eta = new Date(date.getTime() + add * 60 * 1000);
    const hh = eta.getHours();
    const mm = eta.getMinutes();
    const suffix = hh >= 12 ? "PM" : "AM";
    return `${String(hh > 12 ? hh - 12 : hh || 12).padStart(2,"0")}:${String(mm).padStart(2,"0")} ${suffix}`;
  };

  const stepTimes = [
    addMins(orderDate, 0),
    addMins(orderDate, 3),
    addMins(orderDate, 5),
    addMins(orderDate, 5 + totalCookMins),
    addMins(orderDate, 8 + totalCookMins),
  ];
  const placedAt = orderDate.toLocaleString([], { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });

  // Countdown — time left until ready
  const cookingElapsedMins = Math.floor(elapsed / 60);
  const minsLeft = Math.max(0, (totalCookMins - 5) - cookingElapsedMins);
  const secsLeft = minsLeft > 0 ? 59 - (elapsed % 60) : 0;
  const timerStr = `${String(minsLeft).padStart(2,"0")}:${String(secsLeft).padStart(2,"0")}`;

  // Overall progress
  const stepPcts = trackSteps.map((_, index) =>
    index < activeStep ? 100 : index === activeStep ? (activeStep === 4 ? 100 : 60) : 0
  );
  const statusProgress = { Received: 10, Preparing: 30, Cooking: 60, Ready: 85, Delivered: 100 };
  const overallPct = statusProgress[currentStatus] ?? 60;

  const subtotal      = orderItems.reduce((s,i) => s + i.price * i.qty, 0);
  const serviceCharge = Math.round(subtotal * 0.10);
  const total         = subtotal + serviceCharge;

  const catColors = { Breakfast:"#f5a623", Lunch:"#43a047", Dinner:"#c62828", Desserts:"#ad1457", Drinks:"#0277bd", "Fast Food":"#f97316" };

  // Speed label for each dish
  const speedLabel = (mins) => {
    if (mins <= 3)  return { label:"⚡ Instant",  color:"#0277bd" };
    if (mins <= 7)  return { label:"🚀 Very Fast", color:"#16a34a" };
    if (mins <= 12) return { label:"⏱ Quick",     color:"#d97706" };
    if (mins <= 20) return { label:"🍳 Normal",    color:"#f97316" };
    if (mins <= 28) return { label:"🔥 Slow Cook", color:"#dc2626" };
    return                  { label:"👨‍🍳 Craft",     color:"#7c3aed" };
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f6f3ef", fontFamily:"'Trebuchet MS',sans-serif", color:"#1a1a1a" }}>

      {/* ── Dark hero ── */}
      <div style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", padding:"36px 44px 44px", position:"relative", overflow:"hidden" }}>
        {[["-40px",null,"160px",`${accentColor}18`],[null,"60px","220px","rgba(255,255,255,0.04)"]].map(([l,r,sz,bg],i)=>(
          <div key={i} style={{ position:"absolute",top:"-20px",left:l||undefined,right:r||undefined,width:sz,height:sz,borderRadius:"50%",background:bg,pointerEvents:"none" }}/>
        ))}
        <div style={{ position:"relative", zIndex:1, maxWidth:1160, margin:"0 auto" }}>

          {/* Order ID + placed time */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:14 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:`${accentColor}cc`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>Live Tracking</div>
              <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>Track Your Order</h1>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {/* Order ID */}
              <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"12px 18px", textAlign:"right", backdropFilter:"blur(8px)" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginBottom:3, letterSpacing:"0.5px" }}>ORDER ID</div>
                <div style={{ fontSize:17, fontWeight:800, color:accentColor }}>#{orderMeta?.id || "SR"}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{placedAt}</div>
              </div>
              {/* ETA card */}
              <div style={{ background:`linear-gradient(135deg,${accentColor}33,${accentColor}18)`, border:`1px solid ${accentColor}44`, borderRadius:14, padding:"12px 18px", textAlign:"center", backdropFilter:"blur(8px)" }}>
                <div style={{ fontSize:10, color:`${accentColor}bb`, marginBottom:3, letterSpacing:"0.5px", fontWeight:700 }}>READY BY</div>
                <div style={{ fontSize:17, fontWeight:900, color:"#fff" }}>{stepTimes[3]}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>~{totalCookMins} min total</div>
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Overall Progress</span>
              <span style={{ fontSize:12, fontWeight:800, color:accentColor }}>{overallPct}%</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${overallPct}%`, background:`linear-gradient(90deg,${accentColor},${accentColor}cc)`, borderRadius:10, boxShadow:`0 0 12px ${accentColor}88`, transition:"width 1s ease" }}/>
            </div>
          </div>

          {/* Step tracker */}
          <div style={{ display:"flex", gap:0, alignItems:"center" }}>
            {trackSteps.map((step, i) => {
              const pct    = stepPcts[i];
              const done   = pct === 100;
              const active = pct > 0 && pct < 100;
              const isLast = i === trackSteps.length - 1;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", flex: isLast ? "0 0 auto" : 1 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"0 4px" }}>
                    <div style={{
                      width:48, height:48, borderRadius:"50%",
                      background: done ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                      border: active ? `2.5px solid ${accentColor}` : done ? "none" : "2px solid rgba(255,255,255,0.1)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:19,
                      boxShadow: active ? `0 0 0 6px ${accentColor}28, 0 0 20px ${accentColor}44` : done ? `0 4px 14px ${accentColor}55` : "none",
                      transition:"all 0.3s", animation: active ? "heroPulse 2s ease-in-out infinite" : "none",
                    }}>{step.icon}</div>
                    <div style={{ fontSize:9, fontWeight:700, color: done||active ? "#fff" : "rgba(255,255,255,0.3)", letterSpacing:"0.3px", whiteSpace:"nowrap", textTransform:"uppercase" }}>{step.label}</div>
                    <div style={{ fontSize:9, color: done ? accentColor : "rgba(255,255,255,0.25)", fontWeight:600 }}>{stepTimes[i]}</div>
                    {active && <div style={{ fontSize:9, color:accentColor, fontWeight:600, background:`${accentColor}22`, borderRadius:10, padding:"2px 7px", marginTop:-2 }}>In Progress</div>}
                  </div>
                  {!isLast && (
                    <div style={{ flex:1, height:2, margin:"0 4px 28px", background: done ? `linear-gradient(90deg,${accentColor},${accentColor}66)` : "rgba(255,255,255,0.08)", transition:"background 0.4s" }}/>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"28px 44px 60px", display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }}>

        {/* LEFT col */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Active step card */}
          <div style={{
            background:"#fff", borderRadius:22,
            border:`2px solid ${accentColor}22`,
            boxShadow:`0 4px 22px ${accentColor}18`,
            padding:"22px 26px",
            display:"flex", alignItems:"center", gap:18,
          }}>
            <div style={{
              width:60, height:60, borderRadius:18,
              background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
              boxShadow:`0 6px 18px ${accentColor}44`, flexShrink:0,
              animation:"heroPulse 2s ease-in-out infinite",
            }}>{trackSteps[activeStep].icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:accentColor, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Currently Active Step</div>
              <div style={{ fontSize:20, fontWeight:900, color:"#111827" }}>{trackSteps[activeStep].label}</div>
              <div style={{ fontSize:12, color:"#9ca3af", marginTop:3 }}>{trackSteps[activeStep].desc}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:10, color:"#9ca3af", marginBottom:4 }}>Step time</div>
              <div style={{ fontSize:16, fontWeight:800, color:accentColor }}>{stepTimes[activeStep]}</div>
              <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{Math.round(stepPcts[activeStep])}% done</div>
            </div>
          </div>

          {/* ── Per-Dish Timing Breakdown ── */}
          <div style={{ background:"#fff", borderRadius:22, overflow:"hidden", boxShadow:"0 2px 14px rgba(0,0,0,0.05)" }}>
            <div style={{
              background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
              padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.65)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:2 }}>Dish-by-Dish Timing</div>
                <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>Each dish has its own prep time</div>
              </div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", textAlign:"right", lineHeight:1.6 }}>
                Longest: <strong style={{ color:"#fff" }}>{maxPrepMins} min</strong><br/>
                Total ETA: <strong style={{ color:"#fff" }}>{totalCookMins} min</strong>
              </div>
            </div>

            <div style={{ padding:"16px 22px" }}>
              {/* Timing legend */}
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16, paddingBottom:14, borderBottom:"1px solid #f3f4f6" }}>
                {[
                  ["⚡","Instant","≤ 3 min","#0277bd"],
                  ["🚀","Very Fast","4–7 min","#16a34a"],
                  ["⏱","Quick","8–12 min","#d97706"],
                  ["🍳","Normal","13–20 min","#f97316"],
                  ["🔥","Slow Cook","21–28 min","#dc2626"],
                  ["👨‍🍳","Craft","28+ min","#7c3aed"],
                ].map(([icon, label, range, color]) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:5, background:`${color}0d`, borderRadius:8, padding:"4px 10px" }}>
                    <span style={{ fontSize:13 }}>{icon}</span>
                    <span style={{ fontSize:10, fontWeight:700, color }}>{label}</span>
                    <span style={{ fontSize:9, color:"#9ca3af" }}>({range})</span>
                  </div>
                ))}
              </div>

              {/* Per-dish rows */}
              {dishTimes.map((dish, idx) => {
                const spd      = speedLabel(dish.prepMins);
                const catColor = catColors[dish.category] || accentColor;
                const barPct   = maxPrepMins ? Math.round((dish.prepMins / maxPrepMins) * 100) : 0;
                const isLongest = dish.prepMins === maxPrepMins;
                return (
                  <div key={idx} style={{
                    display:"flex", alignItems:"center", gap:14, padding:"12px 0",
                    borderBottom: idx < dishTimes.length-1 ? "1px solid #f3f4f6" : "none",
                  }}>
                    {/* Food image */}
                    <div style={{
                      width:44, height:44, borderRadius:12, flexShrink:0,
                      background:`${catColor}15`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                      overflow:"hidden",
                    }}>
                      {dish.image ? (
                        <img src={dish.image} alt={dish.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      ) : dish.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                        <div>
                          <span style={{ fontSize:13, fontWeight:800, color:"#111827" }}>{dish.name}</span>
                          {dish.qty > 1 && <span style={{ fontSize:11, color:"#9ca3af", marginLeft:6 }}>×{dish.qty}</span>}
                          {isLongest && <span style={{ marginLeft:8, fontSize:9, fontWeight:800, color:"#7c3aed", background:"#f5f3ff", borderRadius:6, padding:"1px 7px" }}>⏰ Longest</span>}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                          <span style={{ fontSize:10, fontWeight:700, color:spd.color, background:`${spd.color}12`, borderRadius:8, padding:"2px 8px", whiteSpace:"nowrap" }}>{spd.label}</span>
                          <span style={{ fontSize:14, fontWeight:900, color:catColor, minWidth:48, textAlign:"right" }}>{dish.prepMins} min</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height:6, background:"#f3f4f6", borderRadius:10, overflow:"hidden" }}>
                        <div style={{
                          height:"100%", width:`${barPct}%`,
                          background: isLongest
                            ? `linear-gradient(90deg,${accentColor},${accentColor}cc)`
                            : `linear-gradient(90deg,${spd.color},${spd.color}99)`,
                          borderRadius:10, boxShadow: isLongest ? `0 0 6px ${accentColor}66` : "none",
                          transition:"width 0.6s ease",
                        }}/>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Summary row */}
              <div style={{
                marginTop:14, paddingTop:14, borderTop:`2px solid ${accentColor}18`,
                display:"flex", justifyContent:"space-between", alignItems:"center",
                background:`${accentColor}06`, borderRadius:12, padding:"12px 14px",
              }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#6b7280" }}>All dishes cooked in parallel</div>
                  <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>Longest dish sets the total time</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:22, fontWeight:900, color:accentColor }}>{totalCookMins} min</div>
                  <div style={{ fontSize:10, color:"#9ca3af" }}>total prep time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown timer */}
          <div style={{
            background:"linear-gradient(135deg,#0d1117,#1a1a2e)",
            borderRadius:22, padding:"24px 28px",
            display:"flex", alignItems:"center", gap:20,
            boxShadow:"0 8px 28px rgba(0,0,0,0.18)",
          }}>
            <div style={{ textAlign:"center", flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>Time Until Ready</div>
              <div style={{
                fontSize:52, fontWeight:900, color:accentColor,
                fontFamily:"'Courier New',monospace", letterSpacing:"4px",
                textShadow:`0 0 30px ${accentColor}88`,
              }}>{timerStr}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:6 }}>minutes : seconds</div>
            </div>
            <div style={{ width:1, height:60, background:"rgba(255,255,255,0.1)" }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.8px" }}>Ready by</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff" }}>{stepTimes[3]}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:4 }}>Est. delivery: {stepTimes[4]}</div>
            </div>
          </div>

        </div>

        {/* RIGHT col — order summary */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Order items */}
          <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 14px rgba(0,0,0,0.05)" }}>
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#374151", textTransform:"uppercase", letterSpacing:"0.5px" }}>🛒 Your Order</div>
            </div>
            <div style={{ padding:"12px 20px" }}>
              {dishTimes.map((item, i) => {
                const catColor = catColors[item.category] || accentColor;
                const spd = speedLabel(item.prepMins);
                return (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:10, paddingBottom:10, marginBottom:10,
                    borderBottom: i < dishTimes.length-1 ? "1px solid #f9fafb" : "none",
                  }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${catColor}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {item.name}{item.qty>1&&<span style={{ color:"#9ca3af", marginLeft:4 }}>×{item.qty}</span>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                        <span style={{ fontSize:9, fontWeight:700, color:spd.color }}>{spd.label}</span>
                        <span style={{ fontSize:9, color:"#9ca3af" }}>• {item.prepMins} min</span>
                      </div>
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color:catColor, flexShrink:0 }}>Rs. {(item.price*item.qty).toLocaleString()}</div>
                  </div>
                );
              })}
              <div style={{ borderTop:"2px solid #f3f4f6", paddingTop:10, marginTop:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>Subtotal</span>
                  <span style={{ fontSize:11, fontWeight:600, color:"#555" }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>Service (10%)</span>
                  <span style={{ fontSize:11, fontWeight:600, color:"#555" }}>Rs. {serviceCharge.toLocaleString()}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:14, fontWeight:800, color:"#111827" }}>Total</span>
                  <span style={{ fontSize:18, fontWeight:900, color:accentColor }}>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div style={{ background:"#fff", borderRadius:20, padding:"16px 20px", boxShadow:"0 2px 14px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#374151", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.5px" }}>⏱ Timing Tips</div>
            {[
              dishTimes.length > 0 && (() => {
                const fastestDish = dishTimes.reduce((fastest, dish) => dish.prepMins < fastest.prepMins ? dish : fastest);
                return { icon:"⚡", tip:`Your ${fastestDish.name} takes ${fastestDish.prepMins} min — it'll be served first!` };
              })(),
              dishTimes.length > 1 && (() => {
                const longestDish = dishTimes.reduce((longest, dish) => dish.prepMins > longest.prepMins ? dish : longest);
                return { icon:"🔥", tip:`Your ${longestDish.name} takes ${longestDish.prepMins} min — chef's priority!` };
              })(),
              { icon:"🧑‍🍳", tip:"All dishes are cooked in parallel for the shortest wait." },
            ].filter(Boolean).map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{t.icon}</span>
                <span style={{ fontSize:11, color:"#6b7280", lineHeight:1.5 }}>{t.tip}</span>
              </div>
            ))}
          </div>

          {/* Contact kitchen */}
          <button onClick={()=>window.location.href="tel:+94775995735"} style={{
            width:"100%", padding:"13px", borderRadius:16, border:"none",
            background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
            color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit",
            boxShadow:`0 6px 20px ${accentColor}44`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            📞 Call Restaurant
          </button>
        </div>
      </div>

      <style>{`
        @keyframes heroPulse {
          0%,100%{box-shadow:0 0 0 6px ${accentColor}28,0 0 20px ${accentColor}44}
          50%    {box-shadow:0 0 0 10px ${accentColor}14,0 0 32px ${accentColor}22}
        }
      `}</style>
    </div>
  );
}


export { TrackOrderPage };