import React, { useState, useEffect } from "react";
import axios from "axios";

import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";

import cogoToast from "cogo-toast";
import { AiOutlineClose } from 'react-icons/ai';

function TaskMangement() {
  const navigate = useNavigate();
  const [task, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filterText, setFilterText] = useState('');


  const [currentLead, setCurrentLead] = useState({
    title: "",
    assigned_to: "",
    priority: "",
    employeeId:"",
    due_date: "",
  });

  const usertoken = useSelector((state) => state.auth.user);
  const token = usertoken?.token;

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [priorityFields, setPriorityFields] = useState([]);




  // Fetch leads and employees from the API
  useEffect(() => {
    fetchTask();
    fetchEmployees();
  }, []);

  const fetchTask = async () => {
    try {
      const response = await axios.get("https://task.dentalguru.software/api/all-tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
      console.log(task);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };
    const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://task.dentalguru.software/api/employees",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployees(response.data);
      console.log(employees);
      
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };
    // If assigned_to changes, update employeeId and employeephone accordingly
      if (name === "assigned_to") {
        const selectedEmployee = employees.find(
          (employee) => employee.user_name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.user_id;
         
        } else {
          updatedLead.employeeId = ""; // Reset if no match
         
        }
      }
      return updatedLead;
    });
  };
  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentLead({
      title: "",
      assigned_to: "",
      priority: "",
      employeeId:"",
      due_date: "",
    });
    setShowPopup(true);
  };

  const handleEditClick = (task) => {
    console.log(task);

    setIsEditing(true);
    setCurrentLead({
      ...task,
      due_date: moment(task.due_date).format("YYYY-MM-DD"), // Format the due_date
    });

    
    setShowPopup(true);
  };
console.log(currentLead);

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`https://task.dentalguru.software/api/tasks/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        fetchTask(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  const addPriorityField = () => {
  const newField = {
  id: Date.now(),
  value: '',
  file: null
};

  setPriorityFields([...priorityFields, newField]);
};
const removePriorityField = (fieldId) => {
  setPriorityFields(priorityFields.filter(field => field.id !== fieldId));
};

// Function to handle priority field value changes
const handlePriorityFieldChange = (fieldId, newValue) => {
  setPriorityFields(priorityFields.map(field => 
    field.id === fieldId ? { ...field, value: newValue } : field
  ));
};

const handleFileChange = (fieldId, file) => {
  setPriorityFields(fields =>
    fields.map(field =>
      field.id === fieldId ? { ...field, file } : field
    )
  );
};

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.title) {
      formErrors.title = "title is required";
      isValid = false;
    }

    if (!currentLead.assigned_to) {
      formErrors.assigned_to = "Employee is required";
      isValid = false;
    } 

    if (!currentLead.priority) {
      formErrors.priority = "Priority is required";
      isValid = false;
    }
    
    if (!currentLead.due_date) {
      formErrors.due_date = "due_date is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

const saveChanges = async () => {
  if (validateForm()) {
    const formData = new FormData();
    formData.append("title", currentLead.title);
    formData.append("assigned_to", currentLead.assigned_to);
    formData.append("priority", currentLead.priority);
    formData.append("due_date", currentLead.due_date);
    formData.append("employeeId", currentLead.employeeId);

    const priorities = priorityFields.map(field => ({
      value: field.value,
    }));

    formData.append("taskpriorities", JSON.stringify(priorities));

    priorityFields.forEach(field => {
      if (field.file) {
        formData.append("files", field.file);
      }
    });

  try {
        setLoading(true);
        
        
        if (isEditing) {
          // Update existing lead
              const updateData = {
          title: currentLead.title,
          assigned_to: currentLead.assigned_to,
          priority: currentLead.priority,
          due_date: currentLead.due_date,
          employeeId: currentLead.employeeId,
        };
        console.log(updateData);
        

          await axios.put(
            `https://task.dentalguru.software/api/tasks/${currentLead.id}`,
            updateData,
            {
              headers: {
               "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          fetchTask(); // Refresh the list
           setPriorityFields([]);
          closePopup();
        } else {
          // Create new lead
          await axios.post(
            "https://task.dentalguru.software/api/tasks",
            formData,
            {
              headers: {
               "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Construct WhatsApp message link with encoded parameters

          fetchTask(); // Refresh the list
          closePopup();
          setPriorityFields([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        cogoToast.error(error?.response?.data?.message || "An error occurred");

        console.error("Error saving lead:", error);
      }
    }
};


  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
     setPriorityFields([]);
  };
const filteredTasks = task.filter((t) =>
  (t.title || "").toLowerCase().includes((filterText || "").trim().toLowerCase()) ||
  (t.assigned_to || "").toLowerCase().includes((filterText || "").trim().toLowerCase())
);


  // Calculate total number of pages
const pageCount = Math.ceil(filteredTasks.length / leadsPerPage);

  // Pagination logic
  const indexOfLastLead = (currentPage + 1) * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
const currentLeads =
  leadsPerPage === Infinity
    ? filteredTasks
    : filteredTasks.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  

  return (
    <>
    
      <>
        <div className="2xl:w-[89%]  2xl:ml-40 mx-4 ">
          <div className="main  mt-[6rem]">
            <h1 className="text-2xl text-center font-medium">
              Task Management
            </h1>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

            {/* Button to create a new lead */}
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Task
              </button>
            </div>
          </div>
          <div className="mb-4">
  <input
    type="text"
    placeholder="Search by Title or Employee..."
    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
  />
</div>


          <div className=" overflow-x-auto mt-4  ">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    S.no
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                   Title
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Assigned To
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Priority
                  </th>
                
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Due Date
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
                        <Link to={`/task-details/${user.id}`} className="">
                          <td className="px-6 py-4 border-b border-gray-200 font-semibold underline text-[blue]">
                            {user.title}
                          </td>
                        </Link>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                          {user.assigned_to}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                          {user.priority}
                        </td>
                        
                 
                


                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                          {moment(user.due_date)
                            .format("DD MMM YYYY")
                            .toUpperCase()}
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
                    );
                  })
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
    <div className="w-full max-w-lg p-6 mx-2 bg-white rounded-lg shadow-lg h-[65%] overflow-y-auto">
      <h2 className="text-xl mb-4">
        {isEditing ? "Edit Task" : "Add Task"}
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={currentLead.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
        {errors.title && (
          <span className="text-red-500">{errors.title}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Assigned To</label>
         <select
          type="text"
          name="assigned_to"
          value={currentLead.assigned_to}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${
            errors.assigned_to ? "border-red-500" : "border-gray-300"
          } rounded`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.user_id} value={employee.user_name}>
                        {employee.user_name}
                      </option>
                    ))}
                  </select>
        {errors.assigned_to && (
          <span className="text-red-500">{errors.assigned_to}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Priority</label>
        <select
          name="priority"
          value={currentLead.priority}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Urgent">Urgent</option>
        </select>
        {errors.priority && (
          <span className="text-red-500">{errors.priority}</span>
        )}
      </div>

      {/* Dynamic Priority Fields Section */}
           {isEditing ? '' : 
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700">Task Priorities</label>
          <button
            type="button"
            onClick={addPriorityField}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            + Add Priority
          </button>
        </div>
   
        {priorityFields.map((field, index) => (
          <div key={field.id} className="flex items-center mb-2">
           <button
              type="button"
              onClick={() => removePriorityField(field.id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
          
          <AiOutlineClose/>
            </button>  <input
              type="text"
              value={field.value}
              onChange={(e) => handlePriorityFieldChange(field.id, e.target.value)}
              placeholder={`Priority ${index + 1}`}
              className="flex-1 mx-2 px-3 py-2 border border-gray-300 rounded mr-2"
            />
            <input
  type="file"
  accept="image/*,application/pdf"
  onChange={(e) => handleFileChange(field.id, e.target.files[0])}
  className="text-sm"
/>

           
          </div>
        ))}
      </div>}

      <div className="mb-4">
        <label className="block text-gray-700">Assign Date</label>
        <input
          type="date"
          name="due_date"
          value={currentLead.due_date}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
        />
        {errors.due_date && (
          <span className="text-red-500">{errors.due_date}</span>
        )}
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

export default TaskMangement;

