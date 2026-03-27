import React from 'react';
import RoomManagementSidebar from '../components/ometh/RoomManageMentNavebar/RoomManagementSidebar';
import RoomManageMentNavebar from '../components/ometh/RoomManageMentNavebar/RoomManageMentNavebar';

const OmethLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar on the left */}
      <RoomManagementSidebar />
      
      {/* Main content area on the right */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <RoomManageMentNavebar />
        
        {/* Scrollable page content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default OmethLayout;
