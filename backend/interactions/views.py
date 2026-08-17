from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status

from resumes.models import Resume
from profiles.models import JobSeekerProfile
from notifications.models import Notification

from .models import (
    Application,
    ApplicationStatusHistory,
    Swipe,
)

from .serializers import (
    ApplicationSerializer,
    SwipeSerializer,
)


class SwipeViewSet(viewsets.ModelViewSet):
    serializer_class = SwipeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_seeker = JobSeekerProfile.objects.get(
            user=self.request.user
        )

        return Swipe.objects.filter(
            job_seeker=job_seeker
        )

    def create(self, request, *args, **kwargs):
        job_seeker = JobSeekerProfile.objects.get(
            user=request.user
        )

        job_id = request.data.get("job")
        action = request.data.get("action")

        swipe, created = Swipe.objects.update_or_create(
            job_seeker=job_seeker,
            job_id=job_id,
            defaults={
                "action": action,
            },
        )

        serializer = self.get_serializer(swipe)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == "RECRUITER":
            queryset = Application.objects.filter(
                job__posted_by__user=self.request.user
            )

            job_id = self.request.query_params.get("job")

            if job_id:
                queryset = queryset.filter(
                    job_id=job_id
                )

            return queryset

        return Application.objects.filter(
            job_seeker__user=self.request.user
        )

    def get_permissions(self):
        if self.request.method in [
            "PUT",
            "PATCH",
        ]:
            if self.request.user.role == "RECRUITER":
                return [
                    permissions.IsAuthenticated()
                ]

            return [
                permissions.IsAdminUser()
            ]

        return [
            permissions.IsAuthenticated()
        ]

    def perform_create(self, serializer):
        job_seeker = JobSeekerProfile.objects.get(
            user=self.request.user
        )

        resume = Resume.objects.filter(
            user=self.request.user
        ).first()

        application = serializer.save(
            job_seeker=job_seeker,
            resume=resume,
        )

        recruiter_user = application.job.posted_by.user

        Notification.objects.create(
            user=recruiter_user,
            title="New Application Received",
            message=(
                f"{job_seeker.full_name} has applied for "
                f"{application.job.title}."
            ),
            notification_type=(
                Notification.NotificationType.APPLICATION
            ),
        )

    def perform_update(self, serializer):
        application = serializer.instance

        old_status = application.status

        new_status = serializer.validated_data.get(
            "status",
            old_status,
        )

        application = serializer.save()

        if old_status != new_status:
            ApplicationStatusHistory.objects.create(
                application=application,
                old_status=old_status,
                new_status=new_status,
            )

            Notification.objects.create(
                user=application.job_seeker.user,
                title="Application Status Updated",
                message=(
                    f"Your application for "
                    f"{application.job.title} is now "
                    f"{application.get_status_display()}."
                ),
                notification_type=(
                    Notification.NotificationType.STATUS_UPDATE
                ),
            )