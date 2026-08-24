import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function NotFound() {
  return (
    <div>
      <title>Page Not Found - Campus Connect</title>

      <PageTitle title="404 - Page Not Found" />

      <Card
        title="Oops! Page Not Found"
        description="The requested page could not be found."
      >
        <Button
          text="Go Back"
          onClick={() => window.history.back()}
        />
      </Card>
    </div>
  );
}

export default NotFound;