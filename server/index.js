const app = require("./app.js");
const mongoose = require("mongoose");
require("dotenv").config();
// environment variables
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

// Connecting to MongoDb database
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("[MONGO_DB] Connected successfully!"))
  .catch((error) =>
    console.error(`[MONGO_DB] Connecting failed! ERROR:`, error)
  );

// Server Listening on PORT
app.listen(PORT, () => {
  console.log(`[SERVER] Running on PORT ${process.env.PORT}`);
});

module.exports = app;
