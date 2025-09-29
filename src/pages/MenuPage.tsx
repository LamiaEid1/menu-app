import React, { useState, useEffect } from 'react';
import { menuApi } from '../services/api';
import { MenuItem, StoreInfo } from '../types/menu';
import MenuItemCard from '../components/MenuItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';



const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchMenuData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const data = await menuApi.getMenuWithSettings();
    setMenuItems(data.menu || []); // Added || [] as fallback
    setSettings(data.settings || null);
  } catch (err) {
    setError('Failed to load menu. Please check your connection.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Group items by category
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, MenuItem[]>();
    
    menuItems.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push(item);
    });

    return Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items,
    }));
  }, [menuItems]);

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMenuData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {settings?.restaurantName || 'Our Menu'}
          </h1>
          <p className="text-gray-600 mt-1">Discover our delicious offerings</p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({menuItems.length})
            </button>
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name} ({category.items.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={() => console.log('Item clicked:', item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Powered by {settings?.restaurantName || 'QuiverSoftware'}</p>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;