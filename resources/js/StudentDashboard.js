import React, { useEffect, useState } from 'react';
import '../sass/Dashboard.scss';
import StudentProfile from './StudentProfile';
import SystemSettings from './SystemSettings';
import Calendar from './Calendar';
import Settings from './Settings';

export default function StudentDashboard(){
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [user, setUser] = React.useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [enrolledCourses, setEnrolledCourses] = React.useState(0);
  const [openCourses, setOpenCourses] = React.useState(0);
  const [studentProfile, setStudentProfile] = React.useState(null);

  useEffect(() => {
    // Fetch current user
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        // Fetch student profile to get course_id
        fetch('/api/students')
          .then(res => res.json())
          .then(students => {
            const currentStudent = students.find(s => s.email === data.email);
            if (currentStudent) {
              setStudentProfile(currentStudent);
              fetchStudentDashboardData(currentStudent.course_id);
            }
          })
          .catch(err => console.error('Failed to fetch students', err));
        // Fetch open courses count
        fetchOpenCoursesCount();
      })
      .catch(err => console.error('Failed to fetch user', err));
  }, []);

  const fetchOpenCoursesCount = async () => {
    try {
      const coursesRes = await fetch('/api/courses');
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        const openCount = courses.filter(c => c.status === 'Open').length;
        setOpenCourses(openCount);
      }
    } catch (e) {
      console.error('Failed to fetch open courses', e);
    }
  };

  const fetchStudentDashboardData = async (courseId) => {
    if (!courseId) {
      setEnrolledCourses(0);
      return;
    }

    try {
      // Count courses - for now, a student is enrolled in their assigned course
      // If you have a many-to-many relationship later, update this
      const coursesRes = await fetch('/api/courses');
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        const studentCourse = courses.find(c => c.id === courseId);
        setEnrolledCourses(studentCourse ? 1 : 0);
      }
    } catch (e) {
      console.error('Failed to fetch student dashboard data', e);
    }
  };

  const handleLogout = () => {
    fetch('/logout', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        'Content-Type': 'application/json',
      },
    })
    .then(() => window.location.href = '/login')
    .catch(err => console.error('Logout failed', err));
  };

  return (
    React.createElement('div', { className: 'dashboard' },
      // Sidebar
      React.createElement('aside', { 
        className: `sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`
      },
        React.createElement('div', { className: 'sidebar-header' },
          React.createElement('h2', null, 'FSUU Student'),
          React.createElement('button', {
            className: 'sidebar-toggle',
            onClick: () => setIsSidebarCollapsed(!isSidebarCollapsed),
            title: isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }, isSidebarCollapsed ? '→' : '←')
        ),
        React.createElement('div', { className: 'user-info' },
          user ? `${user.name} (${user.role})` : 'Loading...'
        ),
        React.createElement('nav', null,
          [
            { name: 'Dashboard', icon: '📊' },
            { name: 'Departments and Courses', icon: '📚' },
            { name: 'Profile', icon: '👤' },
            { name: 'Settings', icon: '⚙️' }
          ].map(item =>
            React.createElement('a', { 
              key: item.name, 
              href:'#', 
              className: activeTab===item.name ? 'active': '', 
              onClick:(e)=>{e.preventDefault(); setActiveTab(item.name);},
              title: isSidebarCollapsed ? item.name : ''
            }, 
              React.createElement('span', { className: 'nav-icon' }, item.icon),
              React.createElement('span', { className: 'nav-text' }, item.name)
            )
          )
        ),
        React.createElement('button', { 
          onClick: handleLogout,
          className: 'logout-btn',
          title: isSidebarCollapsed ? 'Logout' : ''
        }, 
          React.createElement('span', { className: 'logout-icon' }, '🚪'),
          React.createElement('span', { className: 'nav-text' }, 'Logout')
        )
      ),
      // Main
      React.createElement('div', { 
        className: `main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`
      },
        React.createElement('header', { className:'topbar' },
          React.createElement('h1', null, 'Student Dashboard')
        ),
        React.createElement('section', { className:'content' },
          activeTab==='Dashboard'
            ? React.createElement(React.Fragment, null,
                React.createElement('div', { className:'kpis' },
                  [
                    { t:'Enrolled Courses', v:String(enrolledCourses), d:studentProfile?.course_id ? 'Current course enrollment' : 'No course assigned' },
                    { t:'Open Courses', v:String(openCourses), d:'Available courses for enrollment' },
                  ].map((k)=> React.createElement('div', { key:k.t, className:'kpi-card' },
                    React.createElement('div', { className:'kpi-title' }, k.t),
                    React.createElement('div', { className:'kpi-value' }, k.v),
                    React.createElement('span', { className:'trend' }, k.d)
                  ))
                ),
                React.createElement('div', { className:'divider' }),
                React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' } },
                  React.createElement('div', { className: 'welcome-card' },
                    React.createElement('h3', null, 'Welcome to Student Dashboard'),
                    React.createElement('p', null, 
                      'View your courses, check your grades, and manage your academic information from this dashboard.'
                    )
                  ),
                  React.createElement(Calendar, { embed: true })
                )
              )
            : activeTab==='Departments and Courses'
                ? React.createElement(React.Fragment, null,
                    React.createElement(SystemSettings, { embed: true })
                  )
              : activeTab==='Profile'
                ? React.createElement(React.Fragment, null,
                    React.createElement(StudentProfile)
                  )
                : activeTab==='Settings'
                  ? React.createElement(React.Fragment, null,
                      React.createElement(Settings, { embed: true })
                    )
                  : React.createElement('div', { className: 'empty-state' }, React.createElement('p', null, 'This section is under construction.'))
        )
      )
    )
  );
}

