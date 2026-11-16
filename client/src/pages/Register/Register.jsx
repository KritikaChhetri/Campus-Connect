import { useState } from "react";
import { Link } from "react-router-dom";

import { registerUser } from "../../services/authService";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const [formData, setFormData] = useState(emptyForm);
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
    setError("");
    setSuccess("");

    if (formData.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (new TextEncoder().encode(formData.password).length > 72) {
      setError("Password cannot exceed 72 UTF-8 bytes.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess(result.message);
      setFormData(emptyForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="auth-eyebrow">Campus Connect</p>
        <h1 id="register-title">Create your account</h1>
        <p className="auth-description">
          Register with your name, email, and a secure password.
        </p>

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
            <label htmlFor="register-name">Name</label>
            <input
              autoComplete="name"
              id="register-name"
              maxLength={100}
              minLength={2}
              name="name"
              onChange={handleChange}
              required
              value={formData.name}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              autoComplete="email"
              id="register-email"
              maxLength={254}
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              autoComplete="new-password"
              id="register-password"
              maxLength={72}
              minLength={8}
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={formData.password}
            />
            <small>Use at least 8 characters.</small>
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
              autoComplete="new-password"
              id="register-confirm-password"
              maxLength={72}
              minLength={8}
              name="confirmPassword"
              onChange={handleChange}
              required
              type="password"
              value={formData.confirmPassword}
            />
          </div>

          <button className="auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
