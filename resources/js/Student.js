import React, { useState, useEffect } from "react";
import axios from "axios";
import "../sass/Student.scss";

export default function Student({ embed = false, onDataChange = () => {} }) {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchStudents();
    fetchDepartments();
    fetchCourses();
  }, []);

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
        await axios.put(`/api/students/${editingId}`, { first_name: firstName, last_name: lastName, age: age === "" ? null : Number(age), gender: gender || null, email: email, department_id: departmentId || null, course_id: courseId || null });
        setMessage("Student updated");
      } else {
        const response = await axios.post("/api/students", { first_name: firstName, last_name: lastName, age: age === "" ? null : Number(age), gender: gender || null, email: email, department_id: departmentId || null, course_id: courseId || null });
        // Use message from server if available, otherwise use default
        setMessage(response.data?.message || "Student added and account created successfully. Default password: 123456");
      }
      setFirstName("");
      setLastName("");
      setAge("");
      setGender("");
      setEmail("");
      setDepartmentId("");
      setCourseId("");
      setEditingId(null);
      await fetchStudents();
    } catch (err) {
      console.error(err);
      const apiMsg = err?.response?.data?.message || Object.values(err?.response?.data || {})?.[0] || err.message;
      setError(typeof apiMsg === "string" ? apiMsg : "Request failed");
    }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
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
          { className: "card-header" },
          React.createElement("h2", null, "Students"),
        ),
        // Form - only show for admin
        (user && user.role === 'admin') && React.createElement(
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
            type: "number",
            placeholder: "Age",
            value: age,
            onChange: (e) => setAge(e.target.value),
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
            editingId && React.createElement(
              "button",
              { type: "button", className: "cancel-btn", onClick: () => { setFirstName(""); setLastName(""); setAge(""); setGender(""); setEmail(""); setDepartmentId(""); setCourseId(""); setEditingId(null); setError(""); setMessage(""); } },
              "Cancel"
            )
          )
        ),
        // Filters - only show for admin and faculty
        (user && (user.role === 'admin' || user.role === 'faculty')) && React.createElement(
          "div",
          { className: "filters", style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' } },
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
            "table",
            null,
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                ["ID", "First Name", "Last Name", "Age", "Gender", "Email", "Department Code", "Course Code", "Created At", user && (user.role === 'admin' || user.role === 'student') ? "Actions" : ""].filter(h => h).map((h) => React.createElement("th", { key: h }, h))
              )
            ),
            React.createElement(
              "tbody",
              null,
              students.length > 0 ? (
                students.map((s) => React.createElement(
                  "tr",
                  { key: s.id },
                  React.createElement("td", null, s.id),
                  React.createElement("td", null, s.first_name),
                  React.createElement("td", null, s.last_name),
                  React.createElement("td", null, s.age ?? ""),
                  React.createElement("td", null, s.gender ?? ""),
                  React.createElement("td", null, s.email ?? ""),
                  React.createElement("td", null, s.department_id ? (departments.find(d => d.id === s.department_id)?.code || s.department_id) : ""),
                  React.createElement("td", null, s.course_id ? (courses.find(c => c.id === s.course_id)?.name || s.course_id) : ""),
                  React.createElement("td", null, new Date(s.created_at).toLocaleString()),
                  // Only show Actions column for admin and students (not faculty)
                  (user && (user.role === 'admin' || user.role === 'student')) && React.createElement(
                    "td",
                    null,
                    // Students can only edit their own profile, admin can edit any
                    (user && (user.role === 'admin' || (user.role === 'student' && s.email === user.email))) && React.createElement(
                      "button",
                      { onClick: () => { 
                          setEditingId(s.id); 
                          setFirstName(s.first_name); 
                          setLastName(s.last_name); 
                          setAge(s.age ?? ""); 
                          setGender(s.gender ?? ""); 
                          setEmail(s.email ?? ""); 
                          setDepartmentId(s.department_id ?? ""); 
                          setCourseId(s.course_id ?? "");
                          // Fetch courses for the department if one is set
                          if (s.department_id) {
                            fetchCoursesByDepartmentForForm(s.department_id);
                          }
                        } },
                      "Edit"
                    ),
                    // Only admin can delete
                    (user && user.role === 'admin') && React.createElement(
                      "button",
                      { className: "delete-btn", onClick: () => handleDelete(s.id) },
                      "Delete"
                    )
                  )
                ))
              ) : (
                React.createElement("tr", null, React.createElement("td", { colSpan: user && (user.role === 'admin' || user.role === 'student') ? 10 : 9 }, "No students found."))
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


