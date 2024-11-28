const { Router } = require("express");
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteSingleExpense,
  deleteExpenses,
  cacheMiddleware,
  getStatistics,
  getAllExpensesForAdmin,
} = require("../controllers/expenseController");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");

const expenseRouter = Router();

expenseRouter.get("/myexpenses", auth, cacheMiddleware, getExpenses);
expenseRouter.get("/statistics", auth, cacheMiddleware, getStatistics);
expenseRouter.get(
  "/allexpenses",
  auth,
  cacheMiddleware,
  getAllExpensesForAdmin
);
expenseRouter.post("/add", auth, upload.single("file"), addExpense);
expenseRouter.patch("/update/:id", auth, updateExpense);
expenseRouter.delete("/delete/:id", auth, deleteSingleExpense);
expenseRouter.delete("/bulkdelete", auth, deleteExpenses);

module.exports = expenseRouter;
