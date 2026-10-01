
import type { OrderItem, OrderStatus } from './types';

export function formatPrice(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function stockStatus(
  stock: number | null
): 'in_stock' | 'low_stock' | 'out_of_stock' | 'not_tracked' {
  if (stock === null) return 'not_tracked';
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
}

export const stockLabels = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  not_tracked: 'Stock Not Tracked',
} as const;

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}
