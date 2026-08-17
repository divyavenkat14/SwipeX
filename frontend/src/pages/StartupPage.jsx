import { useEffect, useState } from "react";
import api from "../services/api";

function StartupPage() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await api.get("/companies/?type=STARTUP");
      setStartups(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>🚀 Startups</h1>

      {startups.map((startup) => (
        <div
          key={startup.id}
          style={{
            background: "#111827",
            color: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
          }}
        >
          <h2>{startup.name}</h2>

          <p>🚀 {startup.company_type}</p>

          <p>📍 {startup.headquarters || "Not Available"}</p>

          <p>✅ {startup.verification_status}</p>
        </div>
      ))}
    </div>
  );
}

export default StartupPage;
