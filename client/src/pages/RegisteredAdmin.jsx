import React, { useState } from 'react';
import img from '../assets/Task Management One Realty.png';
import { Link, useNavigate } from 'react-router-dom';
import { MdManageAccounts, MdPeople } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import cogoToast from 'cogo-toast'
import axios from 'axios';
                                     
function RegisteredAdmin() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: "Admin",
  });
    const [showPassword, setShowPassword] = useState(false);
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate();
    // const dispatch = useDispatch();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true)
        const res = await axios.post(
          "https://task.dentalguru.software/api/register",
          formData
        );
        if (res.data.success) {
        //   dispatch(loginUser(res.data.user));
          cogoToast.success(res.data.message);
          navigate("/");
        } else {
          cogoToast.error(res.data.message);
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
       
         const errorMessage = error?.response?.data?.message || "An error occurred";
                cogoToast.error(errorMessage);
      }
    };
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  return (
    <div className="container">
    <div className="min-h-screen flex items-center justify-center">
      <section className="vh-100 w-full">
        <div className="flex justify-center items-center h-full">
          <div className="w-full max-w-screen-lg p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <h1 className='text-2xl text-center mt-5 bg-black text-[#ffce08] font-bold font-sans'>SPARK BUILD ESTIMATED WEBAPP</h1>

              <div className="p-8 flex flex-col md:flex-row gap-2">
                {/* Left Section: Image */}
                <div className="w-full md:w-1/2 lg:w-2/3 flex items-center mb-4 md:mb-0">
                  <img
                    src={img}
                    className="w-full h-auto object-cover"
                    alt="Login Illustration"
                  />
                </div>

                {/* Right Section: Login Options */}
                <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center ">
                <div className="w-full max-w-md p-8  h-[30rem] bg-white rounded-lg shadow-2xl">
    
          
        <h1 className="mb-6 text-2xl font-bold text-center">Registered Admin</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your Name"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              required
            />
          </div>
        




          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <AiFillEye className="text-gray-500" />
                ) : (
                  <AiFillEyeInvisible className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
  <label
    htmlFor="name"
    className="block text-sm font-medium text-gray-700"
  >
    Role
  </label>
  <input
    type="text"
    id="roles"
    name="roles"
    value="Admin"
    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    onChange={handleChange}
   
    required
  />
</div>


          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold bg-[black] text-[#ffce08] rounded-md shadow-sm hover:bg-yellow-500 hover:text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled = {loading}
         >
             {loading ? 'Submiting...' : 'Submit'}
          </button>
          

        </form>
      </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div></div>
  );
}

export default RegisteredAdmin;
