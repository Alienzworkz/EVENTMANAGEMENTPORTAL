import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../lib/utils';
import {
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'organizer': return '/organizer';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border)/0.5)]"
      style={{
        background: theme === 'dark'
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-decoration-none">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Eventrix</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all">
              Home
            </Link>
            <Link to="/events" className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all">
              Events
            </Link>
            {user && (
              <Link to={getDashboardPath()} className="px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-all"
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl glass-card p-2 shadow-xl"
                    >
                      <div className="px-3 py-2 border-b border-[hsl(var(--border))] mb-1">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{user.email}</p>
                        <span className="badge badge-primary mt-1 text-[10px]">{user.role}</span>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[hsl(var(--muted))] transition-all text-[hsl(var(--foreground))] no-underline"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-[hsl(var(--muted))] transition-all text-[hsl(var(--foreground))] no-underline"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 w-full transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm no-underline">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm no-underline">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[hsl(var(--border))] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[hsl(var(--muted))] transition-all no-underline text-[hsl(var(--foreground))]">Home</Link>
              <Link to="/events" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[hsl(var(--muted))] transition-all no-underline text-[hsl(var(--foreground))]">Events</Link>
              {user && (
                <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-[hsl(var(--muted))] transition-all no-underline text-[hsl(var(--foreground))]">Dashboard</Link>
              )}
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 no-underline text-center">Log in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 no-underline text-center">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
