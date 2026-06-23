# Hospital Management SaaS Platform

CareOps Cloud is a React + Express + Supabase MVP for the internship challenge. It includes a public hospital website, Supabase authentication, patient appointment booking, doctor consultation notes, admin metrics, and email/WhatsApp notification logging.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Supabase Auth
- Backend: Node.js, Express.js, Supabase JS, Nodemailer, Twilio
- Database: Supabase Postgres
- Deployment targets: Vercel frontend, Render backend

## Modules Included

- Public website: Home, About, Doctors, Services, Contact
- Auth roles: patient, doctor, admin
- Patient dashboard: profile context, booking form, appointment history
- Doctor dashboard: queue, patient details, consultation notes
- Admin dashboard: total patients, doctors, appointments
- Notifications: appointment booking logs email and WhatsApp status
- Database schema: `schema.sql`

## Local Setup

1. Create a Supabase project.
2. Run `schema.sql` in the Supabase SQL editor.
3. Copy environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Fill Supabase keys in both `.env` files.
5. Start the backend:

```bash
cd backend
npm install
npm run dev
```

6. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`; backend runs on `http://localhost:5000`.

## Admin Login

Create an admin account in Supabase Authentication, then run the admin bootstrap SQL comment at the bottom of `schema.sql` with that user's UUID and email.

## Notification Behavior

If email or Twilio credentials are configured, booking an appointment sends notifications. If credentials are missing, the booking still succeeds and the `notifications` table records `failed` rows with the skip reason in `error_log`.

## Deployment

### Vercel Frontend

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_URL=https://your-render-backend.onrender.com`

### Render Backend

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT`
  - `CORS_ORIGIN=https://your-vercel-app.vercel.app`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - optional email/Twilio variables from `backend/.env.example`

## Demo Flow

1. Register a patient.
2. Register or seed a doctor.
3. Log in as patient and book an appointment.
4. Verify the appointment appears in patient history.
5. Log in as doctor and add consultation notes.
6. Log in as admin and view system counts.
