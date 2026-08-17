from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from jobs.models import Job

from .models import Resume, Skill, ResumeSkill
from .serializers import ResumeSerializer
from .parser import extract_text_from_pdf
from .skill_extractor import extract_skills
from .ats_engine import calculate_ats_score


class ResumeViewSet(viewsets.ModelViewSet):

    serializer_class = ResumeSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    # =====================================================
    # ONLY LOGGED-IN USER'S RESUMES
    # =====================================================

    def get_queryset(self):
        return Resume.objects.filter(
            user=self.request.user
        )

    # =====================================================
    # RESUME UPLOAD
    # =====================================================

    def perform_create(self, serializer):

        resume = serializer.save(
            user=self.request.user
        )

        # -------------------------------------------------
        # EXTRACT TEXT FROM PDF
        # -------------------------------------------------

        text = extract_text_from_pdf(
            resume.file.path
        )

        # -------------------------------------------------
        # SAVE PARSED TEXT
        # -------------------------------------------------

        resume.parsed_text = text
        resume.save()

        # -------------------------------------------------
        # EXTRACT SKILLS
        # -------------------------------------------------

        skills = extract_skills(text)

        # -------------------------------------------------
        # SAVE SKILLS
        # -------------------------------------------------

        for skill_name in skills:

            skill, created = Skill.objects.get_or_create(
                normalized_name=skill_name.lower(),
                defaults={
                    "name": skill_name,
                },
            )

            ResumeSkill.objects.get_or_create(
                resume=resume,
                skill=skill,
            )

    # =====================================================
    # ATS SCORE FOR ONE JOB
    # =====================================================

    @action(
        detail=True,
        methods=["get"]
    )
    def ats(self, request, pk=None):

        resume = self.get_object()

        job_id = request.query_params.get(
            "job"
        )

        if not job_id:
            return Response(
                {
                    "error": "Job ID is required."
                },
                status=400,
            )

        try:

            job = Job.objects.get(
                pk=job_id
            )

        except Job.DoesNotExist:

            return Response(
                {
                    "error": "Job not found."
                },
                status=404,
            )

        # -------------------------------------------------
        # RESUME SKILLS
        # -------------------------------------------------

        resume_skills = [
            rs.skill.name
            for rs in resume.resume_skills.all()
        ]

        # -------------------------------------------------
        # JOB SKILLS
        # -------------------------------------------------

        job_skills = [
            js.skill.name
            for js in job.job_skills.all()
        ]

        # -------------------------------------------------
        # ATS CALCULATION
        # -------------------------------------------------

        result = calculate_ats_score(
            resume_skills,
            job_skills,
            job.title,
        )

        return Response(result)

    # =====================================================
    # RESUME ANALYTICS
    #
    # Compare ONE resume against ALL published jobs.
    # This is separate from the swipe-job feed.
    # =====================================================

    @action(
        detail=True,
        methods=["get"]
    )
    def analytics(self, request, pk=None):

        resume = self.get_object()

        # -------------------------------------------------
        # RESUME SKILLS
        # -------------------------------------------------

        resume_skills = [
            rs.skill.name
            for rs in resume.resume_skills.all()
        ]

        # -------------------------------------------------
        # ALL PUBLISHED / ACTIVE JOBS
        #
        # PUBLISHED is included because your current
        # JobViewSet creates jobs using PUBLISHED.
        #
        # ACTIVE is included because it exists in your
        # Job.Status choices.
        # -------------------------------------------------

        jobs = Job.objects.filter(
            status__in=[
                "PUBLISHED",
                "ACTIVE",
            ]
        ).select_related(
            "company"
        ).prefetch_related(
            "job_skills__skill"
        )

        results = []

        # -------------------------------------------------
        # CALCULATE ATS FOR EVERY JOB
        # -------------------------------------------------

        for job in jobs:

            job_skills = [
                js.skill.name
                for js in job.job_skills.all()
            ]

            ats_result = calculate_ats_score(
                resume_skills,
                job_skills,
                job.title,
            )

            results.append(
                {
                    "job_id": job.id,
                    "job_title": job.title,
                    "company_name": job.company.name,
                    "location": job.location,
                    "job_type": job.job_type,
                    "work_mode": job.work_mode,
                    "experience_level": (
                        job.experience_level
                    ),
                    "ats_score": (
                        ats_result.get(
                            "ats_score",
                            0
                        )
                    ),
                    "matched_skills": (
                        ats_result.get(
                            "matched_skills",
                            []
                        )
                    ),
                    "missing_skills": (
                        ats_result.get(
                            "missing_skills",
                            []
                        )
                    ),
                    "matched_count": (
                        ats_result.get(
                            "matched_count",
                            0
                        )
                    ),
                    "total_job_skills": (
                        ats_result.get(
                            "total_job_skills",
                            0
                        )
                    ),
                    "recommendation": (
                        ats_result.get(
                            "recommendation",
                            ""
                        )
                    ),
                }
            )

        # -------------------------------------------------
        # HIGHEST MATCH FIRST
        # -------------------------------------------------

        results.sort(
            key=lambda item: item["ats_score"],
            reverse=True
        )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return Response(
            {
                "resume_id": resume.id,
                "resume_title": resume.title,
                "total_jobs_analyzed": len(
                    results
                ),
                "results": results,
            }
        )