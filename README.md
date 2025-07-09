# My Website Backend API

This is the backend API for the My Website project, built with Node.js, Express, TypeScript, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Testing](#testing)

## Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **User Management**: User registration, login, profile management
- **Projects API**: CRUD operations for projects/portfolio items
- **Services API**: CRUD operations for services
- **Testimonials API**: CRUD operations for testimonials
- **Contact Form**: Process and store contact form submissions
- **Newsletter**: Subscribe/unsubscribe functionality and admin management
- **Role-based Access Control**: Different permissions for admin, editor, and client roles
- **Email Notifications**: Send emails for contact form submissions and password resets
- **Data Validation**: Input validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Implemented best practices for API security

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Nodemailer**: Email sending
- **Express Validator**: Request validation
- **Winston**: Logging
- **Helmet**: Security headers
- **Compression**: Response compression
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: API rate limiting

## Project Structure

```
backend/
├── src/                  # Source code
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── scripts/          # Utility scripts
│   └── server.ts         # Express app
├── dist/                 # Compiled JavaScript
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/my-website.git
cd my-website/backend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/my-website

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=My Website

# Admin Configuration
ADMIN_EMAIL=admin@example.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Running the Server

### Development Mode

```bash
npm run dev
# or
yarn dev
```

This will start the server with nodemon for automatic reloading.

### Production Mode

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Database Seeding

To seed the database with initial data:

```bash
npm run seed
# or
yarn seed
```

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register         # Register a new user
POST /api/auth/login            # Login user
POST /api/auth/refresh-token    # Refresh access token
POST /api/auth/forgot-password  # Request password reset
POST /api/auth/reset-password   # Reset password
GET  /api/auth/me               # Get current user
PUT  /api/auth/me               # Update user profile
PUT  /api/auth/change-password  # Change password
```

### Projects Endpoints

```
GET    /api/projects            # Get all projects
GET    /api/projects/categories # Get project categories
GET    /api/projects/:id        # Get project by ID or slug
POST   /api/projects            # Create new project (protected)
PUT    /api/projects/:id        # Update project (protected)
DELETE /api/projects/:id        # Delete project (protected)
```

### Services Endpoints

```
GET    /api/services            # Get all services
GET    /api/services/:id        # Get service by ID or slug
POST   /api/services            # Create new service (protected)
PUT    /api/services/:id        # Update service (protected)
DELETE /api/services/:id        # Delete service (protected)
```

### Testimonials Endpoints

```
GET    /api/testimonials        # Get all testimonials
GET    /api/testimonials/:id    # Get testimonial by ID
POST   /api/testimonials        # Create new testimonial (protected)
PUT    /api/testimonials/:id    # Update testimonial (protected)
DELETE /api/testimonials/:id    # Delete testimonial (protected)
```

### Contact Form Endpoints

```
POST   /api/contact             # Submit contact form
GET    /api/contact/submissions # Get all submissions (protected)
PUT    /api/contact/submissions/:id/status # Update submission status (protected)
DELETE /api/contact/submissions/:id        # Delete submission (protected)
```

### Newsletter Endpoints

```
POST   /api/newsletter/subscribe    # Subscribe to newsletter
POST   /api/newsletter/unsubscribe  # Unsubscribe from newsletter
GET    /api/newsletter/subscribers  # Get all subscribers (protected)
POST   /api/newsletter/send         # Send newsletter (protected)
```

## Database Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  password: string; // Hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'editor' | 'client';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

### Project Model

```typescript
interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  techStack?: {
    name: string;
    icon?: string;
  }[];
  image?: string;
  gallery?: string[];
  featured: boolean;
  projectDate: Date;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
  isOpenSource?: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Model

```typescript
interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  features?: string[];
  price?: {
    amount: number;
    currency: string;
    billingCycle?: 'one-time' | 'monthly' | 'yearly';
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Testimonial Model

```typescript
interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Contact Submission Model

```typescript
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### Newsletter Subscription Model

```typescript
interface NewsletterSubscription {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: Date;
  updatedAt: Date;
  lastEmailSent?: Date;
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. When a user logs in, they receive an access token and a refresh token. The access token is short-lived and is used to authenticate API requests. The refresh token is long-lived and is used to obtain a new access token when the current one expires.

### Token Usage

Include the access token in the Authorization header of your requests:

```
Authorization: Bearer <access_token>
```

### Role-based Access Control

The API implements role-based access control with three roles:

- **Admin**: Full access to all endpoints
- **Editor**: Can manage content (projects, services, testimonials)
- **Client**: Limited access to user-specific endpoints

## Deployment

### Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
# Build Docker image
docker build -t my-website-backend .

# Run Docker container
docker run -p 5000:5000 --env-file .env my-website-backend
```

### Docker Compose

For running the full stack (frontend, backend, and MongoDB):

```bash
docker-compose up
```

### Traditional Deployment

The API can be deployed to any Node.js hosting service:

1. Build the TypeScript code:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

## Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## License

[MIT License](LICENSE)
