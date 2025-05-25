# NestJS Backend API

A modular, secure, and production-ready backend application using NestJS and MongoDB (Mongoose).

## Features

- **N-Tier Architecture**: Controller, Service, Repository pattern
- **Authentication**: JWT-based with access and refresh tokens
- **User Management**: CRUD operations with soft deletion
- **Role-Based Access Control**: Admin and user roles
- **Data Validation**: Using class-validator with custom pipes
- **API Documentation**: Swagger/OpenAPI
- **Security Features**:
  - JWT authentication
  - Password hashing
  - CORS protection
  - Rate limiting
  - HTTP security headers via Helmet
  - Input validation and sanitization
- **Observability**:
  - Health checks (liveness/readiness)
  - Prometheus metrics
  - Audit logging

## Prerequisites

- Node.js (v14+)
- MongoDB

## Environment Variables

Create a `.env` file based on the provided `.env.example`:

