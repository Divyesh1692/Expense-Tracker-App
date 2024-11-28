const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Expense Tracker App API",
    description:
      "The Expense Tracker App is a web application for managing personal expenses. It allows users to track their daily expenses, categorize them, and analyze statistics related to their spending. The app also supports bulk upload of expenses via CSV files, and it includes an admin role for managing expenses and users.",
  },
  schemes: ["http", "https"], 
  basePath: "/", 
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/userRoutes.js", "./routes/expenseRoute.js"];

swaggerAutogen(outputFile, routes, doc);
