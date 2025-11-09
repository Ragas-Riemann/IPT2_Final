import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function MyDepartment({ userRole = 'student' }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile && profile.department_id) {
      fetchDepartmentDetails(profile.department_id);
    }
  }, [profile]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
      setError('Failed to load user information');
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const endpoint = userRole === 'student' ? '/api/students' : '/api/faculty';
      const res = await axios.get(endpoint);
      const profiles = res.data;
      const userProfile = profiles.find(p => p.email === user.email);
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setError('Profile not found. Please complete your profile first.');
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentDetails = async (departmentId) => {
    try {
      const res = await axios.get('/api/departments');
      const departments = res.data;
      const dept = departments.find(d => d.id === departmentId);
      if (dept) {
        setDepartment(dept);
      }
    } catch (e) {
      console.error('Failed to fetch department details', e);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'loading-state' },
      React.createElement('p', null, 'Loading department information...')
    );
  }

  if (error) {
    return React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'alert alert-error' }, error),
      React.createElement('p', null, 
        'Please make sure you have completed your profile and assigned a department.'
      )
    );
  }

  if (!profile || !department) {
    return React.createElement('div', { className: 'card' },
      React.createElement('div', { className: 'card-header' },
        React.createElement('h2', null, 'My Department')
      ),
      React.createElement('div', { className: 'empty-state' },
        React.createElement('p', null, 
          'No department assigned. Please complete your profile and assign a department.'
        )
      )
    );
  }

  return React.createElement('div', { className: 'department-card' },
    React.createElement('div', { className: 'card-header' },
      React.createElement('h2', null, 'My Department')
    ),
    React.createElement('div', null,
      React.createElement('h3', null, department.name),
      React.createElement('div', { className: 'department-field' },
        React.createElement('strong', null, 'Department Code:'),
        React.createElement('span', null, department.code || 'N/A')
      ),
      department.description && React.createElement('div', { className: 'department-description' },
        React.createElement('strong', null, 'Description:'),
        React.createElement('p', null, department.description)
      ),
      React.createElement('div', { className: 'department-field' },
        React.createElement('strong', null, 'Dean:'),
        React.createElement('span', null, department.dean || 'Not assigned')
      ),
      React.createElement('div', { className: 'department-field' },
        React.createElement('strong', null, 'Total Students:'),
        React.createElement('span', null, department.students_count || 0)
      ),
      React.createElement('div', { className: 'department-field' },
        React.createElement('strong', null, 'Total Faculty:'),
        React.createElement('span', null, department.faculty_count || 0)
      )
    )
  );
}

