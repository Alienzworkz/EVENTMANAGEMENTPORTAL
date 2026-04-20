import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Calendar, Users } from 'lucide-react';
import eventService from '../../services/eventService';
import { formatDate, formatPrice, getStatusColor } from '../../lib/utils';
import { PageLoader } from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const res = await eventService.getMyEvents(params);
      setEvents(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also cancel all bookings.')) return;
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Events</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Manage and track your events</p>
        </div>
        <Link to="/organizer/create-event" className="btn-primary no-underline">+ Create Event</Link>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              filter === status ? 'gradient-bg text-white' : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : events.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted)/0.5)]">
                <tr>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Event</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Date</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Price</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Attendees</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Status</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <motion.tr
                    key={event._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[hsl(var(--border)/0.3)] hover:bg-[hsl(var(--muted)/0.3)] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">{event.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{formatDate(event.date)}</td>
                    <td className="p-4 text-sm font-medium">{formatPrice(event.price)}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {event.registeredCount}/{event.capacity}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${getStatusColor(event.status)}`}>{event.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/events/${event._id}`} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(event._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
          <p className="text-[hsl(var(--muted-foreground))] mb-4">Create your first event to get started</p>
          <Link to="/organizer/create-event" className="btn-primary no-underline">Create Event</Link>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
