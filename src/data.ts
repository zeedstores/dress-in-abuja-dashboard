import type { Order, Product, Settings } from './types';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Vitamin C Brightening Serum',
    price: 12500,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format',
    description: 'A potent antioxidant serum that brightens and evens skin tone over time.',
  },
  {
    id: 'p2',
    name: 'Deep Moisture Face Cream',
    price: 9800,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1601049677559-c8e8b9e4aaaf?w=400&h=400&fit=crop&auto=format',
    description: 'Rich daily moisturizer formulated for deep, lasting hydration.',
  },
  {
    id: 'p3',
    name: 'Gentle Foaming Cleanser',
    price: 6500,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&auto=format',
    description: 'Soft foam cleanser suitable for all skin types, morning and night.',
  },
  {
    id: 'p4',
    name: 'Rosehip Repair Oil',
    price: 14000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop&auto=format',
    description: 'Cold-pressed rosehip seed oil for skin repair and improved elasticity.',
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ZD-0042',
    customerName: 'Adaeze Okonkwo',
    whatsapp: '+234 803 456 7890',
    phone: '+234 803 456 7890',
    address: '14 Awolowo Road, Ikoyi',
    city: 'Lagos',
    state: 'Lagos State',
    notes: 'Please call before delivery.',
    items: [
      { productId: 'p1', productName: 'Vitamin C Brightening Serum', price: 12500, quantity: 2 },
      { productId: 'p2', productName: 'Deep Moisture Face Cream', price: 9800, quantity: 1 },
    ],
    status: 'new',
    date: '2026-08-29',
  },
  {
    id: 'ZD-0041',
    customerName: 'Chiamaka Eze',
    whatsapp: '+234 806 789 0123',
    phone: '+234 806 789 0123',
    address: '7 Glover Road, GRA',
    city: 'Port Harcourt',
    state: 'Rivers State',
    notes: '',
    items: [
      { productId: 'p4', productName: 'Rosehip Repair Oil', price: 14000, quantity: 1 },
    ],
    status: 'confirmed',
    date: '2026-08-28',
  },
  {
    id: 'ZD-0040',
    customerName: 'Fatimah Lawal',
    whatsapp: '+234 811 234 5678',
    phone: '+234 811 234 5678',
    address: '22 Sani Abacha Way',
    city: 'Kano',
    state: 'Kano State',
    notes: '',
    items: [
      { productId: 'p1', productName: 'Vitamin C Brightening Serum', price: 12500, quantity: 1 },
      { productId: 'p3', productName: 'Gentle Foaming Cleanser', price: 6500, quantity: 2 },
    ],
    status: 'completed',
    date: '2026-08-25',
  },
  {
    id: 'ZD-0039',
    customerName: 'Ngozi Amadi',
    whatsapp: '+234 908 345 6789',
    phone: '+234 908 345 6789',
    address: '5B Adeola Odeku Street, VI',
    city: 'Lagos',
    state: 'Lagos State',
    notes: 'Leave with security if absent.',
    items: [
      { productId: 'p2', productName: 'Deep Moisture Face Cream', price: 9800, quantity: 3 },
    ],
    status: 'cancelled',
    date: '2026-08-23',
  },
];

export const initialSettings: Settings = {
  storeName: 'Aurelle Skin',
  whatsappNumber: '08065660391',

  bankName: 'First Bank Nigeria',
  accountName: 'Aurelle Skin Beauty Ltd',
  accountNumber: '3012345678',
  paymentInstructions:
    'Transfer the exact total to the account above. Send your payment receipt via WhatsApp to confirm your order.',
};
