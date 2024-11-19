import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Database is already connected");
    return;
  }
  if (connectionState === 2) {
    console.log("connecting");
    return;
  }
  try {
    mongoose.connect(DB_URI!, {
      dbName: "nextauth15",
      bufferCommands: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connect;
