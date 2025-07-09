import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdEditNotifications } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import cogoToast from "cogo-toast";

function AssignedTask() {
    const [tasks, setTasks] = useState([]);
 const employeedata  = useSelector(state => state.auth.user)
  const [currentLead, setCurrentLead] = useState({});
    const [showPopup, setShowPopup] = useState(false);
      const [loading , setLoading] = useState(false)
    
    const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    fetchTaskHistory();
  }, []);
 const fetchTaskHistory = async () => {
    try {
      const response = await axios.get(`https://task.dentalguru.software/api/assign-employee/${employeedata.id}`);
      const allTasks = response.data;
      setTasks(allTasks);
      console.log(tasks)
    } catch (err) {
      console.error("Failed to fetch task history:", err);
    }
  };
   const handlenavigateback = () =>{
    navigate(-1);
   }
   const handleEditTask = (task) =>{

setIsEditing(true);
setCurrentLead({...task});
console.log(currentLead)
setShowPopup(true)
   }
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentLead((prevLead) => {
        const updatedLead = { ...prevLead, [name]: value }
       
  
        return updatedLead;
      });
    };
    const saveChanges = async () => {
        try {
          setLoading(true)
          if (isEditing) {
            // Update existing lead
            await axios.put(
              `https://task.dentalguru.software/api/edit-employee-task/${currentLead.id}`,
              currentLead
            );
            fetchTaskHistory(); // Refresh the list
            closePopup();
          } else {
            // Create new lead
        
          }
          setLoading(false)
        } 
        catch (error) {
          setLoading(false)
          cogoToast.error(error?.response?.data?.message || "An error occurred");
          
          console.error("Error saving lead:", error);
        }
    
    };
        const closePopup = () => {
      setShowPopup(false);
    
    };
  return (
    <>

    <div className="container 2xl:w-[89%] 2xl:ml-40 mt-20 p-4">
           <button
            onClick={handlenavigateback}
            className="bg-blue-500 text-white mt-5 px-4 py-2 rounded"
          >
            Go Back
          </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">📝 Task Assigned Dashboard of {employeedata.name}</h2>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-800 text-sm">
                <th className="px-4 py-3 text-left">S.No</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
                <th className="px-4 py-3 text-left">Due Date</th>
                <th className="px-4 py-3 text-left">Main Priority</th>
   <th className="px-4 py-3 text-left">Priority Details</th>

              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{task.title}</td>
                  <td className="px-4 py-3">{task.assigned_to}</td>
                  <td className="px-4 py-3">{new Date(task.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{task.priority}</td>
               
                <td className="px-4 py-3">
  <ul className="space-y-1">
    {task.task_priorities.map((p, idx) => (
      <li key={idx} className="text-sm border-b pb-1">
        <div><span className="font-semibold">Priority:</span> {p.priority_item}
        </div>
        <div><span className="font-semibold">Status:</span> {p.status}</div>
        <div><span className="font-semibold">Created:</span> {new Date(p.createdTime).toLocaleString()}</div>
        <div><span className="font-semibold">Action:</span><button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditTask(p)}><BsPencilSquare/></button></div>
        
      </li>
    ))}
  </ul>
</td>
  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
          {showPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-lg p-6 mx-2 bg-white rounded-lg shadow-lg h-[45%] overflow-y-auto">
                  <h2 className="text-xl mb-4">
                    {isEditing ? "Edit Employee" : "Add Employee"}
                  </h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      name="priority_item"
                      value={currentLead.priority_item}
                      onChange={handleInputChange}
                      disabled
                      className={`w-full px-3 py-2 border rounded`}
                    />
                      
                  </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700">Status</label>
                     <select
          name="status"
          value={currentLead.status}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Status</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          
        </select>
                  
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
    
  );
}

export default AssignedTask;
