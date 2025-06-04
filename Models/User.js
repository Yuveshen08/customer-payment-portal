import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true,},
  idnumber: { type: String, required: true, unique: true },
  accountnumber: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true,},
});

export default mongoose.model('User', userSchema);