import { useState } from 'react';
import type { Order, OrderStatus } from '../../types';
import { formatDate, formatPrice, orderStatusLabels, orderTotal } from '../../utils';
import { OrderStatusBadge } from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import OrderDetail from './OrderDetail';

interface OrdersSectionProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const statusFilters: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrdersSection({ orders, onStatusChange }: OrdersSectionProps) {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 md:px-8 md:pt-6 shrink-0">
        <h1 className="font-serif text-xl md:text-2xl font-medium text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-5 md:px-8 pb-3 overflow-x-auto shrink-0">
        {statusFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              filter === f.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {f.label}
            {f.id !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {orders.filter((o) => o.status === f.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 md:px-8">
        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18M3 12h18M3 19h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            title="No orders"
            description={
              filter === 'all'
                ? 'Orders from your store will appear here.'
                : `No ${orderStatusLabels[filter as OrderStatus].toLowerCase()} orders.`
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setViewingOrder(order)}
              />
            ))}
          </div>
        )}
      </div>

      <OrderDetail
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onStatusChange={(id, status) => {
          onStatusChange(id, status);
          setViewingOrder((o) => (o?.id === id ? { ...o, status } : o));
        }}
      />
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const total = orderTotal(order.items);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-2xl border border-border px-4 py-4 hover:border-primary/30 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-mono text-muted-foreground">{order.id}</p>
          <p className="text-sm font-medium text-foreground mt-0.5">{order.customerName}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(order.date)}</span>
        <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        <span className="font-serif text-sm font-medium text-foreground">{formatPrice(total)}</span>
      </div>
    </button>
  );
}
