import { useEffect, useState } from "react";
import api from "../services/api";
import { getATSScore } from "../services/ats";

function ApplyModal({ job, onClose, onApply }) {
    const [ats, setATS] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");

    useEffect(() => {
        if (!job) return;

        const loadData = async () => {
            try {
                const resumeResponse = await api.get("/resumes/");

                setResumes(resumeResponse.data);

                if (resumeResponse.data.length > 0) {

                    const defaultResume =
                        resumeResponse.data.find(
                            (r) => r.is_default
                        ) || resumeResponse.data[0];

                    const resumeId = defaultResume.id;

                    setSelectedResume(resumeId);

                    const result = await getATSScore(
                        resumeId,
                        job.id
                    );

                    setATS(result);
                }

            } catch (error) {
                console.log(error);
            }
        };

        loadData();
    }, [job]);

    const handleResumeChange = async (e) => {

        const resumeId = Number(e.target.value);

        setSelectedResume(resumeId);

        try {

            const result = await getATSScore(
                resumeId,
                job.id
            );

            setATS(result);

        } catch (error) {
            console.log(error);
        }
    };

    if (!job) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.65)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        >
            <div
                style={{
                    width: "760px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "#111827",
                    color: "white",
                    borderRadius: "20px",
                    padding: "30px",
                }}
            >
                <h2>{job.title}</h2>

                <p>
                    <strong>Location:</strong> {job.location}
                </p>

                <p
                    style={{
                        color: "#d1d5db",
                    }}
                >
                    {job.description}
                </p>

                <hr style={{ margin: "25px 0" }} />


                {ats ? (
                    <>

                        <div
                            style={{
                                background: "#1f2937",
                                borderRadius: "15px",
                                padding: "25px",
                                textAlign: "center",
                                marginBottom: "25px",
                            }}
                        >
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "65px",
                                    color:
                                        ats.ats_score >= 80
                                            ? "#22c55e"
                                            : ats.ats_score >= 60
                                                ? "#f59e0b"
                                                : "#ef4444",
                                }}
                            >
                                {ats.ats_score}%
                            </h1>

                            <p
                                style={{
                                    color: "#9ca3af",
                                    fontSize: "18px",
                                }}
                            >
                                ATS Match Score
                            </p>
                        </div>

                        <h3
                            style={{
                                color: "#fbbf24",
                                marginBottom: "15px",
                            }}
                        >
                            📈 Hiring Chance
                        </h3>

                        <div
                            style={{
                                background:
                                    ats.hiring_chance === "High"
                                        ? "#14532d"
                                        : ats.hiring_chance === "Medium"
                                            ? "#854d0e"
                                            : "#7f1d1d",
                                padding: "18px",
                                borderRadius: "12px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginBottom: "25px",
                            }}
                        >
                            {ats.hiring_chance}
                        </div>

                        {ats.strengths &&
                            ats.strengths.length > 0 && (

                                <div
                                    style={{
                                        background: "#064e3b",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        marginBottom: "25px",
                                    }}
                                >
                                    <h3>
                                        💪 Your Strengths
                                    </h3>

                                    {ats.strengths.map(
                                        (item, index) => (
                                            <p key={index}>
                                                ✔ {item}
                                            </p>
                                        )
                                    )}
                                </div>
                            )}

                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginBottom: "25px",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    background: "#064e3b",
                                    borderRadius: "12px",
                                    padding: "20px",
                                }}
                            >
                                <h3>
                                    ✅ Matched Skills
                                </h3>

                                {ats.matched_skills.length === 0 ? (
                                    <p>No skills matched.</p>
                                ) : (
                                    ats.matched_skills.map(
                                        (skill) => (
                                            <p key={skill}>
                                                ✔ {skill}
                                            </p>
                                        )
                                    )
                                )}
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                    background: "#7f1d1d",
                                    borderRadius: "12px",
                                    padding: "20px",
                                }}
                            >
                                <h3>
                                    ❌ Missing Skills
                                </h3>

                                {ats.missing_skills.length === 0 ? (
                                    <p>No missing skills.</p>
                                ) : (
                                    ats.missing_skills.map(
                                        (skill) => (
                                            <p key={skill}>
                                                ✖ {skill}
                                            </p>
                                        )
                                    )
                                )}
                            </div>
                        </div>

                        <div
                            style={{
                                background: "#1e3a8a",
                                borderRadius: "12px",
                                padding: "20px",
                                marginBottom: "25px",
                            }}
                        >
                            <h3>
                                💡 AI Recommendation
                            </h3>

                            <div
                                style={{
                                    whiteSpace: "pre-line",
                                    lineHeight: "1.8",
                                }}
                            >
                                {ats.recommendation}
                            </div>
                        </div>

                    </>
                ) : (
                    <p>Calculating ATS Score...</p>
                )}

                <label>
                    <strong>Cover Letter</strong>
                </label>

                <textarea
                    rows="5"
                    placeholder="Write your cover letter..."
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        borderRadius: "10px",
                        marginBottom: "25px",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onApply}
                        style={{
                            padding: "12px 24px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Apply Now
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ApplyModal;