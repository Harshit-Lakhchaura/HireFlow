const { app } = require("./app");
const { connectDB } = require("./config/db");
const { seedDatabase } = require("./utils/seedDatabase");

const port = process.env.PORT || 5000;

connectDB()
  .then(() => seedDatabase())
  .then(() => {
    app.listen(port, "0.0.0.0", () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
