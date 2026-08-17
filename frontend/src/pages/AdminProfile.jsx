import { useEffect, useState } from "react";
import api from "../services/api";

import AdminSidebar from "../components/AdminSidebar";
import TopNavbar from "../components/TopNavbar";

function AdminProfile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  // =====================================================
  // FETCH ADMIN USER
  // =====================================================

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/auth/me/"
      );

      console.log(
        "Admin user:",
        response.data
      );

      setUser(response.data);

      setFormData({
        username:
          response.data.username || "",
        email:
          response.data.email || "",
      });
    } catch (error) {
      console.error(
        "Failed to fetch admin:",
        error
      );

      setError(
        "Unable to load your admin profile."
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
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      /*
       * We are intentionally using the existing
       * /auth/me/ endpoint for now.
       *
       * If your backend does not support PUT here,
       * we will connect the proper admin update
       * endpoint in the next step.
       */

      const response = await api.put(
        "/auth/me/",
        {
          username: formData.username,
          email: formData.email,
        }
      );

      console.log(
        "Updated admin:",
        response.data
      );

      setUser(response.data);

      setFormData({
        username:
          response.data.username || "",
        email:
          response.data.email || "",
      });

      setIsEditing(false);

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update admin:",
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
    if (!user) {
      return;
    }

    setFormData({
      username:
        user.username || "",
      email:
        user.email || "",
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
        <AdminSidebar />

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <TopNavbar title="Admin Portal" />

          <main
            style={{
              padding: "30px",
            }}
          >
            <div
              style={{
                background: "#0F172A",
                border:
                  "1px solid #1E293B",
                borderRadius: "20px",
                padding: "40px",
                color: "#94A3B8",
                fontSize: "18px",
              }}
            >
              Loading your admin profile...
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // USER DATA
  // =====================================================

  const username =
    user?.username || "Admin";

  const email =
    user?.email ||
    "Email not specified";

  const firstLetter =
    username.charAt(0).toUpperCase();

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
          ADMIN SIDEBAR
      ================================================= */}

      <AdminSidebar />

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* TOP NAVBAR */}

        <TopNavbar title="Admin Portal" />

        {/* PAGE */}

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
              ADMIN ACCOUNT
            </div>

            <h1
              style={{
                margin: 0,
                color: "#F8FAFC",
                fontSize: "42px",
                fontWeight: "700",
              }}
            >
              Admin Profile
            </h1>

            <p
              style={{
                color: "#94A3B8",
                fontSize: "18px",
                marginTop: "12px",
              }}
            >
              Manage your administrator account
              information.
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
                    margin: "0 0 8px",
                    color: "#F8FAFC",
                    fontSize: "30px",
                  }}
                >
                  {username}
                </h2>

                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#60A5FA",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  Administrator
                </p>

                <p
                  style={{
                    margin: 0,
                    color: "#94A3B8",
                    fontSize: "16px",
                  }}
                >
                  {email}
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
                  padding: "13px 24px",
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
                Edit Admin Profile
              </h2>

              {/* USERNAME */}

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
                  USERNAME
                </span>

                <input
                  type="text"
                  name="username"
                  value={
                    formData.username
                  }
                  onChange={
                    handleChange
                  }
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
                    color:
                      "#F8FAFC",
                    fontSize: "17px",
                    outline: "none",
                  }}
                />
              </label>

              {/* EMAIL */}

              <label
                style={{
                  display: "block",
                  marginBottom: "30px",
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
                  EMAIL
                </span>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
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
                    color:
                      "#F8FAFC",
                    fontSize: "17px",
                    outline: "none",
                  }}
                />
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
                    color:
                      "#CBD5E1",
                    fontSize: "16px",
                    fontWeight:
                      "600",
                    cursor:
                      "pointer",
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
                    fontWeight:
                      "700",
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
            /* =================================================
               PROFILE INFORMATION
            ================================================= */

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "25px",
              }}
            >
              {/* ACCOUNT */}

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
                  Account
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
                  USERNAME
                </p>

                <p
                  style={{
                    color: "#F8FAFC",
                    fontSize: "20px",
                    marginTop: "8px",
                  }}
                >
                  {username}
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
                  Contact
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
                    marginTop: "8px",
                    wordBreak:
                      "break-word",
                  }}
                >
                  {email}
                </p>
              </div>

              {/* ROLE */}

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
                  ROLE
                </p>

                <p
                  style={{
                    color: "#60A5FA",
                    fontSize: "20px",
                    fontWeight: "700",
                    marginTop: "8px",
                    marginBottom: 0,
                  }}
                >
                  Administrator
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminProfile;