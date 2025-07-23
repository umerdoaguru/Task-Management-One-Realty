const express = require("express");

const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, getEmployeeByIdOfTask, updateTaskEmployee, getAllTasksWithPrioritiesByEmployee } = require("../controllers/EmployeeController");
const { getAllTasksByEmployee } = require("../controllers/UserController");

router.post("/employees", createEmployee);
router.get("/employees",authenticate, getAllEmployees);
router.get("/employees/:id",authenticate, getEmployeeById);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);
router.get("/employees-task/:id",authenticate, getEmployeeByIdOfTask);
router.get("/assign-employee/:id",authenticate, getAllTasksByEmployee);
router.put("/edit-employee-task/:id", updateTaskEmployee);
router.get("/employee-task-history/:employeeId",authenticate, getAllTasksWithPrioritiesByEmployee);

module.exports = router;