import React, { useEffect, useState } from 'react';
import '../sass/Dashboard.scss';
import StudentProfile from './StudentProfile';
import SystemSettings from './SystemSettings';
import Calendar from './Calendar';

export default function StudentDashboard(){
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    // Fetch current user
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Failed to fetch user', err));
  }, []);

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
      React.createElement('aside', { className:'sidebar' },
        React.createElement('h2', null, 'FSUU Student'),
        React.createElement('div', { className: 'user-info' },
          user ? `${user.name} (${user.role})` : 'Loading...'
        ),
        React.createElement('nav', null,
          ['Dashboard','Departments and Courses','Profile'].map(i =>
            React.createElement('a', { key:i, href:'#', className: activeTab===i ? 'active': '', onClick:(e)=>{e.preventDefault(); setActiveTab(i);} }, i)
          )
        ),
        React.createElement('button', { 
          onClick: handleLogout,
          className: 'logout-btn'
        }, 'Logout')
      ),
      // Main
      React.createElement('div', { className:'main' },
        React.createElement('header', { className:'topbar' },
          React.createElement('h1', null, 'Student Dashboard'),
          React.createElement('div', { className:'profile' }, React.createElement('img', { alt:'profile' }))
        ),
        React.createElement('section', { className:'content' },
          activeTab==='Dashboard'
            ? React.createElement(React.Fragment, null,
                React.createElement('div', { className:'kpis' },
                  [
                    { t:'Enrolled Courses', v:'6', d:'Courses this semester' },
                    { t:'GPA', v:'3.85', d:'Current grade point average' },
                    { t:'Credits', v:'18', d:'Total credit hours' },
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
                  : React.createElement('div', { className: 'empty-state' }, React.createElement('p', null, 'This section is under construction.'))
        )
      )
    )
  );
}

