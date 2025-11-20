import React, { useEffect, useRef } from 'react';
import '../sass/Dashboard.scss';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import Student from './Student';
import Faculty from './Faculty';
import Courses from './Courses';
import Departments from './Departments';

// Register all controllers/elements used
Chart.register(BarController, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, PieController);

export default function Dashboard(){
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const charts = useRef([]);
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [studentTotal, setStudentTotal] = React.useState(0);
  const [facultyTotal, setFacultyTotal] = React.useState(0);

  useEffect(() => {
    // Bar chart: Students per Month (dynamic)
    if (barRef.current) {
      const bar = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Students per Month',
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
  function updatePieFromFaculty(list){
    const counts = {};
    list.forEach(f => {
      const dep = (f.department || 'Unassigned');
      counts[dep] = (counts[dep] || 0) + 1;
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
        const res = await fetch('/api/faculty');
        if (!res.ok) return;
        const list = await res.json();
        setFacultyTotal(list.length);
        updatePieFromFaculty(list);
      } catch (e) {
        console.warn('Failed to preload faculty', e);
      }
    })();
  }, []);

  // Transform student list into last 6 months counts
  function updateBarFromStudents(students){
    // Build last 6 months labels like '2025-10'
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      months.push(key);
    }
    const counts = Object.fromEntries(months.map(m=>[m,0]));
    students.forEach(s=>{
      const dt = new Date(s.created_at || s.updated_at || Date.now());
      const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
      if (key in counts) counts[key] += 1;
    });
    const bar = charts.current.find(c => c.config.type === 'bar');
    if (bar){
      bar.data.labels = months;
      bar.data.datasets[0].data = months.map(m=>counts[m]);
      bar.update();
    }
  }

  return (
    React.createElement('div', { className: 'dashboard' },
      // Sidebar
      React.createElement('aside', { className:'sidebar' },
        React.createElement('h2', null, 'FSUU Admin'),
        React.createElement('nav', null,
          ['Dashboard','Students','Faculty','Courses','Departments','Attendance','Settings'].map(i =>
            React.createElement('a', { key:i, href:'#', className: activeTab===i ? 'active': '', onClick:(e)=>{e.preventDefault(); setActiveTab(i);} }, i)
          )
        )
      ),
      // Main
      React.createElement('div', { className:'main' },
        React.createElement('header', { className:'topbar' },
          React.createElement('h1', null, 'Student and Faculty Profile Management System')
        ),
        React.createElement('section', { className:'content' },
          activeTab==='Dashboard'
            ? React.createElement(React.Fragment, null,
                // KPI cards
                React.createElement('div', { className:'kpis' },
                  [
                    { t:'Total Students', v:String(studentTotal), d:'+3.2% since last month' },
                    { t:'Total Faculty', v:String(facultyTotal), d:'+0.8% since last month' },
                    { t:'Active Courses', v:'128', d:'+1.1% since last month' },
                  ].map((k)=> React.createElement('div', { key:k.t, className:'kpi-card' },
                    React.createElement('div', { className:'kpi-title' }, k.t),
                    React.createElement('div', { className:'kpi-value' }, k.v),
                    React.createElement('span', { className:'trend' }, k.d)
                  ))
                ),
                React.createElement('div', { className:'divider' }),
                // Lower panels
                React.createElement('div', { className:'panels' },
                  React.createElement('div', { className:'panel' },
                    React.createElement('div', { className:'panel-title' }, 'Attendance Rate'),
                    React.createElement('div', { className:'kpi-value' }, '92.5%'),
                    React.createElement('span', { className:'trend' }, '+0.6% since last month')
                  ),
                  React.createElement('div', { className:'panel' },
                    React.createElement('div', { className:'panel-title' }, 'Chart'),
                    React.createElement('div', { className:'charts' },
                      React.createElement('div', { className:'chartBox' },
                        React.createElement('small', { className:'muted' }, 'Number of Students per Month'),
                        React.createElement('canvas', { ref: barRef, height: 160 })
                      ),
                      React.createElement('div', { className:'chartBox' },
                        React.createElement('small', { className:'muted' }, 'Number of Faculty per Department'),
                        React.createElement('canvas', { ref: pieRef, height: 160 })
                      )
                    )
                  )
                )
              )
            : activeTab==='Students'
              ? React.createElement(React.Fragment, null,
                  React.createElement(Student, { embed: true, onDataChange: (list)=>{ setStudentTotal(list.length); updateBarFromStudents(list);} })
                )
              : activeTab==='Faculty'
                ? React.createElement(React.Fragment, null,
                    React.createElement(Faculty, { embed: true, onDataChange: (list)=>{ setFacultyTotal(list.length); updatePieFromFaculty(list);} })
                  )
                : activeTab==='Courses'
                  ? React.createElement(React.Fragment, null,
                      React.createElement(Courses, { embed: true })
                    )
                  : activeTab==='Departments'
                    ? React.createElement(React.Fragment, null,
                        React.createElement(Departments, { embed: true })
                      )
                    : React.createElement('div', { style:{padding:12, color:'#6b7a7d'} }, 'This section is under construction.')
        )
      )
    )
  );
}
