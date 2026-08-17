KNOWN_SKILLS = [
    "Python",
    "Java",
    "C++",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "React",
    "Node.js",
    "Django",
    "Flask",
    "HTML",
    "CSS",
    "JavaScript",
    "AWS",
    "Azure",
    "Power BI",
    "Tableau",
    "Git",
    "GitHub",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Deep Learning",
    "Data Analysis",
    "Communication",
    "Problem Solving",
]


def extract_skills(text):
    found_skills = []

    text = text.lower()

    for skill in KNOWN_SKILLS:
        if skill.lower() in text:
            found_skills.append(skill)

    return found_skills