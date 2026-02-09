import React, { useState, useEffect } from 'react';

const RoomChangeRequestForm = () => {
  const [formData, setFormData] = useState({
    // Student Details
    registrationNumber: '',
    fullName: '',
    nicIdNumber: '',
    contactNumber: '',
    emailAddress: '',
    
    // Current Room Details
    currentHostelName: '',
    currentRoomNumber: '',
    currentRoomType: '',
    
    // Requested Room Details
    preferredHostel: '',
    preferredRoomNumber: '',
    preferredRoomType: '',
    
    // Reason for Room Change
    reasonForRequest: '',
    otherReason: '',
    
    // Supporting Documents
    documents: [],
    
    // Request Info
    priorityLevel: 'Normal',
    
    // Declarations
    studentAgreement: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Calculate form completion progress
  useEffect(() => {
    let completed = 0;
    const totalFields = 13; // Total required fields
    
    // Student Details
    if (formData.registrationNumber) completed++;
    if (formData.fullName) completed++;
    if (formData.nicIdNumber) completed++;
    if (formData.contactNumber) completed++;
    if (formData.emailAddress) completed++;
    
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
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files
      });
    } else if (type === 'checkbox') {
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nicIdNumber.trim()) newErrors.nicIdNumber = 'NIC/ID number is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    
    if (!formData.currentHostelName) newErrors.currentHostelName = 'Current hostel is required';
    if (!formData.currentRoomNumber.trim()) newErrors.currentRoomNumber = 'Current room number is required';
    if (!formData.currentRoomType) newErrors.currentRoomType = 'Current room type is required';
    if (!formData.preferredHostel) newErrors.preferredHostel = 'Preferred hostel is required';
    if (!formData.preferredRoomType) newErrors.preferredRoomType = 'Preferred room type is required';
    if (!formData.reasonForRequest) newErrors.reasonForRequest = 'Please select a reason';
    if (!formData.studentAgreement) newErrors.studentAgreement = 'You must agree to the declaration';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    // Generate a request ID
    const newRequestId = 'REQ-' + Date.now().toString().substring(7);
    setRequestId(newRequestId);
    
    // Show success message
    setSubmitted(true);
    
    // In a real app, you would send data to a backend here
    console.log('Form submitted:', formData);
    
    // Scroll to success message
    setTimeout(() => {
      const successElement = document.querySelector('.success-message');
      if (successElement) {
        successElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      registrationNumber: '',
      fullName: '',
      nicIdNumber: '',
      contactNumber: '',
      emailAddress: '',
      currentHostelName: '',
      currentRoomNumber: '',
      currentRoomType: '',
      preferredHostel: '',
      preferredRoomNumber: '',
      preferredRoomType: '',
      reasonForRequest: '',
      otherReason: '',
      documents: [],
      priorityLevel: 'Normal',
      studentAgreement: false
    });
    setSubmitted(false);
    setRequestId(null);
    setErrors({});
  };

  // Preview PDF function
  const previewPDF = () => {
    if (!validateForm()) {
      alert('Please fill all required fields before previewing');
      return;
    }
    setShowPreview(true);
  };

  // Close preview
  const closePreview = () => {
    setShowPreview(false);
  };

  // Generate sample data for testing
  const fillSampleData = () => {
    setFormData({
      registrationNumber: '2023/CS/001',
      fullName: 'Saman Perera',
      nicIdNumber: '987654321V',
      contactNumber: '0712345678',
      emailAddress: 'saman@university.edu',
      currentHostelName: 'North Hostel',
      currentRoomNumber: '101',
      currentRoomType: 'Shared',
      preferredHostel: 'South Hostel',
      preferredRoomNumber: '205',
      preferredRoomType: 'Single',
      reasonForRequest: 'Roommate issues',
      otherReason: '',
      documents: [],
      priorityLevel: 'Normal',
      studentAgreement: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full mr-3">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Hostel Room Change Request
            </h1>
          </div>
          <p className="text-gray-600">
            Fill out the form below to request a room change in the university hostel
          </p>
          <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Form Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-3 flex justify-between">
            <span className="text-xs text-gray-500">Fill all fields to submit</span>
            {progress === 100 && (
              <span className="text-xs text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ready to submit!
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={fillSampleData}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            Fill Sample Data
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Form
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-8 success-message bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-green-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Request Submitted Successfully!
                </h3>
                <div className="mt-3 text-green-700">
                  <p className="mb-2">Your room change request has been submitted with Request ID:</p>
                  <div className="inline-block bg-green-100 text-green-800 font-mono font-bold text-lg px-4 py-2 rounded-lg border border-green-200">
                    {requestId}
                  </div>
                  <p className="mt-3 text-sm">You will receive a confirmation email shortly. Please save your Request ID for future reference.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print Confirmation
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Submit Another Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${submitted ? 'opacity-50' : ''}`}>
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Form Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => document.getElementById('student-details').scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Student
                </button>
                <button type="button" onClick={() => document.getElementById('current-room').scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                  Current Room
                </button>
                <button type="button" onClick={() => document.getElementById('requested-room').scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Requested Room
                </button>
                <button type="button" onClick={() => document.getElementById('reason').scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-100 transition flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Reason
                </button>
              </div>
            </div>

            {/* Student Details Section */}
            <div id="student-details" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
                  <p className="text-gray-600 text-sm mt-1">Fill in your personal information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Registration Number', name: 'registrationNumber', type: 'text', placeholder: 'Enter registration number', required: true },
                  { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Enter your full name', required: true },
                  { label: 'NIC / ID Number', name: 'nicIdNumber', type: 'text', placeholder: 'Enter NIC/ID number', required: true },
                  { label: 'Contact Number', name: 'contactNumber', type: 'tel', placeholder: 'Enter contact number', required: true },
                  { label: 'Email Address', name: 'emailAddress', type: 'email', placeholder: 'Enter email address', required: true, className: 'md:col-span-2' }
                ].map((field) => (
                  <div key={field.name} className={field.className}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required={field.required}
                      className={`w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current Room Details Section */}
            <div id="current-room" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Current Room Details</h2>
                  <p className="text-gray-600 text-sm mt-1">Information about your current accommodation</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Current Hostel Name', name: 'currentHostelName', type: 'select', options: ['North Hostel', 'South Hostel', 'East Hostel', 'West Hostel', 'Central Hostel'], required: true },
                  { label: 'Current Room Number', name: 'currentRoomNumber', type: 'text', placeholder: 'E.g., 101, 202A', required: true },
                  { label: 'Room Type', name: 'currentRoomType', type: 'select', options: ['Single', 'Shared', 'Dormitory'], required: true }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={`w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={`w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                        placeholder={field.placeholder}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Requested Room Details Section */}
            <div id="requested-room" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Requested Room Details</h2>
                  <p className="text-gray-600 text-sm mt-1">Where would you like to move?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Preferred Hostel', name: 'preferredHostel', type: 'select', options: ['North Hostel', 'South Hostel', 'East Hostel', 'West Hostel', 'Central Hostel'], required: true },
                  { label: 'Preferred Room Number', name: 'preferredRoomNumber', type: 'text', placeholder: 'E.g., 305, 410B (Optional)' },
                  { label: 'Preferred Room Type', name: 'preferredRoomType', type: 'select', options: ['Single', 'Shared', 'AC', 'Non-AC'], required: true }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={`w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required={field.required}
                        className={`w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                        placeholder={field.placeholder}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Room Type Descriptions */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="font-medium text-blue-800 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                    Single Room
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Private room for one student</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <div className="font-medium text-purple-800 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Shared Room
                  </div>
                  <div className="text-xs text-purple-600 mt-1">Shared with 1-3 roommates</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="font-medium text-green-800 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    AC Room
                  </div>
                  <div className="text-xs text-green-600 mt-1">Air conditioned room</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <div className="font-medium text-amber-800 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                    Non-AC Room
                  </div>
                  <div className="text-xs text-amber-600 mt-1">Standard room with fan</div>
                </div>
              </div>
            </div>
            
            {/* Reason for Room Change Section */}
            <div id="reason" className="mb-10 scroll-mt-20">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
                    { value: 'Noise issues', icon: (
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    )},
                    { value: 'Health reasons', icon: (
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )},
                    { value: 'Roommate issues', icon: (
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    )},
                    { value: 'Distance to classes', icon: (
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                      </svg>
                    )},
                    { value: 'Safety reasons', icon: (
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )},
                    { value: 'Other', icon: (
                      <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    )}
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
                        className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 hover:bg-gray-50 transition-all duration-200"
                      >
                        {reason.icon}
                        <span className="text-sm font-medium text-gray-700">{reason.value}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.reasonForRequest && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.reasonForRequest}
                  </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                      className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 transition-all duration-200"
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
                      className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-gray-50 transition-all duration-200"
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
            
            {/* Request Summary */}
            <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Request Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Request Date</p>
                  <p className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority Level</p>
                  <div className="flex items-center">
                    <span className={`font-medium ${formData.priorityLevel === 'Urgent' ? 'text-red-600' : 'text-green-600'}`}>
                      {formData.priorityLevel}
                    </span>
                    {formData.priorityLevel === 'Urgent' ? (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        Urgent
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Normal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Declarations Section */}
            <div className="mb-10">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-yellow-800">Important Declaration</h3>
                    <div className="mt-2 text-yellow-700">
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
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="student-agreement" className="ml-3 block">
                          <span className="text-lg font-medium text-gray-800">I agree to the above declaration</span>
                          <span className="text-sm text-gray-600 block mt-1">By checking this, you confirm all information provided is accurate</span>
                        </label>
                      </div>
                      {errors.studentAgreement && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.studentAgreement}
                        </p>
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
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mb-4 md:mb-0 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Cancel / Reset Form
              </button>
              
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={previewPDF}
                  disabled={!formData.studentAgreement}
                  className={`px-8 py-3.5 border-2 border-indigo-500 text-indigo-600 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center ${!formData.studentAgreement ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'}`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Preview Request
                </button>
                
                <button
                  type="submit"
                  disabled={!formData.studentAgreement || submitted}
                  className={`px-10 py-3.5 bg-indigo-600 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center ${(!formData.studentAgreement || submitted) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Submit Request
                </button>
              </div>
            </div>
            
            {/* Form Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>After submission, your request will be reviewed by the hostel administration. You will receive an email notification regarding the status of your request within 3-5 working days.</span>
              </p>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            University Hostel Management System • Room Change Request Form
          </p>
          <p className="mt-1 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            For assistance, contact hostel office at: hostel-office@university.edu | Phone: +94 11 234 5678
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Request Preview
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-8">
                <div className="text-center border-b pb-6">
                  <h4 className="text-3xl font-bold text-indigo-700">University Hostel Management</h4>
                  <h5 className="text-xl text-gray-600 mt-2">Room Change Request Form</h5>
                  <div className="mt-4 bg-indigo-50 inline-block px-6 py-3 rounded-lg">
                    <p className="text-lg font-mono font-bold text-indigo-700">REQ-PREVIEW</p>
                  </div>
                </div>
                
                {/* Preview content would go here */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="font-medium">{formData.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration No.</p>
                      <p className="font-medium">{formData.registrationNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <p className="text-lg font-bold text-gray-800 mb-4">Request Summary</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2">Moving from <span className="font-bold">{formData.currentHostelName}</span> to <span className="font-bold">{formData.preferredHostel}</span></p>
                      <p>Reason: <span className="font-medium">{formData.reasonForRequest}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-6 flex justify-end space-x-4">
              <button
                onClick={closePreview}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
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