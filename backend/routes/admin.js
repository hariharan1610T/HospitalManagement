require('dotenv').config();
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// GET /api/admin/metrics - Fetch system-wide counts
router.get('/metrics', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { count: patientCount, error: err1 } = await supabase.from('patients').select('*', { count: 'exact', head: true });
        const { count: doctorCount, error: err2 } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
        const { count: appointmentCount, error: err3 } = await supabase.from('appointments').select('*', { count: 'exact', head: true });

        if (err1 || err2 || err3) throw new Error('Failed to fetch metrics');

        res.json({
            patients: patientCount || 0,
            doctors: doctorCount || 0,
            appointments: appointmentCount || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/patients - Fetch all patients
router.get('/patients', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { data, error } = await supabase.from('patients').select('*, users!patients_user_id_fkey(full_name, email, phone)');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/doctors - Fetch all doctors
router.get('/doctors', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { data, error } = await supabase.from('doctors').select('*, users!doctors_user_id_fkey(full_name, email), departments(name)');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/appointments - Fetch all appointments
router.get('/appointments', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                appointment_date,
                slot_time,
                status,
                reason,
                patients ( users!patients_user_id_fkey(full_name) ),
                doctors ( users!doctors_user_id_fkey(full_name) )
            `)
            .order('appointment_date', { ascending: false });

        if (error) {
            console.error('Supabase error fetching appointments for admin:', error);
            throw error;
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
