import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, CheckCircle, XCircle, Calendar } from 'lucide-react';
import eventService from '../../services/eventService';
import { formatDate, formatPrice, getStatusColor } from '../../lib/utils';
import { CATEGORIES, STATUSES } from '../../utils/constants';
import { PageLoader } from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await eventService.getAllEventsAdmin(params);
      setEvents(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event and all its bookings?')) return;
    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleApprove = async (id, approved) => {
    try {
      await eventService.approveEvent(id, { isApproved: approved });
      toast.success(`Event ${approved ? 'approved' : 'rejected'}`);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">Manage All Events</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">Oversee all events on the platform</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search events..." />
            </div>
            <button type="submit" className="btn-primary">Search</button>
          </form>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? <PageLoader /> : events.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted)/0.5)]">
                <tr>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Event</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Organizer</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Date</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Price</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Status</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Approved</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <motion.tr key={event._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-[hsl(var(--border)/0.3)] hover:bg-[hsl(var(--muted)/0.3)]">
                    <td className="p-4">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{event.location}</p>
                    </td>
                    <td className="p-4 text-sm">{event.organizer?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-[hsl(var(--muted-foreground))]">{formatDate(event.date)}</td>
                    <td className="p-4 text-sm font-medium">{formatPrice(event.price)}</td>
                    <td className="p-4"><span className={`badge ${getStatusColor(event.status)}`}>{event.status}</span></td>
                    <td className="p-4">
                      {event.isApproved ? (
                        <span className="text-emerald-500 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Yes</span>
                      ) : (
                        <span className="text-red-500 text-sm flex items-center gap-1"><XCircle className="w-4 h-4" /> No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link to={`/events/${event._id}`} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"><Eye className="w-4 h-4" /></Link>
                        {!event.isApproved ? (
                          <button onClick={() => handleApprove(event._id, true)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                        ) : (
                          <button onClick={() => handleApprove(event._id, false)} className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500" title="Reject"><XCircle className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => handleDelete(event._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 className="w-4 h-4" /></button>
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
        </div>
      )}
    </div>
  );
};

export default ManageAllEvents;
