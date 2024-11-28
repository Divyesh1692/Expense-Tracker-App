const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Expsense Tracker App API",
    description:
      "The Expense Tracker App is a web application for managing personal expenses. It allows users to track their daily expenses, categorize them, and analyze statistics related to their spending. The app also supports bulk upload of expenses via CSV files, and it includes an admin role for managing expenses and users.",
  },
  host: "https://expense-tracker-app-beryl-pi.vercel.app/",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/userRoutes.js", "./routes/expenseRoute.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
