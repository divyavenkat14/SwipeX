# 🚀 SwipeX

## Swipe-Based Intelligent Job Discovery and Career Assistance Platform

SwipeX is a full-stack career assistance and job discovery platform designed to make the process of finding and applying for jobs more interactive, personalized, and efficient.

Instead of relying entirely on traditional job-board browsing, SwipeX introduces a swipe-based job discovery experience where job seekers can explore opportunities based on their interests, skills, and career goals.

The platform provides separate experiences for **Job Seekers, Recruiters, and Administrators**, with role-based authentication and dedicated dashboards.

---

## 🌐 Live Application

### Frontend
https://swipe-x-mu.vercel.app/

### Backend API
https://swipex-backend-6zfm.onrender.com/

> **Frontend:** Vercel  
> **Backend:** Render  
> **Database:** PostgreSQL

---

# 📌 Table of Contents

- [About SwipeX](#-about-swipex)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [How SwipeX Works](#-how-swipex-works)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Backend Applications](#-backend-applications)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Database](#-database)
- [Security](#-security)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Docker](#-docker)
- [Deployment](#-deployment)
- [Local Installation](#-local-installation)
- [Environment Variables](#-environment-variables)
- [Future Enhancements](#-future-enhancements)
- [Project Highlights](#-project-highlights)
- [Author](#-author)
- [Acknowledgement](#-acknowledgement)
- [License](#-license)

---

# 🧠 About SwipeX

Finding the right job can be overwhelming.

Traditional job portals often require users to repeatedly search, filter, compare, and browse through hundreds of job listings. This can make the process time-consuming and difficult to personalize.

SwipeX aims to make job discovery more engaging by introducing a **swipe-based interface** for exploring opportunities.

The platform brings together:

- Job discovery
- User profiles
- Resume management
- Recruiter functionality
- Company management
- Job posting
- Job applications
- Administrative monitoring
- Role-based authentication

into a single platform.

---

# ❗ Problem Statement

Traditional job-search platforms can create several challenges:

- Large numbers of job listings can make discovery overwhelming.
- Users often spend significant time filtering irrelevant opportunities.
- Recruiters need efficient ways to manage job postings and applications.
- Job seekers need a centralized platform for their career information.
- Administrators need visibility into users, jobs, companies, and applications.

SwipeX addresses these challenges by creating an interactive and role-based career platform.

---

# 🎯 Objectives

The major objectives of SwipeX are:

- Create an interactive job discovery experience.
- Simplify the process of exploring job opportunities.
- Provide role-based access for different users.
- Allow job seekers to maintain career-related information.
- Allow recruiters to manage companies and job postings.
- Allow recruiters to manage candidate applications.
- Provide administrators with platform-level statistics.
- Build a scalable REST API backend.
- Implement secure JWT authentication.
- Deploy the complete application to the cloud.

---

# ✨ Key Features

## 👨‍💼 Job Seeker

Job seekers can:

- Create an account.
- Log in securely.
- Create and manage their profile.
- Manage resume information.
- Discover available job opportunities.
- Explore job details.
- Apply for suitable positions.
- Access their personalized dashboard.

---

## 🏢 Recruiter

Recruiters can:

- Create a recruiter account.
- Log in securely.
- Access a recruiter-specific dashboard.
- Create and manage company information.
- Post job opportunities.
- Manage existing job postings.
- View job applications.
- Access recruiter-protected functionality.

---

## 🛡️ Administrator

Administrators have access to platform-level information.

The administrator dashboard provides:

- Total number of users
- Total number of jobs
- Total number of companies
- Total number of applications
- Total number of recruiters
- Total number of job seekers

Administrators can also view:

- Users
- Companies
- Jobs
- Reports

---

# 👥 User Roles

SwipeX supports three user roles:

```text
JOB_SEEKER
RECRUITER
ADMIN
