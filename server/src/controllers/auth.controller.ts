import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { dni, email, firstName, lastName, password } = req.body;

    // Optional admin creation using a specific email pattern or we can just let one be manually set in DB.
    // For now, default to user.
    let role = 'user';
    if (email === 'admin@admin.com') {
        role = 'admin';
    }

    const existingUser = await User.findOne({ $or: [{ email }, { dni }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or DNI already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      dni,
      email,
      firstName,
      lastName,
      passwordHash,
      role
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' } // JWT de 1 dia aprox
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, dni: user.dni } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user: { id: req.user._id, email: req.user.email, role: req.user.role, firstName: req.user.firstName, lastName: req.user.lastName, dni: req.user.dni } });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};
