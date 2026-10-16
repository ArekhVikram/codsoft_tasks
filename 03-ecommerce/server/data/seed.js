import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { sampleProducts } from './seedProducts.js';

async function seed() {
  if (!config.mongoUri) {
    console.error('Error: MONGODB_URI environment variable is required to run standalone database seeding.');
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected for seeding.');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${sampleProducts.length} products.`);

    const existingUser = await User.findOne({ email: 'alex@novasupply.com' });
    if (!existingUser) {
      await User.create({
        name: 'Alex Vane',
        email: 'alex@novasupply.com',
        password: 'Password123!',
        shippingAddress: {
          street: '420 Greenpoint Ave, Loft 3B',
          city: 'Brooklyn',
          state: 'NY',
          zip: '11222',
          country: 'United States'
        }
      });
      console.log('Seeded demo user: alex@novasupply.com / Password123!');
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
