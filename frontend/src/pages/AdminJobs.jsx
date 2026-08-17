import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/auth/admin/jobs/");
    setJobs(res.data);
  };

  return (
    <AdminLayout>
      <h1 style={{ color: "white", marginBottom: "30px" }}>
        Jobs
      </h1>

      <table
        style={{
          width: "100%",
          background: "#111827",
          color: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#1E293B" }}>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Experience</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>{job.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminJobs;