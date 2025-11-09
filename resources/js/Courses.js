import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function Courses({ embed = false }){
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Open');
  const [enrolled, setEnrolled] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(()=>{ fetchUser(); fetchAll(); fetchDepartments(); },[]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  async function fetchAll(){
    setLoading(true);
    try { const res = await axios.get('/api/courses'); setItems(res.data);} finally { setLoading(false); }
  }
  async function fetchDepartments(){
    try { const res = await axios.get('/api/departments'); setDepartments(res.data);} catch(e){ console.error(e); }
  }

  async function handleSubmit(e){
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try{
      const payload = { name, status, enrolled_count: Number(enrolled||0), department_id: departmentId || null };
      if (editingId){
        await axios.put(`/api/courses/${editingId}`, payload);
        setMessage('Course updated');
      } else {
        await axios.post('/api/courses', payload);
        setMessage('Course added');
      }
      setName(''); setStatus('Open'); setEnrolled(''); setDepartmentId(''); setEditingId(null);
      await fetchAll();
    }catch(e){
      const apiMsg = e?.response?.data?.message || Object.values(e?.response?.data || {})?.[0] || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    }finally{ setLoading(false); }
  }

  async function handleDelete(id){
    if(!window.confirm('Delete this course?')) return;
    try{ await axios.delete(`/api/courses/${id}`); fetchAll(); }catch(e){ console.error(e); }
  }

  const card = (c) => (
    React.createElement('div', { key:c.id, className:'card' },
      React.createElement('div', { className:'card-header' }, React.createElement('h2', null, c.name)),
      React.createElement('div', { style: { marginBottom: '8px', color: '#6b7280' } }, `Status: ${c.status || 'Open'}`),
      React.createElement('div', { style: { marginBottom: '12px', color: '#6b7280' } }, `Enrolled: ${c.enrolled_count||0} Students`),
      // Only admin can edit/delete courses
      (user && user.role === 'admin') && React.createElement('div', { className:'form-actions' },
        React.createElement('button', { className: 'btn btn-primary', onClick:()=>{ setEditingId(c.id); setName(c.name); setStatus(c.status||'Open'); setEnrolled(String(c.enrolled_count||0)); setDepartmentId(c.department_id||''); } }, 'Edit'),
        React.createElement('button', { className:'btn btn-danger', onClick:()=>handleDelete(c.id) }, 'Delete')
      )
    )
  );

  const content = (
    React.createElement(React.Fragment, null,
      React.createElement('div', { className:'card' },
        React.createElement('div', { className:'card-header' }, React.createElement('h2', null, 'Courses')),
        // Form - only show for admin
        (user && user.role === 'admin') && React.createElement('form', { className:'post-form', onSubmit: handleSubmit },
          error && React.createElement('div', { className: 'alert alert-error' }, error),
          message && React.createElement('div', { className: 'alert alert-success' }, message),
          React.createElement('input', { type:'text', placeholder:'Course Name', value:name, onChange:e=>setName(e.target.value) }),
          React.createElement('select', { value:status, onChange:e=>setStatus(e.target.value) },
            React.createElement('option', { value:'Open' }, 'Open'),
            React.createElement('option', { value:'Closed' }, 'Closed')
          ),
          React.createElement('input', { type:'number', placeholder:'Enrolled Count', value:enrolled, onChange:e=>setEnrolled(e.target.value) }),
          React.createElement('select', { value:departmentId, onChange:e=>setDepartmentId(e.target.value) },
            React.createElement('option', { value:'' }, 'Select Department'),
            departments.map(d => React.createElement('option', { key:d.id, value:d.id }, d.name))
          ),
          React.createElement('div', { className:'form-actions' },
            React.createElement('button', { type:'submit', disabled:loading }, editingId ? (loading?'Updating...':'Update Course') : (loading?'Adding...':'Add Course')),
            editingId && React.createElement('button', { type:'button', className:'cancel-btn', onClick:()=>{ setName(''); setStatus('Open'); setEnrolled(''); setDepartmentId(''); setEditingId(null);} }, 'Cancel')
          )
        )
      ),
      loading ? React.createElement('div', { className: 'loading-state' }, React.createElement('p', null, 'Loading…')) : React.createElement('div', { className:'grid' },
        items.length>0 ? items.map(card) : React.createElement('div', { className: 'empty-state' }, React.createElement('p', null, 'No courses found.'))
      )
    )
  );

  if (embed) return React.createElement('div', { className:'content' }, content);
  return React.createElement('div', { className:'dashboard' }, React.createElement('div', { className:'main' }, React.createElement('section', { className:'content' }, content)));
}
