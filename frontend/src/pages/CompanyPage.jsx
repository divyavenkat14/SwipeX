import { useEffect, useState } from "react";
import api from "../services/api";
import RecruiterLayout from "../layouts/RecruiterLayout";

function CompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchCompanies(filter);
  }, [filter]);

  const fetchCompanies = async (type = "ALL") => {
    try {
      const url =
        type === "ALL"
          ? "/companies/"
          : `/companies/?type=${type}`;

      const response = await api.get(url);
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RecruiterLayout>
      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "20px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "30px",
            fontWeight: "700",
          }}
        >
          Companies
        </h1>

        {/* Filter Buttons */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "35px",
          }}
        >
          {["ALL", "MNC", "STARTUP"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: "12px 28px",
                borderRadius: "12px",
                border: "1px solid #334155",
                background:
                  filter === type ? "#2563EB" : "#111827",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                transition: "0.3s",
              }}
            >
              {type === "ALL"
                ? "All"
                : type === "MNC"
                ? "MNC"
                : "Startup"}
            </button>
          ))}
        </div>

        {/* Company Cards */}

        {companies.length === 0 ? (
          <p>No companies found.</p>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              style={{
                background: "#111827",
                border: "1px solid #1F2937",
                borderRadius: "20px",
                padding: "30px",
                marginBottom: "25px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h2
                    style={{
                      marginBottom: "20px",
                      fontSize: "32px",
                    }}
                  >
                    {company.name}
                  </h2>

                  <p
                    style={{
                      color: "#CBD5E1",
                      marginBottom: "12px",
                    }}
                  >
                    🏢 <strong>Type:</strong>{" "}
                    {company.company_type}
                  </p>

                  <p
                    style={{
                      color: "#CBD5E1",
                      marginBottom: "12px",
                    }}
                  >
                    📍 <strong>Headquarters:</strong>{" "}
                    {company.headquarters || "Not Available"}
                  </p>

                  <p
                    style={{
                      color: "#CBD5E1",
                      marginBottom: "12px",
                    }}
                  >
                    🌐 <strong>Website:</strong>{" "}
                    {company.website || "Not Available"}
                  </p>

                  <p
                    style={{
                      color: "#CBD5E1",
                    }}
                  >
                    👥 <strong>Company Size:</strong>{" "}
                    {company.company_size || "Not Available"}
                  </p>
                </div>

                <span
                  style={{
                    background:
                      company.verification_status === "VERIFIED"
                        ? "#16A34A"
                        : "#F59E0B",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {company.verification_status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </RecruiterLayout>
  );
}

export default CompanyPage;