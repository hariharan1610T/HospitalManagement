const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');
const { getPatientByUserId, getDoctorByUserId } = require('../utils/profiles');
const { notifyAppointmentBooked } = require('../utils/notifier');

// POST /api/appointments - Create a new appointment
router.post('/', requireAuth, async (req, res) => {
    const { doctor_id, appointment_date, slot_time, reason } = req.body;

    if (!doctor_id || !appointment_date || !slot_time) {
        return res.status(400).json({ error: 'Doctor, date, and time are required' });
    }

    try {
        const patient = await getPatientByUserId(req.user.id);
        if (!patient) {
            return res.status(403).json({ error: 'Patient profile not found for this account' });
        }

        const { data: appointmentData, error: appointmentError } = await supabase
            .from('appointments')
            .insert([{
                patient_id: patient.id,
                doctor_id,
                appointment_date,
                slot_time,
                reason: reason || null,
                booked_by: req.user.id,
            }])
            .select()
            .single();

        if (appointmentError) throw appointmentError;

        const { data: doctorData, error: doctorError } = await supabase
            .from('doctors')
            .select('id, users!doctors_user_id_fkey(full_name)')
            .eq('id', doctor_id)
            .single();

        if (doctorError || !doctorData) throw new Error('Selected doctor was not found');

        const notifications = await notifyAppointmentBooked(
            appointmentData,
            patient,
            { full_name: doctorData.users?.full_name || 'Doctor' },
        );

        res.status(201).json({ ...appointmentData, notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/appointments - Get appointments for the logged-in patient
router.get('/', requireAuth, async (req, res) => {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
        return res.status(403).json({ error: 'Patient profile not found for this account' });
    }

    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            doctors (
                specialization,
                users!doctors_user_id_fkey (full_name)
            )
        `)
        .eq('patient_id', patient.id)
        .order('appointment_date', { ascending: false })
        .order('slot_time', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET /api/appointments/doctor - Get queue for the logged-in doctor
router.get('/doctor', requireAuth, async (req, res) => {
    const doctor = await getDoctorByUserId(req.user.id);
    if (!doctor) {
        return res.status(403).json({ error: 'Doctor profile not found for this account' });
    }

    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            patients (
                users!patients_user_id_fkey (full_name, phone)
            )
        `)
        .eq('doctor_id', doctor.id)
        .order('appointment_date', { ascending: true })
        .order('slot_time', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PUT /api/appointments/:id/notes - Add consultation notes
router.put('/:id/notes', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    const doctor = await getDoctorByUserId(req.user.id);
    if (!doctor) {
        return res.status(403).json({ error: 'Doctor profile not found for this account' });
    }

    const { data, error } = await supabase
        .from('appointments')
        .update({
            notes,
            status: 'completed',
        })
        .eq('id', id)
        .eq('doctor_id', doctor.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Appointment not found or you do not have permission to update it.' });

    res.json(data);
});

module.exports = router;
