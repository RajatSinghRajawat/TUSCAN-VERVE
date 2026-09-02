// Tuscan Verve Admin API Service
// Communicates with backend endpoints (/api/products, /api/orders, /api/newsletter, /api/auth)
// Includes seamless fallback with persistent state if the backend is offline.

const DEFAULT_API_BASE = '/api';
const TOKEN_KEY = 'tuscan_admin_token';
const API_URL_KEY = 'tuscan_api_url';

export const getApiBaseUrl = () => {
  return localStorage.getItem(API_URL_KEY) || DEFAULT_API_BASE;
};

export const setApiBaseUrl = (url) => {
  if (url) {
    localStorage.setItem(API_URL_KEY, url);
  } else {
    localStorage.removeItem(API_URL_KEY);
  }
};

export const getAdminToken = () => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Initial Seed Data (mirrored from backend seeder.js & Tuscan luxury shirts)
const INITIAL_PRODUCTS = [
  {
    _id: 'prod-01',
    sku: 'tv-01',
    name: 'Classic White Oxford',
    family: 'Oxfords',
    fabric: 'Giza Cotton · Regular Fit',
    price: 2499,
    mrp: 3299,
    tag: 'Bestseller',
    base: '#f9f8f4',
    deep: '#d8d5ca',
    pattern: 'dot',
    patternColor: 'rgba(60,70,66,0.06)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    isFeatured: true,
    isActive: true,
    description: 'Crafted with German precision and Italian soul. 2-ply compact cotton tailored for all-day comfort.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'prod-02',
    sku: 'tv-02',
    name: 'Riviera Sky Oxford',
    family: 'Oxfords',
    fabric: 'Oxford Weave · Slim Fit',
    price: 2499,
    mrp: 3299,
    tag: null,
    base: '#cfe0ee',
    deep: '#a8c2d8',
    pattern: 'dot',
    patternColor: 'rgba(38,74,105,0.10)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    isFeatured: true,
    isActive: true,
    description: 'Breezy Italian sky hue woven in dense 100% long-staple Egyptian cotton.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'prod-03',
    sku: 'tv-03',
    name: 'Bengal Stripe Rosa',
    family: 'Stripes',
    fabric: 'Poplin Weave · Slim Fit',
    price: 2699,
    mrp: 3499,
    tag: 'New',
    base: '#f6e3e6',
    deep: '#dfb6bd',
    pattern: 'stripe',
    patternColor: 'rgba(196,90,110,0.35)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 40,
    isFeatured: true,
    isActive: true,
    description: 'Subtle European rose stripe for distinguished boardroom flair.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: 'prod-04',
    sku: 'tv-04',
    name: 'Midnight Navy Twill',
    family: 'Solids',
    fabric: 'Cotton Twill · Slim Fit',
    price: 2599,
    mrp: 3399,
    tag: null,
    base: '#2a3a55',
    deep: '#1d2a40',
    pattern: 'diag',
    patternColor: 'rgba(255,255,255,0.05)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 60,
    isFeatured: true,
    isActive: true,
    description: 'Deep Tuscan nightfall shade with wrinkle-resistant twill construction.',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    _id: 'prod-05',
    sku: 'tv-05',
    name: 'Olive Safari Twill',
    family: 'Solids',
    fabric: 'Brushed Twill · Regular Fit',
    price: 2799,
    mrp: 3599,
    tag: null,
    base: '#6a7150',
    deep: '#525840',
    pattern: 'diag',
    patternColor: 'rgba(255,255,255,0.06)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 35,
    isFeatured: true,
    isActive: true,
    description: 'Rich earth tones inspired by the Tuscan hillsides.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'prod-06',
    sku: 'tv-06',
    name: 'Ash Grey Chambray',
    family: 'Textures',
    fabric: 'Chambray · Regular Fit',
    price: 2599,
    mrp: 3399,
    tag: null,
    base: '#c9cccb',
    deep: '#a8adac',
    pattern: 'dot',
    patternColor: 'rgba(50,60,58,0.12)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 55,
    isFeatured: true,
    isActive: true,
    description: 'Sophisticated heathered texture for smart-casual weekends.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    _id: 'prod-07',
    sku: 'tv-07',
    name: 'Tuscan Wine Herringbone',
    family: 'Textures',
    fabric: 'Herringbone · Slim Fit',
    price: 2899,
    mrp: 3699,
    tag: 'Limited',
    base: '#5d2a35',
    deep: '#451e27',
    pattern: 'diag',
    patternColor: 'rgba(255,255,255,0.07)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 18,
    isFeatured: true,
    isActive: true,
    description: 'Opulent Chianti wine shade featuring a distinctive herringbone weave.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'prod-08',
    sku: 'tv-08',
    name: 'Forest Gingham Check',
    family: 'Checks',
    fabric: 'Yarn-Dyed Check · Slim Fit',
    price: 2999,
    mrp: 3799,
    tag: 'New',
    base: '#e8ece5',
    deep: '#c2cbbd',
    pattern: 'check',
    patternColor: 'rgba(24,68,56,0.28)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 24,
    isFeatured: true,
    isActive: true,
    description: 'Tailored gingham check cut from premium yarn-dyed combed cotton.',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_ORDERS = [
  {
    _id: 'ord-1001',
    user: { name: 'Devendra Sharma', email: 'devendra.s@gmail.com' },
    guestEmail: null,
    items: [
      {
        product: 'prod-01',
        sku: 'tv-01',
        name: 'Classic White Oxford',
        size: 'L',
        qty: 2,
        price: 2499,
        base: '#f9f8f4',
        deep: '#d8d5ca',
        pattern: 'dot',
      },
      {
        product: 'prod-07',
        sku: 'tv-07',
        name: 'Tuscan Wine Herringbone',
        size: 'XL',
        qty: 1,
        price: 2899,
        base: '#5d2a35',
        deep: '#451e27',
        pattern: 'diag',
      },
    ],
    shippingAddress: {
      fullName: 'Devendra Sharma',
      phone: '+91 98230 45612',
      street: '42, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    subtotal: 7897,
    shippingFee: 0,
    totalAmount: 7897,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    _id: 'ord-1002',
    user: { name: 'Aarav Singhania', email: 'aarav@singhania.co' },
    guestEmail: null,
    items: [
      {
        product: 'prod-04',
        sku: 'tv-04',
        name: 'Midnight Navy Twill',
        size: 'M',
        qty: 1,
        price: 2599,
        base: '#2a3a55',
        deep: '#1d2a40',
        pattern: 'diag',
      },
    ],
    shippingAddress: {
      fullName: 'Aarav Singhania',
      phone: '+91 99100 88231',
      street: 'Flat 904, Oberoi Sky City, Borivali East',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400066',
      country: 'India',
    },
    subtotal: 2599,
    shippingFee: 200,
    totalAmount: 2799,
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    _id: 'ord-1003',
    user: null,
    guestEmail: 'rohit.mehta99@yahoo.com',
    items: [
      {
        product: 'prod-03',
        sku: 'tv-03',
        name: 'Bengal Stripe Rosa',
        size: 'L',
        qty: 1,
        price: 2699,
        base: '#f6e3e6',
        deep: '#dfb6bd',
        pattern: 'stripe',
      },
      {
        product: 'prod-08',
        sku: 'tv-08',
        name: 'Forest Gingham Check',
        size: 'L',
        qty: 1,
        price: 2999,
        base: '#e8ece5',
        deep: '#c2cbbd',
        pattern: 'check',
      },
    ],
    shippingAddress: {
      fullName: 'Rohit Mehta',
      phone: '+91 97110 54321',
      street: 'House 14, Sector 15, Golf Course Rd',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India',
    },
    subtotal: 5698,
    shippingFee: 0,
    totalAmount: 5698,
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    orderStatus: 'shipped',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    _id: 'ord-1004',
    user: { name: 'Kavita Pillai', email: 'kavita.pillai@outlook.com' },
    guestEmail: null,
    items: [
      {
        product: 'prod-02',
        sku: 'tv-02',
        name: 'Riviera Sky Oxford',
        size: 'S',
        qty: 2,
        price: 2499,
        base: '#cfe0ee',
        deep: '#a8c2d8',
        pattern: 'dot',
      },
    ],
    shippingAddress: {
      fullName: 'Kavita Pillai',
      phone: '+91 98450 12908',
      street: '12-B, Boat Club Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600028',
      country: 'India',
    },
    subtotal: 4998,
    shippingFee: 0,
    totalAmount: 4998,
    paymentMethod: 'Razorpay',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

const INITIAL_SUBSCRIBERS = [
  { _id: 'sub-01', email: 'aditya.kapoor@vogue.in', isActive: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: 'sub-02', email: 'sarah.verghese@luxuryguild.com', isActive: true, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { _id: 'sub-03', email: 'vikram.rathore@consulting.org', isActive: true, createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { _id: 'sub-04', email: 'tanvi.jain@designstudio.in', isActive: true, createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { _id: 'sub-05', email: 'karan.grover@fintech.co', isActive: true, createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
];

// LocalStorage helpers for mock state
const loadLocalState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`tv_mock_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveLocalState = (key, data) => {
  try {
    localStorage.setItem(`tv_mock_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save mock state:', e);
  }
};

// Automatic Admin Auth Login attempt
export const autoLoginAdmin = async () => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@tuscanverve.store',
        password: 'AdminPassword2026',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setAdminToken(data.token);
        return data.token;
      }
    }
  } catch (err) {
    // Backend offline or error; ignore silently
  }
  return getAdminToken();
};

// Generic fetch wrapper with token header
const apiFetch = async (endpoint, options = {}) => {
  const base = getApiBaseUrl();
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${base}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMsg = `Request failed (${response.status})`;
    try {
      const errData = await response.json();
      if (errData.message) errMsg = errData.message;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
};

// Health Check
export const checkBackendHealth = async () => {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/health`, { method: 'GET', cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      return { connected: true, message: data.message || 'API is operational' };
    }
    return { connected: false, message: `Server error: ${res.status}` };
  } catch (err) {
    return { connected: false, message: 'Backend unreachable (using local storage)' };
  }
};

// ==========================================
// 1. PRODUCTS API (Real backend + fallback)
// ==========================================
export const fetchProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.family && filters.family !== 'All') params.append('family', filters.family);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiFetch(`/products${qs}`);
    if (res.products) return res.products;
  } catch (err) {
    // Fallback to local store
  }

  let list = loadLocalState('products', INITIAL_PRODUCTS);
  if (filters.family && filters.family !== 'All') {
    list = list.filter((p) => p.family === filters.family);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.fabric?.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
  }
  return list;
};

export const createProduct = async (productData) => {
  try {
    const res = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    if (res.product) return res.product;
  } catch (err) {
    // Fallback to local
  }

  const list = loadLocalState('products', INITIAL_PRODUCTS);
  const newProduct = {
    ...productData,
    _id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newProduct, ...list];
  saveLocalState('products', updated);
  return newProduct;
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    if (res.product) return res.product;
  } catch (err) {
    // Fallback to local
  }

  const list = loadLocalState('products', INITIAL_PRODUCTS);
  const updated = list.map((p) => (p._id === id || p.sku === id ? { ...p, ...productData } : p));
  saveLocalState('products', updated);
  return updated.find((p) => p._id === id || p.sku === id);
};

export const deleteProduct = async (id) => {
  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    // Fallback to local
  }

  const list = loadLocalState('products', INITIAL_PRODUCTS);
  const updated = list.filter((p) => p._id !== id && p.sku !== id);
  saveLocalState('products', updated);
  return true;
};

// ==========================================
// 2. ORDERS API (Real backend + fallback)
// ==========================================
export const fetchOrders = async () => {
  try {
    const res = await apiFetch('/orders');
    if (res.orders) return res.orders;
  } catch (err) {
    // Fallback to local
  }
  return loadLocalState('orders', INITIAL_ORDERS);
};

export const updateOrderStatus = async (orderId, { orderStatus, paymentStatus }) => {
  try {
    const res = await apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
    if (res.order) return res.order;
  } catch (err) {
    // Fallback to local
  }

  const list = loadLocalState('orders', INITIAL_ORDERS);
  const updated = list.map((o) => {
    if (o._id === orderId) {
      return {
        ...o,
        ...(orderStatus ? { orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(orderStatus === 'delivered' ? { deliveredAt: new Date().toISOString() } : {}),
        ...(paymentStatus === 'paid' ? { paidAt: new Date().toISOString() } : {}),
      };
    }
    return o;
  });
  saveLocalState('orders', updated);
  return updated.find((o) => o._id === orderId);
};

// ==========================================
// 3. NEWSLETTER SUBSCRIBERS API
// ==========================================
export const fetchSubscribers = async () => {
  try {
    const res = await apiFetch('/newsletter/subscribers');
    if (res.subscribers) return res.subscribers;
  } catch (err) {
    // Fallback to local
  }
  return loadLocalState('subscribers', INITIAL_SUBSCRIBERS);
};

// Reset mock state helper
export const resetMockData = () => {
  localStorage.removeItem('tv_mock_products');
  localStorage.removeItem('tv_mock_orders');
  localStorage.removeItem('tv_mock_subscribers');
};

// ==========================================
// 4. IMAGE UPLOAD API (Backend /api/upload)
// ==========================================
export const uploadImage = async (file) => {
  try {
    const base = getApiBaseUrl();
    const token = getAdminToken();
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${base}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.fileUrl) return data.fileUrl;
    }
  } catch (err) {
    console.warn('Backend upload failed, converting to local preview:', err.message);
  }

  // Fallback to local Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

