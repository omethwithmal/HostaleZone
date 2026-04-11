# 🏢 3Y2S Hostel Management System

A comprehensive **full-stack hostel management platform** built with **Node.js, Express, MongoDB, and React**. This system streamlines hostel operations including student management, fee collection, room allocation, attendance tracking, leave management, and communication.

![Status](https://img.shields.io/badge/Status-Active%20Development-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

### 🎓 Student Management
- Student registration and profile management
- Student document and details storage
- Room details and accommodation forms
- Student dashboard with personal information

### 💰 Fee & Payment Management
- Fee tracking and payment collection
- Multiple payment methods (Online & Offline)
- Stripe integration for secure payments
- Invoice generation (PDF export)
- Payment history and transaction records
- Automated payment notifications

### 🛏️ Room Management
- Room allocation and booking system
- Room availability tracking
- Room change request handling
- Room details form submission
- Occupancy management

### 📍 Attendance System
- QR code-based attendance scanning
- Real-time attendance tracking
- Attendance reports and analytics
- Batch attendance updates
- Leave integration with attendance

### 📝 Leave Management
- Leave request submission and approval
- Different leave types (Medical, Casual, Emergency)
- Admin approval workflow
- Leave history and records
- Integration with attendance system

### 🔔 Notifications & Communication
- Real-time notification system
- Email/SMS notifications (notification service)
- Notification history tracking
- Admin broadcast messaging
- Leave and payment status updates

### 📋 Complaint Management
- Student complaint submission
- Complaint categorization and tracking
- Admin resolution workflow
- Complaint status updates
- File attachment support

### 📸 Gallery Management
- Hostel photo gallery
- Image uploads with categorization
- Admin management interface
- Public viewing interface

### 📊 Reports & Analytics
- Fee collection reports
- Attendance analytics
- Leave statistics
- Hostel occupancy reports
- Export to PDF functionality

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Admin)
- Secure password hashing (bcryptjs)
- Protected routes and endpoints
- Session management

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 9.2.2 with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Security**: bcryptjs 3.0.3, CORS
- **File Uploads**: Multer 2.0.2
- **PDF Generation**: PDFKit 0.18.0
- **Payment Gateway**: Stripe 22.0.1
- **Charts**: Recharts 3.7.0
- **Environment**: dotenv 17.3.1

### **Frontend**
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.3.4
- **Routing**: React Router DOM 7.13.0
- **UI Styling**: Tailwind CSS 3.4.19, PostCSS
- **Icons**: React Icons, Lucide React, Heroicons
- **HTTP**: Axios 1.13.5
- **Animations**: Framer Motion 12.33.0
- **QR Code**: html5-qrcode 2.3.8, qrcode.react 4.2.0
- **PDF Export**: jsPDF 4.2.1, jsPDF AutoTable
- **Excel Export**: XLSX 0.18.5
- **3D Graphics**: Spline React 4.1.0

### **Development Tools**
- **Backend**: Nodemon (auto-reload)
- **Frontend**: Vite (fast dev server)
- **Styling**: Autoprefixer, Tailwind CSS
- **Version Control**: Git

---

## 📁 Project Structure

```
3Y2S Hostel Management/
├── Backend/                          # Express.js Backend
│   ├── app.js                       # Main server file
│   ├── package.json                 # Backend dependencies
│   ├── config/
│   │   └── env.js                   # Environment configuration
│   ├── Controlers/                  # Business logic
│   │   ├── authController.js        # Authentication logic
│   │   ├── StudentController.js     # Student operations
│   │   ├── feeController.js         # Fee management
│   │   ├── paymentController.js     # Payment processing
│   │   ├── LeaveController.js       # Leave management
│   │   ├── attendanceController.js  # Attendance tracking
│   │   ├── RoomController.js        # Room management
│   │   ├── notificationController.js# Notifications
│   │   ├── AdminController.js       # Admin operations
│   │   ├── reportController.js      # Report generation
│   │   └── ...                      # Other controllers
│   ├── Model/                       # MongoDB Schemas
│   │   ├── StudentModel.js          # Student schema
│   │   ├── Fee.js                   # Fee schema
│   │   ├── Payment.js               # Payment schema
│   │   ├── LeaveModel.js            # Leave schema
│   │   ├── AttendanceModel.js       # Attendance schema
│   │   ├── RoomModel.js             # Room schema
│   │   ├── Notification.js          # Notification schema
│   │   ├── Complaint.js             # Complaint schema
│   │   └── ...                      # Other models
│   ├── Route/                       # API Routes
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── StudentRoute.js          # Student endpoints
│   │   ├── feeRoutes.js             # Fee endpoints
│   │   ├── paymentRoutes.js         # Payment endpoints
│   │   ├── LeaveRoute.js            # Leave endpoints
│   │   ├── RoomRoute.js             # Room endpoints
│   │   ├── AdminRoute.js            # Admin endpoints
│   │   └── ...                      # Other routes
│   ├── Middleware/
│   │   ├── auth.js                  # Authentication middleware
│   │   └── authMiddleware.js        # Authorization middleware
│   ├── services/
│   │   └── notificationService.js   # Notification service
│   ├── utils/
│   │   ├── validation.js            # Input validation
│   │   └── notificationHelper.js    # Notification helpers
│   ├── uploads/                     # File storage
│   │   ├── complaints/              # Complaint attachments
│   │   ├── Gallery/                 # Gallery images
│   │   └── rooms/                   # Room images
│   ├── Roomchangerequest/           # Room change feature
│   │   ├── models/
│   │   │   └── roomchang.js
│   │   └── routes/
│   │       └── roomchange.js
│   └── RoomDetailsForm/             # Room details feature
│       ├── models/
│       │   └── roomdetail.js
│       └── routes/
│           └── roomdetails.js
│
├── Frontend/                        # React + Vite Frontend
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── package.json                 # Frontend dependencies
│   └── src/
│       ├── main.jsx                 # React entry point
│       ├── index.css                # Global styles
│       ├── App.jsx                  # Root component
│       ├── components/              # React components
│       │   ├── App.js/App.jsx
│       │   ├── layout/              # Layout components
│       │   ├── ui/                  # UI components
│       │   ├── complaints_module/   # Complaint features
│       │   ├── ometh/               # Other features
│       │   └── ...                  # Other components
│       ├── pages/                   # Page components
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminLogin.jsx
│       │   ├── Gallery.jsx
│       │   ├── AttendanceScanner.jsx
│       │   ├── AdminLeaveManagement.jsx
│       │   └── ...                  # Other pages
│       ├── api/                     # API integration
│       │   └── axios.js             # Axios configuration
│       ├── services/                # Business logic
│       ├── utils/                   # Utility functions
│       ├── layouts/
│       │   └── OmethLayout.jsx
│       └── assets/                  # Images and assets
│
├── hostalezone/                     # Alternative frontend (Vite)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
├── app.js                           # Root entry point
├── convert_backend.js               # Data conversion utility
├── update_complaint_links.js        # Database update script
├── update_payment_app.js            # Payment app update
├── package.json                     # Root dependencies
└── README.md                        # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) or **yarn**
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Stripe Account** (for payment testing) - [Sign up](https://stripe.com)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/3Y2S-Hostel-Management.git
cd "3Y2S Hostel management"
```

### Step 2: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hostel_management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# File Upload Configuration
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=.png,.jpg,.jpeg,.pdf,.doc,.docx

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 5: Create Environment File for Frontend (Optional)

Create a `.env.local` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## ⚙️ Configuration

### MongoDB Connection

**Local Setup:**
```bash
# Start MongoDB service (Windows)
mongod

# Or on macOS/Linux
brew services start mongodb-community
```

**MongoDB Atlas (Cloud):**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### Stripe Setup

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers > API Keys
3. Copy Secret Key and Publishable Key
4. Add to `.env` file

### JWT Secret Generation

Generate a strong JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd Backend
npm run dev
```

Server runs on `http://localhost:5000`

**Available Scripts:**
- `npm start` - Run production server
- `npm run dev` - Run with hot reload (Nodemon)

### Start Frontend Development Server

```bash
cd Frontend
npm run dev
```

App runs on `http://localhost:5173`

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Run Both Simultaneously (Recommended)

**Option 1: Separate Terminals**
```bash
# Terminal 1
cd Backend && npm run dev

# Terminal 2
cd Frontend && npm run dev
```

**Option 2: Using Root Script (if configured)**
```bash
cd "3Y2S Hostel management"
npm run dev  # If root package.json has dev script
```

---

## 📚 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Routes
```
POST   /auth/register              - Register new student
POST   /auth/login                 - Login student/admin
POST   /auth/logout                - Logout user
GET    /auth/me                    - Get current user info
POST   /auth/refresh-token         - Refresh JWT token
```

### Student Routes
```
GET    /student/profile            - Get student profile
PUT    /student/profile            - Update student profile
GET    /student/dashboard          - Get student dashboard data
```

### Fee Management
```
GET    /fees                       - Get all fees
GET    /fees/:studentId            - Get student fees
POST   /fees                       - Create fee
PUT    /fees/:feeId                - Update fee
```

### Payment Processing
```
POST   /payments/initiate          - Initiate payment
POST   /payments/confirm           - Confirm payment (Stripe webhook)
GET    /payments/history           - Get payment history
GET    /payments/invoice/:paymentId - Download invoice PDF
```

### Room Management
```
GET    /rooms                      - Get all rooms
GET    /rooms/available            - Get available rooms
POST   /rooms/book                 - Book a room
POST   /rooms/change-request       - Request room change
```

### Attendance
```
POST   /attendance/mark            - Mark attendance (QR scan)
GET    /attendance/report          - Get attendance report
POST   /attendance/batch           - Batch mark attendance
```

### Leave Management
```
POST   /leaves                     - Submit leave request
GET    /leaves                     - Get leave requests
PUT    /leaves/:leaveId/approve    - Approve leave (Admin)
PUT    /leaves/:leaveId/reject     - Reject leave (Admin)
```

### Notifications
```
GET    /notifications              - Get user notifications
POST   /notifications/read         - Mark as read
DELETE /notifications/:id          - Delete notification
```

### Complaints
```
POST   /complaints                 - Submit complaint
GET    /complaints                 - Get complaints
PUT    /complaints/:id/status      - Update complaint status
```

### Admin Routes
```
GET    /admin/dashboard            - Admin dashboard data
GET    /admin/students             - Manage students
GET    /admin/reports              - Generate reports
POST   /admin/broadcast-notification - Send broadcast
```

---

## 🗄️ Database Schema Overview

### Student Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  rollNumber: String (unique),
  department: String,
  year: Number,
  gender: String,
  dateOfBirth: Date,
  address: String,
  parentName: String,
  parentPhone: String,
  roomId: ObjectId (ref: Room),
  joinDate: Date,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Fee Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  amount: Number,
  feeType: String (hostel/mess/misc),
  dueDate: Date,
  paidDate: Date,
  status: String (pending/paid/overdue),
  createdAt: Date
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  feeId: ObjectId (ref: Fee),
  amount: Number,
  paymentMethod: String (online/offline),
  transactionId: String (Stripe transaction ID),
  status: String (pending/completed/failed),
  paymentDate: Date,
  receipt: String (URL),
  createdAt: Date
}
```

### Leave Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  leaveType: String (medical/casual/emergency),
  startDate: Date,
  endDate: Date,
  reason: String,
  status: String (pending/approved/rejected),
  approvedBy: ObjectId (ref: Admin),
  createdAt: Date
}
```

### Room Model
```javascript
{
  _id: ObjectId,
  roomNumber: String,
  capacity: Number,
  occupancy: Number,
  floor: Number,
  features: [String],
  images: [String],
  status: String (available/occupied/maintenance),
  createdAt: Date
}
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MongoDB connection string in `.env`
- Verify MongoDB is installed and Port 27017 is accessible

#### 2. **Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### 3. **CORS Error**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify frontend URL in CORS configuration in `Backend/app.js`
- Check frontend is running on port 5173

#### 4. **JWT Token Expired**
```
Error: jwt malformed or jwt expired
```
**Solution:**
- Clear browser localStorage
- Re-login to get fresh token
- Check JWT_EXPIRE in `.env`

#### 5. **Stripe Payment Error**
```
Error: Invalid API Key
```
**Solution:**
- Verify Stripe keys in `.env`
- Use test keys (starts with `sk_test_` and `pk_test_`)
- Regenerate keys if necessary

#### 6. **File Upload Error**
```
Error: File too large
```
**Solution:**
- Check `MAX_UPLOAD_SIZE` in `.env`
- Increase size if needed: `52428800` (50MB)

#### 7. **Multer Destination Error**
```
Error: Cannot find directory Backend/uploads
```
**Solution:**
```bash
# Create uploads directory
mkdir -p Backend/uploads/complaints
mkdir -p Backend/uploads/Gallery
mkdir -p Backend/uploads/rooms
```

---

## 🤝 Contributing

### Contribution Guidelines

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/3Y2S-Hostel-Management.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Wait for code review

### Code Standards

- Use meaningful variable names
- Add comments for complex logic
- Follow existing code style
- Test changes before committing
- Update documentation if needed

### Commit Message Format
```
feat: add new feature
fix: bug fix description
docs: documentation updates
style: formatting changes
refactor: code restructuring
test: test updates
chore: maintenance tasks
```

---

## 📄 Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `JWT_EXPIRE` | No | 7d | JWT expiration time |
| `STRIPE_SECRET_KEY` | Yes | - | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | - | Stripe public key |
| `MAX_UPLOAD_SIZE` | No | 10485760 | Max file size (bytes) |
| `FRONTEND_URL` | No | localhost:5173 | Frontend URL |

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **Create an Issue**: Report bugs on GitHub Issues
- **Email**: [your-email@example.com]
- **Documentation**: See `/docs` folder

---

## 📄 License

This project is licensed under the **ISC License** - see LICENSE file for details.

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Payment integration with local payment gateways
- [ ] SMS/Email notifications
- [ ] Document verification system
- [ ] Multi-hostel support
- [ ] Mobile wallet integration
- [ ] Improvement in UI/UX

---

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Developer Name]
- **Frontend Developer**: [Developer Name]
- **Database Admin**: [Admin Name]

---

## 🙏 Acknowledgments

- **Stripe** for payment processing
- **MongoDB** for database
- **React** and **Express.js** communities
- All contributors and testers

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Active Development

---

### Quick Start Checklist
- [ ] Node.js and npm installed
- [ ] MongoDB installed/connected
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Access at `http://localhost:5173`

---

**Happy Coding! 🚀**
