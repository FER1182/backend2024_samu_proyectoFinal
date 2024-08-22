import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
function generateUuid() {
  return uuidv4();
  
}

const schema = new mongoose.Schema({

  code: {
    type: String,
    required: true,
    default: generateUuid,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,    
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser:{
    type: String,
    required: true,
  },
});

const TicketModel = mongoose.model("tickets", schema);
export default TicketModel;
