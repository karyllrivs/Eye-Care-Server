const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const { config } = require("dotenv");
const mongoose = require("mongoose");

config();
const { PORT, MONGODB_URI, MONGODB_NAME } = process.env;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Example routes
app.get('/api/products', (req, res) => {
  // Logic to fetch products
  res.json({ message: "Here are your products" });
});

app.post('/api/login', (req, res) => {
  // Logic for user login
  const { username, password } = req.body;
  res.json({ message: `Logging in ${username}` });
});

// MongoDB connection
mongoose.Promise = Promise;
mongoose
  .connect(MONGODB_URI, { dbName: MONGODB_NAME })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
