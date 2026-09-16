import type { Order, OrderStatus } from '../../types';
import { formatDate, formatPrice, orderStatusLabels, orderTotal } from '../../utils';
import { OrderStatusBadge } from '../ui/Badge';
import Modal from '../ui/Modal';

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const statusFlow: OrderStatus[] = ['new', 'confirmed', 'completed', 'cancelled'];

export default function OrderDetail({ order, onClose, onStatusChange }: OrderDetailProps) {
  if (!order) return null;

  const total = orderTotal(order.items);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Modal open={!!order} onClose={onClose} title={`Order ${order.id}`} fullScreen>
      <div className="px-5 py-5 pb-10 flex flex-col gap-6">
        {/* Status + date */}
        <div className="flex items-center justify-between">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-muted-foreground">{formatDate(order.date)}</span>
        </div>

        {/* Status picker */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Update Status
          </p>
          <div className="flex gap-2 flex-wrap">
            {statusFlow.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(order.id, s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  order.status === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {orderStatusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Customer info */}
        <Section title="Customer">
          <Row label="Name" value={order.customerName} />
          <Row label="WhatsApp" value={order.whatsapp} />
          <Row label="Phone" value={order.phone} />
          <Row label="Address" value={order.address} />
          <Row label="City" value={order.city} />
          <Row label="State" value={order.state} />
          {order.notes && <Row label="Notes" value={order.notes} />}
        </Section>

        {/* Items */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Items Ordered ({itemCount})
          </p>
          <div className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.productName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-serif text-sm font-medium text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-4 border-t border-border">
          <span className="text-sm font-medium text-foreground">Total</span>
          <span className="font-serif text-xl font-medium text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{title}</p>
      <div className="bg-muted rounded-xl divide-y divide-border overflow-hidden">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}
