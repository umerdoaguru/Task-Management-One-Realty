import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";


import UserAccount from "../components/Employee/UserAccount";
import MainHeader from "../pages/MainHeader";
import EmployeeSider from "../components/Employee/EmployeeSider";
import EmployeeDashboard from "../components/Employee/EmployeeDashboard";
import AssignedTask from "../components/Employee/AssignedTask";
import History from "../components/Employee/History";
import Employee_Profile from "../components/Employee/Employee_Profile";
import AssignedTaskDash from "../components/Employee/AssignedTaskDash";
import TaskHistoryDash from "../components/Employee/TaskHistoryDash";
import EmployeeProfileDash from "../components/Employee/EmployeeProfileDash";





function EmployeeRoutes() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
         <MainHeader/>
   <EmployeeSider/>
        <Routes>
          {/* Admin routes */}
     
          <Route path="/" element={<EmployeeDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/assigned-task" element={<AssignedTask />} />
          <Route path="/assigned-task-dash" element={<AssignedTaskDash/>} />
          <Route path="/task-history" element={<History />} />
          <Route path="/task-history-dash" element={<TaskHistoryDash />} />
          <Route path="/employee-profile" element={<Employee_Profile />} />
          <Route path="/employee-profile-dash" element={<EmployeeProfileDash />} />
 
        </Routes>
      </div>
    </>
  );
}

export default EmployeeRoutes;
