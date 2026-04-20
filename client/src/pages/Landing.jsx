import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, ArrowRight, Sparkles, Star, Zap, Shield } from 'lucide-react';
import EventCard from '../components/common/EventCard';
import { EventCardSkeleton } from '../components/common/Loader';
import eventService from '../services/eventService';
import { CATEGORY_ICONS } from '../utils/constants';

const Landing = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents({ limit: 6, status: 'upcoming' });
        setFeaturedEvents(res.data.data);
      } catch (error) {
        console.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '5K+', label: 'Events Hosted', icon: Calendar },
    { value: '100+', label: 'Cities', icon: MapPin },
  ];

  const features = [
    { icon: Zap, title: 'Easy Event Creation', desc: 'Create and publish events in minutes with our intuitive interface.' },
    { icon: Shield, title: 'Secure Bookings', desc: 'Safe and reliable ticket booking with instant confirmation.' },
    { icon: Star, title: 'Smart Discovery', desc: 'Find the perfect events with intelligent search and filtering.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-[500px] h-[500px] bg-indigo-500 -top-20 -left-20" />
        <div className="orb w-[400px] h-[400px] bg-purple-500 -bottom-20 -right-20" />
        <div className="orb w-[300px] h-[300px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              The Future of Event Management
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Discover & Create{' '}
              <span className="gradient-text">Unforgettable</span>{' '}
              Events
            </h1>

            <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-8 leading-relaxed">
              Eventrix is the premium platform for discovering, creating, and managing events.
              Join thousands of organizers and attendees creating memorable experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-primary text-base py-3 px-8 no-underline">
                Explore Events <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn-secondary text-base py-3 px-8 no-underline">
                Start Organizing
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose <span className="gradient-text">Eventrix</span>?</h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">Everything you need to manage events, all in one powerful platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 gradient-bg-subtle">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Find events that match your interests</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(CATEGORY_ICONS).map(([key, icon], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/events?category=${key}`}
                  className="glass-card p-4 flex flex-col items-center gap-2 text-center no-underline text-[hsl(var(--foreground))] hover:border-primary-500/30"
                >
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-medium capitalize">{key}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-[hsl(var(--muted-foreground))]">Don&apos;t miss out on these amazing events</p>
            </div>
            <Link to="/events" className="btn-secondary text-sm no-underline hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
              : featuredEvents.map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} />
                ))}
          </div>

          {!loading && featuredEvents.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-[hsl(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Check back soon for upcoming events!</p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/events" className="btn-primary no-underline">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="orb w-[200px] h-[200px] bg-indigo-500 -top-10 -right-10 opacity-20" />
            <div className="orb w-[150px] h-[150px] bg-purple-500 -bottom-10 -left-10 opacity-20" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Create Your <span className="gradient-text">Next Event</span>?
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto mb-8">
                Join Eventrix today and start creating unforgettable experiences. It&apos;s free to get started.
              </p>
              <Link to="/register" className="btn-primary text-base py-3 px-8 no-underline">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
