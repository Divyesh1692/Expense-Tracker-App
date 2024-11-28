const csv = require("csv-parser");
const stream = require("stream");
const { getCache, deleteCache, setCache } = require("../utils/cache");
const Expense = require("../models/expenseSchema");

const cacheMiddleware = async (req, res, next) => {
  let { title, category, dateRange, paymentMethod, sort, page, limit } =
    req.query;
  if (!page) page = 1;
  if (!limit) limit = 10;
  const filters = { user: req.user._id };
  if (title) filters.title = title;
  if (category) filters.category = category;
  if (paymentMethod) filters.paymentMethod = paymentMethod;
  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const sortOptions = {};
  if (sort) {
    const [field, order] = sort.split(",");
    sortOptions[field] = order === "desc" ? -1 : 1;
  }

  if (req.baseUrl.includes("/statistics")) {
    const { type } = req.query;
    if (type === "monthly") {
      cacheKey = `expenses:statisticsmonth:${req.user._id}`;
    } else if (type === "category") {
      cacheKey = `expenses:statisticscategory:${req.user._id}`;
    } else {
      return next();
    }
  } else {
    let cacheKey = `expenses:${JSON.stringify(
      filters
    )}:${sort}:${page}:${limit}`;
    console.log("mid cache key: " + cacheKey);
  }
  try {
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    next();
  } catch (err) {
    console.error("Redis cache error:", err);
    next();
  }
};

const getAllExpensesForAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    let { title, category, dateRange, paymentMethod, sort, page, limit } =
      req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const filters = { user: req.user._id };
    if (title) filters.title = title;
    if (category) filters.category = category;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",");
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(",");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }
    const cacheKey = `expenses:${JSON.stringify(
      filters
    )}:${sort}:${page}:${limit}`;
    const expenses = await Expense.find().populate("user", "username email");

    // Cache the result to avoid repeated DB hits
    await setCache(cacheKey, expenses);

    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error("Error fetching expenses for admin:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Get all users for admin

const addExpense = async (req, res) => {
  try {
    const user = req.user;
    console.log("exp user" + user);

    if (req.file) {
      console.log("exp file" + req.file);

      const results = [];
      const buffer = req.file.buffer;
      console.log("buffer: " + buffer);

      const csvStream = new stream.PassThrough();
      csvStream.end(buffer);

      csvStream
        .pipe(csv())
        .on("data", (data) => {
          results.push({
            ...data,
            user: user._id,
          });
        })
        .on("end", async () => {
          try {
            await Expense.insertMany(results);
            res.status(200).json({
              message: "Expenses uploaded successfully!",
              data: results,
            });

            await deleteCache("expenses:*");
          } catch (error) {
            res.status(500).json({
              error: "Failed to save expenses",
              details: error.message,
            });
          }
        });
    } else {
      const { title, amount, date, category, paymentMethod } = req.body;

      if (!title || !amount || !date || !category || !paymentMethod) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newExpense = new Expense({
        title,
        amount,
        date,
        category,
        paymentMethod,
        user: user._id,
      });

      await newExpense.save();
      res
        .status(201)
        .json({ message: "Expense added successfully!", data: newExpense });

      await deleteCache("expenses:*");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to process expense", details: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const user = req.user;
    let { title, category, dateRange, paymentMethod, sort, page, limit } =
      req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const filters = { user: user._id };
    if (title) filters.title = title;
    if (category) filters.category = category;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",");
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(",");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }

    const expenses = await Expense.find(filters)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Expense.countDocuments(filters);

    const data = {
      total,
      page,
      limit,
      expenses,
    };

    const cacheKey = `expenses:${JSON.stringify(
      filters
    )}:${sort}:${page}:${limit}`;
    console.log("cache key: " + cacheKey);

    await setCache(cacheKey, data);

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch expenses", details: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date, category, paymentMethod } = req.body;

    let updatedExpense = await await Expense.findByIdAndUpdate(
      id,
      { title, amount, date, category, paymentMethod },
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res
      .status(200)
      .json({ message: "Expense updated successfully", data: updatedExpense });

    await deleteCache("expenses:*:*:*:*");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update expense", details: error.message });
  }
};

const deleteExpenses = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ error: "Invalid input. Please provide an array of IDs." });
    }

    const deletedExpenses = await Expense.deleteMany({ _id: { $in: ids } });

    if (deletedExpenses.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No expenses found with the provided IDs" });
    }

    res.status(200).json({ message: "Expenses deleted successfully" });

    await deleteCache("expenses:*");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete expenses", details: error.message });
  }
};

const deleteSingleExpense = async (req, res) => {
  try {
    const { id } = req.params;

    let expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res
      .status(200)
      .json({ message: "Expense deleted successfully", expense: expense });

    await deleteCache("expenses:*");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete expense", details: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { type } = req.query;
    const user = req.user;

    const cacheKey =
      type === "monthly"
        ? `expenses:statisticsmonth:${user._id}`
        : `expenses:statisticscategory:${user._id}`;

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        [type === "monthly"
          ? "totalExpensesPerMonth"
          : "categoryWiseBreakdown"]: cachedData,
      });
    }

    let data;
    if (type === "monthly") {
      data = await Expense.aggregate([
        {
          $project: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            amount: 1,
          },
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $project: {
            year: "$_id.year",
            month: "$_id.month",
            totalAmount: 1,
            _id: 0,
          },
        },
      ]);
    } else if (type === "category") {
      data = await Expense.aggregate([
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ]);
    } else {
      return res.status(400).json({
        error:
          "Invalid query parameter. Please specify 'type=monthly' or 'type=category'.",
      });
    }

    await setCache(cacheKey, data, 3600);

    return res.status(200).json({
      [type === "monthly" ? "totalExpensesPerMonth" : "categoryWiseBreakdown"]:
        data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate statistics",
      details: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpenses,
  cacheMiddleware,
  deleteSingleExpense,
  getStatistics,
  getAllExpensesForAdmin,
};
