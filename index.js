const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker App");
});

app.listen(PORT, () => {
  console.log("Listening....");
  dbConnect();
});

module.exports = app;
