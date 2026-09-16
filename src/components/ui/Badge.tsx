import type { OrderStatus } from '../../types';
import { orderStatusLabels, stockLabels } from '../../utils';

type StockKey = 'in_stock' | 'low_stock' | 'out_of_stock';

const stockStyles: Record<StockKey, string> = {
  in_stock: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  low_stock: 'bg-amber-50 text-amber-700 border-amber-200',
  out_of_stock: 'bg-rose-50 text-rose-700 border-rose-200',
};

const orderStyles: Record<OrderStatus, string> = {
  new: 'bg-sky-50 text-sky-700 border-sky-200',
  confirmed: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function StockBadge({ status }: { status: StockKey }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${stockStyles[status]}`}>
      {stockLabels[status]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${orderStyles[status]}`}>
      {orderStatusLabels[status]}
    </span>
  );
}
