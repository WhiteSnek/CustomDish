import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js"; 

const connectDb = async () => {
  
  try {
    
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}?authSource=admin`);
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log("MongoDb connection error: ", err);
    process.exit(1);
  }
};

export default connectDb;
