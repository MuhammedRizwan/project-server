import mongoose from "mongoose";
import configkeys from "../../config";

export const connection =() => {
  mongoose.connect(configkeys.MONGODB_URL);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });
};
