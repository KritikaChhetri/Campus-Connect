import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Login() {
  return (
    <div>
      <title>Login - Campus Connect</title>

      <PageTitle title="Login" />

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
  );
}

export default Login;