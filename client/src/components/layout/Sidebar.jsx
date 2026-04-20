import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../lib/utils';
import {
  LayoutDashboard, Calendar, Users, BarChart3, Settings,
  PlusCircle, Ticket, User, LogOut, ChevronLeft, ChevronRight,
  Sparkles, Sun, Moon, BookOpen, Shield, CalendarCheck,
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const attendeeLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/events', icon: Calendar, label: 'Browse Events' },
    { to: '/my-bookings', icon: Ticket, label: 'My Bookings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const organizerLinks = [
    { to: '/organizer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/organizer/create-event', icon: PlusCircle, label: 'Create Event' },
    { to: '/organizer/my-events', icon: CalendarCheck, label: 'My Events' },
    { to: '/events', icon: Calendar, label: 'Browse Events' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/events', icon: Calendar, label: 'Manage Events' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/events', icon: BookOpen, label: 'Browse Events' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'admin': return adminLinks;
      case 'organizer': return organizerLinks;
      default: return attendeeLinks;
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin': return { label: 'Admin', icon: Shield, color: 'text-red-500' };
      case 'organizer': return { label: 'Organizer', icon: Settings, color: 'text-purple-500' };
      default: return { label: 'Attendee', icon: User, color: 'text-blue-500' };
    }
  };

  const role = getRoleBadge();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-16 bottom-0 z-40 border-r border-[hsl(var(--border)/0.5)] flex flex-col"
      style={{
        background: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-all shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* User info */}
      <div className={`p-4 border-b border-[hsl(var(--border)/0.5)] ${collapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user ? getInitials(user.name) : '?'}
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <div className="flex items-center gap-1">
                <role.icon className={`w-3 h-3 ${role.color}`} />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{role.label}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {getLinks().map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/organizer' || link.to === '/admin'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? link.label : ''}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                {link.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[hsl(var(--border)/0.5)] space-y-1">
        <button
          onClick={toggleTheme}
          className={`sidebar-link w-full ${collapsed ? 'justify-center px-2' : ''}`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
