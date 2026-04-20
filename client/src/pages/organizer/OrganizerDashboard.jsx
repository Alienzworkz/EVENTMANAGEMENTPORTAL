import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, TrendingUp, Ticket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/common/DashboardCard';
import adminService from '../../services/adminService';
import { formatPrice, formatDate } from '../../lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981'];

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getOrganizerStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const eventStatusData = stats?.eventsByStatus?.map((s) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count,
  })) || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">Organizer Dashboard 📋</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">Welcome back, {user?.name}! Here&apos;s your event overview.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Events" value={stats?.totalEvents || 0} icon={Calendar} color="primary" index={0} />
        <DashboardCard title="Total Bookings" value={stats?.totalBookings || 0} icon={Ticket} color="success" index={1} />
        <DashboardCard title="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} color="warning" index={2} />
        <DashboardCard title="Total Attendees" value={stats?.totalAttendees || 0} icon={Users} color="info" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Event Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Events by Status</h2>
          {eventStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={eventStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {eventStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-[hsl(var(--muted-foreground))]">
              No event data yet
            </div>
          )}
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          {stats?.recentBookings?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                  <div>
                    <p className="text-sm font-medium">{booking.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{booking.event?.title}</p>
                  </div>
                  <span className="badge badge-success text-xs">Confirmed</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-[hsl(var(--muted-foreground))]">
              No recent bookings
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
