import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connection established")
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
    
}  
export default connectDB;