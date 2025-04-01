import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const uri = `mongodb+srv://${process.env.username}:${process.env.password}@cluster0.81joa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const dbConnect = () => {
      mongoose.connect(uri).then(() => {
        console.log('Connected');
      }).catch((err) => {
        console.error('Error :',err);
      })
  };
  export default dbConnect;


