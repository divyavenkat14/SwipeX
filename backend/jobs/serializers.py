from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True,
    )

    recruiter_name = serializers.CharField(
        source="posted_by.user.username",
        read_only=True,
    )

    applicant_count = serializers.SerializerMethodField()

    competition_level = serializers.SerializerMethodField()

    is_early_applicant = serializers.SerializerMethodField()

    class Meta:
        model = Job

        fields = "__all__"

        read_only_fields = [
            "company",
            "posted_by",
            "company_name",
            "recruiter_name",
            "created_at",
            "updated_at",
            "published_at",
            "applicant_count",
            "competition_level",
            "is_early_applicant",
        ]

    def get_applicant_count(self, obj):
        return obj.applications.count()

    def get_competition_level(self, obj):
        applicant_count = obj.applications.count()

        if applicant_count <= 5:
            return "LOW"

        elif applicant_count <= 15:
            return "MEDIUM"

        return "HIGH"

    def get_is_early_applicant(self, obj):
        applicant_count = obj.applications.count()

        return applicant_count <= 5