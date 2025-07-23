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

// Get One Employee
const getEmployeeByIdOfTask = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM task_priorities WHERE employeeId = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });
    res.json(results);
  });
};

// Update Employee Task
const updateTaskEmployee = (req, res) => {
  const id = req.params.id;
  const { priority_item,status } = req.body;
  const sql = "UPDATE task_priorities SET priority_item = ?, status = ? WHERE id = ?";
  db.query(sql, [priority_item,status,id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Employee Task updated" });
  });
};
const getAllTasksWithPrioritiesByEmployee = (req, res) => {
  const {employeeId} = req.params
  const sql = `             
    SELECT 
      t.id AS task_id,
      t.title,
      t.assigned_to,
      t.due_date,
      t.priority,
      t.created_at,
      p.id AS priority_id,
      p.priority_item,
      p.status,
      p.file
    FROM tasks t
    LEFT JOIN task_priorities p ON t.id = p.task_id WHERE t.employeeId = ?
  `;

  db.query(sql,[employeeId], (err, result) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Format the result: group priorities under each task
    const taskMap = {};

    result.forEach(row => {
      const taskId = row.task_id;

      if (!taskMap[taskId]) {
        taskMap[taskId] = {
          id: taskId,
          title: row.title,
          assigned_to: row.assigned_to,
          due_date: row.due_date,
          priority: row.priority,
          created_at: row.created_at,
          priorities: [],
        }; 
      }

      if (row.priority_id) {
        taskMap[taskId].priorities.push({
          id: row.priority_id,
          priority_item: row.priority_item,
          status: row.status,
          file: row.file,
        });
      }
    });

    const finalResult = Object.values(taskMap);
    res.json(finalResult);
  });
};

module.exports = {createEmployee,getalluserdata,updateEmployee,deleteEmployee,getAllEmployees,getEmployeeById,getAllTaskDetails,getTaskDetails,getEmployeeByIdOfTask,updateTaskEmployee,getAllTasksWithPrioritiesByEmployee}