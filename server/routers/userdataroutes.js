const express = require("express");

const { user_data, register, login, getuserdata, sendOtpSuperAdmin, verifyOtpSuperAdmin, resetPasswordSuperAdmin, deleteContatct, createTask, getAllTasks, getTaskById, updateTask, deleteTask, getAllTasksWithPriorities, getAllTasksByEmployee, getAllTasksList, updateTaskPriorities} = require("../controllers/UserController");
const authenticate = require("../Middleware/authMiddleware");
const { getAllTaskDetails, getTaskDetails } = require("../controllers/EmployeeController");
const upload = require("../config/multerConfig");
const router = express.Router();






router.post("/register",register);
router.post("/login",login );
router.post("/contact",user_data);
router.get("/user-data",authenticate, getuserdata);
router.delete("/user-data/:id", deleteContatct);

router.post("/sendOtp-superadmin", sendOtpSuperAdmin);
router.post("/verifyOtp-superadmin", verifyOtpSuperAdmin);
router.put("/resetPassword-superadmin",resetPasswordSuperAdmin);



router.post("/tasks", upload.array("files"), createTask);
router.put("/task-priorities/:id", upload.single("file"), updateTaskPriorities);
router.get("/tasks",authenticate, getAllTasks);
router.get("/tasks/:id", authenticate, getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

router.get("/tasks-details/:id", authenticate, getAllTaskDetails);
router.get("/tasks-details", authenticate, getTaskDetails);

router.get("/tasks-history", authenticate, getAllTasksWithPriorities);

router.get("/tasks-employee/:id", authenticate, getAllTasksByEmployee);

router.get("/all-tasks", authenticate, getAllTasksList);


module.exports = router;