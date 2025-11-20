import React, { useEffect, useState } from 'react';
import '../sass/Dashboard.scss';
import FacultyProfile from './FacultyProfile';
import Student from './Student';
import SystemSettings from './SystemSettings';
import Calendar from './Calendar';
import Settings from './Settings';

export default function FacultyDashboard(){
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [user, setUser] = React.useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [myCourses, setMyCourses] = React.useState(0);
  const [totalStudents, setTotalStudents] = React.useState(0);
  const [facultyProfile, setFacultyProfile] = React.useState(null);

  useEffect(() => {
    // Fetch current user
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        // Fetch faculty profile to get department_id
        fetch('/api/faculty')
          .then(res => res.json())
          .then(facultyList => {
            const currentFaculty = facultyList.find(f => f.email === data.email);
            if (currentFaculty) {
              setFacultyProfile(currentFaculty);
              fetchFacultyDashboardData(currentFaculty.department_id);
            }
          })
          .catch(err => console.error('Failed to fetch faculty', err));
      })
      .catch(err => console.error('Failed to fetch user', err));
  }, []);

  const fetchFacultyDashboardData = async (departmentId) => {
    if (!departmentId) {
      setMyCourses(0);
      setTotalStudents(0);
      return;
    }

    try {
      // Fetch courses for this department
      const coursesRes = await fetch(`/api/courses?department_id=${departmentId}`);
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        setMyCourses(courses.length);
        
        // Count total students in all courses from this department
        const studentsRes = await fetch('/api/students');
        if (studentsRes.ok) {
          const students = await studentsRes.json();
          const courseIds = courses.map(c => c.id);
          const studentsInMyCourses = students.filter(s => 
            s.department_id === departmentId || courseIds.includes(s.course_id)
          );
          setTotalStudents(studentsInMyCourses.length);
        }
      }
    } catch (e) {
      console.error('Failed to fetch faculty dashboard data', e);
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
          React.createElement('h2', null, 'FSUU Faculty'),
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
            { name: 'Students', icon: '👥' },
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
          React.createElement('h1', null, 'Faculty Dashboard')
        ),
        React.createElement('section', { className:'content' },
          activeTab==='Dashboard'
            ? React.createElement(React.Fragment, null,
                React.createElement('div', { className:'kpis' },
                  [
                    { t:'My Courses', v:String(myCourses), d:facultyProfile?.department_id ? 'Courses in my department' : 'No department assigned' },
                    { t:'Total Students', v:String(totalStudents), d:facultyProfile?.department_id ? 'Students in my department' : 'No department assigned' },
                  ].map((k)=> React.createElement('div', { key:k.t, className:'kpi-card' },
                    React.createElement('div', { className:'kpi-title' }, k.t),
                    React.createElement('div', { className:'kpi-value' }, k.v),
                    React.createElement('span', { className:'trend' }, k.d)
                  ))
                ),
                React.createElement('div', { className:'divider' }),
                React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' } },
                  React.createElement('div', { className: 'welcome-card' },
                    React.createElement('h3', null, 'Welcome to Faculty Dashboard'),
                    React.createElement('p', null, 
                      'Manage your courses, view student information, and track your teaching activities from this dashboard.'
                    )
                  ),
                  React.createElement(Calendar, { embed: true })
                )
              )
            : activeTab==='Students'
                  ? React.createElement(React.Fragment, null,
                      React.createElement(Student, { embed: true })
                    )
                  : activeTab==='Departments and Courses'
                    ? React.createElement(React.Fragment, null,
                        React.createElement(SystemSettings, { embed: true })
                      )
                    : activeTab==='Profile'
                      ? React.createElement(React.Fragment, null,
                          React.createElement(FacultyProfile)
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

