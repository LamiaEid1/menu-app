import axios from 'axios';
import { MenuItem, StoreInfo, MenuWithSettings } from '../types/menu';
import { convertToDataUrl } from '../utils/imageUtils';

const API_BASE_URL = 'https://quiversoftware.net/api';
const USER_ID = 'user99999';

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-user-id': USER_ID,
  },
});

interface ApiResponse<T> {
  code: number;
  state: string;
  data: T;
  message: string;
}

interface ApiProduct {
  id: number;
  name: string;
  selling_price: number;
  description: string;
  image: any;
  quantity: number;
  category_id: number;
  available?: boolean;
}

interface ApiCategory {
  id: number;
  name: string;
  color: string;
  section: string;
  sort: number;
  active: number;
  hide_on_menu: number;
  products: ApiProduct[];
}

interface ApiMenuData {
  categories: ApiCategory[];
  offers?: any[];
  store_info?: StoreInfo;
}

export const menuApi = {
  /**
   * Fetch menu with settings
   */
  getMenuWithSettings: async (): Promise<MenuWithSettings> => {
    try {
      const response = await apiClient.get<ApiResponse<ApiMenuData>>('/menu/with-settings');
      
      console.log('API Response:', response.data);
      
      const actualData = response.data.data;
      
      if (!actualData.categories || !Array.isArray(actualData.categories)) {
        console.error('No categories found in response:', actualData);
        throw new Error('Invalid response structure from API');
      }

      // Flatten all products from all categories into a single array
      const allMenuItems: MenuItem[] = [];
      
      actualData.categories.forEach((category) => {
        // Skip hidden categories
        if (category.hide_on_menu === 1) {
          return;
        }
        
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach(product => {
            allMenuItems.push({
              id: product.id,
              name: product.name,
              description: product.description || '',
              price: product.selling_price,
              category: category.name,
              image: convertToDataUrl(product.image) || undefined,
              available: product.quantity > 0 || product.available !== false,
            });
          });
        }
      });

      console.log('Total processed menu items:', allMenuItems.length);

      return {
        menu: allMenuItems,
        categories: actualData.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.section,
          items: cat.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.selling_price,
            category: cat.name,
            image: convertToDataUrl(product.image) || undefined,
            available: product.quantity > 0 || product.available !== false,
          })),
        })),
        offers: actualData.offers,
        settings: actualData.store_info,
      };
    } catch (error) {
      console.error('Error fetching menu with settings:', error);
      throw error;
    }
  },

  /**
   * Fetch all menu items (backward compatible)
   */
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const data = await menuApi.getMenuWithSettings();
    return data.menu;
  },

  /**
   * Fetch menu items by category
   */
  getMenuByCategory: async (category: string): Promise<MenuItem[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem[]>>(
        `/menu/category/${category}`
      );
      
      const items = response.data.data;
      
      return items.map(item => ({
        ...item,
        image: convertToDataUrl(item.image) || undefined,
      }));
    } catch (error) {
      console.error('Error fetching menu by category:', error);
      throw error;
    }
  },

  /**
   * Fetch single menu item
   */
  getMenuItem: async (id: number): Promise<MenuItem> => {
    try {
      const response = await apiClient.get<ApiResponse<MenuItem>>(`/menu/${id}`);
      
      const item = response.data.data;
      
      return {
        ...item,
        image: convertToDataUrl(item.image) || undefined,
      };
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  },
  
};
