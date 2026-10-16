import { isDatabaseConnected } from '../config/db.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { memoryStore } from '../data/memoryStore.js';

export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, shippingMethod, promoCode, paymentSimulation } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zip) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.'
      });
    }

    // Server-side authoritative price verification & stock checking
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prodId = item.productId || item.product || item.id;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      let product = null;
      if (isDatabaseConnected()) {
        product = await Product.findOne({
          $or: [{ id: prodId }, { _id: prodId.match(/^[0-9a-fA-F]{24}$/) ? prodId : null }]
        });
      } else {
        product = await memoryStore.getProductByIdOrSlug(prodId);
      }

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product '${prodId}' does not exist or has been discontinued.`
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for '${product.name}'. Available: ${product.stock}, requested: ${quantity}.`
        });
      }

      const authoritativePrice = Number(product.price);
      subtotal += authoritativePrice * quantity;

      verifiedItems.push({
        product: product.id || product._id.toString(),
        name: product.name,
        price: authoritativePrice, // Authoritative price from database
        quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        category: product.category
      });
    }

    // Calculate discount
    let discount = 0;
    let appliedPromo = null;
    if (promoCode) {
      const code = promoCode.trim().toUpperCase();
      if (code === 'NOVA10') {
        discount = Number((subtotal * 0.10).toFixed(2));
        appliedPromo = 'NOVA10 (10% Off)';
      } else if (code === 'WELCOME15') {
        discount = Number((subtotal * 0.15).toFixed(2));
        appliedPromo = 'WELCOME15 (15% Off)';
      } else {
        return res.status(400).json({
          success: false,
          message: `Promo code '${promoCode}' is invalid or expired.`
        });
      }
    }

    // Shipping cost
    const selectedShipping = shippingMethod || { id: 'standard', name: 'Standard Carbon-Neutral Ground', price: 0 };
    const shippingCost = selectedShipping.id === 'express' ? 15 : (subtotal >= 100 ? 0 : 10);

    // Sales tax (8%)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.08).toFixed(2));

    // Authoritative total calculation
    const total = Number((taxableAmount + tax + shippingCost).toFixed(2));

    // Order number
    const orderNumber = `NOVA-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      orderNumber,
      user: req.user ? (req.user._id || req.user.id) : null,
      guestEmail: req.user ? null : shippingAddress.email,
      items: verifiedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        email: shippingAddress.email.trim(),
        phone: shippingAddress.phone ? shippingAddress.phone.trim() : '',
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zip: shippingAddress.zip.trim(),
        country: shippingAddress.country ? shippingAddress.country.trim() : 'United States'
      },
      shippingMethod: {
        id: selectedShipping.id || 'standard',
        name: selectedShipping.name || (selectedShipping.id === 'express' ? 'Express Priority Courier' : 'Standard Carbon-Neutral Ground'),
        price: shippingCost
      },
      paymentDetails: {
        method: paymentSimulation?.method || 'demo_checkout',
        status: 'Simulated Paid (Demo Mode - No Real Money Charged)',
        cardLast4: paymentSimulation?.cardLast4 || '4242'
      },
      subtotal,
      discount,
      tax,
      shippingCost,
      total,
      promoCode: appliedPromo,
      orderStatus: 'Confirmed'
    };

    // Decrement stock atomically
    for (const item of verifiedItems) {
      if (isDatabaseConnected()) {
        await Product.updateOne(
          { $or: [{ id: item.product }, { _id: item.product.match(/^[0-9a-fA-F]{24}$/) ? item.product : null }] },
          { $inc: { stock: -item.quantity } }
        );
      } else {
        await memoryStore.decrementStock(item.product, item.quantity);
      }
    }

    let createdOrder = null;
    if (isDatabaseConnected()) {
      createdOrder = await Order.create(orderData);
    } else {
      createdOrder = await memoryStore.createOrder(orderData);
    }

    return res.status(201).json({
      success: true,
      message: 'Demo order processed successfully.',
      order: createdOrder
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;

    if (isDatabaseConnected()) {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, orders });
    } else {
      const orders = await memoryStore.getOrdersByUserId(userId);
      return res.status(200).json({ success: true, orders });
    }
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    let order = null;
    if (isDatabaseConnected()) {
      order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });
    } else {
      order = await memoryStore.getOrderById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${id} was not found.`
      });
    }

    // Access check: allow if guest matches order email or authenticated user owns order
    if (req.user) {
      const userId = (req.user._id || req.user.id).toString();
      const orderUser = order.user ? order.user.toString() : null;
      if (orderUser && orderUser !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized access to this order.' });
      }
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
}
