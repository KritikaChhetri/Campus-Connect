import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function MainLayout() {
  return (
    <div>
      <Navbar />

      <main>
        <h1>Welcome to Campus Connect</h1>
        <p>
          A University Management System for students, faculty, and administrators.
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;