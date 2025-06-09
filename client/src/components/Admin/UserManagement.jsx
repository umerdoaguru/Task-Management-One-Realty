import React, { useEffect, useState } from 'react'
import MainHeader from '../../pages/MainHeader'
import AdminSider from './AdminSider'
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import  axios  from 'axios';
import moment from 'moment';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import cogoToast from 'cogo-toast';
import { useSelector } from 'react-redux';


function UserManagement() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);

    const [currentLead, setCurrentLead] = useState({
      user_name : "", email : "", phone_no : ""
    
    });

    const usertoken = useSelector((state) => state.auth.user);
    const token = usertoken?.token;
  
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(0);
    const [leadsPerPage, setLeadsPerPage] = useState(10);
 
    const [loading , setLoading] = useState(false)

  
    // Fetch leads and employees from the API
    useEffect(() => {
      fetchUser();
  
      
    }, []);
  
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/user",
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        setUser(response.data);
        console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
 


    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentLead((prevLead) => {
        const updatedLead = { ...prevLead, [name]: value }
       
  
        return updatedLead;
      });
    };
    const handleCreateClick = () => {
      setIsEditing(false);
      setCurrentLead({
        user_name : "", email : "", phone_no : ""
       
      });
      setShowPopup(true);
    };
  
    const handleEditClick = (user) => {
      console.log(user);
      
      setIsEditing(true);
      setCurrentLead({
        ...user,
        
      });
      setShowPopup(true);
    };
  
  
    const handleDeleteClick = async (id) => {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this data?"
      );
      if (isConfirmed) {
        try {
          await axios.delete(`http://localhost:9000/api/user/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
          fetchUser(); // Refresh the list after deletion
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    };
    const validateForm = () => {
      let formErrors = {};
      let isValid = true;
  
      if (!currentLead.user_name) {
        formErrors.user_name = "Name is required";
        isValid = false;
      }
  
      if (!currentLead.email) {
        formErrors.email = "Email is required";
        isValid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(currentLead.email)) {
        formErrors.email = "Email must be a valid '@gmail.com' address";
        isValid = false;
      }
      
  
      if (!currentLead.phone_no) {
        formErrors.phone_no = "Phone No is required";
        isValid = false;
      }
     
  
      setErrors(formErrors);
      return isValid;
    };




    const saveChanges = async () => {

      if (validateForm()) {
      const leadData = {
        ...currentLead,
      
      };
   
        try {
          setLoading(true)
          if (isEditing) {
            // Update existing lead
            await axios.put(
              `http://localhost:9000/api/user/${currentLead.id}`,
              leadData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }}
            );
            fetchUser(); // Refresh the list
            closePopup();
          } else {
            // Create new lead
            await axios.post("http://localhost:9000/api/user-register", leadData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }});
    
            // Construct WhatsApp message link with encoded parameters
         
            fetchUser(); // Refresh the list
            closePopup();
          }
          setLoading(false)
        } 
        catch (error) {
          setLoading(false)
          cogoToast.error(error?.response?.data?.message || "An error occurred");
          
          console.error("Error saving lead:", error);
        }
      }
    };
  
    
  
    const closePopup = () => {
      setShowPopup(false);
      setErrors({});
    };
  

    // Calculate total number of pages
  const pageCount = Math.ceil(user.length / leadsPerPage);
  
  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leadsPerPage === Infinity ? user : user.slice(indexOfFirstLead, indexOfLastLead);
  
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
 
  
    
  
    return (
      <>
        <MainHeader />
        <AdminSider />
        <>
          <div className="2xl:w-[89%]  2xl:ml-40 mx-4 ">
            <div className="main  mt-[6rem]">
              <h1 className="text-2xl text-center font-medium">
                User Management
              </h1>
              <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
  
              {/* Button to create a new lead */}
              <div className="mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 font-medium"
                  onClick={handleCreateClick}
                >
                 Add User 
                </button>
              </div>
           
            </div>

         
  
            <div className=" overflow-x-auto mt-4  ">
           
  
              <table className="min-w-full bg-white border">
               
                <thead>
                  <tr>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      S.no
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                   Name 
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Email Id
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                     Phone Number 
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Role 
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Date
                    </th>
                    
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Action
                    </th>
                  
                 
                  </tr>
                </thead>
                <tbody>
                  {currentLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="15"
                        className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentLeads.map((user, index) => {
                        console.log(user, "fdfsdfsdfsdfds");
                        
                      return (
                        <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                       {index + 1 + currentPage * leadsPerPage}
                        </td>
                        <Link to={`/user-profile-data/${user.id}`} className=''>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold underline text-[blue]">
                          {user.user_name}
                        </td>
                        </Link>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                          {user.phone_no}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                          {user.roles}
                        </td>
                       
                        
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          {moment(user.created_at).format("DD MMM YYYY").toUpperCase()}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditClick(user)}
                          >
                            <BsPencilSquare size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 mx-2"
                            onClick={() => handleDeleteClick(user.id)}
                          >
                            <BsTrash size={20} />
                          </button>
                        </td>
                      
                       
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>
            <div className=" mt-4 mb-3 flex justify-center">
   <ReactPaginate
    previousLabel={"Previous"}
    nextLabel={"Next"}
    breakLabel={"..."}
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName="flex justify-center gap-2"
    
    pageClassName="border rounded cursor-pointer"
    pageLinkClassName="w-full h-full flex items-center justify-center py-2 px-4"
    
    previousClassName="border rounded cursor-pointer"
    previousLinkClassName="w-full h-full flex items-center justify-center py-2 px-3" 
    
    nextClassName="border rounded cursor-pointer"
    nextLinkClassName="w-full h-full flex items-center justify-center py-2 px-3"
    
    breakClassName="border rounded cursor-pointer"
    breakLinkClassName="w-full h-full flex items-center justify-center"
    
    activeClassName="bg-blue-500 text-white border-blue-500"
    disabledClassName="opacity-50 cursor-not-allowed"
  />  
</div>

  
            {showPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[55%] overflow-y-auto">
                  <h2 className="text-xl mb-4">
                    {isEditing ? "Edit User" : "Add User"}
                  </h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      name="user_name"
                      value={currentLead.user_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.user_name ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    />
                       {errors.user_name && (
                    <span className="text-red-500">{errors.user_name}</span>
                  )}
                  </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700">Email Id</label>
                    <input
                      type="email"
                      name="email"
                      value={currentLead.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    />
                     {errors.email && (
                    <span className="text-red-500">{errors.email}</span>
                  )}
                  </div>
                
                
                <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      name="phone_no"
                      value={currentLead.phone_no}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.phone_no ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    />
                     {errors.phone_no && (
                    <span className="text-red-500">{errors.phone_no}</span>
                  )}
                  </div>
                
            
                
              
  
                  <div className="flex justify-end">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                      onClick={saveChanges}  disabled = {loading}
                    >
                       {loading ? 'Save...' : 'Save'}
                    </button>
  
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                      onClick={closePopup}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
             
          </div>
        </>
      </>
    );
  }

export default UserManagement

