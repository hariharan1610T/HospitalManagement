require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Import morgan

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const departmentsRoutes = require('./routes/departments');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

const app = express();

// --- Middleware ---
app.use(cors({ origin: '*' })); // Temporarily allow all origins
app.use(express.json());
app.use(morgan('dev')); // Use morgan for logging HTTP requests

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Hospital API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});