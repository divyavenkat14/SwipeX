import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RecruiterLayout from "../layouts/RecruiterLayout";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/");
        setJobs(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting Job ID:", id);

    try {
      await api.delete(`/jobs/${id}/`);

      setJobs((prev) => prev.filter((job) => job.id !== id));

      alert("Job deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete job.");
    }
  };



  return (
    <RecruiterLayout>
    <div
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1>Recruiter Dashboard</h1>

      <p>Welcome to SwipeX.</p>

      <button
        onClick={() => navigate("/recruiter/post-job")}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        + Post New Job
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2 id="my-jobs">My Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong> {job.company_name}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Job Type:</strong> {job.job_type}
            </p>

            <p>
              <strong>Experience:</strong> {job.experience_level}
            </p>

            <button
              onClick={() => navigate(`/recruiter/post-job/${job.id}`)}
              style={{
                padding: "8px 14px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(job.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
            <button
              onClick={() =>
                navigate(`/recruiter/jobs/${job.id}/applicants`)
              }
              style={{
                marginLeft: "10px",
              }}
            >
              View Applicants
            </button>
          </div>
        ))
      )}
    </div>
    </RecruiterLayout>
  );
}

export default RecruiterDashboard;