import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

// Attendee Pages
import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import MyBookings from './pages/attendee/MyBookings';
import Profile from './pages/attendee/Profile';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import ManageEvents from './pages/organizer/ManageEvents';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAllEvents from './pages/admin/ManageAllEvents';

const PageWrapper = ({ children, showFooter = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      {showFooter && <Footer />}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper showFooter={false}><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper showFooter={false}><Register /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/events/:id" element={<PageWrapper><EventDetails /></PageWrapper>} />

        {/* Attendee Dashboard */}
        <Route element={<ProtectedRoute roles={['attendee', 'organizer', 'admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<AttendeeDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Organizer Dashboard */}
        <Route element={<ProtectedRoute roles={['organizer', 'admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/create-event" element={<CreateEvent />} />
          <Route path="/organizer/my-events" element={<ManageEvents />} />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/events" element={<ManageAllEvents />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <PageWrapper showFooter={false}>
            <div className="min-h-screen flex items-center justify-center pt-16">
              <div className="text-center">
                <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                <p className="text-xl text-[hsl(var(--muted-foreground))] mb-6">Page not found</p>
                <a href="/" className="btn-primary no-underline">Go Home</a>
              </div>
            </div>
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
            <Navbar />
            <AppRoutes />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
