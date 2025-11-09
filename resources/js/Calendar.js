import React, { useState } from 'react';
import '../sass/Dashboard.scss';

export default function Calendar({ embed = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();
  const currentDay = today.getDate();

  const calendarContent = React.createElement('div', { className: 'calendar-container', style: { 
    background: 'white', 
    borderRadius: '8px', 
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  } },
    // Header with month navigation
    React.createElement('div', { style: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '2px solid #e0e0e0'
    } },
      React.createElement('button', {
        onClick: goToPreviousMonth,
        style: {
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontSize: '14px'
        }
      }, '← Prev'),
      React.createElement('div', { style: { textAlign: 'center' } },
        React.createElement('h3', { style: { 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#333' 
        } }, 
          `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
        )
      ),
      React.createElement('button', {
        onClick: goToNextMonth,
        style: {
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 15px',
          cursor: 'pointer',
          fontSize: '14px'
        }
      }, 'Next →')
    ),

    // Today button
    React.createElement('div', { style: { marginBottom: '15px', textAlign: 'center' } },
      React.createElement('button', {
        onClick: goToToday,
        style: {
          background: '#f0f0f0',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '12px'
        }
      }, 'Today')
    ),

    // Day names header
    React.createElement('div', { style: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(7, 1fr)', 
      gap: '5px', 
      marginBottom: '10px' 
    } },
      dayNames.map(day => 
        React.createElement('div', { 
          key: day, 
          style: { 
            textAlign: 'center', 
            fontWeight: '600', 
            color: '#666', 
            fontSize: '12px',
            padding: '8px 0'
          } 
        }, day)
      )
    ),

    // Calendar grid
    React.createElement('div', { style: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(7, 1fr)', 
      gap: '5px' 
    } },
      days.map((day, index) => {
        const isToday = isCurrentMonth && day === currentDay;
        return React.createElement('div', {
          key: index,
          style: {
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            background: day 
              ? (isToday ? '#667eea' : '#f8f9fa') 
              : 'transparent',
            color: day 
              ? (isToday ? 'white' : '#333') 
              : 'transparent',
            fontWeight: isToday ? '600' : '400',
            cursor: day ? 'pointer' : 'default',
            fontSize: '14px',
            border: isToday ? '2px solid #667eea' : '1px solid #e0e0e0',
            transition: 'all 0.2s'
          },
          onMouseEnter: (e) => {
            if (day && !isToday) {
              e.target.style.background = '#e8eaf6';
            }
          },
          onMouseLeave: (e) => {
            if (day && !isToday) {
              e.target.style.background = '#f8f9fa';
            }
          }
        }, day || '');
      })
    )
  );

  if (embed) {
    return calendarContent;
  }

  return React.createElement('div', { className: 'card', style: { maxWidth: '600px', margin: '0 auto' } },
    React.createElement('div', { className: 'card-header' },
      React.createElement('h2', null, 'Calendar')
    ),
    calendarContent
  );
}

