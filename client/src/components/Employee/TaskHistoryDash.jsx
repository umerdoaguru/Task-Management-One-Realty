import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function TaskHistoryDash() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const employeedata = useSelector(state => state.auth.user);
const navigate = useNavigate();
  useEffect(() => {
    fetchTaskHistory();
  }, []);

  const fetchTaskHistory = async () => {
    try {
      const response = await axios.get(`https://task.dentalguru.software/api/employee-task-history/${employeedata.id}`);
      const allTasks = response.data;

      const completed = allTasks
        .map((task) => {
          const completedPriorities = task.priorities?.filter((p) => p.status === "completed");
          if (completedPriorities.length > 0) {
            return { ...task, priorities: completedPriorities };
          }
          return null;
        })
        .filter(Boolean);

      setCompletedTasks(completed);
    } catch (err) {
      console.error("Failed to fetch task history:", err);
    }
  };

  return (
    <div className="container 2xl:w-[89%] 2xl:ml-40 mt-20 p-4">
        <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mt-2 px-4 py-2 rounded"
          >
            Go Back
          </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">📝 Task History (Completed)</h2>

      {completedTasks.length === 0 ? (
        <p className="text-center text-gray-500">No completed tasks found.</p>
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
                <th className="px-4 py-3 text-left">Completed Priorities</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((task, index) => (
                <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{task.title}</td>
                  <td className="px-4 py-3">{task.assigned_to}</td>
                  <td className="px-4 py-3">{new Date(task.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{task.priority}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc list-inside text-green-600">
                      {task.priorities.map((p, idx) => (
                        <li key={idx}>✅ {p.priority_item}</li>
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
  );
}

export default TaskHistoryDash;
