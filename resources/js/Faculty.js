import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function Faculty({ embed = false, onDataChange = () => {} }){
  const [faculty, setFaculty] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [filterDepartmentId, setFilterDepartmentId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(()=>{ fetchUser(); fetchAll(); fetchDepartments(); },[]);

  useEffect(() => {
    // refetch list when filter changes
    fetchAll();
  }, [filterDepartmentId]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : '';
  };

  // Auto-calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      if (calculatedAge) {
        setAge(calculatedAge);
      }
    } else {
      setAge('');
    }
  }, [dateOfBirth]);

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
    try{
      const params = {};
      if (filterDepartmentId) params.department_id = filterDepartmentId;
      const res = await axios.get('/api/faculty', { params });
      setFaculty(res.data);
      onDataChange(res.data);
    }catch(e){ console.error(e); }
    finally{ setLoading(false); }
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError(''); setMessage('');
    if(!firstName || !lastName || !email){
      setError('Please fill in all required fields (First Name, Last Name, and Email)');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try{
      const payload = {
        first_name:firstName,
        last_name:lastName,
        date_of_birth: dateOfBirth || null,
        age: age === '' ? null : Number(age),
        gender: gender || null,
        email: email,
        department_id: departmentId || null,
      };
      if(editingId){
        await axios.put(`/api/faculty/${editingId}`, payload);
        setMessage('Faculty updated');
      }else{
        const response = await axios.post('/api/faculty', payload);
        setMessage(response.data?.message || 'Faculty added and account created successfully. Default password: 123456');
      }
      setFirstName(''); setLastName(''); setDateOfBirth(''); setAge(''); setGender(''); setEmail(''); setDepartmentId(''); setEditingId(null);
      setShowForm(false);
      await fetchAll();
    }catch(e){
      const apiMsg = e?.response?.data?.message || Object.values(e?.response?.data || {})?.[0] || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    }finally{ setLoading(false); }
  }

  async function handleDelete(id){
    if(!window.confirm('Delete this faculty?')) return;
    try{ await axios.delete(`/api/faculty/${id}`); fetchAll(); }catch(e){ console.error(e); }
  }

  async function fetchDepartments(){
    try{ const res = await axios.get('/api/departments'); setDepartments(res.data); } catch(e){ console.error(e); }
  }

  const content = (
    React.createElement(React.Fragment, null,
      React.createElement('div', { className:'card' },
        React.createElement('div', { className:'card-header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('h2', null, 'Faculty'),
          // Register Faculty button - only show for admin
          (user && user.role === 'admin' && !showForm && !editingId) && React.createElement(
            'button',
            { 
              type: 'button',
              onClick: () => setShowForm(true),
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
            'Register Faculty'
          ),
        ),
        // Form - only show for admin and when showForm is true or editingId exists
        (user && user.role === 'admin' && (showForm || editingId)) && React.createElement(
          React.Fragment,
          null,
          React.createElement('h3', { style: { margin: '20px 0 10px 0', color: '#333', fontWeight: '600' } }, editingId ? 'Edit Faculty' : 'Register Faculty'),
          React.createElement('form', { className:'post-form', onSubmit: handleSubmit },
          error && React.createElement('div', { style:{background:'#ffdddd', color:'#900', padding:'8px', borderRadius:'6px'} }, error),
          message && React.createElement('div', { style:{background:'#ddffdd', color:'#064', padding:'8px', borderRadius:'6px'} }, message),
          React.createElement('input', { type:'text', placeholder:'First Name *', value:firstName, onChange:e=>setFirstName(e.target.value), required:true }),
          React.createElement('input', { type:'text', placeholder:'Last Name *', value:lastName, onChange:e=>setLastName(e.target.value), required:true }),
          React.createElement('input', { type:'date', placeholder:'Birthday', value:dateOfBirth, onChange:e=>setDateOfBirth(e.target.value), style:{marginBottom:'10px'} }),
          React.createElement('input', { type:'number', placeholder:'Age (auto-calculated)', value:age, readOnly:true, style:{background:'#f5f5f5', cursor:'not-allowed', marginBottom:'10px'}, min:0, max:150 }),
          React.createElement('select', { value:gender, onChange:e=>setGender(e.target.value) },
            React.createElement('option', { value:'' }, 'Select Gender (optional)'),
            React.createElement('option', { value:'Male' }, 'Male'),
            React.createElement('option', { value:'Female' }, 'Female')
          ),
          React.createElement('input', { type:'email', placeholder:'Email *', value:email, onChange:e=>setEmail(e.target.value), required:true }),
          React.createElement('select', { value:departmentId, onChange:e=>setDepartmentId(e.target.value) },
            [React.createElement('option', { key:'', value:'' }, 'Select Department (optional)'), ...departments.map(d=> React.createElement('option', { key:d.id, value:d.id }, d.name))]
          ),
          React.createElement('div', { className:'form-actions' },
            React.createElement('button', { type:'submit', disabled:loading }, editingId ? (loading?'Updating...':'Update') : (loading?'Adding...':'Add Faculty')),
            React.createElement('button', { 
              type:'button', 
              className:'cancel-btn', 
              onClick:()=>{ 
                setFirstName(''); 
                setLastName(''); 
                setDateOfBirth(''); 
                setAge(''); 
                setGender(''); 
                setEmail(''); 
                setDepartmentId(''); 
                setEditingId(null); 
                setError(''); 
                setMessage(''); 
                setShowForm(false);
              } 
            }, 'Cancel')
          )
          )
        ),
        // Filter dropdown - show for all authenticated users
        user && React.createElement(
          'div',
          { className: 'filters', style: { display: 'flex', gap: '8px', marginTop: '8px', marginBottom: '8px' } },
          React.createElement(
            'select',
            { 
              value: filterDepartmentId, 
              onChange: (e) => setFilterDepartmentId(e.target.value)
            },
            [
              React.createElement('option', { key: '', value: '' }, 'Filter by Department'),
              ...departments.map(d => React.createElement('option', { key: d.id, value: d.id }, d.name))
            ]
          )
        ),
        loading ? React.createElement('p', null, 'Loading…') : (
          React.createElement('table', null,
            React.createElement('thead', null, React.createElement('tr', null, ['ID','First Name','Last Name','Age','Gender','Email','Department Code','Created At', user && user.role === 'admin' ? 'Actions' : ''].filter(h => h).map(h=> React.createElement('th', { key:h }, h)))),
            React.createElement('tbody', null,
              faculty.length>0 ? faculty.map(f=> (
                React.createElement('tr', { key:f.id },
                  React.createElement('td', null, f.id),
                  React.createElement('td', null, f.first_name),
                  React.createElement('td', null, f.last_name),
                  React.createElement('td', null, f.age ?? ''),
                  React.createElement('td', null, f.gender ?? ''),
                  React.createElement('td', null, f.email ?? ''),
                  React.createElement('td', null, f.department_id ? (departments.find(d => d.id === f.department_id)?.code || f.department_id) : ''),
                  React.createElement('td', null, new Date(f.created_at).toLocaleString()),
                  // Only admin can edit/delete faculty
                  (user && user.role === 'admin') && React.createElement('td', null,
                    React.createElement('button', { onClick:()=>{ setEditingId(f.id); setFirstName(f.first_name); setLastName(f.last_name); setDateOfBirth(f.date_of_birth ?? ''); setAge(f.age ?? ''); setGender(f.gender ?? ''); setEmail(f.email ?? ''); setDepartmentId(f.department_id ?? ''); setShowForm(true); } }, 'Edit'),
                    React.createElement('button', { className:'delete-btn', onClick:()=>handleDelete(f.id) }, 'Delete')
                  )
                )
              )) : React.createElement('tr', null, React.createElement('td', { colSpan: user && user.role === 'admin' ? 10 : 9 }, 'No faculty found.'))
            )
          )
        )
      )
    )
  );

  if (embed) {
    return React.createElement('div', { className:'content' }, content);
  }
  return (
    React.createElement('div', { className:'dashboard' },
      React.createElement('div', { className:'main' },
        React.createElement('section', { className:'content' }, content)
      )
    )
  );
}
