const express = require("express");
const { db } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer')

const register = async (req, res) => {
  try {
    const { user_name, email,password,roles } = req.body;

    // Validations
    const requiredFields = [user_name, email, password,roles];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the "password" and "cpassword"
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM registered_data WHERE email = ?";

    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        console.error("Error checking if user exists in MySQL:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        // Check if there are any rows in the result
        if (result.length > 0) {
          return res.status(400).json({
            error: "User already exists.",
          });
        } else {
          // User not found, proceed with registration
          const insertUserQuery = `
            INSERT INTO registered_data  (
              user_name, email,password,roles
            ) VALUES (?, ?, ?,?)
          `;

          const insertUserParams = [user_name, email,hashedPassword,roles];

          db.query(
            insertUserQuery,
            insertUserParams,
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting user:", insertErr);
                res.status(500).json({ error: "Internal server error" });
              } else {
                console.log("User registered successfully");
                return res.status(200).json({
                  success: true,
                  message: "User registered successfully",
                });
              }
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
     const {email, password} = req.body

     //Validation 
     if(!email || !password){
      return res.status(404).send({
        success: false,
        message: "Invaild email or password ",
      });
     }
     // check user in mysql 
     const checkUserQuery = "SELECT * FROM registered_data WHERE email =?";
     db.query(checkUserQuery,[email],async(err,results)=>{
      if(err){
        console.log("Error checking  user in mysql",err);
      }
      if(results.length===0){
        return res.status(404).send({
          success:false,
          message:"email is not  registered"
        })
      
      }
      const user = results[0];
    

      //compare  passwords
      const match = await bcrypt.compare(password,user.password);
      if(!match){
        return  res.status(404).send({
          success: false,
          message: "Invaild password ",
        });
        
        
      }
     
     //generate  token 
     const token = await JWT.sign({id: user.user_id}, process.env.JWT_SECRET,{ expiresIn: "7d"});

     res.status(200).send({
      success: true,
      message : "Login sucessfully",
      user:{
        id: user.user_id,
        name:user.user_name,
        email:user.email,
        token: token,
        roles:user.roles,
       
      },
     });
    });
    }

  catch (error) {
  console.log(error);
  res.status(500).send({success:false , message:"error in login ", error})
  }
};

const getuserdata = async (req, res) => {
  try {
   
    const sql = "SELECT * FROM contact  ORDER BY id DESC";

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


const user_data = async (req, res) => {
  
    const {
    
    		name,	email, mobile_no,	subject,address,	message	

    } = req.body;
    
  
    const sql = `INSERT INTO contact (name,email,mobile_no,subject,address,message) VALUES (?,?,?,?,?,?)`;
    db.query(
      sql,
      [
        name,	email,	mobile_no,subject,address,	message	
  
      ],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: "Error of Data" });
        } else {
          res.status(201).json({
            success: true,
            message: "Thank you for submitting the form! Our team will connect with you as soon as possible. ",
          });
        }
      }
    );
  };

  // smtp code 
  // const user_data = async (req, res) => {
  //   const { name, email, mobile_no, subject, message } = req.body;
  
  //   const sql = `INSERT INTO contact (name, email, mobile_no, subject, message) VALUES (?, ?, ?, ?, ?)`;
  //   db.query(sql, [name, email, mobile_no, subject, message], (err, results) => {
  //     if (err) {
  //       return res.status(500).json({ error: "Error of Data" });
  //     }
  
  //     res.status(201).json({
  //       success: true,
  //       message: "Thank you for submitting the form! Our team will connect with you as soon as possible.",
  //     });
  
  //     const transporter = nodemailer.createTransport({
  //       host: 'mail.one-realty.in',
  //       port: 465,
  //       secure: true, // Use SSL
  //       auth: {
  //         user: 'info@one-realty.in',
  //         pass: 'onerealty@123',
  //       },
  //     });
  
  //     const mailOptions = {
  //       from: 'info@one-realty.in',
  //       to: 'umerqureshi786786@gmail.com',
  //       subject: 'One Realty Website Query/Contact Detailed From one-realty.in',
  //       text: `Name: ${name}\nEmail: ${email}\nMobile No.: ${mobile_no}\nSubject: ${subject}\nMessage: ${message}`,
  //     };
  
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log('Email sent: ' + info.response);
  //       }
  //     });
  //   });
  // };

  const deleteContatct = (req, res) => {
    const { id } = req.params;
  
    // Basic validation
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
  
    const sql = `DELETE FROM contact WHERE id = ?`;
  
    db.query(sql, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error deleting contact data" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Conatct Data not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Conatct Data deleted successfully" });
      }
    });
  };

  
const sendOtpSuperAdmin = (req, res) => {
  const { email } = req.body;

  const selectQuery = "SELECT * FROM registered_data WHERE email = ?";

  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    } else {
      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, message: "Email not found" });
        
      } 
      else {
        
        
        
        // Random OTP generation
        function generateOTP(length) {
          const chars = "0123456789";
          let otp = "";

          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            otp += chars[randomIndex];
          }

          return otp;
        }

        const OTP = generateOTP(6);    

        try {
          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.EMAILSENDER,
              pass: process.env.EMAILPASSWORD,
            },
          });
          

          const mailOptions = {
            from: process.env.EMAILSENDER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${OTP}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
              return res.status(500).json("An error occurred while sending the email.");
            } else {
              console.log("OTP sent:", info.response);

              const updateQuery = "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
              db.query(updateQuery, [email, OTP], (upErr, upResult) => {
                if (upErr) {
                  return res.status(400).json({ success: false, message: upErr.message });
                }
                return res.status(200).json({ message: "OTP sent successfully" });
              });
            }
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json("An error occurred.");
        }

        // try {
            
        //   const transporter = nodemailer.createTransport({
        //    host: 'mail.one-realty.in',
        //    port: 465,
        //    secure: true, // Use SSL
        //    auth: {
        //     user: 'info@one-realty.in',
        //     pass: 'onerealty@123',
        //    },
        //  });
            
      
        //     const mailOptions = {
        //       from: 'info@one-realty.in',
        //       to: email,
        //       subject: "Admin Password Reset OTP",
        //       text: `Your OTP for password reset is: ${OTP}`,
        //     };
      
        //     transporter.sendMail(mailOptions, (error, info) => {
        //       if (error) {
        //         console.error(error);
        //         return res.status(500).json("An error occurred while sending the email.");
        //       } else {
        //         console.log("OTP sent:", info.response);
      
        //         const updateQuery = "INSERT INTO otpcollections (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE code = VALUES(code)";
        //         db.query(updateQuery, [email, OTP], (upErr, upResult) => {
        //           if (upErr) {
        //             return res.status(400).json({ success: false, message: upErr.message });
        //           }
        //           return res.status(200).json({ message: "OTP sent successfully" });
        //         });
        //       }
        //     });
        //   } catch (error) {
        //     console.log(error);
        //     return res.status(500).json("An error occurred.");
        //   }
     
    }
    }
  });
};

const verifyOtpSuperAdmin = (req, res) => {
  try {
    const { email, otp } = req.body;
    db.query(
      "SELECT * FROM otpcollections WHERE email = ? AND code = ?",
      [email, otp],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        if (result.length > 0) {
          return res
            .status(200)
            .json({ success: true, message: "Otp verification  success" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Invalid email or OTP" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPasswordSuperAdmin = (req, res) => {
  try {
    const { email, password } = req.body;

    const selectQuery =
      "SELECT * FROM registered_data WHERE email = ?";
    db.query(selectQuery, email, (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      if (result && result.length) {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        console.log(hashedPassword);
        const updateQuery = `UPDATE registered_data SET password = ? WHERE email = ?`;
        db.query(updateQuery, [hashedPassword, email], (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: err.message });
          } else {
            return res.status(200).json({
              success: true,
              message: "Details updated successfully",
            });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "email not found" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const createTask = (req, res) => {
  const { title, assigned_to, due_date, priority, taskpriorities,employeeId } = req.body;

  const taskSql = "INSERT INTO tasks (title, assigned_to, due_date, priority,employeeId) VALUES (?, ?, ?, ?,?)";
  const taskValues = [title, assigned_to, due_date, priority,employeeId];

  db.query(taskSql, taskValues, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const taskId = result.insertId;

    const prioritySql = "INSERT INTO task_priorities (task_id, priority_item,employeeId) VALUES ?";
    const priorityValues = taskpriorities.map(item => [taskId, item,employeeId]);

    db.query(prioritySql, [priorityValues], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.status(201).json({ message: "Task created successfully", taskId });
    });
  });
};


const getAllTasks = (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get Task by ID
const getTaskById = (req, res) => {
  const taskId = req.params.id;

  const taskSql = "SELECT * FROM tasks WHERE id = ?";
  db.query(taskSql, [taskId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Task not found" });

    const task = result[0];

    const prioritySql = "SELECT priority_item FROM task_priorities WHERE task_id = ?";
    db.query(prioritySql, [taskId], (err2, priorityResults) => {
      if (err2) return res.status(500).json({ error: err2 });

      task.taskpriorities = priorityResults.map(p => p.priority_item);
      res.json(task);
    });
  });
};

// Update Task
const updateTask = (req, res) => {
  const taskId = req.params.id;
  const { title, assigned_to, employeeId, due_date, priority } = req.body;

  // Update the task table
  const updateSql = `
    UPDATE tasks 
    SET title = ?, assigned_to = ?, employeeId = ?, due_date = ?, priority = ? 
    WHERE id = ?
  `;
  const values = [title, assigned_to, employeeId, due_date, priority, taskId];

  db.query(updateSql, values, (err) => {
    if (err) return res.status(500).json({ error: err });

    // Also update employeeId in task_priorities table for the same task
    const updatePrioritySql = `
      UPDATE task_priorities 
      SET employeeId = ? 
      WHERE task_id = ?
    `;

    db.query(updatePrioritySql, [employeeId, taskId], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.json({ message: "Task and task priorities updated successfully" });
    });
  });
};


// Delete Task
const deleteTask = (req, res) => {
  const taskId = req.params.id;

  // Step 1: Delete related priorities first
  const deletePrioritySql = "DELETE FROM task_priorities WHERE task_id = ?";
  db.query(deletePrioritySql, [taskId], (err1) => {
    if (err1) return res.status(500).json({ error: err1 });

    // Step 2: Delete the task
    const deleteTaskSql = "DELETE FROM tasks WHERE id = ?";
    db.query(deleteTaskSql, [taskId], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.json({ message: "Task and its priorities deleted successfully" });
    });
  });
};


  const getAllTasksWithPriorities = (req, res) => {
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
        p.createdTime
      FROM tasks t
      LEFT JOIN task_priorities p ON t.id = p.task_id
    `;

    db.query(sql, (err, result) => {
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
            createdTime: row.createdTime,
          });
        }
      });

      const finalResult = Object.values(taskMap);
      res.json(finalResult);
    });
  };


const getAllTasksByEmployee = (req, res) => {
  const employeeId = req.params.id;

  const sql = `
    SELECT 
      t.id AS task_id,
      t.title,
      t.assigned_to,
      t.due_date,
      t.priority AS task_priority,
      t.employeeId,
      tp.id AS priority_id,
      tp.priority_item,
      tp.status,
      tp.createdTime
    FROM tasks t
    LEFT JOIN task_priorities tp ON t.id = tp.task_id
    WHERE t.employeeId = ?
  `;

  db.query(sql, [employeeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Group results by task
    const taskMap = {};

    results.forEach(row => {
      if (!taskMap[row.task_id]) {
        taskMap[row.task_id] = {
          id: row.task_id,
          title: row.title,
          assigned_to: row.assigned_to,
          due_date: row.due_date,
          priority: row.task_priority,
          employeeId: row.employeeId,
          task_priorities: [],
        };
      }

      if (row.priority_id) {
        taskMap[row.task_id].task_priorities.push({
          id: row.priority_id,
          priority_item: row.priority_item,
          status: row.status,
          createdTime: row.createdTime,
        });
      }
    });

    const tasksWithPriorities = Object.values(taskMap);

    res.json(tasksWithPriorities);
  });
};

const getAllTasksList = (req, res) => {


  const sql = `
    SELECT 
      t.id AS task_id,
      t.title,
      t.assigned_to,
      t.due_date,
      t.priority AS task_priority,
      t.employeeId,
      tp.id AS priority_id,
      tp.priority_item,
      tp.status,
      tp.createdTime
    FROM tasks t
    LEFT JOIN task_priorities tp ON t.id = tp.task_id
   
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Group results by task
    const taskMap = {};

    results.forEach(row => {
      if (!taskMap[row.task_id]) {
        taskMap[row.task_id] = {
          id: row.task_id,
          title: row.title,
          assigned_to: row.assigned_to,
          due_date: row.due_date,
          priority: row.task_priority,
          employeeId: row.employeeId,
          task_priorities: [],
        };
      }

      if (row.priority_id) {
        taskMap[row.task_id].task_priorities.push({
          id: row.priority_id,
          priority_item: row.priority_item,
          status: row.status,
          createdTime: row.createdTime,
        });
      }
    });

    const tasksWithPriorities = Object.values(taskMap);

    res.json(tasksWithPriorities);
  });
};




  
  module.exports = {user_data,getuserdata,register,login,sendOtpSuperAdmin,verifyOtpSuperAdmin,resetPasswordSuperAdmin,deleteContatct,createTask,updateTask,deleteTask,getAllTasks,getTaskById,getAllTasksWithPriorities,getAllTasksByEmployee,getAllTasksList,};