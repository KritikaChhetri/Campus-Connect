import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Profile() {
  return (
    <div>
      <title>Profile - Campus Connect</title>

      <PageTitle title="Profile" />

      <Card
        title="My Profile"
        description="View and manage your Campus Connect profile information."
      >
        <Button
          text="Edit Profile"
          onClick={() => alert("Profile editing will be available soon")}
        />
      </Card>
    </div>
  );
}

export default Profile;