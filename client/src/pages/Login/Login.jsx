import { useState } from "react";
import { Link } from "react-router-dom";

import { loginUser } from "../../services/authService";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess(
        `${result.message} Persistent sign-in will be added in a later sprint.`
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="auth-eyebrow">Campus Connect</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="auth-description">Sign in with your account details.</p>

        {error && (
          <p className="auth-feedback auth-feedback--error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="auth-feedback auth-feedback--success" role="status">
            {success}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              autoComplete="email"
              id="login-email"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              autoComplete="current-password"
              id="login-password"
              maxLength={72}
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={formData.password}
            />
          </div>

          <button className="auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
