const supabase = require('../config/supabase');

const PASSWORD_MANAGED_BY_AUTH = 'supabase_auth';

async function getRoleId(roleName) {
    const { data, error } = await supabase
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single();

    if (error || !data) {
        throw new Error(`Role "${roleName}" was not found`);
    }

    return data.id;
}

async function getPatientByUserId(userId) {
    const { data, error } = await supabase
        .from('patients')
        .select('id, user_id, users(full_name, email, phone)')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        user_id: data.user_id,
        full_name: data.users?.full_name,
        email: data.users?.email,
        phone: data.users?.phone,
    };
}

async function getDoctorByUserId(userId) {
    const { data, error } = await supabase
        .from('doctors')
        .select('id, user_id, specialization, users(full_name, phone)')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        user_id: data.user_id,
        specialization: data.specialization,
        full_name: data.users?.full_name,
        phone: data.users?.phone,
    };
}

module.exports = {
    PASSWORD_MANAGED_BY_AUTH,
    getRoleId,
    getPatientByUserId,
    getDoctorByUserId,
};
