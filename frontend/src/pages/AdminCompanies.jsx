import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await api.get("/auth/admin/companies/");
    setCompanies(res.data);
  };

  return (
    <AdminLayout>
      <h1 style={{ color: "white", marginBottom: 30 }}>
        Companies
      </h1>

      <table
        style={{
          width: "100%",
          color: "white",
          borderCollapse: "collapse",
          background: "#111827",
        }}
      >
        <thead>
          <tr style={{ background: "#1E293B" }}>
            <th>Name</th>
            <th>Type</th>
            <th>Headquarters</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.company_type}</td>
              <td>{company.headquarters}</td>
              <td>{company.verification_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminCompanies;