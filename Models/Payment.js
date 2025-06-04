import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  swiftCode: {
    type: String,
    required: true,
    match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/
  },
  date: {
    type: Date,
    default: Date.now
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: String,
    default: null
  }
}, { timestamps: true });


export default mongoose.model('Payment', PaymentSchema);
