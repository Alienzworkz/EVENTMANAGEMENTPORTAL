import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Tag } from 'lucide-react';
import { formatDate, formatPrice, truncateText, getCategoryColor, getStatusColor } from '../../lib/utils';
import { CATEGORY_ICONS } from '../../utils/constants';

const EventCard = ({ event, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-[hsl(var(--foreground))]">
          {formatPrice(event.price)}
        </div>

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${getCategoryColor(event.category)} backdrop-blur-sm`}>
            {CATEGORY_ICONS[event.category]} {event.category}
          </span>
        </div>

        {/* Status */}
        <div className="absolute bottom-3 left-3">
          <span className={`badge ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2">
          {truncateText(event.description, 120)}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border)/0.5)]">
          <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
            <Users className="w-4 h-4" />
            <span>{event.registeredCount}/{event.capacity}</span>
          </div>
          <Link
            to={`/events/${event._id}`}
            className="btn-primary text-xs py-1.5 px-4 no-underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
