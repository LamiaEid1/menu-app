import React from 'react';
import MenuPage from './pages/MenuPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <MenuPage />
    </CartProvider>
  );
}

export default App;