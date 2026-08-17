from rest_framework import serializers

from .models import (
    Company,
    JobSeekerProfile,
    RecruiterProfile,
)


# =========================================================
# COMPANY
# =========================================================

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


# =========================================================
# JOB SEEKER PROFILE
# =========================================================

class JobSeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerProfile

        fields = [
            "id",
            "full_name",
            "headline",
            "bio",
            "location",
            "experience_level",
            "preferred_job_type",
            "preferred_work_mode",
            "profile_completion",
        ]

        read_only_fields = [
            "id",
            "profile_completion",
        ]

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.profile_completion = self.calculate_completion(
            instance
        )

        instance.save()

        return instance

    def calculate_completion(self, profile):
        fields = [
            profile.full_name,
            profile.headline,
            profile.bio,
            profile.location,
            profile.experience_level,
            profile.preferred_job_type,
            profile.preferred_work_mode,
        ]

        completed = sum(
            1
            for value in fields
            if value and str(value).strip()
        )

        return round(
            (completed / len(fields)) * 100
        )


# =========================================================
# RECRUITER PROFILE
# =========================================================

class RecruiterProfileSerializer(serializers.ModelSerializer):

    # Show company details instead of only the company ID
    company_name = serializers.CharField(
        source="company.name",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = RecruiterProfile

        fields = [
            "id",
            "full_name",
            "job_title",
            "is_company_admin",
            "company",
            "company_name",
            "username",
            "email",
        ]

        read_only_fields = [
            "id",
            "company_name",
            "username",
            "email",
        ]