import { isDatabaseConnected } from '../config/db.js';
import { Product } from '../models/Product.js';
import { memoryStore } from '../data/memoryStore.js';

export async function getProducts(req, res, next) {
  try {
    const { category, search, minPrice, maxPrice, sort = 'featured', page = 1, limit = 50 } = req.query;

    if (isDatabaseConnected()) {
      const query = {};

      if (category && category !== 'All' && category !== '') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (search && search.trim() !== '') {
        const q = search.trim();
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { subtitle: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = { isFeatured: -1, createdAt: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      if (sort === 'price-high') sortOptions = { price: -1 };
      if (sort === 'newest') sortOptions = { isNewArrival: -1, createdAt: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        products,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1
      });
    } else {
      const data = await memoryStore.getProducts({
        category,
        search,
        minPrice,
        maxPrice,
        sort,
        page: Number(page),
        limit: Number(limit)
      });

      return res.status(200).json({
        success: true,
        ...data
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    let product = null;
    if (isDatabaseConnected()) {
      product = await Product.findOne({
        $or: [{ id: id }, { slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
    } else {
      product = await memoryStore.getProductByIdOrSlug(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with identifier '${id}' was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req, res, next) {
  try {
    if (isDatabaseConnected()) {
      const categories = await Product.distinct('category');
      return res.status(200).json({ success: true, categories });
    } else {
      await memoryStore.init();
      const set = new Set(memoryStore.products.map(p => p.category));
      return res.status(200).json({ success: true, categories: Array.from(set) });
    }
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(req, res, next) {
  try {
    if (isDatabaseConnected()) {
      const featured = await Product.find({ isFeatured: true }).limit(8);
      const newArrivals = await Product.find({ isNewArrival: true }).limit(8);
      const bestSellers = await Product.find({ isBestSeller: true }).limit(8);
      return res.status(200).json({
        success: true,
        featured,
        newArrivals,
        bestSellers
      });
    } else {
      await memoryStore.init();
      const featured = memoryStore.products.filter(p => p.isFeatured).slice(0, 8);
      const newArrivals = memoryStore.products.filter(p => p.isNewArrival).slice(0, 8);
      const bestSellers = memoryStore.products.filter(p => p.isBestSeller).slice(0, 8);
      return res.status(200).json({
        success: true,
        featured,
        newArrivals,
        bestSellers
      });
    }
  } catch (error) {
    next(error);
  }
}
