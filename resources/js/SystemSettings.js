import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sass/Dashboard.scss';

export default function SystemSettings({ embed = false }){
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  
  // Department form state
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptDescription, setDeptDescription] = useState('');
  const [deptDean, setDeptDean] = useState('');
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [showDeptForm, setShowDeptForm] = useState(false);
  
  // Course form state
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseStatus, setCourseStatus] = useState('Open');
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);

  useEffect(() => {
    try {
      fetchUser();
      fetchDepartments();
    } catch (e) {
      console.error('Error in SystemSettings useEffect:', e);
      setError('Failed to initialize. Please refresh the page.');
    }
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      try {
        fetchCoursesByDepartment(selectedDepartment.id);
      } catch (e) {
        console.error('Error fetching courses:', e);
        setError('Failed to load courses');
      }
    }
  }, [selectedDepartment]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  async function fetchDepartments(){
    setLoading(true);
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch(e){ 
      console.error(e);
      setError('Failed to load departments');
    } finally { 
      setLoading(false); 
    }
  }

  async function fetchCoursesByDepartment(departmentId){
    setLoading(true);
    try {
      const res = await axios.get('/api/courses');
      const allCourses = res.data;
      const deptCourses = allCourses.filter(c => c.department_id === departmentId);
      setCourses(deptCourses);
    } catch(e){ 
      console.error(e);
      setError('Failed to load courses');
    } finally { 
      setLoading(false); 
    }
  }

  // Department handlers
  async function handleDepartmentSubmit(e){
    e.preventDefault(); 
    setError(''); 
    setMessage(''); 
    setLoading(true);
    try{
      const payload = {
        name: deptName,
        code: deptCode || null,
        description: deptDescription || null,
        dean: deptDean,
        // students_count and faculty_count are now calculated automatically
      };
      if (editingDeptId){
        await axios.put(`/api/departments/${editingDeptId}`, payload);
        setMessage('Department updated');
      } else {
        await axios.post('/api/departments', payload);
        setMessage('Department added');
      }
      setDeptName(''); 
      setDeptCode(''); 
      setDeptDescription(''); 
      setDeptDean(''); 
      setEditingDeptId(null);
      setShowDeptForm(false);
      await fetchDepartments();
    }catch(e){
      const apiMsg = e?.response?.data?.message || Object.values(e?.response?.data || {})?.[0] || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    }finally{ 
      setLoading(false); 
    }
  }

  async function handleDepartmentDelete(id){
    if(!window.confirm('Archive this department? The department will be moved to the archive and automatically deleted after 1 year.')) return;
    try{ 
      const response = await axios.delete(`/api/departments/${id}`); 
      setMessage(response.data?.message || 'Department archived successfully');
      setError('');
      if (selectedDepartment && selectedDepartment.id === id) {
        setSelectedDepartment(null);
        setCourses([]);
      }
      fetchDepartments(); 
    }catch(e){ 
      const apiMsg = e?.response?.data?.message || e?.message || 'Failed to archive department';
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to archive department');
      setMessage('');
    }
  }

  // Course handlers
  async function handleCourseSubmit(e){
    e.preventDefault(); 
    setError(''); 
    setMessage(''); 
    setLoading(true);
    try{
        if (!selectedDepartment || !selectedDepartment.id) {
          setError('No department selected');
          setLoading(false);
          return;
        }
        const payload = { 
          name: courseName, 
          description: courseDescription || null,
          status: courseStatus, 
          // enrolled_count is now calculated automatically, don't send it
          department_id: selectedDepartment.id 
        };
      if (editingCourseId){
        await axios.put(`/api/courses/${editingCourseId}`, payload);
        setMessage('Course updated');
      } else {
        await axios.post('/api/courses', payload);
        setMessage('Course added');
      }
      setCourseName(''); 
      setCourseDescription('');
      setCourseStatus('Open'); 
      setEditingCourseId(null);
      setShowCourseForm(false);
      await fetchCoursesByDepartment(selectedDepartment.id);
    }catch(e){
      const apiMsg = e?.response?.data?.message || Object.values(e?.response?.data || {})?.[0] || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    }finally{ 
      setLoading(false); 
    }
  }

  async function handleCourseDelete(id){
    if(!window.confirm('Archive this course? The course will be moved to the archive and automatically deleted after 1 year.')) return;
    if (!selectedDepartment || !selectedDepartment.id) {
      setError('No department selected');
      return;
    }
    try{ 
      const response = await axios.delete(`/api/courses/${id}`); 
      setMessage(response.data?.message || 'Course archived successfully');
      setError('');
      fetchCoursesByDepartment(selectedDepartment.id); 
    }catch(e){ 
      const apiMsg = e?.response?.data?.message || e?.message || 'Failed to archive course';
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to archive course');
      setMessage('');
    }
  }

  const departmentCard = (d) => (
    React.createElement('div', { 
      key: d.id, 
      className: 'card', 
      style: { 
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      },
      onClick: () => setSelectedDepartment(d),
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }
    },
      React.createElement('div', { className: 'card-header' }, 
        React.createElement('h2', null, d.name),
        React.createElement('div', { style: { fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' } }, 
          d.code ? `Code: ${d.code}` : ''
        )
      ),
      d.description && React.createElement('div', { style: { marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem' } }, 
        d.description.length > 100 ? `${d.description.substring(0, 100)}...` : d.description
      ),
      React.createElement('div', { style: { display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.875rem', color: '#6b7280' } },
        React.createElement('div', null, `Students: ${d.students_count||0}`),
        React.createElement('div', null, `Faculty: ${d.faculty_count||0}`)
      ),
      React.createElement('div', { style: { marginTop: '12px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', fontSize: '0.875rem', color: '#0284c7', textAlign: 'center', fontWeight: 600 } }, 
        'Click to view courses →'
      ),
      // Only admin can edit/delete departments
      (user && user.role === 'admin') && React.createElement('div', { 
        className: 'form-actions', 
        style: { marginTop: '12px' },
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('button', { 
          className: 'btn btn-primary',
          onClick: (e) => {
            e.stopPropagation();
            setEditingDeptId(d.id); 
            setDeptName(d.name); 
            setDeptCode(d.code||''); 
            setDeptDescription(d.description||''); 
            setDeptDean(d.dean||''); 
            setShowDeptForm(true);
          } 
        }, 'Edit'),
        React.createElement('button', { 
          className: 'btn btn-danger', 
          onClick: (e) => {
            e.stopPropagation();
            handleDepartmentDelete(d.id);
          } 
        }, 'Archive')
      )
    )
  );

  const courseCard = (c) => (
    React.createElement('div', { key: c.id, className: 'card' },
      React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, c.name)),
      c.description && React.createElement('div', { style: { marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem' } }, 
        c.description.length > 100 ? `${c.description.substring(0, 100)}...` : c.description
      ),
      React.createElement('div', { style: { marginBottom: '8px', color: '#6b7280' } }, `Status: ${c.status || 'Open'}`),
      React.createElement('div', { style: { marginBottom: '12px', color: '#6b7280' } }, `Enrolled: ${c.enrolled_count||0} Students`),
      // Only admin can edit/delete courses
      (user && user.role === 'admin') && React.createElement('div', { className: 'form-actions' },
        React.createElement('button', { 
          className: 'btn btn-primary', 
          onClick: () => { 
            setEditingCourseId(c.id); 
            setCourseName(c.name); 
            setCourseDescription(c.description||''); 
            setCourseStatus(c.status||'Open'); 
            setShowCourseForm(true);
          } 
        }, 'Edit'),
        React.createElement('button', { 
          className: 'btn btn-danger', 
          onClick: () => handleCourseDelete(c.id) 
        }, 'Archive')
      )
    )
  );

  // Departments view
  const departmentsView = (
    React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, 
          React.createElement('h2', null, 'Departments and Courses'),
          (user && user.role === 'admin' && !showDeptForm && !editingDeptId) && React.createElement(
            'button',
            { 
              type: 'button',
              onClick: () => setShowDeptForm(true),
              style: { 
                padding: '10px 20px', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }
            },
            'Add Department'
          )
        ),
        // Form - only show for admin when showDeptForm is true or editing
        (user && user.role === 'admin' && (showDeptForm || editingDeptId)) && React.createElement(React.Fragment, null,
          React.createElement('h3', { style: { margin: '20px 0 10px 0', color: '#333', fontWeight: '600' } }, editingDeptId ? 'Edit Department' : 'Add Department'),
          React.createElement('form', { className: 'post-form', onSubmit: handleDepartmentSubmit },
            error && React.createElement('div', { className: 'alert alert-error' }, error),
            message && React.createElement('div', { className: 'alert alert-success' }, message),
            React.createElement('input', { type: 'text', placeholder: 'Department Name *', value: deptName, onChange: e => setDeptName(e.target.value), required: true }),
            React.createElement('input', { type: 'text', placeholder: 'Code (e.g., CSP, BAP)', value: deptCode, onChange: e => setDeptCode(e.target.value), maxLength: 10 }),
            React.createElement('textarea', { placeholder: 'Description (optional)', value: deptDescription, onChange: e => setDeptDescription(e.target.value), rows: 3, style: { resize: 'vertical' } }),
            React.createElement('input', { type: 'text', placeholder: 'Dean (optional)', value: deptDean, onChange: e => setDeptDean(e.target.value) }),
            React.createElement('div', { style: { padding: '8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.875rem', color: '#6b7280' } }, 
              'Students and Faculty counts are automatically calculated based on profiles that have been filled out.'
            ),
            React.createElement('div', { className: 'form-actions' },
              React.createElement('button', { type: 'submit', disabled: loading }, editingDeptId ? (loading ? 'Updating...' : 'Update Department') : (loading ? 'Adding...' : 'Add Department')),
              React.createElement('button', { 
                type: 'button', 
                className: 'cancel-btn', 
                onClick: () => { 
                  setDeptName(''); 
                  setDeptCode(''); 
                  setDeptDescription(''); 
                  setDeptDean(''); 
                  setEditingDeptId(null); 
                  setShowDeptForm(false);
                } 
              }, 'Cancel')
            )
          )
        )
      ),
      loading ? React.createElement('div', { className: 'loading-state' }, React.createElement('p', null, 'Loading…')) : React.createElement('div', { className: 'grid' },
        departments.length > 0 ? departments.map(departmentCard) : React.createElement('div', { className: 'empty-state' }, React.createElement('p', null, 'No departments found.'))
      )
    )
  );

  // Courses view
  const coursesView = (
    React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header', style: { display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', flex: 1 } },
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => {
                setSelectedDepartment(null);
                setCourses([]);
                setEditingCourseId(null);
                setCourseName('');
                setCourseDescription('');
                setCourseStatus('Open');
                setShowCourseForm(false);
              },
              style: { padding: '8px 16px', fontSize: '0.875rem' }
            }, '← Back to Departments'),
            React.createElement('h2', { style: { margin: 0 } }, 
              `Courses - ${selectedDepartment?.name || 'Unknown Department'}`
            )
          ),
          (user && user.role === 'admin' && !showCourseForm && !editingCourseId) && React.createElement(
            'button',
            { 
              type: 'button',
              onClick: () => setShowCourseForm(true),
              style: { 
                padding: '10px 20px', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }
            },
            'Add Course'
          )
        ),
        // Form - only show for admin when showCourseForm is true or editing
        (user && user.role === 'admin' && (showCourseForm || editingCourseId)) && React.createElement(React.Fragment, null,
          React.createElement('h3', { style: { margin: '20px 0 10px 0', color: '#333', fontWeight: '600' } }, editingCourseId ? 'Edit Course' : 'Add Course'),
          React.createElement('form', { className: 'post-form', onSubmit: handleCourseSubmit },
            error && React.createElement('div', { className: 'alert alert-error' }, error),
            message && React.createElement('div', { className: 'alert alert-success' }, message),
            React.createElement('input', { type: 'text', placeholder: 'Course Name *', value: courseName, onChange: e => setCourseName(e.target.value), required: true }),
            React.createElement('textarea', { placeholder: 'Description (optional)', value: courseDescription, onChange: e => setCourseDescription(e.target.value), rows: 3, style: { resize: 'vertical' } }),
            React.createElement('select', { value: courseStatus, onChange: e => setCourseStatus(e.target.value) },
              React.createElement('option', { value: 'Open' }, 'Open'),
              React.createElement('option', { value: 'Closed' }, 'Closed')
            ),
            React.createElement('div', { style: { padding: '8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.875rem', color: '#6b7280' } }, 
              'Enrolled Count is automatically calculated based on students who have filled out their profile.'
            ),
            React.createElement('div', { className: 'form-actions' },
              React.createElement('button', { type: 'submit', disabled: loading }, editingCourseId ? (loading ? 'Updating...' : 'Update Course') : (loading ? 'Adding...' : 'Add Course')),
              React.createElement('button', { 
                type: 'button', 
                className: 'cancel-btn', 
                onClick: () => { 
                  setCourseName(''); 
                  setCourseDescription('');
                  setCourseStatus('Open'); 
                  setEditingCourseId(null); 
                  setShowCourseForm(false);
                } 
              }, 'Cancel')
            )
          )
        )
      ),
      loading ? React.createElement('div', { className: 'loading-state' }, React.createElement('p', null, 'Loading…')) : React.createElement('div', { className: 'grid' },
        courses.length > 0 ? courses.map(courseCard) : React.createElement('div', { className: 'empty-state' }, React.createElement('p', null, 'No courses found for this department.'))
      )
    )
  );

  // Show error if any (but not during initial load)
  if (error && !loading && departments.length === 0) {
    return React.createElement('div', { className: 'content' },
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'alert alert-error' }, error),
        React.createElement('button', { 
          className: 'btn btn-primary',
          onClick: () => {
            setError('');
            fetchDepartments();
          }
        }, 'Retry')
      )
    );
  }

  const content = selectedDepartment ? coursesView : departmentsView;

  try {
    if (embed) {
      return React.createElement('div', { 
        className: 'content', 
        style: { 
          minHeight: '400px',
          padding: loading ? '20px' : '0',
          background: loading ? '#f9fafb' : 'transparent'
        } 
      }, 
        loading && departments.length === 0 
          ? React.createElement('div', { className: 'loading-state' }, 
              React.createElement('p', null, 'Loading departments and courses...')
            )
          : content
      );
    }
    return React.createElement('div', { className: 'dashboard' }, 
      React.createElement('div', { className: 'main' }, 
        React.createElement('section', { className: 'content' }, content)
      )
    );
  } catch (error) {
    console.error('SystemSettings render error:', error);
    return React.createElement('div', { 
      className: 'content',
      style: { padding: '20px', background: '#fee', color: '#900', minHeight: '400px' } 
    }, 
      React.createElement('h2', null, 'Error Loading Departments and Courses'),
      React.createElement('p', null, error.toString()),
      React.createElement('p', null, 'Please check the console for details and refresh the page.')
    );
  }
}

