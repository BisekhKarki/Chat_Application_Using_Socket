const express = require("express");
const authRoutes = require("./routes/auth");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = 5001;
const connectDB = require("./lib/db");

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
  connectDB();
});
