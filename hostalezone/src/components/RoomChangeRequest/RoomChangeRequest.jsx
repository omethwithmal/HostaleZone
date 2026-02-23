import React, { useState, useEffect } from 'react';

const RoomChangeRequestForm = () => {
  const [userType, setUserType] = useState('student-male'); // Default: student-male
  
  // User type selector component
  const UserTypeSelector = () => (
    <div className="mb-8 bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Select User Type
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => {
            setUserType('student-male');
            setFormData(prev => ({
              ...prev,
              gender: 'Male'
            }));
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center ${
            userType === 'student-male' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
            userType === 'student-male' ? 'bg-blue-500' : 'bg-blue-100'
          }`}>
            <svg className={`w-6 h-6 ${
              userType === 'student-male' ? 'text-white' : 'text-blue-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">Student (Male)</p>
            <p className="text-xs text-gray-500">Boys Hostel • 18-25 years</p>
          </div>
          {userType === 'student-male' && (
            <svg className="w-5 h-5 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setUserType('student-female');
            setFormData(prev => ({
              ...prev,
              gender: 'Female'
            }));
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center ${
            userType === 'student-female' 
              ? 'border-pink-500 bg-pink-50 shadow-md' 
              : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
            userType === 'student-female' ? 'bg-pink-500' : 'bg-pink-100'
          }`}>
            <svg className={`w-6 h-6 ${
              userType === 'student-female' ? 'text-white' : 'text-pink-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              <path d="M10 14a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">Student (Female)</p>
            <p className="text-xs text-gray-500">Girls Hostel • 18-25 years</p>
          </div>
          {userType === 'student-female' && (
            <svg className="w-5 h-5 ml-auto text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setUserType('staff');
            setFormData(prev => ({
              ...prev,
              gender: 'Male' // Default gender for staff
            }));
          }}
          className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center ${
            userType === 'staff' 
              ? 'border-purple-500 bg-purple-50 shadow-md' 
              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
            userType === 'staff' ? 'bg-purple-500' : 'bg-purple-100'
          }`}>
            <svg className={`w-6 h-6 ${
              userType === 'staff' ? 'text-white' : 'text-purple-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800">Staff Member</p>
            <p className="text-xs text-gray-500">Academic/Admin • 25-60 years</p>
          </div>
          {userType === 'staff' && (
            <svg className="w-5 h-5 ml-auto text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );

  // Theme configuration based on user type
  const getTheme = () => {
    switch(userType) {
      case 'student-male':
        return {
          primary: 'blue',
          primaryLight: 'blue-50',
          primaryMedium: 'blue-500',
          primaryDark: 'blue-700',
          secondary: 'indigo',
          gradient: 'from-blue-600 to-indigo-600',
          icon: (
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ),
          badge: 'Male Student',
          hostelType: 'Boys Hostel'
        };
      case 'student-female':
        return {
          primary: 'pink',
          primaryLight: 'pink-50',
          primaryMedium: 'pink-500',
          primaryDark: 'pink-700',
          secondary: 'rose',
          gradient: 'from-pink-500 to-rose-500',
          icon: (
            <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              <path d="M10 14a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          ),
          badge: 'Female Student',
          hostelType: 'Girls Hostel'
        };
      case 'staff':
        return {
          primary: 'purple',
          primaryLight: 'purple-50',
          primaryMedium: 'purple-500',
          primaryDark: 'purple-700',
          secondary: 'violet',
          gradient: 'from-purple-600 to-violet-600',
          icon: (
            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          ),
          badge: 'Staff Member',
          hostelType: 'Staff Quarters'
        };
      default:
        return {
          primary: 'blue',
          primaryLight: 'blue-50',
          primaryMedium: 'blue-500',
          primaryDark: 'blue-700',
          secondary: 'indigo',
          gradient: 'from-blue-600 to-indigo-600',
          icon: null,
          badge: '',
          hostelType: 'Hostel'
        };
    }
  };

  const theme = getTheme();

  const [formData, setFormData] = useState({
    // Common Fields
    registrationNumber: '',
    fullName: '',
    nicIdNumber: '',
    contactNumber: '',
    emailAddress: '',
    
    // Gender Field (only visible for staff)
    gender: 'Male', // Default gender
    
    // Staff Specific
    staffId: '',
    department: '',
    designation: '',
    
    // Current Room Details
    currentHostelName: '',
    currentRoomNumber: '',
    currentRoomType: '',
    
    // Requested Room Details
    preferredHostel: '',
    preferredRoomNumber: '',
    preferredRoomType: '',
    
    // Reason
    reasonForRequest: '',
    otherReason: '',
    
    // Priority
    priorityLevel: 'Normal',
    
    // Agreement
    studentAgreement: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Update form data when user type changes
  useEffect(() => {
    let defaultGender = 'Male';
    if (userType === 'student-male') {
      defaultGender = 'Male';
    } else if (userType === 'student-female') {
      defaultGender = 'Female';
    } else if (userType === 'staff') {
      defaultGender = 'Male'; // Default for staff
    }
    
    setFormData(prev => ({
      ...prev,
      registrationNumber: '',
      fullName: '',
      nicIdNumber: '',
      contactNumber: '',
      emailAddress: '',
      gender: defaultGender,
      staffId: '',
      department: '',
      designation: '',
      currentHostelName: '',
      currentRoomNumber: '',
      currentRoomType: '',
      preferredHostel: '',
      preferredRoomNumber: '',
      preferredRoomType: '',
      reasonForRequest: '',
      otherReason: '',
      priorityLevel: 'Normal',
      studentAgreement: false
    }));
    setSubmitted(false);
    setRequestId(null);
    setErrors({});
  }, [userType]);

  // Calculate form completion progress
  useEffect(() => {
    let completed = 0;
    const totalFields = userType === 'staff' ? 16 : 15; // Staff has extra fields (gender + staff fields)
    
    // Common Fields
    if (formData.registrationNumber) completed++;
    if (formData.fullName) completed++;
    if (formData.nicIdNumber) completed++;
    if (formData.contactNumber) completed++;
    if (formData.emailAddress) completed++;
    
    // Gender field only counts for staff
    if (userType === 'staff' && formData.gender) completed++;
    
    // Staff specific fields
    if (userType === 'staff') {
      if (formData.staffId) completed++;
      if (formData.department) completed++;
      if (formData.designation) completed++;
    }
    
    // Current Room
    if (formData.currentHostelName) completed++;
    if (formData.currentRoomNumber) completed++;
    if (formData.currentRoomType) completed++;
    
    // Requested Room
    if (formData.preferredHostel) completed++;
    if (formData.preferredRoomType) completed++;
    
    // Reason
    if (formData.reasonForRequest) completed++;
    
    // Agreement
    if (formData.studentAgreement) completed++;
    
    setProgress(Math.round((completed / totalFields) * 100));
  }, [formData, userType]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validation
    if (!formData.registrationNumber?.trim()) newErrors.registrationNumber = `${userType === 'staff' ? 'Staff ID' : 'Registration number'} is required`;
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nicIdNumber?.trim()) newErrors.nicIdNumber = 'NIC/ID number is required';
    if (!formData.contactNumber?.trim()) newErrors.contactNumber = 'Contact number is required';
    
    // Gender validation only for staff
    if (userType === 'staff' && !formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress?.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    
    // Staff specific validation
    if (userType === 'staff') {
      if (!formData.staffId?.trim()) newErrors.staffId = 'Staff ID is required';
      if (!formData.department?.trim()) newErrors.department = 'Department is required';
      if (!formData.designation?.trim()) newErrors.designation = 'Designation is required';
    }
    
    // Hostel validation based on user type
    const currentHostel = formData.currentHostelName;
    const preferredHostel = formData.preferredHostel;
    
    if (!currentHostel) newErrors.currentHostelName = 'Current hostel is required';
    if (!formData.currentRoomNumber?.trim()) newErrors.currentRoomNumber = 'Current room number is required';
    if (!formData.currentRoomType) newErrors.currentRoomType = 'Current room type is required';
    
    if (!preferredHostel) newErrors.preferredHostel = 'Preferred hostel is required';
    if (!formData.preferredRoomType) newErrors.preferredRoomType = 'Preferred room type is required';
    
    if (!formData.reasonForRequest) newErrors.reasonForRequest = 'Please select a reason';
    if (!formData.studentAgreement) newErrors.studentAgreement = 'You must agree to the declaration';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    const prefix = userType === 'student-male' ? 'SMB' : userType === 'student-female' ? 'SFM' : 'STF';
    const genderPrefix = formData.gender === 'Male' ? 'M' : 'F';
    const newRequestId = prefix + genderPrefix + '-' + Date.now().toString().substring(7);
    setRequestId(newRequestId);
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    let defaultGender = 'Male';
    if (userType === 'student-male') {
      defaultGender = 'Male';
    } else if (userType === 'student-female') {
      defaultGender = 'Female';
    } else if (userType === 'staff') {
      defaultGender = 'Male';
    }
    
    setFormData({
      registrationNumber: '',
      fullName: '',
      nicIdNumber: '',
      contactNumber: '',
      emailAddress: '',
      gender: defaultGender,
      staffId: '',
      department: '',
      designation: '',
      currentHostelName: '',
      currentRoomNumber: '',
      currentRoomType: '',
      preferredHostel: '',
      preferredRoomNumber: '',
      preferredRoomType: '',
      reasonForRequest: '',
      otherReason: '',
      priorityLevel: 'Normal',
      studentAgreement: false
    });
    setSubmitted(false);
    setRequestId(null);
    setErrors({});
  };

  const fillSampleData = () => {
    if (userType === 'student-male') {
      setFormData({
        registrationNumber: '2023/CS/001',
        fullName: 'Saman Perera',
        nicIdNumber: '987654321V',
        contactNumber: '0712345678',
        emailAddress: 'saman@university.edu',
        gender: 'Male',
        staffId: '',
        department: '',
        designation: '',
        currentHostelName: 'Block A',
        currentRoomNumber: '101',
        currentRoomType: 'Shared',
        preferredHostel: 'Block B',
        preferredRoomNumber: '205',
        preferredRoomType: 'Single',
        reasonForRequest: 'Roommate issues',
        otherReason: '',
        priorityLevel: 'Normal',
        studentAgreement: true
      });
    } else if (userType === 'student-female') {
      setFormData({
        registrationNumber: '2023/CS/045',
        fullName: 'Nimali Silva',
        nicIdNumber: '998765432V',
        contactNumber: '0771234567',
        emailAddress: 'nimali@university.edu',
        gender: 'Female',
        staffId: '',
        department: '',
        designation: '',
        currentHostelName: 'Block A',
        currentRoomNumber: '303',
        currentRoomType: 'Shared',
        preferredHostel: 'Block C',
        preferredRoomNumber: '410',
        preferredRoomType: 'Single',
        reasonForRequest: 'Health reasons',
        otherReason: '',
        priorityLevel: 'Urgent',
        studentAgreement: true
      });
    } else {
      setFormData({
        registrationNumber: 'STF/2020/089',
        fullName: 'Dr. Priyantha Fernando',
        nicIdNumber: '856321478V',
        contactNumber: '0715551234',
        emailAddress: 'priyantha@university.edu',
        gender: 'Male',
        staffId: 'STF/2020/089',
        department: 'Computer Science',
        designation: 'Senior Lecturer',
        currentHostelName: 'Block A',
        currentRoomNumber: '12',
        currentRoomType: 'Single',
        preferredHostel: 'Block B',
        preferredRoomNumber: '25',
        preferredRoomType: 'AC',
        reasonForRequest: 'Distance to classes',
        otherReason: '',
        priorityLevel: 'Normal',
        studentAgreement: true
      });
    }
  };

  const getHostelOptions = () => {
    return ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${theme.primaryLight} to-${theme.secondary}-50 p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* User Type Selector */}
        <UserTypeSelector />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className={`bg-${theme.primaryLight} p-3 rounded-full mr-3`}>
              {theme.icon}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Hostel Room Change Request
            </h1>
          </div>
          <p className="text-gray-600">
            {userType === 'staff' 
              ? 'Fill out the form below to request a room change in staff quarters'
              : 'Fill out the form below to request a room change in the university hostel'
            }
          </p>
          <div className={`w-24 h-1 bg-${theme.primaryMedium} mx-auto mt-4 rounded-full`}></div>
        </div>

        {/* User Type Badge */}
        <div className="mb-6 flex justify-center">
          <div className={`inline-flex items-center px-6 py-3 bg-${theme.primaryLight} rounded-full shadow-md border border-${theme.primaryMedium}`}>
            {theme.icon}
            <span className={`ml-2 font-bold text-${theme.primaryDark}`}>{theme.badge}</span>
            {userType === 'staff' && formData.gender && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                formData.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
              }`}>
                {formData.gender}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Form Progress</span>
            <span className={`text-sm font-bold text-${theme.primaryDark}`}>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-${theme.primaryMedium} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={fillSampleData}
            className={`px-4 py-2 bg-${theme.primaryLight} hover:bg-${theme.primaryLight} text-${theme.primaryDark} rounded-lg transition duration-200 flex items-center`}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            Fill Sample Data
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Form
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className={`mb-8 success-message bg-${theme.primaryLight} border-l-4 border-${theme.primaryMedium} p-6 rounded-lg shadow-md`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-full bg-${theme.primaryLight} flex items-center justify-center`}>
                  <svg className={`h-6 w-6 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className={`text-xl font-bold text-${theme.primaryDark} flex items-center`}>
                  <svg className={`w-6 h-6 mr-2 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Request Submitted Successfully!
                </h3>
                <div className={`mt-3 text-${theme.primaryDark}`}>
                  <p className="mb-2">Your room change request has been submitted with Request ID:</p>
                  <div className={`inline-block bg-${theme.primaryLight} text-${theme.primaryDark} font-mono font-bold text-lg px-4 py-2 rounded-lg border border-${theme.primaryMedium}`}>
                    {requestId}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${submitted ? 'opacity-50' : ''}`}>
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            
            {/* Personal Details Section */}
            <div id="personal-details" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className={`bg-${theme.primaryLight} p-3 rounded-lg mr-4`}>
                  <svg className={`w-6 h-6 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {userType === 'staff' ? 'Staff Details' : 'Student Details'}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {userType === 'staff' ? 'Fill in your staff information' : 'Fill in your personal information'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Common Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'staff' ? 'Staff ID' : 'Registration Number'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.registrationNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium} focus:border-${theme.primaryMedium} transition duration-200`}
                    placeholder={`Enter ${userType === 'staff' ? 'staff ID' : 'registration number'}`}
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium} focus:border-${theme.primaryMedium}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Gender Selection - Only visible for Staff */}
                {userType === 'staff' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <div className="relative">
                        <input
                          type="radio"
                          id="gender-male"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={handleInputChange}
                          className="hidden peer"
                        />
                        <label 
                          htmlFor="gender-male" 
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            formData.gender === 'Male' 
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <svg className={`w-5 h-5 mr-2 ${
                            formData.gender === 'Male' 
                              ? 'text-purple-500'
                              : 'text-gray-400'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-gray-700">Male</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="radio"
                          id="gender-female"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={handleInputChange}
                          className="hidden peer"
                        />
                        <label 
                          htmlFor="gender-female" 
                          className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            formData.gender === 'Female' 
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <svg className={`w-5 h-5 mr-2 ${
                            formData.gender === 'Female' 
                              ? 'text-purple-500'
                              : 'text-gray-400'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            <path d="M10 14a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          <span className="font-medium text-gray-700">Female</span>
                        </label>
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>
                )}

                {/* Hidden Gender Display for Students */}
                {userType !== 'staff' && (
                  <div className="hidden">
                    <input
                      type="hidden"
                      name="gender"
                      value={userType === 'student-male' ? 'Male' : 'Female'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC / ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nicIdNumber"
                    value={formData.nicIdNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.nicIdNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium} focus:border-${theme.primaryMedium}`}
                    placeholder="Enter NIC/ID number"
                  />
                  {errors.nicIdNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.nicIdNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.contactNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium} focus:border-${theme.primaryMedium}`}
                    placeholder="Enter contact number"
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.emailAddress ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium} focus:border-${theme.primaryMedium}`}
                    placeholder="Enter email address"
                  />
                  {errors.emailAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>
                  )}
                </div>

                {/* Staff Specific Fields */}
                {userType === 'staff' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Staff ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="staffId"
                        value={formData.staffId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.staffId ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                        placeholder="Enter staff ID"
                      />
                      {errors.staffId && (
                        <p className="mt-1 text-sm text-red-600">{errors.staffId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.department ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Arts">Arts</option>
                        <option value="Administration">Administration</option>
                      </select>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.designation ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                      >
                        <option value="">Select Designation</option>
                        <option value="Professor">Professor</option>
                        <option value="Senior Lecturer">Senior Lecturer</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Assistant Lecturer">Assistant Lecturer</option>
                        <option value="Administrative Officer">Administrative Officer</option>
                        <option value="Technical Officer">Technical Officer</option>
                      </select>
                      {errors.designation && (
                        <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Current Room Details Section */}
            <div id="current-room" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className={`bg-${theme.primaryLight} p-3 rounded-lg mr-4`}>
                  <svg className={`w-6 h-6 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Current Room Details</h2>
                  <p className="text-gray-600 text-sm mt-1">Information about your current accommodation in {theme.hostelType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Hostel <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currentHostelName"
                    value={formData.currentHostelName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.currentHostelName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                  >
                    <option value="">Select Current Hostel</option>
                    {getHostelOptions().map(hostel => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </select>
                  {errors.currentHostelName && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentHostelName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Room Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentRoomNumber"
                    value={formData.currentRoomNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.currentRoomNumber ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                    placeholder="E.g., 101, 202A"
                  />
                  {errors.currentRoomNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentRoomNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currentRoomType"
                    value={formData.currentRoomType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.currentRoomType ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                  >
                    <option value="">Select Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Shared">Shared</option>
                    <option value="Dormitory">Dormitory</option>
                    {userType === 'staff' && (
                      <>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Family">Family</option>
                      </>
                    )}
                  </select>
                  {errors.currentRoomType && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentRoomType}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Requested Room Details Section */}
            <div id="requested-room" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className={`bg-${theme.primaryLight} p-3 rounded-lg mr-4`}>
                  <svg className={`w-6 h-6 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Requested Room Details</h2>
                  <p className="text-gray-600 text-sm mt-1">Where would you like to move?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Hostel <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="preferredHostel"
                    value={formData.preferredHostel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.preferredHostel ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                  >
                    <option value="">Select Preferred Hostel</option>
                    {getHostelOptions().map(hostel => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </select>
                  {errors.preferredHostel && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredHostel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Room Number
                  </label>
                  <input
                    type="text"
                    name="preferredRoomNumber"
                    value={formData.preferredRoomNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., 305, 410B (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Room Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="preferredRoomType"
                    value={formData.preferredRoomType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.preferredRoomType ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-${theme.primaryMedium}`}
                  >
                    <option value="">Select Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Shared">Shared</option>
                    {userType === 'staff' && (
                      <>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Family">Family</option>
                      </>
                    )}
                  </select>
                  {errors.preferredRoomType && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredRoomType}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Reason for Room Change Section */}
            <div id="reason" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className={`bg-${theme.primaryLight} p-3 rounded-lg mr-4`}>
                  <svg className={`w-6 h-6 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Reason for Room Change</h2>
                  <p className="text-gray-600 text-sm mt-1">Tell us why you need to change rooms</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Request <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { value: 'Noise issues' },
                    { value: 'Health reasons' },
                    { value: 'Roommate issues' },
                    { value: 'Distance to classes' },
                    { value: 'Safety reasons' },
                    { value: 'Family accommodation' },
                    { value: 'Other' }
                  ].map((reason) => (
                    <div key={reason.value} className="relative">
                      <input
                        type="radio"
                        id={`reason-${reason.value}`}
                        name="reasonForRequest"
                        value={reason.value}
                        checked={formData.reasonForRequest === reason.value}
                        onChange={handleInputChange}
                        required
                        className="hidden peer"
                      />
                      <label 
                        htmlFor={`reason-${reason.value}`} 
                        className={`flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-${theme.primaryMedium} peer-checked:bg-${theme.primaryLight} hover:bg-gray-50 transition-all duration-200`}
                      >
                        <span className="text-sm font-medium text-gray-700">{reason.value}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.reasonForRequest && (
                  <p className="mt-2 text-sm text-red-600">{errors.reasonForRequest}</p>
                )}
              </div>
              
              {formData.reasonForRequest === 'Other' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify other reason
                  </label>
                  <textarea
                    name="otherReason"
                    value={formData.otherReason}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Please provide details about your reason for room change"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority Level
                </label>
                <div className="flex space-x-6">
                  <div className="relative">
                    <input
                      type="radio"
                      id="priority-normal"
                      name="priorityLevel"
                      value="Normal"
                      checked={formData.priorityLevel === 'Normal'}
                      onChange={handleInputChange}
                      className="hidden peer"
                    />
                    <label 
                      htmlFor="priority-normal" 
                      className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500 mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-700">Normal</div>
                        <div className="text-xs text-gray-500">Processed within 5-7 days</div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="priority-urgent"
                      name="priorityLevel"
                      value="Urgent"
                      checked={formData.priorityLevel === 'Urgent'}
                      onChange={handleInputChange}
                      className="hidden peer"
                    />
                    <label 
                      htmlFor="priority-urgent" 
                      className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-gray-50"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 peer-checked:border-red-500 peer-checked:bg-red-500 mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-700">Urgent</div>
                        <div className="text-xs text-gray-500">Processed within 1-2 days</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Declarations Section */}
            <div className="mb-10">
              <div className={`bg-${theme.primaryLight} border-l-4 border-${theme.primaryMedium} p-6 rounded-lg`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className={`h-6 w-6 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-bold text-${theme.primaryDark}`}>Important Declaration</h3>
                    <div className={`mt-2 text-${theme.primaryDark}`}>
                      <p>I confirm that the above information is true and correct to the best of my knowledge. I understand that providing false information may result in disciplinary action.</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-start">
                        <input
                          id="student-agreement"
                          name="studentAgreement"
                          type="checkbox"
                          checked={formData.studentAgreement}
                          onChange={handleInputChange}
                          required
                          className={`h-5 w-5 text-${theme.primaryMedium} focus:ring-${theme.primaryMedium} border-gray-300 rounded mt-1`}
                        />
                        <label htmlFor="student-agreement" className="ml-3 block">
                          <span className="text-lg font-medium text-gray-800">I agree to the above declaration</span>
                          <span className="text-sm text-gray-600 block mt-1">By checking this, you confirm all information provided is accurate</span>
                        </label>
                      </div>
                      {errors.studentAgreement && (
                        <p className="mt-2 text-sm text-red-600">{errors.studentAgreement}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex flex-wrap justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 mb-4 md:mb-0 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset Form
              </button>
              
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  disabled={!formData.studentAgreement}
                  className={`px-8 py-3.5 border-2 border-${theme.primaryMedium} text-${theme.primaryMedium} font-medium rounded-lg transition duration-200 flex items-center ${!formData.studentAgreement ? 'opacity-50 cursor-not-allowed' : `hover:bg-${theme.primaryLight}`}`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Preview
                </button>
                
                <button
                  type="submit"
                  disabled={!formData.studentAgreement || submitted}
                  className={`px-10 py-3.5 bg-${theme.primaryMedium} text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-${theme.primaryMedium} focus:ring-offset-2 flex items-center ${(!formData.studentAgreement || submitted) ? 'opacity-50 cursor-not-allowed' : `hover:bg-${theme.primaryDark}`}`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Submit Request
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            University Hostel Management System • {theme.hostelType} • Room Change Request Form
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className={`text-2xl font-bold text-${theme.primaryDark} flex items-center`}>
                <svg className={`w-6 h-6 mr-2 text-${theme.primaryMedium}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Request Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-8">
                <div className="text-center border-b pb-6">
                  <h4 className={`text-3xl font-bold text-${theme.primaryDark}`}>University Hostel Management</h4>
                  <h5 className={`text-xl text-${theme.primaryMedium} mt-2`}>{theme.hostelType} - Room Change Request</h5>
                  <div className={`mt-4 bg-${theme.primaryLight} inline-block px-6 py-3 rounded-lg`}>
                    <p className={`text-lg font-mono font-bold text-${theme.primaryDark}`}>
                      {userType === 'student-male' ? 'SMB' : userType === 'student-female' ? 'SFM' : 'STF'}
                      {formData.gender === 'Male' ? 'M' : 'F'}-PREVIEW
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{formData.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{userType === 'staff' ? 'Staff ID' : 'Reg. No.'}</p>
                      <p className="font-medium">{formData.registrationNumber || 'Not provided'}</p>
                    </div>
                    {(userType === 'staff' || true) && (
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{formData.gender || 'Not provided'}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{formData.contactNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {userType === 'staff' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">{formData.department || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Designation</p>
                        <p className="font-medium">{formData.designation || 'Not provided'}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-6">
                    <p className="text-lg font-bold text-gray-800 mb-4">Room Change Details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Hostel</p>
                        <p className="font-medium">{formData.currentHostelName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Room</p>
                        <p className="font-medium">{formData.currentRoomNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Hostel</p>
                        <p className="font-medium">{formData.preferredHostel || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Room</p>
                        <p className="font-medium">{formData.preferredRoomNumber || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Reason for Request</p>
                    <p className="font-medium">{formData.reasonForRequest || 'Not provided'}</p>
                    {formData.otherReason && (
                      <p className="text-sm text-gray-600 mt-1">Details: {formData.otherReason}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Priority Level</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      formData.priorityLevel === 'Urgent' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {formData.priorityLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className={`px-6 py-2.5 bg-${theme.primaryMedium} text-white rounded-lg hover:bg-${theme.primaryDark}`}
              >
                Print Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomChangeRequestForm;