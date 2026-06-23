const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

// GET /api/users/profile - Get current user role and details
router.get('/profile', requireAuth, async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*, roles(name)')
        .eq('id', req.user.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
