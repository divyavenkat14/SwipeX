import { useEffect, useState } from "react";
import api from "../services/api";
import JobSeekerLayout from "../layouts/JobSeekerLayout";

function JobSeekerCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/companies/");
      setCompanies(response.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);

      setError(
        "Unable to load companies right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const mncs = companies.filter(
    (company) => company.company_type === "MNC"
  );

  const startups = companies.filter(
    (company) => company.company_type === "STARTUP"
  );

  const CompanyCard = ({ company }) => {
    return (
      <div
        style={{
          background: "#0F172A",
          border: "1px solid #1E293B",
          borderRadius: "18px",
          padding: "24px",
          transition: "0.3s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "14px",
              background: "#1E293B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              "🏢"
            )}
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                color: "#F8FAFC",
                fontSize: "20px",
              }}
            >
              {company.name}
            </h3>

            {company.headquarters && (
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#94A3B8",
                  fontSize: "14px",
                }}
              >
                📍 {company.headquarters}
              </p>
            )}
          </div>
        </div>

        {company.description && (
          <p
            style={{
              color: "#94A3B8",
              lineHeight: "1.6",
              marginBottom: "18px",
            }}
          >
            {company.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {company.company_size && (
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "20px",
                background: "#172033",
                color: "#CBD5E1",
                fontSize: "13px",
              }}
            >
              👥 {company.company_size}
            </span>
          )}

          {company.founded_year && (
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "20px",
                background: "#172033",
                color: "#CBD5E1",
                fontSize: "13px",
              }}
            >
              📅 Founded {company.founded_year}
            </span>
          )}
        </div>

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "20px",
              color: "#60A5FA",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Visit website →
          </a>
        )}
      </div>
    );
  };

  return (
    <JobSeekerLayout>
      <div
        style={{
          padding: "10px 0 50px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              color: "#60A5FA",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            COMPANY DISCOVERY
          </p>

          <h1
            style={{
              color: "#F8FAFC",
              fontSize: "38px",
              margin: 0,
            }}
          >
            Explore Companies
          </h1>

          <p
            style={{
              color: "#94A3B8",
              marginTop: "12px",
              fontSize: "16px",
              maxWidth: "700px",
              lineHeight: "1.6",
            }}
          >
            Discover established companies and growing startups
            hiring through SwipeX.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            style={{
              background: "#0F172A",
              border: "1px solid #1E293B",
              borderRadius: "18px",
              padding: "40px",
              color: "#94A3B8",
              textAlign: "center",
            }}
          >
            Loading companies...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            style={{
              background: "#1E1115",
              border: "1px solid #7F1D1D",
              borderRadius: "18px",
              padding: "30px",
              color: "#FCA5A5",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* MNC SECTION */}
            <section
              style={{
                marginBottom: "50px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "#F8FAFC",
                      margin: 0,
                      fontSize: "26px",
                    }}
                  >
                    🏢 MNCs
                  </h2>

                  <p
                    style={{
                      color: "#64748B",
                      marginTop: "6px",
                    }}
                  >
                    Established companies and large organizations
                  </p>
                </div>

                <span
                  style={{
                    color: "#60A5FA",
                    fontWeight: "600",
                  }}
                >
                  {mncs.length} companies
                </span>
              </div>

              {mncs.length === 0 ? (
                <div
                  style={{
                    background: "#0F172A",
                    border: "1px solid #1E293B",
                    borderRadius: "18px",
                    padding: "30px",
                    color: "#64748B",
                  }}
                >
                  No MNCs available yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {mncs.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* STARTUP SECTION */}
            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "#F8FAFC",
                      margin: 0,
                      fontSize: "26px",
                    }}
                  >
                    🚀 Startups
                  </h2>

                  <p
                    style={{
                      color: "#64748B",
                      marginTop: "6px",
                    }}
                  >
                    Fast-growing companies and emerging opportunities
                  </p>
                </div>

                <span
                  style={{
                    color: "#22C55E",
                    fontWeight: "600",
                  }}
                >
                  {startups.length} startups
                </span>
              </div>

              {startups.length === 0 ? (
                <div
                  style={{
                    background: "#0F172A",
                    border: "1px solid #1E293B",
                    borderRadius: "18px",
                    padding: "30px",
                    color: "#64748B",
                  }}
                >
                  No startups available yet.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {startups.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </JobSeekerLayout>
  );
}

export default JobSeekerCompanies;