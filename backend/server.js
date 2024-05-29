const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");
// const app = express();

const port = process.env.PORT || 5000;

// Configurations
dotenv.config();

// Database connection
const db = require("./config/db");
db.connect();

// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use(cookiesParser());

// Routes configurations
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Nodejs server is running....");
});

server.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});
