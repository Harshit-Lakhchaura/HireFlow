const mongoose = require("mongoose");

async function connectDB() {
  mongoose.set("strictQuery", true);
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
      console.log("MongoDB connected");
      return;
    } catch (err) {
      console.warn("Could not reach MONGO_URI:", err.message);
    }
  }

  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri("hireflow"));
  console.log("Using in-memory MongoDB (install Docker or local MongoDB for a persistent database)");
}

module.exports = { connectDB };
