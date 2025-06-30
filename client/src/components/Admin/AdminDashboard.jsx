import { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaUserTie, FaClipboardCheck, FaClipboardList, FaPlusCircle } from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalEmployees: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const taskRes = await axios.get("http://localhost:9000/api/tasks-details");
      const tasks = taskRes.data;
      console.log(tasks);
      

      const totalTasks = tasks.length;
      console.log(totalTasks);
      
      const completedTasks = tasks.filter
       (p => p.status === "completed").length;
      const pendingTasks = totalTasks - completedTasks;

      const employeeRes = await axios.get("http://localhost:9000/api/employees");
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
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Tasks" count={stats.totalTasks} icon={<FaTasks />} bg="bg-blue-100" />
        <StatCard title="Completed Tasks" count={stats.completedTasks} icon={<FaClipboardCheck />} bg="bg-green-100" />
        <StatCard title="Pending Tasks" count={stats.pendingTasks} icon={<FaClipboardList />} bg="bg-yellow-100" />
        <StatCard title="Employees" count={stats.totalEmployees} icon={<FaUserTie />} bg="bg-purple-100" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickLink title="Add Task" icon={<FaPlusCircle />} url="/add-task" />
        <QuickLink title="All Tasks" icon={<FaTasks />} url="/task-list" />
        <QuickLink title="Manage Employees" icon={<FaUserTie />} url="/employee-management" />
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white shadow rounded p-5">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">🕓 Recent Task Activities</h2>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500">No recent tasks.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Assigned To</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map(task => {
                  const isCompleted = task.priorities?.some(p => p.status === "completed");
                  return (
                    <tr key={task.id} className="border-t">
                      <td className="px-4 py-2 font-semibold">{task.title}</td>
                      <td className="px-4 py-2">{task.assigned_to}</td>
                      <td className="px-4 py-2">{new Date(task.due_date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${isCompleted ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                          {isCompleted ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
  <a href={url} className="p-4 bg-blue-50 hover:bg-blue-100 rounded shadow flex items-center justify-center gap-3 text-blue-700 font-medium transition">
    {icon}
    <span>{title}</span>
  </a>
);

export default AdminDashboard;
