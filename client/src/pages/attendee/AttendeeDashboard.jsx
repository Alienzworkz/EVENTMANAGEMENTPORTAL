import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../../components/common/DashboardCard';
import bookingService from '../../services/bookingService';
import { formatDate, formatPrice, getStatusColor } from '../../lib/utils';

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getMyBookings({ limit: 5 });
        setBookings(res.data.data);
      } catch (error) {
        console.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const upcomingEvents = confirmedBookings.filter(
    (b) => b.event && new Date(b.event.date) > new Date()
  );
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name} 👋</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">Here&apos;s your event activity overview</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Bookings" value={bookings.length} icon={Ticket} color="primary" index={0} />
        <DashboardCard title="Upcoming Events" value={upcomingEvents.length} icon={Calendar} color="success" index={1} />
        <DashboardCard title="Total Spent" value={formatPrice(totalSpent)} icon={TrendingUp} color="warning" index={2} />
        <DashboardCard title="Events Attended" value={confirmedBookings.length - upcomingEvents.length} icon={Star} color="info" index={3} />
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border)/0.5)]">
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider pb-3">Event</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider pb-3">Date</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider pb-3">Tickets</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider pb-3">Amount</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-[hsl(var(--border)/0.3)] last:border-0">
                    <td className="py-3">
                      <p className="font-medium text-sm">{booking.event?.title || 'Deleted Event'}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{booking.event?.location}</p>
                    </td>
                    <td className="py-3 text-sm text-[hsl(var(--muted-foreground))]">
                      {booking.event?.date ? formatDate(booking.event.date) : 'N/A'}
                    </td>
                    <td className="py-3 text-sm">{booking.ticketCount}</td>
                    <td className="py-3 text-sm font-medium">{formatPrice(booking.totalPrice)}</td>
                    <td className="py-3">
                      <span className={`badge ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Ticket className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3 opacity-50" />
            <p className="text-[hsl(var(--muted-foreground))]">No bookings yet. Start exploring events!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AttendeeDashboard;
