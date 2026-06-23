const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');
const { getNotificationConfig } = require('../utils/notifier');

// GET /api/notifications - Current user's notification history
router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('id, type, status, message, error_log, sent_at, created_at, appointment_id')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET /api/notifications/config - Which channels are configured on the server
router.get('/config', requireAuth, (_req, res) => {
    res.json(getNotificationConfig());
});

module.exports = router;
