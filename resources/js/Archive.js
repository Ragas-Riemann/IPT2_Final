import React, { useState, useEffect } from "react";
import axios from "axios";
import "../sass/Student.scss";

export default function Archive({ embed = false }) {
  const [archivedStudents, setArchivedStudents] = useState([]);
  const [archivedFaculty, setArchivedFaculty] = useState([]);
  const [activeTab, setActiveTab] = useState("students");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [errorStudents, setErrorStudents] = useState("");
  const [errorFaculty, setErrorFaculty] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [restoringStudentId, setRestoringStudentId] = useState(null);
  const [restoringFacultyId, setRestoringFacultyId] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchDepartments();
    fetchCourses();
    fetchArchivedStudents();
    fetchArchivedFaculty();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      setUser(res.data);
    } catch (e) {
      console.error('Failed to fetch user', e);
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

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (e) {
      console.error('Failed to fetch courses', e);
    }
  };

  const fetchArchivedStudents = async () => {
    setLoadingStudents(true);
    setErrorStudents("");
    try {
      const res = await axios.get("/api/archive/students");
      setArchivedStudents(res.data || []);
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to fetch archived students";
      setErrorStudents(errorMsg);
      console.error('Error fetching archived students:', e);
      setArchivedStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchArchivedFaculty = async () => {
    setLoadingFaculty(true);
    setErrorFaculty("");
    try {
      const res = await axios.get("/api/archive/faculty");
      setArchivedFaculty(res.data || []);
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to fetch archived faculty";
      setErrorFaculty(errorMsg);
      console.error('Error fetching archived faculty:', e);
      setArchivedFaculty([]);
    } finally {
      setLoadingFaculty(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  const handleRestoreStudent = async (id) => {
    if (!window.confirm("Are you sure you want to restore this student? The student will be moved back to the active list.")) return;
    
    setRestoringStudentId(id);
    setMessage("");
    setErrorStudents("");
    
    try {
      const response = await axios.post(`/api/archive/students/${id}/restore`);
      setMessage(response.data?.message || "Student restored successfully");
      // Refresh the archived students list
      await fetchArchivedStudents();
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to restore student";
      setErrorStudents(errorMsg);
      console.error('Error restoring student:', e);
    } finally {
      setRestoringStudentId(null);
    }
  };

  const handleRestoreFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to restore this faculty? The faculty will be moved back to the active list.")) return;
    
    setRestoringFacultyId(id);
    setMessage("");
    setErrorFaculty("");
    
    try {
      const response = await axios.post(`/api/archive/faculty/${id}/restore`);
      setMessage(response.data?.message || "Faculty restored successfully");
      // Refresh the archived faculty list
      await fetchArchivedFaculty();
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to restore faculty";
      setErrorFaculty(errorMsg);
      console.error('Error restoring faculty:', e);
    } finally {
      setRestoringFacultyId(null);
    }
  };

  const content = React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "card" },
      React.createElement(
        "div",
        { className: "card-header" },
        React.createElement("h2", null, "Archive")
      ),
      // Tabs
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            borderBottom: "2px solid #e0e0e0",
          },
        },
        React.createElement(
          "button",
          {
            onClick: () => setActiveTab("students"),
            style: {
              padding: "10px 20px",
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom:
                activeTab === "students" ? "3px solid #667eea" : "3px solid transparent",
              color: activeTab === "students" ? "#667eea" : "#666",
              fontWeight: activeTab === "students" ? "600" : "400",
            },
          },
          `Archived Students (${archivedStudents.length})`
        ),
        React.createElement(
          "button",
          {
            onClick: () => setActiveTab("faculty"),
            style: {
              padding: "10px 20px",
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom:
                activeTab === "faculty" ? "3px solid #667eea" : "3px solid transparent",
              color: activeTab === "faculty" ? "#667eea" : "#666",
              fontWeight: activeTab === "faculty" ? "600" : "400",
            },
          },
          `Archived Faculty (${archivedFaculty.length})`
        )
      ),
      // Success message
      message &&
        React.createElement(
          "div",
          {
            style: {
              background: "#ddffdd",
              color: "#090",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            },
          },
          message,
          React.createElement(
            "button",
            {
              onClick: () => setMessage(""),
              style: {
                float: "right",
                background: "none",
                border: "none",
                color: "#090",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
            "×"
          )
        ),
      // Error messages - show only for active tab
      activeTab === "students" && errorStudents &&
        React.createElement(
          "div",
          {
            style: {
              background: "#ffdddd",
              color: "#900",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            },
          },
          errorStudents
        ),
      activeTab === "faculty" && errorFaculty &&
        React.createElement(
          "div",
          {
            style: {
              background: "#ffdddd",
              color: "#900",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "10px",
            },
          },
          errorFaculty
        ),
      // Archived Students Table
      activeTab === "students" &&
        (loadingStudents ? (
          React.createElement("p", null, "Loading…")
        ) : (
          React.createElement(
            "table",
            null,
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                [
                  "ID",
                  "First Name",
                  "Last Name",
                  "Age",
                  "Gender",
                  "Email",
                  "Department",
                  "Course",
                  "Archived Date",
                  user && user.role === 'admin' ? "Actions" : null,
                ].filter(h => h).map((h) =>
                  React.createElement("th", { key: h }, h)
                )
              )
            ),
            React.createElement(
              "tbody",
              null,
              archivedStudents.length > 0 ? (
                archivedStudents.map((s) =>
                  React.createElement(
                    "tr",
                    { key: s.id },
                    React.createElement("td", null, s.id),
                    React.createElement("td", null, s.first_name),
                    React.createElement("td", null, s.last_name),
                    React.createElement("td", null, s.age ?? ""),
                    React.createElement("td", null, s.gender ?? ""),
                    React.createElement("td", null, s.email ?? ""),
                    React.createElement(
                      "td",
                      null,
                      s.department_id
                        ? departments.find((d) => d.id === s.department_id)?.code ||
                          s.department_id
                        : ""
                    ),
                    React.createElement(
                      "td",
                      null,
                      s.course_id
                        ? courses.find((c) => c.id === s.course_id)?.name || s.course_id
                        : ""
                    ),
                    React.createElement(
                      "td",
                      null,
                      formatDate(s.deleted_at)
                    ),
                    user && user.role === 'admin' && React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "button",
                        {
                          onClick: () => handleRestoreStudent(s.id),
                          disabled: restoringStudentId === s.id,
                          style: {
                            padding: "6px 12px",
                            backgroundColor: "#40b56a",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: restoringStudentId === s.id ? "not-allowed" : "pointer",
                            fontSize: "12px",
                            opacity: restoringStudentId === s.id ? 0.6 : 1,
                          },
                        },
                        restoringStudentId === s.id ? "Restoring..." : "Restore"
                      )
                    )
                  )
                )
              ) : (
                React.createElement(
                  "tr",
                  null,
                  React.createElement(
                    "td",
                    { colSpan: user && user.role === 'admin' ? 10 : 9, style: { textAlign: "center", padding: "20px" } },
                    "No archived students found."
                  )
                )
              )
            )
          )
        )),
      // Archived Faculty Table
      activeTab === "faculty" &&
        (loadingFaculty ? (
          React.createElement("p", null, "Loading…")
        ) : (
          React.createElement(
            "table",
            null,
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                [
                  "ID",
                  "First Name",
                  "Last Name",
                  "Age",
                  "Gender",
                  "Email",
                  "Department",
                  "Archived Date",
                  user && user.role === 'admin' ? "Actions" : null,
                ].filter(h => h).map((h) =>
                  React.createElement("th", { key: h }, h)
                )
              )
            ),
            React.createElement(
              "tbody",
              null,
              archivedFaculty.length > 0 ? (
                archivedFaculty.map((f) =>
                  React.createElement(
                    "tr",
                    { key: f.id },
                    React.createElement("td", null, f.id),
                    React.createElement("td", null, f.first_name),
                    React.createElement("td", null, f.last_name),
                    React.createElement("td", null, f.age ?? ""),
                    React.createElement("td", null, f.gender ?? ""),
                    React.createElement("td", null, f.email ?? ""),
                    React.createElement(
                      "td",
                      null,
                      f.department_id
                        ? departments.find((d) => d.id === f.department_id)?.code ||
                          f.department_id
                        : ""
                    ),
                    React.createElement(
                      "td",
                      null,
                      formatDate(f.deleted_at)
                    ),
                    user && user.role === 'admin' && React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "button",
                        {
                          onClick: () => handleRestoreFaculty(f.id),
                          disabled: restoringFacultyId === f.id,
                          style: {
                            padding: "6px 12px",
                            backgroundColor: "#40b56a",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: restoringFacultyId === f.id ? "not-allowed" : "pointer",
                            fontSize: "12px",
                            opacity: restoringFacultyId === f.id ? 0.6 : 1,
                          },
                        },
                        restoringFacultyId === f.id ? "Restoring..." : "Restore"
                      )
                    )
                  )
                )
              ) : (
                React.createElement(
                  "tr",
                  null,
                  React.createElement(
                    "td",
                    { colSpan: user && user.role === 'admin' ? 9 : 8, style: { textAlign: "center", padding: "20px" } },
                    "No archived faculty found."
                  )
                )
              )
            )
          )
        ))
    )
  );

  return embed ? content : React.createElement("div", { className: "container" }, content);
}

