import Sidebar from "../components/JobSeekerSidebar";
import TopNavbar from "../components/TopNavbar";

function JobSeekerLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
        }}
      >
        <TopNavbar title="Job Seeker Portal" />

        <div
          style={{
            padding: "30px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default JobSeekerLayout;