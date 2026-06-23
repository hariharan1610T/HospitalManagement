import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';

// Public Pages
import HomePage from './pages/Public/HomePage';
import AboutPage from './pages/Public/AboutPage';
import DoctorsPage from './pages/Public/DoctorsPage';
import DepartmentsPage from './pages/Public/DepartmentsPage';
import ServicesPage from './pages/Public/ServicesPage';
import ContactPage from './pages/Public/ContactPage';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';

// Protected Pages
import DashboardHub from './pages/Protected/DashboardHub';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Route */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardHub /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
