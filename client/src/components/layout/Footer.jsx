function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>
        © {currentYear} Campus Connect - University Management System
      </p>
    </footer>
  );
}

export default Footer;