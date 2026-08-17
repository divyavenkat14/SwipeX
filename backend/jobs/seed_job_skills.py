from jobs.models import Job, JobSkill
from resumes.models import Skill

JOB_SKILLS = {
    "AI engineer": [
        "Python",
        "SQL",
        "Machine Learning",
        "Git",
        "AWS",
    ],

    "Data Analyst": [
        "Python",
        "SQL",
        "Power BI",
        "Tableau",
        "Communication",
    ],

    "Software Engineer": [
        "Python",
        "Java",
        "SQL",
        "Git",
        "JavaScript",
        "HTML",
        "CSS",
    ],

    "Cloud Engineer": [
        "AWS",
        "Docker",
        "Git",
        "Python",
    ],

    "Quality Analyst": [
        "SQL",
        "Communication",
    ],
}


def seed_job_skills():

    for job in Job.objects.all():

        skills = JOB_SKILLS.get(job.title, [])

        for skill_name in skills:

            skill, _ = Skill.objects.get_or_create(
                normalized_name=skill_name.lower(),
                defaults={
                    "name": skill_name,
                },
            )

            JobSkill.objects.get_or_create(
                job=job,
                skill=skill,
            )

    print("Job skills seeded successfully!")