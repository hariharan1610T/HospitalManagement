const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

function mapDoctorRow(row) {
    return {
        id: row.id,
        specialization: row.specialization,
        qualification: row.qualification,
        experience_years: row.experience_years,
        consultation_fee: row.consultation_fee,
        rating: row.rating,
        full_name: row.users?.full_name,
        phone: row.users?.phone,
        avatar_url: row.users?.avatar_url,
        departments: row.departments,
    };
}

// GET /api/doctors - Public route for doctor listings and booking
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('doctors')
        .select(`
            id,
            specialization,
            qualification,
            experience_years,
            consultation_fee,
            rating,
            departments (name),
            users!doctors_user_id_fkey (full_name, phone, avatar_url)
        `)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json((data || []).map(mapDoctorRow));
});

module.exports = router;
