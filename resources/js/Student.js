import React, { useState, useEffect } from "react";
import axios from "axios";
import "../sass/Student.scss";

export default function Student({ embed = false, onDataChange = () => {} }) {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // For filter dropdown
  const [formFilteredCourses, setFormFilteredCourses] = useState([]); // For form dropdown
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState("");
  const [filterCourseId, setFilterCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchStudents();
    fetchDepartments();
    fetchCourses();
  }, []);

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

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  useEffect(() => {
    // refetch list when filters change
    fetchStudents();
  }, [filterDepartmentId, filterCourseId]);

  // Fetch courses when filter department changes
  useEffect(() => {
    if (filterDepartmentId) {
      fetchCoursesByDepartment(filterDepartmentId);
    } else {
      setFilteredCourses([]);
      setFilterCourseId(''); // Reset course filter when department is cleared
    }
  }, [filterDepartmentId]);

  // Fetch courses when form department changes
  useEffect(() => {
    if (departmentId) {
      fetchCoursesByDepartmentForForm(departmentId);
    } else {
      setFormFilteredCourses([]);
      setCourseId(''); // Reset course when department is cleared
    }
  }, [departmentId]);

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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDepartmentId) params.department_id = filterDepartmentId;
      if (filterCourseId) params.course_id = filterCourseId;
      const res = await axios.get("/api/students", { params });
      setStudents(res.data);
      onDataChange(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchCoursesByDepartment = async (deptId) => {
    try {
      const res = await axios.get(`/api/courses?department_id=${deptId}`);
      setFilteredCourses(res.data);
      // If current course filter is not in the filtered list, reset it
      if (filterCourseId && !res.data.find(c => c.id === Number(filterCourseId))) {
        setFilterCourseId('');
      }
    } catch (e) {
      console.error('Failed to fetch courses', e);
      setFilteredCourses([]);
    }
  };

  const fetchCoursesByDepartmentForForm = async (deptId) => {
    try {
      const res = await axios.get(`/api/courses?department_id=${deptId}`);
      setFormFilteredCourses(res.data);
      // If current course is not in the filtered list, reset it
      const currentCourseId = courseId;
      if (currentCourseId && !res.data.find(c => c.id === Number(currentCourseId))) {
        setCourseId('');
      }
    } catch (e) {
      console.error('Failed to fetch courses', e);
      setFormFilteredCourses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!firstName || !lastName || !email) {
      setError("Please fill in all required fields (First Name, Last Name, and Email)");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`/api/students/${editingId}`, { first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth || null, age: age === "" ? null : Number(age), gender: gender || null, email: email, department_id: departmentId || null, course_id: courseId || null });
        setMessage("Student updated");
      } else {
        const response = await axios.post("/api/students", { first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth || null, age: age === "" ? null : Number(age), gender: gender || null, email: email, department_id: departmentId || null, course_id: courseId || null });
        // Use message from server if available, otherwise use default
        setMessage(response.data?.message || "Student added and account created successfully. Default password: 123456");
      }
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setAge("");
      setGender("");
      setEmail("");
      setDepartmentId("");
      setCourseId("");
      setEditingId(null);
      setShowForm(false);
      await fetchStudents();
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.message || Object.values(err?.response?.data || {})?.[0] || err.message;
      setError(typeof apiMsg === "string" ? apiMsg : "Request failed");
    }
    finally { setLoading(false); }
  };

  const handleViewProfile = async (studentId) => {
    setLoadingProfile(true);
    setShowProfileModal(true);
    try {
      const res = await axios.get('/api/students');
      const students = res.data;
      const studentProfile = students.find(s => s.id === studentId);
      if (studentProfile) {
        setSelectedStudentProfile(studentProfile);
      } else {
        setError('Student profile not found');
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error('Failed to fetch student profile', err);
      setError('Failed to load student profile');
      setShowProfileModal(false);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleResetPassword = async (studentId, studentEmail) => {
    if (!window.confirm(`Reset password for ${studentEmail}? The password will be reset to the default password (123456).`)) return;
    try {
      setLoading(true);
      const response = await axios.post(`/api/students/${studentId}/reset-password`);
      setMessage(response.data?.message || 'Password reset successfully. Default password: 123456');
      setError('');
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to reset password');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this student? The student will be moved to the archive and automatically deleted after 1 year.")) return;
    try {
      const response = await axios.delete(`/api/students/${id}`);
      setMessage(response.data?.message || 'Student archived successfully');
      setError('');
      fetchStudents();
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err.message;
      setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to archive student');
      setMessage('');
    }
  };
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
    React.createElement(
      React.Fragment,
      null,
      // Header inside card
      React.createElement(
        "div",
        { className: "card" },
        React.createElement(
          "div",
          { className: "card-header", style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement("h2", null, "Students"),
          // Register Student button - only show for admin
          (user && user.role === 'admin' && !showForm && !editingId) && React.createElement(
            "button",
            { 
              type: "button",
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
            "Register Student"
          ),
        ),
        // Form - only show for admin and when showForm is true or editingId exists
        (user && user.role === 'admin' && (showForm || editingId)) && React.createElement(
          React.Fragment,
          null,
          React.createElement("h3", { style: { margin: '20px 0 10px 0', color: '#333', fontWeight: '600' } }, editingId ? "Edit Student" : "Register Student"),
          React.createElement(
          "form",
          { className: "post-form", onSubmit: handleSubmit },
          error && React.createElement("div", { style: { background: '#ffdddd', color: '#900', padding: '8px', borderRadius: '6px' } }, error),
          message && React.createElement("div", { style: { background: '#ddffdd', color: '#064', padding: '8px', borderRadius: '6px' } }, message),
          React.createElement("input", {
            type: "text",
            placeholder: "First Name *",
            value: firstName,
            onChange: (e) => setFirstName(e.target.value),
            required: true,
          }),
          React.createElement("input", {
            type: "text",
            placeholder: "Last Name *",
            value: lastName,
            onChange: (e) => setLastName(e.target.value),
            required: true,
          }),
          React.createElement("input", {
            type: "date",
            placeholder: "Birthday",
            value: dateOfBirth,
            onChange: (e) => setDateOfBirth(e.target.value),
            style: { marginBottom: '10px' }
          }),
          React.createElement("input", {
            type: "number",
            placeholder: "Age (auto-calculated)",
            value: age,
            readOnly: true,
            style: { background: '#f5f5f5', cursor: 'not-allowed', marginBottom: '10px' },
            min: 0,
            max: 150,
          }),
          React.createElement(
            "select",
            {
              value: gender,
              onChange: (e) => setGender(e.target.value),
            },
            [
              React.createElement("option", { key: "", value: "" }, "Select Gender (optional)"),
              React.createElement("option", { key: "Male", value: "Male" }, "Male"),
              React.createElement("option", { key: "Female", value: "Female" }, "Female"),
            ]
          ),
          React.createElement("input", {
            type: "email",
            placeholder: "Email *",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          }),
          React.createElement(
            "select",
            { 
              value: departmentId, 
              onChange: (e) => {
                setDepartmentId(e.target.value);
                setCourseId(''); // Reset course when department changes
              }
            },
            [
              React.createElement("option", { key: "", value: "" }, "Select Department (optional)"),
              ...departments.map(d => React.createElement("option", { key: d.id, value: d.id }, d.name))
            ]
          ),
          React.createElement(
            "select",
            { 
              value: courseId, 
              onChange: (e) => setCourseId(e.target.value),
              disabled: !departmentId, // Disable if no department selected
              style: { opacity: departmentId ? 1 : 0.6 }
            },
            [
              React.createElement("option", { key: "", value: "" }, departmentId ? "Select Course (optional)" : "Select Department first"),
              ...formFilteredCourses.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))
            ]
          ),
          React.createElement(
            "div",
            { className: "form-actions" },
            React.createElement("button", { type: "submit", disabled: loading }, editingId ? (loading ? "Updating..." : "Update") : (loading ? "Adding..." : "Add Student")),
            React.createElement(
              "button",
              { 
                type: "button", 
                className: "cancel-btn", 
                onClick: () => { 
                  setFirstName(""); 
                  setLastName(""); 
                  setDateOfBirth(""); 
                  setAge(""); 
                  setGender(""); 
                  setEmail(""); 
                  setDepartmentId(""); 
                  setCourseId(""); 
                  setEditingId(null); 
                  setError(""); 
                  setMessage(""); 
                  setShowForm(false);
                } 
              },
              "Cancel"
            )
          )
          )
        ),
        // Search bar - available for all authenticated users
        user && React.createElement(
          "div",
          { style: { marginTop: '16px', marginBottom: '12px' } },
          React.createElement(
            "input",
            {
              type: "text",
              placeholder: "Search by student name...",
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
        // Filters - only show for admin and faculty
        (user && (user.role === 'admin' || user.role === 'faculty')) && React.createElement(
          "div",
          { className: "filters", style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', marginBottom: '12px' } },
          React.createElement(
            "select",
            { 
              value: filterDepartmentId, 
              onChange: (e) => {
                setFilterDepartmentId(e.target.value);
                setFilterCourseId(''); // Reset course filter when department changes
              }
            },
            [
              React.createElement("option", { key: "", value: "" }, "Filter by Department"),
              ...departments.map(d => React.createElement("option", { key: d.id, value: d.id }, d.name))
            ]
          ),
          React.createElement(
            "select",
            { 
              value: filterCourseId, 
              onChange: (e) => setFilterCourseId(e.target.value),
              disabled: !filterDepartmentId, // Disable if no department selected
              style: { opacity: filterDepartmentId ? 1 : 0.6 }
            },
            [
              React.createElement("option", { key: "", value: "" }, filterDepartmentId ? "Filter by Course" : "Select Department first"),
              ...filteredCourses.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))
            ]
          )
        ),
        // Table
        loading ? React.createElement("p", null, "Loading…") : (
          React.createElement(
            "div",
            { style: { overflowX: 'auto', width: '100%' } },
          React.createElement(
            "table",
              { style: { width: '100%', minWidth: '1200px', tableLayout: 'auto', borderCollapse: 'collapse' } },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                  ["ID", "First Name", "Last Name", "Age", "Gender", "Email", "Department Code", "Course Code", "Created At", user && (user.role === 'admin' || user.role === 'student') ? "Actions" : ""].filter(h => h).map((h) => 
                    React.createElement("th", { 
                      key: h, 
                      style: { 
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '2px solid #e0e0e0',
                        whiteSpace: 'nowrap',
                        ...(h === 'ID' ? { width: '50px', minWidth: '50px' } : {}),
                        ...(h === 'Age' ? { width: '60px', minWidth: '60px' } : {}),
                        ...(h === 'Gender' ? { width: '80px', minWidth: '80px' } : {}),
                        ...(h === 'Email' ? { width: '200px', minWidth: '200px' } : {}),
                        ...(h === 'Department Code' ? { width: '120px', minWidth: '120px' } : {}),
                        ...(h === 'Course Code' ? { width: '120px', minWidth: '120px' } : {}),
                        ...(h === 'Created At' ? { width: '180px', minWidth: '180px' } : {}),
                        ...(h === 'Actions' ? { width: '80px', minWidth: '80px', textAlign: 'center' } : {})
                      } 
                    }, h)
                  )
              )
            ),
            React.createElement(
              "tbody",
              null,
              (() => {
                // Filter students based on search term (case-insensitive)
                let filteredStudents = students;
                if (searchTerm.trim()) {
                  const searchLower = searchTerm.toLowerCase().trim();
                  filteredStudents = students.filter(s => {
                    const firstName = (s.first_name || '').toLowerCase();
                    const lastName = (s.last_name || '').toLowerCase();
                    const fullName = `${firstName} ${lastName}`.trim();
                    return firstName.includes(searchLower) || 
                           lastName.includes(searchLower) || 
                           fullName.includes(searchLower);
                  });
                }
                return filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => React.createElement(
                  "tr",
                  { key: s.id },
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.id),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.first_name),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.last_name),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap', textAlign: 'center' } }, s.age ?? ""),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.gender ?? ""),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.email ?? ""),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.department_id ? (departments.find(d => d.id === s.department_id)?.code || s.department_id) : ""),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, s.course_id ? (courses.find(c => c.id === s.course_id)?.name || s.course_id) : ""),
                  React.createElement("td", { style: { padding: '10px 8px', whiteSpace: 'nowrap' } }, new Date(s.created_at).toLocaleString()),
                  // Only show Actions column for admin and students (not faculty)
                  (user && (user.role === 'admin' || user.role === 'student')) && React.createElement(
                    "td",
                    { style: { position: 'relative', padding: '10px 8px', whiteSpace: 'nowrap', textAlign: 'center' } },
                    React.createElement(
                      "button",
                      {
                        'data-action-button': true,
                        onClick: (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpenActionMenuId(openActionMenuId === s.id ? null : s.id);
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
                      "⋮"
                    ),
                    // Dropdown menu
                    openActionMenuId === s.id && React.createElement(
                      "div",
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
                        "button",
                        {
                          onClick: () => {
                            handleViewProfile(s.id);
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
                        "View Profile"
                      ),
                      // Edit button - Students can only edit their own profile, admin can edit any
                      (user && (user.role === 'admin' || (user.role === 'student' && s.email === user.email))) && React.createElement(
                        "button",
                        {
                          onClick: () => {
                          setEditingId(s.id); 
                          setFirstName(s.first_name); 
                          setLastName(s.last_name); 
                            setDateOfBirth(s.date_of_birth ?? "");
                          setAge(s.age ?? ""); 
                          setGender(s.gender ?? ""); 
                          setEmail(s.email ?? ""); 
                          setDepartmentId(s.department_id ?? ""); 
                          setCourseId(s.course_id ?? "");
                            setShowForm(true);
                            setOpenActionMenuId(null);
                          if (s.department_id) {
                            fetchCoursesByDepartmentForForm(s.department_id);
                          }
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
                      "Edit"
                    ),
                      // Reset Password button - Only admin
                      (user && user.role === 'admin') && React.createElement(
                        "button",
                        {
                          onClick: () => {
                            handleResetPassword(s.id, s.email);
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
                        "Reset Password"
                      ),
                      // Archive button - Only admin
                    (user && user.role === 'admin') && React.createElement(
                      "button",
                        {
                          onClick: () => {
                            handleDelete(s.id);
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
                        "Archive"
                      )
                    )
                  )
                ))
              ) : (
                  React.createElement("tr", null, React.createElement("td", { colSpan: user && (user.role === 'admin' || user.role === 'student') ? 10 : 9, style: { textAlign: 'center', padding: '20px' } }, searchTerm.trim() ? `No students found matching "${searchTerm}"` : "No students found."))
                );
              })()
            )
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
              setSelectedStudentProfile(null);
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
            React.createElement('h2', { style: { margin: 0, color: '#1a1a1a', fontWeight: '700' } }, 'Student Profile'),
            React.createElement(
              'button',
              {
                onClick: () => {
                  setShowProfileModal(false);
                  setSelectedStudentProfile(null);
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
            ) : selectedStudentProfile ? (
              React.createElement(React.Fragment, null,
                // Personal Information
                React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Personal Information'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                  renderProfileField('Name', `${selectedStudentProfile.first_name || ''} ${selectedStudentProfile.middle_name || ''} ${selectedStudentProfile.last_name || ''}`.trim() || 'Not set'),
                  renderProfileField('Email', selectedStudentProfile.email || 'Not set'),
                  renderProfileField('Age', selectedStudentProfile.age),
                  renderProfileField('Gender', selectedStudentProfile.gender),
                  renderProfileField('Date of Birth', selectedStudentProfile.date_of_birth ? new Date(selectedStudentProfile.date_of_birth).toLocaleDateString() : null),
                  renderProfileField('Place of Birth', selectedStudentProfile.place_of_birth),
                  renderProfileField('Blood Type', selectedStudentProfile.blood_type),
                  renderProfileField('Height', selectedStudentProfile.height),
                  renderProfileField('Civil Status', selectedStudentProfile.civil_status),
                  renderProfileField('Religion', selectedStudentProfile.religion),
                  renderProfileField('Citizenship', selectedStudentProfile.citizenship),
                  renderProfileField('Language Spoken', selectedStudentProfile.language_spoken)
                  )
                ),
                // Address Information
                (selectedStudentProfile.house_street_barangay || selectedStudentProfile.region || selectedStudentProfile.province || selectedStudentProfile.municipality) && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Address Information'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                  renderProfileField('House/Street/Barangay', selectedStudentProfile.house_street_barangay),
                  renderProfileField('Region', selectedStudentProfile.region),
                  renderProfileField('Province', selectedStudentProfile.province),
                  renderProfileField('Municipality', selectedStudentProfile.municipality)
                  )
                ),
                // Contact Information
                (selectedStudentProfile.contact_number_phone || selectedStudentProfile.mobile_number) && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Contact Information'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                  renderProfileField('Contact Number (Phone)', selectedStudentProfile.contact_number_phone),
                  renderProfileField('Mobile Number', selectedStudentProfile.mobile_number)
                  )
                ),
                // Academic Information
                React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Academic Information'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                  renderProfileField('Department', selectedStudentProfile.department_id ? (departments.find(d => d.id === selectedStudentProfile.department_id)?.name || departments.find(d => d.id === selectedStudentProfile.department_id)?.code || `ID: ${selectedStudentProfile.department_id}`) : 'Not set'),
                  renderProfileField('Course', selectedStudentProfile.course_id ? (courses.find(c => c.id === selectedStudentProfile.course_id)?.name || `ID: ${selectedStudentProfile.course_id}`) : 'Not set'),
                  renderProfileField('Intended Degree Program', selectedStudentProfile.intended_degree_program),
                  renderProfileField('Is Working Student', selectedStudentProfile.is_working_student ? 'Yes' : (selectedStudentProfile.is_working_student === false ? 'No' : null)),
                  selectedStudentProfile.is_working_student && renderProfileField('Employer Name', selectedStudentProfile.employer_name),
                  selectedStudentProfile.is_working_student && renderProfileField('Employer Address', selectedStudentProfile.employer_address)
                  )
                ),
                // Educational Background
                (selectedStudentProfile.elementary_school_name || selectedStudentProfile.junior_high_school_name || selectedStudentProfile.senior_high_school_name || selectedStudentProfile.college_school_name) && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Educational Background'),
                  selectedStudentProfile.elementary_school_name && React.createElement('div', { style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('strong', { style: { display: 'block', marginBottom: '12px', color: '#667eea', fontSize: '16px', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid #ddd' } }, 'Elementary:'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('School Name', selectedStudentProfile.elementary_school_name),
                      renderProfileField('Address', selectedStudentProfile.elementary_school_address),
                      renderProfileField('Year Graduated', selectedStudentProfile.elementary_year_graduated),
                      renderProfileField('School Type', selectedStudentProfile.elementary_school_type)
                    )
                  ),
                  selectedStudentProfile.junior_high_school_name && React.createElement('div', { style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('strong', { style: { display: 'block', marginBottom: '12px', color: '#667eea', fontSize: '16px', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid #ddd' } }, 'Junior High School:'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('School Name', selectedStudentProfile.junior_high_school_name),
                      renderProfileField('Address', selectedStudentProfile.junior_high_school_address),
                      renderProfileField('Year Graduated', selectedStudentProfile.junior_high_year_graduated),
                      renderProfileField('School Type', selectedStudentProfile.junior_high_school_type)
                    )
                  ),
                  selectedStudentProfile.senior_high_school_name && React.createElement('div', { style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('strong', { style: { display: 'block', marginBottom: '12px', color: '#667eea', fontSize: '16px', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid #ddd' } }, 'Senior High School:'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('School Name', selectedStudentProfile.senior_high_school_name),
                      renderProfileField('Address', selectedStudentProfile.senior_high_school_address),
                      renderProfileField('Year Graduated', selectedStudentProfile.senior_high_year_graduated),
                      renderProfileField('School Type', selectedStudentProfile.senior_high_school_type)
                    )
                  ),
                  selectedStudentProfile.college_school_name && React.createElement('div', { style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('strong', { style: { display: 'block', marginBottom: '12px', color: '#667eea', fontSize: '16px', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid #ddd' } }, 'College:'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('School Name', selectedStudentProfile.college_school_name),
                      renderProfileField('Address', selectedStudentProfile.college_school_address),
                      renderProfileField('Year Graduated', selectedStudentProfile.college_year_graduated),
                      renderProfileField('School Type', selectedStudentProfile.college_school_type)
                    )
                  )
                ),
                // Family Background
                (selectedStudentProfile.mother_family_name || selectedStudentProfile.father_family_name || selectedStudentProfile.number_of_brothers || selectedStudentProfile.number_of_sisters) && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Family Background'),
                  selectedStudentProfile.mother_family_name && React.createElement('div', { style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('strong', { style: { display: 'block', marginBottom: '12px', color: '#667eea', fontSize: '16px', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid #ddd' } }, 'Mother:'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('Name', `${selectedStudentProfile.mother_family_name || ''} ${selectedStudentProfile.mother_given_name || ''} ${selectedStudentProfile.mother_middle_name || ''}`.trim()),
                      renderProfileField('Occupation', selectedStudentProfile.mother_occupation),
                      renderProfileField('Address', selectedStudentProfile.mother_home_address),
                      renderProfileField('Town/City', selectedStudentProfile.mother_town_city),
                      renderProfileField('Province', selectedStudentProfile.mother_province),
                      renderProfileField('Contact Number', selectedStudentProfile.mother_contact_number),
                      renderProfileField('Mobile Number', selectedStudentProfile.mother_mobile_number)
                    )
                  ),
                  selectedStudentProfile.father_family_name && React.createElement('div', { style: { marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('strong', { style: { display: 'block', marginBottom: '12px', color: '#667eea', fontSize: '16px', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid #ddd' } }, 'Father:'),
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('Name', `${selectedStudentProfile.father_family_name || ''} ${selectedStudentProfile.father_given_name || ''} ${selectedStudentProfile.father_middle_name || ''}`.trim()),
                      renderProfileField('Occupation', selectedStudentProfile.father_occupation),
                      renderProfileField('Address', selectedStudentProfile.father_home_address),
                      renderProfileField('Town/City', selectedStudentProfile.father_town_city),
                      renderProfileField('Province', selectedStudentProfile.father_province),
                      renderProfileField('Contact Number', selectedStudentProfile.father_contact_number),
                      renderProfileField('Mobile Number', selectedStudentProfile.father_mobile_number)
                    )
                  ),
                  (selectedStudentProfile.number_of_brothers || selectedStudentProfile.number_of_sisters) && React.createElement('div', { style: { padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' } },
                    React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '6px', overflow: 'hidden' } },
                      renderProfileField('Number of Brothers', selectedStudentProfile.number_of_brothers),
                      renderProfileField('Number of Sisters', selectedStudentProfile.number_of_sisters)
                    )
                  )
                ),
                // Guardian Information
                selectedStudentProfile.guardian_family_name && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Guardian Information'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                    renderProfileField('Name', `${selectedStudentProfile.guardian_family_name || ''} ${selectedStudentProfile.guardian_given_name || ''} ${selectedStudentProfile.guardian_middle_name || ''}`.trim()),
                    renderProfileField('Relationship', selectedStudentProfile.guardian_relationship),
                    renderProfileField('Address', selectedStudentProfile.guardian_home_address),
                    renderProfileField('Contact Number', selectedStudentProfile.guardian_contact_number),
                    renderProfileField('Mobile Number', selectedStudentProfile.guardian_mobile_number)
                  )
                ),
                // Emergency Contact
                selectedStudentProfile.emergency_contact_name && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Emergency Contact'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                    renderProfileField('Name', selectedStudentProfile.emergency_contact_name),
                    renderProfileField('Contact Number', selectedStudentProfile.emergency_contact_number)
                  )
                ),
                // Additional Information
                (selectedStudentProfile.is_indigenous_peoples_member || selectedStudentProfile.has_disability || selectedStudentProfile.is_single_parent_dependent || selectedStudentProfile.has_special_needs) && React.createElement('div', { style: { marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' } },
                  React.createElement('h3', { style: { marginBottom: '20px', color: '#1a1a1a', fontSize: '20px', fontWeight: '700', paddingBottom: '10px', borderBottom: '2px solid #667eea' } }, 'Additional Information'),
                  React.createElement('div', { style: { backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' } },
                    renderProfileField('Indigenous Peoples Member', selectedStudentProfile.is_indigenous_peoples_member ? 'Yes' : (selectedStudentProfile.is_indigenous_peoples_member === false ? 'No' : null)),
                    selectedStudentProfile.is_indigenous_peoples_member && renderProfileField('Indigenous Tribe', selectedStudentProfile.indigenous_tribe),
                    renderProfileField('Has Disability', selectedStudentProfile.has_disability ? 'Yes' : (selectedStudentProfile.has_disability === false ? 'No' : null)),
                    selectedStudentProfile.has_disability && renderProfileField('Disability Specification', selectedStudentProfile.disability_specification),
                    renderProfileField('Single Parent Dependent', selectedStudentProfile.is_single_parent_dependent ? 'Yes' : (selectedStudentProfile.is_single_parent_dependent === false ? 'No' : null)),
                    renderProfileField('Has Special Needs', selectedStudentProfile.has_special_needs ? 'Yes' : (selectedStudentProfile.has_special_needs === false ? 'No' : null)),
                    selectedStudentProfile.has_special_needs && renderProfileField('Special Needs Specification', selectedStudentProfile.special_needs_specification)
                  )
                ),
                // Close button
                React.createElement('div', { style: { marginTop: '20px', textAlign: 'center' } },
                  React.createElement(
                    'button',
                    {
                      onClick: () => {
                        setShowProfileModal(false);
                        setSelectedStudentProfile(null);
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
  );

  if (embed) {
    return React.createElement('div', { className: 'content' }, content);
  }

  // fallback: original full layout
  return React.createElement(
    "div",
    { className: "dashboard" },
    React.createElement(
      "aside",
      { className: "sidebar" },
      React.createElement("h2", null, "FSUU Admin"),
      React.createElement(
        "nav",
        null,
        ["Dashboard", "Students", "Faculty", "Courses", "Attendance", "Departments", "Settings"].map((item) =>
          React.createElement("a", { key: item, href: "#" }, item)
        )
      )
    ),
    React.createElement(
      "div",
      { className: "main" },
      React.createElement(
        "header",
        { className: "topbar" },
        React.createElement("h1", null, "Student and Faculty Profile Management System"),
        React.createElement("div", { className: "profile" }, React.createElement("img", { src: "/profile.png", alt: "profile" }))
      ),
      React.createElement(
        "section",
        { className: "content" },
        content
      )
    )
  );
}


