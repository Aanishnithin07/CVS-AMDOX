# Certificate Verification System

The Certificate Verification System is now fully implemented with a Node.js/Express backend and a React/Vite frontend.

## Features
- **Public Verification**: Anyone can verify a certificate using its ID.
- **Admin Dashboard**: Secure login for admins to manage certificates.
    - **Upload**: Bulk upload certificates via CSV.
    - **List**: View all certificates with status (Valid/Revoked).
    - **Revoke**: Revoke existing certificates.
- **Responsive Design**: Modern UI built with Tailwind CSS.

## Project Structure
- `cert-system-backend/`: Backend server (Node.js, Express, MongoDB).
- `client/`: Frontend application (React, Vite, Tailwind).

## How to Run

### Prerequisites
- MongoDB must be running locally (`mongodb://localhost:27017`).

### 1. Start Backend
```bash
cd cert-system-backend
npm run dev
# Server runs on http://localhost:5001
```

### 2. Start Frontend
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

## Admin Credentials
To create an intial admin account, you can use the `/api/auth/register` endpoint (Postman/Curl) with `{"email": "admin@example.com", "password": "admin"}`.
Once created, login at `- http://localhost:5173/login`.

## verification
- **Valid ID**: Use an ID from the uploaded CSV.
- **Invalid ID**: Shows "Certificate not found".
- **Revoked ID**: Shows "Certificate Revoked".
