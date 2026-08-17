import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function TopNavbar({ title }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me/");

      console.log("Logged in user:", response.data);

      setUser(response.data);
    } catch (error) {
      console.error(
        "Unable to fetch user:",
        error
      );
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get(
        "/notifications/"
      );

      setNotifications(response.data || []);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error
      );
    }
  };

  /*
   * ==========================================
   * ROLE-BASED PROFILE NAVIGATION
   * ==========================================
   */

  const handleProfile = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);

    console.log(
      "Opening profile for role:",
      user?.role
    );

    if (user?.role === "RECRUITER") {
      navigate("/recruiter/profile");
      return;
    }

    if (user?.role === "ADMIN") {
      navigate("/admin/profile");
      return;
    }

    navigate("/job-seeker/profile");
  };

  /*
   * ==========================================
   * NOTIFICATIONS
   * ==========================================
   */

  const handleNotifications = () => {
    setShowProfileMenu(false);
    setShowNotifications(true);
  };

  /*
   * ==========================================
   * ACCOUNT SETTINGS
   * ==========================================
   */

  const handleSettings = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);

    if (user?.role === "RECRUITER") {
      navigate("/recruiter/profile");
      return;
    }

    if (user?.role === "ADMIN") {
      navigate("/admin/profile");
      return;
    }

    navigate("/job-seeker/profile");
  };

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");

    setShowProfileMenu(false);
    setShowNotifications(false);

    navigate("/login");
  };

  /*
   * ==========================================
   * USER DISPLAY DATA
   * ==========================================
   */

  const displayName =
    user?.first_name ||
    user?.username ||
    "User";

  const username =
    user?.username ||
    "SwipeX User";

  const firstLetter =
    displayName.charAt(0).toUpperCase();

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.is_read
  ).length;

  return (
    <div
      style={{
        height: "78px",
        background: "#0F172A",
        borderBottom: "1px solid #1E293B",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 100,
      }}
    >
      {/* =========================================
          PAGE TITLE
      ========================================= */}

      <h2
        style={{
          margin: 0,
          color: "#F8FAFC",
          fontSize: "27px",
          fontWeight: "700",
        }}
      >
        {title}
      </h2>

      {/* =========================================
          RIGHT SIDE
      ========================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
        }}
      >
        {/* =======================================
            NOTIFICATION BUTTON
        ======================================= */}

        <button
          type="button"
          onClick={handleNotifications}
          style={{
            position: "relative",
            border: "none",
            background: "transparent",
            fontSize: "26px",
            cursor: "pointer",
            padding: "5px",
          }}
          title="Notifications"
        >
          🔔

          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-4px",
                minWidth: "18px",
                height: "18px",
                padding: "0 4px",
                borderRadius: "20px",
                background: "#EF4444",
                color: "white",
                fontSize: "10px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              {unreadCount > 9
                ? "9+"
                : unreadCount}
            </span>
          )}
        </button>

        {/* =======================================
            PROFILE AREA
        ======================================= */}

        <div
          ref={profileRef}
          style={{
            position: "relative",
          }}
        >
          {/* PROFILE ICON */}

          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(
                (previous) => !previous
              );

              setShowNotifications(false);
            }}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid #3B82F6",
              background:
                "linear-gradient(135deg, #2563EB, #60A5FA)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "21px",
              cursor: "pointer",
              fontWeight: "700",
              padding: 0,
            }}
            title="Account"
          >
            👤
          </button>

          {/* =====================================
              PROFILE DROPDOWN
          ===================================== */}

          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: 0,
                width: "300px",
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "16px",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.45)",
                overflow: "hidden",
                color: "white",
              }}
            >
              {/* USER HEADER */}

              <div
                style={{
                  padding: "20px",
                  borderBottom:
                    "1px solid #334155",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    minWidth: "52px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #2563EB, #60A5FA)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "21px",
                    fontWeight: "700",
                  }}
                >
                  {firstLetter}
                </div>

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "#F8FAFC",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayName}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#94A3B8",
                      marginTop: "3px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    @{username}
                  </div>

                  {/* ROLE */}

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#60A5FA",
                      marginTop: "5px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                    }}
                  >
                    {user?.role === "RECRUITER"
                      ? "RECRUITER"
                      : user?.role === "ADMIN"
                      ? "ADMIN"
                      : "JOB SEEKER"}
                  </div>
                </div>
              </div>

              {/* =================================
                  VIEW PROFILE
              ================================= */}

              <button
                type="button"
                onClick={handleProfile}
                style={menuButtonStyle}
              >
                <span style={menuIconStyle}>
                  👤
                </span>

                <span>
                  View Profile
                </span>
              </button>

              {/* =================================
                  NOTIFICATIONS
              ================================= */}

              <button
                type="button"
                onClick={handleNotifications}
                style={menuButtonStyle}
              >
                <span style={menuIconStyle}>
                  🔔
                </span>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Notifications

                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: "#EF4444",
                        color: "white",
                        borderRadius: "20px",
                        padding: "2px 7px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
              </button>

              {/* DIVIDER */}

              <div
                style={{
                  height: "1px",
                  background: "#334155",
                  margin: "5px 0",
                }}
              />

              {/* =================================
                  ACCOUNT SETTINGS
              ================================= */}

              <button
                type="button"
                onClick={handleSettings}
                style={menuButtonStyle}
              >
                <span style={menuIconStyle}>
                  ⚙️
                </span>

                <span>
                  Account Settings
                </span>
              </button>

              {/* =================================
                  SIGN OUT
              ================================= */}

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  ...menuButtonStyle,
                  color: "#FCA5A5",
                }}
              >
                <span style={menuIconStyle}>
                  ↪
                </span>

                <span>
                  Sign out
                </span>
              </button>
            </div>
          )}

          {/* =====================================
              NOTIFICATION POPUP
          ===================================== */}

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: 0,
                width: "380px",
                maxHeight: "500px",
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "16px",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.5)",
                overflow: "hidden",
              }}
            >
              {/* HEADER */}

              <div
                style={{
                  padding: "18px 20px",
                  background: "#1E293B",
                  borderBottom:
                    "1px solid #334155",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#F8FAFC",
                    fontSize: "19px",
                  }}
                >
                  Notifications
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94A3B8",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>

              {/* NOTIFICATION LIST */}

              <div
                style={{
                  maxHeight: "420px",
                  overflowY: "auto",
                }}
              >
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "35px 20px",
                      textAlign: "center",
                      color: "#94A3B8",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "30px",
                        marginBottom: "10px",
                      }}
                    >
                      🔔
                    </div>

                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: "18px 20px",
                          borderBottom:
                            "1px solid #1E293B",
                          background:
                            notification.is_read
                              ? "#0F172A"
                              : "#111C32",
                        }}
                      >
                        <div
                          style={{
                            color: "#F8FAFC",
                            fontWeight: "700",
                            fontSize: "15px",
                            marginBottom: "7px",
                          }}
                        >
                          {notification.title}
                        </div>

                        <div
                          style={{
                            color: "#94A3B8",
                            fontSize: "14px",
                            lineHeight: "1.5",
                          }}
                        >
                          {notification.message}
                        </div>

                        {!notification.is_read && (
                          <div
                            style={{
                              color: "#60A5FA",
                              fontSize: "12px",
                              marginTop: "8px",
                              fontWeight: "600",
                            }}
                          >
                            New
                          </div>
                        )}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   MENU STYLES
========================================================= */

const menuButtonStyle = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#E2E8F0",
  padding: "14px 20px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  fontSize: "15px",
  cursor: "pointer",
  textAlign: "left",
};

const menuIconStyle = {
  width: "25px",
  textAlign: "center",
  fontSize: "19px",
};


export default TopNavbar;