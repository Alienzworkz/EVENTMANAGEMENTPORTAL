import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, X, Calendar } from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatDate, formatPrice, getStatusColor, getCategoryColor } from '../../lib/utils';
import { CATEGORY_ICONS } from '../../utils/constants';
import { PageLoader } from '../../components/common/Loader';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const res = await bookingService.getMyBookings(params);
      setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">My Bookings</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">View and manage your event bookings</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'confirmed', 'cancelled', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === status
                ? 'gradient-bg text-white'
                : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Event image */}
                <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={booking.event?.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}
                    alt={booking.event?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold truncate">{booking.event?.title || 'Deleted Event'}</h3>
                    <span className={`badge ${getStatusColor(booking.status)} shrink-0`}>{booking.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {booking.event?.date ? formatDate(booking.event.date) : 'N/A'}
                    </span>
                    <span>{booking.event?.time}</span>
                    <span>{booking.event?.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-4 text-sm">
                      <span>Tickets: <strong>{booking.ticketCount}</strong></span>
                      <span>Total: <strong>{formatPrice(booking.totalPrice)}</strong></span>
                    </div>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-red-500 text-sm hover:text-red-600 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Ticket className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
          <p className="text-[hsl(var(--muted-foreground))]">
            {filter !== 'all' ? 'No bookings match this filter' : 'You haven\'t booked any events yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
