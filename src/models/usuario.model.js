import mongoose from "mongoose";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  carts:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts"
  },
  role: {
    type: String,
    enum: ["admin", "usuario","premium"],
    default: "usuario",
  },
  resetToken:{
    token: String,
    expires: Date
  },
  documents: [{
      name: String,
      reference: String
    }],
  last_connection: {
    type: Date,
    default: Date.now
  },
});

const UsuarioModel = mongoose.model("usuarios", schema);
export default UsuarioModel;
