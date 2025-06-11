import React from "react";
import Logout from "./Logout";


import LoginProfile from "./LoginProfile";

function MainHeader() {
  return (
    <>
      <div className="w-full fixed print:hidden z-10 top-0  ">
        <nav className="bg-white border-gray-200 dark:bg-gray-800">
          <div className="flex p-1  items-center  justify-between bg-slate-100">
            <a href="#" className="flex items-center mx-2">
              <img
                // src="https://flowbite.com/docs/images/logo.svg"
                src='https://res.cloudinary.com/defq8e7r0/image/upload/v1719917570/company_logo_y0ni8l.png'
                className="mr-4 lg:h-20 rounded-md"
                alt="Flowbite Logo"
              />
           
            </a>
            <div className=""><h2 className="text-2xl">Task Management WebApp</h2></div>
            <div className="flex items-center lg:order-2 mx-3">
              <div className=" mx-4">
              <LoginProfile/>
              </div>

              <div className="">
                <Logout />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default MainHeader;
