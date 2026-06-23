-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Appointment status enum
CREATE TYPE appointment_status AS ENUM (
  'pending', 'confirmed', 'cancelled', 'completed', 'no_show'
);

-- Notification type & status enums
CREATE TYPE notification_type   AS ENUM ('email', 'whatsapp', 'sms');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');

-- Gender enum
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

CREATE TABLE roles (
                       id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
                       name        text        NOT NULL UNIQUE,  -- 'admin' | 'doctor' | 'patient'
                       description text,
                       created_at  timestamptz DEFAULT now()
);

-- Seed default roles
INSERT INTO roles (name, description) VALUES
                                          ('admin',   'Full system access'),
                                          ('doctor',  'Clinical portal access'),
                                          ('patient', 'Patient portal access');

CREATE TABLE users (
                       id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email         text        NOT NULL UNIQUE,
                       password_hash text        NOT NULL,
                       full_name     text        NOT NULL,
                       phone         text,
                       role_id       uuid        NOT NULL REFERENCES roles(id),
                       avatar_url    text,
                       is_active     boolean     DEFAULT true,
                       last_login_at timestamptz,
                       created_at    timestamptz DEFAULT now(),
                       updated_at    timestamptz DEFAULT now()
);

CREATE TABLE departments (
                             id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
                             name        text        NOT NULL,
                             description text,
                             icon_url    text,
                             is_active   boolean     DEFAULT true,
                             created_at  timestamptz DEFAULT now()
);

-- Seed departments
INSERT INTO departments (name, description) VALUES
                                                ('General Medicine',  'Primary healthcare and diagnostics'),
                                                ('Cardiology',        'Heart and cardiovascular care'),
                                                ('Neurology',         'Brain and nervous system'),
                                                ('Orthopedics',       'Bones, joints and muscles'),
                                                ('Pediatrics',        'Children health care'),
                                                ('Dermatology',       'Skin, hair and nails'),
                                                ('Gynecology',        'Women health and maternity'),
                                                ('Ophthalmology',     'Eye care and vision');

CREATE TABLE doctors (
                         id                  uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
                         user_id             uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                         department_id       uuid        REFERENCES departments(id),
                         specialization      text,
                         qualification       text,       -- e.g. "MBBS, MD"
                         experience_years    int         DEFAULT 0 CHECK (experience_years >= 0),
                         available_days      text[]      DEFAULT ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'],
                         start_time          time        DEFAULT '09:00',
                         end_time            time        DEFAULT '17:00',
                         slot_duration_mins  int         DEFAULT 30 CHECK (slot_duration_mins > 0),
                         max_patients_day    int         DEFAULT 20,
                         consultation_fee    numeric(10,2) DEFAULT 500.00,
                         bio                 text,
                         rating              numeric(3,2) DEFAULT 0.00 CHECK (rating BETWEEN 0 AND 5),
                         total_reviews       int         DEFAULT 0,
                         created_at          timestamptz DEFAULT now()
);

CREATE TABLE patients (
                          id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
                          user_id           uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                          dob               date,
                          gender            gender_type,
                          blood_group       text        CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
                          address           text,
                          city              text,
                          pincode           text,
                          emergency_contact text,
                          emergency_name    text,
                          medical_notes     text,       -- brief chronic conditions note
                          allergies         text,
                          created_at        timestamptz DEFAULT now(),
                          updated_at        timestamptz DEFAULT now()
);

-- Tracks dates when a doctor is unavailable
CREATE TABLE doctor_leaves (
                               id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
                               doctor_id  uuid        NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
                               leave_date date        NOT NULL,
                               reason     text,
                               created_at timestamptz DEFAULT now(),
                               UNIQUE (doctor_id, leave_date)  -- no duplicate leave entries
);

CREATE TABLE appointments (
                              id               uuid              PRIMARY KEY DEFAULT uuid_generate_v4(),
                              patient_id       uuid              NOT NULL REFERENCES patients(id),
                              doctor_id        uuid              NOT NULL REFERENCES doctors(id),
                              appointment_date date              NOT NULL,
                              slot_time        time              NOT NULL,
                              token_number     int,
                              status           appointment_status DEFAULT 'pending',
                              reason           text,             -- patient's stated reason
                              notes            text,             -- doctor's consultation notes
                              cancelled_reason text,
                              booked_by        uuid              REFERENCES users(id), -- patient or admin
                              created_at       timestamptz       DEFAULT now(),
                              updated_at       timestamptz       DEFAULT now(),

    -- Prevent double-booking the same slot
                              UNIQUE (doctor_id, appointment_date, slot_time),

    -- Appointment must be in the future
                              CONSTRAINT future_date CHECK (appointment_date >= CURRENT_DATE)
);

CREATE TABLE notifications (
                               id             uuid              PRIMARY KEY DEFAULT uuid_generate_v4(),
                               appointment_id uuid              REFERENCES appointments(id) ON DELETE SET NULL,
                               user_id        uuid              NOT NULL REFERENCES users(id),
                               type           notification_type  NOT NULL,
                               status         notification_status DEFAULT 'pending',
                               message        text              NOT NULL,
                               error_log      text,             -- store failure reason if status = failed
                               sent_at        timestamptz,
                               created_at     timestamptz       DEFAULT now()
);
-- Enable RLS on every table
ALTER TABLE roles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- SERVICE ROLE bypasses all RLS automatically
-- Your Express backend uses SUPABASE_SERVICE_KEY → no policy needed there
-- Policies below protect direct anon/authenticated client access only

-- Roles are needed for registration and profile role resolution
CREATE POLICY "roles_public_read" ON roles
  FOR SELECT USING (true);

-- Anyone can read public user info (for doctor listings)
CREATE POLICY "users_public_read" ON users
  FOR SELECT USING (true);

-- Users can only update their own record
CREATE POLICY "users_self_update" ON users
  FOR UPDATE USING (id = auth.uid());

-- Patients see only their own appointments
CREATE POLICY "appt_patient_select" ON appointments
  FOR SELECT USING (
                 patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
                 );

-- Doctors see only their own appointments
CREATE POLICY "appt_doctor_select" ON appointments
  FOR SELECT USING (
                 doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
                 );

-- Patients can insert their own appointments
CREATE POLICY "appt_patient_insert" ON appointments
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

-- Patients can cancel (update status) their own upcoming appointments
CREATE POLICY "appt_patient_cancel" ON appointments
  FOR UPDATE USING (
                        patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
                        );

-- Doctors can update notes on their appointments
CREATE POLICY "appt_doctor_update" ON appointments
  FOR UPDATE USING (
                 doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
                 );

-- Users see only their own notifications
CREATE POLICY "notif_self_select" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Departments are public (needed for booking form)
CREATE POLICY "dept_public_read" ON departments
  FOR SELECT USING (true);

-- Doctors are public (needed for doctor listing page)
CREATE POLICY "doctor_public_read" ON doctors
  FOR SELECT USING (true);

-- Doctors can update their own profile
CREATE POLICY "doctor_self_update" ON doctors
  FOR UPDATE USING (user_id = auth.uid());

-- Users: fast lookup by email (login)
CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- Doctors: filter by department
CREATE INDEX idx_doctors_dept    ON doctors(department_id);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);

-- Appointments: most common queries
CREATE INDEX idx_appt_patient   ON appointments(patient_id);
CREATE INDEX idx_appt_doctor    ON appointments(doctor_id);
CREATE INDEX idx_appt_date      ON appointments(appointment_date);
CREATE INDEX idx_appt_status    ON appointments(status);

-- Composite: doctor daily schedule query
CREATE INDEX idx_appt_doctor_date
    ON appointments(doctor_id, appointment_date);

-- Doctor leaves: check by doctor and date
CREATE INDEX idx_leaves_doctor_date
    ON doctor_leaves(doctor_id, leave_date);

-- Notifications: user inbox query
CREATE INDEX idx_notif_user ON notifications(user_id);

-- Reusable function to stamp updated_at on any table
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to users
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach to patients
CREATE TRIGGER trg_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Attach to appointments
CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-assign token number per doctor per day
CREATE OR REPLACE FUNCTION assign_token_number()
RETURNS TRIGGER AS $$
BEGIN
SELECT COALESCE(MAX(token_number), 0) + 1
INTO NEW.token_number
FROM appointments
WHERE doctor_id        = NEW.doctor_id
  AND appointment_date = NEW.appointment_date;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_token
    BEFORE INSERT ON appointments
    FOR EACH ROW
    WHEN (NEW.token_number IS NULL)
    EXECUTE FUNCTION assign_token_number();

-- ---------------------------------------------------------------------------
-- Admin bootstrap (run after creating an admin in Supabase Authentication)
-- Replace the UUID and email with your Supabase Auth user values.
-- ---------------------------------------------------------------------------
-- INSERT INTO users (id, email, password_hash, full_name, role_id)
-- SELECT
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   'admin@hospital.com',
--   'supabase_auth',
--   'System Admin',
--   id
-- FROM roles
-- WHERE name = 'admin';