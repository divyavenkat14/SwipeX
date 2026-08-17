from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Company,
    JobSeekerProfile,
    RecruiterProfile,
)

from .serializers import (
    CompanySerializer,
    JobSeekerProfileSerializer,
    RecruiterProfileSerializer,
)


# =========================================================
# COMPANY
# =========================================================

class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Company.objects.all()

        company_type = self.request.query_params.get("type")

        if company_type:
            queryset = queryset.filter(
                company_type=company_type
            )

        return queryset


# =========================================================
# JOB SEEKER PROFILE
# =========================================================

class JobSeekerProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(
            user=request.user
        )

        serializer = JobSeekerProfileSerializer(
            profile
        )

        return Response(serializer.data)

    def put(self, request):
        profile = JobSeekerProfile.objects.get(
            user=request.user
        )

        serializer = JobSeekerProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=400,
        )


# =========================================================
# RECRUITER PROFILE
# =========================================================

class RecruiterProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = RecruiterProfile.objects.select_related(
            "user",
            "company",
        ).get(
            user=request.user
        )

        serializer = RecruiterProfileSerializer(
            profile
        )

        return Response(
            serializer.data
        )

    def put(self, request):
        profile = RecruiterProfile.objects.get(
            user=request.user
        )

        serializer = RecruiterProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=400,
        )