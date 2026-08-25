import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Login() {
  return (
    <div className="page-container">
      <title>Login - Campus Connect</title>

      <PageTitle title="Login" />

      <div className="card-grid">
        <Card
          title="Login to Campus Connect"
          description="Enter your account details to access the application."
        >
          <Button
            text="Login"
            onClick={() => alert("Login functionality will be added later")}
          />
        </Card>
      </div>
    </div>
  );
}

export default Login;