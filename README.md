# Job Portal - Backend API

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x-orange)
![Joi Validation](https://img.shields.io/badge/Joi-17.x-red)
![JWT](https://img.shields.io/badge/JWT-Auth-purple)

## Overview
A RESTful backend API for a job portal application with role-based authentication (Recruiter/Applicant), job postings management, and application tracking system.

## 🎯 Key Features

### 👔 Recruiter Features
- Create, update, and delete job postings
- View applicants for each job posting
- View all jobs posted by recruiter
- Manage job listings

### 🧑‍💻 Applicant Features
- Browse and search job listings
- Apply for jobs with resume link
- Show application details
- Advanced filtering:
  - By post date
  - By position title
  - By required skills

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: MySQL & Prisma ORM
- **Validation**: Joi schema validation
- **Authentication**: JWT with role-based access control
- **Environment Management**: `dotenv`
- **API Testing**: Postman 

---

## API Endpoints

## 📚 API Documentation

### 🔐 Authentication
| Endpoint          | Method | Description               | Request Body                   | Auth Required      |
|-------------------|--------|---------------------------|--------------------------------|--------------------|
| `/auth/signup`    | POST   | Register new user         | `{email, name, password, role}` | No                |
| `/auth/login`     | POST   | Login user                | `{email, password}`            | No                |
| `/auth/signout`   | POST   | Logout                    | -                              | Yes (All Roles)    |

### 💼 Recruiter Endpoints
| Endpoint                     | Method | Description             | Request Body                       | Auth Required        |
|------------------------------|--------|------------------------------------|---------------------|---------------------|
| `/job/post`                 | POST   | Create job |  `{title, description, skills}`| Yes (Recruiter)     |
| `/job/update/:id`           | PUT    | Update job |  `{title, description, skills}` | Yes (Recruiter)     |
| `/job/delete/:id`       |  PUT | Delete job |  _                | Yes (Recruiter)  |
| `/job/postedByRecruiter` | GET    | View all jobs posted by recruiter|  _   | Yes (Recruiter)     |
|`/job/postedByRecruiter/:id`|GET | View job by job id| _ |Yes (Recruiter)  |
| `/job/application/jobapplications/:id`  | GET    | View applications for a job | _ | Yes (Recruiter)     |

### 🧑‍💻 Applicant Endpoints 
| Endpoint                     | Method | Description  | Request Body     | Auth Required        |
|------------------------------|--------|------------------|------------------|---------------------|
| `/application/apply/:id` | POST   | Apply to job   |  `{resume}`  URL    | Yes (Applicant)     |
| `/application/myapplications`| GET    | View applicant's all applications| _   | Yes (Applicant)     |
|`/application/myapplications/:id`| GET | View application details using application id | _| Yes (Applicant)  |

### 🔍 Public Endpoints
| Endpoint               | Method | Description                        | Auth Required |
|------------------------|--------|------------------------------------|---------------|
| `/job/`               | GET    | List all available jobs                     | No            |
| `/job/filter-search`  | GET    | Filter and Search jobs                       | No            |

---


## 🗄️ Database Schema (Prisma)
```bash
model User {
  id          String        @id @default(uuid()) @db.Char(36)
  email       String        @unique
  name        String
  password    String
  role        Role
  createdAt   DateTime      @default(now())
  isDeleted   Boolean       @default(false)
  deletedAt   DateTime?
  Job         Job[]
  Application Application[]
}

model Job {
  id          String    @id @default(uuid()) @db.Char(36)
  title       String
  description String?
  skills      String
  postDate    DateTime  @default(now())
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  updatedAt   DateTime?

  recruiter   User   @relation(fields: [recruiterId], references: [id])
  recruiterId String
  application Application[]
}

//application
model Application {
  id          String    @id @default(uuid()) @db.Char(36)
  resume      String
  appliedAt   DateTime  @default(now())
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  updatedAt   DateTime?
  applicant   User      @relation(fields: [applicantId], references: [id])
  applicantId String
  job Job @relation(fields: [jobId], references: [id])
  jobId String
}

//role based users
enum Role {
  RECRUITER
  APPLICANT
}
```
  
 

## 🚀  Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iamsourav99/Job-Portal-Backend.git
   cd Job-Portal-Backend
2. **Install dependencies**:
   ```bash
   npm install
3. **Set up environment variables**:
   ```bash
   PORT=5500
   DATABASE_URL="mysql://user:password@localhost:3306/database-name"
   JWT_SECRET="your_jwt_secret_here"
4. **Set up Prisma**:
   ```bash
    npx prisma generate
    npx prisma migrate dev
5. **Start the Server**:
   ```bash
    npm run start
          or
    npm run dev  (for development)
 Server will run on http://localhost:5500.
<!-- ================ END OF TECHNICAL DOCUMENTATION ================ -->
---

## Testing
The API has been tested with Postman. 





---
👤 Author
Sourav - @iamsourav99
