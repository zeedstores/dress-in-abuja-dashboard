
import { useState } from 'react';
import type { Product } from '../../types';
import { formatPrice, stockStatus } from '../../utils';
import { StockBadge } from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';
import ProductForm from './ProductForm';

interface ProductsSectionProps {
  products: Product[];
  onAdd: (p: Omit<Product, 'id'>) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductsSection({
  products,
  onAdd,
  onEdit,
  onDelete,
}: ProductsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleSave(data: Omit<Product, 'id'> & { id?: string }) {
    if (data.id) {
      onEdit({ ...data, id: data.id } as Product);
    } else {
      const { id: _id, ...rest } = data;
      onAdd(rest);
    }
  }

  function handleEditClick(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingProduct(null);
  }

  const deletingProduct = products.find((p) => p.id === deletingId);

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6 shrink-0">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-medium text-foreground">
            Products
          </h1>

          <p className="text-sm text-muted-foreground mt-0.5">
            {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          Add Product
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 md:px-8">
        {products.length === 0 ? (
          <EmptyState
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="2"
                  y="2"
                  width="9"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="13"
                  y="2"
                  width="9"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="2"
                  y="13"
                  width="9"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="13"
                  y="13"
                  width="9"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            }
            title="No products yet"
            description="Add your first product to get started."
            action={
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors"
              >
                Add Product
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => handleEditClick(product)}
                onDelete={() => setDeletingId(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductForm
        open={showForm}
        onClose={handleFormClose}
        onSave={handleSave}
        editing={editingProduct}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete product?"
        message={`"${deletingProduct?.name}" will be permanently removed from your store.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (deletingId) onDelete(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = stockStatus(product.stock);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden group">
      <div className="aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-sm text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>

          <StockBadge status={status} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-serif text-base font-medium text-foreground">
              {formatPrice(product.price)}
            </span>

            <p className="text-xs text-muted-foreground mt-0.5">
              {product.stock === null
                ? 'Stock not tracked'
                : `${product.stock} in stock`}
            </p>
          </div>

          <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Edit"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={onDelete}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-rose-50 transition-colors text-muted-foreground hover:text-rose-600"
              aria-label="Delete"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1.5 3.5h11M5 3.5V2h4v1.5M3 3.5l.7 8.5h6.6L11 3.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
