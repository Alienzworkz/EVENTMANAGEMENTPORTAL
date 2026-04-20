import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Tag, ArrowLeft, Ticket, User, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/Loader';
import { formatDate, formatPrice, getCategoryColor, getStatusColor } from '../lib/utils';
import { CATEGORY_ICONS } from '../utils/constants';
import eventService from '../services/eventService';
import bookingService from '../services/bookingService';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await eventService.getEvent(id);
      setEvent(res.data.data);
    } catch (error) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    setBooking(true);
    try {
      await bookingService.createBooking({ eventId: id, ticketCount });
      toast.success('Booking confirmed! 🎉');
      setShowBookingModal(false);
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!event) return null;

  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Image */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-black/30 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge ${getCategoryColor(event.category)}`}>
                  {CATEGORY_ICONS[event.category]} {event.category}
                </span>
                <span className={`badge ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Calendar className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatDate(event.date)}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.time}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.location}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{event.venue || 'Venue'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Users className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.registeredCount} / {event.capacity}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Registered</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[hsl(var(--border)/0.5)] pt-6">
                <h2 className="text-lg font-semibold mb-3">About This Event</h2>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {event.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">
                      <Tag className="w-3 h-3 mr-1" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Organizer */}
              {event.organizer && (
                <div className="mt-6 pt-6 border-t border-[hsl(var(--border)/0.5)]">
                  <h3 className="text-sm font-semibold mb-3 text-[hsl(var(--muted-foreground))]">Organized by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                      {event.organizer.name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{event.organizer.name}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{event.organizer.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar - Booking card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold gradient-text">{formatPrice(event.price)}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">per ticket</p>
              </div>

              <div className="space-y-3 mb-6 p-4 rounded-xl bg-[hsl(var(--muted)/0.5)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">Available Spots</span>
                  <span className={`font-semibold ${isFull ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isFull ? 'Sold Out' : `${spotsLeft} left`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">Total Capacity</span>
                  <span className="font-medium">{event.capacity}</span>
                </div>
              </div>

              {event.status === 'upcoming' && !isFull ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5">Number of Tickets</label>
                    <select
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Number(e.target.value))}
                      className="input-field"
                    >
                      {Array.from({ length: Math.min(10, spotsLeft) }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'ticket' : 'tickets'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between text-sm mb-4 p-3 rounded-lg bg-primary-500/5">
                    <span>Total</span>
                    <span className="font-bold">{formatPrice(event.price * ticketCount)}</span>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={booking}
                    className="btn-primary w-full py-3"
                  >
                    <Ticket className="w-5 h-5" />
                    {booking ? 'Booking...' : 'Book Now'}
                  </button>
                </>
              ) : (
                <button disabled className="btn-secondary w-full py-3 opacity-60">
                  {isFull ? 'Sold Out' : 'Event ' + event.status}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
