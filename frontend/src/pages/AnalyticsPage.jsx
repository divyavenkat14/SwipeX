import { useEffect, useState } from "react";
import api from "../services/api";
import RecruiterLayout from "../layouts/RecruiterLayout";

function AnalyticsPage() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [jobsResponse, applicationsResponse] =
        await Promise.all([
          api.get("/jobs/"),
          api.get("/applications/"),
        ]);

      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);

      console.log("Analytics Jobs:", jobsResponse.data);
      console.log(
        "Analytics Applications:",
        applicationsResponse.data
      );
    } catch (error) {
      console.error(
        "Failed to fetch analytics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPLICATION COUNTS
  // =====================================================

  const totalApplicants = applications.length;

  const appliedCount = applications.filter(
    (application) =>
      application.status === "APPLIED"
  ).length;

  const underReviewCount = applications.filter(
    (application) =>
      application.status === "UNDER_REVIEW"
  ).length;

  const shortlistedCount = applications.filter(
    (application) =>
      application.status === "SHORTLISTED"
  ).length;

  const interviewCount = applications.filter(
    (application) =>
      application.status === "INTERVIEW"
  ).length;

  const offeredCount = applications.filter(
    (application) =>
      application.status === "OFFERED"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      application.status === "REJECTED"
  ).length;

  // =====================================================
  // APPLICATIONS PER JOB
  // =====================================================

  const jobApplicationCounts = jobs.map((job) => {
    const count = applications.filter(
      (application) =>
        application.job === job.id
    ).length;

    return {
      ...job,
      applicantCount: count,
    };
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <RecruiterLayout>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h2>Loading Analytics...</h2>
        </div>
      </RecruiterLayout>
    );
  }

  // =====================================================
  // CARD STYLE
  // =====================================================

  const cardStyle = {
    background: "#111827",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid #273244",
  };

  const numberStyle = {
    margin: 0,
    fontSize: "32px",
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <RecruiterLayout>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px",
          color: "white",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <h1
            style={{
              marginBottom: "8px",
            }}
          >
            Analytics Dashboard
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            Track your hiring activity and
            application progress.
          </p>
        </div>

        {/* =================================================
            JOB STATISTICS
        ================================================= */}

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Job Statistics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >

          {/* TOTAL JOBS */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {jobs.length}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Total Jobs Posted
            </p>
          </div>

          {/* ACTIVE JOBS */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {
                jobs.filter(
                  (job) =>
                    job.status === "ACTIVE" ||
                    job.status === "PUBLISHED"
                ).length
              }
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Active Jobs
            </p>
          </div>

          {/* CLOSED JOBS */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {
                jobs.filter(
                  (job) =>
                    job.status === "CLOSED"
                ).length
              }
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Closed Jobs
            </p>
          </div>
        </div>

        {/* =================================================
            APPLICATION STATISTICS
        ================================================= */}

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Application Statistics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >

          {/* TOTAL */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {totalApplicants}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Total Applicants
            </p>
          </div>

          {/* APPLIED */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {appliedCount}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Applied
            </p>
          </div>

          {/* UNDER REVIEW */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {underReviewCount}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Under Review
            </p>
          </div>

          {/* SHORTLISTED */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {shortlistedCount}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Shortlisted
            </p>
          </div>

          {/* INTERVIEW */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {interviewCount}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Interviews
            </p>
          </div>

          {/* OFFERED */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {offeredCount}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Offers
            </p>
          </div>

          {/* REJECTED */}

          <div style={cardStyle}>
            <h2 style={numberStyle}>
              {rejectedCount}
            </h2>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              Rejected
            </p>
          </div>
        </div>

        {/* =================================================
            APPLICATION FUNNEL
        ================================================= */}

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Hiring Funnel
        </h2>

        <div
          style={{
            background: "#111827",
            border: "1px solid #273244",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "40px",
          }}
        >

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >

            <FunnelRow
              label="Applied"
              count={appliedCount}
              total={totalApplicants}
            />

            <FunnelRow
              label="Under Review"
              count={underReviewCount}
              total={totalApplicants}
            />

            <FunnelRow
              label="Shortlisted"
              count={shortlistedCount}
              total={totalApplicants}
            />

            <FunnelRow
              label="Interview"
              count={interviewCount}
              total={totalApplicants}
            />

            <FunnelRow
              label="Offered"
              count={offeredCount}
              total={totalApplicants}
            />

            <FunnelRow
              label="Rejected"
              count={rejectedCount}
              total={totalApplicants}
            />

          </div>
        </div>

        {/* =================================================
            APPLICATIONS PER JOB
        ================================================= */}

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Applications Per Job
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >

          {jobApplicationCounts.length === 0 ? (
            <div
              style={{
                background: "#111827",
                border: "1px solid #273244",
                borderRadius: "15px",
                padding: "25px",
              }}
            >
              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                No jobs posted yet.
              </p>
            </div>
          ) : (
            jobApplicationCounts.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "#111827",
                  border: "1px solid #273244",
                  borderRadius: "15px",
                  padding: "20px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >

                <div>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: "6px",
                    }}
                  >
                    {job.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#94a3b8",
                    }}
                  >
                    {job.location}
                  </p>
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  {job.applicantCount}
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      marginLeft: "5px",
                    }}
                  >
                    applicants
                  </span>
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </RecruiterLayout>
  );
}


/* =========================================================
   FUNNEL ROW COMPONENT
========================================================= */

function FunnelRow({
  label,
  count,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (count / total) * 100
        )
      : 0;

  return (
    <div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "7px",
        }}
      >
        <span>{label}</span>

        <span
          style={{
            color: "#94a3b8",
          }}
        >
          {count} ({percentage}%)
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#273244",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#2563eb",
            borderRadius: "10px",
            transition:
              "width 0.4s ease",
          }}
        />
      </div>

    </div>
  );
}

export default AnalyticsPage;