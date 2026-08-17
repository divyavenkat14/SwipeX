from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("accounts.urls")),
    path("api/", include("jobs.urls")),
    path("api/", include("interactions.urls")),
    path("api/", include("profiles.urls")),
    path("api/", include("resumes.urls")),
    path("api/", include("notifications.urls")),
]