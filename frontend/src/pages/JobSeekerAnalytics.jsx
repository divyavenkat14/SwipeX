import { useEffect, useState } from "react";
import api from "../services/api";
import JobSeekerLayout from "../layouts/JobSeekerLayout";

function JobSeekerAnalytics() {
  const [resume, setResume] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      // ---------------------------------------------
      // GET USER RESUMES
      // ---------------------------------------------

      const resumeResponse =
        await api.get("/resumes/");

      const resumes = Array.isArray(
        resumeResponse.data
      )
        ? resumeResponse.data
        : resumeResponse.data.results || [];

      if (resumes.length === 0) {
        setResume(null);
        setResults([]);
        return;
      }

      // Use the first uploaded resume
      const selectedResume = resumes[0];

      setResume(selectedResume);

      // ---------------------------------------------
      // GET COMPLETE RESUME ANALYTICS
      // ---------------------------------------------

      const analyticsResponse =
        await api.get(
          `/resumes/${selectedResume.id}/analytics/`
        );

      const analyticsData =
        analyticsResponse.data;

      setResults(
        analyticsData.results || []
      );

      console.log(
        "Resume Analytics:",
        analyticsData
      );

    } catch (error) {
      console.error(
        "Failed to load resume analytics:",
        error
      );

      setError(
        "Unable to load resume analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <JobSeekerLayout>
        <div
          style={{
            padding: "50px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2>
            Analyzing your resume...
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "10px",
            }}
          >
            Comparing your resume with available
            job opportunities.
          </p>
        </div>
      </JobSeekerLayout>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <JobSeekerLayout>
        <div
          style={{
            padding: "50px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2>
            Something went wrong
          </h2>

          <p
            style={{
              color: "#f87171",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        </div>
      </JobSeekerLayout>
    );
  }

  // =====================================================
  // NO RESUME
  // =====================================================

  if (!resume) {
    return (
      <JobSeekerLayout>
        <div
          style={{
            maxWidth: "900px",
            margin: "60px auto",
            padding: "40px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1>
            Resume Analytics
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "15px",
            }}
          >
            Upload a resume first to see how it
            performs across different job roles.
          </p>
        </div>
      </JobSeekerLayout>
    );
  }

  // =====================================================
  // NO JOBS
  // =====================================================

  if (results.length === 0) {
    return (
      <JobSeekerLayout>
        <div
          style={{
            maxWidth: "900px",
            margin: "60px auto",
            padding: "40px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1>
            Resume Analytics
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "15px",
            }}
          >
            No published job roles are currently
            available for analysis.
          </p>
        </div>
      </JobSeekerLayout>
    );
  }

  // =====================================================
  // SCORE HELPERS
  // =====================================================

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return "Excellent Match";
    }

    if (score >= 60) {
      return "Good Match";
    }

    if (score >= 40) {
      return "Moderate Match";
    }

    return "Poor Match";
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "#16a34a";
    }

    if (score >= 60) {
      return "#f59e0b";
    }

    return "#ef4444";
  };

  // =====================================================
  // SORT RESULTS
  // =====================================================

  const sortedResults = [
    ...results,
  ].sort(
    (a, b) =>
      b.ats_score - a.ats_score
  );

  // =====================================================
  // BEST + WEAKEST
  // =====================================================

  const bestRole =
    sortedResults[0];

  const weakestRole =
    sortedResults[
      sortedResults.length - 1
    ];

  // =====================================================
  // AVERAGE SCORE
  // =====================================================

  const averageScore = Math.round(
    sortedResults.reduce(
      (total, result) =>
        total +
        Number(result.ats_score || 0),
      0
    ) / sortedResults.length
  );

  // =====================================================
  // COMBINE MATCHED SKILLS
  // =====================================================

  const matchedSkills = [
    ...new Set(
      sortedResults.flatMap(
        (result) =>
          result.matched_skills || []
      )
    ),
  ];

  // =====================================================
  // COMBINE MISSING SKILLS
  // =====================================================

  const missingSkills = [
    ...new Set(
      sortedResults.flatMap(
        (result) =>
          result.missing_skills || []
      )
    ),
  ];

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <JobSeekerLayout>
      <div
        style={{
          maxWidth: "1200px",
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
              fontSize: "38px",
              marginBottom: "10px",
            }}
          >
            Resume Analytics
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
            }}
          >
            See how your resume performs across
            different job roles.
          </p>

          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
            }}
          >
            Analyzing:{" "}
            {resume.title ||
              "Your Resume"}
          </p>
        </div>

        {/* =================================================
            OVERALL SCORE
        ================================================= */}

        <div
          style={{
            background: "#111827",
            border:
              "1px solid #273244",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >

            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                Overall Resume Performance
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "10px",
                }}
              >
                Average ATS match across{" "}
                {sortedResults.length}{" "}
                job roles.
              </p>
            </div>

            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border:
                  `8px solid ${getScoreColor(
                    averageScore
                  )}`,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexDirection:
                  "column",
                flexShrink: 0,
              }}
            >
              <strong
                style={{
                  fontSize: "30px",
                }}
              >
                {averageScore}%
              </strong>

              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                Average
              </span>
            </div>

          </div>
        </div>

        {/* =================================================
            BEST + WEAKEST
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >

          {/* BEST */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #16a34a",
              borderRadius: "18px",
              padding: "25px",
            }}
          >
            <p
              style={{
                color: "#22c55e",
                fontWeight: "bold",
              }}
            >
              🏆 BEST PERFORMING ROLE
            </p>

            <h2>
              {bestRole.job_title}
            </h2>

            <strong
              style={{
                color: "#22c55e",
                fontSize: "30px",
              }}
            >
              {bestRole.ats_score}%
            </strong>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              {getScoreLabel(
                bestRole.ats_score
              )}
            </p>
          </div>

          {/* WEAKEST */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #ef4444",
              borderRadius: "18px",
              padding: "25px",
            }}
          >
            <p
              style={{
                color: "#ef4444",
                fontWeight: "bold",
              }}
            >
              ⚠️ NEEDS IMPROVEMENT
            </p>

            <h2>
              {weakestRole.job_title}
            </h2>

            <strong
              style={{
                color: "#ef4444",
                fontSize: "30px",
              }}
            >
              {weakestRole.ats_score}%
            </strong>

            <p
              style={{
                color: "#94a3b8",
              }}
            >
              {getScoreLabel(
                weakestRole.ats_score
              )}
            </p>
          </div>

        </div>

        {/* =================================================
            ROLE PERFORMANCE
        ================================================= */}

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Performance Across Job Roles
        </h2>

        <div
          style={{
            background: "#111827",
            border:
              "1px solid #273244",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "35px",
          }}
        >

          {sortedResults.map(
            (result) => {
              const score =
                Number(
                  result.ats_score || 0
                );

              return (
                <div
                  key={result.job_id}
                  style={{
                    marginBottom: "28px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom:
                        "8px",
                      gap: "20px",
                    }}
                  >

                    <div>
                      <strong
                        style={{
                          fontSize:
                            "17px",
                        }}
                      >
                        {result.job_title}
                      </strong>

                      <div
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "13px",
                          marginTop:
                            "4px",
                        }}
                      >
                        {result.company_name}
                      </div>
                    </div>

                    <strong
                      style={{
                        color:
                          getScoreColor(
                            score
                          ),
                        fontSize:
                          "18px",
                      }}
                    >
                      {score}%
                    </strong>

                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "12px",
                      background:
                        "#273244",
                      borderRadius:
                        "10px",
                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                        width:
                          `${score}%`,
                        height: "100%",
                        background:
                          getScoreColor(
                            score
                          ),
                        borderRadius:
                          "10px",
                        transition:
                          "width 0.5s ease",
                      }}
                    />
                  </div>

                  <p
                    style={{
                      marginTop:
                        "7px",
                      color:
                        "#94a3b8",
                      fontSize:
                        "14px",
                    }}
                  >
                    {getScoreLabel(
                      score
                    )}
                  </p>

                </div>
              );
            }
          )}

        </div>

        {/* =================================================
            SKILL ANALYSIS
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >

          {/* STRONG SKILLS */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #16a34a",
              borderRadius: "18px",
              padding: "25px",
            }}
          >
            <h2>
              💪 Your Strong Skills
            </h2>

            {matchedSkills.length ===
            0 ? (
              <p
                style={{
                  color:
                    "#94a3b8",
                }}
              >
                No matched skills found.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap:
                    "wrap",
                  gap: "10px",
                  marginTop:
                    "15px",
                }}
              >
                {matchedSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      style={{
                        padding:
                          "8px 12px",
                        borderRadius:
                          "20px",
                        background:
                          "#123524",
                        color:
                          "#22c55e",
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* SKILLS TO IMPROVE */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #f59e0b",
              borderRadius: "18px",
              padding: "25px",
            }}
          >
            <h2>
              📚 Skills To Improve
            </h2>

            {missingSkills.length ===
            0 ? (
              <p
                style={{
                  color:
                    "#94a3b8",
                }}
              >
                Great! No major skill
                gaps detected.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap:
                    "wrap",
                  gap: "10px",
                  marginTop:
                    "15px",
                }}
              >
                {missingSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      style={{
                        padding:
                          "8px 12px",
                        borderRadius:
                          "20px",
                        background:
                          "#3a2b0b",
                        color:
                          "#fbbf24",
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </JobSeekerLayout>
  );
}

export default JobSeekerAnalytics;