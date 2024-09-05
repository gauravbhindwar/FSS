import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("connected", (error) => {
      console.log("MongoDB connected successfully " + error);
    });

    connection.on("error", () => {
      console.log("MongoDB connection failed");
      process.exit();
    });
  } catch (error) {
    console.log("MongoDB connection Error");
  }
}
