import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Profile() {
  return (
    <div className="page-container">
      <title>Profile - Campus Connect</title>

      <PageTitle title="Profile" />

      <div className="card-grid">
        <Card
          title="My Profile"
          description="View and manage your Campus Connect profile information."
        >
          <Button
            text="Edit Profile"
            onClick={() => alert("Profile editing will be available soon")}
          />
        </Card>

        <Card
          title="Personal Information"
          description="Manage your basic personal and academic details."
        />

        <Card
          title="Account Settings"
          description="Update your account preferences and information."
        />
      </div>
    </div>
  );
}

export default Profile;