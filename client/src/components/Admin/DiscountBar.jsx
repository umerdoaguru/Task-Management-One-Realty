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


function DiscountBar() {
    const navigate = useNavigate();
    const [discount, setDiscount] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const [categories, setCategories] = useState([]);
    const [currentdiscount, setCurrentdiscount] = useState({
        value: "",
        conditions: "",
        offer: ""

    });

  
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(0);
    const [leadsPerPage, setLeadsPerPage] = useState(10);
 
    const [loading , setLoading] = useState(false)
    const token = user?.token;
  
    // Fetch leads and employees from the API
    useEffect(() => {
      fetchDiscount();
   
      
    }, []);
  
    const fetchDiscount = async () => {
      try {
        const response = await axios.get(
          "https://task.dentalguru.software/api/discount",
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }}
        );
        setDiscount(response.data);
        console.log(discount);
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    };
 


    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentdiscount((prevLead) => {
        const updatedLead = { ...prevLead, [name]: value };
  
      
       
  
        return updatedLead;
      });
    };
    const handleCreateClick = () => {
      setIsEditing(false);
      setCurrentdiscount({
        value: "",
        conditions: "",
        offer: ""
       
      });
      setShowPopup(true);
    };
  
    const handleEditClick = (discount) => {
      setIsEditing(true);
      setCurrentdiscount({
        ...discount,
        
      });
      setShowPopup(true);
    };
  
  
    const handleDeleteClick = async (id) => {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this data?"
      );
      if (isConfirmed) {
        try {
          await axios.delete(`https://task.dentalguru.software/api/discount/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
          fetchDiscount(); // Refresh the list after deletion
        } catch (error) {
          console.error("Error deleting discount:", error);
        }
      }
    };

    const validateForm = () => {
      let formErrors = {};
      let isValid = true;
  
      if (!currentdiscount.value) {
        formErrors.value = "Value is required";
        isValid = false;
      }
  
      if (!currentdiscount.conditions) {
        formErrors.conditions = "Conditions To field is required";
        isValid = false;
      }
  
      if (!currentdiscount.offer) {
        formErrors.offer = "Offer is required";
        isValid = false;
      }
      
      setErrors(formErrors);
      return isValid;
    };

    const saveChanges = async () => {
      if (validateForm()) {
      const DiscountData = {
        ...currentdiscount,
      
      };
   
        try {
          setLoading(true)
          if (isEditing) {
            // Update existing lead
            await axios.put(
              `https://task.dentalguru.software/api/discount/${currentdiscount.id}`,
              DiscountData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }}
            );
            fetchDiscount(); // Refresh the list
            closePopup();
          } else {
            // Create new lead
            await axios.post("https://task.dentalguru.software/api/discount", DiscountData,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }});
    
            // Construct WhatsApp message link with encoded parameters
         
            fetchDiscount(); // Refresh the list
            closePopup();
          }
          setLoading(false)
        } 
        catch (error) {
          setLoading(false)
          console.error("Error saving lead:", error);
          cogoToast.error(error?.response?.data?.message || "An error occurred ");

        }
      }
      
    };
  
    
  
    const closePopup = () => {
      setShowPopup(false);
      setErrors({});
    };
  

    // Calculate total number of pages
  const pageCount = Math.ceil(discount.length / leadsPerPage);
  
  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentdiscounts = leadsPerPage === Infinity ? discount : discount.slice(indexOfFirstLead, indexOfLastLead);
  
  
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
                Discount Management
              </h1>
              <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
  
              {/* Button to create a new lead */}
              <div className="mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 font-medium"
                  onClick={handleCreateClick}
                >
                 Add Discount 
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
                    value
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    conditions
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    offer
                    </th>
                    <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Created Date
                    </th>
                   
                      <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                      Action
                    </th>
                  
                 
                  </tr>
                </thead>
                <tbody>
                  {currentdiscounts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="15"
                        className="px-6 py-4 border-b border-gray-200 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    currentdiscounts.map((discount, index) => {
                        console.log(discount, "fdfsdfsdfsdfds");
                        
                      return (
                        <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                       {index + 1 + currentPage * leadsPerPage}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          {discount.value}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          {discount.conditions}
                        </td>
                        
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                          {discount.offer}
                        </td>
                    
                       
                        
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          {moment(discount.created_date).format("DD MMM YYYY").toUpperCase()}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditClick(discount)}
                          >
                            <BsPencilSquare size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 mx-2"
                            onClick={() => handleDeleteClick(discount.id)}
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
                <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[45%] overflow-y-auto">
                  <h2 className="text-xl mb-4">
                    {isEditing ? "Edit Discount" : "Add Discount"}
                  </h2>
               
               
                
                <div className="mb-4">
                    <label className="block text-gray-700">Value</label>
                    <input
                      type="number"
                      name="value"
                      value={currentdiscount.value}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.value ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    />
                     {errors.value && (
                    <span className="text-red-500">{errors.value}</span>
                  )}
                    
                  </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Conditions</label>
                    <input
                      type="text"
                      name="conditions"
                      value={currentdiscount.conditions}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.conditions ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    />
                     {errors.conditions && (
                    <span className="text-red-500">{errors.conditions}</span>
                  )}
                  </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Offer</label>
                    <input
                      type="text"
                      name="offer"
                      value={currentdiscount.offer}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errors.offer ? "border-red-500" : "border-gray-300"
                      } rounded`}
                    />
                     {errors.offer && (
                    <span className="text-red-500">{errors.offer}</span>
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

export default DiscountBar

