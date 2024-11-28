const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
dbConnect();
app.use("/user", userRouter);
app.use("/expenses", expenseRouter);
app.get("/", (req, res) => {
  res.send("Welcome to E-Library Management System");
});

// Vercel uses a serverless function, so we need to export the app as a function
module.exports = app;
