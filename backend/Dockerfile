# =========================================================
# SwipeX Backend Dockerfile - Production
# =========================================================

# 1. Use Python image
FROM python:3.14-slim

# 2. Prevent Python from creating .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# 3. Send Python output directly to the terminal
ENV PYTHONUNBUFFERED=1

# 4. Set the working directory
WORKDIR /app

# 5. Install system packages required by PostgreSQL/PyMuPDF
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq5 \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# 6. Copy dependency file first
COPY requirements.txt .

# 7. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 8. Copy the Django project
COPY . .

# 9. Collect Django static files
RUN python manage.py collectstatic --noinput

# 10. Expose Django port
EXPOSE 8000

# 11. Start Django with Gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
