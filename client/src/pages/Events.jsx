import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Calendar, X } from 'lucide-react';
import EventCard from '../components/common/EventCard';
import { EventCardSkeleton } from '../components/common/Loader';
import eventService from '../services/eventService';
import { CATEGORIES, STATUSES } from '../utils/constants';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    status: searchParams.get('status') || 'all',
    page: 1,
  });

  useEffect(() => {
    fetchEvents();
  }, [filters.category, filters.status, filters.page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { limit: 12, page: filters.page };
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.status !== 'all') params.status = filters.status;

      const res = await eventService.getEvents(params);
      setEvents(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchEvents();
  };

  const clearFilters = () => {
    setFilters({ search: '', category: 'all', status: 'all', page: 1 });
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.status !== 'all';

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Explore Events</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Discover amazing events happening around you
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-10"
                placeholder="Search events by title, location..."
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary ${showFilters ? 'bg-primary-500/10 text-primary-500' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </form>

          {/* Filter options */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-[hsl(var(--border)/0.5)] flex flex-wrap gap-4"
            >
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium mb-1.5 text-[hsl(var(--muted-foreground))]">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                  className="input-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-medium mb-1.5 text-[hsl(var(--muted-foreground))]">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="input-field"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <div className="flex items-end">
                  <button onClick={clearFilters} className="btn-secondary text-sm text-red-500">
                    <X className="w-4 h-4" /> Clear
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            Showing {events.length} of {pagination.total} events
          </p>
        )}

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
            : events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
        </div>

        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-4">Try adjusting your filters or search terms</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  filters.page === i + 1
                    ? 'gradient-bg text-white'
                    : 'hover:bg-[hsl(var(--muted))]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.pages}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
