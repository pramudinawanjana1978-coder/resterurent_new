import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const handleAddCart = (dish, customOptions) => {
    setCart((prevCart) => {
      // එකම කෑම එක, එකම විදිහට (same spice/toppings) දැනටමත් cart එකේ තියෙනවද බලනවා
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.id === dish.id &&
          item.spice === customOptions.spice &&
          JSON.stringify(item.toppings) === JSON.stringify(customOptions.toppings)
      );

      if (existingIndex > -1) {
        // තිබ්බොත් quantity (qty) එක විතරක් එකතු කරනවා
        const newCart = [...prevCart];
        newCart[existingIndex].qty += customOptions.qty;
        return newCart;
      }

      // නැත්නම් අලුත් item එකක් විදිහට cart එකට දානවා
      return [...prevCart, { ...dish, ...customOptions }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, handleAddCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);