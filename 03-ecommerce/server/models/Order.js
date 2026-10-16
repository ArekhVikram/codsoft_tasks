import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  category: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestEmail: { type: String, default: null },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true }
    },
    shippingMethod: {
      id: { type: String, default: 'standard' },
      name: { type: String, default: 'Standard Carbon-Neutral Ground' },
      price: { type: Number, default: 0 }
    },
    paymentDetails: {
      method: { type: String, default: 'demo_simulation' },
      status: { type: String, default: 'Simulated Paid (Demo)' },
      cardLast4: { type: String, default: '4242' }
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: { type: String, default: null },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Dispatched', 'Delivered'],
      default: 'Processing'
    }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
