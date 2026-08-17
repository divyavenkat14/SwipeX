import { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function RecruiterProfile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    job_title: "",
    company: "",
    is_company_admin: false,
  });

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
        "/profiles/recruiter/me/"
      );

      console.log(
        "Recruiter profile:",
        response.data
      );

      setProfile(response.data);

      setFormData({
        full_name: response.data.full_name || "",
        job_title: response.data.job_title || "",
        company: response.data.company || "",
        is_company_admin:
          response.data.is_company_admin || false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch recruiter profile:",
        error
      );

      setError(
        "Unable to load your recruiter profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put(
        "/profiles/recruiter/me/",
        {
          full_name: formData.full_name,
          job_title: formData.job_title,
          company: formData.company || null,
          is_company_admin:
            formData.is_company_admin,
        }
      );

      console.log(
        "Updated recruiter profile:",
        response.data
      );

      setProfile(response.data);

      setFormData({
        full_name:
          response.data.full_name || "",
        job_title:
          response.data.job_title || "",
        company:
          response.data.company || "",
        is_company_admin:
          response.data.is_company_admin || false,
      });

      setIsEditing(false);

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update recruiter profile:",
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
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    if (!profile) return;

    setFormData({
      full_name: profile.full_name || "",
      job_title: profile.job_title || "",
      company: profile.company || "",
      is_company_admin:
        profile.is_company_admin || false,
    });

    setIsEditing(false);
    setError("");
    setMessage("");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#020617",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <TopNavbar title="Recruiter Portal" />

          <main
            style={{
              padding: "35px",
            }}
          >
            <div
              style={{
                background: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "20px",
                padding: "40px",
                color: "#94A3B8",
                fontSize: "18px",
              }}
            >
              Loading your recruiter profile...
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // BASIC VALUES
  // =====================================================

  const fullName =
    profile?.full_name || "Recruiter";

  const jobTitle =
    profile?.job_title || "Recruiter";

  const companyName =
    profile?.company_name ||
    "Company not specified";

  const email =
    profile?.email ||
    "Email not specified";

  const username =
    profile?.username ||
    "";

  const firstLetter =
    fullName.charAt(0).toUpperCase();

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <TopNavbar title="Recruiter Portal" />

        <main
          style={{
            padding: "35px",
            boxSizing: "border-box",
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
            <div
              style={{
                color: "#60A5FA",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              MY PROFILE
            </div>

            <h1
              style={{
                margin: 0,
                color: "#F8FAFC",
                fontSize: "42px",
                fontWeight: "700",
              }}
            >
              Recruiter Profile
            </h1>

            <p
              style={{
                color: "#94A3B8",
                fontSize: "18px",
                marginTop: "12px",
              }}
            >
              Manage your recruiter information
              and professional details.
            </p>
          </div>

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {message && (
            <div
              style={{
                marginBottom: "25px",
                padding: "18px 22px",
                borderRadius: "14px",
                background: "#052E16",
                border:
                  "1px solid #16A34A",
                color: "#4ADE80",
                fontSize: "16px",
              }}
            >
              {message}
            </div>
          )}

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div
              style={{
                marginBottom: "25px",
                padding: "18px 22px",
                borderRadius: "14px",
                background: "#1C0F14",
                border:
                  "1px solid #EF4444",
                color: "#FCA5A5",
                fontSize: "16px",
              }}
            >
              {error}
            </div>
          )}

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div
            style={{
              background: "#0F172A",
              border:
                "1px solid #1E293B",
              borderRadius: "22px",
              padding: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "25px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "25px",
              }}
            >
              {/* AVATAR */}

              <div
                style={{
                  width: "105px",
                  height: "105px",
                  minWidth: "105px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #2563EB, #60A5FA)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "42px",
                  fontWeight: "700",
                }}
              >
                {firstLetter}
              </div>

              {/* DETAILS */}

              <div>
                <h2
                  style={{
                    margin:
                      "0 0 8px",
                    color: "#F8FAFC",
                    fontSize: "30px",
                  }}
                >
                  {fullName}
                </h2>

                <p
                  style={{
                    margin:
                      "0 0 8px",
                    color: "#60A5FA",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  {jobTitle}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: "#94A3B8",
                    fontSize: "16px",
                  }}
                >
                  @{username}
                </p>
              </div>
            </div>

            {/* EDIT BUTTON */}

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setMessage("");
                  setError("");
                }}
                style={{
                  border: "none",
                  borderRadius: "12px",
                  padding:
                    "13px 24px",
                  background: "#2563EB",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* =================================================
              EDIT FORM
          ================================================= */}

          {isEditing ? (
            <form
              onSubmit={handleSave}
              style={{
                background: "#0F172A",
                border:
                  "1px solid #1E293B",
                borderRadius: "22px",
                padding: "35px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#F8FAFC",
                  fontSize: "25px",
                }}
              >
                Edit Profile
              </h2>

              {/* FULL NAME */}

              <label
                style={{
                  display: "block",
                  marginBottom: "25px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#94A3B8",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    marginBottom: "9px",
                  }}
                >
                  FULL NAME
                </span>

                <input
                  type="text"
                  name="full_name"
                  value={
                    formData.full_name
                  }
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "15px 17px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #334155",
                    background:
                      "#020617",
                    color: "#F8FAFC",
                    fontSize: "17px",
                    outline: "none",
                  }}
                />
              </label>

              {/* JOB TITLE */}

              <label
                style={{
                  display: "block",
                  marginBottom: "25px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#94A3B8",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    marginBottom: "9px",
                  }}
                >
                  JOB TITLE
                </span>

                <input
                  type="text"
                  name="job_title"
                  value={
                    formData.job_title
                  }
                  onChange={handleChange}
                  placeholder="HR Recruiter"
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "15px 17px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #334155",
                    background:
                      "#020617",
                    color: "#F8FAFC",
                    fontSize: "17px",
                    outline: "none",
                  }}
                />
              </label>

              {/* COMPANY */}

              <label
                style={{
                  display: "block",
                  marginBottom: "25px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#94A3B8",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    marginBottom: "9px",
                  }}
                >
                  COMPANY ID
                </span>

                <input
                  type="number"
                  name="company"
                  value={
                    formData.company
                  }
                  onChange={handleChange}
                  placeholder="Company ID"
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "15px 17px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #334155",
                    background:
                      "#020617",
                    color: "#F8FAFC",
                    fontSize: "17px",
                    outline: "none",
                  }}
                />
              </label>

              {/* ADMIN */}

              <label
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                  color: "#F8FAFC",
                  fontSize: "16px",
                  marginBottom:
                    "30px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="is_company_admin"
                  checked={
                    formData.is_company_admin
                  }
                  onChange={handleChange}
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />

                Company Admin
              </label>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "15px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    handleCancel
                  }
                  disabled={saving}
                  style={{
                    padding:
                      "13px 24px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #334155",
                    background:
                      "transparent",
                    color: "#CBD5E1",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding:
                      "13px 28px",
                    borderRadius:
                      "12px",
                    border: "none",
                    background:
                      "#2563EB",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    opacity: saving
                      ? 0.7
                      : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* =================================================
                  INFORMATION CARDS
              ================================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "25px",
                }}
              >
                {/* COMPANY */}

                <div
                  style={{
                    background:
                      "#0F172A",
                    border:
                      "1px solid #1E293B",
                    borderRadius:
                      "20px",
                    padding: "30px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      color: "#F8FAFC",
                      fontSize: "23px",
                    }}
                  >
                    Company
                  </h2>

                  <p
                    style={{
                      color: "#64748B",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing:
                        "1px",
                    }}
                  >
                    COMPANY NAME
                  </p>

                  <p
                    style={{
                      color: "#F8FAFC",
                      fontSize: "20px",
                      marginTop:
                        "8px",
                    }}
                  >
                    {companyName}
                  </p>
                </div>

                {/* CONTACT */}

                <div
                  style={{
                    background:
                      "#0F172A",
                    border:
                      "1px solid #1E293B",
                    borderRadius:
                      "20px",
                    padding: "30px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      color: "#F8FAFC",
                      fontSize: "23px",
                    }}
                  >
                    Contact Information
                  </h2>

                  <p
                    style={{
                      color: "#64748B",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing:
                        "1px",
                    }}
                  >
                    EMAIL
                  </p>

                  <p
                    style={{
                      color: "#F8FAFC",
                      fontSize: "18px",
                      marginTop:
                        "8px",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {email}
                  </p>
                </div>

                {/* ACCOUNT ROLE */}

                <div
                  style={{
                    background:
                      "#0F172A",
                    border:
                      "1px solid #1E293B",
                    borderRadius:
                      "20px",
                    padding: "30px",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      color: "#F8FAFC",
                      fontSize: "23px",
                    }}
                  >
                    Account Role
                  </h2>

                  <p
                    style={{
                      color: "#64748B",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing:
                        "1px",
                    }}
                  >
                    ACCOUNT TYPE
                  </p>

                  <p
                    style={{
                      color: "#60A5FA",
                      fontSize: "20px",
                      fontWeight: "700",
                      marginTop:
                        "8px",
                    }}
                  >
                    Recruiter
                  </p>

                  <p
                    style={{
                      color: "#94A3B8",
                      marginBottom: 0,
                    }}
                  >
                    {profile?.is_company_admin
                      ? "Company Admin"
                      : "Recruiter"}
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default RecruiterProfile;