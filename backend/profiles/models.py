from django.db import models
from django.utils import timezone


class Company(models.Model):
    class CompanyType(models.TextChoices):
        MNC = "MNC", "MNC"
        STARTUP = "STARTUP", "Startup"
        OTHER = "OTHER", "Other"

    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    name = models.CharField(max_length=150, unique=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)

    company_type = models.CharField(
        max_length=20,
        choices=CompanyType.choices,
        default=CompanyType.OTHER,
    )

    founded_year = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    company_size = models.CharField(
        max_length=50,
        blank=True,
    )

    headquarters = models.CharField(
        max_length=150,
        blank=True,
    )

    logo = models.ImageField(
        upload_to="company_logos/",
        null=True,
        blank=True,
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_newly_founded(self):
        if not self.founded_year:
            return False

        return self.founded_year >= timezone.now().year - 3

    def __str__(self):
        return self.name


class JobSeekerProfile(models.Model):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="job_seeker_profile",
    )

    full_name = models.CharField(max_length=150)
    headline = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)

    experience_level = models.CharField(
        max_length=50,
        blank=True,
    )

    preferred_job_type = models.CharField(
        max_length=50,
        blank=True,
    )

    preferred_work_mode = models.CharField(
        max_length=50,
        blank=True,
    )

    profile_completion = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class RecruiterProfile(models.Model):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="recruiter_profile",
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recruiters",
    )

    full_name = models.CharField(max_length=150)
    job_title = models.CharField(max_length=100, blank=True)
    is_company_admin = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name