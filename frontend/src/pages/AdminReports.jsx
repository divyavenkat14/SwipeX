import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminReports() {
  const [report, setReport] = useState({});

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get("/auth/admin/reports/");
      setReport(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    { title: "Total Users", value: report.users },
    { title: "Recruiters", value: report.recruiters },
    { title: "Job Seekers", value: report.job_seekers },
    { title: "Companies", value: report.companies },
    { title: "Jobs", value: report.jobs },
    { title: "Applications", value: report.applications },
  ];

  return (
    <AdminLayout>
      <h1 style={{ color: "white", marginBottom: "30px" }}>
        Reports
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#111827",
              padding: "25px",
              borderRadius: "15px",
              color: "white",
            }}
          >
            <h2 style={{ fontSize: "42px" }}>{card.value ?? 0}</h2>
            <p>{card.title}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminReports;