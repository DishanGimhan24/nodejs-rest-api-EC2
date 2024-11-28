const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const errorHandler = require("./middlewares/errorhandler");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 8000;

// MongoDB connection
mongoose.set("strictQuery", false); // Optional: allows non-strict queries

// Ensure MONGO_DB_URL is set in .env
const uri = process.env.MONGO_DB_URL;

if (!uri) {
  console.error("MONGO_DB_URL is not defined in the .env file");
  process.exit(1); // Exit the app if MONGO_DB_URL is not found
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api/products", (req, res) => {
  return res.status(200).json({
    message: "This is a new feature change, a new route for products",
  });
});

// Error handler
app.use(errorHandler);

// Gracefully handle process termination (e.g., Ctrl+C)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to application termination");
  process.exit(0); // Clean exit
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
