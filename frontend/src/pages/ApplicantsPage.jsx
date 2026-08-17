import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import RecruiterLayout from "../layouts/RecruiterLayout";

function ApplicantsPage() {
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    console.log("Job ID:", id);

    try {
      const url = id
        ? `/applications/?job=${id}`
        : `/applications/`;

      const response = await api.get(url);

      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await api.patch(
        `/applications/${applicationId}/`,
        {
          status: newStatus,
        }
      );

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? response.data
            : application
        )
      );

      alert("Application status updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );

      if (error.response) {
        console.error(
          "Server response:",
          error.response.data
        );
      }

      alert("Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <RecruiterLayout>
      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1>Applicants</h1>

        {applications.length === 0 ? (
          <p>No applicants yet.</p>
        ) : (
          applications.map((application) => (
            <div
              key={application.id}
              style={{
                border: "1px solid #444",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3>{application.applicant_name}</h3>

              <p>
                <strong>Job:</strong>{" "}
                {application.job_title}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.applicant_location}
              </p>

              <p>
                <strong>Applied:</strong>{" "}
                {new Date(
                  application.applied_at
                ).toLocaleString()}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                <strong>Status:</strong>

                <select
                  value={application.status}
                  disabled={
                    updatingId === application.id
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      application.id,
                      event.target.value
                    )
                  }
                  style={{
                    marginLeft: "10px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    backgroundColor: "#111827",
                    color: "white",
                    cursor:
                      updatingId === application.id
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <option value="APPLIED">
                    Applied
                  </option>

                  <option value="UNDER_REVIEW">
                    Under Review
                  </option>

                  <option value="SHORTLISTED">
                    Shortlisted
                  </option>

                  <option value="INTERVIEW">
                    Interview
                  </option>

                  <option value="OFFERED">
                    Offered
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>
                </select>

                {updatingId === application.id && (
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "#60A5FA",
                    }}
                  >
                    Updating...
                  </span>
                )}
              </div>

              {application.resume_file && (
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={application.resume_file}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#60A5FA",
                      textDecoration: "none",
                    }}
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </RecruiterLayout>
  );
}

export default ApplicantsPage;