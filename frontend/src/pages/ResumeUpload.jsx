import { useState } from "react";
import api from "../services/api";
import JobSeekerLayout from "../layouts/JobSeekerLayout";

function ResumeUpload() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        console.log("Title:", title);
        console.log("File:", file);
        if (!title || !file) {
            alert("Please enter a title and select a resume.");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("file", file);

        try {
            await api.post("/resumes/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Resume uploaded successfully!");

            setTitle("");
            setFile(null);
        } catch (error) {
            console.log(error);
            alert("Resume upload failed.");
        }
    };

    return (
        <JobSeekerLayout>
            <div
                style={{
                    maxWidth: "700px",
                    margin: "40px auto",
                    background: "#111827",
                    padding: "30px",
                    borderRadius: "15px",
                    color: "white",
                }}
            >
                <h1>Upload Resume</h1>

                <p style={{ color: "#9ca3af" }}>
                    Upload your latest resume for AI analysis.
                </p>

                <div style={{ marginTop: "30px" }}>
                    <label>Resume Title</label>

                    <input
                        type="text"
                        placeholder="Software Engineer Resume"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                        }}
                    />

                    <label>Select Resume</label>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{
                            display: "block",
                            marginTop: "10px",
                        }}
                    />

                    {file && (
                        <p style={{ marginTop: "15px" }}>
                            Selected: {file.name}
                        </p>
                    )}

                    <button
                        onClick={handleUpload}
                        style={{
                            marginTop: "25px",
                            padding: "12px 25px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        Upload Resume
                    </button>
                </div>
            </div>
        </JobSeekerLayout>
    );
}

export default ResumeUpload;