import React, { useState, useEffect } from "react";
import axios from "axios";


import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import AdminSider from './AdminSider';
import MainHeader from './../../pages/MainHeader';

function TaskMangement() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentLead, setCurrentLead] = useState({
    lead_no: "",
    assignedTo: "",
    employeeId: "",
    employeephone: "",
    createdTime: "", // Added here
    name: "",
    phone: "",
    leadSource: "",
    subject: "",
    address: "",
    actual_date: "",
  });
  const [customLeadSource, setCustomLeadSource] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [leadsPerPage, setLeadsPerPage] = useState(10);
  const [leadSourceFilter, setLeadSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("");
  const [dealFilter, setDealFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [visit, setVisit] = useState([]);
  const [loading , setLoading] = useState(false)
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [leadnotInterestedStatusFilter, setLeadnotInterestedStatusFilter] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desce"); 
  const [visitmonthFilter, setVisitMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const adminuser = useSelector((state) => state.auth.user);
  const token = adminuser.token;
const uniqueYears = [
    ...new Set(leads.map((lead) => moment(lead.createdTime).format("YYYY")))
  ];

  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const uniqueMonth = [
    ...new Set(
      leads
        .filter((lead) => moment(lead.createdTime).format("YYYY") === yearFilter)
        .map((lead) => moment(lead.createdTime).format("MMMM"))
    ),
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort by monthOrder

  const uniqueVisitMonth = [
    ...new Set(
      leads
        .filter(
          (lead) =>
           
            lead.visit !== "pending" && 
            lead.visit_date && moment(lead.visit_date, moment.ISO_8601, true).isValid() 
        )
        .map((lead) => moment(lead.visit_date).format("MMMM"))
    ),
  ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort months in order
  

  // Fetch leads and employees from the API
  useEffect(() => {
    fetchLeads();
    fetchEmployees();
    // fetchVisit();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "https://crm.one-realty.in/api/leads",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }}
      );
      setLeads(response.data);
      console.log(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://crm.one-realty.in/api/employee",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  // const fetchVisit = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://crm.one-realty.in/api/employe-all-visit`
  //     );
  //     console.log(response.data);
  //     setVisit(response.data);
  //     // Ensure proper comparison with 'Created', trim any spaces and normalize the case
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentLead.lead_no) {
      formErrors.lead_no = "Lead number is required";
      isValid = false;
    }

    if (!currentLead.assignedTo) {
      formErrors.assignedTo = "Assigned To field is required";
      isValid = false;
    }

    if (!currentLead.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }
    if (!currentLead.createdTime) {
      formErrors.createdTime = "Date is required";
      isValid = false;
    }

    if (!currentLead.phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(currentLead.phone)) {
      formErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!currentLead.leadSource) {
      formErrors.leadSource = "Lead Source is required";
      isValid = false;
    }
    if (!currentLead.subject) {
      formErrors.subject = "Subject is required";
      isValid = false;
    }
    if (!currentLead.address) {
      formErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead((prevLead) => {
      const updatedLead = { ...prevLead, [name]: value };

      // If createdTime changes, update actual_date accordingly
      if (name === "createdTime") {
        updatedLead.actual_date = value; // Copy createdTime to actual_date
      }

      // If assignedTo changes, update employeeId and employeephone accordingly
      if (name === "assignedTo") {
        const selectedEmployee = employees.find(
          (employee) => employee.name === value
        );
        if (selectedEmployee) {
          updatedLead.employeeId = selectedEmployee.employeeId;
          updatedLead.employeephone = selectedEmployee.phone; // Store employee's phone number in employeephone
        } else {
          updatedLead.employeeId = ""; // Reset if no match
          updatedLead.employeephone = ""; // Reset employeephone if no match
        }
      }

      return updatedLead;
    });
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentLead({
      lead_no: "",
      assignedTo: "",
      employeeId: "",
      employeephone: "",
      name: "",
      phone: "",
      leadSource: "",
      createdTime: "", // Clear out createdTime for new lead
      subject: "",
      address: "",
      actual_date: "",
    });
    setShowPopup(true);
  };

  const handleEditClick = (lead) => {
    setIsEditing(true);
    setCurrentLead({
      ...lead,
      createdTime: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
      actual_date: moment(lead.createdTime).format("YYYY-MM-DD"), // Format the createdTime
    });
    setShowPopup(true);
  };

  const handleLeadSourceChange = (e) => {
    const { value } = e.target;
    setCurrentLead((prevLead) => ({ ...prevLead, leadSource: value }));

    // Reset custom lead source if the selected value is not "Other"
    if (value !== "Other") {
      setCustomLeadSource("");
    }
  };

  const handleCustomLeadSourceChange = (e) => {
    setCustomLeadSource(e.target.value);
  };


  // const saveChanges = async () => {
  //   if (validateForm()) {
  //     // Use custom lead source if "Other" is selected
  //     const leadData = {
  //       ...currentLead,
  //       leadSource:
  //         currentLead.leadSource === "Other"
  //           ? customLeadSource
  //           : currentLead.leadSource,
  //     };

  //     try {
  //       if (isEditing) {
  //         await axios.put(
  //           `https://crm.one-realty.in/api/leads/${currentLead.lead_id}`,
  //           leadData
  //         );
  //         fetchLeads(); // Refresh the list
  //         closePopup();
  //       } catch (error) {
  //         console.error("Error updating lead:", error);
  //       }
  //     }

  //        else {
  //         try {

  //         await axios.post("https://crm.one-realty.in/api/leads", leadData);
  //         const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Subject:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;

  //         // Open WhatsApp link
  //         window.open(whatsappLink, "_blank");
  //         fetchLeads(); // Refresh the list
  //         closePopup();
        
  

  //     } catch (error) {
  //       console.error("Error saving lead:", error);
  //     }
  //   }
  // };

  const saveChanges = async () => {
    if (validateForm()) {
      // Use custom lead source if "Other" is selected
      const leadData = {
        ...currentLead,
        leadSource:
          currentLead.leadSource === "Other"
            ? customLeadSource
            : currentLead.leadSource,
             assignedBy: "Admin"
      };
  
      try {
        setLoading(true)
        if (isEditing) {
          // Update existing lead
          await axios.put(
            `https://crm.one-realty.in/api/leads/${currentLead.lead_id}`,
            leadData
          );
          
          fetchLeads(); // Refresh the list
          closePopup();
        } else {
          // Create new lead
          await axios.post("https://crm.one-realty.in/api/leads", leadData);
  
          // Construct WhatsApp message link with encoded parameters
          const whatsappLink = `https://wa.me/${currentLead.employeephone}?text=Hi%20${currentLead.assignedTo},%20you%20have%20been%20assigned%20a%20new%20lead%20with%20the%20following%20details:%0A%0A1)%20Lead%20No.%20${currentLead.lead_no}%0A2)%20Name:%20${currentLead.name}%0A3)%20Phone%20Number:%20${currentLead.phone}%0A4)%20Lead%20Source:%20${currentLead.leadSource}%0A5)%20Address:%20${currentLead.address}%0A6)%20Subject:%20${currentLead.subject}%0A%0APlease%20check%20your%20dashboard%20for%20details.`;
  
          // Open WhatsApp link in a new tab
          window.open(whatsappLink, "_blank");
          fetchLeads(); // Refresh the list
          closePopup();
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error saving lead:", error);
      }
    }
  };
  


  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`https://crm.one-realty.in/api/leads/${id}`);
        fetchLeads(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

 
  const applyFilters = () => {
    let filtered = [...leads];
  
    // Sort by date
    filtered = filtered.sort((a, b) => {
      if (sortOrder === "desce") {
        return new Date(b.createdTime) - new Date(a.createdTime);
      } else {
        return new Date(a.createdTime) - new Date(b.createdTime);
      }
    });
  
 // Filter by search term
 if (searchTerm) {
  const trimmedSearchTerm = searchTerm.toLowerCase().trim();
  filtered = filtered.filter((lead) =>
    ["name", "leadSource", "phone","assignedTo"].some((key) =>
      lead[key]?.toLowerCase().trim().includes(trimmedSearchTerm)
    )
  );
}

  
   // Filter by date range
       if (filterDate) {
         filtered = filtered.filter((lead) => {
           const leadDate = moment(lead.createdTime).format("YYYY-MM-DD");
           return leadDate === filterDate
         });
       }
  
    // Filter by lead source
    if (leadSourceFilter) {
      filtered = filtered.filter((lead) => lead.leadSource === leadSourceFilter);
    }
  
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }
  
    // Filter by deal
    if (dealFilter) {
      filtered = filtered.filter((lead) => lead.deal_status === dealFilter);
    }
  
    // Filter by lead status
    if (leadStatusFilter) {
      filtered = filtered.filter((lead) => lead.lead_status === leadStatusFilter);
    }
  
    // Filter by not interested reason
    if (leadnotInterestedStatusFilter) {
      if (leadnotInterestedStatusFilter === "other") {
        filtered = filtered.filter(
          (lead) => !["price", "budget", "distance"].includes(lead.reason)
        );
      } else {
        filtered = filtered.filter(
          (lead) => lead.reason === leadnotInterestedStatusFilter
        );
      }
    }
  
    // Filter by visit
    if (visitFilter) {
      filtered = filtered.filter((lead) => lead.visit === visitFilter);
    }
  
    // Filter by meeting status
    if (meetingStatusFilter) {
      filtered = filtered.filter(
        (lead) => lead.meeting_status === meetingStatusFilter
      );
    }
  
    // Filter by employee
    if (employeeFilter) {
      filtered = filtered.filter((lead) => lead.assignedTo === employeeFilter);
    }
  
     // Filter by month
      if (monthFilter) {
        filtered = filtered.filter((lead) => {
          const leadMonth = moment(lead.createdTime).format("MMMM");
          return leadMonth === monthFilter;
        });
      }
      if (yearFilter) {
        filtered = filtered.filter((lead) => {
          const leadYear = moment(lead.createdTime).format("YYYY");
          return leadYear === yearFilter;
        });
      }
    
      if (visitmonthFilter) {
        filtered = filtered.filter((lead) => {
          const visitleadMonth = moment(lead.visit_date).format("MMMM");
          return visitleadMonth === visitmonthFilter;
        });
      }
    return filtered;
  };

  useEffect(() => {
    const filtered = applyFilters();
    setFilteredLeads(filtered);
    setCurrentPage(0); 
  }, [
    searchTerm,
    startDate,
    endDate,
    filterDate,
    leads,
    leadSourceFilter,
    statusFilter,
    visitFilter,
    dealFilter,
    leadStatusFilter,
    leadnotInterestedStatusFilter,
    meetingStatusFilter,
    employeeFilter,
    monthFilter,
    yearFilter,
    visitmonthFilter,
    sortOrder,
  ]);
  
  // Total Leads
  const totalLeads = applyFilters().length;
  
  // Total Closed Leads
  const totalClosedLeads = applyFilters().filter((lead) => lead.deal_status === "close").length;
  
  // Total Visits
  const totalVisits = applyFilters().filter((lead) =>
    ["fresh", "re-visit", "self", "associative"].includes(lead.visit)
  ).length;
  
 
  
  

  const closePopup = () => {
    setShowPopup(false);
    setErrors({});
  };

  // const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);
  // const currentLeads = filteredLeads.slice(
  //   currentPage * leadsPerPage,
  //   (currentPage + 1) * leadsPerPage
  // );

  // const handlePageClick = (data) => {
  //   setCurrentPage(data.selected);
  // };

  // Calculate total number of pages
const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

// Pagination logic
const indexOfLastLead = (currentPage + 1) * leadsPerPage;
const indexOfFirstLead = indexOfLastLead - leadsPerPage;
const currentLeads = leadsPerPage === Infinity ? filteredLeads : filteredLeads.slice(indexOfFirstLead, indexOfLastLead);


const handlePageClick = (data) => {
  setCurrentPage(data.selected);
};
const handleLeadsPerPageChange = (e) => {
  const value = e.target.value;
  setLeadsPerPage(value === "All" ? Infinity : parseInt(value, 10));
  setCurrentPage(0); // Reset to the first page
};
const toggleSortOrder = () => {
  setSortOrder((prevOrder) => (prevOrder === "desce" ? "asce" : "desce"));
};

  return (
    <>
      <MainHeader />
      <AdminSider />
      <>
        <div className="container  2xl:ml-40">
          <div className="main 2xl:w-[89%]">
            <h1 className="text-2xl text-center mt-[7rem] font-medium">
              Task Management
            </h1>
            <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>

            {/* Button to create a new lead */}
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={handleCreateClick}
              >
                Add Task 
              </button>
            </div>
            {/* <div className="grid max-sm:grid-cols-2 sm:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
            <div>
                <label htmlFor="">Search</label>
                <input
                  type="text"
                    placeholder=" Name,Lead Source,Assigned To,Phone No"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    searchTerm ? "bg-blue-500 text-white" : "bg-white"
                   }`}
                />
              </div>
              <div>
                <label htmlFor="">Filterd Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    filterDate ? "bg-blue-500 text-white" : "bg-white"
                   }`}
                />
              </div>
             


           <div>
                <label htmlFor="">Meeting Status</label>
                <select
                  value={meetingStatusFilter}
                  onChange={(e) => setMeetingStatusFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                   meetingStatusFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Meeting Status</option>
                  <option value="pending">Pending</option>
                  <option value="done by director">Done By Director</option>
                  <option value="done by manager">Done By Manager</option>
                 
                </select>
              </div>
              <div>
                <label htmlFor="">Lead Source Filter</label>
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  
                  className={`border rounded-2xl p-2 w-full ${
                    leadSourceFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                   <option value="">Select Lead Source</option>
                     <option value="Facebook">Facebook</option>
                    <option value="One Realty Website">
                      One Realty Website
                    </option>
                    <option value="99 Acres">
                    99 Acres
                    </option>
                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>
                   
                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                </select>
              </div>

           
        
             <div>
                <label htmlFor="">Deal Filter</label>
                <select
                  value={dealFilter}
                  onChange={(e) => setDealFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    dealFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Deal</option>
                  <option value="pending">Pending</option>
                  <option value="close">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>


            
              <div>
                <label htmlFor="">Lead Status</label>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    leadStatusFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All Lead Status</option>
                  <option value="pending">Pending</option>
                  <option value="active lead">Active Lead</option>
                  <option value="calling done">Calling Done</option>
                  <option value="site visit done">Site Visit Done</option>
                  <option value="interested">Interested</option>
                  <option value="not-interested">Not-Interested</option>
        
                 
                  <option value="completed">Completed</option>
                </select>
              </div>
              {leadStatusFilter === "not-interested" && (
  <div>
  <label htmlFor="">Not Interested</label>
  <select
    value={leadnotInterestedStatusFilter}
    onChange={(e) => setLeadnotInterestedStatusFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full ${
      leadnotInterestedStatusFilter ? "bg-blue-500 text-white" : "bg-white"
    }`}
  >
    <option value="">All Not Interested</option>
    <option value="price">Price</option>
    <option value="budget">Budget</option>
    <option value="distance">Distance</option>
       <option value="other">Other</option>
   
   

  </select>
</div>


              )}


  

 
              <div>
  <label htmlFor="" className=" fw-semibold text-[blue]">Visit Month Filter</label>
  <select
    value={visitmonthFilter}
    onChange={(e) => setVisitMonthFilter(e.target.value)}
    className={`border rounded-2xl p-2 w-full ${
     visitmonthFilter ? "bg-blue-500 text-white" : "bg-white"
    }`}
  >
    <option value="">All Months</option>
    {uniqueVisitMonth.map((visitmonth) => (
        <option key={visitmonth} value={visitmonth}>
          {visitmonth}
        </option>
      ))}
  </select>
</div>

   

{visitmonthFilter && (
<div>
                <label htmlFor="">Visit Filter</label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                    visitFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">All visit</option>
                  <option value="fresh">Fresh Visit</option>
                  <option value="re-visit">Re-Visit</option>
                  <option value="associative">Associative Visit</option>
                  <option value="self">Self Visit</option>
                </select>
              </div>

)}
<div>
    <label htmlFor="yearFilter">Leads Year Filter</label>
    <select
      value={yearFilter}
      onChange={(e) => setYearFilter(e.target.value)}
      className={`border rounded-2xl p-2 w-full ${
        yearFilter ? "bg-blue-500 text-white" : "bg-white"
      }`}
    >
      <option value="">All Years</option>
      {uniqueYears.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    
    </select>
  </div>

  {yearFilter && (
         <div>
    <label htmlFor="yearFilter">Leads Month Filter</label>
         <select
           value={monthFilter}
           onChange={(e) => setMonthFilter(e.target.value)}
           className={`border rounded-2xl p-2 w-full ${
            monthFilter ? "bg-blue-500 text-white" : "bg-white"
           }`}
         >
           <option value="">All Months</option>
          
             {uniqueMonth.map((month) => (
               <option key={month} value={month}>
                 {month}
               </option>
             ))}
         </select>
       </div>
      )}
            
<div>
                <label htmlFor="">Employee Filter</label>
                <select
                  name="assignedTo"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className={`border rounded-2xl p-2 w-full ${
                   employeeFilter ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
            
            </div> */}
          </div>
          {/* <div className="flex gap-10 text-xl font-semibold my-3 mt-5">
 
  <div>
    Total Lead:{" "}
    {
     totalLeads
    }
  </div>


  <div>
    Total Site Visit:{" "}
    {
      totalVisits
    }
  </div>

 
  <div>
    Total Closed Lead:{" "}
    {
     totalClosedLeads
    }
  </div>
  <select
            onChange={handleLeadsPerPageChange}
            className="border rounded-2xl w-1/4"
          
          >
                    <option value={10}>Number of rows: 10</option>
           
           <option value={20}>20</option>
           <option value={50}>50</option>
           <option value="All">All</option>
          </select>
</div> */}

          <div className=" overflow-x-auto mt-4  2xl:w-[89%]">
         

            <table className="min-w-full bg-white border">
             
              <thead>
                <tr className="text-nowrap">
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    S.no
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Id
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Phone
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Source
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Assigned To
                  </th>
               
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Lead Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Visit
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Visit Date
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Reason
                  </th>
               
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Meeting Status
                  </th>
                 
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Remark Status
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left">
                    Answer Remark
                  </th>
                  <th
  className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm border-y-2 border-gray-300 text-left cursor-pointer"
  onClick={toggleSortOrder}
>
  Assigned Date
  <span className="text-blue-900 mx-2">{sortOrder === "desce" ? "▲" : "▼" }</span>
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
                  currentLeads.map((lead, index) => {
                      console.log(lead, "fdfsdfsdfsdfds");
                      
                    return (
                      <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                      {leadsPerPage === Infinity ? index + 1 : index + 1 + currentPage * leadsPerPage}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 underline text-[blue] font-semibold">
                        <Link to={`/lead-single-data/${lead.lead_id}`}>
                {lead.lead_id}
                        </Link>
              </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {lead.leadSource}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {lead.assignedTo}
                      </td>
                    
                    
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.lead_status}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.visit}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-nowrap">
                                             {lead.visit_date === "pending"
                                               ? "pending"
                                               : moment(lead.visit_date).format("DD MMM YYYY").toUpperCase()}
                                           </td>
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.reason}
                        </td>
                        
                        <td className="px-6 py-4 border-b border-gray-200 font-semibold">
                          {lead.meeting_status}
                        </td>
                    
                     
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-wrap">
                        {lead.remark_status}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold  text-wrap" >
                        {lead.answer_remark}
                        
                                       
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                        {moment(lead.createdTime).format("DD MMM YYYY").toUpperCase()}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold text-nowrap">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditClick(lead)}
                        >
                          <BsPencilSquare size={20} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => handleDeleteClick(lead.lead_id)}
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
            <div className="2xl:w-[89%] mt-4 mb-3 flex justify-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
              forcePage={currentPage} 
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />
      </div>

          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 mx-2 bg-white rounded-lg shadow-lg h-[95%] overflow-y-auto">
                <h2 className="text-xl mb-4">
                  {isEditing ? "Edit Task" : "Add Task"}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Task Title</label>
                  <input
                    type=""
                    name="lead_no"
                    value={currentLead.lead_no}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lead_no ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.lead_no && (
                    <span className="text-red-500">{errors.lead_no}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={currentLead.assignedTo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.name}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <span className="text-red-500">{errors.assignedTo}</span>
                  )}
                </div>

                {/* Hidden employeeId field */}
                <input
                  type="hidden"
                  id="employeeId"
                  name="employeeId"
                  value={currentLead.employeeId}
                />

                <div className="mb-4">
                  <label className="block text-gray-700">Assign Date</label>
                  <input
                    type="date"
                    name="createdTime"
                    value={currentLead.createdTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                  {errors.createdTime && (
                    <span className="text-red-500">{errors.createdTime}</span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentLead.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={currentLead.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.phone && (
                    <span className="text-red-500">{errors.phone}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Lead Source</label>
                  <select
                    name="leadSource"
                    id="leadSource"
                    value={currentLead.leadSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Lead Source</option>

                    <option value="Referrals">Referrals</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Email Campaigns">Email Campaigns</option>
                    <option value="Networking Events">Networking Events</option>
                    <option value="Paid Advertising">Paid Advertising</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="SEO">Search Engine Optimization</option>
                    <option value="Trade Shows">Trade Shows</option>

                    <option value="Affiliate Marketing">
                      Affiliate Marketing
                    </option>
                    <option value="Direct Mail">Direct Mail</option>
                    <option value="Online Directories">
                      Online Directories
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  {currentLead.leadSource === "Other" && (
                    <input
                      type="text"
                      value={customLeadSource}
                      onChange={handleCustomLeadSourceChange}
                      placeholder="Enter custom lead source"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  )}
                  {errors.leadSource && (
                    <p className="text-red-500 text-xs">{errors.leadSource}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Project</label>
                  <input
                    type="text"
                    name="subject"
                    value={currentLead.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.subject && (
                    <span className="text-red-500">{errors.subject}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={currentLead.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address}</span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    onClick={saveChanges} disabled = {loading}
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

export default TaskMangement;
