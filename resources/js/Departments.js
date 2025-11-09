import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function Departments({ embed = false }){
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [dean, setDean] = useState('');
  const [studentsCount, setStudentsCount] = useState('');
  const [facultyCount, setFacultyCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(()=>{ fetchUser(); fetchAll(); },[]);

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
    try {
      const res = await axios.get('/api/departments');
      setItems(res.data);
    } catch(e){ console.error(e);} finally { setLoading(false); }
  }

  async function handleSubmit(e){
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try{
      const payload = {
        name,
        code: code || null,
        description: description || null,
        dean,
        students_count: Number(studentsCount||0),
        faculty_count: Number(facultyCount||0)
      };
      if (editingId){
        await axios.put(`/api/departments/${editingId}`, payload);
        setMessage('Department updated');
      } else {
        await axios.post('/api/departments', payload);
        setMessage('Department added');
      }
      setName(''); setCode(''); setDescription(''); setDean(''); setStudentsCount(''); setFacultyCount(''); setEditingId(null);
      await fetchAll();
    }catch(e){
      const apiMsg = e?.response?.data?.message || Object.values(e?.response?.data || {})?.[0] || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    }finally{ setLoading(false); }
  }

  async function handleDelete(id){
    if(!window.confirm('Delete this department?')) return;
    try{ await axios.delete(`/api/departments/${id}`); fetchAll(); }catch(e){ console.error(e); }
  }

  const card = (d) => (
    React.createElement('div', { key:d.id, className:'card', style:{maxWidth:420} },
      React.createElement('div', { className:'card-header' }, React.createElement('h2', null, d.name)),
      d.code && React.createElement('div', null, `Code: ${d.code}`),
      d.description && React.createElement('div', null, `Description: ${d.description}`),
      React.createElement('div', null, `Dean: ${d.dean || '-'}`),
      React.createElement('div', null, `Students: ${d.students_count||0}`),
      React.createElement('div', null, `Faculty: ${d.faculty_count||0}`),
      // Only admin can edit/delete departments
      (user && user.role === 'admin') && React.createElement('div', { className:'form-actions', style:{marginTop:8} },
        React.createElement('button', { onClick:()=>{ setEditingId(d.id); setName(d.name); setCode(d.code||''); setDescription(d.description||''); setDean(d.dean||''); setStudentsCount(String(d.students_count||0)); setFacultyCount(String(d.faculty_count||0)); } }, 'Edit'),
        React.createElement('button', { className:'delete-btn', onClick:()=>handleDelete(d.id) }, 'Delete')
      )
    )
  );

  const content = (
    React.createElement(React.Fragment, null,
      React.createElement('div', { className:'card' },
        React.createElement('div', { className:'card-header' }, React.createElement('h2', null, 'Departments')),
        // Form - only show for admin
        (user && user.role === 'admin') && React.createElement('form', { className:'post-form', onSubmit: handleSubmit },
          error && React.createElement('div', { style:{background:'#ffdddd', color:'#900', padding:'8px', borderRadius:'6px'} }, error),
          message && React.createElement('div', { style:{background:'#ddffdd', color:'#064', padding:'8px', borderRadius:'6px'} }, message),
          React.createElement('input', { type:'text', placeholder:'Department Name *', value:name, onChange:e=>setName(e.target.value), required:true }),
          React.createElement('input', { type:'text', placeholder:'Code (e.g., CSP, BAP)', value:code, onChange:e=>setCode(e.target.value), maxLength:10 }),
          React.createElement('textarea', { placeholder:'Description (optional)', value:description, onChange:e=>setDescription(e.target.value), rows:3, style:{resize:'vertical'} }),
          React.createElement('input', { type:'text', placeholder:'Dean (optional)', value:dean, onChange:e=>setDean(e.target.value) }),
          React.createElement('input', { type:'number', placeholder:'Students Count (optional)', value:studentsCount, onChange:e=>setStudentsCount(e.target.value) }),
          React.createElement('input', { type:'number', placeholder:'Faculty Count (optional)', value:facultyCount, onChange:e=>setFacultyCount(e.target.value) }),
          React.createElement('div', { className:'form-actions' },
            React.createElement('button', { type:'submit', disabled:loading }, editingId ? (loading?'Updating...':'Update Department') : (loading?'Adding...':'Add Department')),
            editingId && React.createElement('button', { type:'button', className:'cancel-btn', onClick:()=>{ setName(''); setCode(''); setDescription(''); setDean(''); setStudentsCount(''); setFacultyCount(''); setEditingId(null);} }, 'Cancel')
          )
        )
      ),
      loading ? React.createElement('p', null, 'Loading…') : React.createElement('div', { className:'grid', style:{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px,1fr))', gap:'16px', marginTop:'12px'} },
        items.length>0 ? items.map(card) : React.createElement('p', null, 'No departments found.')
      )
    )
  );

  if (embed) return React.createElement('div', { className:'content' }, content);
  return React.createElement('div', { className:'dashboard' }, React.createElement('div', { className:'main' }, React.createElement('section', { className:'content' }, content)));
}
