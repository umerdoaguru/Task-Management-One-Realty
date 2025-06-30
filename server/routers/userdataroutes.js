const express = require("express");

const { user_data, register, login, getuserdata, sendOtpSuperAdmin, verifyOtpSuperAdmin, resetPasswordSuperAdmin, deleteContatct, createTask, getAllTasks, getTaskById, updateTask, deleteTask, getAllTasksWithPriorities, getAllTasksByEmployee, getAllTasksList } = require("../controllers/UserController");
const authenticate = require("../Middleware/authMiddleware");
const { getAllTaskDetails, getTaskDetails } = require("../controllers/EmployeeController");
const router = express.Router();






router.post("/register",register);
router.post("/login",login );
router.post("/contact",user_data);
router.get("/user-data",authenticate, getuserdata);
router.delete("/user-data/:id", deleteContatct);

router.post("/sendOtp-superadmin", sendOtpSuperAdmin);
router.post("/verifyOtp-superadmin", verifyOtpSuperAdmin);
router.put("/resetPassword-superadmin",resetPasswordSuperAdmin);


router.post("/tasks", createTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

router.get("/tasks-details/:id", getAllTaskDetails);
router.get("/tasks-details", getTaskDetails);

router.get("/tasks-history", getAllTasksWithPriorities);

router.get("/tasks-employee/:id", getAllTasksByEmployee);

router.get("/all-tasks", getAllTasksList);

module.exports = router;