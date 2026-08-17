import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PostJobPage.css";
import RecruiterLayout from "../layouts/RecruiterLayout";
function PostJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "FULL_TIME",
    work_mode: "ONSITE",
    experience_level: "FRESHER",
  });
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}/`);
        setJob(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load job.");
      }
    };

    fetchJob();
  }, [id]);


  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("TOKEN:", localStorage.getItem("accessToken"));
    
      if (id) {
        await api.put(`/jobs/${id}/`, job);
    
        alert("Job updated successfully!");
      } else {
        await api.post("/jobs/", job);
    
        alert("Job posted successfully!");
      }
    
      navigate("/recruiter/dashboard");

    } catch (error) {

      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      console.error(error);

      alert("Failed to post job.");

    }
  };

  return (
    <RecruiterLayout>
    <div className="postjob-page">

      <div className="postjob-grid"></div>

      <div className="postjob-glow glow1"></div>
      <div className="postjob-glow glow2"></div>

      <div className="postjob-container">

        <div className="postjob-left">

          <span className="section-tag">
            RECRUITER PANEL
          </span>

          <h1>
            Create your next
            <span> opportunity.</span>
          </h1>

          <p>
            Publish a role and let SwipeX match
            your company with the right talent.
          </p>

          <div className="tips-card">

            <h3>Hiring Tips</h3>

            <ul>
              <li>✔ Write a clear job title.</li>
              <li>✔ Mention growth opportunities.</li>
              <li>✔ Keep descriptions concise.</li>
              <li>✔ Specify experience expectations.</li>
            </ul>

          </div>

        </div>

        <div className="postjob-card">

          <h2>{id ? "Update Job" : "Post a New Job"}</h2>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Job Title</label>

              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="Senior AI Engineer"
                required
              />

            </div>

            <div className="row">

              <div className="input-group">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  placeholder="Chennai"
                />

              </div>

              <div className="input-group">

                <label>Employment Type</label>

                <select
                  name="job_type"
                  value={job.job_type}
                  onChange={handleChange}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>

              </div>

            </div>

            <div className="row">

              <div className="input-group">

                <label>Work Mode</label>

                <select
                  name="work_mode"
                  value={job.work_mode}
                  onChange={handleChange}
                >
                  <option value="ONSITE">On Site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>

              </div>

              <div className="input-group">

                <label>Experience</label>

                <select
                  name="experience_level"
                  value={job.experience_level}
                  onChange={handleChange}
                >
                  <option value="FRESHER">Fresher</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                </select>

              </div>

            </div>

            <div className="input-group">

              <label>Description</label>

              <textarea
                name="description"
                rows="8"
                value={job.description}
                onChange={handleChange}
                placeholder="Describe the role..."
                required
              />

            </div>

            <button className="publish-btn">
              {id ? "Update Job →" : "Publish Job →"}
            </button>

          </form>

        </div>

      </div>

    </div>
    </RecruiterLayout>
  );
}

export default PostJobPage;