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

app.use("/swagger.json", (req, res) => {
  let host = req.get("host") || process.env.BASE_URL;
  try {
    const dynamicSwaggerDoc = {
      ...swaggerDocument,
      host: host,
    };
    res.json(dynamicSwaggerDoc);
  } catch (error) {
    console.error("Error generating Swagger JSON", error);
    res.status(500).send("Internal Server Error");
  }
});

// Swagger UI route
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: { url: "/swagger.json" },
    explorer: true,
  })
);
app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker App");
});
dbConnect();

// app.listen(PORT, () => {
//   console.log("Listening....");
// });

module.exports = app;
