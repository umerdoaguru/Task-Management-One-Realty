import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { useSelector } from "react-redux";

import ReactPaginate from "react-paginate";


const Task_Detail = ({id,closeModalRemark }) => {
  const [task, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [render, setRender] = useState(false);
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;
  


  const navigate = useNavigate();

  useEffect(() => {
    fetchTaskDetail();
  }, [id, render]);

  const fetchTaskDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/api/tasks-details/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setTasks(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

 



  const offset = currentPage * itemsPerPage;
  const currenttask = task.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(task.length / itemsPerPage);
  const handleClose = () => {
    closeModalRemark(); // Close the modal
    // closeModalLead(); // Close the lead profile
  };
    const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
    const handleBackClick = () => {
    navigate(-1); // -1 navigates to the previous page in history
  };

  return (
    <>
      {/* <MainHeader />
      <SuperAdminSider /> */}
      <div className="relative container  2xl:w-[89%]  2xl:ml-40 mt-20 ">
    <button
            onClick={handleBackClick}
            className="bg-blue-500 text-white mt-5 px-4 py-2 rounded"
          >
            Go Back
          </button>
       

       
        <div className="w-full px-2 mx-auto p-4">
          <div className="w-full px-2 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center">All task</h2>
            <div className=" overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.no
                    </th>
                   
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                   
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                 
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currenttask.map((task, index) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{offset + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.task_id}</td>
                
                      <td className="px-6 py-4 whitespace-nowrap">{task.priority_item}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.status}</td>
           
                    <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                                              {moment(task.createdTime)
                                                .format("DD MMM YYYY")
                                                .toUpperCase()}
                                            </td>
                  
                    </tr>
                  ))}
                </tbody>
              </table>

             
            </div>
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
        </div>
      </div>
    </>
  );
};

export default Task_Detail;
