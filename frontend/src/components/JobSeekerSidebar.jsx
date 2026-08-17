import { NavLink } from "react-router-dom";

function JobSeekerSidebar() {
  const menu = [
    {
      name: "Dashboard",
      path: "/job-seeker/dashboard",
    },
    {
      name: "Browse Jobs",
      path: "/job-seeker/dashboard",
    },
    {
      name: "Applications",
      path: "/job-seeker/applications",
    },
    {
      name: "Companies",
      path: "/job-seeker/companies",
    },
    {
      name: "Resume",
      path: "/job-seeker/resume",
    },
    {
      name: "Analytics",
      path: "/job-seeker/analytics",
    },
    {
      name: "Profile",
      path: "/job-seeker/profile",
    },
    {
      name: "Logout",
      path: "/login",
    },
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
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginBottom: "50px",
          fontSize: "34px",
          fontWeight: "700",
        }}
      >
        ⚡ SwipeX
      </h2>

      {menu.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => ({
            display: "block",
            textDecoration: "none",
            color: "white",
            padding: "14px 18px",
            marginBottom: "12px",
            borderRadius: "12px",
            background: isActive ? "#2563EB" : "transparent",
            transition: "0.3s",
            fontWeight: "500",
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}

export default JobSeekerSidebar;