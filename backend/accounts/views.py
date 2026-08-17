from accounts.models import User
from jobs.models import Job
from profiles.models import Company
from interactions.models import Application
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsRecruiter
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
            }
        )


class RecruiterOnlyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get(self, request):
        return Response(
            {
                "message": "Welcome Recruiter",
                "username": request.user.username,
            }
        )
class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "users": User.objects.count(),
                "jobs": Job.objects.count(),
                "companies": Company.objects.count(),
                "applications": Application.objects.count(),
            }
        )
from .serializers import RegisterSerializer
from accounts.models import User

class AdminUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all().order_by("-id")

        data = []

        for user in users:
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            })

        return Response(data)
from profiles.models import Company

class AdminCompaniesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        companies = Company.objects.all()

        data = []

        for company in companies:
            data.append({
                "id": company.id,
                "name": company.name,
                "company_type": company.company_type,
                "headquarters": company.headquarters,
                "verification_status": company.verification_status,
            })

        return Response(data)
from jobs.models import Job

class AdminJobsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.all().order_by("-id")

        data = []

        for job in jobs:
            data.append({
                "id": job.id,
                "title": job.title,
                "company": job.company.name,
                "location": job.location,
                "experience": job.experience_level,
            })

        return Response(data)
class AdminReportsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "users": User.objects.count(),
            "recruiters": User.objects.filter(role="RECRUITER").count(),
            "job_seekers": User.objects.filter(role="JOB_SEEKER").count(),
            "companies": Company.objects.count(),
            "jobs": Job.objects.count(),
            "applications": Application.objects.count(),
        })