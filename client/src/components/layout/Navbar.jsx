import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
  });

  return (
    <nav>
      <h2>Campus Connect</h2>

      <div className="nav-links">
        <NavLink to="/" style={linkStyle}>
          Home
        </NavLink>

        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/profile" style={linkStyle}>
          Profile
        </NavLink>

        <NavLink to="/login" style={linkStyle}>
          Login
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;