import bcrypt from 'bcryptjs';
import { sampleProducts } from './seedProducts.js';

class MemoryStore {
  constructor() {
    this.products = [];
    this.users = [];
    this.orders = [];
    this.subscribers = [];
    this.contacts = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Deep clone sample products
    this.products = JSON.parse(JSON.stringify(sampleProducts));

    // Pre-seed demo user: alex@novasupply.com / Password123!
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const demoUser = {
      _id: 'user-demo-01',
      id: 'user-demo-01',
      name: 'Alex Vane',
      email: 'alex@novasupply.com',
      password: passwordHash,
      role: 'customer',
      shippingAddress: {
        street: '420 Greenpoint Ave, Loft 3B',
        city: 'Brooklyn',
        state: 'NY',
        zip: '11222',
        country: 'United States'
      },
      createdAt: new Date('2026-01-15T10:00:00.000Z')
    };
    this.users = [demoUser];

    // Pre-seed a past demo order for Alex
    this.orders = [
      {
        _id: 'ord-past-01',
        id: 'ord-past-01',
        orderNumber: 'NOVA-782194',
        user: 'user-demo-01',
        guestEmail: null,
        items: [
          {
            product: 'nova-01',
            name: 'Studio Monitor Headphones Mk. II',
            price: 295,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
            category: 'Audio'
          },
          {
            product: 'nova-05',
            name: 'Architectural Machined Brass Pen',
            price: 68,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1000&auto=format&fit=crop&q=80',
            category: 'Workspace'
          }
        ],
        shippingAddress: {
          fullName: 'Alex Vane',
          email: 'alex@novasupply.com',
          phone: '+1 (555) 234-5678',
          street: '420 Greenpoint Ave, Loft 3B',
          city: 'Brooklyn',
          state: 'NY',
          zip: '11222',
          country: 'United States'
        },
        shippingMethod: {
          id: 'standard',
          name: 'Standard Carbon-Neutral Ground',
          price: 0
        },
        paymentDetails: {
          method: 'demo_simulation',
          status: 'Simulated Paid (Demo)',
          cardLast4: '4242'
        },
        subtotal: 363,
        discount: 0,
        tax: 29.04,
        shippingCost: 0,
        total: 392.04,
        promoCode: null,
        orderStatus: 'Delivered',
        createdAt: new Date('2026-09-20T14:22:00.000Z')
      }
    ];

    this.initialized = true;
    console.log('[MemoryStore] Initialized with 14 sample products and 1 demo user.');
  }

  // --- Products ---
  async getProducts({ search = '', category = '', minPrice, maxPrice, sort = 'featured', limit = 50, page = 1 } = {}) {
    await this.init();
    let result = [...this.products];

    // Filter by Category
    if (category && category !== 'All' && category !== '') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search by Name, subtitle, description
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Price
    if (minPrice !== undefined && minPrice !== null && !isNaN(Number(minPrice))) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null && !isNaN(Number(maxPrice))) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Sort
    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival === a.isNewArrival ? 0 : b.isNewArrival ? 1 : -1));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1));
        break;
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit) || 1
    };
  }

  async getProductByIdOrSlug(idOrSlug) {
    await this.init();
    return this.products.find(p => p.id === idOrSlug || p.slug === idOrSlug || p._id === idOrSlug) || null;
  }

  async decrementStock(productId, quantity) {
    await this.init();
    const prod = this.products.find(p => p.id === productId || p._id === productId);
    if (!prod) return false;
    if (prod.stock < quantity) {
      throw new Error(`Insufficient stock for product ${prod.name}. Available: ${prod.stock}`);
    }
    prod.stock -= quantity;
    return true;
  }

  // --- Users ---
  async getUserByEmail(email) {
    await this.init();
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getUserById(id) {
    await this.init();
    return this.users.find(u => u.id === id || u._id === id) || null;
  }

  async createUser(userData) {
    await this.init();
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: id,
      id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: 'customer',
      shippingAddress: userData.shippingAddress || {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States'
      },
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id, updateData) {
    await this.init();
    const user = await this.getUserById(id);
    if (!user) return null;

    if (updateData.name) user.name = updateData.name;
    if (updateData.shippingAddress) {
      user.shippingAddress = { ...user.shippingAddress, ...updateData.shippingAddress };
    }
    return user;
  }

  // --- Orders ---
  async createOrder(orderData) {
    await this.init();
    const id = `ord-${Date.now()}`;
    const newOrder = {
      _id: id,
      id,
      ...orderData,
      createdAt: new Date()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async getOrdersByUserId(userId) {
    await this.init();
    return this.orders.filter(o => o.user === userId || (o.user && o.user.toString() === userId.toString()));
  }

  async getOrderById(orderId) {
    await this.init();
    return this.orders.find(o => o.id === orderId || o._id === orderId || o.orderNumber === orderId) || null;
  }

  // --- Newsletter / Contact ---
  async addSubscriber(email) {
    await this.init();
    if (!this.subscribers.includes(email.toLowerCase())) {
      this.subscribers.push(email.toLowerCase());
    }
    return { success: true, count: this.subscribers.length };
  }

  async addContact(contactData) {
    await this.init();
    const entry = {
      id: `cnt-${Date.now()}`,
      ...contactData,
      createdAt: new Date()
    };
    this.contacts.push(entry);
    return entry;
  }
}

export const memoryStore = new MemoryStore();
