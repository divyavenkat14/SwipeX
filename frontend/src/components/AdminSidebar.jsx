import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Companies", path: "/admin/companies" },
    { name: "Jobs", path: "/admin/jobs" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Logout", path: "/login" },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0F172A",
        color: "white",
        padding: "30px 20px",
        borderRight: "1px solid #1E293B",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>⚡ SwipeX</h2>

      {menu.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => ({
            display: "block",
            textDecoration: "none",
            color: "white",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "10px",
            background: isActive ? "#2563EB" : "transparent",
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}

export default AdminSidebar;