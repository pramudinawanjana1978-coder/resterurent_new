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

export const getDishReviewStats = (
  feedbackList = [],
  dishId,
  fallback = { rating: 0, reviews: 0 }
) => {
  const safeFeedback = Array.isArray(feedbackList) ? feedbackList : [];
  const targetId = String(dishId ?? "");

  const liveReviews = safeFeedback.filter(
    entry => String(entry.dishId ?? "") === targetId
  );

  const fallbackRating = Number(fallback?.rating ?? 0);
  const fallbackReviews = Number(fallback?.reviews ?? 0);

  if (liveReviews.length === 0) {
    return {
      rating:
        Number.isFinite(fallbackRating) && fallbackRating > 0
          ? Number(fallbackRating.toFixed(1))
          : 0,
      reviews:
        Number.isFinite(fallbackReviews)
          ? fallbackReviews
          : 0,
    };
  }

  const existingTotal = fallbackRating > 0 && fallbackReviews > 0
    ? fallbackRating * fallbackReviews
    : 0;

  const newTotal = liveReviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0
  );

  const totalReviews = fallbackReviews + liveReviews.length;

  const averageRating = totalReviews > 0
    ? (existingTotal + newTotal) / totalReviews
    : 0;

  return {
    rating: Number(averageRating.toFixed(1)),
    reviews: totalReviews,
  };
};
const buildInitialStore = () => ({
  orders:             [],
  feedbackList:       [],
  ratingOverrides:    {},
  nextOrderNum:       10001,
  cartItems:          [],
  activeTrackOrderId: null,
  staffMessages:      {},
  customerMessages:   {},
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

  const sendCustomerMessage = (orderId, text) => {
    const msg = {
      text,
      time:   new Date().toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }),
      sender: "Customer",
    };
    setStore(prev => ({
      ...prev,
      customerMessages: {
        ...prev.customerMessages,
        [orderId]: [...(prev.customerMessages?.[orderId] || []), msg],
      },
    }));
  };

  const submitFeedback = (feedbackData) => {
    const rating = Number(feedbackData.rating);

    if (!rating || rating < 1 || rating > 5) {
      return;
    }

    const fb = {
      id: feedbackData.id || `fb_${Date.now()}`,
      dishId: feedbackData.dishId,
      dishName: feedbackData.dishName,
      dishEmoji: feedbackData.dishEmoji,
      rating,
      tags: feedbackData.tags || [],
      comment: feedbackData.comment || "",
      name: feedbackData.name || "Anonymous",
      recommend: feedbackData.recommend,
      aspects: feedbackData.aspects || {},
      createdAt: feedbackData.createdAt || new Date().toISOString(),
      orderId: feedbackData.orderId || "",
    };

    setStore(prev => {
      const existingFeedback = Array.isArray(prev.feedbackList) ? prev.feedbackList : [];
      const existingIndex = feedbackData.id
        ? existingFeedback.findIndex(item => item.id === feedbackData.id)
        : existingFeedback.findIndex(item =>
            String(item.orderId || "") === String(feedbackData.orderId || "") &&
            String(item.dishId ?? "") === String(feedbackData.dishId ?? "")
          );

      const updatedFeedback = existingIndex >= 0
        ? existingFeedback.map((item, index) => index === existingIndex ? fb : item)
        : [fb, ...existingFeedback];

      const fallbackRating = typeof feedbackData.initialRating === "number"
        ? feedbackData.initialRating
        : prev.ratingOverrides?.[String(feedbackData.dishId)]?.rating ?? 0;

      const fallbackReviews = typeof feedbackData.initialReviews === "number"
        ? feedbackData.initialReviews
        : prev.ratingOverrides?.[String(feedbackData.dishId)]?.reviews ?? 0;

      const liveStats = getDishReviewStats(updatedFeedback, fb.dishId, {
        rating: fallbackRating,
        reviews: fallbackReviews,
      });

      return {
        ...prev,
        feedbackList: updatedFeedback,
        ratingOverrides: {
          ...(prev.ratingOverrides || {}),
          [String(fb.dishId)]: {
            rating: liveStats.rating,
            reviews: liveStats.reviews,
          },
        },
      };
    });

    return fb;
  };

  const value = {
  store,

  addToCart,
  changeCartQty,
  removeFromCart,
  clearCart,

  placeOrder,
  updateOrderStatus,

  submitFeedback,

  sendStaffMessage,
  sendCustomerMessage,

  getDishReviewStats: (dishId, fallback) =>
    getDishReviewStats(
      store.feedbackList,
      dishId,
      fallback
    ),
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