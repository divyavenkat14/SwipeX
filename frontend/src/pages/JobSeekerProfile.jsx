import { useEffect, useState } from "react";
import api from "../services/api";
import JobSeekerLayout from "../layouts/JobSeekerLayout";

function JobSeekerProfile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    location: "",
    experience_level: "",
    preferred_job_type: "",
    preferred_work_mode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/profiles/job-seeker/me/"
      );

      console.log(
        "Job Seeker Profile:",
        response.data
      );

      setProfile(response.data);

      setFormData({
        full_name:
          response.data.full_name || "",
        headline:
          response.data.headline || "",
        bio:
          response.data.bio || "",
        location:
          response.data.location || "",
        experience_level:
          response.data.experience_level || "",
        preferred_job_type:
          response.data.preferred_job_type || "",
        preferred_work_mode:
          response.data.preferred_work_mode || "",
      });
    } catch (error) {
      console.error(
        "Failed to fetch profile:",
        error
      );

      setError(
        "Unable to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditing(true);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name:
          profile.full_name || "",
        headline:
          profile.headline || "",
        bio:
          profile.bio || "",
        location:
          profile.location || "",
        experience_level:
          profile.experience_level || "",
        preferred_job_type:
          profile.preferred_job_type || "",
        preferred_work_mode:
          profile.preferred_work_mode || "",
      });
    }

    setError("");
    setSuccess("");
    setEditing(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/profiles/job-seeker/me/",
        formData
      );

      console.log(
        "Updated Job Seeker Profile:",
        response.data
      );

      setProfile(response.data);

      setFormData({
        full_name:
          response.data.full_name || "",
        headline:
          response.data.headline || "",
        bio:
          response.data.bio || "",
        location:
          response.data.location || "",
        experience_level:
          response.data.experience_level || "",
        preferred_job_type:
          response.data.preferred_job_type || "",
        preferred_work_mode:
          response.data.preferred_work_mode || "",
      });

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      const backendError =
        error.response?.data;

      if (backendError) {
        setError(
          Object.values(backendError)
            .flat()
            .join(" ")
        );
      } else {
        setError(
          "Unable to update your profile. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DISPLAY LABELS
  // =====================================================

  const getExperienceLabel = (value) => {
    const labels = {
      FRESHER: "Fresher",
      ENTRY_LEVEL: "Entry Level",
      MID_LEVEL: "Mid Level",
      SENIOR: "Senior Level",
    };

    return labels[value] || "Not specified";
  };

  const getJobTypeLabel = (value) => {
    const labels = {
      FULL_TIME: "Full Time",
      PART_TIME: "Part Time",
      INTERNSHIP: "Internship",
      CONTRACT: "Contract",
    };

    return labels[value] || "Not specified";
  };

  const getWorkModeLabel = (value) => {
    const labels = {
      REMOTE: "Remote",
      HYBRID: "Hybrid",
      ONSITE: "On-site",
    };

    return labels[value] || "Not specified";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <JobSeekerLayout>
        <div
          style={{
            padding: "40px",
            color: "#94A3B8",
            fontSize: "18px",
          }}
        >
          Loading your profile...
        </div>
      </JobSeekerLayout>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !profile) {
    return (
      <JobSeekerLayout>
        <div
          style={{
            padding: "40px",
            background: "#1E1115",
            border: "1px solid #7F1D1D",
            borderRadius: "18px",
            color: "#FCA5A5",
            fontSize: "18px",
          }}
        >
          {error}
        </div>
      </JobSeekerLayout>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <JobSeekerLayout>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 0 50px",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            marginBottom: "30px",
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
            MY PROFILE
          </p>

          <h1
            style={{
              color: "#F8FAFC",
              fontSize: "40px",
              margin: 0,
            }}
          >
            Your Career Profile
          </h1>

          <p
            style={{
              color: "#94A3B8",
              fontSize: "17px",
              marginTop: "10px",
            }}
          >
            Keep your profile updated so SwipeX
            can find better opportunities for you.
          </p>
        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div
            style={{
              background: "#052E16",
              border: "1px solid #166534",
              color: "#86EFAC",
              padding: "16px 20px",
              borderRadius: "14px",
              marginBottom: "20px",
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && profile && (
          <div
            style={{
              background: "#1E1115",
              border: "1px solid #7F1D1D",
              color: "#FCA5A5",
              padding: "16px 20px",
              borderRadius: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            VIEW MODE
        ================================================= */}

        {!editing && (
          <>
            {/* PROFILE HEADER */}

            <div
              style={{
                background: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "95px",
                      height: "95px",
                      minWidth: "95px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #2563EB, #60A5FA)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "34px",
                      fontWeight: "700",
                    }}
                  >
                    {profile?.full_name
                      ? profile.full_name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </div>

                  <div>
                    <h2
                      style={{
                        color: "#F8FAFC",
                        margin: 0,
                        fontSize: "30px",
                      }}
                    >
                      {profile?.full_name ||
                        "Your Name"}
                    </h2>

                    <p
                      style={{
                        color: "#60A5FA",
                        margin: "8px 0",
                        fontSize: "17px",
                      }}
                    >
                      {profile?.headline ||
                        "Add a professional headline"}
                    </p>

                    <p
                      style={{
                        color: "#94A3B8",
                        margin: 0,
                        fontSize: "16px",
                      }}
                    >
                      📍{" "}
                      {profile?.location ||
                        "Location not specified"}
                    </p>
                  </div>
                </div>

                {/* EDIT BUTTON */}

                <button
                  type="button"
                  onClick={handleEdit}
                  style={{
                    background: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "13px 24px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✎ Edit Profile
                </button>
              </div>
            </div>

            {/* ABOUT + CAREER */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              {/* ABOUT */}

              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: "22px",
                  padding: "30px",
                  minHeight: "240px",
                }}
              >
                <h2
                  style={{
                    color: "#F8FAFC",
                    marginTop: 0,
                    marginBottom: "20px",
                  }}
                >
                  About Me
                </h2>

                <p
                  style={{
                    color: "#94A3B8",
                    fontSize: "16px",
                    lineHeight: "1.8",
                    whiteSpace: "pre-line",
                    margin: 0,
                  }}
                >
                  {profile?.bio ||
                    "Add a short description about yourself, your experience and your career goals."}
                </p>
              </div>

              {/* CAREER PREFERENCES */}

              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: "22px",
                  padding: "30px",
                }}
              >
                <h2
                  style={{
                    color: "#F8FAFC",
                    marginTop: 0,
                    marginBottom: "25px",
                  }}
                >
                  Career Preferences
                </h2>

                <Preference
                  label="EXPERIENCE LEVEL"
                  value={getExperienceLabel(
                    profile?.experience_level
                  )}
                />

                <Preference
                  label="PREFERRED JOB TYPE"
                  value={getJobTypeLabel(
                    profile?.preferred_job_type
                  )}
                />

                <Preference
                  label="PREFERRED WORK MODE"
                  value={getWorkModeLabel(
                    profile?.preferred_work_mode
                  )}
                />
              </div>
            </div>

            {/* PROFILE COMPLETION */}

            <div
              style={{
                background: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "22px",
                padding: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    color: "#F8FAFC",
                    margin: 0,
                  }}
                >
                  Profile Completion
                </h2>

                <span
                  style={{
                    color: "#22C55E",
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  {profile?.profile_completion || 0}%
                </span>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#1E293B",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      profile?.profile_completion || 0,
                      100
                    )}%`,
                    height: "100%",
                    background: "#22C55E",
                    borderRadius: "20px",
                    transition:
                      "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* =================================================
            EDIT MODE
        ================================================= */}

        {editing && (
          <form onSubmit={handleSave}>
            <div
              style={{
                background: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <h2
                  style={{
                    color: "#F8FAFC",
                    margin: 0,
                  }}
                >
                  Edit Profile
                </h2>

                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: "transparent",
                    color: "#94A3B8",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                <Field
                  label="FULL NAME"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="PROFESSIONAL HEADLINE"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Data Analyst | Business Analyst"
                />

                <Field
                  label="LOCATION"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                />

                <SelectField
                  label="EXPERIENCE LEVEL"
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  options={[
                    ["FRESHER", "Fresher"],
                    ["ENTRY_LEVEL", "Entry Level"],
                    ["MID_LEVEL", "Mid Level"],
                    ["SENIOR", "Senior Level"],
                  ]}
                />

                <SelectField
                  label="PREFERRED JOB TYPE"
                  name="preferred_job_type"
                  value={formData.preferred_job_type}
                  onChange={handleChange}
                  options={[
                    ["FULL_TIME", "Full Time"],
                    ["PART_TIME", "Part Time"],
                    ["INTERNSHIP", "Internship"],
                    ["CONTRACT", "Contract"],
                  ]}
                />

                <SelectField
                  label="PREFERRED WORK MODE"
                  name="preferred_work_mode"
                  value={formData.preferred_work_mode}
                  onChange={handleChange}
                  options={[
                    ["REMOTE", "Remote"],
                    ["HYBRID", "Hybrid"],
                    ["ONSITE", "On-site"],
                  ]}
                />
              </div>

              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <label style={labelStyle}>
                  ABOUT ME
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself, your skills, experience and career goals."
                  rows="7"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "25px",
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: saving
                      ? "#475569"
                      : "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px 28px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </JobSeekerLayout>
  );
}

/* =========================================================
   PREFERENCE COMPONENT
========================================================= */

function Preference({ label, value }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <p
        style={{
          color: "#64748B",
          fontSize: "13px",
          fontWeight: "700",
          margin: "0 0 7px",
        }}
      >
        {label}
      </p>

      <p
        style={{
          color: "#F8FAFC",
          fontSize: "16px",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INPUT COMPONENT
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

/* =========================================================
   SELECT COMPONENT
========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      >
        <option value="">
          Select {label.toLowerCase()}
        </option>

        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const labelStyle = {
  display: "block",
  color: "#94A3B8",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 15px",
  background: "#020617",
  color: "#F8FAFC",
  border: "1px solid #334155",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
};

export default JobSeekerProfile;