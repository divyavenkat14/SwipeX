import { NavLink } from "react-router-dom";

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/recruiter/dashboard" },
    { name: "My Jobs", path: "#" },
    { name: "Post Job", path: "/recruiter/post-job" },
    { name: "Applicants", path: "/recruiter/applicants" },
    { name: "Company", path: "/recruiter/company" },
    { name: "Analytics", path: "/recruiter/analytics" },
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
      <h2
        style={{
          marginBottom: "50px",
          fontSize: "38px",
          fontWeight: "700",
        }}
      >
        ⚡ SwipeX
      </h2>

      {menu.map((item) => {
        if (item.name === "My Jobs") {
          return (
            <div
              key={item.name}
              onClick={() => {
                const section = document.getElementById("my-jobs");
                section?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              style={{
                padding: "14px 18px",
                marginBottom: "12px",
                borderRadius: "12px",
                cursor: "pointer",
                color: "white",
              }}
            >
              {item.name}
            </div>
          );
        }

        return (
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
        );
      })}
    </div>
  );
}

export default Sidebar;