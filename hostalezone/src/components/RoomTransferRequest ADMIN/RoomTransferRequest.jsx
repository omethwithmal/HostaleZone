import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const RoomTransferRequest = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentDetails: {
        registrationNo: '2022/CS/001',
        name: 'Kasun Perera',
        nic: '200012345678',
        contact: '0771234567',
        email: 'kasun.perera@example.com'
      },
      currentRoom: {
        hostel: 'Vijaya Hostel',
        roomNo: 'A-204',
        type: 'Shared (2 Persons)'
      },
      requestedRoom: {
        hostel: 'Gamunu Hostel',
        roomNo: 'B-105',
        type: 'Single'
      },
      reason: 'Need a quieter environment for studies. Current room is too noisy with 3 people. I have exams coming up and need to focus.',
      priority: 'High',
      date: '2024-02-22',
      status: 'Pending'
    },
    {
      id: 2,
      studentDetails: {
        registrationNo: '2022/IT/045',
        name: 'Amali Silva',
        nic: '200198765432',
        contact: '0789876543',
        email: 'amali.silva@example.com'
      },
      currentRoom: {
        hostel: 'Ruwan Hostel',
        roomNo: 'C-312',
        type: 'Single'
      },
      requestedRoom: {
        hostel: 'Parakrama Hostel',
        roomNo: 'D-408',
        type: 'Shared (2 Persons)'
      },
      reason: 'Medical reasons - need to be closer to friends who can help during emergencies. Doctor has advised to have someone nearby.',
      priority: 'Medium',
      date: '2024-02-21',
      status: 'Pending'
    },
    {
      id: 3,
      studentDetails: {
        registrationNo: '2021/EN/112',
        name: 'Nuwan Jayawardena',
        nic: '200034567891',
        contact: '0762345678',
        email: 'nuwan.j@example.com'
      },
      currentRoom: {
        hostel: 'Mahasen Hostel',
        roomNo: 'E-201',
        type: 'Shared (3 Persons)'
      },
      requestedRoom: {
        hostel: 'Tissa Hostel',
        roomNo: 'F-115',
        type: 'Single'
      },
      reason: 'Roommate conflict issues. Unable to focus on studies due to constant arguments. Need to change room urgently.',
      priority: 'High',
      date: '2024-02-20',
      status: 'Approved'
    },
    {
      id: 4,
      studentDetails: {
        registrationNo: '2022/CS/089',
        name: 'Dilini Fernando',
        nic: '200245678912',
        contact: '0753456789',
        email: 'dilini.fernando@example.com'
      },
      currentRoom: {
        hostel: 'Sanghamitta Hostel',
        roomNo: 'G-103',
        type: 'Single'
      },
      requestedRoom: {
        hostel: 'Sanghamitta Hostel',
        roomNo: 'G-205',
        type: 'Shared (2 Persons)'
      },
      reason: 'Want to move in with friend from same course to study together and share notes.',
      priority: 'Low',
      date: '2024-02-19',
      status: 'Rejected'
    },
    {
      id: 5,
      studentDetails: {
        registrationNo: '2021/EE/078',
        name: 'Tharindu Wickramasinghe',
        nic: '199956789123',
        contact: '0778945612',
        email: 'tharindu.w@example.com'
      },
      currentRoom: {
        hostel: 'Vijaya Hostel',
        roomNo: 'A-310',
        type: 'Shared (2 Persons)'
      },
      requestedRoom: {
        hostel: 'Mahasen Hostel',
        roomNo: 'E-045',
        type: 'Single'
      },
      reason: 'Need a room with better ventilation due to respiratory issues. Current room is too congested.',
      priority: 'High',
      date: '2024-02-18',
      status: 'Pending'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [acceptMessage, setAcceptMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    highPriority: 0
  });
  const [hoveredButton, setHoveredButton] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Animate stats on load
  useEffect(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const highPriority = requests.filter(r => r.priority === 'High').length;

    let start = 0;
    const timer = setInterval(() => {
      start += 1;
      setAnimatedStats({
        total: Math.min(start, total),
        pending: Math.min(start, pending),
        approved: Math.min(start, approved),
        highPriority: Math.min(start, highPriority)
      });
      if (start >= Math.max(total, pending, approved, highPriority)) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleAccept = (request) => {
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const confirmAccept = () => {
    setRequests(requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'Approved' } 
        : req
    ));
    setShowAcceptModal(false);
    setAcceptMessage('');
    setSelectedRequest(null);
  };

  const confirmReject = () => {
    setRequests(requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'Rejected' } 
        : req
    ));
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedRequest(null);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const excelData = requests.map(req => ({
      'Registration No': req.studentDetails.registrationNo,
      'Student Name': req.studentDetails.name,
      'NIC/ID': req.studentDetails.nic,
      'Contact Number': req.studentDetails.contact,
      'Email Address': req.studentDetails.email,
      'Current Hostel': req.currentRoom.hostel,
      'Current Room No': req.currentRoom.roomNo,
      'Current Room Type': req.currentRoom.type,
      'Preferred Hostel': req.requestedRoom.hostel,
      'Preferred Room No': req.requestedRoom.roomNo,
      'Preferred Room Type': req.requestedRoom.type,
      'Reason for Change': req.reason,
      'Priority Level': req.priority,
      'Request Date': req.date,
      'Status': req.status
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    const colWidths = [
      { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 25 },
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Room Transfer Requests');
    XLSX.writeFile(wb, `Room_Transfer_Requests_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getPriorityColor = (priority) => {
    if (darkMode) {
      switch(priority) {
        case 'High': return 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500';
        case 'Medium': return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-500';
        case 'Low': return 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-500';
        default: return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500';
      }
    } else {
      switch(priority) {
        case 'High': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-red-100';
        case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400 shadow-yellow-100';
        case 'Low': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-green-100';
        default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400';
      }
    }
  };

  const getStatusColor = (status) => {
    if (darkMode) {
      switch(status) {
        case 'Pending': return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500';
        case 'Approved': return 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500';
        case 'Rejected': return 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-500';
        default: return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500';
      }
    } else {
      switch(status) {
        case 'Pending': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-100';
        case 'Approved': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400 shadow-emerald-100';
        case 'Rejected': return 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-400 shadow-rose-100';
        default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400';
      }
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.studentDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentDetails.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentDetails.nic.includes(searchTerm) ||
      req.studentDetails.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'All' || req.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      {/* Header with Dashboard Button and Dark Mode Toggle */}
      <div className={`${
        darkMode 
          ? 'bg-gray-900/90 border-gray-800' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-sm shadow-sm border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Room Transfer Requests</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage student room transfer applications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Professional Dark/Light Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="relative group"
              >
                {/* Toggle Container */}
                <div className={`relative w-16 h-8 rounded-full transition-all duration-500 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/30'
                }`}>
                  {/* Icons Background */}
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    {/* Sun Icon */}
                    <svg className={`w-4 h-4 transition-all duration-500 ${
                      darkMode ? 'text-white/30' : 'text-white'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    
                    {/* Moon Icon */}
                    <svg className={`w-4 h-4 transition-all duration-500 ${
                      darkMode ? 'text-white' : 'text-white/30'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </div>

                  {/* Sliding Toggle Circle */}
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transform transition-all duration-500 ${
                    darkMode 
                      ? 'translate-x-9 bg-gradient-to-r from-indigo-400 to-purple-400' 
                      : 'translate-x-1 bg-gradient-to-r from-yellow-300 to-orange-300'
                  } flex items-center justify-center`}>
                    {/* Inner Icon */}
                    {darkMode ? (
                      <svg className="w-3 h-3 text-indigo-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  <span className={`text-xs py-1 px-2 rounded ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-800 text-white'
                  }`}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </span>
                </div>

                {/* Ripple Effect */}
                <span className="absolute inset-0 rounded-full animate-ping opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{
                    backgroundColor: darkMode ? '#8b5cf6' : '#fbbf24',
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }}
                />
              </button>

              {/* Go to Dashboard Button */}
              <button
                onClick={handleGoToDashboard}
                className="group flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Requests Card */}
          <div className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="relative p-6">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1 rounded-full">Total</span>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>All Requests</p>
                <p className={`text-4xl font-bold tabular-nums ${darkMode ? 'text-white' : 'text-gray-900'}`}>{animatedStats.total}</p>
                <p className={`text-xs flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  +12% from last month
                </p>
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="relative p-6">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400 px-3 py-1 rounded-full">Pending</span>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Awaiting Review</p>
                <p className={`text-4xl font-bold tabular-nums ${darkMode ? 'text-white' : 'text-gray-900'}`}>{animatedStats.pending}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Need attention</p>
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="relative p-6">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/50 dark:text-emerald-400 px-3 py-1 rounded-full">Approved</span>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Successfully Approved</p>
                <p className={`text-4xl font-bold tabular-nums ${darkMode ? 'text-white' : 'text-gray-900'}`}>{animatedStats.approved}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Ready for processing</p>
              </div>
            </div>
          </div>

          {/* High Priority Card */}
          <div className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="relative p-6">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-400/20 to-rose-500/20 rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/50 dark:text-rose-400 px-3 py-1 rounded-full">Urgent</span>
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>High Priority</p>
                <p className={`text-4xl font-bold tabular-nums ${darkMode ? 'text-white' : 'text-gray-900'}`}>{animatedStats.highPriority}</p>
                <p className={`text-xs flex items-center ${darkMode ? 'text-rose-400' : 'text-rose-500'}`}>
                  <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mr-1 animate-pulse"></span>
                  Requires immediate action
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Export */}
        <div className={`rounded-2xl shadow-lg border p-6 mb-8 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search Students
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search by name, reg no, NIC, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 group-hover:border-indigo-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-200'
                  }`}
                />
                <svg className={`w-5 h-5 absolute left-3 top-3.5 transition-colors ${
                  darkMode ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Priority Filter
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-200'
                }`}
              >
                <option value="All" className={darkMode ? 'bg-gray-700' : ''}>All Priorities</option>
                <option value="High" className={darkMode ? 'bg-gray-700' : ''}>High</option>
                <option value="Medium" className={darkMode ? 'bg-gray-700' : ''}>Medium</option>
                <option value="Low" className={darkMode ? 'bg-gray-700' : ''}>Low</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status Filter
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-200'
                }`}
              >
                <option value="All" className={darkMode ? 'bg-gray-700' : ''}>All Status</option>
                <option value="Pending" className={darkMode ? 'bg-gray-700' : ''}>Pending</option>
                <option value="Approved" className={darkMode ? 'bg-gray-700' : ''}>Approved</option>
                <option value="Rejected" className={darkMode ? 'bg-gray-700' : ''}>Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={exportToExcel}
                className="group w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Table - Without Scroll */}
        <div className={`rounded-2xl shadow-xl border overflow-hidden ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-xl w-12">#</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Student Details</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Contact Info</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Current Room</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Requested Room</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Reason for Change</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Priority</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {filteredRequests.map((request, index) => (
                  <tr 
                    key={request.id} 
                    className={`group hover:bg-gradient-to-r transition-all duration-300 ${
                      darkMode 
                        ? 'hover:from-gray-700 hover:to-gray-600' 
                        : 'hover:from-indigo-50 hover:to-purple-50'
                    }`}
                  >
                    <td className="px-3 py-5 align-top">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-400 group-hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-white'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    
                    {/* Student Details */}
                    <td className="px-3 py-5 align-top">
                      <div className="space-y-2">
                        <div className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.studentDetails.name}</div>
                        <div className="flex flex-wrap gap-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md ${
                            darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'
                          }`}>
                            <svg className={`w-3 h-3 mr-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            <span className={`text-xs ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{request.studentDetails.registrationNo}</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md ${
                            darkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                          }`}>
                            <svg className={`w-3 h-3 mr-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            <span className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>{request.studentDetails.nic}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Contact Info */}
                    <td className="px-3 py-5 align-top">
                      <div className="space-y-2">
                        <div className={`flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <svg className={`w-3 h-3 mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{request.studentDetails.contact}</span>
                        </div>
                        <div className={`flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <svg className={`w-3 h-3 mr-1 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="break-all text-xs">{request.studentDetails.email}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Current Room */}
                    <td className="px-3 py-5 align-top">
                      <div className={`p-2 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 group-hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 group-hover:bg-white'
                      }`}>
                        <div className={`font-medium text-xs mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.currentRoom.hostel}</div>
                        <div className="space-y-0.5">
                          <div className="flex items-center text-xs">
                            <span className={`w-12 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Room:</span>
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{request.currentRoom.roomNo}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className={`w-12 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Type:</span>
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{request.currentRoom.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Requested Room */}
                    <td className="px-3 py-5 align-top">
                      <div className={`p-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-indigo-900/20 border-indigo-800' 
                          : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
                      }`}>
                        <div className={`font-medium text-xs mb-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{request.requestedRoom.hostel}</div>
                        <div className="space-y-0.5">
                          <div className="flex items-center text-xs">
                            <span className={`w-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Room:</span>
                            <span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{request.requestedRoom.roomNo}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className={`w-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Type:</span>
                            <span className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{request.requestedRoom.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Reason */}
                    <td className="px-3 py-5 align-top">
                      <div className="max-w-xs">
                        <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{request.reason}</p>
                      </div>
                    </td>
                    
                    {/* Priority */}
                    <td className="px-3 py-5 align-top">
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium shadow-md ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    
                    {/* Date */}
                    <td className="px-3 py-5 align-top">
                      <div className={`inline-flex items-center px-2 py-1 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-3 h-3 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{request.date}</span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-3 py-5 align-top">
                      <span className={`inline-flex items                      px-2 py-1 rounded-lg text-xs font-medium shadow-md ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    
                    {/* Actions - Three buttons in one row */}
                    <td className="px-3 py-5 align-top">
                      <div className="flex items-center space-x-1">
                        {request.status === 'Pending' && (
                          <>
                            {/* Accept Button */}
                            <div className="relative">
                              <button
                                onClick={() => handleAccept(request)}
                                onMouseEnter={() => setHoveredButton(`accept-${request.id}`)}
                                onMouseLeave={() => setHoveredButton(null)}
                                className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-110"
                                title="Accept Request"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              
                              {/* Tooltip */}
                              {hoveredButton === `accept-${request.id}` && (
                                <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20 animate-fadeIn">
                                  Accept Request
                                </div>
                              )}
                            </div>

                            {/* Reject Button */}
                            <div className="relative">
                              <button
                                onClick={() => handleReject(request)}
                                onMouseEnter={() => setHoveredButton(`reject-${request.id}`)}
                                onMouseLeave={() => setHoveredButton(null)}
                                className="p-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-110"
                                title="Reject Request"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              
                              {/* Tooltip */}
                              {hoveredButton === `reject-${request.id}` && (
                                <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20 animate-fadeIn">
                                  Reject Request
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        
                        {/* Delete Button */}
                        <div className="relative">
                          <button
                            onClick={() => handleDelete(request.id)}
                            onMouseEnter={() => setHoveredButton(`delete-${request.id}`)}
                            onMouseLeave={() => setHoveredButton(null)}
                            className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-110"
                            title="Delete Request"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          
                          {/* Tooltip */}
                          {hoveredButton === `delete-${request.id}` && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20 animate-fadeIn">
                              Delete Request
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-16 animate-fadeIn">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <svg className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>No requests found</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* View Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`rounded-2xl max-w-lg w-full mx-4 overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-6 py-4 border-b ${
                darkMode ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <h3 className={`text-lg font-semibold flex items-center ${
                  darkMode ? 'text-indigo-300' : 'text-indigo-800'
                }`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reason for Room Change
                </h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Student:</p>
                  <p className={darkMode ? 'text-gray-200' : 'text-gray-900'}>
                    {selectedRequest.studentDetails.name} ({selectedRequest.studentDetails.registrationNo})
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Reason:</p>
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-800'}>{selectedRequest.reason}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Room:</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedRequest.currentRoom.hostel} - {selectedRequest.currentRoom.roomNo}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Requested Room:</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedRequest.requestedRoom.hostel} - {selectedRequest.requestedRoom.roomNo}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`px-6 py-4 border-t flex justify-end ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accept Modal */}
        {showAcceptModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`rounded-2xl max-w-md w-full mx-4 overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-6 py-4 border-b ${
                darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'
              }`}>
                <h3 className={`text-lg font-semibold flex items-center ${
                  darkMode ? 'text-green-300' : 'text-green-800'
                }`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Accept Transfer Request
                </h3>
              </div>
              
              <div className="p-6">
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You are accepting transfer request from <span className="font-semibold">{selectedRequest.studentDetails.name}</span>
                </p>
                
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message to Student (Optional)
                </label>
                <textarea
                  value={acceptMessage}
                  onChange={(e) => setAcceptMessage(e.target.value)}
                  rows="4"
                  placeholder="Add any additional message or instructions..."
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div className={`px-6 py-4 border-t flex justify-end space-x-3 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setShowAcceptModal(false);
                    setAcceptMessage('');
                  }}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAccept}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Accept
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`rounded-2xl max-w-md w-full mx-4 overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-6 py-4 border-b ${
                darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`text-lg font-semibold flex items-center ${
                  darkMode ? 'text-red-300' : 'text-red-800'
                }`}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject Transfer Request
                </h3>
              </div>
              
              <div className="p-6">
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You are rejecting transfer request from <span className="font-semibold">{selectedRequest.studentDetails.name}</span>
                </p>
                
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  placeholder="Please provide a reason for rejection..."
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              
              <div className={`px-6 py-4 border-t flex justify-end space-x-3 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectReason.trim()}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-colors ${
                    rejectReason.trim() ? 'hover:bg-red-700' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RoomTransferRequest;