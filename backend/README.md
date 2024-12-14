# MyBarber.ai Backend API

Backend API server for MyBarber.ai built with Express and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create .env file with required variables (see .env.example)

3. Run development server:
```bash
npm run dev
```

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh-token - Refresh access token
- POST /api/auth/2fa/setup - Setup 2FA
- POST /api/auth/2fa/verify - Verify 2FA code
- POST /api/auth/2fa/disable - Disable 2FA

### Appointments
- GET /api/appointments - Get all appointments
- GET /api/appointments/:id - Get appointment by ID
- POST /api/appointments - Create appointment
- PUT /api/appointments/:id - Update appointment
- DELETE /api/appointments/:id - Delete appointment

### Clients
- GET /api/clients - Get all clients
- GET /api/clients/:id - Get client by ID
- POST /api/clients - Create client
- PUT /api/clients/:id - Update client
- DELETE /api/clients/:id - Delete client

### Services
- GET /api/services - Get all services
- GET /api/services/:id - Get service by ID
- POST /api/services - Create service
- PUT /api/services/:id - Update service
- DELETE /api/services/:id - Delete service

### Settings
- GET /api/settings - Get user settings
- PUT /api/settings - Update user settings

## Deployment

The API is automatically deployed to Railway when pushing to the main branch.