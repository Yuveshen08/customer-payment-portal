import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './Models/User.js'
import cors from 'cors';
import Card from './Models/Card.js';
dotenv.config();  // Load environment variables
import  jwt  from 'jsonwebtoken';
import Payment from './Models/Payment.js';
import ExpressBrute from 'express-brute';


const app = express(); // Create the Express app
app.use(cors()); // allows all origins
app.use(express.json());
const port = 5000;
// bruite:protects against brute-force attacks on login
const store = new ExpressBrute.MemoryStore();  // Just use the MemoryStore constructor directly
const bruteforce = new ExpressBrute(store, {
  freeRetries: 3,
  minWait: 5 * 60 * 1000,
  maxWait: 60 * 60 * 1000,
  lifetime: 15 * 60,
  failCallback: (req, res, next, nextValidRequestDate) => {
    const minutesUntilNext = Math.ceil((nextValidRequestDate - new Date()) / 60000); // time diff in minutes
  res.status(429).json({
    error: `Too many failed login attempts after 3 attempts. Please try again later in ${minutesUntilNext} minute(s).`,
    nextAttempt: nextValidRequestDate,
    ip: req.ip
  });
   
  }
});

// Test GET route
app.post('/login', bruteforce.prevent, async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect Password' });
//token
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', tokenAUTH: token });

  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Adding fail callback to log brute-force failures



// MongoDB connection setup

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
app.post('/register', [
  body('fullname')
    .matches(/^[A-Za-z\s]{2,50}$/)
    .withMessage('Full name should be 2–50 alphabetic characters'),

  body('idnumber')
    .matches(/^\d{10,13}$/)
    .withMessage('ID Number should be 10–13 digits'),

  body('accountnumber')
    .matches(/^\d{6,16}$/)
    .withMessage('Account Number should be 6–16 digits'),

  body('username')
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username should be 3–20 characters (letters, numbers, underscores)'),

  body('password')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must be at least 8 characters with letters and numbers')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { fullname, idnumber, username, accountnumber, password,role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    const existingId = await User.findOne({ idnumber });
    const existingAcc = await User.findOne({ accountnumber });

    if (existingUser) return res.status(400).json({ msg: 'Username already registered' });
    if (existingId) return res.status(400).json({ msg: 'ID Number already registered' });
    if (existingAcc) return res.status(400).json({ msg: 'Account Number already registered' });

    // SALT & HASH the password using bcrypt
    // bcrypt automatically generates a salt and hashes the password with it
    password = await bcrypt.hash(password, 10); // 10 salt rounds

    const user = new User({ fullname, idnumber, username, accountnumber, password ,role});
    await user.save();

    res.status(201).json({ msg: 'User registered', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Save card details
app.post('/card', async (req, res) => {
  const { cardholder, cardnumber, expiry, cvv,userlog } = req.body;
  
  const existing = await User.findOne( {username:userlog} );
 
  const userId = existing._id;
  
  if (!cardholder || !cardnumber || !expiry || !cvv || !userId) {
    return res.status(400).json({ msg: 'Please fill all fields including user ID' });
  }

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newCard = new Card({ cardholder, cardnumber, expiry, cvv, user: userId });
    await newCard.save();
    res.json({ msg: 'Card details saved and linked to user' });

  } catch (error) {
    res.status(500).json({ msg: 'Server error saving card details' });
  }
});
app.post(
  '/makepayment',

  [

    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('currency').isIn(['USD', 'EUR', 'ZAR']).withMessage('Invalid currency'),
    body('province').notEmpty().withMessage('Province is required'),
    body('swiftCode').matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/).withMessage('Invalid SWIFT code')
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { card, amount, currency, province, swiftCode } = req.body;
      const payment = new Payment({ card, amount, currency, province, swiftCode });
      await payment.save();
      res.status(201).json({ msg: 'Payment recorded successfully', payment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
// GET all payments (for employees)
app.get('/employee/payments', async (req, res) => {
  try {
    const payments = await Payment.find(); // no populate

    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching payments' });
  }
});


