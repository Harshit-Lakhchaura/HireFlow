const { app } = require("../backend/src/app");
const { connectDB } = require("../backend/src/config/db");
const { seedDatabase } = require("../backend/src/utils/seedDatabase");

let ready;

async function boot() {
  if (!ready) {
    ready = connectDB()
      .then(() => seedDatabase())
      .catch((err) => {
        ready = null;
        throw err;
      });
  }
  await ready;
}

function safeMessage(err) {
  return String(err && err.message ? err.message : err).replace(
    /mongodb(\+srv)?:\/\/[^@\s]+@/gi,
    "mongodb://***@"
  );
}

module.exports = async (req, res) => {
  try {
    await boot();
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(503).json({
      message: "Database is not connected.",
      detail: safeMessage(err),
    });
  }
};
