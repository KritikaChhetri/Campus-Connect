import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";

function Profile() {
  const student = {
    name: "Kritika Chhetri",
    rollNo: "006",
    course: "BCA",
  };

  return (
    <div className="profile-page">
      <title>Profile - Campus Connect</title>

      <PageTitle
        title="Profile"
        description="View your personal and academic information."
      />

      <div className="profile-card-container">
        <Card
          title="Personal Information"
          description="Basic student details."
        >
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {student.name}
            </p>

            <p>
              <strong>Roll no:</strong> {student.rollNo}
            </p>

            <p>
              <strong>Course:</strong> {student.course}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;