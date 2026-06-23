const nodemailer = require('nodemailer');
const twilio = require('twilio');
const supabase = require('../config/supabase');

const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const hasEmailConfig = Boolean(process.env.EMAIL_USER && emailPass);
const hasWhatsAppConfig = Boolean(
    process.env.TWILIO_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
);

const transporter = hasEmailConfig
    ? nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: emailPass,
        },
    })
    : null;

const twilioClient = hasWhatsAppConfig
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const formatSlotTime = (slotTime) => {
    if (!slotTime) return '';
    return slotTime.length >= 5 ? slotTime.slice(0, 5) : slotTime;
};

const normalizeWhatsAppPhone = (phone) => {
    if (!phone) return null;

    const trimmed = phone.trim();
    if (trimmed.startsWith('+')) return trimmed;

    const digits = trimmed.replace(/\D/g, '');
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;

    return `+${digits}`;
};

const sendEmail = async (patient, doctor, appointment) => {
    if (!transporter) {
        return { skipped: true, reason: 'Email credentials not configured' };
    }

    if (!patient.email) {
        return { skipped: true, reason: 'Patient email not available' };
    }

    await transporter.sendMail({
        from: `"CareOps Cloud" <${process.env.EMAIL_USER}>`,
        to: patient.email,
        subject: 'Appointment Confirmed',
        html: `
            <h3>Appointment Confirmed</h3>
            <p>Dear ${patient.full_name},</p>
            <p>Your appointment has been booked successfully.</p>
            <ul>
                <li><strong>Doctor:</strong> Dr. ${doctor.full_name}</li>
                <li><strong>Date:</strong> ${appointment.appointment_date}</li>
                <li><strong>Time:</strong> ${formatSlotTime(appointment.slot_time)}</li>
                <li><strong>Token:</strong> #${appointment.token_number}</li>
            </ul>
            <p>Please arrive 10 minutes early.</p>
        `,
    });

    return { skipped: false };
};

const sendWhatsApp = async (patient, doctor, appointment) => {
    if (!twilioClient) {
        return { skipped: true, reason: 'Twilio WhatsApp credentials not configured' };
    }

    const phone = normalizeWhatsAppPhone(patient.phone);
    if (!phone) {
        return { skipped: true, reason: 'Patient phone number not available' };
    }

    await twilioClient.messages.create({
        body: `Appointment Confirmed\nDoctor: Dr. ${doctor.full_name}\nDate: ${appointment.appointment_date}\nTime: ${formatSlotTime(appointment.slot_time)}\nToken: #${appointment.token_number}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phone}`,
    });

    return { skipped: false };
};

const notifyAppointmentBooked = async (appointment, patient, doctor) => {
    const tasks = [
        { type: 'email', runner: () => sendEmail(patient, doctor, appointment) },
        { type: 'whatsapp', runner: () => sendWhatsApp(patient, doctor, appointment) },
    ];

    const results = await Promise.allSettled(tasks.map((task) => task.runner()));

    const logEntries = results.map((result, index) => {
        const task = tasks[index];
        const skipped = result.status === 'fulfilled' && result.value?.skipped;
        const failed = result.status === 'rejected' || skipped;

        return {
            user_id: patient.user_id,
            appointment_id: appointment.id,
            type: task.type,
            status: failed ? 'failed' : 'sent',
            message: result.status === 'rejected'
                ? result.reason.toString()
                : skipped
                    ? result.value.reason
                    : `Confirmed: Appointment with Dr. ${doctor.full_name}`,
            error_log: failed
                ? (result.status === 'rejected' ? result.reason.toString() : result.value.reason)
                : null,
            sent_at: failed ? null : new Date().toISOString(),
        };
    });

    const { error } = await supabase.from('notifications').insert(logEntries);
    if (error) {
        console.error('Failed to log notifications:', error.message);
    }

    return logEntries;
};

const getNotificationConfig = () => ({
    email: hasEmailConfig,
    whatsapp: hasWhatsAppConfig,
});

module.exports = { notifyAppointmentBooked, getNotificationConfig };
