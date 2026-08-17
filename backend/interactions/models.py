from django.db import models

from jobs.models import Job
from profiles.models import JobSeekerProfile
from resumes.models import Resume


class Swipe(models.Model):
    class Action(models.TextChoices):
        SKIP = "SKIP", "Skip"
        SAVE = "SAVE", "Save"
        FAVORITE = "FAVORITE", "Favorite"
        APPLY = "APPLY", "Apply"

    job_seeker = models.ForeignKey(
        JobSeekerProfile,
        on_delete=models.CASCADE,
        related_name="swipes",
    )


    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="swipes",
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job_seeker", "job"],
                name="unique_swipe_per_job_seeker_job",
            )
        ]

    def __str__(self):
        return (
            f"{self.job_seeker.full_name} - "
            f"{self.action} - "
            f"{self.job.title}"
        )


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        INTERVIEW = "INTERVIEW", "Interview"
        OFFERED = "OFFERED", "Offered"
        REJECTED = "REJECTED", "Rejected"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"

    job_seeker = models.ForeignKey(
        JobSeekerProfile,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    resume = models.ForeignKey(
    Resume,
    on_delete=models.PROTECT,
    related_name="applications",
    null=True,
    blank=True,
)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED,
    )

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job_seeker", "job"],
                name="unique_application_per_job_seeker_job",
            )
        ]

    def __str__(self):
        return (
            f"{self.job_seeker.full_name} - "
            f"{self.job.title} - "
            f"{self.status}"
        )


class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="status_history",
    )

    old_status = models.CharField(
        max_length=20,
        choices=Application.Status.choices,
        blank=True,
    )

    new_status = models.CharField(
        max_length=20,
        choices=Application.Status.choices,
    )

    changed_at = models.DateTimeField(auto_now_add=True)

    note = models.TextField(blank=True)

    def __str__(self):
        return (
            f"{self.application.id}: "
            f"{self.old_status} → {self.new_status}"
        )