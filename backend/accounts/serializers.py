from rest_framework import serializers

from .models import User
from profiles.models import JobSeekerProfile, RecruiterProfile


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    password_confirm = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password_confirm",
            "role",
        ]

    def validate(self, attrs):

        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        if password != password_confirm:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match."
            })

        return attrs

    def create(self, validated_data):

        validated_data.pop("password_confirm")

        password = validated_data.pop("password")

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        if user.role == "JOB_SEEKER":

            JobSeekerProfile.objects.create(
                user=user,
                full_name=user.username,
            )

        elif user.role == "RECRUITER":

            RecruiterProfile.objects.create(
                user=user,
                full_name=user.username,
            )

        return user