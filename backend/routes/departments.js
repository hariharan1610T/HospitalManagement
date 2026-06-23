const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/departments - Public list for booking form
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('departments')
    .select('id, name, description, icon_url, is_active')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

module.exports = router;

