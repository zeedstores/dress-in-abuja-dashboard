export type OrderStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number | null;
  image: string;
  description?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
  items: OrderItem[];
  status: OrderStatus;
  date: string;
}

export interface Settings {
  storeName: string;
  whatsappNumber: string;

  bankName: string;
  accountName: string;
  accountNumber: string;
  
}

export type Section = 'products' | 'orders' | 'settings';
