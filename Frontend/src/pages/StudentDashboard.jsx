import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Gallery from "./Gallery";
import About from "./About";


const API_BASE = "http://localhost:5000";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // ── Student data ──
  const getStudentData = () => {
    try { return JSON.parse(localStorage.getItem('studentData') || '{}'); }
    catch { return {}; }
  };
  const [studentData, setStudentData] = useState(getStudentData);

  // ── Profile edit state ──
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({ ...studentData });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

  // ── Room Selection state ──
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [myBooking, setMyBooking] = useState(null);

  // ── Leave Request state ──
  const [activeLeaveTab, setActiveLeaveTab] = useState('apply');
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '', fromDate: '', toDate: '', reason: '',
    contactDuringLeave: '', parentName: '', parentPhone: '',
  });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSubmitStatus, setLeaveSubmitStatus] = useState('');
  const [leaveSubmitMsg, setLeaveSubmitMsg] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);
  const [leavesLoading, setLeavesLoading] = useState(false);

  // ── Notification state ──
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');         // 'all' | 'unread' | 'read'
  const [notifCategory, setNotifCategory] = useState('all');     // 'all' | 'leave' | 'room' | 'alert' | 'general'

  const demoNotifications = [
    { _id:'n1', type:'leave',   title:'Leave Request Approved',   message:'Your Medical Leave request from 20 Feb 2026 to 22 Feb 2026 has been approved by the Hostel Warden.', isRead:false, createdAt:new Date(Date.now()-1000*60*30).toISOString(),      priority:'high'   },
    { _id:'n2', type:'room',    title:'Room Booking Confirmed',    message:'Your room booking for Block A · Room A102 has been confirmed. Please collect your key from the hostel office.', isRead:false, createdAt:new Date(Date.now()-1000*60*60*2).toISOString(),   priority:'high'   },
    { _id:'n3', type:'alert',   title:'Hostel Fee Reminder',       message:'Your hostel fee for the current semester is due by 28 February 2026. Please settle the payment to avoid late charges.', isRead:false, createdAt:new Date(Date.now()-1000*60*60*5).toISOString(),   priority:'urgent' },
    { _id:'n4', type:'general', title:'Hostel Meeting Notice',     message:'All hostel students are requested to attend the general meeting on 19 Feb 2026 at 7:00 PM in the Common Hall.', isRead:true,  createdAt:new Date(Date.now()-1000*60*60*24).toISOString(),  priority:'normal' },
    { _id:'n5', type:'leave',   title:'Leave Request Pending',     message:'Your Emergency Leave request submitted on 15 Feb 2026 is currently under review by the warden.', isRead:true,  createdAt:new Date(Date.now()-1000*60*60*48).toISOString(),  priority:'normal' },
    { _id:'n6', type:'room',    title:'Room Maintenance Notice',   message:'Block A rooms will undergo routine maintenance on 21 Feb 2026 from 9:00 AM to 1:00 PM. Please cooperate.', isRead:true,  createdAt:new Date(Date.now()-1000*60*60*72).toISOString(),  priority:'normal' },
    { _id:'n7', type:'alert',   title:'Curfew Time Reminder',      message:'Please note that the hostel curfew time is strictly 10:30 PM. Students found outside after curfew will be penalised.', isRead:true,  createdAt:new Date(Date.now()-1000*60*60*96).toISOString(),  priority:'urgent' },
    { _id:'n8', type:'general', title:'Wi-Fi Maintenance Scheduled',message:'The hostel Wi-Fi network will be down for maintenance on 18 Feb 2026 from 2:00 AM to 5:00 AM.', isRead:true,  createdAt:new Date(Date.now()-1000*60*60*120).toISOString(), priority:'normal' },
  ];

  // ── Derived ──
  const profilePhotoUrl = photoPreview
    || studentData._localPhoto
    || (studentData.profilePhoto ? `${API_BASE}/${studentData.profilePhoto}` : null);
  const displayName = studentData.fullName || 'Student';
  const placeholderAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=140&background=2563eb&color=fff`;

  // ── Fetch rooms when block selected ──
  useEffect(() => {
    if (!selectedBlock) return;
    setRoomsLoading(true); setRoomsError(''); setRooms([]); setSelectedRoom(null);
    setBookingStatus(''); setBookingMsg('');
    const token = localStorage.getItem('studentToken');
    fetch(`${API_BASE}/api/rooms?block=${selectedBlock}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setRooms(data.rooms || data || []); setRoomsLoading(false); })
      .catch(() => { setRoomsError('Could not load rooms. Please try again.'); setRoomsLoading(false); });
  }, [selectedBlock]);

  // ── Fetch student's existing room booking ──
  useEffect(() => {
    if (activeSection !== 'rooms') return;
    const token = localStorage.getItem('studentToken');
    fetch(`${API_BASE}/api/rooms/my-booking`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setMyBooking(data.booking || null); })
      .catch(() => {});
  }, [activeSection]);

  // ── Fetch leave history whenever Leave tab opens ──
  useEffect(() => {

    if (activeSection !== 'leave') return;
    fetchMyLeaves();
  }, [activeSection]);

  // ── Fetch notifications whenever Notification section opens ──
  useEffect(() => {
    if (activeSection !== 'notification') return;
    setNotifLoading(true);
    const token = localStorage.getItem('studentToken');
    fetch(`${API_BASE}/api/notifications/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && (data.notifications || []).length > 0) {
          setNotifications(data.notifications);
        } else {
          setNotifications(demoNotifications);
        }
        setNotifLoading(false);
      })
      .catch(() => { setNotifications(demoNotifications); setNotifLoading(false); });
  }, [activeSection]);

  const fetchMyLeaves = () => {
    setLeavesLoading(true);
    const token = localStorage.getItem('studentToken');
    fetch(`${API_BASE}/api/leave/my-leaves`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : { leaves: [] })
      .then(data => { setMyLeaves(data.leaves || []); setLeavesLoading(false); })
      .catch(() => { setMyLeaves([]); setLeavesLoading(false); });
  };

  // ── Notification helpers ──
  const markNotifAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    try {
      const token = localStorage.getItem('studentToken');
      await fetch(`${API_BASE}/api/notifications/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch (_) {}
  };
  const markAllNotifsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      const token = localStorage.getItem('studentToken');
      await fetch(`${API_BASE}/api/notifications/mark-all-read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch (_) {}
  };
  const deleteNotif = async (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    try {
      const token = localStorage.getItem('studentToken');
      await fetch(`${API_BASE}/api/notifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } catch (_) {}
  };

  const notifUnreadCount = notifications.filter(n => !n.isRead).length;
  const notifFiltered = notifications.filter(n => {
    const readMatch = notifFilter === 'all' ? true : notifFilter === 'unread' ? !n.isRead : n.isRead;
    const catMatch  = notifCategory === 'all' ? true : n.type === notifCategory;
    return readMatch && catMatch;
  });

  const notifTimeAgo = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (diff < 60)     return 'Just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
    return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  };

  const notifTypeConfig = {
    leave:   { icon:'📋', label:'Leave',   bg:'linear-gradient(135deg,#dbeafe,#bfdbfe)', color:'#1e40af', border:'#93c5fd' },
    room:    { icon:'🏠', label:'Room',    bg:'linear-gradient(135deg,#dcfce7,#bbf7d0)', color:'#166534', border:'#86efac' },
    alert:   { icon:'🔔', label:'Alert',   bg:'linear-gradient(135deg,#fef9c3,#fef08a)', color:'#854d0e', border:'#fde047' },
    general: { icon:'📢', label:'General', bg:'linear-gradient(135deg,#f3e8ff,#e9d5ff)', color:'#6b21a8', border:'#c084fc' },
  };

  const notifPriorityBadge = {
    urgent: { bg:'linear-gradient(135deg,#fef2f2,#fecaca)', color:'#991b1b', border:'#f87171', label:'🚨 Urgent' },
    high:   { bg:'linear-gradient(135deg,#fff7ed,#fed7aa)', color:'#9a3412', border:'#fb923c', label:'❗ High'   },
    normal: { bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)', color:'#166534', border:'#86efac', label:'✅ Normal' },
  };

  // ── Book room ──
  const handleBookRoom = async () => {
    if (!selectedRoom) return;
    setBookingLoading(true); setBookingStatus(''); setBookingMsg('');
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch(`${API_BASE}/api/rooms/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roomId: selectedRoom._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingStatus('success');
        setBookingMsg(`Room ${selectedRoom.roomNumber} in Block ${selectedBlock} booked successfully!`);
        setMyBooking(data.booking || selectedRoom);
        setRooms(prev => prev.map(r => r._id === selectedRoom._id ? { ...r, isAvailable: false, occupants: (r.occupants || 0) + 1 } : r));
        setSelectedRoom(null);
      } else {
        setBookingStatus('error');
        setBookingMsg(data.message || 'Booking failed. Please try again.');
      }
    } catch {
      setBookingStatus('error'); setBookingMsg('Network error. Please try again.');
    } finally { setBookingLoading(false); }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel your current room booking?")) return;
    setBookingLoading(true); setBookingStatus(''); setBookingMsg('');
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch(`${API_BASE}/api/rooms/cancel`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMyBooking(null);
        if (selectedBlock) {
          fetch(`${API_BASE}/api/rooms?block=${selectedBlock}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => setRooms(d.rooms || d || []));
        }
        setBookingStatus('success');
        setBookingMsg('Your booking was cancelled successfully. You may now book a new room.');
      } else {
        setBookingStatus('error');
        setBookingMsg(data.message || 'Failed to cancel booking.');
      }
    } catch {
      setBookingStatus('error'); setBookingMsg('Network error while cancelling booking.');
    } finally { setBookingLoading(false); }
  };

  // ── Leave form handlers ──
  const handleLeaveChange = (e) => setLeaveForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLeaveSubmit = async () => {
    if (!leaveForm.leaveType || !leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason) {
      setLeaveSubmitStatus('error');
      setLeaveSubmitMsg('Please fill in all required fields: Leave Type, From Date, To Date, and Reason.');
      return;
    }
    if (new Date(leaveForm.toDate) < new Date(leaveForm.fromDate)) {
      setLeaveSubmitStatus('error');
      setLeaveSubmitMsg('To Date cannot be earlier than From Date.');
      return;
    }
    setLeaveSubmitting(true); setLeaveSubmitStatus(''); setLeaveSubmitMsg('');
    try {
      const token = localStorage.getItem('studentToken');
      const res = await fetch(`${API_BASE}/api/leave/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(leaveForm),
      });
      const data = await res.json();
      if (res.ok) {
        setLeaveSubmitStatus('success');
        setLeaveSubmitMsg('Leave request submitted successfully! Waiting for approval.');
        setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '', contactDuringLeave: '', parentName: '', parentPhone: '' });
        fetchMyLeaves();
        setActiveLeaveTab('history');
      } else {
        setLeaveSubmitStatus('error');
        setLeaveSubmitMsg(data.message || 'Failed to submit leave request.');
      }
    } catch {
      setLeaveSubmitStatus('error'); setLeaveSubmitMsg('Network error. Please try again.');
    } finally { setLeaveSubmitting(false); }
  };

  const handleLeaveReset = () => {
    setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '', contactDuringLeave: '', parentName: '', parentPhone: '' });
    setLeaveSubmitStatus(''); setLeaveSubmitMsg('');
  };

  // ── Leave helpers ──
  const calcDays = (from, to) => {
    if (!from || !to) return 0;
    return Math.max(1, Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1);
  };

  const getStatusStyle = (status) => ({
    pending:  { bg: 'linear-gradient(135deg,#fef9c3,#fef08a)', border: '#fde047', color: '#854d0e', label: '⏳ Pending'  },
    approved: { bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '#86efac', color: '#166534', label: '✅ Approved' },
    rejected: { bg: 'linear-gradient(135deg,#fef2f2,#fecaca)', border: '#f87171', color: '#991b1b', label: '❌ Rejected' },
  }[status] || { bg: 'linear-gradient(135deg,#fef9c3,#fef08a)', border: '#fde047', color: '#854d0e', label: '⏳ Pending' });

  const leaveTypes = [
    { value: 'medical',   label: '🏥 Medical Leave'     },
    { value: 'personal',  label: '🏠 Personal Leave'     },
    { value: 'emergency', label: '🚨 Emergency Leave'    },
    { value: 'family',    label: '👨‍👩‍👧 Family Event'      },
    { value: 'other',     label: '📋 Other'              },
  ];

  // ── Profile handlers ──
  const handleEditToggle = () => { setFormData({ ...studentData }); setPhotoPreview(null); setPhotoFile(null); setSaveSuccess(false); setSaveError(''); setEditMode(true); };
  const handleCancel     = () => { setFormData({ ...studentData }); setPhotoPreview(null); setPhotoFile(null); setSaveError(''); setEditMode(false); };
  const handleChange     = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    setSaving(true); setSaveError('');
    const localUpdate = { ...studentData, ...formData };
    if (photoPreview) localUpdate._localPhoto = photoPreview;
    localStorage.setItem('studentData', JSON.stringify(localUpdate)); setStudentData(localUpdate);
    try {
      const token = localStorage.getItem('studentToken');
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== undefined) data.append(k, v); });
      if (photoFile) data.append('profilePhoto', photoFile);
      const res = await fetch(`${API_BASE}/api/student/profile`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: data });
      if (res.ok) {
        const updated = await res.json();
        const serverData = { ...localUpdate, ...(updated.student || {}) };
        if (updated.profilePhoto) { serverData.profilePhoto = updated.profilePhoto; delete serverData._localPhoto; }
        localStorage.setItem('studentData', JSON.stringify(serverData)); setStudentData(serverData);
      }
    } catch (_) {}
    finally { setSaving(false); setEditMode(false); setPhotoPreview(null); setPhotoFile(null); setSaveSuccess(true); setActiveSection('dashboard'); }
  };

  // ─────────────────────────────────────────
  //  STYLES
  // ─────────────────────────────────────────
  const styles = {
    app: { maxWidth: '100%', height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)' },
    dashboardLayout: { display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' },
    sidebar: { width: '270px', minWidth: '270px', background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 40%, #2563eb 80%, #3b82f6 100%)', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, height: '100vh', boxShadow: '6px 0 30px rgba(37,99,235,0.4)', zIndex: 100, overflow: 'hidden' },
    sidebarHeader: { padding: '2rem 1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)', position: 'relative' },
    sidebarLogo: { width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 'bold', color: 'white', boxShadow: '0 8px 20px rgba(59,130,246,0.5)', margin: '0 auto', transition: 'transform 0.3s ease' },
    sidebarNav: { padding: '1.5rem 0.75rem 1rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    sidebarSection: { marginBottom: '1.25rem' },
    sidebarSectionTitle: { display: 'block', padding: '0.5rem 1rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', textTransform: 'uppercase' },
    sidebarLink: { display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', borderRadius: '12px', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer', position: 'relative', border: 'none', background: 'transparent', width: '100%', textAlign: 'left' },
    sidebarLinkActive: { background: 'linear-gradient(135deg, rgba(96,165,250,0.25), rgba(59,130,246,0.2))', color: 'white', fontWeight: 600, boxShadow: '0 4px 12px rgba(96,165,250,0.3)', transform: 'translateX(4px)' },
    sidebarLinkIcon: { fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', transition: 'transform 0.3s ease' },
    sidebarLinkLabel: { fontSize: '0.9rem', fontWeight: 500, flex: 1 },
    sidebarLinkSublabel: { fontSize: '0.7rem', opacity: 0.9, marginLeft: 'auto', padding: '0.25rem 0.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 600 },
    dashboardMain: { marginLeft: '270px', flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', minWidth: 0, height: '100vh', overflow: 'hidden' },
    dashboardMainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', paddingRight: '10rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(37,99,235,0.1)', boxShadow: '0 4px 20px rgba(37,99,235,0.08)', flexShrink: 0, position: 'relative', zIndex: 50 },
    dashboardMainHeaderH1: { margin: 0, fontSize: '1.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
    logoutBtn: { padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 6px 16px rgba(59,130,246,0.4)', position: 'fixed', top: '1.25rem', right: '1.5rem', zIndex: 200 },
    dashboardMainContent: { flex: 1, padding: '2.5rem', overflowY: 'auto' },
    dashboardPanel: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', border: '1px solid rgba(255,255,255,0.8)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' },
    panelHeader: { position: 'relative', padding: '2rem 2.5rem', background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)', color: 'white', overflow: 'hidden' },
    panelHeaderAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #60a5fa, #93c5fd, #bfdbfe, #dbeafe)' },
    panelHeaderH2: { margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', WebkitTextFillColor: '#ffffff', letterSpacing: '0.03em', textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.2)', opacity: 1 },
    profileSection: { textAlign: 'center', padding: '3.5rem 2rem 2.5rem', background: 'linear-gradient(180deg, rgba(239,246,255,0.5) 0%, rgba(255,255,255,0.8) 100%)', position: 'relative' },
    profilePhotoWrap: { position: 'relative', display: 'inline-block', marginBottom: '1.5rem' },
    profilePhoto: { width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', border: '5px solid white', boxShadow: '0 12px 40px rgba(37,99,235,0.25)', transition: 'transform 0.3s ease' },
    profileStatus: { position: 'absolute', bottom: '8px', right: '8px', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 4px 12px rgba(59,130,246,0.5)' },
    profileName: { margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    profileRole: { margin: 0, fontSize: '1.1rem', color: '#64748b', fontWeight: 500 },
    detailsSection: { padding: '2.5rem', background: 'white' },
    detailsSectionTitle: { margin: '0 0 2rem', fontSize: '0.9rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.12em', position: 'relative', paddingBottom: '0.75rem' },
    detailsGrid: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '650px', margin: '0 auto' },
    detailCard: { display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 1.75rem', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', borderRadius: '16px', border: '2px solid rgba(37,99,235,0.1)', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden' },
    detailCardIcon: { flexShrink: 0, width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 8px 20px rgba(59,130,246,0.35)', transition: 'transform 0.3s ease' },
    detailCardContent: { display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0, flex: 1 },
    detailLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' },
    detailValue: { fontSize: '1.05rem', color: '#0f172a', fontWeight: 700, wordBreak: 'break-word' },
    comingSoonPanel: { background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.9) 100%)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', textAlign: 'center', padding: '5rem 2rem', border: '1px solid rgba(255,255,255,0.8)' },
    comingSoonIcon: { width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 12px 40px rgba(59,130,246,0.2)', animation: 'pulse 2s ease-in-out infinite' },
    comingSoonTitle: { margin: '0 0 0.75rem', fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    comingSoonText: { margin: 0, fontSize: '1.1rem', color: '#64748b', fontWeight: 500 },
    editPanel: { background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', border: '1px solid rgba(255,255,255,0.8)' },
    editPhotoSection: { textAlign: 'center', padding: '2.5rem 2rem 1.5rem', background: 'linear-gradient(180deg, rgba(239,246,255,0.6) 0%, rgba(255,255,255,0.9) 100%)', borderBottom: '1px solid rgba(37,99,235,0.08)' },
    editPhotoWrap: { position: 'relative', display: 'inline-block', marginBottom: '1rem' },
    editPhotoImg: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '5px solid white', boxShadow: '0 12px 40px rgba(37,99,235,0.25)' },
    changePhotoBtn: { position: 'absolute', bottom: 0, right: 0, width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: '3px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.5)', transition: 'transform 0.2s ease' },
    editPhotoHint: { margin: 0, fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 },
    editFormSection: { padding: '2rem 2.5rem 2.5rem' },
    editFormTitle: { margin: '0 0 1.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.12em', position: 'relative', paddingBottom: '0.75rem' },
    editGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', maxWidth: '750px', margin: '0 auto' },
    editFieldWrap: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    editFieldWrapFull: { display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' },
    editLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' },
    editIconInput: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', border: '2px solid rgba(37,99,235,0.12)', borderRadius: '12px', padding: '0 1.1rem', transition: 'border-color 0.25s ease' },
    editIconInputIcon: { flexShrink: 0, color: '#3b82f6', display: 'flex', alignItems: 'center' },
    editIconInputField: { flex: 1, padding: '0.875rem 0', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a', background: 'transparent', border: 'none', outline: 'none' },
    editActionsRow: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(37,99,235,0.08)' },
    cancelBtn: { padding: '0.8rem 2rem', background: 'white', color: '#64748b', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.25s ease' },
    saveBtn: { padding: '0.8rem 2.5rem', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 6px 16px rgba(37,99,235,0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    saveBtnDisabled: { padding: '0.8rem 2.5rem', background: 'linear-gradient(135deg, #93c5fd, #bfdbfe)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    successBanner: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '1px solid #86efac', borderRadius: '12px', marginBottom: '1.5rem', color: '#166534', fontWeight: 600, fontSize: '0.9rem' },
    errorBanner: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #fef2f2, #fecaca)', border: '1px solid #f87171', borderRadius: '12px', marginBottom: '1.5rem', color: '#991b1b', fontWeight: 600, fontSize: '0.9rem' },
    editTriggerBtn: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 6px 18px rgba(37,99,235,0.35)' },

    // ── Room styles ──
    roomPage: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    myBookingBanner: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', border: '2px solid #86efac', borderRadius: '16px', color: '#166534' },
    myBookingIcon: { width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    myBookingText: { flex: 1 },
    myBookingTitle: { margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#15803d' },
    myBookingValue: { margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#166534' },
    blockSelectorPanel: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', border: '1px solid rgba(255,255,255,0.8)' },
    blockSelectorBody: { padding: '2rem 2.5rem' },
    blockSelectorSubtitle: { margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 },
    blockCardsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' },
    blockCard: (isSelected, color) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 1rem', borderRadius: '18px', cursor: 'pointer', border: '2px solid', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden', background: isSelected ? `linear-gradient(135deg, ${color.light}, ${color.lighter})` : 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderColor: isSelected ? color.main : 'rgba(37,99,235,0.1)', boxShadow: isSelected ? `0 8px 28px ${color.shadow}` : '0 2px 8px rgba(0,0,0,0.04)', transform: isSelected ? 'translateY(-4px)' : 'none' }),
    blockCardIconWrap: (isSelected, color) => ({ width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? `linear-gradient(135deg, ${color.main}, ${color.dark})` : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', boxShadow: isSelected ? `0 8px 24px ${color.shadow}` : '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', color: isSelected ? 'white' : '#64748b', fontSize: '2rem' }),
    blockCardLabel: (isSelected, color) => ({ fontSize: '1.15rem', fontWeight: 800, color: isSelected ? color.dark : '#0f172a', margin: 0, letterSpacing: '-0.01em' }),
    blockCardSub: (isSelected) => ({ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#475569' : '#94a3b8', margin: 0, textAlign: 'center', lineHeight: 1.4 }),
    blockCardBadge: (color) => ({ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.2rem 0.6rem', background: `linear-gradient(135deg, ${color.main}, ${color.dark})`, color: 'white', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }),
    selectedTick: (color) => ({ position: 'absolute', top: '0.75rem', left: '0.75rem', width: '22px', height: '22px', borderRadius: '50%', background: `linear-gradient(135deg, ${color.main}, ${color.dark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }),
    roomsPanel: { background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', border: '1px solid rgba(255,255,255,0.8)' },
    roomsPanelBody: { padding: '2rem 2.5rem' },
    roomsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' },
    roomCard: (isSelected, isAvailable) => ({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1.4rem', borderRadius: '22px', cursor: isAvailable ? 'pointer' : 'not-allowed', border: '1.5px solid', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden', background: !isAvailable ? 'linear-gradient(135deg, #f8fafc, #f1f5f9)' : isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'white', borderColor: !isAvailable ? '#e2e8f0' : isSelected ? '#1e40af' : 'rgba(37,99,235,0.1)', boxShadow: isSelected ? '0 12px 30px rgba(37,99,235,0.4)' : '0 4px 18px rgba(0,0,0,0.04)', transform: isSelected ? 'translateY(-5px) scale(1.02)' : 'none', opacity: isAvailable ? 1 : 0.65 }),
    roomNumber: (isSelected, isAvailable) => ({ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.15rem', color: !isAvailable ? '#94a3b8' : isSelected ? 'white' : '#0f172a', letterSpacing: '-0.03em' }),
    roomBadge: (isAvailable, isSelected) => ({ fontSize: '0.65rem', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em', background: isSelected ? 'rgba(255,255,255,0.25)' : isAvailable ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : '#f1f5f9', color: isSelected ? 'white' : isAvailable ? '#059669' : '#94a3b8', border: isSelected ? '1px solid rgba(255,255,255,0.4)' : isAvailable ? '1px solid #10b981' : '1px solid transparent' }),
    roomCapacity: (isSelected) => ({ fontSize: '0.8rem', color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b', fontWeight: 600 }),
    bookingActionsRow: { display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(37,99,235,0.08)' },
    bookRoomBtn: (disabled) => ({ padding: '0.85rem 2.5rem', background: disabled ? 'linear-gradient(135deg, #93c5fd, #bfdbfe)' : 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.25s ease', boxShadow: disabled ? 'none' : '0 6px 16px rgba(37,99,235,0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem' }),
    selectedRoomInfo: { fontSize: '0.88rem', color: '#64748b', fontWeight: 500 },
    roomsLoading: { textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '1rem', fontWeight: 500 },
    bookingBanner: (type) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: type === 'success' ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fef2f2, #fecaca)', border: `1px solid ${type === 'success' ? '#86efac' : '#f87171'}`, borderRadius: '12px', color: type === 'success' ? '#166534' : '#991b1b', fontWeight: 600, fontSize: '0.9rem' }),

    // ── Leave Request styles ──
    leavePage: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    leavePanel: { background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', border: '1px solid rgba(255,255,255,0.8)' },
    leaveTabBar: { display: 'flex', borderBottom: '2px solid rgba(37,99,235,0.08)', background: '#f8fafc', padding: '0 2.5rem' },
    leaveTab: (active) => ({ padding: '1.1rem 1.75rem', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'transparent', borderBottom: active ? '3px solid #3b82f6' : '3px solid transparent', color: active ? '#1e40af' : '#94a3b8', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-2px' }),
    leaveFormBody: { padding: '2rem 2.5rem 2.5rem' },
    leaveFormGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' },
    leaveFieldFull: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    leaveFieldHalf: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    leaveLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.3rem' },
    leaveRequired: { color: '#ef4444', fontSize: '0.85rem' },
    leaveSelect: { padding: '0.875rem 1.1rem', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a', background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', border: '2px solid rgba(37,99,235,0.12)', borderRadius: '12px', outline: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.25s ease' },
    leaveInput: { padding: '0.875rem 1.1rem', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a', background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', border: '2px solid rgba(37,99,235,0.12)', borderRadius: '12px', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'all 0.25s ease' },
    leaveTextarea: { padding: '0.875rem 1.1rem', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a', background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', border: '2px solid rgba(37,99,235,0.12)', borderRadius: '12px', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: '110px', fontFamily: 'inherit', transition: 'all 0.25s ease' },
    durationBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', border: '1px solid #93c5fd', borderRadius: '20px', color: '#1e40af', fontSize: '0.82rem', fontWeight: 700 },
    leaveDivider: { height: '1px', background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.15), transparent)', margin: '0.25rem 0 1rem' },
    leaveSectionLabel: { fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' },
    leaveActionsRow: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid rgba(37,99,235,0.08)' },
    leaveResetBtn: { padding: '0.8rem 1.75rem', background: 'white', color: '#64748b', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.25s ease' },
    leaveSubmitBtn: (disabled) => ({ padding: '0.85rem 2.5rem', background: disabled ? 'linear-gradient(135deg, #93c5fd, #bfdbfe)' : 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: disabled ? 'not-allowed' : 'pointer', boxShadow: disabled ? 'none' : '0 6px 16px rgba(37,99,235,0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s ease' }),
    leaveHistoryBody: { padding: '2rem 2.5rem' },
    leaveHistoryEmpty: { textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' },
    leaveCard: { display: 'flex', alignItems: 'flex-start', gap: '1.25rem', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', borderRadius: '16px', border: '2px solid rgba(37,99,235,0.08)', marginBottom: '1rem', position: 'relative', overflow: 'hidden' },
    leaveCardLeft: { display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 0, flex: 1 },
    leaveCardType: { fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 },
    leaveCardDates: { fontSize: '0.85rem', color: '#64748b', fontWeight: 500, margin: 0 },
    leaveCardReason: { fontSize: '0.82rem', color: '#94a3b8', margin: '0.25rem 0 0', fontStyle: 'italic' },
    leaveCardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 },
    leaveCardDaysBadge: { padding: '0.3rem 0.8rem', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#1e40af', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #93c5fd', whiteSpace: 'nowrap' },

    // ── Notification styles ──
    notifPage: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    notifStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' },
    notifStatCard: (accent) => ({ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: `2px solid ${accent}22`, boxShadow: '0 4px 16px rgba(37,99,235,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default' }),
    notifStatIcon: (gradient) => ({ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: gradient, fontSize: '1.4rem', boxShadow: '0 6px 16px rgba(37,99,235,0.2)' }),
    notifStatValue: { margin: '0 0 0.15rem', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    notifStatLabel: { margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' },
    notifPanel: { background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(37,99,235,0.12)', border: '1px solid rgba(255,255,255,0.8)' },
    notifPanelHeader: { position: 'relative', padding: '2rem 2.5rem', background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)', color: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    notifMarkAllBtn: { padding: '0.55rem 1.25rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '10px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '0.4rem', backdropFilter: 'blur(6px)' },
    notifFilterBar: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', background: '#f8fafc', borderBottom: '1px solid rgba(37,99,235,0.08)', flexWrap: 'wrap' },
    notifCatBar: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 2.5rem', background: 'white', borderBottom: '1px solid rgba(37,99,235,0.06)', flexWrap: 'wrap' },
    notifFilterLabel: { fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '0.25rem' },
    notifFilterChip: (active, accent) => ({ padding: '0.45rem 1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.22s ease', background: active ? accent : 'white', borderColor: active ? accent : '#e2e8f0', color: active ? 'white' : '#64748b', boxShadow: active ? `0 4px 12px ${accent}44` : 'none' }),
    notifCatChip: (active, cfg) => ({ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.22s ease', background: active ? cfg.bg : 'white', borderColor: active ? cfg.border : '#e2e8f0', color: active ? cfg.color : '#64748b' }),
    notifListBody: { padding: '1.5rem 2rem' },
    notifCard: (isRead) => ({ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem', marginBottom: '0.75rem', background: isRead ? 'linear-gradient(135deg,#f8fafc,#f1f5f9)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: '16px', border: '2px solid', borderColor: isRead ? 'rgba(37,99,235,0.08)' : 'rgba(59,130,246,0.25)', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', boxShadow: isRead ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 16px rgba(59,130,246,0.12)' }),
    notifUnreadDot: { position: 'absolute', top: '1rem', right: '1rem', width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 8px rgba(59,130,246,0.6)' },
    notifTypeIconWrap: (cfg) => ({ flexShrink: 0, width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cfg.bg, border: `1.5px solid ${cfg.border}`, fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }),
    notifCardBody: { flex: 1, minWidth: 0 },
    notifCardTitle: (isRead) => ({ margin: '0 0 0.3rem', fontSize: '0.95rem', fontWeight: isRead ? 600 : 800, color: '#0f172a' }),
    notifCardMsg: { margin: '0 0 0.6rem', fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, fontWeight: 500 },
    notifCardMeta: { display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' },
    notifTimeBadge: { fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8' },
    notifTypePill: (cfg) => ({ padding: '0.15rem 0.6rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }),
    notifPriorityPill: (p) => ({ padding: '0.15rem 0.6rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, background: notifPriorityBadge[p]?.bg, color: notifPriorityBadge[p]?.color, border: `1px solid ${notifPriorityBadge[p]?.border}` }),
    notifCardActions: { display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0, alignItems: 'flex-end' },
    notifReadBtn: { padding: '0.35rem 0.8rem', background: 'white', color: '#3b82f6', border: '1.5px solid #93c5fd', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
    notifDeleteBtn: { padding: '0.35rem 0.65rem', background: '#fef2f2', color: '#ef4444', border: '1.5px solid #fca5a5', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease' },
    notifEmpty: { textAlign: 'center', padding: '4rem 2rem' },
  };

  const keyframesStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
    @keyframes shimmer { 0% { background-position:-1000px 0; } 100% { background-position:1000px 0; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes notifPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.45);} 60%{box-shadow:0 0 0 7px rgba(37,99,235,0);} }
    @keyframes notifSlideIn { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
    .nstat:hover  { transform:translateY(-4px) !important; box-shadow:0 16px 40px rgba(37,99,235,0.14) !important; }
    .nchip:hover  { transform:translateY(-1px); box-shadow:0 4px 14px rgba(37,99,235,0.18) !important; }
    .ncard:hover  { transform:translateY(-2px) !important; box-shadow:0 12px 36px rgba(37,99,235,0.13) !important; }
    .ncard:hover .ncard-bar { transform:scaleY(1) !important; }
    .ncard-bar    { transform:scaleY(0); transform-origin:top; transition:transform 0.3s ease; }
    .nbtn-read:hover { background:#1d4ed8 !important; transform:translateY(-1px); box-shadow:0 6px 16px rgba(29,78,216,0.4) !important; }
    .nbtn-del:hover  { background:#fee2e2 !important; color:#dc2626 !important; }
    .nmark-all:hover { background:white !important; color:#1d4ed8 !important; }
    .sidebar::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#60a5fa,#93c5fd,#bfdbfe,#dbeafe); animation:shimmer 3s linear infinite; background-size:1000px 100%; }
    .sidebar-logo:hover { transform:rotate(5deg) scale(1.05); }
    .logout-btn:hover { background:linear-gradient(135deg,#60a5fa,#93c5fd) !important; transform:translateY(-3px); box-shadow:0 10px 25px rgba(59,130,246,0.5); }
    .detail-card:hover { background:linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%) !important; border-color:rgba(59,130,246,0.3) !important; transform:translateY(-4px) translateX(4px); box-shadow:0 12px 32px rgba(59,130,246,0.2); }
    .detail-card:hover .detail-card-icon { transform:scale(1.1) rotate(5deg); }
    .detail-card::before { content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:linear-gradient(180deg,#3b82f6,#60a5fa); transform:scaleY(0); transition:transform 0.3s ease; }
    .detail-card:hover::before { transform:scaleY(1); }
    .sidebar-link:hover { background:rgba(255,255,255,0.15) !important; transform:translateX(6px); }
    .sidebar-link:hover .sidebar-link-icon { transform:scale(1.2); }
    .profile-photo:hover { transform:scale(1.08); }
    .dashboard-panel:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(37,99,235,0.18); }
    .details-section-title::after, .edit-form-title::after { content:''; position:absolute; bottom:0; left:0; width:60px; height:3px; background:linear-gradient(90deg,#3b82f6,#60a5fa); border-radius:2px; }
    .edit-icon-input:focus-within { border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.15) !important; background:white !important; }
    .save-btn:hover { background:linear-gradient(135deg,#1e3a8a,#1e40af) !important; transform:translateY(-2px); box-shadow:0 10px 24px rgba(37,99,235,0.45) !important; }
    .cancel-btn:hover { background:#f1f5f9 !important; border-color:#cbd5e1 !important; }
    .change-photo-btn:hover { transform:scale(1.12) !important; }
    .edit-trigger-btn:hover { background:linear-gradient(135deg,#1e3a8a,#1e40af) !important; transform:translateY(-2px); box-shadow:0 10px 24px rgba(37,99,235,0.45) !important; }
    .spin { animation: spin 0.9s linear infinite; display:inline-block; }
    .block-card:hover { transform:translateY(-6px) !important; box-shadow:0 16px 40px rgba(0,0,0,0.12) !important; }
    .room-card-available:hover { transform:translateY(-4px) !important; box-shadow:0 8px 24px rgba(59,130,246,0.2) !important; }
    .book-btn:hover { background:linear-gradient(135deg,#1e3a8a,#1e40af) !important; transform:translateY(-2px); box-shadow:0 10px 24px rgba(37,99,235,0.45) !important; }
    .leave-input:focus,.leave-select:focus,.leave-textarea:focus { border-color:#3b82f6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.15) !important; background:white !important; }
    .leave-submit-btn:hover { background:linear-gradient(135deg,#1e3a8a,#1e40af) !important; transform:translateY(-2px); box-shadow:0 10px 24px rgba(37,99,235,0.45) !important; }
    .leave-reset-btn:hover { background:#f1f5f9 !important; border-color:#cbd5e1 !important; }
    .leave-tab:hover { color:#1e40af !important; }
    .leave-card::before { content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:linear-gradient(180deg,#3b82f6,#60a5fa); border-radius:2px; }
    .notif-stat-card:hover { transform:translateY(-4px) !important; box-shadow:0 12px 32px rgba(37,99,235,0.15) !important; }
    .notif-card:hover { transform:translateY(-3px) translateX(3px); box-shadow:0 8px 28px rgba(37,99,235,0.15) !important; }
    .notif-card::before { content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:linear-gradient(180deg,#3b82f6,#60a5fa); transform:scaleY(0); transition:transform 0.3s ease; border-radius:2px; }
    .notif-card:hover::before { transform:scaleY(1); }
    .notif-mark-all-btn:hover { background:rgba(255,255,255,0.35) !important; transform:translateY(-1px); }
    .notif-read-btn:hover { background:#eff6ff !important; }
    .notif-delete-btn:hover { background:#fee2e2 !important; }
    .notif-unread-dot { animation:notifPulse 2s ease-in-out infinite; }
    .notif-card-enter { animation:fadeSlideIn 0.4s ease both; }
    .notif-filter-chip:hover { transform:translateY(-1px); }
    .notif-cat-chip:hover { transform:translateY(-1px); }
    html, body { overflow:hidden; height:100%; }
    .dashboard-layout { min-width:900px; }
    @media (max-width:768px) {
      .sidebar { width:70px !important; min-width:70px !important; }
      .dashboard-main { margin-left:70px !important; }
      .sidebar-link-label, .sidebar-link-sublabel, .sidebar-section-title { display:none !important; }
      .sidebar-link { justify-content:center !important; padding:0.75rem !important; }
      .edit-grid, .block-cards-row, .leave-form-grid { grid-template-columns:1fr !important; }
      .notif-stats-row { grid-template-columns:1fr 1fr !important; }
    }
  `;

  // ── Config ──
  const blocks = [
    { id:'A', label:'Block A', sub:'Boys Hostel',             emoji:'🏠', badge:'Boys',  color:{ main:'#3b82f6', dark:'#1e40af', light:'#dbeafe', lighter:'#bfdbfe', shadow:'rgba(59,130,246,0.3)' } },
    { id:'B', label:'Block B', sub:'Girls Hostel',            emoji:'🏡', badge:'Girls', color:{ main:'#ec4899', dark:'#be185d', light:'#fce7f3', lighter:'#fbcfe8', shadow:'rgba(236,72,153,0.3)'  } },
    { id:'C', label:'Block C', sub:'Lecturers / Instructors', emoji:'🏢', badge:'Staff', color:{ main:'#8b5cf6', dark:'#6d28d9', light:'#ede9fe', lighter:'#ddd6fe', shadow:'rgba(139,92,246,0.3)' } },
  ];

  const fields = [
    { name:'studentId',    label:'IT Number',       icon:'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2', full:false },
    { name:'fullName',     label:'Full Name',       icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',                                                                                                                                                                         full:false },
    { name:'email',        label:'Email Address',   icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',                                                                                                                                         full:false, disabled:true },
    { name:'phone',        label:'Phone Number',    icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',                         full:false },
    { name:'department',   label:'Department',      icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',                                                                                                  full:false },
    { name:'yearSemester', label:'Year & Semester', icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',                                                                                                                                                       full:false },
    { name:'address',      label:'Address',         icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',                                                                                                                            full:true  },
  ];

  const currentPhoto = photoPreview || studentData._localPhoto
    || (studentData.profilePhoto ? `${API_BASE}/${studentData.profilePhoto}` : null)
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName||'Student')}&size=120&background=2563eb&color=fff`;

  const navItems = [
    { section:'dashboard',    label:'Dashboard',       group:'MAIN',    d:'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { section:'digital-pass', label:'My Digital Pass', group:'MAIN',    d:'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 5a2 2 0 110-4 2 2 0 010 4zm4-2h4m-4 4h4m-8 4h8' },
    { section:'profile',      label:'Student Profile', group:'STUDENT', d:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { section:'rooms',        label:'Room Selection',  group:'STUDENT', d:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { section:'leave',        label:'Leave Request',   group:'STUDENT', d:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { section:'room-change',  label:'Room Change',     group:'STUDENT', d:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', action: () => navigate('/room-change-request') },
    { section:'payments',     label:'Payments & Fees', group:'STUDENT', d:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', action: () => navigate('/payment/student/dashboard') },
    { section:'submit-payment', label:'Submit Payment', group:'STUDENT', d:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', action: () => navigate('/payment/student/submit-payment') },
    { section:'payment-history', label:'Payment History', group:'STUDENT', d:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', action: () => navigate('/payment/student/history') },
    { section:'complaints',   label:'Complaints',      group:'STUDENT', d:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', action: () => navigate('/complaint/dashboard') },
    { section:'notification', label:'Notification',    group:'STUDENT', d:'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { section:'gallery',      label:'Gallery',         group:'STUDENT', sublabel:'Rooms', d:'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { section:'about',        label:'About',           group:'STUDENT', d:'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const getSectionTitle = () => ({ dashboard:'Student Dashboard', profile:'Student Profile', rooms:'Room Selection', leave:'Leave Request', notification:'Notification', gallery:'Gallery', about:'About' })[activeSection] || 'Student Dashboard';

  // ── Notification category config ──
  const notifCategories = [
    { key:'all',     label:'All',     icon:'🔔', cfg:{ bg:'linear-gradient(135deg,#dbeafe,#bfdbfe)', color:'#1e40af', border:'#93c5fd' } },
    { key:'leave',   label:'Leave',   icon:'📋', cfg:notifTypeConfig.leave   },
    { key:'room',    label:'Room',    icon:'🏠', cfg:notifTypeConfig.room    },
    { key:'alert',   label:'Alert',   icon:'🔔', cfg:notifTypeConfig.alert   },
    { key:'general', label:'General', icon:'📢', cfg:notifTypeConfig.general },
  ];

  // ─────────────────────────────────────────
  //  RENDER CONTENT
  // ─────────────────────────────────────────
  const renderContent = () => {
    switch (activeSection) {

      // ── DIGITAL PASS ──
      case 'digital-pass':
        const qrPayload = JSON.stringify({ studentRef: studentData._id, studentId: studentData.studentId, studentName: displayName });
        return (
          <div style={{ padding: '2rem', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin:0 }}>Digital Pass</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>Present this QR code for daily hostel attendance</p>
            </div>
            
            <div style={{
              width: '100%', maxWidth: '380px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              borderRadius: '24px', padding: '30px', boxShadow: '0 20px 40px rgba(37,99,235,0.3)',
              position: 'relative', overflow: 'hidden', textAlign: 'center', color: 'white'
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <img src={profilePhotoUrl || placeholderAvatar} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', marginBottom: '15px', objectFit:'cover' }} />
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 5px 0' }}>{displayName}</h3>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, margin: '0 0 25px 0', letterSpacing: '0.05em' }}>{studentData.studentId || 'N/A'}</p>
                
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' }}>
                  <QRCodeCanvas value={qrPayload} size={200} level="H" includeMargin={true} />
                  <div style={{ width: '100%', height: '4px', background: 'rgba(59,130,246,0.6)', position: 'absolute', left: 0, top: '50%', boxShadow: '0 0 15px 5px rgba(59,130,246,0.5)', animation: 'scanLine 3s infinite linear' }}></div>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '20px', fontWeight: 500 }}>
                  Live updating • Secure QR Format
                </p>
                <style>{`
                  @keyframes scanLine {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { top: 90%; opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                  }
                `}</style>
              </div>
            </div>
          </div>
        );

      // ── DASHBOARD ──
      case 'dashboard':
        return (
          <div style={styles.dashboardPanel} className="dashboard-panel">
            <div style={styles.panelHeader}><div style={styles.panelHeaderAccent}></div><h2 style={styles.panelHeaderH2}>Your personal information</h2></div>
            <div style={styles.profileSection}>
              <div style={styles.profilePhotoWrap}>
                <img src={profilePhotoUrl || placeholderAvatar} alt="Profile" style={styles.profilePhoto} className="profile-photo" onError={(e) => { e.target.src = placeholderAvatar; }} />
                <div style={styles.profileStatus}>✓</div>
              </div>
              <h3 style={styles.profileName}>{displayName}</h3>
              <p style={styles.profileRole}>Hostel Student</p>
            </div>
            <div style={styles.detailsSection}>
              <h3 style={styles.detailsSectionTitle} className="details-section-title">Registration Details</h3>
              <div style={styles.detailsGrid}>
                {[
                  { label:'IT NUMBER',       value:studentData.studentId,    d:'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
                  { label:'FULL NAME',       value:studentData.fullName,     d:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { label:'EMAIL',           value:studentData.email,        d:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                  { label:'PHONE',           value:studentData.phone,        d:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                  { label:'DEPARTMENT',      value:studentData.department,   d:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                  { label:'YEAR & SEMESTER', value:studentData.yearSemester, d:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { label:'ADDRESS',         value:studentData.address,      d:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                ].map(({ label, value, d }) => (
                  <div className="detail-card" style={styles.detailCard} key={label}>
                    <div style={styles.detailCardIcon} className="detail-card-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg></div>
                    <div style={styles.detailCardContent}><span style={styles.detailLabel}>{label}</span><span style={styles.detailValue}>{value || '—'}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ── STUDENT PROFILE ──
      case 'profile':
        return (
          <div style={styles.editPanel}>
            <div style={styles.panelHeader}><div style={styles.panelHeaderAccent}></div><h2 style={styles.panelHeaderH2}>{editMode ? 'Edit Your Profile' : 'Student Profile'}</h2></div>
            <div style={styles.editPhotoSection}>
              <div style={styles.editPhotoWrap}>
                <img src={currentPhoto} alt="Profile" style={styles.editPhotoImg} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName||'Student')}&size=120&background=2563eb&color=fff`; }} />
                {editMode && (<><button style={styles.changePhotoBtn} className="change-photo-btn" title="Change photo" onClick={() => fileInputRef.current.click()}><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button><input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange} /></>)}
              </div>
              {editMode ? <p style={styles.editPhotoHint}>Click the camera icon to change your photo</p> : <><p style={{ margin:'0 0 0.3rem', fontSize:'1.2rem', fontWeight:800, color:'#0f172a' }}>{studentData.fullName||'Student'}</p><p style={styles.profileRole}>Hostel Student</p></>}
            </div>
            {(saveSuccess||saveError) && (<div style={{ padding:'1.5rem 2.5rem 0' }}>{saveSuccess && <div style={styles.successBanner}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Profile updated successfully!</div>}{saveError && <div style={styles.errorBanner}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{saveError}</div>}</div>)}
            <div style={styles.editFormSection}>
              <h3 style={styles.editFormTitle} className="edit-form-title">{editMode ? 'Update Your Details' : 'Your Details'}</h3>
              <div className="edit-grid" style={styles.editGrid}>
                {fields.map(({ name, label, icon, full, disabled }) => (
                  <div key={name} style={full ? styles.editFieldWrapFull : styles.editFieldWrap}>
                    <label style={styles.editLabel}>{label}</label>
                    {editMode && !disabled ? (<div className="edit-icon-input" style={styles.editIconInput}><span style={styles.editIconInputIcon}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg></span><input style={styles.editIconInputField} name={name} value={formData[name]||''} onChange={handleChange} placeholder={`Enter ${label.toLowerCase()}`} /></div>)
                    : (<div style={{ ...styles.editIconInput, background:disabled&&editMode?'#f1f5f9':styles.editIconInput.background, borderColor:disabled&&editMode?'#e2e8f0':styles.editIconInput.borderColor }}><span style={{ ...styles.editIconInputIcon, color:disabled&&editMode?'#94a3b8':'#3b82f6' }}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg></span><span style={{ ...styles.editIconInputField, padding:'0.875rem 0', color:studentData[name]?'#0f172a':'#94a3b8' }}>{studentData[name]||'—'}</span></div>)}
                    {disabled&&editMode && <span style={{ fontSize:'0.7rem', color:'#94a3b8', marginTop:'0.2rem' }}>Email cannot be changed</span>}
                  </div>
                ))}
              </div>
              <div style={styles.editActionsRow}>
                {editMode ? (<><button style={styles.cancelBtn} className="cancel-btn" onClick={handleCancel}>Cancel</button><button style={saving?styles.saveBtnDisabled:styles.saveBtn} className={saving?'':'save-btn'} onClick={handleSave} disabled={saving}>{saving?<><span className="spin"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>Saving…</>:<><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Save Changes</>}</button></>)
                : (<button style={styles.editTriggerBtn} className="edit-trigger-btn" onClick={handleEditToggle}><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Edit Profile</button>)}
              </div>
            </div>
          </div>
        );

      case 'rooms':
        return (
          <div style={styles.roomPage}>
            {myBooking && (<div style={styles.myBookingBanner}><div style={styles.myBookingIcon}><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div style={{...styles.myBookingText, flex: 1}}><p style={styles.myBookingTitle}>Your Current Room Booking</p><p style={styles.myBookingValue}>Block {myBooking.block||'—'} · Room {myBooking.roomNumber||myBooking.room||'—'}{myBooking.type?` · ${myBooking.type}`:''}</p></div><button onClick={() => navigate('/payment/student/gateway')} style={{ padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)', transition: 'background 0.2s', marginRight: '10px' }}>Pay Fees 💳</button><button onClick={handleCancelBooking} disabled={bookingLoading} style={{ padding: '10px 18px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '10px', cursor: bookingLoading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(220, 38, 38, 0.2)', transition: 'background 0.2s', opacity: bookingLoading ? 0.7 : 1 }}>Cancel Booking</button></div>)}

            <div style={styles.blockSelectorPanel}>
              <div style={styles.panelHeader}><div style={styles.panelHeaderAccent}></div><h2 style={styles.panelHeaderH2}>Select a Block</h2></div>
              <div style={styles.blockSelectorBody}>
                <p style={styles.blockSelectorSubtitle}>Choose your preferred hostel block to view available rooms</p>
                <div style={styles.blockCardsRow} className="block-cards-row">
                  {blocks.map(block => (
                    <div key={block.id} className="block-card" style={styles.blockCard(selectedBlock===block.id,block.color)} onClick={() => setSelectedBlock(block.id)}>
                      {selectedBlock===block.id && <div style={styles.selectedTick(block.color)}><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
                      <div style={styles.blockCardBadge(block.color)}>{block.badge}</div>
                      <div style={styles.blockCardIconWrap(selectedBlock===block.id,block.color)}><span style={{ fontSize:'2.2rem' }}>{block.emoji}</span></div>
                      <p style={styles.blockCardLabel(selectedBlock===block.id,block.color)}>{block.label}</p>
                      <p style={styles.blockCardSub(selectedBlock===block.id)}>{block.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {selectedBlock && (
              <div style={styles.roomsPanel}>
                <div style={styles.panelHeader}><div style={styles.panelHeaderAccent}></div><h2 style={styles.panelHeaderH2}>Block {selectedBlock} — {blocks.find(b=>b.id===selectedBlock)?.sub} Rooms</h2></div>
                <div style={styles.roomsPanelBody}>
                  {bookingStatus && (<div style={{ ...styles.bookingBanner(bookingStatus), marginBottom:'1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{bookingStatus==='success'?<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />:<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}</svg>
                      <span>{bookingMsg}</span>
                    </div>
                    {bookingStatus === 'success' && (
                      <button onClick={() => navigate('/payment/student/gateway')} style={{ padding:'7px 16px', background:'white', color:'#15803d', border:'none', borderRadius:'6px', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.1)' }}>Proceed to Payment →</button>
                    )}
                  </div>)}
                  {roomsLoading && (<div style={styles.roomsLoading}><span className="spin" style={{ display:'inline-block', marginRight:'0.5rem' }}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>Loading rooms…</div>)}
                  {roomsError && (<div style={{ ...styles.bookingBanner('error'), marginBottom:'1rem' }}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{roomsError}</div>)}
                  {!roomsLoading && !roomsError && rooms.length===0 && (<><p style={{ margin:'0 0 1.25rem', fontSize:'0.82rem', color:'#94a3b8', fontWeight:500 }}>⚠️ No rooms loaded from server — showing demo rooms. Connect your backend to see live data.</p><div style={styles.roomsGrid}>{Array.from({ length:12 },(_,i) => { const num=`${selectedBlock}${String(i+101).slice(1)}`; const available=i%3!==2; const isSelected=selectedRoom?.roomNumber===num; return (
                    <div key={num} className={available?'room-card-available':''} style={styles.roomCard(isSelected,available)} onClick={() => available&&setSelectedRoom(isSelected?null:{ roomNumber:num, isAvailable:true, capacity:2 })}>
                      {isSelected && <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', background:'rgba(255,255,255,0.1)', borderRadius:'50%' }}></div>}
                      <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center', marginBottom:'1.2rem', position:'relative', zIndex:1 }}>
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={!available?'#cbd5e1':isSelected?'white':'#2563eb'} strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span style={styles.roomBadge(available, isSelected)}>{available?'Available':'Occupied'}</span>
                      </div>
                      <div style={{ position:'relative', zIndex:1, width:'100%' }}>
                        <p style={styles.roomNumber(isSelected,available)}>Room {num}</p>
                        <span style={styles.roomCapacity(isSelected)}>Capacity: 2 beds</span>
                        <button style={{ marginTop: '1.25rem', width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: isSelected ? 'rgba(255,255,255,0.15)' : available ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent', color: isSelected ? 'white' : available ? '#2563eb' : 'transparent', fontWeight: 800, fontSize: '0.85rem', cursor: available ? 'pointer' : 'default', transition: 'all 0.25s ease', display: isSelected || available ? 'block' : 'none', border: isSelected ? '1px solid rgba(255,255,255,0.3)' : available ? '1px solid #bfdbfe' : 'none', letterSpacing: '0.02em' }}>{isSelected ? '✓ Room Selected' : 'Choose Room'}</button>
                      </div>
                    </div>
                  ); })}</div></>)}
                  {!roomsLoading && !roomsError && rooms.length>0 && (<div style={styles.roomsGrid}>{rooms.map(room => { const available=room.isAvailable!==false; const isSelected=selectedRoom?._id===room._id; return (
                    <div key={room._id} className={available?'room-card-available':''} style={styles.roomCard(isSelected,available)} onClick={() => available&&setSelectedRoom(isSelected?null:room)}>
                      {isSelected && <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', background:'rgba(255,255,255,0.1)', borderRadius:'50%' }}></div>}
                      <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center', marginBottom:'1.2rem', position:'relative', zIndex:1 }}>
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={!available?'#cbd5e1':isSelected?'white':'#2563eb'} strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        <span style={styles.roomBadge(available, isSelected)}>{available?'Available':'Occupied'}</span>
                      </div>
                      <div style={{ position:'relative', zIndex:1, width:'100%' }}>
                        <p style={styles.roomNumber(isSelected,available)}>Room {room.roomNumber}</p>
                        <span style={styles.roomCapacity(isSelected)}>Capacity: {room.capacity||2} beds</span>
                        <button style={{ marginTop: '1.25rem', width: '100%', padding: '0.75rem', borderRadius: '12px', border: 'none', background: isSelected ? 'rgba(255,255,255,0.15)' : available ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent', color: isSelected ? 'white' : available ? '#2563eb' : 'transparent', fontWeight: 800, fontSize: '0.85rem', cursor: available ? 'pointer' : 'default', transition: 'all 0.25s ease', display: isSelected || available ? 'block' : 'none', border: isSelected ? '1px solid rgba(255,255,255,0.3)' : available ? '1px solid #bfdbfe' : 'none', letterSpacing: '0.02em' }}>{isSelected ? '✓ Room Selected' : 'Choose Room'}</button>
                      </div>
                    </div>
                  ); })}</div>)}
                  {!roomsLoading && (<div style={styles.bookingActionsRow}>
                    <button className={selectedRoom && !myBooking ? 'book-btn' : ''} style={styles.bookRoomBtn(!selectedRoom||bookingLoading||myBooking)} onClick={handleBookRoom} disabled={!selectedRoom||bookingLoading||myBooking}>
                      {bookingLoading ? <><span className="spin"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>Processing…</> : myBooking ? <><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Cancel Existing Booking First</> : <><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Book Selected Room</>}
                    </button>
                    {selectedRoom && <span style={styles.selectedRoomInfo}>Selected: <strong>Room {selectedRoom.roomNumber}</strong> · Block {selectedBlock}</span>}
                  </div>)}


                </div>
              </div>
            )}
          </div>
        );

      // ── LEAVE REQUEST ──
      case 'leave':
        return (
          <div style={styles.leavePage}>
            <div style={styles.leavePanel}>
              <div style={styles.panelHeader}>
                <div style={styles.panelHeaderAccent}></div>
                <h2 style={styles.panelHeaderH2}>📋 Leave Request</h2>
              </div>
              <div style={styles.leaveTabBar}>
                <button className="leave-tab" style={styles.leaveTab(activeLeaveTab==='apply')}
                  onClick={() => { setActiveLeaveTab('apply'); setLeaveSubmitStatus(''); setLeaveSubmitMsg(''); }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Apply for Leave
                </button>
                <button className="leave-tab" style={styles.leaveTab(activeLeaveTab==='history')}
                  onClick={() => { setActiveLeaveTab('history'); fetchMyLeaves(); }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  My Leave History
                  {myLeaves.length > 0 && (
                    <span style={{ padding:'0.1rem 0.55rem', background:'#3b82f6', color:'white', borderRadius:'20px', fontSize:'0.65rem', fontWeight:700 }}>{myLeaves.length}</span>
                  )}
                </button>
              </div>
              {activeLeaveTab === 'apply' && (
                <div style={styles.leaveFormBody}>
                  {leaveSubmitStatus && (
                    <div style={{ ...styles.bookingBanner(leaveSubmitStatus === 'success' ? 'success' : 'error'), marginBottom:'1.5rem' }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{leaveSubmitStatus === 'success' ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}</svg>
                      {leaveSubmitMsg}
                    </div>
                  )}
                  <div className="leave-form-grid" style={styles.leaveFormGrid}>
                    <div style={styles.leaveFieldFull}>
                      <label style={styles.leaveLabel}>Leave Type <span style={styles.leaveRequired}>*</span></label>
                      <select className="leave-select" style={styles.leaveSelect} name="leaveType" value={leaveForm.leaveType} onChange={handleLeaveChange}>
                        <option value="">— Select Leave Type —</option>
                        {leaveTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div style={styles.leaveFieldHalf}>
                      <label style={styles.leaveLabel}>From Date <span style={styles.leaveRequired}>*</span></label>
                      <input className="leave-input" style={styles.leaveInput} type="date" name="fromDate" value={leaveForm.fromDate} onChange={handleLeaveChange} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div style={styles.leaveFieldHalf}>
                      <label style={styles.leaveLabel}>To Date <span style={styles.leaveRequired}>*</span></label>
                      <input className="leave-input" style={styles.leaveInput} type="date" name="toDate" value={leaveForm.toDate} onChange={handleLeaveChange} min={leaveForm.fromDate || new Date().toISOString().split('T')[0]} />
                    </div>
                    {leaveForm.fromDate && leaveForm.toDate && (
                      <div style={{ gridColumn:'1/-1' }}>
                        <span style={styles.durationBadge}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Duration: {calcDays(leaveForm.fromDate, leaveForm.toDate)} day{calcDays(leaveForm.fromDate, leaveForm.toDate) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    <div style={styles.leaveFieldFull}>
                      <label style={styles.leaveLabel}>Reason for Leave <span style={styles.leaveRequired}>*</span></label>
                      <textarea className="leave-textarea" style={styles.leaveTextarea} name="reason" value={leaveForm.reason} onChange={handleLeaveChange} placeholder="Please describe the reason for your leave request in detail…" />
                    </div>
                    <div style={styles.leaveFieldFull}>
                      <div style={styles.leaveDivider}></div>
                      <p style={styles.leaveSectionLabel}>📞 Emergency Contact Details (Optional)</p>
                    </div>
                    <div style={styles.leaveFieldHalf}>
                      <label style={styles.leaveLabel}>Your Contact Number</label>
                      <input className="leave-input" style={styles.leaveInput} type="tel" name="contactDuringLeave" value={leaveForm.contactDuringLeave} onChange={handleLeaveChange} placeholder="e.g. 07x-xxx-xxxx" />
                    </div>
                    <div style={styles.leaveFieldHalf}>
                      <label style={styles.leaveLabel}>Parent / Guardian Name</label>
                      <input className="leave-input" style={styles.leaveInput} type="text" name="parentName" value={leaveForm.parentName} onChange={handleLeaveChange} placeholder="Full name" />
                    </div>
                    <div style={styles.leaveFieldHalf}>
                      <label style={styles.leaveLabel}>Parent / Guardian Phone</label>
                      <input className="leave-input" style={styles.leaveInput} type="tel" name="parentPhone" value={leaveForm.parentPhone} onChange={handleLeaveChange} placeholder="e.g. 07x-xxx-xxxx" />
                    </div>
                  </div>
                  <div style={styles.leaveActionsRow}>
                    <button className="leave-reset-btn" style={styles.leaveResetBtn} onClick={handleLeaveReset}>Reset</button>
                    <button className={leaveSubmitting ? '' : 'leave-submit-btn'} style={styles.leaveSubmitBtn(leaveSubmitting)} onClick={handleLeaveSubmit} disabled={leaveSubmitting}>
                      {leaveSubmitting ? <><span className="spin"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>Submitting…</> : <><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>Submit Leave Request</>}
                    </button>
                  </div>
                </div>
              )}
              {activeLeaveTab === 'history' && (
                <div style={styles.leaveHistoryBody}>
                  {leavesLoading && (<div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}><span className="spin" style={{ display:'inline-block', marginRight:'0.5rem' }}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>Loading leave history…</div>)}
                  {!leavesLoading && myLeaves.length === 0 && (
                    <div style={styles.leaveHistoryEmpty}>
                      <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>📋</div>
                      <p style={{ fontSize:'1.1rem', fontWeight:700, color:'#64748b', margin:'0 0 0.5rem' }}>No Leave Requests Yet</p>
                      <p style={{ fontSize:'0.88rem', color:'#94a3b8', margin:'0 0 1.5rem' }}>Your submitted leave requests will appear here.</p>
                      <button style={styles.editTriggerBtn} onClick={() => setActiveLeaveTab('apply')}>Apply for Leave</button>
                    </div>
                  )}
                  {!leavesLoading && myLeaves.length > 0 && myLeaves.map((leave, idx) => {
                    const st = getStatusStyle(leave.status || 'pending');
                    const days = calcDays(leave.fromDate, leave.toDate);
                    const typeName = leaveTypes.find(t => t.value === leave.leaveType)?.label || leave.leaveType || 'Leave Request';
                    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
                    return (
                      <div key={leave._id || idx} className="leave-card" style={styles.leaveCard}>
                        <div style={styles.leaveCardLeft}>
                          <p style={styles.leaveCardType}>{typeName}</p>
                          <p style={styles.leaveCardDates}>📅 {fmt(leave.fromDate)} → {fmt(leave.toDate)}</p>
                          {leave.reason && <p style={styles.leaveCardReason}>"{leave.reason.length > 90 ? leave.reason.slice(0, 90) + '…' : leave.reason}"</p>}
                        </div>
                        <div style={styles.leaveCardRight}>
                          <span style={{ padding:'0.3rem 0.9rem', background:st.bg, border:`1px solid ${st.border}`, borderRadius:'20px', color:st.color, fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{st.label}</span>
                          <span style={styles.leaveCardDaysBadge}>{days} day{days !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      // ══════════════════════════════════════
      //  NOTIFICATION  — Clean Website Style
      // ══════════════════════════════════════
      case 'notification':
        return (
          <div style={{ fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", display:'flex', flexDirection:'column', gap:'1.75rem' }}>

            {/* ── HERO HEADER BAND ── */}
            <div style={{
              background:'linear-gradient(135deg,#1e3a8a 0%,#1e40af 45%,#2563eb 100%)',
              borderRadius:'22px', padding:'2.25rem 2.5rem',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              position:'relative', overflow:'hidden',
              boxShadow:'0 16px 48px rgba(37,99,235,0.35)',
            }}>
              <div style={{ position:'absolute', top:'-40px', right:'-40px',  width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
              <div style={{ position:'absolute', bottom:'-60px', right:'120px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
              <div style={{ position:'absolute', top:'20px', right:'200px',    width:'80px',  height:'80px',  borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', border:'1px solid rgba(255,255,255,0.2)' }}>🔔</div>
                  <h2 style={{ margin:0, fontSize:'1.55rem', fontWeight:800, color:'white', letterSpacing:'-0.03em' }}>Notifications</h2>
                  {notifUnreadCount > 0 && (
                    <span style={{ padding:'0.2rem 0.75rem', background:'#ef4444', color:'white', borderRadius:'20px', fontSize:'0.72rem', fontWeight:800, letterSpacing:'0.04em', boxShadow:'0 4px 12px rgba(239,68,68,0.5)' }}>
                      {notifUnreadCount} NEW
                    </span>
                  )}
                </div>
                <p style={{ margin:0, color:'rgba(255,255,255,0.65)', fontSize:'0.88rem', fontWeight:500 }}>
                  Stay updated with your hostel activity and announcements
                </p>
              </div>
              {notifUnreadCount > 0 && (
                <button className="nmark-all" onClick={markAllNotifsRead} style={{
                  position:'relative', zIndex:1,
                  padding:'0.7rem 1.5rem', background:'rgba(255,255,255,0.12)',
                  color:'white', border:'1.5px solid rgba(255,255,255,0.3)',
                  borderRadius:'12px', fontWeight:700, fontSize:'0.82rem',
                  cursor:'pointer', transition:'all 0.25s ease',
                  backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap:'0.5rem',
                  fontFamily:'inherit',
                }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Mark all read
                </button>
              )}
            </div>

            {/* ── STATS ROW ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
              {[
                { label:'Total',  value:notifications.length,                                  icon:'📬', from:'#2563eb', to:'#3b82f6', light:'#eff6ff', border:'#bfdbfe' },
                { label:'Unread', value:notifUnreadCount,                                       icon:'🔴', from:'#dc2626', to:'#ef4444', light:'#fef2f2', border:'#fecaca' },
                { label:'Leave',  value:notifications.filter(n=>n.type==='leave').length,       icon:'📋', from:'#1d4ed8', to:'#60a5fa', light:'#eff6ff', border:'#bfdbfe' },
                { label:'Alerts', value:notifications.filter(n=>n.type==='alert').length,       icon:'⚠️', from:'#b45309', to:'#f59e0b', light:'#fffbeb', border:'#fde68a' },
              ].map(({ label, value, icon, from, to, light, border }) => (
                <div key={label} className="nstat" style={{
                  background:'white', borderRadius:'18px',
                  border:`1.5px solid ${border}`,
                  padding:'1.4rem 1.5rem',
                  display:'flex', alignItems:'center', gap:'1rem',
                  boxShadow:'0 4px 16px rgba(37,99,235,0.07)',
                  transition:'all 0.3s ease', cursor:'default',
                }}>
                  <div style={{
                    width:'50px', height:'50px', borderRadius:'14px', flexShrink:0,
                    background:`linear-gradient(135deg,${from},${to})`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.3rem', boxShadow:`0 8px 20px ${from}44`,
                  }}>{icon}</div>
                  <div>
                    <p style={{ margin:'0 0 0.1rem', fontSize:'1.75rem', fontWeight:800, color:'#0f172a', lineHeight:1, letterSpacing:'-0.03em' }}>{value}</p>
                    <p style={{ margin:0, fontSize:'0.7rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── FILTER + LIST PANEL ── */}
            <div style={{
              background:'white', borderRadius:'22px',
              boxShadow:'0 4px 32px rgba(37,99,235,0.09)',
              border:'1.5px solid #e0eaff', overflow:'hidden',
            }}>

              {/* Filter bar */}
              <div style={{
                padding:'1.1rem 2rem', background:'#f8faff',
                borderBottom:'1.5px solid #e0eaff',
                display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap',
              }}>
                {/* Read status chips */}
                <div style={{ display:'flex', gap:'0.5rem', marginRight:'0.5rem' }}>
                  {[
                    { key:'all',    label:'All',    bg:'#2563eb' },
                    { key:'unread', label:'Unread', bg:'#dc2626' },
                    { key:'read',   label:'Read',   bg:'#16a34a' },
                  ].map(({ key, label, bg }) => {
                    const active = notifFilter === key;
                    return (
                      <button key={key} className="nchip" onClick={() => setNotifFilter(key)} style={{
                        padding:'0.45rem 1.1rem', borderRadius:'20px', fontSize:'0.78rem',
                        fontWeight:700, cursor:'pointer', border:'1.5px solid',
                        transition:'all 0.22s ease', fontFamily:'inherit',
                        background: active ? bg : 'white',
                        borderColor: active ? bg : '#dbeafe',
                        color: active ? 'white' : '#64748b',
                        boxShadow: active ? `0 4px 14px ${bg}44` : 'none',
                      }}>{label}</button>
                    );
                  })}
                </div>
                <div style={{ width:'1px', height:'24px', background:'#dbeafe', margin:'0 0.25rem' }} />
                {/* Category chips */}
                {[
                  { key:'all',     label:'All',     icon:'🔔', color:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
                  { key:'leave',   label:'Leave',   icon:'📋', color:'#1d4ed8', bg:'#eff6ff', border:'#bfdbfe' },
                  { key:'room',    label:'Room',    icon:'🏠', color:'#166534', bg:'#f0fdf4', border:'#bbf7d0' },
                  { key:'alert',   label:'Alert',   icon:'⚠️', color:'#92400e', bg:'#fffbeb', border:'#fde68a' },
                  { key:'general', label:'General', icon:'📢', color:'#6b21a8', bg:'#faf5ff', border:'#e9d5ff' },
                ].map(({ key, label, icon, color, bg, border }) => {
                  const active = notifCategory === key;
                  const count  = key === 'all' ? notifications.length : notifications.filter(n => n.type === key).length;
                  return (
                    <button key={key} className="nchip" onClick={() => setNotifCategory(key)} style={{
                      display:'flex', alignItems:'center', gap:'0.35rem',
                      padding:'0.4rem 0.9rem', borderRadius:'20px', fontSize:'0.75rem',
                      fontWeight:700, cursor:'pointer', border:'1.5px solid',
                      transition:'all 0.22s ease', fontFamily:'inherit',
                      background: active ? bg : 'white',
                      borderColor: active ? border : '#e2e8f0',
                      color: active ? color : '#64748b',
                    }}>
                      <span>{icon}</span>{label}
                      <span style={{
                        padding:'0.05rem 0.45rem', borderRadius:'10px', fontSize:'0.65rem', fontWeight:800,
                        background: active ? color+'22' : '#f1f5f9',
                        color: active ? color : '#94a3b8',
                      }}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Notification list */}
              <div style={{ padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.65rem' }}>

                {/* Loading */}
                {notifLoading && (
                  <div style={{ textAlign:'center', padding:'3.5rem', color:'#94a3b8' }}>
                    <div style={{ width:'40px', height:'40px', margin:'0 auto 1rem', borderRadius:'50%', border:'3px solid #bfdbfe', borderTopColor:'#2563eb', animation:'spin 0.8s linear infinite' }} />
                    <p style={{ margin:0, fontSize:'0.9rem', fontWeight:600 }}>Loading notifications…</p>
                  </div>
                )}

                {/* Empty state */}
                {!notifLoading && notifFiltered.length === 0 && (
                  <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
                    <div style={{
                      width:'80px', height:'80px', margin:'0 auto 1.5rem',
                      borderRadius:'50%', background:'linear-gradient(135deg,#eff6ff,#dbeafe)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem',
                      border:'2px solid #bfdbfe',
                    }}>📭</div>
                    <p style={{ margin:'0 0 0.4rem', fontSize:'1.1rem', fontWeight:800, color:'#0f172a' }}>
                      {notifFilter === 'unread' ? "You're all caught up!" : 'No notifications found'}
                    </p>
                    <p style={{ margin:0, fontSize:'0.85rem', color:'#94a3b8', fontWeight:500 }}>
                      {notifFilter === 'unread' ? 'All notifications have been read 🎉' : 'Check back later for updates.'}
                    </p>
                  </div>
                )}

                {/* Notification Cards */}
                {!notifLoading && notifFiltered.map((n, idx) => {
                  const cfg = notifTypeConfig[n.type] || notifTypeConfig.general;
                  const p   = n.priority || 'normal';
                  const priorityStrip = { urgent:'#ef4444', high:'#f59e0b', normal:'#2563eb' };
                  const priorityLabel = { urgent:'🚨 Urgent', high:'❗ High', normal:null };
                  return (
                    <div key={n._id} className="ncard"
                      onClick={() => !n.isRead && markNotifAsRead(n._id)}
                      style={{
                        display:'flex', alignItems:'flex-start', gap:'1rem',
                        padding:'1.2rem 1.4rem',
                        background: n.isRead ? 'white' : 'linear-gradient(135deg,#f0f7ff 0%,#e8f1ff 100%)',
                        borderRadius:'16px',
                        border: n.isRead ? '1.5px solid #e2e8f0' : '1.5px solid #bfdbfe',
                        position:'relative', overflow:'hidden',
                        cursor: n.isRead ? 'default' : 'pointer',
                        transition:'all 0.28s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: n.isRead ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 20px rgba(37,99,235,0.10)',
                        animation:'notifSlideIn 0.4s ease both',
                        animationDelay:`${idx * 0.055}s`,
                      }}>

                      {/* Left colour strip */}
                      <div className="ncard-bar" style={{
                        position:'absolute', top:0, left:0, width:'4px', height:'100%',
                        background:`linear-gradient(180deg,${priorityStrip[p]},${priorityStrip[p]}88)`,
                        borderRadius:'4px 0 0 4px',
                      }} />

                      {/* Unread pulse dot */}
                      {!n.isRead && (
                        <div style={{
                          position:'absolute', top:'1rem', right:'1rem',
                          width:'9px', height:'9px', borderRadius:'50%',
                          background:'#2563eb', animation:'notifPulse 2s ease-in-out infinite',
                        }} />
                      )}

                      {/* Type icon */}
                      <div style={{
                        flexShrink:0, width:'46px', height:'46px', borderRadius:'13px',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        background:cfg.bg, border:`1.5px solid ${cfg.border}`,
                        fontSize:'1.25rem', boxShadow:'0 4px 12px rgba(0,0,0,0.06)',
                      }}>{cfg.icon}</div>

                      {/* Content */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                          <p style={{ margin:0, fontSize:'0.94rem', fontWeight: n.isRead ? 600 : 800, color:'#0f172a', letterSpacing:'-0.01em' }}>
                            {n.title}
                          </p>
                          {priorityLabel[p] && (
                            <span style={{
                              padding:'0.1rem 0.55rem', borderRadius:'20px', fontSize:'0.62rem', fontWeight:800,
                              background: p==='urgent' ? '#fef2f2' : '#fffbeb',
                              color: p==='urgent' ? '#dc2626' : '#b45309',
                              border:`1px solid ${p==='urgent' ? '#fecaca' : '#fde68a'}`,
                            }}>{priorityLabel[p]}</span>
                          )}
                        </div>
                        <p style={{ margin:'0 0 0.65rem', fontSize:'0.84rem', color: n.isRead ? '#64748b' : '#334155', lineHeight:1.6, fontWeight:500 }}>
                          {n.message}
                        </p>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap' }}>
                          <span style={{ fontSize:'0.7rem', color:'#94a3b8', fontWeight:600, display:'flex', alignItems:'center', gap:'0.25rem' }}>
                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {notifTimeAgo(n.createdAt)}
                          </span>
                          <span style={{ padding:'0.1rem 0.55rem', borderRadius:'20px', fontSize:'0.62rem', fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
                            {cfg.label}
                          </span>
                          {!n.isRead && (
                            <span style={{ padding:'0.1rem 0.55rem', borderRadius:'20px', fontSize:'0.62rem', fontWeight:700, background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe' }}>
                              ● Unread
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem', flexShrink:0 }} onClick={e => e.stopPropagation()}>
                        {!n.isRead && (
                          <button className="nbtn-read" onClick={() => markNotifAsRead(n._id)} style={{
                            padding:'0.4rem 0.9rem', background:'#2563eb', color:'white',
                            border:'none', borderRadius:'9px', fontSize:'0.7rem', fontWeight:700,
                            cursor:'pointer', transition:'all 0.22s ease', whiteSpace:'nowrap',
                            fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.3rem',
                            boxShadow:'0 4px 12px rgba(37,99,235,0.3)',
                          }}>
                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Read
                          </button>
                        )}
                        <button className="nbtn-del" onClick={() => deleteNotif(n._id)} style={{
                          padding:'0.4rem 0.65rem', background:'#fef2f2', color:'#ef4444',
                          border:'1.5px solid #fecaca', borderRadius:'9px',
                          fontSize:'0.7rem', fontWeight:700, cursor:'pointer',
                          transition:'all 0.22s ease', fontFamily:'inherit',
                        }}>🗑</button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom count bar */}
              {!notifLoading && notifFiltered.length > 0 && (
                <div style={{
                  padding:'0.9rem 2rem', background:'#f8faff',
                  borderTop:'1.5px solid #e0eaff',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}>
                  <span style={{ fontSize:'0.78rem', color:'#94a3b8', fontWeight:600 }}>
                    Showing <strong style={{ color:'#2563eb' }}>{notifFiltered.length}</strong> of <strong style={{ color:'#2563eb' }}>{notifications.length}</strong> notifications
                  </span>
                  {notifUnreadCount > 0 && (
                    <span style={{ fontSize:'0.75rem', color:'#64748b', fontWeight:500 }}>
                      Click a card to mark as read
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      // ── COMING SOON ──
      case 'gallery':
  return <Gallery />;

  case 'about':
  return <About />;

      default: return null;

    }
  };

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={styles.app}>
        <div style={styles.dashboardLayout} className="dashboard-layout">
          <aside className="sidebar" style={styles.sidebar}>
            <div style={styles.sidebarHeader}><div style={styles.sidebarLogo} className="sidebar-logo">📚</div></div>
            <nav style={styles.sidebarNav}>
              {['MAIN','STUDENT'].map(group => (
                <div style={styles.sidebarSection} key={group}>
                  <span className="sidebar-section-title" style={styles.sidebarSectionTitle}>{group}</span>
                  {navItems.filter(i => i.group===group).map(({ section, label, sublabel, d, action }) => (
                    <button key={section}
                      onClick={() => { if(action) { action(); } else { setActiveSection(section); setEditMode(false); setSaveSuccess(false); setSaveError(''); } }}
                      style={{ ...styles.sidebarLink, ...(activeSection===section ? styles.sidebarLinkActive : {}) }}
                      className="sidebar-link">
                      <span style={styles.sidebarLinkIcon} className="sidebar-link-icon">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg>
                        {section === 'notification' && notifUnreadCount > 0 && (
                          <span style={{ position:'absolute', top:'-4px', right:'-4px', width:'16px', height:'16px', background:'#ef4444', borderRadius:'50%', fontSize:'0.55rem', fontWeight:700, color:'white', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white' }}>
                            {notifUnreadCount > 9 ? '9+' : notifUnreadCount}
                          </span>
                        )}
                      </span>
                      <span className="sidebar-link-label" style={styles.sidebarLinkLabel}>{label}</span>
                      {sublabel && <span className="sidebar-link-sublabel" style={styles.sidebarLinkSublabel}>{sublabel}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          <main className="dashboard-main" style={styles.dashboardMain}>
            <header style={styles.dashboardMainHeader} className="dashboard-main-header">
              <h1 style={styles.dashboardMainHeaderH1}>{getSectionTitle()}</h1>
            </header>
            <button className="logout-btn" style={styles.logoutBtn}
              onClick={() => { localStorage.removeItem('studentToken'); localStorage.removeItem('studentData'); navigate('/register'); }}>
              Logout
            </button>
            <div style={styles.dashboardMainContent}>{renderContent()}</div>
          </main>
        </div>
      </div>
    </>
  );
};

const ComingSoon = ({ icon, title, styles }) => (
  <div style={styles.comingSoonPanel}>
    <div style={styles.comingSoonIcon}><svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg></div>
    <h2 style={styles.comingSoonTitle}>{title}</h2>
    <p style={styles.comingSoonText}>Coming Soon</p>
  </div>
);

export default StudentDashboard;
