import {  Routes, Route, Navigate } from 'react-router-dom';
   
import LoginPage from './pages/AdminLoginPage';
import UserLogin from './pages/UserLogin';
import RegisteredAdmin from './pages/RegisteredAdmin';
import RegisteredUser from './pages/RegisteredUser';
import { useSelector } from 'react-redux';
import AdminRoutes from './routes/AdminRoutes';
import EmployeeRoutes from './routes/EmployeeRoutes';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminResetPassword from './pages/AdminResetPassword';
import UserResetPassword from './pages/UserResetPassword';

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    
    <>
    <div className=" overflow-hidden">
    
    <Routes>
        {/* <Route path="/register-doaguru-spark-build" element={<RegisteredAdmin />} /> */}
        <Route path="/register-user" element={<RegisteredUser />} />
      
        {/* <Route path="/admin" element={<AdminLoginPage/>} /> */}
     
        <Route path="/admin-reset-password" element={<AdminResetPassword />} />
        <Route path="/user-reset-password" element={<UserResetPassword />} />

        <Route path="/main_page" element={<UserLogin />} />
               
  {user?.roles === "Admin" && (
    <Route path="/*" element={<AdminRoutes />} />
  )}
  {user?.roles === "Employee" && (
    <Route path="/*" element={<EmployeeRoutes />} />
  )}
  {!user?.roles && <Route path="*" element={<Navigate to="/main_page" />} />}


      </Routes>
      </div>
    </>
    

  );
}

export default App;
