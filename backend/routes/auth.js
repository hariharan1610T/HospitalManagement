const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { PASSWORD_MANAGED_BY_AUTH, getRoleId } = require('../utils/profiles');

const ALLOWED_ROLES = ['patient', 'doctor'];

router.post('/register', async (req, res) => {
    const { email, password, full_name, phone, role, specialization } = req.body;

    if (!email || !password || !full_name || !role) {
        return res.status(400).json({ error: 'Email, password, full name, and role are required' });
    }

    if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: 'Role must be patient or doctor' });
    }

    if (role === 'patient' && !phone) {
        return res.status(400).json({ error: 'Phone is required for patient registration' });
    }

    if (role === 'doctor' && !specialization) {
        return res.status(400).json({ error: 'Specialization is required for doctor registration' });
    }

    let authUserId = null;

    try {
        const roleId = await getRoleId(role);

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, role },
        });

        if (authError) throw authError;

        authUserId = authData.user.id;

        const { error: userError } = await supabase.from('users').insert([{
            id: authUserId,
            email,
            password_hash: PASSWORD_MANAGED_BY_AUTH,
            full_name,
            phone: phone || null,
            role_id: roleId,
        }]);

        if (userError) throw userError;

        if (role === 'patient') {
            const { error: patientError } = await supabase.from('patients').insert([{
                user_id: authUserId,
            }]);

            if (patientError) throw patientError;
        } else {
            const { error: doctorError } = await supabase.from('doctors').insert([{
                user_id: authUserId,
                specialization,
            }]);

            if (doctorError) throw doctorError;
        }

        res.status(201).json({ message: 'Account created successfully', userId: authUserId });
    } catch (err) {
        if (authUserId) {
            await supabase.auth.admin.deleteUser(authUserId);
        }

        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
