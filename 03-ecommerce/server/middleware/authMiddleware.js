import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { isDatabaseConnected } from '../config/db.js';
import { User } from '../models/User.js';
import { memoryStore } from '../data/memoryStore.js';

export async function protect(req, res, next) {
  let token = null;

  // 1. Check cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (isDatabaseConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User account no longer exists.' });
      }
      req.user = user;
    } else {
      const user = await memoryStore.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User account no longer exists.' });
      }
      const safeUser = { ...user };
      delete safeUser.password;
      req.user = safeUser;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication session expired or invalid. Please sign in again.'
    });
  }
}

// Optional auth: sets req.user if token is present, continues either way
export async function optionalAuth(req, res, next) {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (isDatabaseConnected()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      const user = await memoryStore.getUserById(decoded.id);
      if (user) {
        const safeUser = { ...user };
        delete safeUser.password;
        req.user = safeUser;
      }
    }
  } catch (e) {
    req.user = null;
  }
  next();
}
