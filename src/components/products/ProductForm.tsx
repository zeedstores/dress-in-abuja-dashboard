
import { useState, useRef, useEffect } from 'react';
import type { Product } from '../../types';
import Modal from '../ui/Modal';
import { uploadProductImage, deleteProductImage } from '../../lib/storage';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id'> & { id?: string }) => void;
  editing?: Product | null;
}

const emptyForm = {
  name: '',
  price: '',
  stock: '',
  description: '',
  image: '',
};

export default function ProductForm({
  open,
  onClose,
  onSave,
  editing,
}: ProductFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        price: String(editing.price),
        stock: editing.stock == null ? '' : String(editing.stock),
        description: editing.description ?? '',
        image: editing.image,
      });

      setImagePreview(editing.image);
      setImageFile(null);
    } else {
      setForm(emptyForm);
      setImagePreview('');
      setImageFile(null);
    }
  }, [editing, open]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Name and price are required.
    // Stock is optional.
    if (!form.name.trim() || !form.price) return;

    let imageUrl = form.image;

    try {
      if (imageFile) {
        const oldImage = editing?.image;

        imageUrl = await uploadProductImage(imageFile);

        if (oldImage) {
          await deleteProductImage(oldImage);
        }
      }

      onSave({
        id: editing?.id,
        name: form.name.trim(),
        price: Number(form.price),
        stock: form.stock === '' ? null : Number(form.stock),
        description: form.description.trim() || undefined,
        image: imageUrl,
      });

      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Product' : 'Add Product'}
      fullScreen
    >
      <form
        onSubmit={handleSubmit}
        className="px-5 py-5 flex flex-col gap-5 pb-8"
      >
        {/* Image Upload */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Product Image
          </label>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-[3/2] rounded-xl border-2 border-dashed border-border bg-muted overflow-hidden relative group"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="5"
                    width="26"
                    height="20"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="11"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 22l7-7 5 5 4-4 10 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-sm">Tap to upload image</span>
              </div>
            )}

            {imagePreview && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Change image
                </span>
              </div>
            )}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Product Name *
          </label>

          <input
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
              }))
            }
            placeholder="e.g. Vitamin C Serum"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Price (₦) *
            </label>

            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  price: e.target.value,
                }))
              }
              placeholder="12500"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Stock (Qty){' '}
              <span className="normal-case font-normal">
                (optional)
              </span>
            </label>

            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  stock: e.target.value,
                }))
              }
              placeholder="Leave blank"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Description{' '}
            <span className="normal-case font-normal">
              (optional)
            </span>
          </label>

          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                description: e.target.value,
              }))
            }
            placeholder="Brief description of the product..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors mt-2"
        >
          {editing ? 'Save Changes' : 'Add Product'}
        </button>
      </form>
    </Modal>
  );
}
