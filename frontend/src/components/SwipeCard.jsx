import { motion } from "framer-motion";

function SwipeCard({
  job,
  matchScore = 0,
  index,
  currentIndex,
  direction,
  onSwipe,
}) {
  if (!job) return null;

  if (index < currentIndex || index > currentIndex + 2) {
    return null;
  }

  const offset = index - currentIndex;

  // -----------------------------
  // MATCH INFORMATION
  // -----------------------------

  const getMatchInfo = (score) => {
    if (score >= 80) {
      return {
        label: "Excellent Match",
        color: "#16a34a",
        icon: "🔥",
      };
    }

    if (score >= 60) {
      return {
        label: "Good Match",
        color: "#f59e0b",
        icon: "🎯",
      };
    }

    if (score >= 40) {
      return {
        label: "Moderate Match",
        color: "#eab308",
        icon: "🟡",
      };
    }

    return {
      label: "Low Match",
      color: "#dc2626",
      icon: "⚪",
    };
  };

  const matchInfo = getMatchInfo(matchScore);

  // -----------------------------
  // COMPETITION INFORMATION
  // -----------------------------

  const getCompetitionInfo = (level) => {
    if (level === "LOW") {
      return {
        label: "Low Competition",
        color: "#22c55e",
        icon: "🟢",
      };
    }

    if (level === "MEDIUM") {
      return {
        label: "Medium Competition",
        color: "#f59e0b",
        icon: "🟡",
      };
    }

    return {
      label: "High Competition",
      color: "#ef4444",
      icon: "🔴",
    };
  };

  const competitionInfo = getCompetitionInfo(
    job.competition_level
  );

  return (
    <motion.div
      animate={{
        x:
          index === currentIndex
            ? direction === 1
              ? 1200
              : direction === -1
              ? -1200
              : 0
            : 0,

        rotate:
          index === currentIndex
            ? direction === 1
              ? 20
              : direction === -1
              ? -20
              : 0
            : 0,

        scale: 1 - offset * 0.04,
        y: offset * 18,

        opacity:
          index === currentIndex
            ? 1
            : 0.95 - offset * 0.1,
      }}
      transition={{
        duration: 0.35,
      }}
      style={{
        position: "absolute",
        width: "100%",
        background: "#0d1224",
        border: "1px solid #2d3748",
        borderRadius: "24px",
        padding: "30px",
        boxSizing: "border-box",
        zIndex: 100 - offset,
      }}
    >
      {/* -------------------------------- */}
      {/* TITLE + MATCH SCORE */}
      {/* -------------------------------- */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          gap: "15px",
        }}
      >
        <h2
          style={{
            margin: 0,
          }}
        >
          {job.title}
        </h2>

        <div
          style={{
            background: matchInfo.color,
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {matchScore}% Match
        </div>
      </div>

      {/* -------------------------------- */}
      {/* MATCH CATEGORY */}
      {/* -------------------------------- */}

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          padding: "6px 12px",
          borderRadius: "15px",
          background: `${matchInfo.color}22`,
          border: `1px solid ${matchInfo.color}`,
          color: matchInfo.color,
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "18px",
        }}
      >
        <span>{matchInfo.icon}</span>
        <span>{matchInfo.label}</span>
      </div>

      {/* -------------------------------- */}
      {/* COMPANY */}
      {/* -------------------------------- */}

      <p>🏢 {job.company_name}</p>

      {/* -------------------------------- */}
      {/* LOCATION */}
      {/* -------------------------------- */}

      <p>📍 {job.location}</p>

      {/* -------------------------------- */}
      {/* JOB TYPE */}
      {/* -------------------------------- */}

      <p>💼 {job.job_type}</p>

      {/* -------------------------------- */}
      {/* EXPERIENCE */}
      {/* -------------------------------- */}

      <p>⭐ {job.experience_level}</p>

      {/* -------------------------------- */}
      {/* DESCRIPTION */}
      {/* -------------------------------- */}

      <p
        style={{
          marginTop: "15px",
        }}
      >
        {job.description}
      </p>

      {/* -------------------------------- */}
      {/* COMPETITION INDICATOR */}
      {/* -------------------------------- */}

      <div
        style={{
          marginTop: "20px",
          padding: "14px 16px",
          borderRadius: "12px",
          background: `${competitionInfo.color}12`,
          border: `1px solid ${competitionInfo.color}55`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: competitionInfo.color,
              fontWeight: "700",
            }}
          >
            <span>{competitionInfo.icon}</span>

            <span>
              {competitionInfo.label}
            </span>
          </div>

          <div
            style={{
              color: "#CBD5E1",
              fontSize: "14px",
            }}
          >
            {job.applicant_count}{" "}
            {job.applicant_count === 1
              ? "applicant"
              : "applicants"}
          </div>
        </div>

        {/* EARLY APPLICANT INDICATOR */}

        {job.is_early_applicant && (
          <div
            style={{
              marginTop: "8px",
              color: "#60A5FA",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            ⚡ Early applicant opportunity
          </div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* SWIPE BUTTONS */}
      {/* -------------------------------- */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => onSwipe(-1)}
          style={{
            fontSize: "38px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ❌
        </button>

        <button
          onClick={() => onSwipe(1)}
          style={{
            fontSize: "38px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ❤️
        </button>
      </div>
    </motion.div>
  );
}

export default SwipeCard;