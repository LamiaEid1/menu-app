import React from 'react';
import { MenuItem } from '../types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onClick?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onClick }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative h-48 bg-gray-200">
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Unavailable</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-lg font-bold text-green-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;