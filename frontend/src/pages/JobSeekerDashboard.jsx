import { useEffect, useState } from "react";
import ApplyModal from "../components/ApplyModal";
import SwipeDeck from "../components/SwipeDeck";
import api from "../services/api";
import JobSeekerLayout from "../layouts/JobSeekerLayout";
import { getATSScore } from "../services/ats";

function JobSeekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobScores, setJobScores] = useState({});

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = [...jobs];

    if (search) {
      result = result.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.experience) {
      result = result.filter(
        (job) => job.experience_level === filters.experience
      );
    }

    const sortedJobs = [...result].sort(
      (a, b) => (jobScores[b.id] || 0) - (jobScores[a.id] || 0)
    );

    console.log("Jobs:", jobs);
    console.log("Filtered:", result);
    console.log("Sorted:", sortedJobs);

    setFilteredJobs(sortedJobs);
    setCurrentIndex(0);
  }, [jobs, search, filters, jobScores]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const resumeResponse = await api.get("/resumes/");

        console.log("Resumes:", resumeResponse.data);

        if (resumeResponse.data.length === 0) return;

        const defaultResume =
          resumeResponse.data.find((r) => r.is_default) ||
          resumeResponse.data[0];

        const resumeId = defaultResume.id;

        console.log("Using Resume:", resumeId);

        const scores = {};

        for (const job of jobs) {
          try {
            const result = await getATSScore(
              resumeId,
              job.id
            );

            console.log(
              "===================================="
            );
            console.log("Job:", job.title);
            console.log("Resume:", resumeId);
            console.log(JSON.stringify(result, null, 2));
            console.log(
              "===================================="
            );

            scores[job.id] = result.ats_score;
          } catch (err) {
            console.log(err);
            scores[job.id] = 0;
          }
        }

        setJobScores(scores);

      } catch (error) {
        console.log(error);
      }
    };

    if (jobs.length > 0) {
      loadScores();
    }
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs/");

      console.log("Jobs API:", response.data);

      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwipe = async (dir) => {
    setDirection(dir);

    try {
      await api.post("/swipes/", {
        job: filteredJobs[currentIndex].id,
        action: dir === 1 ? "SAVE" : "SKIP",
      });
    } catch (error) {
      console.log(error);
    }

    if (dir === 1) {
      setTimeout(() => {
        setSelectedJob(filteredJobs[currentIndex]);
        setDirection(0);
      }, 350);
      return;
    }

    setTimeout(() => {
      if (currentIndex < filteredJobs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        alert("No more jobs available.");
      }

      setDirection(0);
    }, 350);
  };

  const handleApply = async () => {
    try {
      await api.post("/applications/", {
        job: selectedJob.id,
      });
  
      setSelectedJob(null);
  
      if (currentIndex < filteredJobs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
  
      alert("Application Submitted Successfully!");
    } catch (error) {
      console.log(error);
      alert("Application Failed");
    }
  };

  return (
    <JobSeekerLayout>
      <div
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Discover Jobs
        </h1>

        <input
          type="text"
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #444",
            marginBottom: "20px",
            background: "#111827",
            color: "white",
            fontSize: "16px",
            outline: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value,
              })
            }
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background: "#111827",
              color: "white",
              border: "1px solid #444",
            }}
          >
            <option value="">All Locations</option>
            <option value="chennai">Chennai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters({
                ...filters,
                experience: e.target.value,
              })
            }
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background: "#111827",
              color: "white",
              border: "1px solid #444",
            }}
          >
            <option value="">All Experience</option>
            <option value="FRESHER">Fresher</option>
            <option value="ENTRY">Entry Level</option>
            <option value="MID">Mid Level</option>
            <option value="SENIOR">Senior Level</option>
          </select>
        </div>

        {filteredJobs.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No jobs available.
          </p>
        ) : (
          <>
            <SwipeDeck
              jobs={filteredJobs}
              currentIndex={currentIndex}
              direction={direction}
              handleSwipe={handleSwipe}
              jobScores={jobScores}
            />

            <ApplyModal
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onApply={handleApply}
            />
          </>
        )}
      </div>
    </JobSeekerLayout>
  );
}

export default JobSeekerDashboard;