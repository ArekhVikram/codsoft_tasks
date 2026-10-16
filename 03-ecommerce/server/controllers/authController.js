import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/config.js';
import { isDatabaseConnected } from '../config/db.js';
import { User } from '../models/User.js';
import { memoryStore } from '../data/memoryStore.js';

// Helper to sign JWT
function generateToken(id) {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
}

// Helper to send token response with secure cookie
function sendAuthResponse(user, statusCode, res, message = 'Authenticated successfully') {
  const token = generateToken(user._id || user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax'
  };

  res.cookie('token', token, cookieOptions);

  const safeUser = {
    id: user._id || user.id,
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'customer',
    shippingAddress: user.shippingAddress || {}
  };

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: safeUser
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (isDatabaseConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      return sendAuthResponse(user, 201, res, 'Registration successful. Welcome to NOVA SUPPLY.');
    } else {
      const existing = await memoryStore.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = await memoryStore.createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      return sendAuthResponse(user, 201, res, 'Registration successful. Welcome to NOVA SUPPLY.');
    }
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    let user = null;
    let isMatch = false;

    if (isDatabaseConnected()) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
      isMatch = await user.comparePassword(password);
    } else {
      user = await memoryStore.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    return sendAuthResponse(user, 200, res, 'Signed in successfully.');
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  return res.status(200).json({
    success: true,
    message: 'Signed out successfully.'
  });
}

export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user
  });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, shippingAddress } = req.body;
    const userId = req.user._id || req.user.id;

    let updatedUser;
    if (isDatabaseConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name.trim();
      if (shippingAddress) {
        user.shippingAddress = { ...user.shippingAddress.toObject(), ...shippingAddress };
      }
      await user.save();
      updatedUser = user;
    } else {
      updatedUser = await memoryStore.updateUser(userId, { name, shippingAddress });
    }

    const safeUser = {
      id: updatedUser._id || updatedUser.id,
      _id: updatedUser._id || updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role || 'customer',
      shippingAddress: updatedUser.shippingAddress || {}
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}
