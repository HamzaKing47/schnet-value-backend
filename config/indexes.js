import mongoose from "mongoose";

export const createIndexes = async () => {
  try {
    // User indexes
    await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Valuation indexes
    await mongoose.connection.collection('valuations').createIndex({ userId: 1 });
    await mongoose.connection.collection('valuations').createIndex({ createdAt: -1 });
    
    console.log("Database indexes created");
  } catch (error) {
    console.error("Index creation error:", error);
  }
};