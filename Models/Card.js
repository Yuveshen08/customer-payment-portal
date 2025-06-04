import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardholder: {
    type: String,
    required: true
  },
  cardnumber: {
    type: String,
    required: true
  },
  expiry: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Card', CardSchema);
