import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import "./RegisterPage.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "JOB_SEEKER",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      console.log(formData);
      await axios.post(
          "https://swipex-backend-6zfm.onrender.com/api/auth/register/",
           formData
  );

      setMessage("Account created. Taking you to sign in...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const backendError = error.response?.data;

      setMessage(
        backendError
          ? Object.values(backendError).flat().join(" ")
          : "Registration failed. Please check your details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: "JOB_SEEKER",
      number: "01",
      title: "Find my next move",
      description: "Discover roles matched to your skills and ambition.",
    },
    {
      value: "RECRUITER",
      number: "02",
      title: "Build my next team",
      description: "Discover candidates beyond the traditional resume.",
    },
  ];

  return (
    <main className="register-page">
      <div className="register-grid" />

      <motion.div
        className="register-glow register-glow-one"
        animate={{
          x: [0, 100, 0],
          y: [0, 60, 0],
          scale: [1, 1.18, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="register-glow register-glow-two"
        animate={{
          x: [0, -70, 0],
          y: [0, -90, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <nav className="register-nav">
        <button
          type="button"
          className="register-brand"
          onClick={() => navigate("/login")}
        >
          <div className="register-brand-symbol">
            <span />
            <span />
          </div>
          <strong>SwipeX</strong>
        </button>

        <button
          type="button"
          className="back-to-login"
          onClick={() => navigate("/login")}
        >
          <span>←</span>
          Back to sign in
        </button>
      </nav>

      <section className="register-layout">
        <motion.div
          className="register-story"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.13,
              },
            },
          }}
        >
          <motion.p
            className="register-kicker"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            YOUR CAREER. YOUR DIRECTION.
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 35 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            One account.
            <span>Infinite next moves.</span>
          </motion.h1>

          <motion.p
            className="register-story-copy"
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Start with who you are. SwipeX turns your skills, ambitions,
            and choices into better career possibilities.
          </motion.p>

          <motion.div
            className="register-progress"
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div>
              <span className="progress-number active">01</span>
              <span className="progress-line active" />
            </div>

            <div>
              <span className="progress-number">02</span>
              <span className="progress-line" />
            </div>

            <div>
              <span className="progress-number">03</span>
            </div>
          </motion.div>

          <motion.p
            className="register-progress-label"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            CREATE ACCOUNT
            <span>→</span>
            BUILD YOUR PROFILE
            <span>→</span>
            START DISCOVERING
          </motion.p>
        </motion.div>

        <motion.section
          className="register-card"
          initial={{ opacity: 0, x: 60, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="register-card-light" />

          <div className="register-heading">
            <span>01 / CREATE ACCOUNT</span>
            <h2>How will you use SwipeX?</h2>
            <p>Choose your path. You can complete your profile next.</p>
          </div>

          <div className="role-selector">
            {roles.map((role) => {
              const isSelected = formData.role === role.value;

              return (
                <motion.button
                  key={role.value}
                  type="button"
                  className={`role-card ${isSelected ? "selected" : ""}`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      role: role.value,
                    })
                  }
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <span className="role-number">{role.number}</span>

                  <div>
                    <strong>{role.title}</strong>
                    <p>{role.description}</p>
                  </div>

                  <span className="role-check">
                    {isSelected ? "✓" : ""}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-field-row">
              <label>
                <span>USERNAME</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>EMAIL</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="register-field-row">
              <label>
                <span>PASSWORD</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>CONFIRM PASSWORD</span>
                <input
                  type="password"
                  name="password_confirm"
                  placeholder="Repeat your password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <motion.button
              className="register-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
            >
              <span>
                {isLoading ? "Creating your account..." : "Create account"}
              </span>
              <span className="register-submit-arrow">↗</span>
            </motion.button>
          </form>

          {message && (
            <p
              className={`register-message ${
                message.startsWith("Account created") ? "success" : ""
              }`}
            >
              {message}
            </p>
          )}

          <p className="register-terms">
            By continuing, you agree to the SwipeX Terms and Privacy Policy.
          </p>
        </motion.section>
      </section>
    </main>
  );
}

export default RegisterPage;
