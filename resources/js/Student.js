import React, { useState, useEffect } from "react";
import axios from "axios";
import "../sass/Student.scss";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!firstName || !lastName) {
      setError("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`/api/students/${editingId}`, { first_name: firstName, last_name: lastName });
        setMessage("Student updated");
      } else {
        await axios.post("/api/students", { first_name: firstName, last_name: lastName });
        setMessage("Student added");
      }
      setFirstName("");
      setLastName("");
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

  return React.createElement(
    "div",
    { className: "dashboard" },

    // Sidebar
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

    // Main section
    React.createElement(
      "div",
      { className: "main" },

      // Topbar
      React.createElement(
        "header",
        { className: "topbar" },
        React.createElement("h1", null, "Student and Faculty Profile Management System"),
        React.createElement("div", { className: "profile" },
          React.createElement("img", { src: "/profile.png", alt: "profile" })
        )
      ),

      // Content
      React.createElement(
        "section",
        { className: "content" },
        React.createElement(
          "div",
          { className: "card" },

          // Card header
          React.createElement(
            "div",
            { className: "card-header" },
            React.createElement("h2", null, "Students"),
            
          ),

          // Form
          React.createElement(
            "form",
            { className: "post-form", onSubmit: handleSubmit },
            error && React.createElement("div", { style: { background: '#ffdddd', color: '#900', padding: '8px', borderRadius: '6px' } }, error),
            message && React.createElement("div", { style: { background: '#ddffdd', color: '#064', padding: '8px', borderRadius: '6px' } }, message),
            React.createElement("input", {
              type: "text",
              placeholder: "First Name",
              value: firstName,
              onChange: (e) => setFirstName(e.target.value),
            }),
            React.createElement("input", {
              type: "text",
              placeholder: "Last Name",
              value: lastName,
              onChange: (e) => setLastName(e.target.value),
            }),
            React.createElement(
              "div",
              { className: "form-actions" },
              React.createElement("button", { type: "submit", disabled: loading }, editingId ? (loading ? "Updating..." : "Update") : (loading ? "Adding..." : "Add Student")),
              editingId &&
                React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "cancel-btn",
                    onClick: () => {
                      setFirstName("");
                      setLastName("");
                      setEditingId(null);
                      setError("");
                      setMessage("");
                    },
                  },
                  "Cancel"
                )
            )
          ),

          // Table
          loading
            ? React.createElement("p", null, "Loading…")
            : React.createElement(
                "table",
                null,
                React.createElement(
                  "thead",
                  null,
                  React.createElement(
                    "tr",
                    null,
                    ["ID", "First Name", "Last Name", "Created At", "Actions"].map((h) =>
                      React.createElement("th", { key: h }, h)
                    )
                  )
                ),
                React.createElement(
                  "tbody",
                  null,
                  students.length > 0
                    ? students.map((s) =>
                        React.createElement(
                          "tr",
                          { key: s.id },
                          React.createElement("td", null, s.id),
                          React.createElement("td", null, s.first_name),
                          React.createElement("td", null, s.last_name),
                          React.createElement("td", null, new Date(s.created_at).toLocaleString()),
                          React.createElement(
                            "td",
                            null,
                            React.createElement(
                              "button",
                              {
                                onClick: () => {
                                  setEditingId(s.id);
                                  setFirstName(s.first_name);
                                  setLastName(s.last_name);
                                },
                              },
                              "Edit"
                            ),
                            React.createElement(
                              "button",
                              {
                                className: "delete-btn",
                                onClick: () => handleDelete(s.id),
                              },
                              "Delete"
                            )
                          )
                        )
                      )
                    : React.createElement(
                        "tr",
                        null,
                        React.createElement("td", { colSpan: 5 }, "No students found.")
                      )
                )
              )
        )
      )
    )
  );
}


