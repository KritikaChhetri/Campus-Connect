import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Dashboard() {
  return (
    <div>
      <title>Dashboard - Campus Connect</title>

      <PageTitle title="Dashboard" />

      <div className="card-grid">
        <Card
          title="Students"
          description="View and manage student information."
        >
          <Button
            text="View Students"
            onClick={() => alert("Student details will be available soon")}
          />
        </Card>

        <Card
          title="Courses"
          description="View and manage available courses."
        >
          <Button
            text="View Courses"
            onClick={() => alert("Course details will be available soon")}
          />
        </Card>

        <Card
          title="Assignments"
          description="View assignments and submission details."
        >
          <Button
            text="View Assignments"
            onClick={() => alert("Assignment details will be available soon")}
          />
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;