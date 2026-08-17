from django.conf import settings
from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    normalized_name = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Resume(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
    )

    title = models.CharField(max_length=150)

    file = models.FileField(
        upload_to="resumes/%Y/%m/",
    )
    parsed_text = models.TextField(
    blank=True,
    default="",
)

    is_default = models.BooleanField(default=False)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    skills = models.ManyToManyField(
        Skill,
        through="ResumeSkill",
        related_name="resumes",
    )

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ResumeSkill(models.Model):
    class Source(models.TextChoices):
        AI_EXTRACTED = "AI_EXTRACTED", "AI Extracted"
        USER_CONFIRMED = "USER_CONFIRMED", "User Confirmed"
        USER_ADDED = "USER_ADDED", "User Added"

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="resume_skills",
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="resume_skills",
    )

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.AI_EXTRACTED,
    )

    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["resume", "skill"],
                name="unique_skill_per_resume",
            )
        ]

    def __str__(self):
        return f"{self.resume.title} - {self.skill.name}"