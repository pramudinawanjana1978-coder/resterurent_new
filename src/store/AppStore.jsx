import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// 1. Context eka create karanna
const AppStoreContext = createContext(null);
const STORAGE_KEY = "SMART_RESTAURANT_STORE";

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
};

const saveToStorage = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
};

const buildInitialStore = () => ({
  orders:             [],
  feedbackList:       [],
  ratingOverrides:    {},
  nextOrderNum:       10001,
  cartItems:          [],
  activeTrackOrderId: null,   
  staffMessages:      {},     
});

export function AppStoreProvider({ children }) {
  const [store, setStoreRaw] = useState(() => {
    const persisted = loadFromStorage();
    const defaults  = buildInitialStore();
    return persisted ? { ...defaults, ...persisted } : defaults;
  });

  const setStore = (updater) => {
    setStoreRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToStorage(next);
      return next;
    });
  };

  const addToCart = (dish) => {
    setStore(prev => {
      const existing = prev.cartItems.find(i => i.id === dish.id);
      if (existing) {
        return {
          ...prev, cartItems: prev.cartItems.map(i =>
            i.id === dish.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        ...prev, cartItems: [
          ...prev.cartItems,
          {
            id:                 dish.id, name:               dish.name, emoji:              dish.emoji        || "🍽️", price:              typeof dish.price === "string"
                                  ? parseInt((dish.price||"0").replace(/[^0-9]/g,""))||0
                                  : dish.price, qty:1, category:           dish.category     || "", color:              dish.color        || "#FFF8E1", spice:              dish.spice        || "None", toppings:           dish.toppings     || [], removedIngredients: dish.removedIngredients || [], note:               dish.note         || "",
          },
        ],
      };
    });
  };

  const changeCartQty = (id, delta) => {
    setStore(prev => ({
      ...prev, cartItems: prev.cartItems
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0),
    }));
  };

  const removeFromCart = (id) => {
    setStore(prev => ({
      ...prev, cartItems: prev.cartItems.filter(i => i.id !== id),
    }));
  };

  const clearCart = () => {
    setStore(prev => ({ ...prev, cartItems: [] }));
  };

  const placeOrder = (cartItems, total, accentColor, orderMeta = {}) => {
    const now     = new Date();
    const orderId = orderMeta.id || `#SR${store.nextOrderNum}`;
    const queuePos = (store.orders.filter(o => ["Received","Preparing","Cooking"].includes(o.status)).length) + 1;
    const order   = {
      id:       orderId,
      table:    `Table ${String(Math.floor(Math.random()*20)+1).padStart(2,"0")}`,
      placed:   new Date(orderMeta.ts || now).toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }),
      placedAt: new Date(orderMeta.ts || now).toISOString(),
      status:   "Received",
      total,
      accentColor,
      queuePosition: queuePos,
      items: cartItems.map(i => ({
        id: i.id, name: i.name, image: i.image, emoji: i.emoji, price: i.price,
        qty: i.qty, category: i.category,
        spice: i.spice || "None", toppings: i.toppings || [],
        removedIngredients: i.removedIngredients || [], note: i.note || "",
      })),
    };
    setStore(prev => ({
      ...prev,
      orders:             [order, ...prev.orders],
      nextOrderNum:       prev.nextOrderNum + 1,
      cartItems:          [],
      activeTrackOrderId: orderId,
    }));
    return orderId;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setStore(prev => ({
      ...prev, orders: prev.orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ),
    }));
  };

  const sendStaffMessage = (orderId, text) => {
    const msg = {
      text,
      time:   new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }),
      sender: "Kitchen Staff",
    };
    setStore(prev => ({
      ...prev,
      staffMessages: {
        ...prev.staffMessages,
        [orderId]: [...(prev.staffMessages?.[orderId] || []), msg],
      },
    }));
  };

  const submitFeedback = (feedbackData) => {
    const fb = {
      id:        `fb_${Date.now()}`, dishId:    feedbackData.dishId, dishName:  feedbackData.dishName, dishEmoji: feedbackData.dishEmoji, rating:    feedbackData.rating, tags:      feedbackData.tags || [], comment:   feedbackData.comment || "", name:      feedbackData.name    || "Anonymous", recommend: feedbackData.recommend, aspects:   feedbackData.aspects || {}, createdAt: new Date().toISOString(), orderId:   feedbackData.orderId || "",
    };

    setStore(prev => {
      const existingFbs = prev.feedbackList.filter(f => f.dishId === fb.dishId);
      const allRatings  = [...existingFbs.map(f => f.rating), fb.rating];
      const newAvg      = allRatings.reduce((s,r)=>s+r,0) / allRatings.length;
      const newCount    = allRatings.length;

      return {
        ...prev, feedbackList: [fb, ...prev.feedbackList],
      };
    });
  };

  const value = {
    store, addToCart, changeCartQty, removeFromCart, clearCart,
    placeOrder, updateOrderStatus, submitFeedback, sendStaffMessage,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

// 2. Custom hook eka export karanna
export const useAppStore = () => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
};

export default AppStoreProvider;