from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        return Response(
            {"message": "Notification marked as read."},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(
            is_read=False
        ).update(is_read=True)

        return Response(
            {
                "message": "All notifications marked as read.",
                "updated": updated,
            },
            status=status.HTTP_200_OK,
        )