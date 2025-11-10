// Medusa Product Types
export interface ProductImage {
  id: string;
  url: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  metadata?: Record<string, any> | null;
}

export interface MoneyAmount {
  id: string;
  amount: number;
  currency_code: string;
  region_id?: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string | null;
  product_id: string;
  prices?: MoneyAmount[];
  inventory_quantity?: number;
  allow_backorder?: boolean;
  manage_inventory?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  metadata?: Record<string, any> | null;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  handle?: string;
  is_giftcard?: boolean;
  status?: string;
  images?: ProductImage[];
  thumbnail?: string | null;
  variants?: ProductVariant[];
  categories?: any[];
  collection_id?: string | null;
  type_id?: string | null;
  tags?: any[];
  discountable?: boolean;
  external_id?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  metadata?: Record<string, any> | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  handle?: string;
  parent_category_id?: string | null;
  rank?: number;
  created_at?: string;
  updated_at?: string;
}

// Cart Types
export interface CartLineItem {
  id: string;
  cart_id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  quantity: number;
  variant_id: string;
  unit_price: number;
  subtotal: number;
  total: number;
  original_total: number;
  original_item_total: number;
  original_item_subtotal: number;
  metadata?: Record<string, any>;
}

export interface Cart {
  id: string;
  email?: string;
  region_id: string;
  customer_id?: string;
  items: CartLineItem[];
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export type FilterType = 'support' | 'forme' | 'taille';

// Product Configuration for Cart
export interface ProductConfiguration {
  size: string; // e.g., "5x5", "8x8", "10x10", "15x15"
  support: string; // e.g., "vinyle-blanc", "vinyle-transparent", etc.
  shape: string; // e.g., "cut-contour", "carre", "rectangle", "rond"
  quantity: number; // Number of stickers
}
