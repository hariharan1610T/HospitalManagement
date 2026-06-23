const supabase = require('../config/supabase');

const requireRole = (...allowedRoles) => async (req, res, next) => {
    const { data, error } = await supabase
        .from('users')
        .select('roles(name)')
        .eq('id', req.user.id)
        .single();

    if (error || !data) {
        return res.status(403).json({ error: 'Forbidden: profile not found' });
    }

    const role = data.roles?.name;
    if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    req.role = role;
    next();
};

module.exports = requireRole;
