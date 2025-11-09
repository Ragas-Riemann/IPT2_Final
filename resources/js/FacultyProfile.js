import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function FacultyProfile() {
  const [user, setUser] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFacultyProfile();
    }
  }, [user]);

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

  const fetchFacultyProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await axios.get('/api/faculty');
      const facultyList = res.data;
      // Find faculty by email match
      const facultyProfile = facultyList.find(f => f.email === user.email);
      
      if (facultyProfile) {
        setFaculty(facultyProfile);
        setFirstName(facultyProfile.first_name || '');
        setLastName(facultyProfile.last_name || '');
        setAge(facultyProfile.age || '');
        setGender(facultyProfile.gender || '');
        setEmail(facultyProfile.email || user.email);
        setDateOfBirth(facultyProfile.date_of_birth || '');
        setDepartmentId(facultyProfile.department_id || '');
      } else {
        // No profile exists yet, allow them to create one
        setEmail(user.email);
        setEditing(true);
      }
    } catch (e) {
      console.error('Failed to fetch faculty profile', e);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch (e) {
      console.error('Failed to fetch departments', e);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    // Validate required fields
    if (!firstName || !lastName) {
      setError('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      // Ensure required fields are never empty
      const first_name = firstName.trim();
      const last_name = lastName.trim();
      
      if (!first_name || !last_name) {
        setError('First name and last name are required');
        setLoading(false);
        return;
      }

      const payload = {
        first_name: first_name,
        last_name: last_name,
        age: age === '' ? null : Number(age),
        gender: gender || null,
        email: email || user.email,
        date_of_birth: dateOfBirth || null,
        department_id: departmentId || null,
      };

      // Use regular JSON payload
      if (faculty) {
        await axios.put(`/api/faculty/${faculty.id}`, payload);
        setMessage('Profile updated successfully!');
      } else {
        await axios.post('/api/faculty', payload);
        setMessage('Profile created successfully!');
      }
      
      setEditing(false);
      await fetchFacultyProfile();
    } catch (err) {
      console.error('Error submitting profile:', err);
      console.error('Error response:', err?.response?.data);
      const apiMsg = err?.response?.data?.message || Object.values(err?.response?.data || {})?.[0] || err.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Ensure form fields are populated when editing
    if (faculty) {
      setFirstName(faculty.first_name || '');
      setLastName(faculty.last_name || '');
      setAge(faculty.age || '');
      setGender(faculty.gender || '');
      setEmail(faculty.email || user.email);
      setDateOfBirth(faculty.date_of_birth || '');
      setDepartmentId(faculty.department_id || '');
    }
    setEditing(true);
    setError('');
    setMessage('');
  };

  const handleCancel = () => {
    if (faculty) {
      setFirstName(faculty.first_name || '');
      setLastName(faculty.last_name || '');
      setAge(faculty.age || '');
      setGender(faculty.gender || '');
      setEmail(faculty.email || user.email);
      setDateOfBirth(faculty.date_of_birth || '');
      setDepartmentId(faculty.department_id || '');
    }
    setEditing(false);
    setError('');
    setMessage('');
  };

  if (loading && !faculty) {
    return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } }, 'Loading profile...');
  }

  return React.createElement('div', { className: 'card', style: { maxWidth: '800px', margin: '0 auto' } },
    React.createElement('div', { className: 'card-header' },
      React.createElement('h2', null, 'My Profile')
    ),
    
    // Display mode
    !editing && React.createElement(React.Fragment, null,
      faculty ? React.createElement('div', { style: { padding: '20px' } },
        React.createElement('div', { style: { marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' } },
          React.createElement('h3', { style: { marginBottom: '10px', color: '#333' } }, 'Personal Information'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Name:'),
            React.createElement('span', null, `${faculty.first_name || ''} ${faculty.last_name || ''}`.trim() || 'Not set')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Email:'),
            React.createElement('span', null, faculty.email || user?.email || 'Not set')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Age:'),
            React.createElement('span', null, faculty.age || 'Not set')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Gender:'),
            React.createElement('span', null, faculty.gender || 'Not set')
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' } },
          React.createElement('h3', { style: { marginBottom: '10px', color: '#333' } }, 'Academic Information'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', marginBottom: '8px' } },
            React.createElement('strong', null, 'Department:'),
            React.createElement('span', null, faculty.department_id ? (departments.find(d => d.id === faculty.department_id)?.code || departments.find(d => d.id === faculty.department_id)?.name || `ID: ${faculty.department_id}`) : 'Not set')
          )
        ),
        React.createElement('div', { className: 'form-actions', style: { marginTop: '20px' } },
          React.createElement('button', { onClick: handleEdit, style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' } }, 'Edit Profile')
        )
      ) : React.createElement('div', { style: { padding: '20px', textAlign: 'center' } },
        React.createElement('p', { style: { marginBottom: '20px', color: '#666' } }, 'You haven\'t created your profile yet. Please fill out your information below.'),
        React.createElement('button', { onClick: handleEdit, style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' } }, 'Create Profile')
      )
    ),

    // Edit mode
    editing && React.createElement('form', { className: 'post-form', onSubmit: handleSubmit, style: { padding: '20px' } },
      error && React.createElement('div', { style: { background: '#ffdddd', color: '#900', padding: '8px', borderRadius: '6px', marginBottom: '15px' } }, error),
      message && React.createElement('div', { style: { background: '#ddffdd', color: '#064', padding: '8px', borderRadius: '6px', marginBottom: '15px' } }, message),
      
      React.createElement('h3', { style: { marginBottom: '15px', color: '#333' } }, 'Personal Information'),
      React.createElement('input', {
        type: 'text',
        placeholder: 'First Name *',
        value: firstName,
        onChange: (e) => setFirstName(e.target.value),
        required: true,
        style: { marginBottom: '10px' }
      }),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Last Name *',
        value: lastName,
        onChange: (e) => setLastName(e.target.value),
        required: true,
        style: { marginBottom: '10px' }
      }),
      React.createElement('input', {
        type: 'email',
        placeholder: 'Email',
        value: email,
        onChange: (e) => setEmail(e.target.value),
        disabled: true,
        style: { marginBottom: '10px', background: '#f5f5f5', cursor: 'not-allowed' }
      }),
      React.createElement('input', {
        type: 'date',
        placeholder: 'Date of Birth (mm/dd/yyyy) - Age will be calculated automatically',
        value: dateOfBirth,
        onChange: (e) => setDateOfBirth(e.target.value),
        style: { marginBottom: '10px' }
      }),
      React.createElement('input', {
        type: 'number',
        placeholder: 'Age (auto-calculated from Date of Birth)',
        value: age,
        onChange: (e) => setAge(e.target.value),
        min: 0,
        max: 150,
        readOnly: true,
        style: { marginBottom: '10px', background: '#f5f5f5', cursor: 'not-allowed' }
      }),
      React.createElement('select', {
        value: gender,
        onChange: (e) => setGender(e.target.value),
        style: { marginBottom: '10px' }
      },
        React.createElement('option', { value: '' }, 'Select Gender (optional)'),
        React.createElement('option', { value: 'Male' }, 'Male'),
        React.createElement('option', { value: 'Female' }, 'Female')
      ),

      React.createElement('h3', { style: { marginTop: '20px', marginBottom: '15px', color: '#333' } }, 'Academic Information'),
      React.createElement('select', {
        value: departmentId,
        onChange: (e) => setDepartmentId(e.target.value),
        style: { marginBottom: '10px' }
      },
        React.createElement('option', { value: '' }, 'Select Department (optional)'),
        ...departments.map(d => React.createElement('option', { key: d.id, value: d.id }, d.name))
      ),

      React.createElement('div', { className: 'form-actions', style: { marginTop: '20px' } },
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          style: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' }
        }, loading ? 'Saving...' : (faculty ? 'Update Profile' : 'Create Profile')),
        React.createElement('button', {
          type: 'button',
          onClick: handleCancel,
          className: 'cancel-btn',
          style: { padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }
        }, 'Cancel')
      )
    )
  );
}

