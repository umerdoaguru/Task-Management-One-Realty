const express = require("express");

const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require("../controllers/EmployeeController");

router.post("/employees", createEmployee);
router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

module.exports = router;