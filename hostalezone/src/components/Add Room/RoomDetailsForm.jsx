import React, { useState } from 'react';

const RoomDetailsForm = () => {
  const [roomData, setRoomData] = useState({
    monthlyPrice: '',
    roomNumber: '',
    roomType: 'single',
    maxOccupancy: '',
    floorNumber: '',
    size: '',
    description: '',
    availableFrom: '',
    availableTo: '',
    status: 'available',
    amenities: {
      privateBathroom: false,
      airConditioning: false,
      highSpeedWifi: false,
      studyDesks: 0,
      storageLockers: false,
      miniFridge: false,
      tv: false,
      balcony: false,
      microwave: false,
      washingMachine: false,
      waterHeater: false,
      parking: false
    }
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: 'A-101',
      monthlyPrice: '25000',
      roomType: 'single',
      maxOccupancy: '2',
      floorNumber: '1',
      size: '220',
      status: 'available',
      amenities: ['privateBathroom', 'airConditioning', 'highSpeedWifi'],
      images: []
    },
    {
      id: 2,
      roomNumber: 'B-204',
      monthlyPrice: '18000',
      roomType: 'shared',
      maxOccupancy: '3',
      floorNumber: '2',
      size: '280',
      status: 'occupied',
      amenities: ['highSpeedWifi', 'studyDesks', 'storageLockers'],
      images: []
    },
    {
      id: 3,
      roomNumber: 'C-312',
      monthlyPrice: '32000',
      roomType: 'single',
      maxOccupancy: '1',
      floorNumber: '3',
      size: '180',
      status: 'maintenance',
      amenities: ['privateBathroom', 'tv', 'miniFridge', 'balcony'],
      images: []
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: type === 'checkbox' ? checked : parseInt(value) || 0
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing room
      setRooms(rooms.map(room => 
        room.id === editingId 
          ? { 
              ...room, 
              ...roomData,
              amenities: Object.keys(roomData.amenities).filter(key => roomData.amenities[key]),
              images: uploadedImages 
            }
          : room
      ));
      setEditingId(null);
    } else {
      // Add new room
      const newRoom = {
        id: rooms.length + 1,
        ...roomData,
        amenities: Object.keys(roomData.amenities).filter(key => roomData.amenities[key]),
        images: uploadedImages
      };
      setRooms([...rooms, newRoom]);
    }

    // Reset form
    setRoomData({
      monthlyPrice: '',
      roomNumber: '',
      roomType: 'single',
      maxOccupancy: '',
      floorNumber: '',
      size: '',
      description: '',
      availableFrom: '',
      availableTo: '',
      status: 'available',
      amenities: {
        privateBathroom: false,
        airConditioning: false,
        highSpeedWifi: false,
        studyDesks: 0,
        storageLockers: false,
        miniFridge: false,
        tv: false,
        balcony: false,
        microwave: false,
        washingMachine: false,
        waterHeater: false,
        parking: false
      }
    });
    setUploadedImages([]);
    setImagePreview([]);
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    
    // Convert amenities array back to object
    const amenitiesObj = {
      privateBathroom: room.amenities.includes('privateBathroom'),
      airConditioning: room.amenities.includes('airConditioning'),
      highSpeedWifi: room.amenities.includes('highSpeedWifi'),
      studyDesks: room.amenities.includes('studyDesks') ? 1 : 0,
      storageLockers: room.amenities.includes('storageLockers'),
      miniFridge: room.amenities.includes('miniFridge'),
      tv: room.amenities.includes('tv'),
      balcony: room.amenities.includes('balcony'),
      microwave: room.amenities.includes('microwave'),
      washingMachine: room.amenities.includes('washingMachine'),
      waterHeater: room.amenities.includes('waterHeater'),
      parking: room.amenities.includes('parking')
    };

    setRoomData({
      monthlyPrice: room.monthlyPrice,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      maxOccupancy: room.maxOccupancy,
      floorNumber: room.floorNumber,
      size: room.size,
      description: room.description || '',
      availableFrom: room.availableFrom || '',
      availableTo: room.availableTo || '',
      status: room.status,
      amenities: amenitiesObj
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400';
      case 'occupied': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400';
      case 'maintenance': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400';
      case 'unavailable': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400';
    }
  };

  const getRoomTypeIcon = (type) => {
    if (type === 'single') {
      return (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Amenity icons mapping (same as before)
  const amenityIcons = {
    privateBathroom: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12H9m6 0-3 3m3-3-3-3" />
      </svg>
    ),
    airConditioning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-2 2m2-2l-2-2" />
      </svg>
    ),
    highSpeedWifi: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
      </svg>
    ),
    studyDesks: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
    storageLockers: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12v4" />
      </svg>
    ),
    miniFridge: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 16h.01" />
      </svg>
    ),
    tv: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v4" />
      </svg>
    ),
    balcony: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12h18M3 12v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 12V6a2 2 0 012-2h14a2 2 0 012 2v6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12v6M16 12v6" />
      </svg>
    ),
    microwave: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
    washingMachine: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    waterHeater: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4" />
      </svg>
    ),
    parking: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 20h14M5 20V6a2 2 0 012-2h10a2 2 0 012 2v14M5 20H3m16 0h2M9 10h6" />
        <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section with Dashboard Button */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Room Details</h1>
                <p className="text-sm text-gray-600">Add and manage room information</p>
              </div>
            </div>
            
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Room Setup Progress</span>
            <span className="text-sm font-medium text-indigo-600">Step 2 of 4</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Basic Information
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Price (Rs.)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                      <input
                        type="number"
                        name="monthlyPrice"
                        value={roomData.monthlyPrice}
                        onChange={handleInputChange}
                        placeholder="25000"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={roomData.roomNumber}
                      onChange={handleInputChange}
                      placeholder="A-101"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Room Type
                    </label>
                    <div className="flex gap-4">
                      {['single', 'shared'].map((type) => (
                        <label
                          key={type}
                          className={`flex-1 cursor-pointer relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                            roomData.roomType === type
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="roomType"
                            value={type}
                            checked={roomData.roomType === type}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <div className="px-4 py-3 flex items-center justify-center">
                            <svg
                              className={`w-5 h-5 mr-2 ${
                                roomData.roomType === type ? 'text-indigo-600' : 'text-gray-400'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {type === 'single' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              )}
                            </svg>
                            <span className="font-medium capitalize">{type}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Occupancy
                    </label>
                    <select
                      name="maxOccupancy"
                      value={roomData.maxOccupancy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="3">3 Persons</option>
                      <option value="4">4 Persons</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Number
                    </label>
                    <input
                      type="number"
                      name="floorNumber"
                      value={roomData.floorNumber}
                      onChange={handleInputChange}
                      placeholder="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size (sq ft)
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={roomData.size}
                      onChange={handleInputChange}
                      placeholder="220"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={roomData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Add detailed description about the room..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Images Card inside form */}
                <div className="mt-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-500 transition-colors bg-gray-50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Room ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {editingId ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Availability Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Availability
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={roomData.availableFrom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available To
                  </label>
                  <input
                    type="date"
                    name="availableTo"
                    value={roomData.availableTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Room Status
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { value: 'available', label: 'Available', color: 'green', icon: '✓', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                    { value: 'occupied', label: 'Occupied', color: 'yellow', icon: '👤', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
                    { value: 'maintenance', label: 'Maintenance', color: 'orange', icon: '🔧', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
                    { value: 'unavailable', label: 'Unavailable', color: 'red', icon: '✗', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
                  ].map(status => (
                    <label
                      key={status.value}
                      className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        roomData.status === status.value
                          ? `${status.bg} ${status.border}`
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={roomData.status === status.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className={`w-8 h-8 ${status.bg} rounded-lg flex items-center justify-center mr-3`}>
                        <span className={status.text}>{status.icon}</span>
                      </span>
                      <span className={`font-medium ${roomData.status === status.value ? status.text : 'text-gray-700'}`}>
                        {status.label}
                      </span>
                      {roomData.status === status.value && (
                        <svg className="w-5 h-5 ml-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </span>
                  Amenities
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {Object.keys(roomData.amenities).map((key) => {
                    if (key === 'studyDesks') {
                      return (
                        <div key={key} className="p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              roomData.amenities.studyDesks > 0 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'bg-white text-gray-400'
                            }`}>
                              {amenityIcons.studyDesks}
                            </div>
                            <span className="flex-1 font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                              {roomData.amenities.studyDesks}
                            </span>
                          </div>
                          <select
                            name="studyDesks"
                            value={roomData.amenities.studyDesks}
                            onChange={handleAmenityChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="0">None</option>
                            <option value="1">1 Desk</option>
                            <option value="2">2 Desks</option>
                            <option value="3">3 Desks</option>
                            <option value="4">4 Desks</option>
                          </select>
                        </div>
                      );
                    } else {
                      return (
                        <label key={key} className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-all duration-200 group">
                          <input
                            type="checkbox"
                            name={key}
                            checked={roomData.amenities[key]}
                            onChange={handleAmenityChange}
                            className="hidden"
                          />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                            roomData.amenities[key] 
                              ? 'bg-indigo-100 text-indigo-600' 
                              : 'bg-white text-gray-400 group-hover:bg-indigo-50'
                          }`}>
                            {amenityIcons[key]}
                          </div>
                          <span className="flex-1 font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            roomData.amenities[key]
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300'
                          }`}>
                            {roomData.amenities[key] && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </label>
                      );
                    }
                  })}
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-black/10">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  Quick Summary
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-white/90">
                    <span>Price</span>
                    <span className="font-semibold text-white">
                      {roomData.monthlyPrice ? `Rs. ${roomData.monthlyPrice}` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Room Type</span>
                    <span className="font-semibold text-white capitalize">{roomData.roomType}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Status</span>
                    <span className="font-semibold text-white capitalize">{roomData.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Images</span>
                    <span className="font-semibold text-white">{uploadedImages.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/90">
                    <span>Amenities</span>
                    <span className="font-semibold text-white">
                      {Object.values(roomData.amenities).filter(Boolean).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Room Details List
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (Rs.)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Max Occ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rooms.map((room, index) => (
                    <tr key={room.id} className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300">
                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 group-hover:bg-white rounded-lg text-xs font-medium text-gray-600 transition-colors">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-gray-900">{room.roomNumber}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium text-gray-900">Rs. {room.monthlyPrice}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center text-sm text-gray-600">
                          {getRoomTypeIcon(room.roomType)}
                          <span className="capitalize">{room.roomType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="text-sm text-gray-600">Floor {room.floorNumber}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="text-sm text-gray-600">{room.size} sq.ft</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="text-sm text-gray-600">{room.maxOccupancy} {room.maxOccupancy === '1' ? 'Person' : 'Persons'}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium shadow-md ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center space-x-1">
                          {/* Edit Button */}
                          <div className="relative">
                            <button
                              onClick={() => handleEdit(room)}
                              onMouseEnter={() => setHoveredButton(`edit-${room.id}`)}
                              onMouseLeave={() => setHoveredButton(null)}
                              className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-110"
                              title="Edit Room"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            {/* Tooltip */}
                            {hoveredButton === `edit-${room.id}` && (
                              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20 animate-fadeIn">
                                Edit Room
                              </div>
                            )}
                          </div>

                          {/* Delete Button */}
                          <div className="relative">
                            <button
                              onClick={() => handleDelete(room.id)}
                              onMouseEnter={() => setHoveredButton(`delete-${room.id}`)}
                              onMouseLeave={() => setHoveredButton(null)}
                              className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-110"
                              title="Delete Room"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            
                            {/* Tooltip */}
                            {hoveredButton === `delete-${room.id}` && (
                              <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20 animate-fadeIn">
                                Delete Room
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

            {rooms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No rooms added yet</p>
                <p className="text-gray-400 text-sm mt-1">Add your first room using the form above</p>
              </div>
            )}
          </div>
        </div>
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
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RoomDetailsForm;