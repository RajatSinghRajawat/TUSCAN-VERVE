import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardTab } from './tabs/DashboardTab';
import { ProductsTab } from './tabs/ProductsTab';
import { OrdersTab } from './tabs/OrdersTab';
import { SubscribersTab } from './tabs/SubscribersTab';
import { ProductModal } from './components/ProductModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  fetchSubscribers,
  checkBackendHealth,
  autoLoginAdmin,
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Checking...' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, isError = false) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, isError }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  // Fetch all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Check health & auto-login in background
      const health = await checkBackendHealth();
      setBackendStatus(health);
      if (health.connected) {
        await autoLoginAdmin();
      }

      // 2. Parallel data fetch
      const [prods, ords, subs] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchSubscribers(),
      ]);

      setProducts(prods || []);
      setOrders(ords || []);
      setSubscribers(subs || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      addToast('Failed to synchronize with server.', true);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Product CRUD
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.sku;
        const updated = await updateProduct(id, productData);
        setProducts((prev) =>
          prev.map((p) => (p._id === id || p.sku === id ? { ...p, ...updated } : p))
        );
        addToast(`Updated "${productData.name}" successfully.`);
      } else {
        const created = await createProduct(productData);
        setProducts((prev) => [created, ...prev]);
        addToast(`Created product "${productData.name}" successfully.`);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      addToast(err.message || 'Error saving product', true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you wish to delete this shirt from the catalog?')) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p._id !== id && p.sku !== id));
        addToast('Shirt removed from catalog.');
      } catch (err) {
        addToast(err.message || 'Failed to delete product', true);
      }
    }
  };

  const handleToggleProductStatus = async (id, partial) => {
    try {
      const updated = await updateProduct(id, partial);
      setProducts((prev) =>
        prev.map((p) => (p._id === id || p.sku === id ? { ...p, ...updated } : p))
      );
      addToast('Product status updated.');
    } catch (err) {
      addToast(err.message || 'Status update failed', true);
    }
  };

  // Order CRUD
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId, { orderStatus, paymentStatus }) => {
    try {
      const updated = await updateOrderStatus(orderId, { orderStatus, paymentStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, ...updated }));
      }
      addToast(`Order #${orderId.slice(-6)} status updated to "${orderStatus}".`);
    } catch (err) {
      addToast(err.message || 'Failed to update order status', true);
    }
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed'
  ).length;

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        productsCount={products.length}
        backendStatus={backendStatus}
        onRefresh={loadData}
      />

      {/* Main Admin Body */}
      <div className="admin-main">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewProductClick={handleOpenNewProduct}
          onRefresh={loadData}
          loading={loading}
          activeTab={activeTab}
        />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            products={products}
            orders={orders}
            subscribers={subscribers}
            onSelectOrder={handleSelectOrder}
            onNavigateTab={setActiveTab}
            onNewProduct={handleOpenNewProduct}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAddProduct={handleOpenNewProduct}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleStatus={handleToggleProductStatus}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            onSelectOrder={handleSelectOrder}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'subscribers' && (
          <SubscribersTab
            subscribers={subscribers}
            onNotify={(msg) => addToast(msg)}
          />
        )}
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.isError ? 'error' : ''}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
