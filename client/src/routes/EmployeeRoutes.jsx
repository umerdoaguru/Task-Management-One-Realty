import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";


import UserAccount from "../components/Employee/UserAccount";





function EmployeeRoutes() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <Routes>
          {/* Admin routes */}
     
          <Route path="/" element={<UserAccount />} />
 
        </Routes>
      </div>
    </>
  );
}

export default EmployeeRoutes;
