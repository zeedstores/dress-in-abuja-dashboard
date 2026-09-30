
import { useEffect, useState } from 'react';
import type { Order, OrderStatus, Product, Section, Settings } from './types';
import { initialOrders, initialSettings } from './data';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ProductsSection from './components/products/ProductsSection';
import OrdersSection from './components/orders/OrdersSection';
import SettingsSection from './components/settings/SettingsSection';

import { supabase } from './lib/supabase';
import { deleteProductImage } from './lib/storage';

const STORE_ID = 'cb72dcbb-089d-47c4-8024-e5df316aaaf8';

export default function App() {
  const [section, setSection] = useState<Section>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', STORE_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load products:', error);
        return;
      }

      console.log('Products loaded:', data);

      setProducts(
        data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          image: product.image_url,
          description: product.description ?? undefined,
        }))
      );
    }

    loadProducts();
  }, []);

  // =========================
  // LOAD ORDERS
  // =========================
  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            full_name,
            whatsapp_number,
            phone_number,
            delivery_address,
            city,
            state
          ),
          order_items (
            product_id,
            product_name,
            price,
            quantity
          )
        `)
        .eq('store_id', STORE_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load orders:', error);
        return;
      }

      console.log('Orders loaded:', JSON.stringify(data, null, 2));

      setOrders(
        data.map((order) => ({
          id: order.id,
          customerName: order.customers.full_name,
          whatsapp: order.customers.whatsapp_number,
          phone: order.customers.phone_number ?? '',
          address: order.customers.delivery_address ?? '',
          city: order.customers.city ?? '',
          state: order.customers.state ?? '',
          items: order.order_items.map((item) => ({
            productId: item.product_id,
            productName: item.product_name,
            price: item.price,
            quantity: item.quantity,
          })),
          status: order.status as OrderStatus,
          date: order.created_at,
        }))
      );
    }

    loadOrders();
  }, []);

  // =========================
  // LOAD STORE SETTINGS
  // =========================
  useEffect(() => {
    async function loadSettings() {
      const [storeResult, paymentResult] = await Promise.all([
        supabase
          .from('stores')
          .select('name, whatsapp_number')
          .eq('id', STORE_ID)
          .single(),

        supabase
          .from('payment_settings')
          .select(
            'bank_name, account_name, account_number, payment_instructions'
          )
          .eq('store_id', STORE_ID)
          .maybeSingle(),
      ]);

      if (storeResult.error) {
        console.error('Failed to load store settings:', storeResult.error);
      }

      if (paymentResult.error) {
        console.error(
          'Failed to load payment settings:',
          paymentResult.error
        );
      }

      setSettings({
        storeName:
          storeResult.data?.name ?? initialSettings.storeName,

        whatsappNumber:
          storeResult.data?.whatsapp_number ??
          initialSettings.whatsappNumber,

        bankName:
          paymentResult.data?.bank_name ??
          initialSettings.bankName,

        accountName:
          paymentResult.data?.account_name ??
          initialSettings.accountName,

        accountNumber:
          paymentResult.data?.account_number ??
          initialSettings.accountNumber,

        paymentInstructions:
          paymentResult.data?.payment_instructions ??
          initialSettings.paymentInstructions,
      });
    }

    loadSettings();
  }, []);

  // =========================
  // SAVE SETTINGS
  // =========================
  async function saveSettings(updated: Settings) {
    try {
      // Save store details
      const { error: storeError } = await supabase
        .from('stores')
        .update({
          name: updated.storeName,
          whatsapp_number: updated.whatsappNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('id', STORE_ID);

      if (storeError) {
        throw storeError;
      }

      // Save payment details
      const { error: paymentError } = await supabase
        .from('payment_settings')
        .upsert(
          {
            store_id: STORE_ID,
            bank_name: updated.bankName,
            account_name: updated.accountName,
            account_number: updated.accountNumber,
            payment_instructions: updated.paymentInstructions,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'store_id',
          }
        );

      if (paymentError) {
        throw paymentError;
      }

      // Update dashboard state
      setSettings(updated);

      console.log('Settings saved successfully:', updated);

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', JSON.stringify(error, null, 2));
alert(`Failed to save settings: ${JSON.stringify(error)}`);
    }
  }

  // =========================
  // ADD PRODUCT
  // =========================
  async function addProduct(data: Omit<Product, 'id'>) {
    try {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          store_id: STORE_ID,
          name: data.name,
          price: data.price,
          stock: data.stock,
          description: data.description ?? null,
          image_url: data.image,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const product: Product = {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        image: newProduct.image_url,
        description: newProduct.description ?? undefined,
      };

      setProducts((prev) => [product, ...prev]);

      console.log('Product saved:', product);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    }
  }

  // =========================
  // EDIT PRODUCT
  // =========================
  async function editProduct(updated: Product) {
    try {
      const currentProduct = products.find((p) => p.id === updated.id);

      const { data, error } = await supabase
        .from('products')
        .update({
          name: updated.name,
          price: updated.price,
          stock: updated.stock,
          description: updated.description ?? null,
          image_url: updated.image,
        })
        .eq('id', updated.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (
        currentProduct &&
        currentProduct.image !== updated.image
      ) {
        await deleteProductImage(currentProduct.image);
      }

      const product: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        stock: data.stock,
        image: data.image_url,
        description: data.description ?? undefined,
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );

      console.log('Product updated:', product);
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  async function deleteProduct(id: string) {
    try {
      const product = products.find((p) => p.id === id);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      if (product?.image) {
        await deleteProductImage(product.image);
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));

      console.log('Product deleted:', id);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
  }

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  async function updateOrderStatus(
    id: string,
    status: OrderStatus
  ) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: data.status as OrderStatus }
            : o
        )
      );

      console.log('Order status updated:', data);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-background">
      <Sidebar
        section={section}
        onNavigate={setSection}
        storeName={settings.storeName}
      />

      <div className="flex flex-col flex-1 min-h-0">
        <Header
          section={section}
          storeName={settings.storeName}
        />

        <main className="flex-1 min-h-0 overflow-hidden">
          {section === 'products' && (
            <ProductsSection
              products={products}
              onAdd={addProduct}
              onEdit={editProduct}
              onDelete={deleteProduct}
            />
          )}

          {section === 'orders' && (
            <OrdersSection
              orders={orders}
              onStatusChange={updateOrderStatus}
            />
          )}

          {section === 'settings' && (
            <SettingsSection
              settings={settings}
              onSave={saveSettings}
            />
          )}
        </main>

        <BottomNav
          section={section}
          onNavigate={setSection}
        />
      </div>
    </div>
  );
}

