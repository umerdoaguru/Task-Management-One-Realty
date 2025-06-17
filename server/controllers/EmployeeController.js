const { db } = require("../db");



const createEmployee = (req, res) => {
  const { name, email, password, phone, roles } = req.body;
  const sql = "INSERT INTO employee (name, email, password, phone, roles) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, password, phone, roles || "Employee"], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Employee created", employeeId: result.insertId });
  });
};

// Get All Employees
const getAllEmployees = (req, res) => {
  db.query("SELECT * FROM employee ORDER BY createdTime DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get One Employee
const getEmployeeById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM employee WHERE employeeId = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.json(results[0]);
  });
};

// Update Employee
const updateEmployee = (req, res) => {
  const id = req.params.id;
  const { name, email, password, phone, roles } = req.body;
  const sql = "UPDATE employee SET name = ?, email = ?, password = ?, phone = ?, roles = ? WHERE employeeId = ?";
  db.query(sql, [name, email, password, phone, roles, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Employee updated" });
  });
};

// Delete Employee
const deleteEmployee = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employee WHERE employeeId = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Employee deleted" });
  });
};

// Get All Employees
const getAllTaskDetails = (req, res) => {
  db.query("SELECT * FROM task_priorities WHERE task_id", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

module.exports = {createEmployee,updateEmployee,deleteEmployee,getAllEmployees,getEmployeeById,getAllTaskDetails}