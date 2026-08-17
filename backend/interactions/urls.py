from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, SwipeViewSet

router = DefaultRouter()
router.register(
    "applications",
    ApplicationViewSet,
    basename="applications",
)
router.register(
    "swipes",
    SwipeViewSet,
    basename="swipes",
)
urlpatterns = [
    path("", include(router.urls)),
]