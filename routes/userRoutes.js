const { Router } = require("express");
const {
  signup,
  login,
  logout,
  getAllUsers,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("r/login", login);
userRouter.post("/logout", logout);
userRouter.get("/allusers", auth, getAllUsers);

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user
 *     description: Sign up a new user with the provided credentials.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
userRouter.post("/signup", signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token for authorization.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 */

module.exports = userRouter;
