

import { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaUserTie, FaClipboardCheck, FaClipboardList, FaPlusCircle, FaUser, FaList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function EmployeeDashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  
  });

  const [recentTasks, setRecentTasks] = useState([]);

   const employeedata  = useSelector(state => state.auth.user)
  const token = employeedata?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const taskRes = await axios.get(`https://task.dentalguru.software/api/tasks-employee/${employeedata.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const tasks = taskRes.data;
      console.log(tasks);
      

      
       const taskResCount = await axios.get(`https://task.dentalguru.software/api/employees-task/${employeedata.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const tasksCount = taskResCount.data;

      const totalTasks = tasksCount.length;
      console.log(totalTasks);
      
      const completedTasks = tasksCount.filter
       (p => p.status === "completed").length;
      const pendingTasks = totalTasks - completedTasks;



      const employeeRes = await axios.get("https://task.dentalguru.software/api/employees", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const totalEmployees = employeeRes.data.length;

      setStats({ totalTasks, completedTasks, pendingTasks, totalEmployees });

      // Get only latest 5 tasks
      setRecentTasks(tasks.slice(0, 5));
      console.log(recentTasks);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="2xl:w-[89%] 2xl:ml-40 p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Employee Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Tasks" count={stats.totalTasks} icon={<FaTasks />} bg="bg-blue-100" />
        <StatCard title="Completed Tasks" count={stats.completedTasks} icon={<FaClipboardCheck />} bg="bg-green-100" />
        <StatCard title="Pending Tasks" count={stats.pendingTasks} icon={<FaClipboardList />} bg="bg-yellow-100" />
        {/* <StatCard title="Employees" count={stats.totalEmployees} icon={<FaUserTie />} bg="bg-purple-100" /> */}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickLink title="Profile" icon={<FaUser />} url="/employee-profile-dash" />
        <QuickLink title="Task History" icon={<FaTasks />} url="/task-history-dash" />
        <QuickLink title="Assigned Task" icon={<FaList />} url="/assigned-task-dash" />
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white shadow rounded p-5">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">🕓 Recent Task Activities</h2>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500">No recent tasks.</p>
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
              {recentTasks.map((task, index) => (
                <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{task.title}</td>
                  <td className="px-4 py-3">{task.assigned_to}</td>
                  <td className="px-4 py-3">{new Date(task.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{task.priority}</td>
                <td className="px-4 py-3">

     <ul className="space-y-1 ">
                      {task.task_priorities.map((p, idx) => (
                        // <li key={idx}>✅ {p.priority_item}</li>
                        <li key={idx} className="text-sm border-b pb-1">
        <div><span className="font-semibold">Priority:</span> {p.priority_item}</div>
        <div><span className="font-semibold">Status:</span> {p.status}</div>
        <div><span className="font-semibold">Created:</span> {new Date(p.createdTime).toLocaleString()}</div>
          {p.file && (
          <div className="mt-1 ml-5">
            <a href={p.file} target="_blank" rel="noopener noreferrer">
              {p.file.endsWith(".pdf") ? (
                <span className="text-blue-600 underline">📄 View PDF</span>
              ) : (
                <img
                  src={p.file}
                  alt="priority file"
                  className="w-20 h-20 mt-1 border rounded object-cover"
                />
                
              )}
            </a>
          </div>
        )}
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
    </div>
  );
}

// 👇 Reusable StatCard component
const StatCard = ({ title, count, icon, bg }) => (
  <div className={`p-5 rounded shadow flex items-center gap-4 ${bg}`}>
    <div className="text-3xl text-gray-700">{icon}</div>
    <div>
      <p className="text-lg font-semibold text-gray-800">{count}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

// 👇 Reusable QuickLink
const QuickLink = ({ title, icon, url }) => (
  <Link to={url} className="p-4 bg-blue-50 hover:bg-blue-100 rounded shadow flex items-center justify-center gap-3 text-blue-700 font-medium transition">
    {icon}
    <span>{title}</span>
  </Link>
);

export default EmployeeDashboard;
