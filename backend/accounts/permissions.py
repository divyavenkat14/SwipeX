from rest_framework.permissions import BasePermission


class IsJobSeeker(BasePermission):
    message = "Only job seekers can access this feature."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "JOB_SEEKER"
        )


class IsRecruiter(BasePermission):
    message = "Only recruiters can access this feature."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
        )


class IsAdmin(BasePermission):
    message = "Only admins can access this feature."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )