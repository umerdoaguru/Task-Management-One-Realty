import React, { useEffect, useState } from 'react'
import MainHeader from '../../pages/MainHeader'
import AdminSider from './AdminSider'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import  axios  from 'axios';
import moment from 'moment';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { useSelector } from 'react-redux';

function UserProfileEdit(){
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [userSelection, setUserSelection] = useState([]);
    const {id} = useParams();
  const [currentLead, setCurrentLead] = useState({
    user_id: "",
    name: "",
    email: "",
    plot_area: "",
    project_type: "",
    construction_area: "",
    no_floor: "",
    tower: "",
    balcony: "",
    total_construction_area: "",
    budgest: "",
    
  });
    const [customProjectType, setCustomProjectType] = useState("");


    const currentUser = useSelector(state => state.auth.user);
   
    const token = currentUser?.token;
    

  
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(0);
    const [leadsPerPage, setLeadsPerPage] = useState(10);
 
    const [loading , setLoading] = useState(false)

  
    // Fetch leads and employees from the API
    useEffect(() => {
      fetchUser();
  
      fetchUserSelection();
    }, []);
  
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/user-profile-data/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        setUser(response.data[0]);
        console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
 
    const fetchUserSelection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/user-selection-by-userid-data/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        setUserSelection(response.data);
        console.log(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    const handleCustomProjectTypeChange = (e) => {
      setCustomProjectType(e.target.value);
    };
  
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
  
      // Update the currentLead state
      setCurrentLead((prevLead) => {
        const updatedLead = { ...prevLead, [name]: value };
  
        // Automatically calculate total construction area
        if (
          name === "construction_area" ||
          name === "no_floor" ||
          name === "tower" ||
          name === "balcony"
        ) {
          const constructionArea = parseFloat(updatedLead.construction_area) || 0;
          const noFloor = parseInt(updatedLead.no_floor, 10) || 0;
          const tower = parseFloat(updatedLead.tower) || 0;
          const balcony = parseFloat(updatedLead.balcony) || 0;
  
          updatedLead.total_construction_area =
            constructionArea * noFloor + tower + balcony;
        }
  
        return updatedLead;
      });
    };
  
    const handleEditClick = (user) => {
      setIsEditing(true);
      setCurrentLead({
        ...user,
        
      });
      setShowPopup(true);
    };
  
  
 
    const saveChanges = async () => {
      const UserProfileData = {
        ...currentLead,
        project_type:
          currentLead.project_type === "Other"
            ? customProjectType
            : currentLead.project_type,
            name: user.name,
            email: user.email,
            plot_area: currentLead.plot_area,
            budgest: currentLead.budgest,
            user_id: user.user_id, // Send user.id here
      };

   
        try {
          setLoading(true)
          if (isEditing) {
            // Update existing lead
            await axios.put(
              `http://localhost:9000/api/user-profile/${currentLead.user_id}`,
              UserProfileData
            );
            fetchUser(); // Refresh the list
            closePopup();
          } else {
            // Create new lead
            await axios.post("http://localhost:9000/api/user-register", UserProfileData);
    
            // Construct WhatsApp message link with encoded parameters
         
            fetchUser(); // Refresh the list
            closePopup();
          }
          setLoading(false)
        } 
        catch (error) {
          setLoading(false)
          console.error("Error saving lead:", error);
        }
      
    };
  
    
  
    const closePopup = () => {
      setShowPopup(false);
      setErrors({});
    };
  

    // Calculate total number of pages
  const pageCount = Math.ceil(userSelection.length / leadsPerPage);
  
  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = userSelection.slice(indexOfFirstLead, indexOfLastLead);
  
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };
 
  
    
  
    return (
      <>
        <MainHeader />
        <AdminSider />
        <>
          <div className="2xl:w-[89%]  2xl:ml-40 mx-4 ">
          <div className="mt-[5rem] ">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 max-sm:hidden rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
               <div className="flex flex-col  lg:flex-row ">
                      <div className="flex-grow md:p-4 mt-14 lg:mt-0 sm:ml-0">
                        <center className="text-2xl text-center mt-3 font-medium">
                         User Profile Data
                        </center>
                        <center className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></center>
                        <div className="  mb-4">
                          <div className="w-[90%] ">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                              <div>
                                <label className="text-info">User ID</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.user_id}</p>
                                </div>
                              </div>
              
                              <div>
                                <label className="text-info">Name</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.name}</p>
                                </div>
                              </div>
              
                              <div>
                                <label className="text-info">Email</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.email}</p>
                                </div>
                              </div>
              
                              <div>
                                <label className="text-info">plot_area</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.plot_area}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">project_type</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.project_type}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">construction_area</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.construction_area}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">no_floor</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.no_floor}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">tower</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.tower}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">balcony</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.balcony}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">total_construction_area</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.total_construction_area}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">budgest</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.budgest}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">per_sq_fit</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.per_sq_fit}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-info">after_selection_amount</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">{user?.after_selection_amount}</p>
                                </div>
                              </div>
              
                              <div>
                                <label className="text-info">Created Date</label>
                                <div className="p-2 bg-gray-100 rounded">
                                  <p className="m-0">
                                    {moment(user?.created_date).format("DD/MM/YYYY")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 font-medium"
                  onClick={() => handleEditClick(user)}
                >
                Edit Profile 
                </button>
              </div>
                         
                        </div>
                      </div>
                      
                    </div>
            <div className="main 2xl:w-[89%] mt-[0rem]">
              <h1 className="text-2xl text-center font-medium">
                User Selection Data  
              </h1>
              <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
  
             
           
            </div>

         
  
         <div className=" overflow-auto h-[100vh] w-[90%]   ">
                     <table className="min-w-full bg-white border ">
                       <thead>
                         <tr>
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             S.no
                           </th>
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             Items Id
                           </th>
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             Categories Name
                           </th>
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             Sub Categories Name
                           </th>
                       
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             Items Name
                           </th>
                               
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                           Quantity
                           </th>
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             Total  Price
                           </th>
                     
                           
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                           Image
                           </th>
                           <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                             Date
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
                           currentLeads.map((item, index) => {
                             console.log(item, "fdfsdfsdfsdfds");
         
                             return (
                               <tr
                                 key={index}
                                 className={index % 2 === 0 ? "bg-gray-100" : "" }
                               >
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold">
                                   {index + 1}
                                 </td>
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold">
                                   {item.item_id}
                                 </td>
         
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                                   {item.category_name}
                                 </td>
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                                   {item.subcategory_name}
                                 </td>
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                                   {item.item_name}
                                 </td>
                              
                                
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                                   {item.quantity}
                                 </td>
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                                   {item.total_price}
                                 </td>
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                                 <img
                 src={item.image_items}
                 alt="Preview"
                 className=" w-22 3xl:h-[8rem] xl:h-[7rem] lg:h-[4rem]  object-cover rounded"
               />
                                 </td>
         
                                 <td className="px-6 py-2 border-b border-gray-200 text-gray-800 font-semibold">
                                   {moment(item.created_at)
                                     .format("DD MMM YYYY")
                                     .toUpperCase()}
                                 </td>
                               
                               </tr>
                             );
                           })
                         )}
                       </tbody>
                     </table>
            <div className="2xl:w-[89%] mt-4 mb-3 flex justify-center">
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
                   </div>

  
{showPopup && ( 
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[65%] overflow-y-auto">
                <h2 className="text-xl mb-4">
                  {isEditing ? "Edit User Profile" : "Add User Profile"}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Email Id</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Plot Area</label>
                  <input
                    type="number"
                    name="plot_area"
                    value={currentLead.plot_area}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Construction Area</label>
                  <input
                    type="number"
                    name="construction_area"
                    value={currentLead.construction_area}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Number of Floor</label>
                  <input
                    type="number"
                    name="no_floor"
                    value={currentLead.no_floor}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Tower</label>
                  <input
                    type="number"
                    name="tower"
                    value={currentLead.tower}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">balcony</label>
                  <input
                    type="number"
                    name="balcony"
                    value={currentLead.balcony}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Total Construction Area</label>
                  <input
                    type="number"
                    name="total_construction_area"
                    value={currentLead.total_construction_area}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Project Type</label>
   
                   <select
                    type="text"
                    name="project_type"
                    id="project_type"
                    value={currentLead.project_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>

                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Semi Residential">Semi Residential</option>
                    <option value="Other">Other</option>
                  </select>
                  {currentLead.project_type === "Other" && (
                    <input
                      type="text"
                      value={customProjectType}
                      onChange={handleCustomProjectTypeChange}
                      placeholder="Enter Your Project Type"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Budgest</label>
                  <input
                    type="number"
                    name="budgest"
                    value={currentLead.budgest}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border  rounded`}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges}
                    disabled={loading}
                  >
                    {loading ? "Save..." : "Save"}
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

export default UserProfileEdit