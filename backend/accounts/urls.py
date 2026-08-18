import logging

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    MeView,
    RecruiterOnlyView,
    RegisterView,
    AdminDashboardView,
    AdminUsersView,
    AdminCompaniesView,
    AdminJobsView,
    AdminReportsView,
)


logger = logging.getLogger(__name__)


class DiagnosticLoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)

        except Exception:
            logger.exception(
                "========== LOGIN ERROR ON RENDER =========="
            )
            raise


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        DiagnosticLoginView.as_view(),
        name="login",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),

    path(
        "admin/dashboard/",
        AdminDashboardView.as_view(),
        name="admin_dashboard",
    ),

    path(
        "admin/users/",
        AdminUsersView.as_view(),
        name="admin_users",
    ),

    path(
        "recruiter-only/",
        RecruiterOnlyView.as_view(),
        name="recruiter_only",
    ),

    path(
        "admin/jobs/",
        AdminJobsView.as_view(),
        name="admin_jobs",
    ),

    path(
        "admin/companies/",
        AdminCompaniesView.as_view(),
        name="admin_companies",
    ),

    path(
        "admin/reports/",
        AdminReportsView.as_view(),
        name="admin_reports",
    ),
]