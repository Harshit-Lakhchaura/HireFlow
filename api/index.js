const { app } = require("../backend/src/app");
const { connectDB } = require("../backend/src/config/db");
const { seedDatabase } = require("../backend/src/utils/seedDatabase");

let ready;

async function boot() {
  if (!ready) {
    ready = connectDB().then(() => seedDatabase());
  }
  await ready;
}

module.exports = async (req, res) => {
  try {
    await boot();
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(503).json({
      message:
        "Database is not connected. In Vercel set MONGO_URI to a MongoDB Atlas URL (Network Access: 0.0.0.0/0).",
    });
  }
};
