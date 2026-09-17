const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const { seedDatabase } = require("./utils/seedDatabase");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function seed() {
  await connectDB();
  await seedDatabase({ reset: true });
  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
