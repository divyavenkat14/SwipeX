from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from django.db.models import Q
from django.utils import timezone

from interactions.models import Swipe
from profiles.models import RecruiterProfile, JobSeekerProfile
from notifications.models import Notification

from resumes.models import Resume, Skill
from resumes.skill_extractor import extract_skills
from resumes.ats_engine import calculate_ats_score

from .models import Job, JobSkill
from .permissions import IsRecruiter
from .serializers import JobSerializer


class JobViewSet(viewsets.ModelViewSet):

    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer

    # =====================================================
    # GET JOBS
    # =====================================================

    def get_queryset(self):

        queryset = Job.objects.all().order_by(
            "-created_at"
        )

        # -------------------------------------------------
        # RECRUITER
        # -------------------------------------------------

        if (
            self.request.user.is_authenticated
            and self.request.user.role == "RECRUITER"
        ):
            return queryset.filter(
                posted_by__user=self.request.user
            )

        # -------------------------------------------------
        # JOB SEEKER
        # -------------------------------------------------

        if (
            self.request.user.is_authenticated
            and self.request.user.role == "JOB_SEEKER"
        ):

            queryset = queryset.filter(
                status="PUBLISHED"
            )

            liked_swipes = Swipe.objects.filter(
                job_seeker__user=self.request.user,
                action__in=[
                    "SAVE",
                    "FAVORITE",
                    "APPLY",
                ],
            )

            if liked_swipes.exists():

                last_job = liked_swipes.last().job

                queryset = queryset.filter(
                    Q(
                        location=last_job.location
                    )
                    | Q(
                        experience_level=
                        last_job.experience_level
                    )
                    | Q(
                        work_mode=
                        last_job.work_mode
                    )
                )

            swiped_jobs = Swipe.objects.filter(
                job_seeker__user=self.request.user
            ).values_list(
                "job_id",
                flat=True,
            )

            return queryset.exclude(
                id__in=swiped_jobs
            )

        # -------------------------------------------------
        # PUBLIC
        # -------------------------------------------------

        return queryset.filter(
            status="PUBLISHED"
        )

    # =====================================================
    # PERMISSIONS
    # =====================================================

    def get_permissions(self):

        if self.request.method in [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ]:

            return [
                permissions.IsAuthenticated(),
                IsRecruiter(),
            ]

        return [
            permissions.AllowAny()
        ]

    # =====================================================
    # FILTERING
    # =====================================================

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "job_type",
        "work_mode",
        "experience_level",
        "location",
        "status",
    ]

    search_fields = [
        "title",
        "description",
        "location",
        "company__name",
    ]

    ordering_fields = [
        "created_at",
        "salary_min",
        "salary_max",
    ]

    # =====================================================
    # SAVE JOB SKILLS
    # =====================================================

    def save_job_skills(self, job):

        text = " ".join(
            [
                job.title or "",
                job.description or "",
                job.responsibilities or "",
                job.qualifications or "",
            ]
        )

        extracted_skills = extract_skills(text)

        print(
            "===================================="
        )

        print(
            "Job:",
            job.title
        )

        print(
            "Extracted job skills:",
            extracted_skills
        )

        print(
            "===================================="
        )

        for skill_name in extracted_skills:

            skill, created = Skill.objects.get_or_create(
                normalized_name=skill_name.lower(),
                defaults={
                    "name": skill_name,
                },
            )

            print(
                "Saving skill:",
                skill.name,
                "Created:",
                created,
            )

            job_skill, job_skill_created = (
                JobSkill.objects.get_or_create(
                    job=job,
                    skill=skill,
                    defaults={
                        "importance": (
                            JobSkill.Importance.REQUIRED
                        ),
                        "weight": 1,
                    },
                )
            )

            print(
                "JobSkill created:",
                job_skill_created
            )

    # =====================================================
    # CREATE JOB
    # =====================================================

    def perform_create(self, serializer):

        recruiter = RecruiterProfile.objects.get(
            user=self.request.user
        )

        # -------------------------------------------------
        # CREATE JOB
        # -------------------------------------------------

        job = serializer.save(
            posted_by=recruiter,
            company=recruiter.company,
            status="PUBLISHED",
            published_at=timezone.now(),
        )

        # -------------------------------------------------
        # SAVE JOB SKILLS
        # -------------------------------------------------

        self.save_job_skills(job)

        # -------------------------------------------------
        # GET ALL JOB SEEKERS
        # -------------------------------------------------

        job_seekers = JobSeekerProfile.objects.all()

        generic_notifications = []

        personalized_notifications = []

        # -------------------------------------------------
        # PROCESS EACH JOB SEEKER
        # -------------------------------------------------

        for job_seeker in job_seekers:

            # ---------------------------------------------
            # NORMAL JOB NOTIFICATION
            # ---------------------------------------------

            generic_notifications.append(
                Notification(
                    user=job_seeker.user,
                    title="New Job Posted",
                    message=(
                        f"A new job opportunity for "
                        f"{job.title} has been posted."
                    ),
                    notification_type=(
                        Notification.NotificationType.JOB
                    ),
                )
            )

            # ---------------------------------------------
            # STARTUP HIRING NOTIFICATION
            # ---------------------------------------------

            if (
                job.company
                and job.company.company_type
                == "STARTUP"
            ):

                generic_notifications.append(
                    Notification(
                        user=job_seeker.user,
                        title="Startup Hiring Alert",
                        message=(
                            f"{job.company.name} is hiring "
                            f"for {job.title}. "
                            f"Check out this startup "
                            f"opportunity!"
                        ),
                        notification_type=(
                            Notification.NotificationType.JOB
                        ),
                    )
                )

            # ---------------------------------------------
            # FIND JOB SEEKER RESUME
            # ---------------------------------------------

            resume = (
                Resume.objects
                .filter(
                    user=job_seeker.user
                )
                .order_by(
                    "-is_default",
                    "-id",
                )
                .first()
            )

            if not resume:
                continue

            # ---------------------------------------------
            # RESUME SKILLS
            # ---------------------------------------------

            resume_skills = [
                resume_skill.skill.name
                for resume_skill
                in resume.resume_skills.all()
            ]

            # ---------------------------------------------
            # JOB SKILLS
            # ---------------------------------------------

            job_skills = [
                job_skill.skill.name
                for job_skill
                in job.job_skills.all()
            ]

            print(
                "ATS Job Skills:",
                job_skills
            )

            if not job_skills:
                continue

            # ---------------------------------------------
            # CALCULATE ATS SCORE
            # ---------------------------------------------

            try:

                ats_result = calculate_ats_score(
                    resume_skills,
                    job_skills,
                    job.title,
                )

                print(
                    "ATS Result:",
                    ats_result
                )

                ats_score = ats_result.get(
                    "ats_score",
                    0,
                )

            except Exception as error:

                print(
                    "ATS calculation failed:",
                    error,
                )

                continue

            # ---------------------------------------------
            # PERSONALIZED OPPORTUNITY
            # ---------------------------------------------

            if ats_score >= 60:

                personalized_notifications.append(
                    Notification(
                        user=job_seeker.user,
                        title="Great Job Opportunity",
                        message=(
                            f"{job.title} matches "
                            f"{ats_score}% of your profile "
                            f"and currently has low "
                            f"competition. "
                            f"You could be an early "
                            f"applicant!"
                        ),
                        notification_type=(
                            Notification.NotificationType.JOB
                        ),
                    )
                )

        # -------------------------------------------------
        # CREATE NORMAL + STARTUP NOTIFICATIONS
        # -------------------------------------------------

        Notification.objects.bulk_create(
            generic_notifications
        )

        # -------------------------------------------------
        # CREATE PERSONALIZED NOTIFICATIONS
        # -------------------------------------------------

        Notification.objects.bulk_create(
            personalized_notifications
        )

    # =====================================================
    # UPDATE JOB
    # =====================================================

    def perform_update(self, serializer):

        job = serializer.save()

        # Remove old job skills
        job.job_skills.all().delete()

        # Extract and save updated skills
        self.save_job_skills(job)