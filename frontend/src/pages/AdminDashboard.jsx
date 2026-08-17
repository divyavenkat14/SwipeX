import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    companies: 0,
    applications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/auth/admin/dashboard/");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    {
      title: "Users",
      value: stats.users,
    },
    {
      title: "Jobs",
      value: stats.jobs,
    },
    {
      title: "Companies",
      value: stats.companies,
    },
    {
      title: "Applications",
      value: stats.applications,
    },
  ];

  return (
    <AdminLayout>
      <h1
        style={{
          color: "white",
          marginBottom: "35px",
          fontSize: "40px",
        }}
      >
        Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "25px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#111827",
              padding: "30px",
              borderRadius: "18px",
              color: "white",
              border: "1px solid #1E293B",
            }}
          >
            <h2
              style={{
                fontSize: "45px",
                marginBottom: "15px",
              }}
            >
              {card.value}
            </h2>

            <p
              style={{
                color: "#94A3B8",
                fontSize: "18px",
              }}
            >
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;