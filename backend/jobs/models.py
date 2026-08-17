from django.db import models
from django.utils import timezone

from profiles.models import Company, RecruiterProfile
from resumes.models import Skill


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full-time"
        PART_TIME = "PART_TIME", "Part-time"
        INTERNSHIP = "INTERNSHIP", "Internship"
        CONTRACT = "CONTRACT", "Contract"

    class WorkMode(models.TextChoices):
        ONSITE = "ONSITE", "On-site"
        REMOTE = "REMOTE", "Remote"
        HYBRID = "HYBRID", "Hybrid"

    class ExperienceLevel(models.TextChoices):
        FRESHER = "FRESHER", "Fresher"
        ENTRY = "ENTRY", "Entry Level"
        MID = "MID", "Mid Level"
        SENIOR = "SENIOR", "Senior Level"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        CLOSED = "CLOSED", "Closed"

    title = models.CharField(max_length=200)

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs",
    )

    posted_by = models.ForeignKey(
        RecruiterProfile,
        on_delete=models.PROTECT,
        related_name="posted_jobs",
    )

    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)

    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
    )

    work_mode = models.CharField(
        max_length=20,
        choices=WorkMode.choices,
    )

    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
    )

    location = models.CharField(
        max_length=150,
        blank=True,
    )

    salary_min = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    salary_max = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    currency = models.CharField(
        max_length=10,
        default="INR",
    )

    application_deadline = models.DateTimeField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    skills = models.ManyToManyField(
        Skill,
        through="JobSkill",
        related_name="jobs",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_recently_posted(self):
        if not self.published_at:
            return False

        return self.published_at >= timezone.now() - timezone.timedelta(days=7)

    @property
    def is_expired(self):
        if not self.application_deadline:
            return False

        return self.application_deadline < timezone.now()

    def __str__(self):
        return f"{self.title} at {self.company.name}"


class JobSkill(models.Model):
    class Importance(models.TextChoices):
        REQUIRED = "REQUIRED", "Required"
        PREFERRED = "PREFERRED", "Preferred"

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="job_skills",
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="job_skills",
    )

    importance = models.CharField(
        max_length=20,
        choices=Importance.choices,
        default=Importance.REQUIRED,
    )

    weight = models.PositiveSmallIntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job", "skill"],
                name="unique_skill_per_job",
            )
        ]

    def __str__(self):
        return f"{self.job.title} - {self.skill.name}"
    
