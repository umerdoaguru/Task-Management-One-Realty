import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";


import UserAccount from "../components/Employee/UserAccount";
import MainHeader from "../pages/MainHeader";
import EmployeeSider from "../components/Employee/EmployeeSider";





function EmployeeRoutes() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
         <MainHeader/>
   <EmployeeSider/>
        <Routes>
          {/* Admin routes */}
     
          <Route path="/" element={<UserAccount />} />
 
        </Routes>
      </div>
    </>
  );
}

export default EmployeeRoutes;
