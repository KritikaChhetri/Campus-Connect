const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/testRoutes");
const studentRoutes = require("./routes/studentRoutes");
const requestLogger = require("./middleware/requestLogger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Test Route
app.use("/api/test", testRoutes);

// Student Routes
app.use("/api/students", studentRoutes);

module.exports = app;