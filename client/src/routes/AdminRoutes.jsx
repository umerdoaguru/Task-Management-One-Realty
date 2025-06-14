import React from "react";

import {  Route, Routes } from "react-router-dom";

import Categories from "../components/Admin/Categories";
import MainHeader from "../pages/MainHeader";
import AdminSider from "../components/Admin/AdminSider";
import TaskManagement from "../components/Admin/TaskManagement";
import EmployeeManagement from "../components/Admin/EmployeeManagement";
import AdminProfile from "../components/Admin/AdminProfile";





function AdminRoutes() {

  return (
    <>
   <MainHeader/>
   <AdminSider/>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<Categories />} />
        <Route path="/task-management" element={<TaskManagement/>} />
        <Route path="/employee-management" element={<EmployeeManagement/>} />
        <Route path="/admin-profile" element={<AdminProfile />} />
  
      
      </Routes>
    </>
  );
}

export default AdminRoutes;
