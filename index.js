const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/db");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true, // Allow API exploration
    swaggerOptions: {
      docExpansion: "none", // Optionally, control the display of API documentation
    },
  })
);
app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker App");
});

app.listen(PORT, () => {
  console.log("Listening....");
  dbConnect();
});

module.exports = app;
