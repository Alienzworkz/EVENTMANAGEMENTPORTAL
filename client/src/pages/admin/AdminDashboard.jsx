import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, Ticket, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import DashboardCard from '../../components/common/DashboardCard';
import adminService from '../../services/adminService';
import { formatPrice, formatDate } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const categoryData = stats?.eventsByCategory?.map((c) => ({
    name: c._id?.charAt(0).toUpperCase() + c._id?.slice(1) || 'Other',
    value: c.count,
  })) || [];

  const statusData = stats?.eventsByStatus?.map((s) => ({
    name: s._id?.charAt(0).toUpperCase() + s._id?.slice(1) || 'Unknown',
    count: s.count,
  })) || [];

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = stats?.monthlyBookings?.map((m) => ({
    name: monthNames[m._id.month],
    bookings: m.count,
    revenue: m.revenue,
  })).reverse() || [];

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
    border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard 👑</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">Complete system overview and analytics</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="primary" index={0} />
        <DashboardCard title="Total Events" value={stats?.totalEvents || 0} icon={Calendar} color="success" index={1} />
        <DashboardCard title="Total Bookings" value={stats?.totalBookings || 0} icon={Ticket} color="warning" index={2} />
        <DashboardCard title="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} color="danger" index={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="bookings" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-[hsl(var(--muted-foreground))]">
              No booking data yet
            </div>
          )}
        </motion.div>

        {/* Events by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Events by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-[hsl(var(--muted-foreground))]">
              No category data yet
            </div>
          )}
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {categoryData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Events by Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis type="number" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis dataKey="name" type="category" width={90} stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-[hsl(var(--muted-foreground))]">No data</div>
          )}
        </motion.div>

        {/* Recent Users & Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          {stats?.recentUsers?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                      {u.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{u.email}</p>
                    </div>
                  </div>
                  <span className="badge badge-primary text-[10px] capitalize">{u.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">No recent users</div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
