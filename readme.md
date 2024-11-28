# Expense Tracker App

The **Expense Tracker App** is a web application for managing personal expenses. It allows users to track their daily expenses, categorize them, and analyze statistics related to their spending. The app also supports bulk upload of expenses via CSV files, and it includes an admin role for managing expenses and users.

```
Vercel Deployment Url : https://expense-tracker-app-beryl-pi.vercel.app/

```

## Features

- **User Registration and Authentication**: Users can sign up, log in, and log out. JWT-based authentication is used for securing the endpoints.
- **Expense Management**: Users can add, update, delete, and view their expenses.
- **Admin Features**: Admin users can view all expenses, update or delete any expense, and view all users.
- **Expense Statistics**: Get detailed statistics, such as total expenses per month and category-wise breakdown.
- **File Upload**: Upload expenses in bulk via CSV file.
- **Caching**: Cached data for quicker response times for commonly requested endpoints like all expenses and statistics.
- **Role-Based Access Control**: Access to certain features is restricted based on the user role (Admin or Regular User).

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user and expense data.
- **JWT**: JSON Web Tokens for secure authentication.
- **Mongoose**: MongoDB object modeling tool for working with data in MongoDB.
- **csv-parser**: For parsing CSV files during bulk expense uploads.
- **Redis**: For caching frequently requested data (expenses, statistics).

## Setup and Installation

### Prerequisites

- Node.js and npm should be installed on your machine.
- MongoDB instance should be running (either locally or in the cloud).
- Redis server for caching (optional but recommended for performance).

### Clone the Repository

```bash
git clone https://github.com/Divyesh1692/Expense-Tracker-App.git
cd expense-tracker-app
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
PORT=5000
MONGO_URI=<your-mongodb-connection-uri>
JWT_SECRET=<your-jwt-secret>
REDIS_HOST=<your redis host>
REDIS_PORT=<your redis port>
REDIS_PASS=<your redis password>

```

### Start the Application

```bash
npm start
```

The server will start running on the port defined in your `.env` file (default: 5000).

## API Endpoints

### User Endpoints

#### 1. **POST /user/signup**

- **Description**: Registers a new user.
- **Request Body**:
  - `username` (String) - Required
  - `email` (String) - Required
  - `password` (String) - Required
- **Response**: Success message with user details.

#### 2. **POST /user/login**

- **Description**: Logs in an existing user and returns a JWT token.
- **Request Body**:
  - `email` (String) - Required
  - `password` (String) - Required
- **Response**: Success message with JWT token.

#### 3. **POST /user/logout**

- **Description**: Logs out the user by clearing the JWT token in cookies.
- **Request**: None (requires the user to be authenticated).
- **Response**: Success message.

#### 4. **GET /user/allusers**

- **Description**: Admin-only route to get all users.
- **Request**: JWT token in the Cookies.
- **Response**: List of all users.

---

### Expense Endpoints

#### 1. **GET /expenses/myexpenses**

- **Description**: Retrieves the logged-in user's own expenses.
- **Request**: JWT token in the Cookies.
- **Response**: List of the user's expenses.

#### 2. **GET /expenses/statistics**

- **Description**: Retrieves statistics about the user's expenses, including total expenses per month and category-wise breakdown.
- **Query** : type = monthly or category
- **Request**: JWT token in the Cookies.
- **Response**: Expense statistics.

#### 3. **GET /expenses/allexpenses**

- **Description**: Admin-only route to retrieve all expenses.
- **Request**: JWT token in the Cookies.
- **Response**: List of all expenses.

#### 4. **POST /expenses/add**

- **Description**: Adds a new expense for the logged-in user (also supports bulk upload via CSV).
- **Request**:
  - `title` (String) - Required
  - `amount` (Number) - Required
  - `category` (String) - Required
  - `paymentMethod` (String) - Required
  - `date` (String) - Required
  - `file` (CSV file) - Optional (for bulk upload)
- **Response**: Success message with added expense details.

#### 5. **PATCH /expenses/update/:id**

- **Description**: Updates an existing expense (only for the logged-in user or admin).
- **Request**:
  - `id` (String) - Required
  - Updated expense fields (title, amount, category, paymentMethod, date)
- **Response**: Success message with updated expense details.

#### 6. **DELETE /expenses/delete/:id**

- **Description**: Deletes an expense by its ID (only for the logged-in user or admin).
- **Request**: JWT token in the Cookies.
- **Response**: Success message.

#### 7. **DELETE /expenses/bulkdelete**

- **Description**: Deletes multiple expenses in bulk (only for the logged-in user or admin).
- **Request**: JWT token in the Cookies.
- **Response**: Success message.

---

## Caching

The application uses **Redis** for caching frequently accessed data, such as:

- All expenses for the user.
- Expense statistics.

Cache keys are generated using a prefix, for example:

- `expenses:*` for all expenses.
- `expenses:statistics:*` for statistics data.

Cache is invalidated (deleted) when certain actions are performed, such as:

- Adding, updating, or deleting an expense.

This helps improve the application's performance by reducing database queries for repeated requests.

---

## Error Handling

Common errors returned by the API include:

- `400 Bad Request`: Missing or invalid data.
- `401 Unauthorized`: Missing or invalid JWT token.
- `403 Forbidden`: Access denied for non-admin users.
- `404 Not Found`: Resource not found (user, expense, etc.).
- `500 Internal Server Error`: An unexpected error occurred on the server.

---

## Conclusion

The **Expense Tracker App** is a fully-featured expense management solution that offers both user and admin functionalities. It supports user authentication, expense tracking, and admin management, with caching for performance improvement. By using this app, you can efficiently track your expenses, view statistics, and manage your spending.

---
