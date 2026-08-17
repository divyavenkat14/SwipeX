from rest_framework import serializers

from .models import Application, Swipe


class SwipeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Swipe
        fields = "__all__"

        read_only_fields = (
            "job_seeker",
            "created_at",
            "updated_at",
        )


class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(
        source="job_seeker.full_name",
        read_only=True,
    )

    applicant_location = serializers.CharField(
        source="job_seeker.location",
        read_only=True,
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    status_history = serializers.SerializerMethodField()

    def get_status_history(self, obj):
        return [
            {
                "old_status": history.old_status,
                "new_status": history.new_status,
                "changed_at": history.changed_at,
                "note": history.note,
            }
            for history in obj.status_history.all()
        ]

    class Meta:
        model = Application
        fields = "__all__"

        read_only_fields = (
            "job_seeker",
            "applied_at",
            "updated_at",
            "status_history",
        )