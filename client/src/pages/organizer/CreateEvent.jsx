import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Image } from 'lucide-react';
import eventService from '../../services/eventService';
import { CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'conference',
    date: '',
    time: '',
    location: '',
    venue: '',
    image: '',
    price: 0,
    capacity: 100,
    tags: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      await eventService.createEvent(eventData);
      toast.success('Event created successfully! 🎉');
      navigate('/organizer/my-events');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">Create New Event</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">Fill in the details to publish your event</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Event Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} className="input-field" placeholder="Enter event title" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[120px] resize-none" placeholder="Describe your event in detail..." required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Event Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Time *</label>
              <input type="text" name="time" value={formData.time} onChange={handleChange} className="input-field" placeholder="e.g. 09:00 AM" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Location *</label>
              <input name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="City, State" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Venue</label>
            <input name="venue" value={formData.venue} onChange={handleChange} className="input-field" placeholder="Venue name" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Image URL</label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input name="image" value={formData.image} onChange={handleChange} className="input-field pl-10" placeholder="https://example.com/image.jpg" />
            </div>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" onError={(e) => e.target.style.display = 'none'} />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Ticket Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Capacity *</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="input-field" min="1" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Tags</label>
            <input name="tags" value={formData.tags} onChange={handleChange} className="input-field" placeholder="Comma separated: tech, AI, networking" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary py-3 px-8">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
