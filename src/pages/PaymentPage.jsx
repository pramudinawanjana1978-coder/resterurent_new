import { useEffect, useState } from 'react';

let payHereScriptPromise = null;
const loadPayHereScript = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window is not available'));
  if (payHereScriptPromise) return payHereScriptPromise;

  payHereScriptPromise = new Promise((resolve, reject) => {
    if (window.payhere) {
      resolve(window.payhere);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    script.onload = () => {
      if (window.payhere) resolve(window.payhere);
      else reject(new Error('PayHere SDK loaded but window.payhere is missing'));
    };
    script.onerror = () => reject(new Error('Failed to load PayHere SDK'));
    document.body.appendChild(script);
  });

  return payHereScriptPromise;
};

// ─── PAYMENT PAGE ─────────────────────────────────────────────────────────────

function PaymentPage({ total, items, orderSummary = null, accentColor, onBack, onHome, onTrack }) {
  const [method, setMethod]       = useState("card");        // card | wallet | cash
  const [cardNum, setCardNum]     = useState("");
  const [cardName, setCardName]   = useState("");
  const [expiry, setExpiry]       = useState("");
  const [cvv, setCvv]             = useState("");
  const [cvvVisible, setCvvVisible] = useState(false);
  const [walletPin, setWalletPin] = useState(["","","","","",""]);
  const [stage, setStage]         = useState("form");        // form | processing | success
  const [progress, setProgress]   = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [payhereReady, setPayhereReady] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [orderMeta, setOrderMeta] = useState(null);
  const [savedCards]              = useState([
    { last4:"4242", brand:"VISA",       color:"linear-gradient(135deg,#1a1a2e,#0f3460)", icon:"💳" },
    { last4:"1234", brand:"MasterCard", color:"linear-gradient(135deg,#c62828,#b71c1c)", icon:"🔴" },
  ]);
  const [useSaved, setUseSaved]   = useState(null);

  const formatCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExp  = v => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const displayNum = cardNum || "•••• •••• •••• ••••";
  const displayExp = expiry  || "MM/YY";
  const displayName= cardName|| "YOUR NAME";

  const { subtotal = 0, serviceCharge = 0, tipAmt = 0 } = orderSummary || {};
  const paymentMethods = [
    { id:"card",   icon:"💳", label:"Credit / Debit Card" },
    { id:"cash",   icon:"💵", label:"Cash "    },
  ];

  useEffect(() => {
    loadPayHereScript()
      .then(() => setPayhereReady(true))
      .catch((err) => {
        console.error(err);
        setPaymentError('Unable to load PayHere. Please refresh the page.');
      });
  }, []);

  const handlePay = async () => {
    setPaymentError("");
    if (method === "cash") {
      setStage('success');
      return;
    }

    if (!payhereReady) {
      setPaymentError('Payment gateway is still loading. Please wait a moment.');
      return;
    }

    const payhere = window.payhere;
    if (!payhere) {
      setPaymentError('PayHere SDK is unavailable.');
      return;
    }

    setStage("processing");

    const payment = {
      sandbox: true,
      merchant_id: '1212345',
      return_url: 'https://example.com/return',
      cancel_url: 'https://example.com/cancel',
      notify_url: 'https://example.com/notify',
      order_id: `ORDER_${Date.now()}`,
      items: 'Smart Restaurant Order',
      currency: 'LKR',
      amount: total,
      first_name: 'pramudi',
      last_name: 'nawanjana',
      email: 'pramudinawanjana@gmail.com',
      phone: '0785995735',
      address: 'No 5, Galle Road',
      city: 'Colombo',
      country: 'Sri Lanka',
      delivery_address: 'No 5, Galle Road',
      delivery_city: 'Colombo',
      delivery_country: 'Sri Lanka',
      custom_1: 'SmartRestaurant',
      custom_2: 'Sandbox Test',
      onCompleted: function onCompleted(orderId) {
        console.log('Payment completed for order', orderId);
        const meta = { id: `SR${String(orderId || Date.now()).slice(-8)}`, ts: Date.now() };
        setOrderMeta(meta);
        setStage('success');
      },
      onDismissed: function onDismissed() {
        console.log('PayHere popup was closed by the user');
        setPaymentError('Payment was cancelled. Please try again.');
        setStage('form');
      },
      onError: function onError(error) {
        console.error('PayHere payment error', error);
        setPaymentError('Payment failed. Please try again.');
        setStage('form');
      }
    };

    try {
      payhere.startPayment(payment);
    } catch (error) {
      console.error(error);
      setPaymentError('Unable to start PayHere payment.');
      setStage('form');
    }
  };

  // Cash flow: generate order meta immediately when confirming cash
  const confirmCashOrder = () => {
    const meta = { id: `SR${Date.now().toString().slice(-8)}`, ts: Date.now() };
    setOrderMeta(meta);
    setStage('success');
  };

  const canPay =
    method === "cash" ? true :
    method === "wallet" ? walletPin.every(d => d !== "") :
    (useSaved !== null || (cardNum.replace(/\s/g,"").length === 16 && cardName && expiry.length === 5 && cvv.length === 3));

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (stage === "success") return (
    <div style={{
      minHeight:"100vh", fontFamily:"'Trebuchet MS',sans-serif",
      background:"linear-gradient(135deg,#0d0d1a 0%,#111827 50%,#0d1f33 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden",
    }}>
      {/* Confetti dots */}
      {[...Array(22)].map((_,i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          width: 6+Math.random()*10, height: 6+Math.random()*10,
          borderRadius: Math.random()>0.5 ? "50%" : "2px",
          background:[accentColor,"#22c55e","#3b82f6","#f59e0b","#ec4899","#a78bfa"][i%6],
          opacity:0.7,
          animation:`confettiFall ${1.5+Math.random()*2}s ease ${Math.random()*1.5}s infinite`,
        }}/>
      ))}
      <div style={{
        position:"relative", zIndex:2, textAlign:"center",
        background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)",
        border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:32, padding:"52px 48px", maxWidth:480, width:"90%",
        boxShadow:"0 32px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Animated checkmark ring */}
        <div style={{
          width:100, height:100, borderRadius:"50%", margin:"0 auto 24px",
          background:`linear-gradient(135deg,${accentColor},${accentColor}88)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:48, boxShadow:`0 0 0 16px ${accentColor}18, 0 0 0 32px ${accentColor}08`,
          animation:"successPop 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}>✓</div>

        <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.5px" }}>
          Payment Successful!
        </h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, margin:"0 0 28px", lineHeight:1.6 }}>
          Your order has been confirmed and the kitchen is already working on your meal.
        </p>

        {/* Amount badge */}
        <div style={{
          background:`linear-gradient(135deg,${accentColor}22,${accentColor}0a)`,
          border:`1px solid ${accentColor}33`, borderRadius:16, padding:"16px 24px", marginBottom:24,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Amount Paid</span>
          <span style={{ fontSize:24, fontWeight:900, color:accentColor }}>Rs. {total.toLocaleString()}</span>
        </div>

        {/* Order details */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28 }}>
            {[
            ["Order ID", orderMeta ? orderMeta.id : `SR${(Math.floor(Math.random()*90000)+10000)}`],
            ["Method", method === "card" ? "Card ****"+( useSaved ? savedCards[useSaved].last4 : cardNum.replace(/\s/g,"").slice(-4)||"••••") : method==="wallet"?"Digital Wallet":"Cash"],
            ["Items", items.reduce((s,i)=>s+i.qty,0)+" dishes"],
            ["Placed", orderMeta ? new Date(orderMeta.ts).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString()],
          ].map(([k,v])=>(
            <div key={k} style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"12px 14px", textAlign:"left" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:600, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.5px" }}>{k}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onHome} style={{
            flex:1, padding:"13px",
            background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:13, color:"rgba(255,255,255,0.7)", fontWeight:600, fontSize:13,
            cursor:"pointer", fontFamily:"inherit",
          }}>🏠 Home</button>
          <button onClick={() => onTrack ? onTrack(method, items, orderMeta, { subtotal, serviceCharge, tipAmt, total }) : onHome()} style={{
            flex:2, padding:"13px",
            background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
            border:"none", borderRadius:13, color:"#fff", fontWeight:800, fontSize:14,
            cursor:"pointer", fontFamily:"inherit", boxShadow:`0 6px 20px ${accentColor}55`,
          }}>📍 Track Order</button>
        </div>
      </div>
      <style>{`
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(40px) rotate(180deg); opacity:0} }
        @keyframes successPop   { 0%{transform:scale(0) rotate(-20deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
      `}</style>
    </div>
  );

  // ── PROCESSING ────────────────────────────────────────────────────────────────
  if (stage === "processing") return (
    <div style={{
      minHeight:"100vh", background:"linear-gradient(135deg,#0d0d1a,#111827,#0d1f33)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Trebuchet MS',sans-serif",
    }}>
      <div style={{ textAlign:"center", color:"#fff", maxWidth:400, padding:32 }}>
        {/* Pulsing ring loader */}
        <div style={{ position:"relative", width:120, height:120, margin:"0 auto 28px" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%",
            border:`3px solid ${accentColor}22`,
          }}/>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%",
            border:`3px solid transparent`,
            borderTopColor:accentColor,
            animation:"spin 0.9s linear infinite",
          }}/>
          <div style={{
            position:"absolute", inset:12, borderRadius:"50%",
            border:`2px solid ${accentColor}44`,
            animation:"spin 1.4s linear infinite reverse",
          }}/>
          <div style={{
            position:"absolute", inset:0, display:"flex",
            alignItems:"center", justifyContent:"center", fontSize:36,
          }}>💳</div>
        </div>
        <h2 style={{ fontSize:22, fontWeight:900, margin:"0 0 8px" }}>Processing Payment…</h2>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, margin:"0 0 28px" }}>Please don't close this window.</p>
        {/* Progress bar */}
        <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden", marginBottom:12 }}>
          <div style={{
            height:"100%", background:`linear-gradient(90deg,${accentColor},${accentColor}88)`,
            borderRadius:10, transition:"width 0.2s ease",
            width:`${progress}%`,
            boxShadow:`0 0 12px ${accentColor}88`,
          }}/>
        </div>
        <div style={{ fontSize:13, color:accentColor, fontWeight:700 }}>{Math.floor(progress)}%</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:20 }}>🔒 256-bit SSL encrypted</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── FORM ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#0d0d1a 0%,#111827 60%,#0d1f33 100%)",
      fontFamily:"'Trebuchet MS',sans-serif", color:"#fff",
    }}>

      {/* Top bar */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(13,13,26,0.95)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        padding:"0 36px", height:64,
        display:"flex", alignItems:"center", gap:16,
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:7,
          background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:10, padding:"8px 16px", color:"rgba(255,255,255,0.7)",
          cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          transition:"background 0.2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
        >← Cart</button>

        {/* Step breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8 }}>
          {["Cart","Payment","Confirmation"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, fontWeight:700, color: i===1 ? accentColor : "rgba(255,255,255,0.3)" }}>{s}</span>
              {i<2 && <span style={{ color:"rgba(255,255,255,0.2)", fontSize:11 }}>›</span>}
            </div>
          ))}
        </div>

        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>🔒 Secure Payment</span>
        </div>
      </div>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"36px 36px 60px", display:"grid", gridTemplateColumns:"1fr 360px", gap:28 }}>

        {/* ── LEFT: Payment form ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Header */}
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:`${accentColor}bb`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:8 }}>Secure Checkout</div>
            <h1 style={{ margin:"0 0 4px", fontSize:28, fontWeight:900, letterSpacing:"-0.5px" }}>Complete Your Payment</h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.4)", fontSize:13 }}>Choose how you'd like to pay</p>
          </div>

          {/* Payment method selector */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {paymentMethods.map(m => (
              <button key={m.id} onClick={()=>{setMethod(m.id);setUseSaved(null);}} style={{
                padding:"16px 10px", borderRadius:16,
                background: method===m.id ? `linear-gradient(135deg,${accentColor}28,${accentColor}10)` : "rgba(255,255,255,0.04)",
                border: method===m.id ? `2px solid ${accentColor}` : "2px solid rgba(255,255,255,0.07)",
                color: method===m.id ? "#fff" : "rgba(255,255,255,0.45)",
                cursor:"pointer", fontFamily:"inherit",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                boxShadow: method===m.id ? `0 0 0 4px ${accentColor}18` : "none",
                transition:"all 0.22s",
              }}>
                <span style={{ fontSize:26 }}>{m.icon}</span>
                <span style={{ fontSize:12, fontWeight:700 }}>{m.label}</span>
              </button>
            ))}
          </div>

          {/* ── CARD METHOD ── */}
          {method === "card" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Saved cards */}
              <div style={{ display:"flex", gap:10 }}>
                {savedCards.map((c,i) => (
                  <div key={i} onClick={()=>setUseSaved(useSaved===i?null:i)} style={{
                    flex:1, padding:"14px 16px", borderRadius:14, cursor:"pointer",
                    background: useSaved===i ? c.color : "rgba(255,255,255,0.04)",
                    border: useSaved===i ? `2px solid ${accentColor}` : "2px solid rgba(255,255,255,0.07)",
                    boxShadow: useSaved===i ? `0 0 0 4px ${accentColor}18` : "none",
                    transition:"all 0.22s",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <span style={{ fontSize:22 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color: useSaved===i ? "#fff" : "rgba(255,255,255,0.6)" }}>{c.brand}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>•••• {c.last4}</div>
                    </div>
                    {useSaved===i && <span style={{ marginLeft:"auto", fontSize:16, color:accentColor }}>✓</span>}
                  </div>
                ))}
                <div onClick={()=>setUseSaved(null)} style={{
                  padding:"14px", borderRadius:14, cursor:"pointer",
                  background: useSaved===null ? `${accentColor}15` : "rgba(255,255,255,0.03)",
                  border: useSaved===null ? `2px solid ${accentColor}55` : "2px solid rgba(255,255,255,0.07)",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  gap:4, minWidth:70, transition:"all 0.22s",
                }}>
                  <span style={{ fontSize:20 }}>➕</span>
                  <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.4)" }}>New</span>
                </div>
              </div>

              {/* Flip card */}
              <div
                style={{ perspective:1000, height:200, cursor:"pointer" }}
                onClick={()=>setFlipped(f=>!f)}
              >
                <div style={{
                  position:"relative", width:"100%", height:"100%",
                  transformStyle:"preserve-3d",
                  transition:"transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
                }}>
                  {/* Front */}
                  <div style={{
                    position:"absolute", inset:0, backfaceVisibility:"hidden",
                    background: useSaved!==null ? savedCards[useSaved].color : "linear-gradient(135deg,#1a1a2e,#0f3460)",
                    borderRadius:20, padding:"28px 28px",
                    boxShadow:"0 20px 60px rgba(0,0,0,0.5)",
                    border:"1px solid rgba(255,255,255,0.1)",
                    overflow:"hidden",
                  }}>
                    {/* Shimmer circles */}
                    <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>
                    <div style={{ position:"absolute", bottom:-30, left:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }}/>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24 }}>
                      <span style={{ fontSize:26 }}>💳</span>
                      <span style={{ fontSize:22, fontWeight:900, color:"rgba(255,255,255,0.9)", letterSpacing:"1px" }}>
                        {useSaved!==null ? savedCards[useSaved].brand : "SMART PAY"}
                      </span>
                    </div>
                    {/* Chip */}
                    <div style={{ width:44, height:32, borderRadius:6, background:"linear-gradient(135deg,#d4a017,#f5c842)", marginBottom:20, boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.2)" }}/>
                    <div style={{ fontSize:18, fontWeight:700, letterSpacing:"3px", marginBottom:16, fontVariantNumeric:"tabular-nums" }}>
                      {useSaved!==null ? `•••• •••• •••• ${savedCards[useSaved].last4}` : displayNum}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:"1px", marginBottom:2 }}>CARD HOLDER</div>
                        <div style={{ fontSize:13, fontWeight:700, letterSpacing:"0.5px" }}>{useSaved!==null ? "Saved Card" : displayName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:"1px", marginBottom:2 }}>EXPIRES</div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{useSaved!==null ? "••/••" : displayExp}</div>
                      </div>
                    </div>
                    <div style={{ position:"absolute", bottom:12, right:16, fontSize:10, color:"rgba(255,255,255,0.2)" }}>Click to flip</div>
                  </div>
                  {/* Back */}
                  <div style={{
                    position:"absolute", inset:0, backfaceVisibility:"hidden",
                    transform:"rotateY(180deg)",
                    background:"linear-gradient(135deg,#111827,#1f2937)",
                    borderRadius:20, overflow:"hidden",
                    boxShadow:"0 20px 60px rgba(0,0,0,0.5)",
                    border:"1px solid rgba(255,255,255,0.08)",
                  }}>
                    <div style={{ height:44, background:"#111", margin:"28px 0 20px" }}/>
                    <div style={{ padding:"0 24px" }}>
                      <div style={{ height:36, background:"rgba(255,255,255,0.08)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:14 }}>
                        <span style={{ fontSize:14, fontWeight:700, letterSpacing:"2px", color:cvv||"rgba(255,255,255,0.3)" }}>
                          {cvv ? "•".repeat(cvv.length) : "CVV"}
                        </span>
                      </div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", marginTop:8, textAlign:"right" }}>3-digit code on back of card</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input fields */}
              {useSaved === null && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {/* Card number */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.8px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Card Number</label>
                    <div style={{ position:"relative" }}>
                      <input value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))}
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        style={{
                          width:"100%", boxSizing:"border-box",
                          background:"rgba(255,255,255,0.06)", border:`1.5px solid ${cardNum.replace(/\s/g,"").length===16?"#22c55e":"rgba(255,255,255,0.1)"}`,
                          borderRadius:12, padding:"13px 48px 13px 16px", color:"#fff",
                          fontSize:15, outline:"none", fontFamily:"'Courier New',monospace", letterSpacing:"2px",
                          transition:"border-color 0.2s",
                        }}/>
                      <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>
                        {cardNum.startsWith("4")?"💳":cardNum.startsWith("5")?"🔴":"💳"}
                      </span>
                    </div>
                  </div>
                  {/* Name */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.8px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Cardholder Name</label>
                    <input value={cardName} onChange={e=>setCardName(e.target.value.toUpperCase())}
                      placeholder="e.g. KASUN PERERA"
                      style={{
                        width:"100%", boxSizing:"border-box",
                        background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.1)",
                        borderRadius:12, padding:"13px 16px", color:"#fff",
                        fontSize:14, outline:"none", fontFamily:"inherit", letterSpacing:"1px",
                      }}/>
                  </div>
                  {/* Expiry + CVV */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:110 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.8px", textTransform:"uppercase", display:"block", marginBottom:6 }}>Expiry</label>
                      <input value={expiry} onChange={e=>setExpiry(formatExp(e.target.value))}
                        placeholder="MM/YY" maxLength={5}
                        style={{
                          width:"100%", boxSizing:"border-box",
                          background:"rgba(255,255,255,0.06)", border:`1.5px solid ${expiry.length===5?"#22c55e":"rgba(255,255,255,0.1)"}`,
                          borderRadius:12, padding:"13px 16px", color:"#fff",
                          fontSize:14, outline:"none", fontFamily:"'Courier New',monospace", letterSpacing:"2px",
                          transition:"border-color 0.2s",
                        }}
                        onFocus={()=>setFlipped(false)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.8px", textTransform:"uppercase", display:"block", marginBottom:6 }}>CVV</label>
                      <div style={{ position:"relative" }}>
                        <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,3))}
                          type={cvvVisible?"text":"password"} placeholder="•••" maxLength={3}
                          style={{
                            width:"100%", boxSizing:"border-box",
                            background:"rgba(255,255,255,0.06)", border:`1.5px solid ${cvv.length===3?"#22c55e":"rgba(255,255,255,0.1)"}`,
                            borderRadius:12, padding:"13px 44px 13px 16px", color:"#fff",
                            fontSize:14, outline:"none", fontFamily:"'Courier New',monospace", letterSpacing:"4px",
                            transition:"border-color 0.2s",
                          }}
                          onFocus={()=>setFlipped(true)}
                          onBlur={()=>setFlipped(false)}
                        />
                        <button onClick={()=>setCvvVisible(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, opacity:0.5 }}>
                          {cvvVisible?"🙈":"👁"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          

          {/* ── CASH METHOD ── */}
          {method === "cash" && (
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:20, padding:"36px 32px", border:"1px solid rgba(255,255,255,0.08)", textAlign:"center" }}>
              <div style={{ fontSize:60, marginBottom:16 }}>💵</div>
              <div style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>Cash </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.7, margin:"0 0 20px" }}>
                Pay when your order arrives at your table. Please have the exact amount ready.
              </p>
              <div style={{
                background:`${accentColor}18`, border:`1px solid ${accentColor}33`,
                borderRadius:14, padding:"16px 20px",
                fontSize:22, fontWeight:900, color:accentColor,
              }}>
                Rs. {total.toLocaleString()}
              </div>
            </div>
          )}

          {/* Pay button */}
          <button onClick={handlePay} disabled={!canPay} style={{
            width:"100%", padding:"16px",
            background: canPay ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "rgba(255,255,255,0.08)",
            border:"none", borderRadius:16, color: canPay ? "#fff" : "rgba(255,255,255,0.3)",
            fontWeight:900, fontSize:16, cursor: canPay ? "pointer" : "not-allowed",
            fontFamily:"inherit",
            boxShadow: canPay ? `0 8px 32px ${accentColor}55` : "none",
            transition:"all 0.3s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10, letterSpacing:"0.3px",
          }}
            onMouseEnter={e=>{ if(canPay){e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow=`0 12px 40px ${accentColor}66`;}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=canPay?`0 8px 32px ${accentColor}55`:"none";}}
          >
            🔒 {method==="cash"?"Confirm Order":"Pay"} · Rs. {total.toLocaleString()}
          </button>

          {paymentError && (
            <div style={{ marginTop:12, textAlign:"center", color:"#f8b4b4", fontSize:13 }}>
              ⚠️ {paymentError}
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
            {["🔒 SSL Encrypted","🛡 Fraud Protected","✅ PCI Compliant"].map(b=>(
              <span key={b} style={{ fontSize:11, color:"rgba(255,255,255,0.25)", fontWeight:600 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Order summary ── */}
        <div style={{ position:"sticky", top:80, alignSelf:"start", display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{
            background:"rgba(255,255,255,0.04)", backdropFilter:"blur(12px)",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:22, overflow:"hidden",
          }}>
            {/* Header */}
            <div style={{
              background:`linear-gradient(135deg,${accentColor}44,${accentColor}22)`,
              padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize:10, fontWeight:700, color:`${accentColor}cc`, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>Your Order</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>{items.reduce((s,i)=>s+i.qty,0)} items · Rs. {total.toLocaleString()}</div>
            </div>
            <div style={{ padding:"16px 20px" }}>
              {items.map((item,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:12, borderBottom: i<items.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`${accentColor}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{item.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>×{item.qty}</div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>Rs. {(item.price*item.qty).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14, marginTop:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>Total</span>
                  <span style={{ fontSize:22, fontWeight:900, color:accentColor }}>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why secure */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"16px 18px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.8px" }}>Why it's safe</div>
            {[["🔒","Bank-level encryption"],["🛡","Real-time fraud detection"],["✅","Your data is never stored"],["↩️","Easy refunds within 24hrs"]].map(([icon,text])=>(
              <div key={text} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                <span style={{ fontSize:14, marginTop:1 }}>{icon}</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export { PaymentPage };
