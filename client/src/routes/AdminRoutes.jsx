import React from "react";

import {  Route, Routes } from "react-router-dom";

import Categories from "../components/Admin/Categories";
import MainHeader from "../pages/MainHeader";
import AdminSider from "../components/Admin/AdminSider";
import TaskManagement from "../components/Admin/TaskManagement";
import EmployeeManagement from "../components/Admin/EmployeeManagement";
import AdminProfile from "../components/Admin/AdminProfile";
import Task_Detail from "../components/Admin/Task_Detail";
import TaskHistory from "../components/Admin/TaskHistory";
import AdminDashboard from "../components/Admin/AdminDashboard";
import EmployeeAllDetailTask from "../components/Admin/EmployeeAllDetailTask";
import AllTask from "../components/Admin/AllTask";





function AdminRoutes() {

  return (
    <>
   <MainHeader/>
   <AdminSider/>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin-dashbord" element={<AdminDashboard/>} />
        <Route path="/task-management" element={<TaskManagement/>} />
        <Route path="/employee-management" element={<EmployeeManagement/>} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/task-details/:id" element={<Task_Detail />} />
        <Route path="/task-history" element={<TaskHistory />} />
        <Route path="/employee-alltask/:id" element={<EmployeeAllDetailTask />} />
        <Route path="/task-list" element={<AllTask />} />
  
      
      </Routes>
    </>
  );
}

export default AdminRoutes;
