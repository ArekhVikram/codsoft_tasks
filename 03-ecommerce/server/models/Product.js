import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Audio', 'Workspace', 'Living', 'Carry']
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    badge: { type: String, default: null },
    images: [{ type: String }],
    description: { type: String, required: true },
    features: [{ type: String }],
    materials: { type: String },
    dimensions: { type: String },
    shippingInfo: { type: String }
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
