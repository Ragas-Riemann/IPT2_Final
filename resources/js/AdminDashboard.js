import React, { useEffect, useRef } from 'react';
import '../sass/Dashboard.scss';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import Student from './Student';
import Faculty from './Faculty';
import SystemSettings from './SystemSettings';
import Calendar from './Calendar';
import Archive from './Archive';
import Settings from './Settings';

// Register all controllers/elements used
Chart.register(BarController, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, PieController);

export default function AdminDashboard(){
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const charts = useRef([]);
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [studentTotal, setStudentTotal] = React.useState(0);
  const [facultyTotal, setFacultyTotal] = React.useState(0);
  const [courseTotal, setCourseTotal] = React.useState(0);
  const [user, setUser] = React.useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  useEffect(() => {
    // Fetch current user
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Failed to fetch user', err));
  }, []);

  useEffect(() => {
    // Bar chart: Students per Academic Year (dynamic)
    if (barRef.current) {
      const bar = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Students per Academic Year',
            data: [],
            backgroundColor: '#3aa6d0',
            borderRadius: 6
          }]
        },
        options: { plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
      });
      charts.current.push(bar);
    }

  // Update pie chart based on faculty department counts
  function updatePieFromFaculty(list, departments = []){
    const counts = {};
    list.forEach(f => {
      if (f.department_id) {
        const dept = departments.find(d => d.id === f.department_id);
        const depName = dept ? dept.name : 'Unassigned';
        counts[depName] = (counts[depName] || 0) + 1;
      } else {
        counts['Unassigned'] = (counts['Unassigned'] || 0) + 1;
      }
    });
    const labels = Object.keys(counts);
    const data = labels.map(l => counts[l]);
    const pie = charts.current.find(c => c.config.type === 'pie');
    if (pie){
      pie.data.labels = labels;
      pie.data.datasets[0].data = data;
      pie.update();
    }
  }

    // Pie chart: Faculty per Department
    if (pieRef.current) {
      const pie = new Chart(pieRef.current, {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{ data: [], backgroundColor:['#2f77ff','#40b56a','#f0a23a','#e15b64','#8b5cf6','#ef4444','#10b981','#f59e0b'] }]
        },
        options: { plugins:{ legend:{ position:'right' } } }
      });
      charts.current.push(pie);
    }
    return () => { charts.current.forEach(c => c.destroy()); };
  }, []);

  // Fetch initial students so dashboard shows data on first load (top-level effect)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/students');
        if (!res.ok) return;
        const list = await res.json();
        setStudentTotal(list.length);
        updateBarFromStudents(list);
      } catch (e) {
        console.warn('Failed to preload students', e);
      }
    })();
  }, []);

  // Fetch initial faculty so dashboard shows data and pie chart
  useEffect(() => {
    (async () => {
      try {
        const [facultyRes, deptRes] = await Promise.all([
          fetch('/api/faculty'),
          fetch('/api/departments')
        ]);
        if (!facultyRes.ok || !deptRes.ok) return;
        const [facultyList, deptList] = await Promise.all([
          facultyRes.json(),
          deptRes.json()
        ]);
        setFacultyTotal(facultyList.length);
        updatePieFromFaculty(facultyList, deptList);
      } catch (e) {
        console.warn('Failed to preload faculty', e);
      }
    })();
  }, []);

  // Fetch initial courses count
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) return;
        const list = await res.json();
        setCourseTotal(list.length);
      } catch (e) {
        console.warn('Failed to preload courses', e);
      }
    })();
  }, []);

  // Transform student list into academic year counts
  function updateBarFromStudents(students){
    // Academic year typically runs from August to July
    // Format: "2024-2025" for academic year starting in 2024
    function getAcademicYear(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-12
      // If month is August (8) or later, it's the start of the academic year
      // Otherwise, it belongs to the previous academic year
      if (month >= 8) {
        return `${year}-${year + 1}`;
      } else {
        return `${year - 1}-${year}`;
      }
    }

    // Get all unique academic years from students
    const academicYears = new Set();
    students.forEach(s => {
      const dt = new Date(s.created_at || s.updated_at || Date.now());
      academicYears.add(getAcademicYear(dt));
    });

    // Sort academic years (convert to array and sort)
    const sortedYears = Array.from(academicYears).sort((a, b) => {
      // Compare by starting year
      const yearA = parseInt(a.split('-')[0]);
      const yearB = parseInt(b.split('-')[0]);
      return yearA - yearB;
    });

    // Count students per academic year
    const counts = Object.fromEntries(sortedYears.map(y => [y, 0]));
    students.forEach(s => {
      const dt = new Date(s.created_at || s.updated_at || Date.now());
      const acadYear = getAcademicYear(dt);
      if (acadYear in counts) counts[acadYear] += 1;
    });

    const bar = charts.current.find(c => c.config.type === 'bar');
    if (bar){
      bar.data.labels = sortedYears;
      bar.data.datasets[0].data = sortedYears.map(y => counts[y]);
      bar.update();
    }
  }

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

  try {
    return (
      React.createElement('div', { className: 'dashboard' },
      // Sidebar
      React.createElement('aside', { 
        className: `sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`
      },
        React.createElement('div', { className: 'sidebar-header' },
          React.createElement('h2', null, 'FSUU Admin'),
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
            { name: 'Faculty', icon: '👨‍🏫' },
            { name: 'Departments and Courses', icon: '📚' },
            { name: 'Archive', icon: '🗄️' },
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
          React.createElement('h1', null, 'Admin Dashboard - Student and Faculty Profile Management System')
        ),
        React.createElement('section', { className:'content' },
          activeTab==='Dashboard'
            ? React.createElement(React.Fragment, null,
                // KPI cards
                React.createElement('div', { className:'kpis' },
                  [
                    { t:'Total Students', v:String(studentTotal) },
                    { t:'Total Faculty', v:String(facultyTotal) },
                    { t:'Total Courses', v:String(courseTotal) },
                  ].map((k)=> React.createElement('div', { key:k.t, className:'kpi-card' },
                    React.createElement('div', { className:'kpi-title' }, k.t),
                    React.createElement('div', { className:'kpi-value' }, k.v)
                  ))
                ),
                React.createElement('div', { className:'divider' }),
                // Charts panel
                React.createElement('div', { className:'panels' },
                  React.createElement('div', { className:'panel' },
                    React.createElement('div', { className:'panel-title' }, 'Charts'),
                    React.createElement('div', { className:'charts' },
                      React.createElement('div', { className:'chartBox' },
                        React.createElement('small', { className:'muted' }, 'Number of Students per Academic Year'),
                        React.createElement('canvas', { ref: barRef, height: 200 })
                      ),
                      React.createElement('div', { className:'chartBox' },
                        React.createElement('small', { className:'muted' }, 'Number of Faculty per Department'),
                        React.createElement('canvas', { ref: pieRef, height: 200 })
                      )
                    )
                  )
                ),
                // Calendar section
                React.createElement('div', { style: { marginTop: '20px' } },
                  React.createElement(Calendar, { embed: true })
                )
              )
            : activeTab==='Students'
              ? React.createElement(React.Fragment, null,
                  React.createElement(Student, { embed: true, onDataChange: (list)=>{ setStudentTotal(list.length); updateBarFromStudents(list);} })
                )
              : activeTab==='Faculty'
                ? React.createElement(React.Fragment, null,
                    React.createElement(Faculty, { 
                      embed: true, 
                      onDataChange: async (list)=>{ 
                        setFacultyTotal(list.length); 
                        try {
                          const deptRes = await fetch('/api/departments');
                          if (deptRes.ok) {
                            const deptList = await deptRes.json();
                            updatePieFromFaculty(list, deptList);
                          }
                        } catch (e) {
                          console.warn('Failed to fetch departments for pie chart', e);
                        }
                      }
                    })
                  )
                : activeTab==='Departments and Courses'
                  ? React.createElement(React.Fragment, null,
                      React.createElement(SystemSettings, { 
                        embed: true,
                        onCoursesChange: async () => {
                          try {
                            const res = await fetch('/api/courses');
                            if (res.ok) {
                              const list = await res.json();
                              setCourseTotal(list.length);
                            }
                          } catch (e) {
                            console.warn('Failed to update course count', e);
                          }
                        }
                      })
                    )
                  : activeTab==='Archive'
                    ? React.createElement(React.Fragment, null,
                        React.createElement(Archive, { embed: true })
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
  } catch (error) {
    console.error('AdminDashboard render error:', error);
    return React.createElement('div', { 
      className: 'dashboard', 
      style: { padding: '40px', background: '#fee', color: '#900', minHeight: '100vh' } 
    }, 
      React.createElement('h1', null, 'Error Loading Admin Dashboard'),
      React.createElement('p', null, 'Please check the browser console for details and refresh the page.'),
      React.createElement('pre', { style: { background: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' } }, 
        error.toString()
      )
    );
  }
}

