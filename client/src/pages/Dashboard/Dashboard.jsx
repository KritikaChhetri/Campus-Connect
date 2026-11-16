import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getStudents } from "../../services/studentService";

function Dashboard() {
  const [studentCount, setStudentCount] = useState(null);
  const [studentCountError, setStudentCountError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    getStudents({ signal: controller.signal })
      .then((result) => setStudentCount(result.data.length))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setStudentCountError(error.message);
        }
      });

    return () => controller.abort();
  }, []);

  // Announcements list
  const announcements = [
    "Semester examination schedule released",
    "New course registration is open",
    "Assignment submission deadline updated",
  ];

  const handleAddStudent = () => {
    navigate("/student-registration");
  };

  // View Courses button
  const handleViewCourses = () => {
    alert("Opening Courses");
  };

  // View Assignments button
  const handleViewAssignments = () => {
    alert("Opening Assignments");
  };

  return (
    <div className="page-container">
      <title>Dashboard - Campus Connect</title>

      <PageTitle
        title="Dashboard"
        description="Manage students, courses, assignments, and academic information."
      />

      <div className="card-grid">
        {/* Students Card */}
        <Card
          title="Students"
          description="View and manage student information."
        >
          <p>
            {studentCount === null
              ? "Loading student count..."
              : `Student Count: ${studentCount}`}
          </p>
          {studentCountError && (
            <p className="error-message" role="alert">
              {studentCountError}
            </p>
          )}

          <Button
            text="Add Student"
            onClick={handleAddStudent}
          />
        </Card>

        {/* Courses Card */}
        <Card
          title="Courses"
          description="View and manage available courses."
        >
          <Button
            text="View Courses"
            onClick={handleViewCourses}
          />
        </Card>

        {/* Assignments Card */}
        <Card
          title="Assignments"
          description="View assignments and submission details."
        >
          <Button
            text="View Assignments"
            onClick={handleViewAssignments}
          />
        </Card>
      </div>

      {/* Announcements */}
      <div className="announcement-section">
        <h2>Announcements</h2>

        <ul>
          {announcements.map((announcement, index) => (
            <li key={index}>{announcement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;