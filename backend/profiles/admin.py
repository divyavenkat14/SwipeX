from django.contrib import admin

from .models import Company, JobSeekerProfile, RecruiterProfile

admin.site.register(Company)
admin.site.register(JobSeekerProfile)
admin.site.register(RecruiterProfile)