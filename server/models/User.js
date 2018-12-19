// User Model
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  full_name: String,
  email: String,
  password: String,
  age: String,
  gender: String
});
const User = mongoose.model('users', UserSchema);
export default User;
