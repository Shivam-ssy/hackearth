# 🚀 HackEarth Backend API

Welcome to **HackEarth**, a feature-packed backend REST API built as a **first learning project** using **NestJS**, **MongoDB (Mongoose)**, and **TypeScript**. 

This application provides a complete solution for hosting and participating in hackathons, powered by a fine-grained **Role-Based Access Control (RBAC)** system, **JWT Authentication**, and automated database seeding.

---

## 🌟 Key Features & Achievements

### 🔐 Authentication & Session Security
- **JWT Authentication**: Secured endpoints using Passport-JWT guards (`JwtAuthGuard`).
- **Session Tracking**: Tracks user login sessions, including IP addresses, user agents, active status, and rotated refresh tokens.
- **Custom Param Decorators**: Built `@GetUser()` decorator to cleanly extract typed user payloads (`UserDocument`) directly in controller handlers.

### 🛡️ Role-Based Access Control (RBAC)
- **Granular Permissions**: System capabilities guarded by custom `@Permissions()` decorator and `PermissionsGuard`.
- **Dynamic Roles**: Pre-configured roles with assigned permission sets:
  - **Admin**: Full access across user and hackathon management (`user:*`, `hackathon:*`).
  - **Organizer**: Can create and manage their own hackathons (`hackathon:create`, `hackathon:read`).
  - **User / Student**: Can browse, join, and leave hackathons (`hackathon:read`, `hackathon:join`, `hackathon:leave`).
- **Automatic Seeding**: Includes an `RbacSeeder` that runs on startup to initialize default permissions, roles, sample users, organizers, and an admin account.

### 🏆 Hackathon Management Module
- **Creation & Ownership**: Organizers can create hackathons with automatic assignment of `createdBy` references.
- **Role-Aware Fetching & Pagination**:
  - `GET /hackthon/all`: Dynamically checks user roles. Organizers receive only their created hackathons, while Admins and Students view all hackathons.
  - Supports query pagination parameters (`?page=1&limit=10`).
- **Participation Flow**:
  - **Join Hackathon** (`POST /hackthon/join`): Allows users to enroll, checking for duplicate registrations.
  - **Leave Hackathon** (`POST /hackthon/leave`): Safely removes user reference from participant list.
- **Protected Operations**: `PATCH` and `DELETE` endpoints verify that only the creator organizer or an admin can modify or delete a hackathon.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js & TypeScript)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT, Passport.js, Bcrypt
- **Testing & Quality**: Vitest, Oxlint, Prettier

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB instance running locally or via MongoDB Atlas

### 2. Installation
```bash
# Clone the repository
$ git clone <repository-url>
$ cd hackearth

# Install dependencies
$ npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hackearth
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the Application
```bash
# Development mode with watch
$ npm run start:dev

# Production mode
$ npm run start:prod
```

---

## 🔑 Default Seeded Accounts (For Development)

Upon starting the app, `RbacSeeder` automatically populates the database with default accounts (default password: `password123`):

| Role | Email | Default Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Organizer** | `organizer1@example.com` to `organizer5@example.com` | `password123` |
| **User / Student** | `user1@example.com` to `user5@example.com` | `password123` |

---

## 📌 API Endpoints Overview

### Auth Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login user & receive JWT token |

### Hackathon Endpoints
| Method | Endpoint | Permission Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/hackthon/create` | `hackathon:create` | Create a new hackathon |
| `GET` | `/hackthon/all` | `hackathon:read` | List hackathons (filtered by role with pagination) |
| `GET` | `/hackthon/:id` | `hackathon:read` | Get details of a specific hackathon |
| `POST` | `/hackthon/join` | `hackathon:join` | Join a hackathon |
| `POST` | `/hackthon/leave` | `hackathon:leave` | Leave a hackathon |
| `PATCH` | `/hackthon/:id` | `hackathon:update` | Update hackathon details (Creator/Admin) |
| `DELETE` | `/hackthon/:id` | `hackathon:delete` | Delete a hackathon (Creator/Admin) |

---

## 🎓 Learning Journey & Reflections

This project marks my **first hands-on experience building a production-structured backend** with NestJS and Mongoose. Key milestones achieved during this project include:
- Structuring scalable NestJS modules, controllers, and services.
- Designing custom guards and metadata decorators for permission checks.
- Handling MongoDB schema relationships (`ref: 'User'`) and `HydratedDocument` types in TypeScript.
- Implementing role-dependent query filtering and pagination.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
