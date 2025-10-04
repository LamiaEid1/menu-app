import React from 'react';
import { useCart } from '../context/CartContext';

interface CartButtonProps {
  onOpenCart: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onOpenCart }) => {
  const { getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={onOpenCart}
      className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 z-50"
    >
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <div className="text-left">
          <div className="text-xs opacity-90">Cart</div>
          <div className="font-bold">${getTotalPrice().toFixed(2)}</div>
        </div>
      </div>
    </button>
  );
};

export default CartButton;