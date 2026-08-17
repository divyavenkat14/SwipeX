import AdminSidebar from "../components/AdminSidebar";
import TopNavbar from "../components/TopNavbar";

function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      <AdminSidebar />

      <div style={{ flex: 1 }}>
        <TopNavbar title="Admin Portal" />

        <div style={{ padding: "30px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;