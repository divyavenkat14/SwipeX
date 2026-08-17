from django.db import models

from jobs.models import Job
from profiles.models import JobSeekerProfile
from resumes.models import Resume


class ResumeAnalysis(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PROCESSING = "PROCESSING", "Processing"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="analyses",
    )

    ats_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )

    parsed_text = models.TextField(blank=True)

    missing_keywords = models.JSONField(
        default=list,
        blank=True,
    )

    improvement_suggestions = models.JSONField(
        default=list,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.resume.title} - ATS {self.ats_score}"


class JobMatchScore(models.Model):
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="job_match_scores",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="match_scores",
    )

    overall_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
    )

    skill_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )

    experience_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )

    missing_skills = models.JSONField(
        default=list,
        blank=True,
    )

    matched_skills = models.JSONField(
        default=list,
        blank=True,
    )

    explanation = models.TextField(blank=True)

    calculated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["resume", "job"],
                name="unique_match_per_resume_job",
            )
        ]

    def __str__(self):
        return (
            f"{self.resume.title} ↔ "
            f"{self.job.title}: "
            f"{self.overall_score}%"
        )


class Recommendation(models.Model):
    class Source(models.TextChoices):
        PROFILE = "PROFILE", "Profile Based"
        RESUME = "RESUME", "Resume Based"
        SWIPE_BEHAVIOR = "SWIPE_BEHAVIOR", "Swipe Behavior"
        HYBRID = "HYBRID", "Hybrid"

    job_seeker = models.ForeignKey(
        JobSeekerProfile,
        on_delete=models.CASCADE,
        related_name="recommendations",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="recommendations",
    )

    score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
    )

    source = models.CharField(
        max_length=30,
        choices=Source.choices,
        default=Source.HYBRID,
    )

    reason = models.TextField(blank=True)

    is_viewed = models.BooleanField(default=False)

    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job_seeker", "job"],
                name="unique_recommendation_per_job_seeker_job",
            )
        ]

    def __str__(self):
        return (
            f"{self.job_seeker.full_name} → "
            f"{self.job.title}: "
            f"{self.score}%"
        )