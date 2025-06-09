import React from 'react'

import moment from "moment";
import { useSelector } from 'react-redux';
import MainHeader from '../../pages/MainHeader';
import AdminSider from './AdminSider';

function AdminProfile() {
    const User = useSelector((state) => state.auth.user); 
    console.log(User);
  
    return (
      <>
      
        <MainHeader/>
        <AdminSider />
        <div className="2xl:w-[89%]  2xl:ml-40 mx-4">
        <div className="flex flex-col  lg:flex-row ">
          <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
            <center className="text-2xl text-center mt-[5rem] font-medium">
             Admin Profile
            </center>
            <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
            <div className="flex flex-wrap  mb-4">
              <div className="w-full md:w-2/3 md:mx-0 mx-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-info">User ID</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{User?.id}</p>
                    </div>
                  </div>
  
                  <div>
                    <label className="text-info">Name</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{User?.name}</p>
                    </div>
                  </div>
  
                  <div>
                    <label className="text-info">Email</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{User?.email}</p>
                    </div>
                  </div>
  
                  <div>
                    <label className="text-info">Role</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">{User?.roles}</p>
                    </div>
                  </div>
  
                  <div>
                    <label className="text-info">Created Date</label>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="m-0">
                        {moment(User?.created_date).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        </div>
      </>
    );
  }

export default AdminProfile