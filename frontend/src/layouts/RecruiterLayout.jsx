import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function RecruiterLayout({ children }) {
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
        <TopNavbar />

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

export default RecruiterLayout;