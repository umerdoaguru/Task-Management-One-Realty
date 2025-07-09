import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeAllDetailTask() {
    const [tasks, setTasks] = useState([]);
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTaskHistory();
  }, []);
 const fetchTaskHistory = async () => {
    try {
      const response = await axios.get(`https://task.dentalguru.software/api/tasks-employee/${id}`);
      const allTasks = response.data;
      setTasks(allTasks);
    } catch (err) {
      console.error("Failed to fetch task history:", err);
    }
  };
   const handlenavigateback = () =>{
    navigate(-1);
   }

  return (
    <>

    <div className="container 2xl:w-[89%] 2xl:ml-40 mt-20 p-4">
           <button
            onClick={handlenavigateback}
            className="bg-blue-500 text-white mt-5 px-4 py-2 rounded"
          >
            Go Back
          </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">📝 Task History of Employee of {}</h2>

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
        <div><span className="font-semibold">Priority:</span> {p.priority_item}</div>
        <div><span className="font-semibold">Status:</span> {p.status}</div>
        <div><span className="font-semibold">Created:</span> {new Date(p.createdTime).toLocaleString()}</div>
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
    </div>
    </>
    
  );
}

export default EmployeeAllDetailTask;
