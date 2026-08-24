import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Dashboard() {
  return (
    <div>
      <title>Dashboard - Campus Connect</title>

      <PageTitle title="Dashboard" />

      <Card
        title="Dashboard Overview"
        description="View and manage university activities from the dashboard."
      >
        <Button
          text="View Details"
          onClick={() => alert("Dashboard details will be available soon")}
        />
      </Card>
    </div>
  );
}

export default Dashboard;