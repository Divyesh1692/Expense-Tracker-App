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

/**
 * @swagger
 * /expenses/myexpenses:
 *   get:
 *     summary: Get expenses for the logged-in user
 *     description: Retrieve all expenses for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of expenses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.get("/myexpenses", auth, getExpenses);

/**
 * @swagger
 * /expenses/allexpenses:
 *   get:
 *     summary: Get all expenses (Admin)
 *     description: Get all expenses for the admin user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all expenses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.get("/allexpenses", auth, getAllExpensesForAdmin);

/**
 * @swagger
 * /expenses/add:
 *   post:
 *     summary: Add a new expense
 *     description: Upload an expense record by providing details or a file.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.post("/add", auth, upload.single("file"), addExpense);

/**
 * @swagger
 * /expenses/update/{id}:
 *   patch:
 *     summary: Update an expense
 *     description: Update an expense record by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The expense ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.patch("/update/:id", auth, updateExpense);

/**
 * @swagger
 * /expenses/delete/{id}:
 *   delete:
 *     summary: Delete an expense
 *     description: Delete an expense record by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The expense ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.delete("/delete/:id", auth, deleteSingleExpense);

/**
 * @swagger
 * /expenses/bulkdelete:
 *   delete:
 *     summary: Delete multiple expenses
 *     description: Bulk delete multiple expenses by their IDs.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expenses deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Expenses not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.delete("/bulkdelete", auth, deleteExpenses);

/**
 * @swagger
 * /expenses/statistics:
 *   get:
 *     summary: Get expense statistics
 *     description: Get detailed statistics for expenses, like category-wise and monthly breakdowns.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
expenseRouter.get("/statistics", auth, getStatistics);

module.exports = expenseRouter;
