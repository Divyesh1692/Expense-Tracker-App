const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoute");
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);
app.get("/", (req, res) => {
  res.send("Welcome to E-Library Management System");
});

app.listen(PORT, () => {
  console.log("Listening....");
  dbConnect();
});

module.exports = app;
