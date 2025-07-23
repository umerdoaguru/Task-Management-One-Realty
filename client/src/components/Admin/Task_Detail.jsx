import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

const Task_Detail = () => {
  const [task, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [render, setRender] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchTaskDetail();
  }, [id, render]);

  const fetchTaskDetail = async () => {
    try {
      const response = await axios.get(`https://task.dentalguru.software/api/tasks-details/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currenttask = task.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(task.length / itemsPerPage);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedText(item.priority_item);
    setSelectedFile(null); // reset file
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedText("");
    setSelectedFile(null);
  };

  const handleUpdate = async (itemId) => {
    const formData = new FormData();
    formData.append("priority_item", editedText);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await axios.put(`https://task.dentalguru.software/api/task-priorities/${itemId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingId(null);
      setRender(!render); // Refresh data
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  return (
    <div className="relative container 2xl:w-[89%] 2xl:ml-40 mt-20">
      <button
        onClick={handleBackClick}
        className="bg-blue-500 text-white mt-5 px-4 py-2 rounded"
      >
        Go Back
      </button>

      <div className="w-full px-2 mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">All tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currenttask.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{offset + index + 1}</td>

                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      item.priority_item
                    )}
                  </td>

                  <td className="px-6 py-4">{item.status}</td>

                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    {moment(item.createdTime).format("DD MMM YYYY").toUpperCase()}
                  </td>

                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="text-sm"
                      />
                    ) : item.file ? (
                      <a href={item.file} target="_blank" rel="noopener noreferrer">
                        {item.file.endsWith(".pdf") ? (
                          <span className="text-blue-600 underline">View PDF</span>
                        ) : (
                          <img
                            src={item.file}
                            alt="attachment"
                            className="w-20 h-20 object-cover border rounded"
                          />
                        )}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
      </div>
    </div>
  );
};

export default Task_Detail;
