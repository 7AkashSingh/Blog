import mongoose from "mongoose";

const connectDB = async () => {
    try {
            console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("FINAL URI:", `${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${process.env.DB_NAME}`
        );

        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error occurred while connecting DB:", error);
        process.exit(1);
    }
};

export default connectDB;