const mongoose = require("mongoose");

let connecting;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (connecting) return connecting;
  connecting = _connect().finally(() => {
    connecting = null;
  });
  return connecting;
}

async function _connect() {
  mongoose.set("strictQuery", true);
  const uri = process.env.MONGO_URI || "";
  const onVercel = Boolean(process.env.VERCEL);
  const isLocal = !uri || /localhost|127\.0\.0\.1/.test(uri);

  if (!isLocal) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
    console.log("MongoDB connected");
    return;
  }

  if (onVercel) {
    throw new Error("MONGO_URI must be a MongoDB Atlas connection string on Vercel");
  }

  try {
    await mongoose.connect(uri || "mongodb://127.0.0.1:27017/hireflow", {
      serverSelectionTimeoutMS: 2500,
    });
    console.log("MongoDB connected");
    return;
  } catch (err) {
    console.warn("Could not reach MONGO_URI:", err.message);
  }

  const { MongoMemoryServer } = require("mongodb-memory-server");
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri("hireflow"));
  console.log("Using in-memory MongoDB (install Docker or local MongoDB for a persistent database)");
}

module.exports = { connectDB };
