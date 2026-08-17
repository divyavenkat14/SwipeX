def calculate_ats_score(
    resume_skills,
    job_skills,
    job_title="",
):

    # =====================================================
    # RESUME SKILLS
    # =====================================================

    resume_set = {
        skill.strip().lower()
        for skill in resume_skills
        if skill
    }

    # =====================================================
    # JOB SKILLS
    # =====================================================

    job_set = {
        skill.strip().lower()
        for skill in job_skills
        if skill
    }

    # =====================================================
    # FALLBACK ROLE SKILLS
    #
    # If recruiter has not added structured skills,
    # use reasonable skills expected for the job role.
    # =====================================================

    role_skills = {

        "data analyst": [
            "Python",
            "SQL",
            "Power BI",
            "Tableau",
            "Excel",
            "Data Analysis",
        ],

        "ai engineer": [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "SQL",
            "Git",
        ],

        "machine learning engineer": [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "SQL",
            "Git",
        ],

        "frontend developer": [
            "React",
            "JavaScript",
            "HTML",
            "CSS",
            "Git",
        ],

        "react": [
            "React",
            "JavaScript",
            "HTML",
            "CSS",
            "Git",
        ],

        "full stack developer": [
            "React",
            "Node.js",
            "JavaScript",
            "HTML",
            "CSS",
            "SQL",
            "Git",
        ],

        "software engineer": [
            "Python",
            "Java",
            "SQL",
            "Git",
            "Problem Solving",
        ],

        "cloud engineer": [
            "AWS",
            "Docker",
            "Kubernetes",
            "Git",
            "Python",
        ],

        "sap engineer": [
            "Java",
            "SQL",
            "Problem Solving",
            "Git",
        ],

        "business analyst": [
            "SQL",
            "Power BI",
            "Excel",
            "Data Analysis",
            "Communication",
        ],

        "quality analyst": [
            "Python",
            "SQL",
            "Git",
            "Problem Solving",
            "Communication",
        ],
    }

    # =====================================================
    # USE FALLBACK ONLY WHEN JOB HAS NO SKILLS
    # =====================================================

    used_fallback = False

    if not job_set:

        title = job_title.lower().strip()

        # Exact role first
        if title in role_skills:

            job_set = {
                skill.lower()
                for skill in role_skills[title]
            }

            used_fallback = True

        else:

            # Partial title matching
            for role, skills in role_skills.items():

                if role in title:

                    job_set = {
                        skill.lower()
                        for skill in skills
                    }

                    used_fallback = True
                    break

    # =====================================================
    # MATCHING
    # =====================================================

    matched = sorted(
        resume_set & job_set
    )

    missing = sorted(
        job_set - resume_set
    )

    total = len(job_set)

    matched_count = len(matched)

    # =====================================================
    # SCORE
    # =====================================================

    if total == 0:

        score = 0

    else:

        score = round(
            (matched_count / total) * 100
        )

    # =====================================================
    # STRENGTHS
    # =====================================================

    strengths = []

    if matched:

        strengths.append(
            "Your resume already matches these important "
            "skills: "
            + ", ".join(matched)
            + "."
        )

    # =====================================================
    # HIRING CHANCE
    # =====================================================

    if score >= 80:

        hiring_chance = "High"

    elif score >= 60:

        hiring_chance = "Medium"

    elif score >= 40:

        hiring_chance = "Moderate"

    else:

        hiring_chance = "Low"

    # =====================================================
    # ROLE RECOMMENDATION
    # =====================================================

    title = job_title.lower()

    if "cloud" in title:

        recommendation = (
            "Strengthen your cloud profile by building "
            "projects using AWS EC2, S3, Docker and "
            "deployment pipelines."
        )

    elif "data analyst" in title:

        recommendation = (
            "Improve your analytics profile by adding "
            "Power BI, Tableau, Excel dashboards and "
            "SQL projects."
        )

    elif "business analyst" in title:

        recommendation = (
            "Improve your Business Analyst profile with "
            "Excel, Power BI, SQL, stakeholder communication "
            "and requirement gathering experience."
        )

    elif "software" in title:

        recommendation = (
            "Build more full-stack projects and strengthen "
            "DSA, Git and system design knowledge."
        )

    elif "full stack" in title:

        recommendation = (
            "Strengthen your full-stack profile with "
            "React, Node.js, databases, REST APIs and "
            "deployment projects."
        )

    elif "frontend" in title or "react" in title:

        recommendation = (
            "Strengthen your frontend profile with React, "
            "JavaScript, HTML, CSS, REST APIs and "
            "responsive UI projects."
        )

    elif "ai" in title:

        recommendation = (
            "Strengthen Machine Learning, Deep Learning, "
            "TensorFlow, Scikit-learn and model deployment "
            "skills."
        )

    elif "sap" in title:

        recommendation = (
            "Strengthen your SAP profile with relevant "
            "enterprise development, SQL and backend "
            "technologies."
        )

    elif "quality" in title:

        recommendation = (
            "Strengthen your testing and quality profile "
            "with automation, SQL, Git and problem-solving "
            "skills."
        )

    else:

        recommendation = (
            "Consider adding the missing skills through "
            "projects and certifications."
        )

    # =====================================================
    # TELL USER WHEN FALLBACK WAS USED
    # =====================================================

    if used_fallback:

        recommendation += (
            "\n\nℹ️ Note: This job did not have structured "
            "skills configured by the recruiter. The score "
            "was estimated using common skills associated "
            "with this role."
        )

    # =====================================================
    # PRIORITY SKILLS + ACTION PLAN
    # =====================================================

    if missing:

        recommendation += (
            "\n\n📌 Priority Skills\n"
            + "\n".join(
                f"• {skill}"
                for skill in missing
            )
        )

        recommendation += (
            "\n\n🚀 Suggested Action Plan"
        )

        for skill in missing:

            s = skill.lower()

            if s == "aws":

                recommendation += (
                    "\n• Build one AWS EC2 + S3 "
                    "deployment project."
                )

            elif s == "docker":

                recommendation += (
                    "\n• Containerize one application "
                    "using Docker."
                )

            elif s == "python":

                recommendation += (
                    "\n• Solve Python coding problems "
                    "and build one backend project."
                )

            elif s == "sql":

                recommendation += (
                    "\n• Practice SQL joins, window "
                    "functions and database queries."
                )

            elif s == "power bi":

                recommendation += (
                    "\n• Build an interactive Power BI "
                    "dashboard."
                )

            elif s == "tableau":

                recommendation += (
                    "\n• Create a Tableau dashboard "
                    "using real datasets."
                )

            elif s == "excel":

                recommendation += (
                    "\n• Learn Pivot Tables, VLOOKUP "
                    "and dashboard creation."
                )

            elif s == "machine learning":

                recommendation += (
                    "\n• Build one Machine Learning "
                    "project using Scikit-learn."
                )

            elif s == "tensorflow":

                recommendation += (
                    "\n• Develop one Deep Learning "
                    "project using TensorFlow."
                )

            elif s == "git":

                recommendation += (
                    "\n• Upload your projects regularly "
                    "to GitHub."
                )

            elif s == "react":

                recommendation += (
                    "\n• Build a React project using "
                    "reusable components and REST APIs."
                )

            elif s == "node.js":

                recommendation += (
                    "\n• Build a Node.js REST API "
                    "and connect it to a database."
                )

            elif s == "javascript":

                recommendation += (
                    "\n• Strengthen modern JavaScript "
                    "and asynchronous programming."
                )

            elif s == "html":

                recommendation += (
                    "\n• Improve semantic HTML and "
                    "accessible page structure."
                )

            elif s == "css":

                recommendation += (
                    "\n• Build responsive interfaces "
                    "using modern CSS."
                )

            elif s == "kubernetes":

                recommendation += (
                    "\n• Learn Kubernetes basics and "
                    "deploy a containerized application."
                )

            elif s == "problem solving":

                recommendation += (
                    "\n• Practice DSA and problem-solving "
                    "questions regularly."
                )

            elif s == "communication":

                recommendation += (
                    "\n• Improve communication through "
                    "presentations, discussions and interviews."
                )

            else:

                recommendation += (
                    f"\n• Gain practical experience "
                    f"with {skill}."
                )

    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return {
        "ats_score": score,

        "matched_skills": matched,

        "missing_skills": missing,

        "matched_count": matched_count,

        "total_job_skills": total,

        "strengths": strengths,

        "recommendation": recommendation,

        "hiring_chance": hiring_chance,

        "used_fallback": used_fallback,
    }