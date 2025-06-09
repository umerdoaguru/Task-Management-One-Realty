import React from "react";

import {  Route, Routes } from "react-router-dom";

import Categories from "../components/Admin/Categories";





function AdminRoutes() {

  return (
    <>
   
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<Categories />} />
  
      
      </Routes>
    </>
  );
}

export default AdminRoutes;
