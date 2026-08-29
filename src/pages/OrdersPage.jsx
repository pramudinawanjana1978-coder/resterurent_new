import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/AppStore';

// ─── EXTENSIVE DISH PREP-TIME DATABASE (from first file) ──────────────────
const DISH_PREP_TIMES = {
  // ☕ Drinks (1–5 min)
  "Ceylon Black Tea": 2, "Green Tea": 2, "Ginger Tea": 3,
  "Milk Tea": 3, "Cappuccino": 4, "Latte": 4,
  "Espresso": 2, "Hot Chocolate": 3, "Mocha Coffee": 4,
  "Iced Coffee": 3, "Iced Latte": 3, "Cold Brew Coffee": 3,
  "Iced Tea": 2, "Iced Mocha": 4, "Chocolate Milkshake": 5,
  "Vanilla Milkshake": 5, "Strawberry Milkshake": 5, "Mango Juice": 3,
  "Orange Juice": 3, "Pineapple Juice": 3, "Watermelon Juice": 3,
  "Lime Juice": 2, "Mixed Fruit Juice": 4, "Passion Fruit Juice": 3,
  "King Coconut (Thambili)": 2, "Faluda": 5, "Virgin Mojito": 5,
  "Tropical Sunset": 5, "Tropical Paradise": 6, "Green Detox Smoothie": 5,
  "Coca-Cola": 1, "Sprite": 1, "Fanta Orange": 1,
  "Mineral Water": 1, "Ginger Ale": 1, "Soda Water": 1,

  // 🥗 Light breakfast / cold items (3–8 min)
  "Fresh Fruit Platter": 5, "Acai Bowl": 7, "Granola Parfait": 5,
  "Yogurt Parfait": 5, "Fruit Jelly Cups": 4, "Kiri Pani": 4,
  "Mango Slices with Honey": 3, "Garden Fresh Salad": 6,

  // 🍞 Simple toast / sandwich (6–10 min)
  "Avocado Toast": 7, "Smoked Salmon Bagel": 8, "Club Sandwich": 9,
  "Chicken Wrap": 9, "Bruschetta": 7, "Hummus Trio": 6,
  "Fruit Salad with Ice Cream": 8,

  // 🥞 Pancakes / waffles / eggs (10–15 min)
  "Blueberry Pancakes": 12, "Chocolate Pancakes": 12, "French Toast": 10,
  "Waffles & Cream": 12, "Eggs Benedict": 13, "Shakshuka": 14,
  "Omelette du Chef": 12, "Breakfast Burrito": 13,

  // 🍳 Fried / grilled light (10–18 min)
  "String Hoppers": 10, "Hoppers (Appa)": 12, "Kiribath": 10,
  "Pol Sambol with Bread": 8, "Crispy Fried Chicken": 15, "Grilled Chicken": 16,
  "Fried Fish": 13, "Falafel Pita Bowl": 12,

  // 🍜 Soups / noodles / pasta (12–20 min)
  "Tom Kha Soup": 14, "Soup du Jour": 12, "Street Tacos": 12,
  "Chicken Noodles": 15, "Seafood Noodles": 16, "Mixed Noodles": 16,
  "Vegetable Noodles": 14, "Pasta Primavera": 16, "Caprese Pasta": 15,
  "Creamy Alfredo Pasta": 16, "Prawn Pasta": 18,

  // 🍳 Kottu (hot griddle — 15–20 min)
  "Chicken Kottu": 16, "Cheese Kottu": 15, "Seafood Kottu": 18,
  "Mixed Kottu": 18, "Vegetable Kottu": 14,

  // 🍚 Fried rice (15–20 min)
  "Chicken Fried Rice": 16, "Seafood Fried Rice": 18, "Mixed Fried Rice": 18,
  "Egg Fried Rice": 14, "Vegetable Fried Rice": 14,

  // 🍛 Rice & curry / biryani (20–30 min)
  "Chicken Rice & Curry": 22, "Fish Rice & Curry": 22, "Beef Rice & Curry": 28,
  "Pork Rice & Curry": 28, "Vegetable Rice & Curry": 20, "Egg Rice & Curry": 18,
  "Mixed Rice & Curry": 25, "Chicken Biryani": 30,

  // 🌶 Devilled / curry dishes (20–28 min)
  "Devilled Chicken": 20, "Chicken Curry": 22, "Devilled Beef": 24,
  "Beef Curry": 26, "Black Pork Curry": 28, "Pork Devilled": 24,
  "Devilled Prawns": 20, "Fish Ambul Thiyal": 25, "Cuttlefish Devilled": 22,
  "Prawn Curry": 22,

  // 🍔 Burgers (15–20 min)
  "Beef Burger": 18, "Smash Burger": 15, "Spicy Chicken Burger": 17,
  "Cheeseburger Sliders": 15, "Crispy Chicken Wrap": 14, "Fish & Chips": 18,

  // 🍰 Desserts — cold (3–8 min)
  "Watalappan": 5, "Kavum": 5, "Aluwa": 3,
  "Dodol": 3, "Pani Walalu": 4, "Mung Kavum": 4,
  "Vanilla Ice Cream Sundae": 5, "Chocolate Ice Cream Bowl": 5, "Banana Split": 7,
  "Berry Pavlova": 8, "Cheesecake": 5, "Tiramisu": 6,
  // 🎂 Cakes / baked desserts (8–15 min)
  "Chocolate Fudge Cake": 8, "Black Forest Cake": 8, "Red Velvet Cake": 8,
  "Chocolate Brownie": 10, "Caramel Pudding": 8, "Bread & Butter Pudding": 12,
  "Chocolate Fondant": 14, "Ice Cream Waffle": 10,

  // 🥩 Grills / steaks (25–35 min)
  "Grilled Ribeye": 30, "Lamb Rack": 35, "Beef Wellington": 40,
  "Pan-Seared Sea Bass": 22, "Salmon Teriyaki": 20, "Duck Confit": 35,
  "Lobster Thermidor": 35, "Wagyu Beef Tenderloin": 35,
};

/** Return prep time in minutes for a dish name (default 20 if unknown) */
function getDishPrepTime(name) {
  if (!name) return 20;
  if (DISH_PREP_TIMES[name]) return DISH_PREP_TIMES[name];
  // Partial match fallback
  const key = Object.keys(DISH_PREP_TIMES).find(
    k => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? DISH_PREP_TIMES[key] : 20;
}

// ─── FALLBACK ORDERS (with placedAt for auto-advance) ──────────────────────
const savedOrdersStore = {
  orders: [
    {
      id: "#SR12345",
      table: "Table 07",
      placed: "25 May 2025, 07:45 PM",
      placedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
      status: "Received",
      total: 9731,
      items: [
        { id: 1, name: "Blueberry Pancakes", emoji: "🥞", price: 1850, qty: 2, category: "Breakfast", spice: "Mild", toppings: ["Extra Maple Syrup", "Extra Whipped Cream"], removedIngredients: ["Powdered Sugar"], note: "Please make it extra fluffy" },
        { id: 4, name: "French Toast", emoji: "🍞", price: 1750, qty: 1, category: "Breakfast", spice: "None", toppings: [], removedIngredients: [], note: "" },
        { id: 201, name: "Grilled Ribeye", emoji: "🥩", price: 4800, qty: 1, category: "Dinner", spice: "Medium", toppings: ["Extra Sauce"], removedIngredients: ["Onion"], note: "Medium rare please" },
      ],
    },
    {
      id: "#SR12310",
      table: "Table 03",
      placed: "24 May 2025, 01:15 PM",
      placedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: "Preparing",
      total: 5635,
      items: [
        { id: 402, name: "Mango Bubble Tea", emoji: "🧋", price: 940, qty: 3, category: "Drinks", spice: "None", toppings: [], removedIngredients: ["Sugar Syrup"], note: "Less sweet" },
        { id: 303, name: "Crème Brûlée", emoji: "🍮", price: 1230, qty: 1, category: "Desserts", spice: "None", toppings: ["Extra Cream"], removedIngredients: [], note: "" },
        { id: 213, name: "Chicken Biryani", emoji: "🍛", price: 1650, qty: 1, category: "Dinner", spice: "Hot", toppings: ["Extra Raita"], removedIngredients: ["Whole Spices"], note: "No whole spices please, allergic" },
      ],
    },
    {
      id: "#SR12289",
      table: "Table 12",
      placed: "23 May 2025, 08:20 PM",
      placedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      status: "Cooking",
      total: 7150,
      items: [
        { id: 241, name: "Chicken Kottu", emoji: "🍳", price: 1200, qty: 2, category: "Dinner", spice: "Extra Hot", toppings: ["Extra Egg", "Extra Cheese"], removedIngredients: ["Carrot"], note: "Very spicy please!" },
        { id: 231, name: "Devilled Prawns", emoji: "🦐", price: 1850, qty: 1, category: "Dinner", spice: "Hot", toppings: ["Extra Sauce"], removedIngredients: ["Onion", "Chilli"], note: "Mild on chilli for kids" },
        { id: 303, name: "Crème Brûlée", emoji: "🍮", price: 1450, qty: 1, category: "Desserts", spice: "None", toppings: [], removedIngredients: [], note: "" },
      ],
    },
    {
      id: "#SR12201",
      table: "Table 05",
      placed: "22 May 2025, 12:30 PM",
      placedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: "Delivered",
      total: 4200,
      items: [
        { id: 101, name: "Garden Fresh Salad", emoji: "🥗", price: 1450, qty: 1, category: "Lunch", spice: "None", toppings: ["Extra Honey"], removedIngredients: ["Onion", "Tomato"], note: "Dressing on the side" },
        { id: 402, name: "Mango Bubble Tea", emoji: "🧋", price: 940, qty: 2, category: "Drinks", spice: "None", toppings: [], removedIngredients: ["Ice"], note: "No ice please" },
        { id: 303, name: "Crème Brûlée", emoji: "🍮", price: 870, qty: 1, category: "Desserts", spice: "None", toppings: ["Extra Berries"], removedIngredients: [], note: "Birthday — please add a candle 🕯️" },
      ],
    },
  ],
};

// ─── STATUS CONFIG (single definition) ──────────────────────────────────────
const statusConfig = {
  Received:  { color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af", icon: "📋" },
  Preparing: { color: "#d97706", bg: "#fffbeb", dot: "#f59e0b", icon: "👨‍🍳" },
  Cooking:   { color: "#ea580c", bg: "#fff7ed", dot: "#f97316", icon: "🍳" },
  Ready:     { color: "#16a34a", bg: "#f0fdf4", dot: "#22c55e", icon: "🍽️" },
  Delivered: { color: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6", icon: "✅" },
};

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
function OrdersPage({ onBack, accentColor = "#e11d48", onLogout }) {
  const { store, updateOrderStatus, sendStaffMessage } = useAppStore();
  const [staffRole, setStaffRole] = useState(null);

  const [demoOrders, setDemoOrders] = useState(savedOrdersStore.orders);
  const hasStoredOrders = store.orders.length > 0;
  const allOrders = hasStoredOrders ? store.orders : demoOrders;

  const changeOrderStatus = (orderId, newStatus) => {
    if (hasStoredOrders) {
      updateOrderStatus(orderId, newStatus);
      return;
    }
    setDemoOrders(orders => orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [notesOpen, setNotesOpen] = useState({});
  const [msgDrafts, setMsgDrafts] = useState({});
  const [msgSent, setMsgSent] = useState({});
  const [autoTick, setAutoTick] = useState(0);
  const processedAutoTick = useRef(-1);

  // ── Auto-advance order status every 20 s ──
  useEffect(() => {
    const t = setInterval(() => setAutoTick(n => n + 1), 20000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (processedAutoTick.current === autoTick) return;
    processedAutoTick.current = autoTick;
    const progression = { Received: "Preparing", Preparing: "Cooking", Cooking: "Ready" };
    allOrders.forEach(order => {
      const next = progression[order.status];
      if (!next) return;
      let placedTime = order.placedAt;
      if (!placedTime && order.placed) {
        // Attempt to parse "25 May 2025, 07:45 PM"
        const parsed = new Date(order.placed.replace(/,/, '').replace(/(\d{2}):(\d{2}) (AM|PM)/, (m, h, min, ap) => {
          let hours = parseInt(h);
          if (ap === 'PM' && hours !== 12) hours += 12;
          if (ap === 'AM' && hours === 12) hours = 0;
          return `${hours}:${min}`;
        }));
        if (!isNaN(parsed.getTime())) placedTime = parsed.toISOString();
        else placedTime = new Date(Date.now() - 1000 * 60 * 5).toISOString();
      }
      if (!placedTime) return;
      const ageMin = (Date.now() - new Date(placedTime).getTime()) / 60000;
      const thresholds = { Received: 0.5, Preparing: 1.5, Cooking: 3 };
      if (ageMin >= thresholds[order.status]) {
        changeOrderStatus(order.id, next);
      }
    });
  }, [autoTick, allOrders, updateOrderStatus]);

  const handleSendMessage = (orderId) => {
    const text = (msgDrafts[orderId] || "").trim();
    if (!text) return;
    sendStaffMessage(orderId, text);
    setMsgDrafts(p => ({ ...p, [orderId]: "" }));
    setMsgSent(p => ({ ...p, [orderId]: true }));
    setTimeout(() => setMsgSent(p => ({ ...p, [orderId]: false })), 2500);
  };

  const statuses = ["All", "Received", "Preparing", "Cooking", "Ready", "Delivered"];
  const catColors = { Breakfast: "#f5a623", Lunch: "#43a047", Dinner: "#c62828", Desserts: "#ad1457", Drinks: "#0277bd", "Fast Food": "#f97316" };
  const statusSteps = ["Received", "Preparing", "Cooking", "Ready", "Delivered"];

  const allFeedback = store.feedbackList || [];
  const stats = {
    total: allOrders.length,
    active: allOrders.filter(o => ["Received", "Preparing", "Cooking", "Ready"].includes(o.status)).length,
    ready: allOrders.filter(o => o.status === "Ready").length,
    withNotes: allOrders.filter(o => o.items?.some(i => (i.toppings?.length || 0) + (i.removedIngredients?.length || 0) > 0 || i.note || (i.spice && i.spice !== "None"))).length,
    reviews: allFeedback.length,
  };

  const filteredOrders = allOrders.filter(o => {
    const ms = filterStatus === "All" || o.status === filterStatus;
    const query = search.trim().toLowerCase();
    const mq = !query || (o.id || "").toLowerCase().includes(query) || (o.table || "").toLowerCase().includes(query);
    return ms && mq;
  });

  const tableQueues = filteredOrders.reduce((acc, o) => {
    if (!acc[o.table]) acc[o.table] = [];
    acc[o.table].push(o);
    return acc;
  }, {});

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f4f1ed", fontFamily: "'Trebuchet MS', sans-serif", color: "#111827" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)", padding: "32px 40px 36px", position: "relative", overflow: "hidden" }}>
        {[["-30px", "160px", `${accentColor}12`], ["right:0", "130px", "rgba(255,255,255,0.025)"]].map(([pos, sz, bg], i) => (
          <div key={i} style={{ position: "absolute", top: -20, left: i === 0 ? pos : undefined, right: i === 1 ? "0" : undefined, width: sz, height: sz, borderRadius: "50%", background: bg, pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: `${accentColor}bb`, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 7 }}>Staff Dashboard</div>
              <h1 style={{ margin: "0 0 5px", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>Orders & Kitchen Dashboard 👨‍🍳</h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 12 }}>Status updates automatically · Staff messages reach customers in real-time</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <button onClick={() => { setStaffRole(null); onLogout?.(); }} style={{
                padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)",
                fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.25)"; e.currentTarget.style.color = "#fca5a5"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
              >🔓 Logout</button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  [stats.total, "Total Orders", "#fff"],
                  [stats.active, "Active Now", accentColor],
                  [stats.ready, "Ready to Serve", "#22c55e"],
                  [stats.withNotes, "Has Notes", "#f59e0b"],
                  [stats.reviews, "Reviews", "#a78bfa"],
                ].map(([val, label, col]) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "11px 16px", textAlign: "center", minWidth: 72 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: col }}>{val}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 22, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "0 12px", gap: 7, flex: 1, maxWidth: 260 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or table…"
                style={{ flex: 1, border: "none", background: "none", color: "rgba(255,255,255,0.75)", fontSize: 12, outline: "none", padding: "8px 0", fontFamily: "inherit" }} />
            </div>
            {statuses.map(s => {
              const sc = s !== "All" ? statusConfig[s] : null;
              const active = filterStatus === s;
              return (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: "6px 14px", borderRadius: 18, border: "none",
                  background: active ? (sc ? sc.color : "rgba(255,255,255,0.88)") : "rgba(255,255,255,0.08)",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
                }}>
                  {sc && <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "rgba(255,255,255,0.8)" : sc.dot, display: "inline-block" }} />}
                  {s} ({s === "All" ? allOrders.length : allOrders.filter(o => o.status === s).length})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Queue legend */}
      {Object.keys(tableQueues).length > 0 && (
        <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "12px 40px", overflowX: "auto" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", whiteSpace: "nowrap" }}>📍 Table Queues:</span>
            {Object.entries(tableQueues).map(([table, orders]) => {
              const activeCount = orders.filter(o => ["Received", "Preparing", "Cooking"].includes(o.status)).length;
              return (
                <div key={table} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 12px",
                  background: activeCount > 1 ? "#fff7ed" : "#f0fdf4",
                  border: `1px solid ${activeCount > 1 ? "#fed7aa" : "#bbf7d0"}`,
                  borderRadius: 20, flexShrink: 0,
                }}>
                  <span style={{ fontSize: 12 }}>{activeCount > 1 ? "⏳" : "✅"}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: activeCount > 1 ? "#c2410c" : "#15803d" }}>{table}</span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>{orders.length} order{orders.length > 1 ? "s" : ""}</span>
                  {activeCount > 1 && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#c2410c", background: "#fee2e2", borderRadius: 6, padding: "1px 6px" }}>
                      {activeCount} in queue
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order cards */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 40px 60px" }}>
        {filteredOrders.length === 0 && (
          <div style={{ textAlign: "center", padding: "56px", background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 700, color: "#374151", fontSize: 15 }}>No orders found</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Try a different filter or search.</div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {filteredOrders.map(order => {
            const sc = statusConfig[order.status] || statusConfig["Received"];
            const isExpanded = expandedOrder === order.id;
            const notesExpanded = notesOpen[order.id];
            const hasNotes = order.items?.some(i => (i.toppings?.length || 0) + (i.removedIngredients?.length || 0) > 0 || i.note || (i.spice && i.spice !== "None"));
            const currentStepIdx = statusSteps.indexOf(order.status);
            const tableOrders = allOrders.filter(o => o.table === order.table && ["Received", "Preparing", "Cooking"].includes(o.status));
            const queuePos = tableOrders.findIndex(o => o.id === order.id) + 1;
            const isDelayed = queuePos > 1;
            const prepMins = order.items ? Math.max(...order.items.map(i => getDishPrepTime(i.name))) : 20;
            const existingMsgs = store.staffMessages?.[order.id] || [];

            return (
              <div key={order.id} style={{
                background: "#fff", borderRadius: 20,
                border: `1px solid ${isDelayed ? "#fed7aa" : "rgba(0,0,0,0.05)"}`,
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}>
                {/* Card header */}
                <div style={{
                  padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                  borderLeft: `5px solid ${sc.color}`, cursor: "pointer",
                }} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: sc.bg, border: `1.5px solid ${sc.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {sc.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 900, color: "#111827" }}>{order.id}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: sc.color, background: sc.bg, borderRadius: 7, padding: "2px 9px", border: `1px solid ${sc.color}33` }}>{sc.icon} {order.status}</span>
                      {hasNotes && <span style={{ fontSize: 9, fontWeight: 700, color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, padding: "2px 8px" }}>👨‍🍳 Special Notes</span>}
                      {isDelayed && <span style={{ fontSize: 9, fontWeight: 700, color: "#c2410c", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 7, padding: "2px 8px" }}>⏳ Queue #{queuePos} at {order.table}</span>}
                      {existingMsgs.length > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: accentColor, background: `${accentColor}12`, borderRadius: 7, padding: "2px 8px" }}>💬 {existingMsgs.length} msg sent</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      {order.table} · {order.placed} · {order.items.length} items · <strong style={{ color: "#374151" }}>Rs. {(order.total ?? 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {order.items.slice(0, 4).map((it, i) => (
                      <div key={i} style={{ width: 34, height: 34, borderRadius: 9, background: `${catColors[it.category] || accentColor}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{it.emoji}</div>
                    ))}
                    {order.items.length > 4 && <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700 }}>+{order.items.length - 4}</span>}
                  </div>
                  <div style={{ fontSize: 16, color: "#9ca3af", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▾</div>
                </div>

                {/* Queue delay alert */}
                {isDelayed && isExpanded && (
                  <div style={{ background: "#fff7ed", borderTop: "1px solid #fed7aa", padding: "10px 22px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#c2410c" }}>{order.table} has {queuePos} active orders — this is #{queuePos} in queue</div>
                      <div style={{ fontSize: 10, color: "#9a3412" }}>Consider sending a message to the customer to manage expectations.</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setMsgDrafts(p => ({ ...p, [order.id]: `Hi! Your order at ${order.table} is in queue. Estimated wait: ${prepMins + (queuePos - 1) * 5} minutes. Thank you for your patience! 🙏` })); }} style={{ padding: "6px 12px", borderRadius: 9, border: "none", background: "#c2410c", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      📨 Quick Message
                    </button>
                  </div>
                )}

                {/* Expanded body */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #f0f0f0" }}>
                    {/* Status stepper */}
                    <div style={{ padding: "14px 22px", background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 9, textTransform: "uppercase", letterSpacing: "0.5px" }}>Update Status</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        {statusSteps.map((st, i) => {
                          const stc = statusConfig[st];
                          const done = i < currentStepIdx;
                          const active = i === currentStepIdx;
                          const isLast = i === 4;
                          return (
                            <div key={st} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
                              <button onClick={() => changeOrderStatus(order.id, st)} title={`Set to ${st}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "3px 5px" }}>
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: done || active ? `linear-gradient(135deg,${stc.color},${stc.color}cc)` : "#f3f4f6", border: active ? `3px solid ${stc.color}` : done ? "none" : "2px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: active ? `0 0 0 5px ${stc.color}18` : "none", transition: "all 0.25s" }}>
                                  {done || active ? stc.icon : <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700 }}>{i + 1}</span>}
                                </div>
                                <span style={{ fontSize: 8, fontWeight: active ? 800 : 500, color: active ? stc.color : done ? "#374151" : "#9ca3af", whiteSpace: "nowrap" }}>{st}</span>
                              </button>
                              {!isLast && <div style={{ flex: 1, height: 2, background: done ? `linear-gradient(90deg,${stc.color},${statusConfig[statusSteps[i + 1]].color})` : "#e5e7eb", margin: "0 2px", marginBottom: 16, transition: "background 0.3s" }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items + Notes columns */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                      {/* LEFT: Items */}
                      <div style={{ padding: "18px 22px", borderRight: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#374151", marginBottom: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>🍽️ Order Items</div>
                        {order.items.map((item, idx) => {
                          const cc = catColors[item.category] || accentColor;
                          return (
                            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 9, paddingBottom: 9, borderBottom: idx < order.items.length - 1 ? "1px dashed #f3f4f6" : "none" }}>
                              <div style={{ width: 38, height: 38, borderRadius: 9, background: `${cc}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{item.name} <span style={{ fontWeight: 400, color: "#9ca3af" }}>×{item.qty}</span></span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: cc }}>Rs.{(item.price * item.qty).toLocaleString()}</span>
                                </div>
                                <div style={{ display: "flex", gap: 3, marginTop: 3, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: 8, fontWeight: 700, color: cc, background: `${cc}12`, borderRadius: 4, padding: "1px 6px" }}>{item.category}</span>
                                  {item.spice && item.spice !== "None" && <span style={{ fontSize: 8, fontWeight: 700, color: "#dc2626", background: "#fee2e2", borderRadius: 4, padding: "1px 6px" }}>🌶 {item.spice}</span>}
                                  {item.toppings?.map(t => <span key={t} style={{ fontSize: 8, fontWeight: 600, color: "#166534", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 4, padding: "1px 6px" }}>+{t}</span>)}
                                  {item.removedIngredients?.map(r => <span key={r} style={{ fontSize: 8, fontWeight: 600, color: "#991b1b", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 4, padding: "1px 6px" }}>✕{r}</span>)}
                                </div>
                                {item.note && <div style={{ fontSize: 9, color: "#78350f", fontStyle: "italic", marginTop: 3, background: "#fffbeb", borderRadius: 6, padding: "3px 7px" }}>📝 {item.note}</div>}
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 9, borderTop: "2px solid #f0f0f0" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Total</span>
                          <span style={{ fontSize: 15, fontWeight: 900, color: accentColor }}>Rs.{order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* RIGHT: Kitchen notes */}
                      <div style={{ padding: "18px 22px", background: hasNotes ? "#fffbf0" : "#fafafa" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>👨‍🍳 Kitchen Notes</div>
                          {hasNotes && <button onClick={() => setNotesOpen(p => ({ ...p, [order.id]: !p[order.id] }))} style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}33`, color: accentColor, borderRadius: 7, padding: "3px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{notesExpanded ? "Collapse ▴" : "Expand ▾"}</button>}
                        </div>
                        {!hasNotes ? (
                          <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                            <div style={{ fontSize: 30, marginBottom: 6 }}>✅</div>
                            <div style={{ fontSize: 11, fontWeight: 600 }}>No special instructions</div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 11, padding: "9px 13px", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ fontSize: 17 }}>⚠️</span>
                              <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>
                                {order.items.filter(i => (i.toppings?.length || 0) + (i.removedIngredients?.length || 0) > 0 || i.note || (i.spice && i.spice !== "None")).length} item(s) need special attention
                              </div>
                            </div>
                            {order.items.filter(i => (i.toppings?.length || 0) + (i.removedIngredients?.length || 0) > 0 || i.note || (i.spice && i.spice !== "None")).map((item, idx) => (
                              <div key={idx} style={{ background: "#fff", borderRadius: 12, border: `1.5px solid ${notesExpanded ? "#fcd34d" : "#f3f4f6"}`, overflow: "hidden", marginBottom: 7 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 11px", background: "#fffbeb", cursor: "pointer" }} onClick={() => setNotesOpen(p => ({ ...p, [order.id]: !p[order.id] }))}>
                                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: "#92400e", flex: 1 }}>{item.name}</span>
                                  <div style={{ display: "flex", gap: 3 }}>
                                    {item.spice && item.spice !== "None" && <span style={{ fontSize: 8, color: "#dc2626", background: "#fee2e2", borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>🌶</span>}
                                    {item.toppings?.length > 0 && <span style={{ fontSize: 8, color: "#166534", background: "#dcfce7", borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>+{item.toppings.length}</span>}
                                    {item.removedIngredients?.length > 0 && <span style={{ fontSize: 8, color: "#991b1b", background: "#fee2e2", borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>✕{item.removedIngredients.length}</span>}
                                  </div>
                                </div>
                                {notesExpanded && (
                                  <div style={{ padding: "9px 11px", display: "flex", flexDirection: "column", gap: 5 }}>
                                    {item.spice && item.spice !== "None" && <div style={{ display: "flex", gap: 5, alignItems: "center" }}><span style={{ fontSize: 9, fontWeight: 800, color: "#b45309", width: 58, flexShrink: 0 }}>🌶 SPICE</span><span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "#fee2e2", borderRadius: 5, padding: "1px 7px" }}>{item.spice}</span></div>}
                                    {item.toppings?.length > 0 && <div style={{ display: "flex", gap: 5, alignItems: "flex-start" }}><span style={{ fontSize: 9, fontWeight: 800, color: "#b45309", width: 58, flexShrink: 0, marginTop: 2 }}>➕ ADD</span><div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{item.toppings.map(t => <span key={t} style={{ fontSize: 10, fontWeight: 600, color: "#166534", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 5, padding: "1px 7px" }}>{t}</span>)}</div></div>}
                                    {item.removedIngredients?.length > 0 && <div style={{ display: "flex", gap: 5, alignItems: "flex-start" }}><span style={{ fontSize: 9, fontWeight: 800, color: "#b45309", width: 58, flexShrink: 0, marginTop: 2 }}>✕ REMOVE</span><div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{item.removedIngredients.map(r => <span key={r} style={{ fontSize: 10, fontWeight: 600, color: "#991b1b", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 5, padding: "1px 7px" }}>{r}</span>)}</div></div>}
                                    {item.note && <div style={{ display: "flex", gap: 5, alignItems: "flex-start" }}><span style={{ fontSize: 9, fontWeight: 800, color: "#b45309", width: 58, flexShrink: 0, marginTop: 2 }}>📝 NOTE</span><div style={{ fontSize: 10, color: "#78350f", fontStyle: "italic", lineHeight: 1.6, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 5, padding: "3px 9px", flex: 1 }}>"{item.note}"</div></div>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message panel */}
                    <div style={{ borderTop: "1px solid #f0f0f0", padding: "18px 22px", background: "#fafafa" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#374151", marginBottom: 10, display: "flex", alignItems: "center", gap: 7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        📨 Message to Customer
                        {existingMsgs.length > 0 && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: accentColor, background: `${accentColor}15`, borderRadius: 6, padding: "1px 7px" }}>{existingMsgs.length} sent</span>
                        )}
                        <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>Customer sees this on the Track Order page in real-time</span>
                      </div>

                      {existingMsgs.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, background: "#f0fdf4", borderRadius: 12, padding: "10px 14px", border: "1px solid #bbf7d0" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#16a34a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>✅ Sent Messages (visible to customer)</div>
                          {existingMsgs.map((msg, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 10, color: "#6b7280", flexShrink: 0, marginTop: 1 }}>{msg.time}</span>
                              <span style={{ fontSize: 11, color: "#374151", lineHeight: 1.5 }}>{msg.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msgSent[order.id] ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 11 }}>
                          <span style={{ fontSize: 20 }}>✅</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>Message sent! Customer can see it live on the Track Order page.</span>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "flex-start" }}>
                          <div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                              {[
                                isDelayed ? `Hi! Your order is #${queuePos} in queue at ${order.table}. Est. wait: ~${prepMins + (queuePos - 1) * 5} min. Thank you! 🙏` : null,
                                "Your order is almost ready! 🍽️",
                                "Slight delay — 5 more minutes. Sorry! 🙏",
                                "Out of one item — chef is substituting now.",
                                "Your food is on its way to your table! 🏃",
                              ].filter(Boolean).map(tmpl => (
                                <button key={tmpl} onClick={() => setMsgDrafts(p => ({ ...p, [order.id]: tmpl }))} style={{ padding: "4px 10px", borderRadius: 8, background: `${accentColor}0d`, border: `1px solid ${accentColor}33`, color: accentColor, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                                  {tmpl.length > 50 ? tmpl.slice(0, 50) + "…" : tmpl}
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={msgDrafts[order.id] || ""}
                              onChange={e => setMsgDrafts(p => ({ ...p, [order.id]: e.target.value }))}
                              placeholder={`Type a message for ${order.table}… Only the customer at this table will see it.`}
                              rows={2}
                              style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", color: "#374151", fontSize: 12, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                            />
                          </div>
                          <button
                            onClick={() => handleSendMessage(order.id)}
                            disabled={!(msgDrafts[order.id] || "").trim()}
                            style={{ padding: "11px 18px", borderRadius: 11, border: "none", background: (msgDrafts[order.id] || "").trim() ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#e5e7eb", color: (msgDrafts[order.id] || "").trim() ? "#fff" : "#9ca3af", fontWeight: 700, fontSize: 12, cursor: (msgDrafts[order.id] || "").trim() ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: (msgDrafts[order.id] || "").trim() ? `0 4px 14px ${accentColor}44` : "none", transition: "all 0.2s", whiteSpace: "nowrap", height: "fit-content", marginTop: 28 }}
                          >📨 Send</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── VIDEO WIDGET ─────────────────────────────────────────────────────────────
const videoScenes = [
  { emoji: "🏠", desc: "Warm welcoming ambiance", bg: "linear-gradient(135deg,#1a0a00,#3d1a00)" },
  { emoji: "👨‍🍳", desc: "Chefs crafting with passion", bg: "linear-gradient(135deg,#001a0a,#003d1a)" },
  { emoji: "🍛", desc: "Aromatic rice & curry", bg: "linear-gradient(135deg,#0a0a1a,#1a1a3d)" },
  { emoji: "🥩", desc: "Slow-cooked premium meats", bg: "linear-gradient(135deg,#1a0000,#3d0000)" },
  { emoji: "🦐", desc: "Fresh catch from local waters", bg: "linear-gradient(135deg,#001020,#002040)" },
  { emoji: "🍰", desc: "Artisan desserts & sweet treats", bg: "linear-gradient(135deg,#1a001a,#3d003d)" },
  { emoji: "🧋", desc: "Signature drinks & fresh juices", bg: "linear-gradient(135deg,#001a1a,#003d3d)" },
  { emoji: "🌟", desc: "We can't wait to see you!", bg: "linear-gradient(135deg,#1a1400,#3d3000)" },
];

const videoChapters = [
  { title: "Welcome", emoji: "🏠", color: "#f5a623", pct: 0 },
  { title: "Kitchen", emoji: "👨‍🍳", color: "#22c55e", pct: 15 },
  { title: "Signature Dishes", emoji: "🍛", color: "#3b82f6", pct: 35 },
  { title: "Lankan Flavours", emoji: "🇱🇰", color: "#f97316", pct: 60 },
  { title: "Desserts & Drinks", emoji: "🍰", color: "#ad1457", pct: 80 },
  { title: "See You Soon!", emoji: "🌟", color: "#eab308", pct: 95 },
];

function VideoWidget({ accentColor, onViewMenu }) {
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const intervalRef = useRef(null);

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
        setSceneIdx(Math.min(Math.floor((next / 100) * videoScenes.length), videoScenes.length - 1));
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
  const currentChapter = videoChapters[currentChapterIdx];

  if (fullscreen) return (
    <div
      onClick={() => { setFullscreen(false); setPlaying(false); }}
      style={{
        position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "modalFadeIn 0.25s ease",
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(760px,94vw)", background: "#0d0d1a", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.07)", animation: "modalSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{
          height: 340, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: scene.bg, cursor: "pointer",
        }} onClick={toggle}>
          <div style={{
            position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${accentColor}18 0%, transparent 70%)`, opacity: playing ? 1 : 0.5, transition: "opacity 0.4s",
          }} />
          <div style={{
            fontSize: 130, zIndex: 2, userSelect: "none", filter: `drop-shadow(0 8px 32px ${accentColor}55)`, animation: playing ? "sceneFloat 3s ease-in-out infinite" : "none", transition: "font-size 0.3s",
          }}>{scene.emoji}</div>
          {!playing && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: `0 8px 28px ${accentColor}66`, animation: "playPulse 2s ease-in-out infinite",
              }}>▶</div>
            </div>
          )}
          <div style={{
            position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.55)", fontStyle: "italic", letterSpacing: "0.3px",
          }}>{scene.desc}</div>
          <button onClick={() => { setFullscreen(false); setPlaying(false); }} style={{
            position: "absolute", top: 14, right: 14, zIndex: 10, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{currentChapter.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{currentChapter.title}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Smart Restaurant · Est. 2025</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              {playing && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "liveDot2 1.4s ease-in-out infinite" }} />}
              {playing ? "LIVE" : `${Math.floor(progress)}% watched`}
            </div>
          </div>
          <div
            style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", marginBottom: 14, cursor: "pointer" }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, pct)));
              setSceneIdx(Math.min(Math.floor((pct / 100) * videoScenes.length), videoScenes.length - 1));
            }}
          >
            <div style={{
              height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${accentColor},${accentColor}cc)`, borderRadius: 10, transition: "width 0.12s linear", boxShadow: `0 0 8px ${accentColor}66`,
            }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
            {videoChapters.map((ch, i) => (
              <button key={i} onClick={() => { setProgress(ch.pct); setSceneIdx(Math.floor((ch.pct / 100) * videoScenes.length)); }} style={{
                padding: "4px 10px", borderRadius: 20, border: "none", background: currentChapterIdx === i ? `linear-gradient(135deg,${ch.color},${ch.color}cc)` : "rgba(255,255,255,0.07)", color: currentChapterIdx === i ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}>{ch.emoji} {ch.title}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={toggle} style={{
              flex: 1, padding: "11px", borderRadius: 12, border: "none", background: playing ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg,${accentColor},${accentColor}cc)`, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: playing ? "none" : `0 6px 20px ${accentColor}44`,
            }}>
              {playing ? "⏸ Pause" : progress > 0 ? "▶ Resume" : "▶ Play"}
            </button>
            <button onClick={() => setLiked(l => !l)} style={{
              padding: "11px 16px", borderRadius: 12, border: "none", background: liked ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)", color: liked ? "#ef4444" : "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>
              {liked ? "❤️" : "🤍"}
            </button>
            <button onClick={() => { setFullscreen(false); setPlaying(false); onViewMenu && onViewMenu(); }} style={{
              padding: "11px 16px", borderRadius: 12, border: `1px solid ${accentColor}55`, background: "transparent", color: accentColor, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
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
      `}</style>
    </div>
  );

  if (!staffRole) {
    return (
      <StaffLoginModal
        accentColor={accentColor}
        onSuccess={setStaffRole}
        onClose={() => onBack?.()}
      />
    );
  }

  return (
    <div style={{ margin: "12px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>🎬</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.55)", letterSpacing: "1px", textTransform: "uppercase" }}>Our Restaurant</span>
        </div>
        {playing && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, color: "#22c55e" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "liveDot2 1.4s ease-in-out infinite" }} />
            LIVE
          </div>
        )}
      </div>
      <div style={{
        borderRadius: 16, overflow: "hidden", background: scene.bg, border: `1px solid ${accentColor}33`, boxShadow: `0 6px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)`, cursor: "pointer",
      }}>
        <div style={{ height: 118, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }} onClick={toggle}>
          <div style={{
            position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${accentColor}1a 0%, transparent 65%)`, opacity: playing ? 1 : 0.5, transition: "opacity 0.35s",
          }} />
          <div style={{
            fontSize: 60, zIndex: 2, userSelect: "none", filter: `drop-shadow(0 6px 16px ${accentColor}44)`, animation: playing ? "sceneFloat 3s ease-in-out infinite" : "none", transition: "font-size 0.25s",
          }}>{scene.emoji}</div>
          {!playing && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 18px ${accentColor}66`, animation: "playPulse 2s ease-in-out infinite",
              }}>▶</div>
            </div>
          )}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)", padding: "10px 10px 6px", display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>
              {currentChapter.emoji} {currentChapter.title}
            </span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.08)", position: "relative" }}>
          <div style={{
            height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${accentColor},${accentColor}cc)`, transition: "width 0.12s linear", boxShadow: `0 0 6px ${accentColor}88`,
          }} />
        </div>
        <div style={{
          padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.25)",
        }}>
          <button onClick={toggle} style={{
            padding: "5px 12px", borderRadius: 8, border: "none", background: playing ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg,${accentColor},${accentColor}cc)`, color: "#fff", fontWeight: 700, fontSize: 10, cursor: "pointer", fontFamily: "inherit",
          }}>
            {playing ? "⏸" : progress > 0 ? "▶ Resume" : "▶ Watch"}
          </button>
          <button onClick={() => { setFullscreen(true); setPlaying(true); }} style={{
            padding: "5px 10px", borderRadius: 8, border: `1px solid ${accentColor}44`, background: "transparent", color: accentColor, fontWeight: 700, fontSize: 10, cursor: "pointer", fontFamily: "inherit",
          }}>
            ⛶ Full
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STAFF LOGIN MODAL ────────────────────────────────────────────────────────

const STAFF_CREDENTIALS = [
  { username: "admin", password: "admin123", role: "Manager", icon: "👔" },
  { username: "chef", password: "chef123", role: "Head Chef", icon: "👨‍🍳" },
  { username: "staff1", password: "staff123", role: "Kitchen Staff", icon: "🧑‍🍳" },
  { username: "waiter1", password: "waiter123", role: "Senior Waiter", icon: "🍽️" },
];

function StaffLoginModal({ accentColor, onSuccess, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

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
          setError(`Incorrect username or password. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? "s" : ""} remaining.`);
        }
      }
    }, 800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 26, width: "100%", maxWidth: 420,
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
          animation: "loginPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div style={{
          background: `linear-gradient(135deg,#1a1a2e,#16213e)`,
          padding: "32px 32px 28px",
          position: "relative", textAlign: "center",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.7)",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <div style={{
            width: 72, height: 72, borderRadius: 22, margin: "0 auto 16px",
            background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, boxShadow: `0 8px 24px ${accentColor}55`,
          }}>🔐</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: `${accentColor}bb`, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Restricted Access</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff" }}>Staff Dashboard</h2>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Enter your staff credentials to continue</p>
        </div>
        <div style={{ padding: "28px 32px 32px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              👤 Username
            </label>
            <input
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter your username"
              autoFocus
              disabled={locked}
              style={{
                width: "100%", boxSizing: "border-box",
                background: locked ? "#f9fafb" : "#f9fafb",
                border: `2px solid ${error && !loading ? "#fca5a5" : username ? "#bbf7d0" : "#e5e7eb"}`,
                borderRadius: 13, padding: "12px 16px", fontSize: 14, color: "#111827",
                outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = accentColor}
              onBlur={e => e.target.style.borderColor = error ? "#fca5a5" : username ? "#bbf7d0" : "#e5e7eb"}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🔑 Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                disabled={locked}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "#f9fafb",
                  border: `2px solid ${error && !loading ? "#fca5a5" : password ? "#bbf7d0" : "#e5e7eb"}`,
                  borderRadius: 13, padding: "12px 46px 12px 16px", fontSize: 14, color: "#111827",
                  outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = accentColor}
                onBlur={e => e.target.style.borderColor = error ? "#fca5a5" : password ? "#bbf7d0" : "#e5e7eb"}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af",
                }}
              >{showPass ? "🙈" : "👁️"}</button>
            </div>
          </div>
          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 11,
              padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#dc2626",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠️</span>
              <span>{error}</span>
              {locked && <strong style={{ marginLeft: "auto" }}>{lockTimer}s</strong>}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading || locked}
            style={{
              width: "100%", padding: "14px",
              background: locked ? "#e5e7eb" : loading ? `${accentColor}99` : `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
              border: "none", borderRadius: 14, color: locked ? "#9ca3af" : "#fff",
              fontWeight: 800, fontSize: 15, cursor: locked || loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: locked ? "none" : `0 6px 20px ${accentColor}44`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s", marginBottom: 20,
            }}
          >
            {loading ? (
              <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Verifying…</>
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

// ─── EXPORT ────────────────────────────────────────────────────────────────────
export default OrdersPage;