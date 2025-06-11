import React from "react";

import {  Route, Routes } from "react-router-dom";

import Categories from "../components/Admin/Categories";
import MainHeader from "../pages/MainHeader";
import AdminSider from "../components/Admin/AdminSider";
import TaskManagement from "../components/Admin/TaskManagement";





function AdminRoutes() {

  return (
    <>
   <MainHeader/>
   <AdminSider/>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<Categories />} />
        <Route path="/task-management" element={<TaskManagement/>} />
  
      
      </Routes>
    </>
  );
}

export default AdminRoutes;
