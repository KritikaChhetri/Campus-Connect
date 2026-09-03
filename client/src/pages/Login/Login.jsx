import { useState } from "react";

import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function Login() {
  const [userName, setUserName] = useState("");

  return (
    <div className="login-page">
      <title>Login - Campus Connect</title>

      <PageTitle
        title="Login"
        description="Enter your account details to access Campus Connect."
      />

      <div className="login-card-container">
        <Card
          title="Login to Campus Connect"
          description="Enter your name below."
        >
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          {userName ? (
            <p>Welcome, {userName}</p>
          ) : (
            <p>Please enter your name</p>
          )}

          <Button
            text="Login"
            onClick={() => alert(`Welcome ${userName}`)}
          />
        </Card>
      </div>
    </div>
  );
}

export default Login;