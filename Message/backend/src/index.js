const express = require("express");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messageRoutes");
const { app, server } = require("./lib/socket");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const PORT = 5001;
const connectDB = require("./lib/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const dd = require("./seeds/userSeed");
const __dirname = path.resolve();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
// dd();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
  connectDB();
});
