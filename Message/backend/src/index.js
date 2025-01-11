const express = require("express");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = 5001;
const connectDB = require("./lib/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
  connectDB();
});
