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
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedFacultyProfile, setSelectedFacultyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(()=>{ fetchUser(); fetchAll(); fetchDepartments(); },[]);

  useEffect(() => {
    // refetch list when filter changes
    fetchAll();
  }, [filterDepartmentId]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenuId !== null) {
        // Check if click is outside the dropdown menu and button
        const target = event.target;
        const isClickInsideMenu = target.closest('[data-action-menu]');
        const isClickOnButton = target.closest('[data-action-button]');
        
        if (!isClickInsideMenu && !isClickOnButton) {
          setOpenActionMenuId(null);
        }
      }
    };
    if (openActionMenuId !== null) {
      // Use a small delay to allow button click to process first
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openActionMenuId]);

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

  const handleViewProfile = async (facultyId) => {
    setLoadingProfile(true);
    setShowProfileModal(true);
    try {
      const res = await axios.get('/api/faculty');
      const facultyList = res.data;
      const facultyProfile = facultyList.find(f => f.id === facultyId);
      if (facultyProfile) {
        setSelectedFacultyProfile(facultyProfile);
      } else {
        setError('Faculty profile not found');
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error('Failed to fetch faculty profile', err);
      setError('Failed to load faculty profile');
      setShowProfileModal(false);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleResetPassword = async (facultyId, facultyEmail) => {
    if (!window.confirm(`Reset password for ${facultyEmail}? The password will be reset to the default password (123456).`)) return;
    try {
      setLoading(true);
      const response = await axios.post(`/api/faculty/${facultyId}/reset-password`);
      setMessage(response.data?.message || 'Password reset successfully. Default password: 123456');
      setError('');
    } catch (e) {
      const apiMsg = e?.response?.data?.message || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to reset password');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  async function handleDelete(id){
    if(!window.confirm('Archive this faculty? The faculty will be moved to the archive and automatically deleted after 1 year.')) return;
    try{ 
      const response = await axios.delete(`/api/faculty/${id}`);
      setMessage(response.data?.message || 'Faculty archived successfully');
      setError('');
      fetchAll(); 
    }catch(e){ 
      const apiMsg = e?.response?.data?.message || e.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to archive faculty');
      setMessage('');
    }
  }

  async function fetchDepartments(){
    try{ const res = await axios.get('/api/departments'); setDepartments(res.data); } catch(e){ console.error(e); }
  }

  // Helper function to render profile field
  const renderProfileField = (label, value) => {
    if (!value) return null;
    return React.createElement('div', { 
      style: { 
        display: 'grid', 
        gridTemplateColumns: '200px 1fr', 
        gap: '20px', 
        padding: '12px 16px',
        marginBottom: '4px',
        borderBottom: '1px solid #f0f0f0',
        transition: 'background-color 0.2s'
      },
      onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#f9f9f9',
      onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent'
    },
      React.createElement('strong', { style: { color: '#1a1a1a', fontWeight: '600', fontSize: '14px' } }, `${label}:`),
      React.createElement('span', { style: { color: '#555', fontSize: '14px', lineHeight: '1.5' } }, value)
    );
  };

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
        // Search bar - available for all authenticated users
        user && React.createElement(
          'div',
          { style: { marginTop: '16px', marginBottom: '12px' } },
          React.createElement(
            'input',
            {
              type: 'text',
              placeholder: 'Search by faculty name...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box'
              }
            }
          )
        ),
        // Filter dropdown - show for all authenticated users
        user && React.createElement(
          'div',
          { className: 'filters', style: { display: 'flex', gap: '8px', marginTop: '8px', marginBottom: '12px' } },
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
          React.createElement(
            'div',
            { style: { overflowX: 'auto', width: '100%' } },
            React.createElement('table', { style: { width: '100%', minWidth: '1000px', tableLayout: 'auto', borderCollapse: 'collapse' } },
              React.createElement('thead', null, React.createElement('tr', null, ['ID','First Name','Last Name','Age','Gender','Email','Department Code','Created At', user && user.role === 'admin' ? 'Actions' : ''].filter(h => h).map(h=> 
                React.createElement('th', { 
                  key:h, 
                  style: { 
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e0e0e0',
                    whiteSpace: 'nowrap',
                    ...(h === 'ID' ? { width: '50px', minWidth: '50px' } : {}),
                    ...(h === 'Age' ? { width: '60px', minWidth: '60px' } : {}),
                    ...(h === 'Gender' ? { width: '80px', minWidth: '80px' } : {}),
                    ...(h === 'Email' ? { width: '200px', minWidth: '200px' } : {}),
                    ...(h === 'Department Code' ? { width: '150px', minWidth: '150px' } : {}),
                    ...(h === 'Created At' ? { width: '180px', minWidth: '180px' } : {}),
                    ...(h === 'Actions' ? { width: '80px', minWidth: '80px', textAlign: 'center' } : {})
                  } 
                }, h)
              ))),
            React.createElement('tbody', null,
              (() => {
                // Filter faculty based on search term (case-insensitive)
                let filteredFaculty = faculty;
                if (searchTerm.trim()) {
                  const searchLower = searchTerm.toLowerCase().trim();
                  filteredFaculty = faculty.filter(f => {
                    const firstName = (f.first_name || '').toLowerCase();
                    const lastName = (f.last_name || '').toLowerCase();
                    const fullName = `${firstName} ${lastName}`.trim();
                    return firstName.includes(searchLower) || 
                           lastName.includes(searchLower) || 
                           fullName.includes(searchLower);
                  });
                }
                return filteredFaculty.length > 0 ? filteredFaculty.map(f=> (
                React.createElement('tr', { key:f.id },
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, f.id),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, f.first_name),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, f.last_name),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap', textAlign: 'center' } }, f.age ?? ''),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, f.gender ?? ''),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, f.email ?? ''),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, f.department_id ? (departments.find(d => d.id === f.department_id)?.code || f.department_id) : ''),
                  React.createElement('td', { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, new Date(f.created_at).toLocaleString()),
                  // Only admin can edit/delete faculty
                  (user && user.role === 'admin') && React.createElement('td', { style: { position: 'relative', padding: '10px 8px', whiteSpace: 'nowrap', textAlign: 'center' } },
                    React.createElement(
                      'button',
                      {
                        'data-action-button': true,
                        onClick: (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpenActionMenuId(openActionMenuId === f.id ? null : f.id);
                        },
                        style: {
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          position: 'relative',
                          zIndex: 1001
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.backgroundColor = '#5568d3';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.backgroundColor = '#667eea';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      },
                      '⋮'
                    ),
                    // Dropdown menu
                    openActionMenuId === f.id && React.createElement(
                      'div',
                      {
                        'data-action-menu': true,
                        style: {
                          position: 'absolute',
                          top: '40px',
                          right: '0',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 1002,
                          minWidth: '160px',
                          padding: '8px 0',
                          border: '1px solid #e0e0e0'
                        },
                        onClick: (e) => e.stopPropagation()
                      },
                      // View Profile button
                      React.createElement(
                        'button',
                        {
                          onClick: () => {
                            handleViewProfile(f.id);
                            setOpenActionMenuId(null);
                          },
                          style: {
                            width: '100%',
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#333',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                          },
                          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#f5f5f5',
                          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent'
                        },
                        React.createElement('span', { style: { color: '#10b981', fontSize: '16px' } }, '👁️'),
                        'View Profile'
                      ),
                      // Edit button
                      React.createElement(
                        'button',
                        {
                          onClick: () => {
                            setEditingId(f.id);
                            setFirstName(f.first_name);
                            setLastName(f.last_name);
                            setDateOfBirth(f.date_of_birth ?? '');
                            setAge(f.age ?? '');
                            setGender(f.gender ?? '');
                            setEmail(f.email ?? '');
                            setDepartmentId(f.department_id ?? '');
                            setShowForm(true);
                            setOpenActionMenuId(null);
                          },
                          style: {
                            width: '100%',
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#333',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                          },
                          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#f5f5f5',
                          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent'
                        },
                        React.createElement('span', { style: { color: '#667eea', fontSize: '16px' } }, '✏️'),
                        'Edit'
                      ),
                      // Reset Password button
                      React.createElement(
                        'button',
                        {
                          onClick: () => {
                            handleResetPassword(f.id, f.email);
                            setOpenActionMenuId(null);
                          },
                          style: {
                            width: '100%',
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#333',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                          },
                          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#f5f5f5',
                          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent'
                        },
                        React.createElement('span', { style: { color: '#f59e0b', fontSize: '16px' } }, '🔑'),
                        'Reset Password'
                      ),
                      // Archive button
                      React.createElement(
                        'button',
                        {
                          onClick: () => {
                            handleDelete(f.id);
                            setOpenActionMenuId(null);
                          },
                          style: {
                            width: '100%',
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#dc2626',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s',
                            borderTop: '1px solid #e0e0e0',
                            marginTop: '4px',
                            paddingTop: '10px'
                          },
                          onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#fee',
                          onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'transparent'
                        },
                        React.createElement('span', { style: { color: '#dc2626', fontSize: '16px' } }, '🗄️'),
                        'Archive'
                      )
                    )
                  )
                )
                )) : (
                  React.createElement('tr', null, React.createElement('td', { colSpan: user && user.role === 'admin' ? 9 : 8, style: { textAlign: 'center', padding: '20px' } }, searchTerm.trim() ? `No faculty found matching "${searchTerm}"` : 'No faculty found.'))
                );
              })()
            )
          )
          )
        ),
        // Profile Modal
        showProfileModal && React.createElement(
          'div',
          {
            style: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '20px'
            },
            onClick: (e) => {
              if (e.target === e.currentTarget) {
                setShowProfileModal(false);
                setSelectedFacultyProfile(null);
              }
            }
          },
          React.createElement(
            'div',
            {
              style: {
                backgroundColor: 'white',
                borderRadius: '8px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }
            },
            // Modal Header
            React.createElement(
              'div',
              {
                style: {
                  padding: '20px',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                  zIndex: 10
                }
              },
              React.createElement('h2', { style: { margin: 0, color: '#1a1a1a', fontWeight: '700' } }, 'Faculty Profile'),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setShowProfileModal(false);
                    setSelectedFacultyProfile(null);
                  },
                  style: {
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                },
                '×'
              )
            ),
            // Modal Content
            React.createElement(
              'div',
              { style: { padding: '20px' } },
              loadingProfile ? (
                React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                  React.createElement('p', null, 'Loading profile...')
                )
              ) : selectedFacultyProfile ? (
                React.createElement(React.Fragment, null,
                  // Personal Information
                  React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                    React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Personal Information'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                      renderProfileField('Name', `${selectedFacultyProfile.first_name || ''} ${selectedFacultyProfile.last_name || ''}`.trim() || 'Not set'),
                      renderProfileField('Email', selectedFacultyProfile.email || 'Not set'),
                      renderProfileField('Age', selectedFacultyProfile.age),
                      renderProfileField('Gender', selectedFacultyProfile.gender),
                      renderProfileField('Date of Birth', selectedFacultyProfile.date_of_birth ? new Date(selectedFacultyProfile.date_of_birth).toLocaleDateString() : null)
                    )
                  ),
                  // Academic Information
                  React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                    React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Academic Information'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                      renderProfileField('Department', selectedFacultyProfile.department_id ? (departments.find(d => d.id === selectedFacultyProfile.department_id)?.name || departments.find(d => d.id === selectedFacultyProfile.department_id)?.code || `ID: ${selectedFacultyProfile.department_id}`) : 'Not set')
                    )
                  ),
                  // Account Information
                  React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                    React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Account Information'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                      renderProfileField('Created At', selectedFacultyProfile.created_at ? new Date(selectedFacultyProfile.created_at).toLocaleString() : null),
                      renderProfileField('Updated At', selectedFacultyProfile.updated_at ? new Date(selectedFacultyProfile.updated_at).toLocaleString() : null)
                    )
                  ),
                  // Close button
                  React.createElement('div', { style: { marginTop: '20px', textAlign: 'center' } },
                    React.createElement(
                      'button',
                      {
                        onClick: () => {
                          setShowProfileModal(false);
                          setSelectedFacultyProfile(null);
                        },
                        style: {
                          padding: '10px 20px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }
                      },
                      'Close'
                    )
                  )
                )
              ) : (
                React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                  React.createElement('p', null, 'No profile data available.')
                )
              )
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
