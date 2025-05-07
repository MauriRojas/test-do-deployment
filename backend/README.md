# NestJS API with Supabase Auth

This repository contains a simple NestJS API configured with JWT authentication using Supabase.

## Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
FRONTEND_URL=http://localhost:3000
```

Replace `your_supabase_jwt_secret` with your actual Supabase JWT secret.

## Installation

Install the project dependencies:

```bash
npm install
```

## Authentication

The API uses JWT tokens issued by Supabase for authentication. JWT validation is performed through a NestJS guard. Ensure your requests include a valid `Authorization` header with a Bearer token.

## Project Structure

The project structure is straightforward and scalable:

```
src/
├── auth/            # JWT authentication logic and guards
├── controllers/     # API controllers
├── services/        # Business logic services
├── app.module.ts    # Root module
└── main.ts          # Application entry point
```
