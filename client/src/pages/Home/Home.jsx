import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Home() {
  const handleGetStarted = () => {
    alert("Welcome to Campus Connect");
  };

  const handleEasyAccess = () => {
    alert("Explore Campus Connect");
  };

  const handleStayConnected = () => {
    alert("Stay Connected with Campus Connect");
  };

  return (
    <div className="page-container">
      <title>Home - Campus Connect</title>

      <PageTitle
        title="Home"
        description="Welcome to Campus Connect University Management System."
      />

      <div className="card-grid">
        <Card
          title="Welcome to Campus Connect"
          description="A University Management System for students, faculty, and administrators."
        >
          <Button
            text="Get Started"
            onClick={handleGetStarted}
          />
        </Card>

        <Card
          title="Easy Access"
          description="Access academic information, courses, assignments, and announcements easily."
        >
          <Button
            text="Get Started"
            onClick={handleEasyAccess}
          />
        </Card>

        <Card
          title="Stay Connected"
          description="Keep students, faculty, and administrators connected in one platform."
        >
          <Button
            text="Get Started"
            onClick={handleStayConnected}
          />
        </Card>
      </div>
    </div>
  );
}

export default Home;