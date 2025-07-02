const { db } = require("../db");
const bcrypt = require("bcrypt");


const createEmployee = (req, res) => {
  const { user_name, email,  roles } = req.body;
     // Hash the "password" and "cpassword"
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync('onerealty', saltRounds);
  const sql = "INSERT INTO registered_data (user_name, email, password,  roles) VALUES ( ?, ?, ?, ?)";
  db.query(sql, [user_name, email, hashedPassword,  roles || "Employee"], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Employee created", employeeId: result.insertId });
  });
};
const getalluserdata = async (req, res) => {
  try {
   
    const sql = "SELECT * FROM registered_data WHERE roles = 'Employee'";

    const userdata = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(userdata);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Employees
const getAllEmployees = (req, res) => {
  db.query("SELECT * FROM registered_data WHERE roles = 'Employee'", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get One Employee
const getEmployeeById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM registered_data WHERE user_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.json(results[0]);
  });
};

// Update Employee
const updateEmployee = (req, res) => {
  const id = req.params.id;
  const { user_name, email, roles } = req.body;
  const sql = "UPDATE registered_data SET user_name = ?, email = ?, roles = ? WHERE user_id = ?";
  db.query(sql, [user_name, email, roles, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Employee updated" });
  });
};

// Delete Employee
const deleteEmployee = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM registered_data WHERE user_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Employee deleted" });
  });
};

// Get All Employees
const getAllTaskDetails = (req, res) => {
  const {id} = req.params
  const sql = "SELECT * FROM task_priorities WHERE task_id = ?";
  db.query(sql,[id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
// Get All Employees
const getTaskDetails = (req, res) => {
  db.query("SELECT * FROM task_priorities", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

module.exports = {createEmployee,getalluserdata,updateEmployee,deleteEmployee,getAllEmployees,getEmployeeById,getAllTaskDetails,getTaskDetails}