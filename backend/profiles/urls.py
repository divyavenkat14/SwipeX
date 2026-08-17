from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CompanyViewSet,
    JobSeekerProfileView,
    RecruiterProfileView,
)


router = DefaultRouter()

router.register(
    "companies",
    CompanyViewSet,
    basename="companies",
)


urlpatterns = [
    # Company APIs
    path(
        "",
        include(router.urls),
    ),

    # Job Seeker Profile
    path(
        "profiles/job-seeker/me/",
        JobSeekerProfileView.as_view(),
        name="job-seeker-profile",
    ),

    # Recruiter Profile
    path(
        "profiles/recruiter/me/",
        RecruiterProfileView.as_view(),
        name="recruiter-profile",
    ),
]