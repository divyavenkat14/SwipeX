import { useEffect, useState } from "react";
import JobSeekerLayout from "../layouts/JobSeekerLayout";
import api from "../services/api";

const STATUS_STEPS = [
  {
    value: "APPLIED",
    label: "Applied",
  },
  {
    value: "UNDER_REVIEW",
    label: "Under Review",
  },
  {
    value: "SHORTLISTED",
    label: "Shortlisted",
  },
  {
    value: "INTERVIEW",
    label: "Interview",
  },
  {
    value: "OFFERED",
    label: "Offered",
  },
];

function JobSeekerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/");

      console.log("My Applications:", response.data);

      setApplications(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error
      );

      setError(
        "Unable to load your applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return STATUS_STEPS.findIndex(
      (step) => step.value === status
    );
  };

  const getStatusLabel = (status) => {
    const step = STATUS_STEPS.find(
      (item) => item.value === status
    );

    if (step) {
      return step.label;
    }

    if (status === "REJECTED") {
      return "Rejected";
    }

    if (status === "WITHDRAWN") {
      return "Withdrawn";
    }

    return status;
  };

  const getStatusColor = (status) => {
    if (status === "REJECTED") {
      return "#EF4444";
    }

    if (status === "WITHDRAWN") {
      return "#F59E0B";
    }

    if (status === "OFFERED") {
      return "#22C55E";
    }

    if (status === "SHORTLISTED") {
      return "#8B5CF6";
    }

    if (status === "INTERVIEW") {
      return "#06B6D4";
    }

    return "#2563EB";
  };

  const renderTracking = (application) => {
    const currentStatus = application.status;

    /*
      Rejected and Withdrawn are terminal states.
    */
    if (
      currentStatus === "REJECTED" ||
      currentStatus === "WITHDRAWN"
    ) {
      return (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "12px",
            background:
              currentStatus === "REJECTED"
                ? "rgba(239, 68, 68, 0.10)"
                : "rgba(245, 158, 11, 0.10)",
            border: `1px solid ${getStatusColor(
              currentStatus
            )}`,
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Application Status
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: getStatusColor(currentStatus),
            }}
          >
            {getStatusLabel(currentStatus)}
          </div>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#CBD5E1",
            }}
          >
            {currentStatus === "REJECTED"
              ? "Unfortunately, this application was not selected."
              : "You have withdrawn this application."}
          </p>
        </div>
      );
    }

    const currentIndex = getStatusIndex(currentStatus);

    return (
      <div
        style={{
          marginTop: "25px",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Application Tracking
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
            gap: "5px",
          }}
        >
          {STATUS_STEPS.map((step, index) => {
            const completed = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.value}
                style={{
                  flex: 1,
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {index > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "50%",
                      width: "100%",
                      height: "3px",
                      background:
                        index <= currentIndex
                          ? "#2563EB"
                          : "#374151",
                      zIndex: 0,
                    }}
                  />
                )}

                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    margin: "0 auto",
                    borderRadius: "50%",
                    background: completed
                      ? "#2563EB"
                      : "#1F2937",
                    border: isCurrent
                      ? "3px solid #60A5FA"
                      : "2px solid #4B5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  {completed ? "✓" : ""}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    fontWeight: isCurrent
                      ? "700"
                      : "500",
                    color: completed
                      ? "white"
                      : "#6B7280",
                  }}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "25px",
            padding: "14px 18px",
            borderRadius: "10px",
            background: "#111827",
            border: "1px solid #374151",
          }}
        >
          <span
            style={{
              color: "#9CA3AF",
            }}
          >
            Current Status:
          </span>{" "}
          <strong
            style={{
              color: getStatusColor(currentStatus),
            }}
          >
            {getStatusLabel(currentStatus)}
          </strong>
        </div>
      </div>
    );
  };

  return (
    <JobSeekerLayout>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 25px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          My Applications
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            marginBottom: "35px",
            fontSize: "16px",
          }}
        >
          Track the progress of all your job applications.
        </p>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              color: "#9CA3AF",
            }}
          >
            Loading your applications...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.10)",
              border: "1px solid #EF4444",
              color: "#FCA5A5",
            }}
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                border: "1px solid #374151",
                borderRadius: "15px",
                background: "#0F172A",
              }}
            >
              <h2>No applications yet</h2>

              <p
                style={{
                  color: "#9CA3AF",
                }}
              >
                Start exploring jobs and apply to the
                opportunities that match your skills.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          applications.map((application) => (
            <div
              key={application.id}
              style={{
                background: "#0F172A",
                border: "1px solid #374151",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "25px",
                boxShadow:
                  "0 10px 30px rgba(0, 0, 0, 0.20)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                    }}
                  >
                    {application.job_title ||
                      application.job?.title ||
                      "Job Application"}
                  </h2>

                  {application.company_name && (
                    <p
                      style={{
                        color: "#CBD5E1",
                        margin: "6px 0",
                      }}
                    >
                      🏢 {application.company_name}
                    </p>
                  )}

                  {application.applicant_location && (
                    <p
                      style={{
                        color: "#CBD5E1",
                        margin: "6px 0",
                      }}
                    >
                      📍 {application.applicant_location}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: "20px",
                    background: `${getStatusColor(
                      application.status
                    )}22`,
                    border: `1px solid ${getStatusColor(
                      application.status
                    )}`,
                    color: getStatusColor(
                      application.status
                    ),
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {getStatusLabel(application.status)}
                </div>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  color: "#9CA3AF",
                  fontSize: "14px",
                }}
              >
                Applied:{" "}
                {application.applied_at
                  ? new Date(
                      application.applied_at
                    ).toLocaleString()
                  : "N/A"}
              </div>

              {renderTracking(application)}

              {/* Application History */}
              {application.status_history &&
                application.status_history.length > 0 && (
                  <div
                    style={{
                      marginTop: "25px",
                      paddingTop: "20px",
                      borderTop: "1px solid #374151",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "15px",
                      }}
                    >
                      Application History
                    </h3>

                    {application.status_history.map(
                      (history, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "15px",
                            marginBottom: "12px",
                            padding: "14px 16px",
                            borderRadius: "10px",
                            background: "#111827",
                            border:
                              "1px solid #1F2937",
                          }}
                        >
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              marginTop: "6px",
                              borderRadius: "50%",
                              background:
                                getStatusColor(
                                  history.new_status
                                ),
                              flexShrink: 0,
                            }}
                          />

                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "white",
                              }}
                            >
                              {getStatusLabel(
                                history.new_status
                              )}
                            </div>

                            <div
                              style={{
                                color: "#9CA3AF",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              {history.changed_at
                                ? new Date(
                                    history.changed_at
                                  ).toLocaleString()
                                : "Date unavailable"}
                            </div>

                            {history.note && (
                              <div
                                style={{
                                  color: "#CBD5E1",
                                  fontSize: "14px",
                                  marginTop: "6px",
                                }}
                              >
                                {history.note}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}
      </div>
    </JobSeekerLayout>
  );
}

export default JobSeekerApplications;