
import type { Order, Product, Settings } from './types';

/*
 * Template data only.
 *
 * Products and orders are loaded from Supabase.
 * Settings are loaded from the store database.
 *
 * These empty values make the dashboard safe to clone
 * for a new store connected to a fresh Supabase project.
 */

export const initialProducts: Product[] = [];

export const initialOrders: Order[] = [];

export const initialSettings: Settings = {
  storeName: '',
  whatsappNumber: '',
  bankName: '',
  accountName: '',
  accountNumber: '',
};
