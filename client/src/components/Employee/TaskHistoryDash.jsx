import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function TaskHistoryDash() {
  const [completedTasks, setCompletedTasks] = useState([]);
 const employeedata  = useSelector(state => state.auth.user)
  const token = employeedata?.token;
    const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
const navigate = useNavigate();
  useEffect(() => {
    fetchTaskHistory();
  }, []);

  const fetchTaskHistory = async () => {
    try {
      const response = await axios.get(`https://task.dentalguru.software/api/employee-task-history/${employeedata.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
  const filteredTasks = completedTasks.filter((t) =>
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
    <div className="container 2xl:w-[89%] 2xl:ml-40 mt-20 p-4">
        <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white mt-2 px-4 py-2 rounded"
          >
            Go Back
          </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">📝 Task History (Completed)</h2>
 <div className="mb-4">
  <input
    type="text"
    placeholder="Search by Title or Employee..."
    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
  />
</div>
      {currentLeads.length === 0 ? (
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
              {currentLeads.map((task, index) => (
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
    </div>
  );
}

export default TaskHistoryDash;
