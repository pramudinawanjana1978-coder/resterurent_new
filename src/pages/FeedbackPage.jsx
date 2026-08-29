import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useAppStore } from '../store/AppStore.jsx';

// ─── LOCAL StarRow (copied from first file) ──────────────────────────────────
function StarRow({ value, onChange, size = 36, activeColor }) {
  const [hover, setHover] = useState(0);
  const colors = { 1: "#ef4444", 2: "#f97316", 3: "#eab308", 4: "#84cc16", 5: "#22c55e" };
  const col = colors[hover || value] || "#d1d5db";
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            lineHeight: 1,
            fontSize: size,
            color: (hover || value) >= i ? col : "#e5e7eb",
            transform: (hover || value) >= i ? "scale(1.15)" : "scale(1)",
            transition: "all 0.15s",
            display: "inline-block",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── QUICK TAGS ──────────────────────────────────────────────────────────────
const quickTags = {
  1: ["Too slow", "Wrong order", "Cold food", "Poor service", "Overpriced"],
  2: ["Average", "Slightly bland", "Could improve", "Long wait", "Small portions"],
  3: ["Decent", "Good value", "Okay taste", "Nice ambiance", "Average service"],
  4: ["Tasty", "Good portions", "Friendly staff", "Quick service", "Nice presentation"],
  5: ["Delicious", "Excellent service", "Perfectly cooked", "Great value", "Will return", "Highly recommend", "Amazing flavours", "Beautiful plating"],
};

const aspects = [
  { key: "taste", label: "Taste", emoji: "😋" },
  { key: "presentation", label: "Presentation", emoji: "🎨" },
  { key: "service", label: "Service", emoji: "🤝" },
  { key: "value", label: "Value", emoji: "💰" },
  { key: "ambiance", label: "Ambiance", emoji: "✨" },
];

const pastReviews = [
  { id: "r1", name: "Kasun Perera", avatar: "👨🏽", stars: 5, dish: "Chicken Kottu", emoji: "🍳", time: "2 days ago", comment: "Absolutely incredible! The kottu was perfectly spiced and crispy. Will definitely order again.", helpful: 24, category: "Dinner" },
  { id: "r2", name: "Nethmi Silva", avatar: "👩🏽", stars: 4, dish: "Blueberry Pancakes", emoji: "🥞", time: "4 days ago", comment: "Fluffy and fresh! The blueberries were sweet and the maple syrup was the perfect touch.", helpful: 17, category: "Breakfast" },
  { id: "r3", name: "Tharindu Jayawardena", avatar: "👨🏻", stars: 5, dish: "Devilled Prawns", emoji: "🦐", time: "1 week ago", comment: "Best devilled prawns I've had in Colombo. The sauce was perfectly balanced — not too spicy.", helpful: 31, category: "Dinner" },
  { id: "r4", name: "Dilini Rathnayake", avatar: "👩🏽", stars: 3, dish: "Mango Bubble Tea", emoji: "🧋", time: "2 weeks ago", comment: "Bubble tea was good but a bit too sweet for my liking. Would try less sugar next time.", helpful: 9, category: "Drinks" },
  { id: "r5", name: "Ravindu Wickrama", avatar: "👨🏽", stars: 5, dish: "Chicken Biryani", emoji: "🍛", time: "3 weeks ago", comment: "Fragrant, perfectly cooked and generous portion. The raita was a great complement.", helpful: 38, category: "Dinner" },
  { id: "r6", name: "Amaya Fernando", avatar: "👩🏻", stars: 4, dish: "Watalappan", emoji: "🍮", time: "1 month ago", comment: "Traditional taste, just like my grandmother used to make. Creamy and perfectly sweetened.", helpful: 22, category: "Desserts" },
];

function FeedbackPage({ onBack, accentColor = "#e11d48", orderedItems = [] }) {
  const { submitFeedback, store } = useAppStore();

  // ── Dishes from user's orders ──
  const reviewableDishes = React.useMemo(() => {
    const source = orderedItems;
    const seen = new Set();
    return source
      .filter(i => {
        if (seen.has(i.name)) return false;
        seen.add(i.name);
        return true;
      })
      .map(i => ({
        id: i.id,
        name: i.name,
        emoji: i.emoji,
        price: typeof i.price === "number" ? `Rs. ${i.price.toLocaleString()}` : i.price,
        date: store.orders[0]?.placed || new Date().toLocaleDateString(),
        orderId: store.orders[0]?.id || "",
      }));
  }, [orderedItems, store.orders]);

  // ── All reviews (past + submitted) ──
  const allReviews = React.useMemo(() => {
    const stored = store.feedbackList.map(review => ({
      id: review.id,
      name: review.name || "Anonymous Customer",
      avatar: "🧑",
      stars: review.rating || 0,
      dish: review.dishName || "Delicious Dish",
      emoji: review.dishEmoji || "🍽️",
      time: "Just now",
      comment: review.comment || "",
      helpful: 0,
    }));
    return [...stored, ...pastReviews];
  }, [store.feedbackList]);

  const reviewCount = allReviews.length;
  const reviewAverage = reviewCount
    ? (allReviews.reduce((sum, r) => sum + r.stars, 0) / reviewCount).toFixed(1)
    : "0.0";

  // ── State ──
  const [step, setStep] = useState(0);
  const [dish, setDish] = useState(null);
  const [overall, setOverall] = useState(0);
  const [aspects_, setAspects] = useState({});
  const [selTags, setSelTags] = useState([]);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [recommend, setRecommend] = useState(null);
  const [helpfulMap, setHelpfulMap] = useState({});
  const [activeTab, setActiveTab] = useState("write");

  const ratingMeta = [
    { label: "", emoji: "", color: "#9ca3af" },
    { label: "Terrible", emoji: "😞", color: "#ef4444" },
    { label: "Poor", emoji: "😕", color: "#f97316" },
    { label: "Okay", emoji: "😐", color: "#eab308" },
    { label: "Good", emoji: "😊", color: "#84cc16" },
    { label: "Excellent!", emoji: "🤩", color: "#22c55e" },
  ];

  const currentMeta = ratingMeta[overall] || ratingMeta[0];
  const tags = overall > 0 ? quickTags[overall] || [] : quickTags[5];
  const toggleTag = t => setSelTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const setAspect = (k, v) => setAspects(p => ({ ...p, [k]: v }));

  const canProceedStep1 = overall > 0;
  const canProceedStep2 = comment.trim().length >= 5;

  const STEPS = ["Choose Dish", "Rate Experience", "Write Review", "Done!"];

  // ─── TOPBAR (fully restored from first file) ─────────────────────────────
  const Topbar = () => (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "0 32px",
        height: 62,
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#f3f4f6",
          border: "none",
          borderRadius: 10,
          padding: "7px 14px",
          color: "#555",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "inherit",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#e5e7eb")}
        onMouseLeave={e => (e.currentTarget.style.background = "#f3f4f6")}
      >
        ← Home
      </button>
      <div style={{ flex: 1, maxWidth: 320 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f3f4f6",
            borderRadius: 10,
            padding: "0 12px",
            gap: 7,
          }}
        >
          <span style={{ color: "#9ca3af", fontSize: 13 }}>🔍</span>
          <input
            placeholder="Search food, drinks…"
            style={{
              border: "none",
              background: "none",
              fontSize: 13,
              color: "#374151",
              outline: "none",
              padding: "8px 0",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 20, opacity: 0.5, cursor: "pointer" }}>🔔</span>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ fontSize: 20 }}>🛒</span>
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: accentColor,
              color: "#fff",
              borderRadius: "50%",
              width: 14,
              height: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              fontWeight: 800,
            }}
          >
            3
          </span>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${accentColor},${accentColor}99)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          👤
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <div
      style={{
        background: "#fff",
        borderTop: "1px solid #f0f0f0",
        padding: "22px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 24,
      }}
    >
      {[
        { icon: "🕐", title: "Hours", lines: ["Mon–Sun", "10 AM – 11 PM"] },
        { icon: "📞", title: "Contact", lines: ["+94 77 599 5735", "info@smartrestaurant.lk"] },
        { icon: "📍", title: "Location", lines: ["123, Galle Road", "Colombo 03, Sri Lanka"] },
        { icon: "👥", title: "Follow Us", social: true },
      ].map((col, i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <span style={{ color: accentColor, fontSize: 16 }}>{col.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{col.title}</span>
          </div>
          {col.lines?.map((l, j) => (
            <div key={j} style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>
              {l}
            </div>
          ))}
          {col.social && (
            <div style={{ display: "flex", gap: 7, marginTop: 3 }}>
              {["🔵", "📸", "🐦", "▶️"].map((s, j) => (
                <div
                  key={j}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${accentColor}12`,
                    border: `1px solid ${accentColor}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─── DONE STEP ────────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f1ed", fontFamily: "'Trebuchet MS',sans-serif" }}>
        <Topbar />
        <div
          style={{
            minHeight: "calc(100vh - 62px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              padding: "52px 44px",
              maxWidth: 520,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              border: `2px solid ${accentColor}22`,
            }}
          >
            <div
              style={{
                fontSize: 80,
                marginBottom: 16,
                animation: "popBounce 0.6s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {overall >= 4 ? "🌟" : overall === 3 ? "😊" : "🙏"}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 8px" }}>
              {overall >= 4 ? "You made our day!" : overall === 3 ? "Thanks for the feedback!" : "We'll do better!"}
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>
              {name ? `Thanks, ${name}! ` : ""}Your {ratingMeta[overall].emoji}{" "}
              <strong>{ratingMeta[overall].label}</strong> review for <strong>{dish?.name}</strong> has been submitted.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <span
                  key={i}
                  style={{ fontSize: 28, color: i <= overall ? ratingMeta[overall].color : "#e5e7eb" }}
                >
                  ★
                </span>
              ))}
            </div>
            {selTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {selTags.map(t => (
                  <span
                    key={t}
                    style={{
                      background: `${accentColor}15`,
                      border: `1px solid ${accentColor}33`,
                      borderRadius: 20,
                      padding: "4px 14px",
                      fontSize: 12,
                      color: accentColor,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => {
                  setStep(0);
                  setOverall(0);
                  setDish(null);
                  setComment("");
                  setSelTags([]);
                  setName("");
                  setRecommend(null);
                  setAspects({});
                }}
                style={{
                  padding: "11px 24px",
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 12,
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Review Another
              </button>
              <button
                onClick={onBack}
                style={{
                  padding: "11px 24px",
                  background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  border: "none",
                  borderRadius: 12,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: `0 6px 20px ${accentColor}44`,
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <style>{`@keyframes popBounce{0%{transform:scale(0) rotate(-15deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}`}</style>
      </div>
    );
  }

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f4f1ed", fontFamily: "'Trebuchet MS',sans-serif", color: "#111827" }}>
      <Topbar />

      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)`,
          padding: "32px 40px 38px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[
          ["-30px", null, "180px", `${accentColor}12`],
          [null, "20px", "150px", "rgba(255,255,255,0.025)"],
        ].map(([l, r, sz, bg], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-20px",
              left: l || undefined,
              right: r || undefined,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: bg,
              pointerEvents: "none",
            }}
          />
        ))}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: `${accentColor}bb`,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Share Your Experience
              </div>
              <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
                How was your meal? 💬
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 13, maxWidth: 400 }}>
                Your honest feedback helps us cook better for you every single day.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                [`⭐ ${reviewAverage}`, "Overall"],
                [`${reviewCount}+`, "Reviews"],
                ["98%", "Happy"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 900, color: accentColor }}>{v}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 11,
              padding: 3,
              width: "fit-content",
            }}
          >
            {[
              ["write", "✏️ Write Review"],
              ["browse", "🌟 All Reviews"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: activeTab === id ? "#fff" : "transparent",
                  color: activeTab === id ? "#111827" : "rgba(255,255,255,0.5)",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: activeTab === id ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px 56px" }}>
        {activeTab === "write" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
            {/* Left column */}
            <div>
              {/* Step progress bar */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "18px 22px",
                  marginBottom: 20,
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {STEPS.map((s, i) => {
                    const done = i < step;
                    const active = i === step;
                    const isLast = i === STEPS.length - 1;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: done
                                ? `linear-gradient(135deg,${accentColor},${accentColor}cc)`
                                : active
                                ? "#fff"
                                : "#f3f4f6",
                              border: active
                                ? `2.5px solid ${accentColor}`
                                : done
                                ? "none"
                                : "2px solid #e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: done ? 16 : 13,
                              color: done ? "#fff" : active ? accentColor : "#9ca3af",
                              fontWeight: 700,
                              boxShadow: active ? `0 0 0 5px ${accentColor}18` : "none",
                              transition: "all 0.25s",
                            }}
                          >
                            {done ? "✓" : i + 1}
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: active ? 700 : 500,
                              color: active ? accentColor : done ? "#374151" : "#9ca3af",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s}
                          </span>
                        </div>
                        {!isLast && (
                          <div
                            style={{
                              flex: 1,
                              height: 2,
                              margin: "0 6px",
                              marginBottom: 18,
                              background: done
                                ? `linear-gradient(90deg,${accentColor},${accentColor}88)`
                                : "#e5e7eb",
                              borderRadius: 2,
                              transition: "background 0.3s",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 0: Choose Dish */}
              {step === 0 && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "26px 24px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900, color: "#111827" }}>
                    Which dish would you like to review?
                  </h2>
                  <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9ca3af" }}>
                    {reviewableDishes.length > 0
                      ? "Select from your ordered items below."
                      : "No ordered items found. Place an order first to leave a review."}
                  </p>
                  {reviewableDishes.length === 0 && (
                    <div style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>No orders yet</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Complete a cart order to unlock reviews.</div>
                      <button
                        onClick={onBack}
                        style={{
                          marginTop: 16,
                          padding: "9px 20px",
                          background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                          border: "none",
                          borderRadius: 10,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Browse Menu →
                      </button>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {reviewableDishes.map(o => (
                      <div
                        key={o.id}
                        onClick={() => setDish(o)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 16px",
                          borderRadius: 14,
                          cursor: "pointer",
                          border: dish?.id === o.id ? `2px solid ${accentColor}` : "2px solid #f3f4f6",
                          background: dish?.id === o.id ? `${accentColor}08` : "#fafafa",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                          if (dish?.id !== o.id) e.currentTarget.style.borderColor = "#d1d5db";
                        }}
                        onMouseLeave={e => {
                          if (dish?.id !== o.id) e.currentTarget.style.borderColor = "#f3f4f6";
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: `${accentColor}12`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            flexShrink: 0,
                          }}
                        >
                          {o.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{o.name}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                            {o.orderId} · {o.date} · {o.price}
                          </div>
                        </div>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: dish?.id === o.id ? "none" : "2px solid #d1d5db",
                            background:
                              dish?.id === o.id
                                ? `linear-gradient(135deg,${accentColor},${accentColor}cc)`
                                : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            color: "#fff",
                            flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                        >
                          {dish?.id === o.id ? "✓" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (dish) setStep(1);
                    }}
                    style={{
                      width: "100%",
                      marginTop: 22,
                      padding: "14px",
                      background: dish
                        ? `linear-gradient(135deg,${accentColor},${accentColor}cc)`
                        : "#e5e7eb",
                      border: "none",
                      borderRadius: 13,
                      color: dish ? "#fff" : "#9ca3af",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: dish ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      boxShadow: dish ? `0 6px 20px ${accentColor}44` : "none",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onMouseEnter={e => {
                      if (dish) e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 1: Rate */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      padding: "30px 28px",
                      border: overall > 0 ? `2px solid ${currentMeta.color}44` : "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
                      textAlign: "center",
                      transition: "border-color 0.3s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 16 }}>
                      How would you rate <strong style={{ color: "#111827" }}>{dish?.name}</strong>?
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                      <StarRow
                        value={overall}
                        onChange={v => {
                          setOverall(v);
                          setSelTags([]);
                        }}
                        size={48}
                        activeColor={currentMeta.color}
                      />
                    </div>
                    {overall > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          animation: "fadeSlideUp 0.25s ease",
                        }}
                      >
                        <span style={{ fontSize: 36 }}>{currentMeta.emoji}</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: currentMeta.color }}>
                          {currentMeta.label}
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: "#d1d5db" }}>Tap a star to rate</div>
                    )}
                  </div>

                  {overall > 0 && (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "22px 24px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
                        Rate specific aspects{" "}
                        <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12 }}>(optional)</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                        {aspects.map(a => (
                          <div
                            key={a.key}
                            style={{
                              padding: "12px 14px",
                              background: "#fafafa",
                              borderRadius: 12,
                              border: `1px solid ${
                                aspects_[a.key] ? "" + accentColor + "33" : "#f3f4f6"
                              }`,
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>
                              {a.emoji} {a.label}
                            </div>
                            <StarRow
                              value={aspects_[a.key] || 0}
                              onChange={v => setAspect(a.key, v)}
                              size={20}
                              activeColor={accentColor}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {overall > 0 && (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: "22px 24px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
                        What stood out?{" "}
                        <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 12 }}>
                          Pick all that apply
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                        {tags.map(t => {
                          const sel = selTags.includes(t);
                          return (
                            <button
                              key={t}
                              onClick={() => toggleTag(t)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 22,
                                background: sel
                                  ? `linear-gradient(135deg,${accentColor},${accentColor}cc)`
                                  : "#f3f4f6",
                                border: "none",
                                color: sel ? "#fff" : "#374151",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                boxShadow: sel ? `0 3px 10px ${accentColor}44` : "none",
                                transform: sel ? "scale(1.05)" : "scale(1)",
                                transition: "all 0.15s",
                              }}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        if (canProceedStep1) setStep(2);
                      }}
                      style={{
                        flex: 1,
                        padding: "13px",
                        background: canProceedStep1
                          ? `linear-gradient(135deg,${accentColor},${accentColor}cc)`
                          : "#e5e7eb",
                        border: "none",
                        borderRadius: 12,
                        color: canProceedStep1 ? "#fff" : "#9ca3af",
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: canProceedStep1 ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        boxShadow: canProceedStep1 ? `0 6px 20px ${accentColor}44` : "none",
                        transition: "all 0.3s",
                      }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Write Review */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg,${accentColor}12,${accentColor}06)`,
                      border: `1.5px solid ${accentColor}22`,
                      borderRadius: 16,
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 13,
                        background: `${accentColor}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        flexShrink: 0,
                      }}
                    >
                      {dish?.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{dish?.name}</div>
                      <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <span
                            key={i}
                            style={{ fontSize: 16, color: i <= overall ? currentMeta.color : "#e5e7eb" }}
                          >
                            ★
                          </span>
                        ))}
                        <span style={{ fontSize: 13, color: currentMeta.color, fontWeight: 700, marginLeft: 6 }}>
                          {currentMeta.emoji} {currentMeta.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        background: "none",
                        border: "none",
                        color: accentColor,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      padding: "22px 24px",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
                      Your Review
                    </div>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>
                      Tell us what you loved — or what we can do better.
                    </p>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value.slice(0, 400))}
                      placeholder={
                        overall >= 4
                          ? `"The ${dish?.name} was absolutely amazing! The flavours were..."`
                          : `"I had the ${dish?.name} and felt that..."`
                      }
                      rows={5}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        background: "#fafafa",
                        border: `1.5px solid ${comment.length >= 5 ? "#22c55e" : "#e5e7eb"}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        color: "#374151",
                        fontSize: 13,
                        lineHeight: 1.7,
                        resize: "none",
                        outline: "none",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      {comment.length >= 5 ? (
                        <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>
                          ✓ Great, ready to submit
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>Write at least 5 characters</span>
                      )}
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{comment.length}/400</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      padding: "20px 22px",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>
                      👤 Your name <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f9fafb",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: 10,
                        padding: "0 12px",
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>✏️</span>
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        style={{
                          flex: 1,
                          border: "none",
                          background: "none",
                          fontSize: 13,
                          color: "#374151",
                          outline: "none",
                          padding: "10px 0",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                      Would you recommend Smart Restaurant?
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        ["👍  Yes, definitely!", true],
                        ["👎  Not really", false],
                      ].map(([label, val]) => (
                        <button
                          key={String(val)}
                          onClick={() => setRecommend(val)}
                          style={{
                            flex: 1,
                            padding: "11px",
                            background: recommend === val ? (val ? "#f0fdf4" : "#fff5f5") : "#f9fafb",
                            border:
                              recommend === val
                                ? val
                                  ? "2px solid #22c55e"
                                  : "2px solid #ef4444"
                                : "2px solid #e5e7eb",
                            borderRadius: 11,
                            fontSize: 13,
                            fontWeight: 700,
                            color: recommend === val ? (val ? "#16a34a" : "#dc2626") : "#6b7280",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.2s",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        padding: "13px 20px",
                        background: "#f3f4f6",
                        border: "none",
                        borderRadius: 12,
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (!canProceedStep2) return;
                        submitFeedback({
                          dishId: dish?.id,
                          dishName: dish?.name,
                          dishEmoji: dish?.emoji,
                          rating: overall,
                          tags: selTags,
                          comment,
                          name,
                          recommend,
                          aspects: aspects_,
                          orderId: dish?.orderId || "",
                        });
                        setStep(3);
                      }}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: canProceedStep2
                          ? `linear-gradient(135deg,${accentColor},${accentColor}cc)`
                          : "#e5e7eb",
                        border: "none",
                        borderRadius: 12,
                        color: canProceedStep2 ? "#fff" : "#9ca3af",
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: canProceedStep2 ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        boxShadow: canProceedStep2 ? `0 6px 20px ${accentColor}44` : "none",
                        transition: "all 0.3s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                      onMouseEnter={e => {
                        if (canProceedStep2) e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      🚀 Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "sticky",
                top: 80,
                alignSelf: "start",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "18px 18px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
                  💡 Writing Tips
                </div>
                {[
                  ["Be specific", "Mention the dish name and what you liked most."],
                  ["Be honest", "Your real experience helps other diners decide."],
                  ["Keep it friendly", "Constructive feedback is always welcome!"],
                ].map(([title, text]) => (
                  <div key={title} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: accentColor,
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{title}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1, lineHeight: 1.5 }}>
                        {text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  borderRadius: 18,
                  padding: "20px 18px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: 14,
                    opacity: 0.8,
                  }}
                >
                  Community
                </div>
                {[
                  [`⭐ ${reviewAverage}`, "Average Rating"],
                  [`${reviewCount}+`, "Reviews This Month"],
                  ["98%", "Would Recommend"],
                ].map(([v, l]) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <span style={{ fontSize: 12, opacity: 0.7 }}>{l}</span>
                    <span style={{ fontSize: 16, fontWeight: 900 }}>{v}</span>
                  </div>
                ))}
              </div>

             <div
  style={{
    background: "#fff",
    borderRadius: 18,
    padding: "16px 18px",
    border: "1px solid rgba(0,0,0,0.05)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  }}
>
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: "#6b7280",
      marginBottom: 10,
    }}
  >
    Recent reviewers
  </div>

  <div style={{ display: "flex", alignItems: "center" }}>
  {["👨🏽", "👩", "🧑", "👩🏽", "👨"].map((a, i) => (
    <div
      key={i}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: `${accentColor}18`,
        border: "2px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        marginLeft: i > 0 ? -8 : 0,
        zIndex: 5 - i,
      }}
    >
      {a}
    </div>
  ))}

  <div
    style={{
      marginLeft: 10,
      alignSelf: "center",
      fontSize: 12,
      color: "#9ca3af",
      fontWeight: 600,
    }}
  >
    +{Math.max(0, allReviews.length - 5)} more
  </div>
</div>
</div>
            </div>
          </div>
        )}
        {/* Browse Reviews tab */}
        {activeTab === "browse" && (
          <div>
            <div
              style={{
                background: `linear-gradient(135deg,${accentColor}14,${accentColor}06)`,
                border: `1.5px solid ${accentColor}28`,
                borderRadius: 22,
                padding: "26px 30px",
                marginBottom: 24,
                display: "flex",
                gap: 36,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: accentColor, lineHeight: 1 }}>
                  {reviewAverage}
                </div>
                <div style={{ display: "flex", gap: 3, justifyContent: "center", margin: "6px 0" }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ color: "#f5a623", fontSize: 18 }}>
                      ★
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{reviewCount} reviews</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                {[
                  [5, 78],
                  [4, 14],
                  [3, 5],
                  [2, 2],
                  [1, 1],
                ].map(([s, p]) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#6b7280", width: 10 }}>{s}</span>
                    <span style={{ color: "#f5a623", fontSize: 12 }}>★</span>
                    <div style={{ flex: 1, height: 7, background: "#f3f4f6", borderRadius: 5, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${p}%`,
                          background: `linear-gradient(90deg,${accentColor},${accentColor}cc)`,
                          borderRadius: 5,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: "#9ca3af", width: 28, textAlign: "right" }}>{p}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["🍽️", "Food", "4.9"],
                  ["⚡", "Speed", "4.7"],
                  ["😊", "Staff", "4.8"],
                  ["💰", "Value", "4.6"],
                ].map(([icon, label, score]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af", width: 44 }}>{label}</span>
                    <div style={{ width: 60, height: 5, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(parseFloat(score) / 5) * 100}%`,
                          background: `linear-gradient(90deg,${accentColor},${accentColor}cc)`,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: accentColor }}>{score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {allReviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "20px 22px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 10px 28px ${accentColor}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                  }}
                >
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: `${accentColor}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {r.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.time}</div>
                    </div>
                    <div style={{ display: "flex", gap: 2, alignSelf: "flex-start" }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ color: s <= r.stars ? "#f5a623" : "#e5e7eb", fontSize: 13 }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 8,
                      background: `${accentColor}10`,
                      color: accentColor,
                      fontSize: 10,
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    🍽 {r.dish}
                  </div>
                  <p style={{ margin: "0 0 14px", fontSize: 13, color: "#4b5563", lineHeight: 1.65 }}>
                    {r.comment}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      onClick={() => setHelpfulMap(p => ({ ...p, [i]: !p[i] }))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 20,
                        background: helpfulMap[i] ? `${accentColor}12` : "#f9fafb",
                        border: helpfulMap[i] ? `1px solid ${accentColor}33` : "1px solid #e5e7eb",
                        color: helpfulMap[i] ? accentColor : "#9ca3af",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                    >
                      👍 {r.helpful + (helpfulMap[i] ? 1 : 0)}
                    </button>
                    <span style={{ fontSize: 10, color: "#d1d5db", fontWeight: 600 }}>✓ Verified</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 26 }}>
              <button
                onClick={() => setActiveTab("write")}
                style={{
                  padding: "12px 30px",
                  background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  border: "none",
                  borderRadius: 13,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: `0 6px 20px ${accentColor}44`,
                }}
              >
                ✏️ Write Your Review
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default FeedbackPage;