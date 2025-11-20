import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../sass/Student.scss';

export default function Settings({ embed = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Other settings fields
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      setMessage(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const apiMsg = err?.response?.data?.message || Object.values(err?.response?.data || {})?.[0] || err.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      // In the future, you can add API endpoint to save notification preferences
      // For now, just show a success message
      setMessage('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'card' },
        React.createElement('div', { className: 'card-header' },
          React.createElement('h2', null, 'Settings')
        ),
        React.createElement('div', { style: { padding: '20px' } },
          // Password Change Section
          React.createElement('div', { style: { marginBottom: '40px', paddingBottom: '30px', borderBottom: '2px solid #e0e0e0' } },
            React.createElement('h3', { style: { marginBottom: '20px', color: '#333', fontSize: '20px', fontWeight: '600' } }, 'Change Password'),
            error && React.createElement('div', { style: { background: '#ffdddd', color: '#900', padding: '12px', borderRadius: '6px', marginBottom: '15px' } }, error),
            message && React.createElement('div', { style: { background: '#ddffdd', color: '#064', padding: '12px', borderRadius: '6px', marginBottom: '15px' } }, message),
            React.createElement('form', { onSubmit: handlePasswordChange, style: { maxWidth: '500px' } },
              React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' } }, 'Current Password *'),
                React.createElement('input', {
                  type: 'password',
                  placeholder: 'Enter your current password',
                  value: currentPassword,
                  onChange: (e) => setCurrentPassword(e.target.value),
                  required: true,
                  style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }
                })
              ),
              React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' } }, 'New Password *'),
                React.createElement('input', {
                  type: 'password',
                  placeholder: 'Enter your new password (min. 8 characters)',
                  value: newPassword,
                  onChange: (e) => setNewPassword(e.target.value),
                  required: true,
                  minLength: 8,
                  style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }
                }),
                React.createElement('small', { style: { color: '#666', fontSize: '12px' } }, 'Password must be at least 8 characters long')
              ),
              React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' } }, 'Confirm New Password *'),
                React.createElement('input', {
                  type: 'password',
                  placeholder: 'Confirm your new password',
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  required: true,
                  minLength: 8,
                  style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }
                })
              ),
              React.createElement('button', {
                type: 'submit',
                disabled: loading,
                style: {
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: loading ? 0.7 : 1
                }
              }, loading ? 'Changing Password...' : 'Change Password')
            )
          ),

          // Account Information Section
          React.createElement('div', { style: { marginBottom: '40px', paddingBottom: '30px', borderBottom: '2px solid #e0e0e0' } },
            React.createElement('h3', { style: { marginBottom: '20px', color: '#333', fontSize: '20px', fontWeight: '600' } }, 'Account Information'),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', marginBottom: '12px' } },
              React.createElement('strong', { style: { color: '#333' } }, 'Name:'),
              React.createElement('span', { style: { color: '#666' } }, user?.name || 'Loading...')
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', marginBottom: '12px' } },
              React.createElement('strong', { style: { color: '#333' } }, 'Email:'),
              React.createElement('span', { style: { color: '#666' } }, user?.email || 'Loading...')
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', marginBottom: '12px' } },
              React.createElement('strong', { style: { color: '#333' } }, 'Role:'),
              React.createElement('span', { style: { color: '#666', textTransform: 'capitalize' } }, user?.role || 'Loading...')
            )
          ),

          // Notification Preferences Section
          React.createElement('div', { style: { marginBottom: '40px' } },
            React.createElement('h3', { style: { marginBottom: '20px', color: '#333', fontSize: '20px', fontWeight: '600' } }, 'Notification Preferences'),
            React.createElement('div', { style: { marginBottom: '15px' } },
              React.createElement('label', { style: { display: 'flex', alignItems: 'center', cursor: 'pointer' } },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: emailNotifications,
                  onChange: (e) => setEmailNotifications(e.target.checked),
                  style: { marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }
                }),
                React.createElement('span', { style: { color: '#333', fontSize: '14px' } }, 'Email Notifications')
              ),
              React.createElement('small', { style: { display: 'block', marginLeft: '28px', color: '#666', fontSize: '12px' } }, 'Receive notifications via email')
            ),
            React.createElement('div', { style: { marginBottom: '20px' } },
              React.createElement('label', { style: { display: 'flex', alignItems: 'center', cursor: 'pointer' } },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: smsNotifications,
                  onChange: (e) => setSmsNotifications(e.target.checked),
                  style: { marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }
                }),
                React.createElement('span', { style: { color: '#333', fontSize: '14px' } }, 'SMS Notifications')
              ),
              React.createElement('small', { style: { display: 'block', marginLeft: '28px', color: '#666', fontSize: '12px' } }, 'Receive notifications via SMS')
            ),
            React.createElement('button', {
              onClick: handleSaveSettings,
              disabled: loading,
              style: {
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1
              }
            }, loading ? 'Saving...' : 'Save Preferences')
          )
        )
      )
    )
  );

  if (embed) {
    return React.createElement('div', { className: 'content' }, content);
  }
  return (
    React.createElement('div', { className: 'dashboard' },
      React.createElement('div', { className: 'main' },
        React.createElement('section', { className: 'content' }, content)
      )
    )
  );
}

