const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
    // 1. Extract the token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // 3. Attach the user object to the request so routes can use it
    req.user = user;
    next();
};

module.exports = requireAuth;
