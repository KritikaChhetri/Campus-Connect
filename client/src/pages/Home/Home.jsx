import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Home() {
  return (
    <div>
      <title>Home - Campus Connect</title>

      <PageTitle title="Home" />

      <Card
        title="Welcome to Campus Connect"
        description="A University Management System for students, faculty, and administrators."
      >
        <Button
          text="Get Started"
          onClick={() => alert("Welcome to Campus Connect")}
        />
      </Card>
    </div>
  );
}

export default Home;