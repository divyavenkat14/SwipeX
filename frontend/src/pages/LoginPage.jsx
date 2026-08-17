import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("JOB_SEEKER");

  const navigate = useNavigate();

  const roleNames = {
    JOB_SEEKER: "Job Seeker",
    RECRUITER: "Recruiter",
    ADMIN: "Admin",
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const loginResponse = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          username,
          password,
        }
      );

      const accessToken = loginResponse.data.access;
      const refreshToken = loginResponse.data.refresh;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const userResponse = await axios.get(
        "http://127.0.0.1:8000/api/auth/me/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const actualRole = userResponse.data.role;

      console.log("Selected role:", selectedRole);
      console.log("Actual account role:", actualRole);

      // Check whether the selected role matches
      // the role stored in the user's account.
      if (actualRole !== selectedRole) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setMessage(
          `This account is registered as ${
            roleNames[actualRole] || actualRole
          }. Please select "${roleNames[actualRole] || actualRole}" to continue.`
        );

        return;
      }

      // Job Seeker
      if (actualRole === "JOB_SEEKER") {
        navigate("/job-seeker/dashboard");
        return;
      }

      // Recruiter
      if (actualRole === "RECRUITER") {
        navigate("/recruiter/dashboard");
        return;
      }

      // Admin
      if (actualRole === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setMessage(
        "This account does not have access to a SwipeX dashboard."
      );
    } catch (error) {
      console.error("Login error:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (error.response?.status === 401) {
        setMessage("Invalid username or password.");
      } else {
        setMessage(
          "Login failed. Please make sure the SwipeX backend is running."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="lux-login-page">
      <div className="lux-grid" />
      <div className="lux-noise" />

      <motion.div
        className="aurora aurora-one"
        animate={{
          x: [0, 120, 20, 0],
          y: [0, 50, 110, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="aurora aurora-two"
        animate={{
          x: [0, -90, -20, 0],
          y: [0, -70, 30, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <nav className="lux-nav">
        <motion.div
          className="lux-logo"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="lux-logo-symbol">
            <span />
            <span />
          </div>

          <strong>SwipeX</strong>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          CAREER DISCOVERY, REIMAGINED
        </motion.p>
      </nav>

      <section className="lux-login-layout">

        {/* LEFT SIDE */}
        <motion.div
          className="lux-hero"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          <motion.p
            className="lux-kicker"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            THE NEXT ERA OF WORK
          </motion.p>

          <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 35,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            Don't search
            <span>for the future.</span>
            <em>Swipe into it.</em>
          </motion.h1>

          <motion.p
            className="lux-hero-copy"
            variants={{
              hidden: {
                opacity: 0,
                y: 24,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            Intelligent matches. Real opportunities. A career experience
            designed around you.
          </motion.p>

          <motion.div
            className="floating-card-stage"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.9,
              },
              visible: {
                opacity: 1,
                scale: 1,
              },
            }}
          >
            <motion.article
              className="job-preview-card card-back"
              animate={{
                y: [0, -8, 0],
                rotate: [-8, -5, -8],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span>02</span>
            </motion.article>

            <motion.article
              className="job-preview-card card-middle"
              animate={{
                y: [0, 10, 0],
                rotate: [7, 4, 7],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span>03</span>
            </motion.article>

            <motion.article
              className="job-preview-card card-front"
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                y: -18,
                rotateX: 4,
                rotateY: -4,
              }}
            >
              <div className="job-card-top">
                <div className="company-chip">N</div>
                <span>94% MATCH</span>
              </div>

              <div>
                <p>NEURAL LABS</p>
                <h3>AI Product Analyst</h3>
              </div>

              <div className="job-tags">
                <span>Hybrid</span>
                <span>Chennai</span>
                <span>Full-time</span>
              </div>
            </motion.article>
          </motion.div>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.section
          className="lux-form-card"
          initial={{
            opacity: 0,
            x: 55,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="form-light" />

          <div className="lux-form-heading">
            <span>01 / SIGN IN</span>

            <h2>Welcome back.</h2>

            <p>Your next opportunity is waiting.</p>
          </div>

          {/* ROLE SELECTION */}
          <div className="role-selector">
            <p className="role-title">
              WHO ARE YOU?
            </p>

            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              Select the role you used when creating your account.
            </p>

            <div className="role-cards">

              {/* JOB SEEKER */}
              <button
                type="button"
                className={`role-card ${
                  selectedRole === "JOB_SEEKER"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedRole("JOB_SEEKER")
                }
              >
                <div className="role-icon">
                  👤
                </div>

                <div className="role-name">
                  <h4>Job Seeker</h4>
                  <p>Find your next opportunity</p>
                </div>
              </button>

              {/* RECRUITER */}
              <button
                type="button"
                className={`role-card ${
                  selectedRole === "RECRUITER"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedRole("RECRUITER")
                }
              >
                <div className="role-icon">
                  🏢
                </div>

                <div className="role-name">
                  <h4>Recruiter</h4>
                  <p>Hire top talent</p>
                </div>
              </button>

              {/* ADMIN */}
              <button
                type="button"
                className={`role-card ${
                  selectedRole === "ADMIN"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedRole("ADMIN")
                }
              >
                <div className="role-icon">
                  ⚙️
                </div>

                <div className="role-name">
                  <h4>Admin</h4>
                  <p>Manage SwipeX</p>
                </div>
              </button>

            </div>
          </div>

          {/* LOGIN FORM */}
          <form
            className="lux-form"
            onSubmit={handleLogin}
          >
            <label>
              <span>USERNAME</span>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Your username"
                required
              />
            </label>

            <label>
              <span>PASSWORD</span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Your password"
                required
              />
            </label>

            <div className="lux-form-options">

              <label className="lux-remember">
                <input type="checkbox" />

                <span>
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Password recovery will be available soon."
                  )
                }
              >
                Forgot password?
              </button>

            </div>

            <motion.button
              className="lux-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.985,
              }}
            >
              <span>
                {isLoading
                  ? "Signing in..."
                  : `Continue as ${
                      roleNames[selectedRole]
                    }`}
              </span>

              <span className="submit-arrow">
                ↗
              </span>
            </motion.button>
          </form>

          {message && (
            <p className="lux-message">
              {message}
            </p>
          )}

          <div className="lux-register">
            <span>NEW HERE?</span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create your account
              <span>→</span>
            </button>
          </div>

        </motion.section>
      </section>

      <footer className="lux-footer">
        <span>SWIPEX © 2026</span>
        <span>FIND WORK THAT FITS.</span>
      </footer>
    </main>
  );
}

export default LoginPage;