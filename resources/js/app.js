import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';

// Get the element by ID (matches your Blade div)
const container = document.getElementById('dashboard');
console.log('[app.js] loaded. container found?', !!container);

// Get role from data attribute
let role = container?.getAttribute('data-role');
if (!role || role === '') {
  // Fallback: try to get from URL path
  const path = window.location.pathname;
  if (path.includes('/dashboard/admin')) {
    role = 'admin';
  } else if (path.includes('/dashboard/faculty')) {
    role = 'faculty';
  } else if (path.includes('/dashboard/student')) {
    role = 'student';
  } else {
    role = 'admin'; // Default to admin
  }
}
console.log('[app.js] Role from data-role attribute:', role);
console.log('[app.js] Current path:', window.location.pathname);

// Render React component based on role
if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    let DashboardComponent;
    
    switch(role) {
      case 'admin':
        DashboardComponent = AdminDashboard;
        console.log('[app.js] Loading AdminDashboard');
        break;
      case 'faculty':
        DashboardComponent = FacultyDashboard;
        console.log('[app.js] Loading FacultyDashboard');
        break;
      case 'student':
        DashboardComponent = StudentDashboard;
        console.log('[app.js] Loading StudentDashboard');
        break;
      default:
        DashboardComponent = AdminDashboard;
        console.log('[app.js] Defaulting to AdminDashboard for role:', role);
    }
    
    root.render(React.createElement(DashboardComponent));
    console.log('[app.js] Dashboard mounted for role:', role);
  } catch (e) {
    console.error('[app.js] mount error:', e);
    container.innerHTML = '<pre style="padding:12px;background:#fee;border:1px solid #f99;color:#900;border-radius:6px;">Dashboard failed to mount. Check console for details.</pre>';
  }
} else {
  console.warn('[app.js] container #dashboard not found on page');
}

