import mongoose from "mongoose";

export async function connectDB(uri: string) {
  return await mongoose.connect(uri);
}
