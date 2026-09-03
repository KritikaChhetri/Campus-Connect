import { Link } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import Button from "../../components/ui/Button";

function NotFound() {
  return (
    <div className="page-container">
      <title>Page Not Found - Campus Connect</title>

      <PageTitle
        title="404 - Page Not Found"
        description="Sorry, the page you are looking for does not exist."
      />

      <Link to="/">
        <Button text="Go Back Home" />
      </Link>
    </div>
  );
}

export default NotFound;