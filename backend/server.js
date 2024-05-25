const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");

const app = express();

const port = process.env.PORT || 5000;

// Configurations
dotenv.config();

// Database connection
const db = require("./config/db");
db.connect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes configurations
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Nodejs server is running....");
});

app.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});
