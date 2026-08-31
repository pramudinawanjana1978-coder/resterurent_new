import { useState } from 'react';

// ─── MENU PAGE ─────────────────────────────────────────────────────────────────

const menuData = {
  "Fast Food": {
    icon:"🍔", color:"#f97316", bg:"linear-gradient(135deg,#fff7ed,#fed7aa)",
    tagline:"Quick bites, bold flavours",
    items:[
      {id:"ff1", name:"Classic Smash Burger",    image: "/images/specialmenu/cheesburger.jpg",  emoji:"🍔", price:2450, rating:4.8, time:"12 min", tags:["Bestseller","Juicy"],   desc:"Double smash patty, American cheese, special sauce, brioche bun", cal:680, spicy:false },
      {id:"ff2", name:"Crispy Chicken Burger",   image: "/images/specialmenu/beefburgerbun.jpg",emoji:"🍗", price:2100, rating:4.7, time:"10 min", tags:["Crispy","Popular"],    desc:"Buttermilk fried chicken, coleslaw, pickles, sriracha mayo",       cal:590, spicy:false },
      {id:"ff3", name:"Loaded Cheese Fries",     image: "/images/specialmenu/loadedchees.jpg",emoji:"🍟", price:1200, rating:4.6, time:"8 min",  tags:["Cheesy","Snack"],     desc:"Crispy fries smothered in nacho cheese, jalapeños & bacon bits",    cal:520, spicy:true  },
      {id:"ff4", name:"BBQ Bacon Stack",         image: "/images/specialmenu/piese.jpg",emoji:"🥓", price:2800, rating:4.9, time:"14 min", tags:["#1 Pick","Smoky"],    desc:"Triple stack, crispy bacon, BBQ sauce, caramelised onion",          cal:820, spicy:false },
      {id:"ff5", name:"Fish & Chips",            image: "/images/specialmenu/fishchip.jpg",emoji:"🐟", price:1950, rating:4.5, time:"15 min", tags:["Classic"],           desc:"Beer-battered fish fillet, thick-cut chips, tartare sauce",          cal:640, spicy:false },
      {id:"ff6", name:"Hot Dog Deluxe",          image: "/images/specialmenu/beefburgerbun.jpg",emoji:"🌭", price:1450, rating:4.4, time:"7 min",  tags:["Quick","Fun"],       desc:"Beef frank, caramelised onions, mustard, ketchup, relish",           cal:480, spicy:false },
      {id:"ff7", name:"Chilli Cheese Dog",       image: "/images/specialmenu/beefburgerbun.jpg",emoji:"🌶️", price:1650, rating:4.6, time:"9 min",  tags:["Spicy","Hot"],       desc:"Beef frank, house chilli, melted cheddar, diced onion",             cal:540, spicy:true  },
      {id:"ff8", name:"Onion Rings Basket",      image: "/images/specialmenu/onianring.jpg",emoji:"🧅", price:980,  rating:4.3, time:"8 min",  tags:["Snack","Crispy"],    desc:"Golden beer-battered onion rings with smoky dipping sauce",         cal:390, spicy:false },
    ],
  },
  "Appetizers": {
    icon:"🥗", color:"#16a34a", bg:"linear-gradient(135deg,#f0fdf4,#bbf7d0)",
    tagline:"Start your meal in style",
    items:[
      {id:"ap1", name:"Bruschetta al Pomodoro",   image: "/images/specialmenu/onianring.jpg",emoji:"🍅", price:1350, rating:4.7, time:"8 min",  tags:["Italian","Fresh"],   desc:"Grilled sourdough, heritage tomatoes, fresh basil, aged balsamic",  cal:280, spicy:false },
      {id:"ap2", name:"Crispy Calamari",         image: "/images/specialmenu/onianring.jpg",emoji:"🦑", price:1800, rating:4.8, time:"12 min", tags:["Seafood","Crispy"],  desc:"Lightly floured squid rings, aioli, lemon wedge, mixed herbs",      cal:340, spicy:false },
      {id:"ap3", name:"Mezze Platter",          image: "/images/specialmenu/onianring.jpg", emoji:"🫙", price:2200, rating:4.9, time:"10 min", tags:["Sharing","Popular"], desc:"Hummus, tzatziki, baba ganoush, pita, olives, falafel",              cal:520, spicy:false },
      {id:"ap4", name:"Prawn Cocktail",          image: "/images/specialmenu/onianring.jpg",emoji:"🦐", price:2100, rating:4.6, time:"6 min",  tags:["Classic","Elegant"], desc:"Tiger prawns, Marie Rose sauce, iceberg, lemon, paprika",            cal:210, spicy:false },
      {id:"ap5", name:"Spring Roll Basket",      image: "/images/specialmenu/onianring.jpg",emoji:"🥢", price:1250, rating:4.5, time:"10 min", tags:["Asian","Crispy"],    desc:"Crispy vegetable spring rolls, sweet chilli sauce",                  cal:310, spicy:false },
      {id:"ap6", name:"Chicken Satay Skewers",   image: "/images/specialmenu/onianring.jpg",emoji:"🍢", price:1600, rating:4.7, time:"14 min", tags:["Grilled","Peanut"],  desc:"Marinated chicken skewers, peanut sauce, pickled cucumber",         cal:380, spicy:false },
      {id:"ap7", name:"Loaded Nachos",           image: "/images/specialmenu/onianring.jpg",emoji:"🧀", price:1900, rating:4.8, time:"10 min", tags:["Sharing","Cheesy"],  desc:"Tortilla chips, pico de gallo, guac, sour cream, jalapeños",        cal:610, spicy:true  },
      {id:"ap8", name:"Soup of the Day",         image: "/images/specialmenu/onianring.jpg",emoji:"🍲", price:980,  rating:4.5, time:"8 min",  tags:["Warm","Seasonal"],   desc:"Chef's daily soup, crusty bread, butter, fresh herbs",              cal:240, spicy:false },
    ],
  },
  "Vegetarian": {
    icon:"🌿", color:"#15803d", bg:"linear-gradient(135deg,#f0fdf4,#d1fae5)",
    tagline:"Fresh, vibrant & plant-powered",
    items:[
      {id:"vg1", name:"Mushroom Risotto",       image: "/images/specialmenu/onianring.jpg", emoji:"🍄", price:2350, rating:4.9, time:"20 min", tags:["Creamy","Gourmet"],  desc:"Arborio rice, wild mushrooms, truffle oil, parmesan, white wine",   cal:480, spicy:false },
      {id:"vg2", name:"Paneer Tikka Masala",     image: "/images/specialmenu/onianring.jpg",emoji:"🧀", price:2100, rating:4.8, time:"18 min", tags:["Spicy","Indian"],    desc:"Tandoor-grilled paneer in rich tomato-cream masala, naan",          cal:520, spicy:true  },
      {id:"vg3", name:"Buddha Grain Bowl",       image: "/images/specialmenu/onianring.jpg",emoji:"🥗", price:1950, rating:4.7, time:"12 min", tags:["Healthy","Power"],   desc:"Quinoa, roasted veg, avocado, tahini, pickled cabbage, seeds",      cal:420, spicy:false },
      {id:"vg4", name:"Margherita Pizza",        image: "/images/specialmenu/onianring.jpg",emoji:"🍕", price:2200, rating:4.8, time:"16 min", tags:["Italian","Classic"], desc:"San Marzano tomato, fior di latte, fresh basil, EVOO, sea salt",    cal:580, spicy:false },
      {id:"vg5", name:"Falafel Wrap",            image: "/images/specialmenu/onianring.jpg",emoji:"🌯", price:1450, rating:4.6, time:"10 min", tags:["Vegan","Fresh"],     desc:"Crispy falafel, hummus, tabbouleh, pickles in lavash bread",        cal:380, spicy:false },
      {id:"vg6", name:"Caprese Tower",           image: "/images/specialmenu/onianring.jpg",emoji:"🍅", price:1650, rating:4.7, time:"8 min",  tags:["Italian","Light"],   desc:"Heirloom tomato, burrata, basil oil, aged balsamic, pine nuts",     cal:290, spicy:false },
      {id:"vg7", name:"Stuffed Bell Peppers",    image: "/images/specialmenu/onianring.jpg",emoji:"🫑", price:1800, rating:4.5, time:"22 min", tags:["Wholesome","Baked"], desc:"Roasted peppers filled with herbed rice, feta, sun-dried tomato",   cal:360, spicy:false },
      {id:"vg8", name:"Veggie Sushi Platter",    image: "/images/specialmenu/onianring.jpg",emoji:"🍣", price:2400, rating:4.8, time:"15 min", tags:["Japanese","Fresh"],  desc:"Avocado maki, cucumber roll, edamame, ginger, wasabi, soy",         cal:350, spicy:false },
    ],
  },
  "Chef's Specials": {
    icon:"👨‍🍳", color:"#7c3aed", bg:"linear-gradient(135deg,#faf5ff,#e9d5ff)",
    tagline:"Signature creations by Chef Lakmal",
    items:[
      {id:"cs1", name:"Lobster Thermidor",      image: "/images/specialmenu/onianring.jpg", emoji:"🦞", price:7100, rating:5.0, time:"35 min", tags:["Luxury","Signature"],desc:"Whole lobster, cognac cream, gruyère gratin, micro herbs",           cal:620, spicy:false },
      {id:"cs2", name:"Beef Wellington",        image: "/images/specialmenu/onianring.jpg", emoji:"🥩", price:6200, rating:4.9, time:"40 min", tags:["Classic","Premium"], desc:"Beef tenderloin, duxelles, prosciutto, puff pastry, truffle jus",   cal:780, spicy:false },
      {id:"cs3", name:"Seared Foie Gras",        image: "/images/specialmenu/onianring.jpg",emoji:"🍳", price:4800, rating:4.8, time:"20 min", tags:["French","Delicate"], desc:"Pan-seared duck liver, brioche toast, port reduction, berry compote",cal:410, spicy:false },
      {id:"cs4", name:"Black Truffle Pasta",     image: "/images/specialmenu/onianring.jpg",emoji:"🍝", price:4200, rating:4.9, time:"25 min", tags:["Truffle","Luxurious"],desc:"Fresh tagliatelle, black truffle, parmesan cream, chives",          cal:560, spicy:false },
      {id:"cs5", name:"Wagyu Ribeye 200g",       image: "/images/specialmenu/onianring.jpg",emoji:"🥩", price:8500, rating:5.0, time:"20 min", tags:["Wagyu","Premium"],   desc:"A5 wagyu, bone marrow butter, potato gratin, red wine jus",         cal:860, spicy:false },
      {id:"cs6", name:"Bouillabaisse",           image: "/images/specialmenu/onianring.jpg",emoji:"🍲", price:5100, rating:4.8, time:"30 min", tags:["French","Seafood"],  desc:"Provençal seafood stew, rouille, gruyère croutons",                 cal:480, spicy:false },
      {id:"cs7", name:"Duck à l'Orange",         image: "/images/specialmenu/onianring.jpg",emoji:"🦆", price:4600, rating:4.7, time:"35 min", tags:["French","Classic"],  desc:"Slow-roasted duck breast, orange-cognac sauce, pommes dauphine",    cal:640, spicy:false },
      {id:"cs8", name:"Chocolate Soufflé",       image: "/images/specialmenu/onianring.jpg",emoji:"🍫", price:2800, rating:4.9, time:"25 min", tags:["Dessert","Drama"],   desc:"Made to order dark chocolate soufflé, vanilla crème anglaise",     cal:380, spicy:false },
    ],
  },
  "Popular Items": {
    icon:"⭐", color:"#d97706", bg:"linear-gradient(135deg,#fffbeb,#fde68a)",
    tagline:"Customer favourites you can't miss",
    items:[
      {id:"pi1", name:"Blueberry Pancakes",      image: "/images/specialmenu/onianring.jpg",emoji:"🥞", price:1850, rating:4.9, time:"12 min", tags:["#1 Rated","Breakfast"],desc:"Fluffy stacks, fresh blueberries, Vermont maple syrup, butter",    cal:520, spicy:false },
      {id:"pi2", name:"Grilled Ribeye 300g",     image: "/images/specialmenu/onianring.jpg",emoji:"🥩", price:4800, rating:4.9, time:"20 min", tags:["Top Seller","Dinner"],desc:"Prime ribeye, chimichurri, truffle fries, roasted tomato",           cal:780, spicy:false },
      {id:"pi3", name:"Mango Bubble Tea",        image: "/images/specialmenu/onianring.jpg",emoji:"🧋", price:940,  rating:4.8, time:"5 min",  tags:["Trending","Drink"],  desc:"Fresh mango, premium milk tea, chewy tapioca pearls",               cal:310, spicy:false },
      {id:"pi4", name:"Chocolate Fondant",       image: "/images/specialmenu/onianring.jpg",emoji:"🍫", price:1450, rating:4.9, time:"18 min", tags:["Must Try","Dessert"], desc:"Warm lava cake, Valrhona chocolate, vanilla bean ice cream",        cal:490, spicy:false },
      {id:"pi5", name:"Eggs Benedict",           image: "/images/specialmenu/onianring.jpg",emoji:"🍳", price:2100, rating:4.8, time:"15 min", tags:["Weekend Fave"],       desc:"Poached eggs, Canadian bacon, hollandaise, toasted muffin",         cal:480, spicy:false },
      {id:"pi6", name:"Tom Kha Soup",            image: "/images/specialmenu/onianring.jpg",emoji:"🍜", price:1600, rating:4.8, time:"15 min", tags:["Comfort Food"],       desc:"Coconut broth, galangal, mushrooms, lemongrass, chilli",            cal:320, spicy:true  },
      {id:"pi7", name:"Tiramisu",                image: "/images/specialmenu/onianring.jpg",emoji:"☕", price:1305, rating:4.9, time:"5 min",  tags:["Classic","Sweet"],    desc:"Espresso-soaked ladyfingers, mascarpone cream, cocoa dusting",      cal:420, spicy:false },
      {id:"pi8", name:"Chicken Wrap",            image: "/images/specialmenu/onianring.jpg", emoji:"🥙", price:1750, rating:4.7, time:"10 min", tags:["Quick","Healthy"],    desc:"Grilled chicken, lettuce, tzatziki, tomato in warm flatbread",     cal:450, spicy:false },
    ],
  },
  "Combo Meals": {
    icon:"🎁", color:"#db2777", bg:"linear-gradient(135deg,#fdf2f8,#fbcfe8)",
    tagline:"More value, more flavour",
    items:[
      {id:"cm1", name:"The Classic Combo",      image: "/images/specialmenu/onianring.jpg", emoji:"🍔", price:3200, rating:4.8, time:"15 min", tags:["Best Value","Save 20%"], desc:"Smash burger + loaded fries + soft drink of your choice",          cal:980, spicy:false },
      {id:"cm2", name:"Breakfast for Two",       image: "/images/specialmenu/onianring.jpg",emoji:"🥞", price:4200, rating:4.9, time:"18 min", tags:["Sharing","Morning"],   desc:"2× pancake stacks, 2× coffees, fresh fruit platter, OJ",           cal:1100,spicy:false },
      {id:"cm3", name:"Date Night Special",      image: "/images/specialmenu/onianring.jpg",emoji:"🥩", price:9500, rating:5.0, time:"35 min", tags:["Romantic","Premium"],  desc:"Wagyu ribeye + lobster tail + dessert for 2 + wine pairing",       cal:1400,spicy:false },
      {id:"cm4", name:"Veggie Delight Box",      image: "/images/specialmenu/onianring.jpg",emoji:"🌿", price:3800, rating:4.7, time:"20 min", tags:["Vegan","Healthy"],     desc:"Buddha bowl + falafel wrap + green smoothie + fruit cup",          cal:820, spicy:false },
      {id:"cm5", name:"Family Feast",            image: "/images/specialmenu/onianring.jpg",emoji:"👨‍👩‍👧‍👦",price:12500,rating:4.9,time:"35 min", tags:["Family","Feeds 4"],    desc:"4× mains + 2× sides + 4× drinks + 1 shared dessert",              cal:null,spicy:false },
      {id:"cm6", name:"Snack & Sip",             image: "/images/specialmenu/onianring.jpg",emoji:"🍟", price:1850, rating:4.6, time:"8 min",  tags:["Casual","Quick"],      desc:"Loaded fries + onion rings + cold brew or bubble tea",             cal:730, spicy:false },
      {id:"cm7", name:"Chef's Tasting Menu",     image: "/images/specialmenu/onianring.jpg",emoji:"👨‍🍳",price:8900, rating:5.0, time:"50 min", tags:["Gourmet","5 Courses"],  desc:"5-course curated experience — starter, soup, mains, dessert, digestif",cal:null,spicy:false },
      {id:"cm8", name:"Kids Happy Meal",         image: "/images/specialmenu/onianring.jpg",emoji:"🧒", price:1600, rating:4.8, time:"10 min", tags:["Kids","Fun"],           desc:"Mini burger or pasta + fries + juice box + cookie",                cal:580, spicy:false },
    ],
  },
};

function MenuPage({ onBack, accentColor, onDishSelect, cartItems = [], setCartItems, onViewCart }) {
  const [activeCategory, setActiveCategory] = useState("Fast Food");
  const [search, setSearch]               = useState("");
  const [sortBy, setSortBy]               = useState("default"); // default | price | rating
  const [filterSpicy, setFilterSpicy]     = useState(false);
  const [hoveredItem, setHoveredItem]     = useState(null);
  const [cartAnim, setCartAnim]           = useState(null);

  const catKeys = Object.keys(menuData);
  const cat = menuData[activeCategory];

  const addToCart = (item) => {
    if (!setCartItems) return;
    const itemCategory = catKeys.find(k => menuData[k].items.some(i => i.id === item.id)) || activeCategory;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, category: itemCategory, qty: 1 }];
    });
    setCartAnim(item.id);
    setTimeout(() => setCartAnim(null), 600);
  };

  const allItems = search
    ? catKeys.flatMap(k => menuData[k].items).filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.desc.toLowerCase().includes(search.toLowerCase())
      )
    : cat.items;

  const displayItems = [...allItems]
    .filter(i => filterSpicy ? i.spicy : true)
    .sort((a,b) => sortBy === "price" ? a.price - b.price : sortBy === "rating" ? b.rating - a.rating : 0);

  const totalItemsInCategory = catKeys.reduce((s,k)=>s+menuData[k].items.length,0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ minHeight:"100vh", background:"#f4f1ed", fontFamily:"'Trebuchet MS',sans-serif", color:"#111827" }}>

      {/* ── Top Bar ── */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(0,0,0,0.07)",
        padding:"0 36px", height:66,
        display:"flex", alignItems:"center", gap:14,
        boxShadow:"0 2px 16px rgba(0,0,0,0.06)",
      }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:7, background:"#f3f4f6",
          border:"none", borderRadius:10, padding:"8px 14px", color:"#555",
          cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
          transition:"background 0.2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background="#e5e7eb"}
          onMouseLeave={e=>e.currentTarget.style.background="#f3f4f6"}
        >← Home</button>

        <div style={{ fontSize:13, color:"#d1d5db" }}>
          <span style={{ color:"#6b7280" }}>Home</span>
          <span style={{ margin:"0 6px" }}>›</span>
          <span style={{ color:accentColor, fontWeight:700 }}>Special Menu</span>
        </div>

        {/* Search */}
        <div style={{ flex:1, maxWidth:380, marginLeft:8 }}>
          <div style={{
            display:"flex", alignItems:"center", background:"#f3f4f6",
            border:`1.5px solid ${search ? accentColor+"66":"transparent"}`,
            borderRadius:12, padding:"0 14px", gap:8, transition:"border-color 0.2s",
          }}>
            <span style={{ color:"#9ca3af", fontSize:15 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search dishes, ingredients…"
              style={{ border:"none", background:"none", fontSize:13, color:"#374151", outline:"none", padding:"10px 0", width:"100%", fontFamily:"inherit" }}/>
            {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#9ca3af" }}>✕</button>}
          </div>
        </div>

        <div style={{ marginLeft:"auto", display:"flex", gap:12, alignItems:"center" }}>
          <span style={{ fontSize:20, opacity:0.5, cursor:"pointer" }}>🔔</span>
          <div style={{ position:"relative", cursor:"pointer" }}>
            <span style={{ fontSize:20 }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position:"absolute", top:-5, right:-5, background:accentColor,
                color:"#fff", borderRadius:"50%", width:16, height:16,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:9, fontWeight:800,
                animation: cartCount > 0 ? "cartBump 0.3s cubic-bezier(0.34,1.56,0.64,1)" : "none",
              }}>{cartCount}</span>
            )}
          </div>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${accentColor},${accentColor}99)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>👤</div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{
        background:`linear-gradient(135deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)`,
        padding:"32px 40px 0", position:"relative", overflow:"hidden",
      }}>
        {/* bg blobs */}
        {[["-40px",null,"200px",`${accentColor}10`],[null,"30px","160px","rgba(255,255,255,0.02)"]].map(([l,r,sz,bg],i)=>(
          <div key={i} style={{position:"absolute",top:"-20px",left:l||undefined,right:r||undefined,width:sz,height:sz,borderRadius:"50%",background:bg,pointerEvents:"none"}}/>
        ))}
        <div style={{ position:"relative", zIndex:1, maxWidth:1160, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom:28 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:`${accentColor}bb`, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>
                Smart Restaurant
              </div>
              <h1 style={{ margin:"0 0 6px", fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>
                Special Menu 🍽️
              </h1>
              <p style={{ margin:0, color:"rgba(255,255,255,0.4)", fontSize:13 }}>
                {totalItemsInCategory} dishes across {catKeys.length} categories
              </p>
            </div>
            {/* Sort & Filter controls */}
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{
                padding:"8px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:12,
                fontFamily:"inherit", fontWeight:600, cursor:"pointer", outline:"none",
              }}>
                <option value="default" style={{background:"#1a1a2e"}}>Sort: Default</option>
                <option value="rating"  style={{background:"#1a1a2e"}}>Sort: Top Rated</option>
                <option value="price"   style={{background:"#1a1a2e"}}>Sort: Price ↑</option>
              </select>
              <button onClick={()=>setFilterSpicy(f=>!f)} style={{
                padding:"8px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)",
                background: filterSpicy ? "#ef4444" : "rgba(255,255,255,0.08)",
                color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                transition:"all 0.2s",
              }}>🌶 Spicy Only</button>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display:"flex", gap:0, overflowX:"auto", paddingBottom:0 }}>
            {catKeys.map(k => {
              const cd = menuData[k];
              const active = activeCategory === k && !search;
              return (
                <button key={k} onClick={()=>{setActiveCategory(k);setSearch("");}} style={{
                  display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                  padding:"14px 22px 16px", border:"none", cursor:"pointer", fontFamily:"inherit",
                  background:"transparent", flexShrink:0, position:"relative",
                  borderBottom: active ? `3px solid ${cd.color}` : "3px solid transparent",
                  transition:"all 0.2s",
                }}>
                  <span style={{ fontSize:22 }}>{cd.icon}</span>
                  <span style={{ fontSize:11, fontWeight:700, color: active ? cd.color : "rgba(255,255,255,0.5)", whiteSpace:"nowrap" }}>{k}</span>
                  <span style={{
                    fontSize:9, fontWeight:800, color:"#fff",
                    background: active ? cd.color : "rgba(255,255,255,0.15)",
                    borderRadius:10, padding:"1px 6px", marginTop:1,
                    transition:"background 0.2s",
                  }}>{menuData[k].items.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"28px 40px 56px" }}>

        {/* Category intro card (only when not searching) */}
        {!search && (
          <div style={{
            background: cat.bg,
            border:`1.5px solid ${cat.color}22`,
            borderRadius:20, padding:"20px 28px", marginBottom:24,
            display:"flex", alignItems:"center", gap:20,
          }}>
            <div style={{
              width:56, height:56, borderRadius:16, flexShrink:0,
              background:`linear-gradient(135deg,${cat.color},${cat.color}cc)`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
              boxShadow:`0 6px 18px ${cat.color}44`,
            }}>{cat.icon}</div>
            <div style={{ flex:1 }}>
              <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:900, color:"#111827" }}>{activeCategory}</h2>
              <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>{cat.tagline}</p>
            </div>
            <div style={{
              background:`${cat.color}15`, border:`1px solid ${cat.color}33`,
              borderRadius:12, padding:"10px 18px", textAlign:"center",
            }}>
              <div style={{ fontSize:20, fontWeight:900, color:cat.color }}>{cat.items.length}</div>
              <div style={{ fontSize:10, color:"#9ca3af", fontWeight:600 }}>Dishes</div>
            </div>
          </div>
        )}

        {/* Search result label */}
        {search && (
          <div style={{ marginBottom:20, fontSize:14, color:"#6b7280" }}>
            <span style={{ fontWeight:700, color:"#111827" }}>{displayItems.length} results</span> for "{search}"
          </div>
        )}

        {displayItems.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 24px" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#374151" }}>No dishes found</div>
            <div style={{ fontSize:13, color:"#9ca3af", marginTop:6 }}>Try a different search term or category</div>
          </div>
        )}

        {/* Dish grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {displayItems.map(item => {
            const inCart = cartItems.some(i => i.id === item.id);
            const isAnim = cartAnim === item.id;
            const itemCat = catKeys.find(k => menuData[k].items.some(i=>i.id===item.id));
            const itemColor = itemCat ? menuData[itemCat].color : accentColor;
            const itemBg    = itemCat ? menuData[itemCat].bg    : "#fff3e0";
            return (
              <div key={item.id}
                style={{
                  background:"#fff", borderRadius:22, overflow:"hidden",
                  border:"1px solid rgba(0,0,0,0.06)",
                  boxShadow:"0 2px 14px rgba(0,0,0,0.05)",
                  transition:"transform 0.22s, box-shadow 0.22s",
                  display:"flex", flexDirection:"column",
                  transform: hoveredItem===item.id ? "translateY(-6px)" : "none",
                  ...(hoveredItem===item.id ? {boxShadow:`0 16px 40px ${itemColor}22`} : {}),
                }}
                onMouseEnter={()=>setHoveredItem(item.id)}
                onMouseLeave={()=>setHoveredItem(null)}
              >
                {/* Item photo banner */}
                <div style={{
                  background: itemBg, height:200,
                  position:"relative",
                  borderBottom:`1px solid ${itemColor}18`,
                  overflow:"hidden",
                }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                      }}
                      style={{
                        width:"100%",
                        height:"100%",
                        objectFit:"cover",
                        display:"block",
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      position:"absolute",
                      inset:0,
                      display: item.image ? "none" : "flex",
                      alignItems:"center",
                      justifyContent:"center",
                      fontSize:72,
                      background: itemBg,
                    }}
                  >
                    {item.emoji}
                  </div>
 {/* ── Wave SVG ── */}
        <div
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            zIndex: 3,
            lineHeight: 0,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 400 50"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: 50 }}
          >
            <path
              d="M0,30 C60,50 120,10 200,28 C280,46 340,14 400,30 L400,50 L0,50 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
                  
                  {/* Tags */}
                  <div style={{ position:"absolute", top:10, left:10, display:"flex", flexDirection:"column", gap:4 }}>
                    {item.tags.slice(0,2).map(tag=>(
                      <span key={tag} style={{
                        fontSize:9, fontWeight:800, color:"#fff",
                        background: tag.includes("#1")||tag.includes("Bestseller")||tag.includes("Must Try")||tag.includes("Luxury")||tag.includes("Wagyu")||tag.includes("Romantic")
                          ? `linear-gradient(135deg,${itemColor},${itemColor}cc)`
                          : "rgba(0,0,0,0.45)",
                        borderRadius:8, padding:"2px 8px", letterSpacing:"0.3px",
                        backdropFilter:"blur(4px)",
                      }}>{tag}</span>
                    ))}
                  </div>
                  {/* Spicy badge */}
                  {item.spicy && (
                    <div style={{ position:"absolute", top:10, right:10, fontSize:16 }} title="Spicy">🌶️</div>
                  )}
                </div>

                <div style={{ padding:"16px 18px", flex:1, display:"flex", flexDirection:"column" }}>
                  <h3 style={{ margin:"0 0 5px", fontSize:15, fontWeight:800, color:"#111827", lineHeight:1.3 }}>{item.name}</h3>
                  <p style={{ margin:"0 0 10px", fontSize:12, color:"#9ca3af", lineHeight:1.55, flex:1 }}>{item.desc}</p>

                  {/* Meta row */}
                  <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, color:"#6b7280", display:"flex", alignItems:"center", gap:3 }}>
                      <span style={{ color:"#f5a623" }}>★</span> {item.rating}
                    </span>
                    <span style={{ fontSize:11, color:"#6b7280" }}>⏱ {item.time}</span>
                    {item.cal && <span style={{ fontSize:11, color:"#6b7280" }}>🔥 {item.cal} cal</span>}
                  </div>

                  {/* Price + Add */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:18, fontWeight:900, color:itemColor }}>Rs. {item.price.toLocaleString()}</span>
                    <button onClick={()=>addToCart(item)} style={{
                      padding:"9px 18px", borderRadius:11, border:"none",
                      background: inCart
                        ? "linear-gradient(135deg,#22c55e,#16a34a)"
                        : `linear-gradient(135deg,${itemColor},${itemColor}cc)`,
                      color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer",
                      fontFamily:"inherit",
                      boxShadow: inCart ? "0 4px 12px #22c55e44" : `0 4px 12px ${itemColor}44`,
                      transform: isAnim ? "scale(1.2)" : "scale(1)",
                      transition:"all 0.2s",
                    }}>
                      {inCart ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart summary bar */}
        {cartCount > 0 && (
          <div style={{
            position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
            background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
            borderRadius:20, padding:"14px 28px",
            display:"flex", alignItems:"center", gap:20,
            boxShadow:`0 12px 40px ${accentColor}66`,
            zIndex:200, minWidth:320,
            animation:"slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>🛒</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{cartCount} item{cartCount>1?"s":""} in cart</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Ready to order?</div>
              </div>
            </div>
            <button onClick={onViewCart || onBack} style={{
              padding:"9px 20px", background:"rgba(255,255,255,0.2)",
              border:"1px solid rgba(255,255,255,0.3)", borderRadius:12,
              color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer",
              fontFamily:"inherit", marginLeft:"auto",
            }}>View Cart →</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background:"#fff", borderTop:"1px solid #f0f0f0", padding:"22px 40px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
        {[
          {icon:"🕐",title:"Hours",    lines:["Mon–Sun","10 AM – 11 PM"]},
          {icon:"📞",title:"Contact",  lines:["+94 77 599 5735","info@smartrestaurant.lk"]},
          {icon:"📍",title:"Location", lines:["123, Galle Road","Colombo 03, Sri Lanka"]},
          
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
        @keyframes cartBump { 0%{transform:scale(1)} 50%{transform:scale(1.4)} 100%{transform:scale(1)} }
        @keyframes slideUp  { from{transform:translateX(-50%) translateY(80px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}


export { MenuPage };
