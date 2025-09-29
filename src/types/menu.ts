export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface StoreInfo {
  restaurantName?: string;
  theme?: string;
  logo?: string;
  [key: string]: any;
}

export interface MenuWithSettings {
  menu: MenuItem[];
  categories: Category[];
  offers?: any[];
  settings?: StoreInfo;
}