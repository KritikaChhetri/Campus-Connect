import { useState } from "react";

import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Dashboard() {
  // State for student count
  const [studentCount, setStudentCount] = useState(0);

  // Announcements list
  const announcements = [
    "Semester examination schedule released",
    "New course registration is open",
    "Assignment submission deadline updated",
  ];

  // Add Student button
  const handleAddStudent = () => {
    setStudentCount(studentCount + 1);
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
          <p>Student Count: {studentCount}</p>

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