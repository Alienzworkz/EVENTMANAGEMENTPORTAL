const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');

    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    console.log('👤 Creating users...');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventrix.com',
      password: 'admin123',
      role: 'admin',
      bio: 'System administrator for Eventrix platform.',
    });

    const organizer1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@eventrix.com',
      password: 'organizer123',
      role: 'organizer',
      bio: 'Professional event organizer specializing in tech conferences.',
      phone: '+1-555-0101',
    });

    const organizer2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@eventrix.com',
      password: 'organizer123',
      role: 'organizer',
      bio: 'Music and arts event curator with 10+ years of experience.',
      phone: '+1-555-0102',
    });

    const attendee1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@eventrix.com',
      password: 'attendee123',
      role: 'attendee',
      bio: 'Tech enthusiast and frequent conference goer.',
    });

    const attendee2 = await User.create({
      name: 'Emily Watson',
      email: 'emily@eventrix.com',
      password: 'attendee123',
      role: 'attendee',
      bio: 'Art lover and workshop participant.',
    });

    console.log('📅 Creating events...');

    const events = await Event.insertMany([
      {
        title: 'Tech Innovation Summit 2026',
        description:
          'Join industry leaders for a deep dive into AI, blockchain, and the future of technology. Featuring keynote speakers from top tech companies, hands-on workshops, and networking opportunities. This summit brings together the brightest minds in technology to discuss trends shaping our digital future.',
        category: 'conference',
        date: new Date('2026-06-15'),
        time: '09:00 AM',
        location: 'San Francisco, CA',
        venue: 'Moscone Center',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        price: 299,
        capacity: 500,
        registeredCount: 3,
        organizer: organizer1._id,
        status: 'upcoming',
        tags: ['technology', 'AI', 'innovation', 'networking'],
      },
      {
        title: 'Creative Design Workshop',
        description:
          'A hands-on workshop covering the latest design tools and methodologies. Learn from experienced designers and build your portfolio with real-world projects. Perfect for beginners and intermediate designers looking to level up their skills.',
        category: 'workshop',
        date: new Date('2026-05-20'),
        time: '10:00 AM',
        location: 'New York, NY',
        venue: 'Design Hub NYC',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        price: 79,
        capacity: 50,
        registeredCount: 2,
        organizer: organizer1._id,
        status: 'upcoming',
        tags: ['design', 'UI/UX', 'creative', 'workshop'],
      },
      {
        title: 'Summer Music Festival',
        description:
          'Three days of incredible live music featuring top artists from around the world. Multiple stages, food vendors, art installations, and unforgettable performances under the stars. A celebration of music, art, and community.',
        category: 'concert',
        date: new Date('2026-07-04'),
        time: '04:00 PM',
        location: 'Austin, TX',
        venue: 'Zilker Park',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        price: 150,
        capacity: 2000,
        registeredCount: 1,
        organizer: organizer2._id,
        status: 'upcoming',
        tags: ['music', 'festival', 'entertainment', 'outdoor'],
      },
      {
        title: 'Data Science Bootcamp',
        description:
          'Intensive 2-day bootcamp covering Python, machine learning, data visualization, and real-world case studies. Taught by industry professionals with years of experience in data science and analytics.',
        category: 'seminar',
        date: new Date('2026-05-10'),
        time: '09:00 AM',
        location: 'Chicago, IL',
        venue: 'University Conference Hall',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        price: 199,
        capacity: 100,
        registeredCount: 2,
        organizer: organizer1._id,
        status: 'upcoming',
        tags: ['data science', 'python', 'machine learning', 'bootcamp'],
      },
      {
        title: 'Startup Networking Night',
        description:
          'Connect with entrepreneurs, investors, and innovators at our monthly networking event. Pitch your ideas, find co-founders, and discover new investment opportunities in a casual, high-energy environment.',
        category: 'networking',
        date: new Date('2026-05-25'),
        time: '06:00 PM',
        location: 'Los Angeles, CA',
        venue: 'Startup Hub LA',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        price: 0,
        capacity: 200,
        registeredCount: 0,
        organizer: organizer2._id,
        status: 'upcoming',
        tags: ['startup', 'networking', 'entrepreneurship', 'free'],
      },
      {
        title: 'Championship Basketball Tournament',
        description:
          'Annual inter-city basketball championship featuring the top 16 teams competing for the grand trophy. Professional refereeing, live streaming, and amazing prizes for winners.',
        category: 'sports',
        date: new Date('2026-08-10'),
        time: '02:00 PM',
        location: 'Miami, FL',
        venue: 'Miami Sports Arena',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        price: 25,
        capacity: 5000,
        registeredCount: 0,
        organizer: organizer2._id,
        status: 'upcoming',
        tags: ['sports', 'basketball', 'tournament', 'competition'],
      },
      {
        title: 'Web Development Masterclass',
        description:
          'Full-stack web development masterclass covering React, Node.js, MongoDB, and deployment. Build a complete project from scratch and deploy it live by the end of the session.',
        category: 'workshop',
        date: new Date('2026-04-15'),
        time: '10:00 AM',
        location: 'Seattle, WA',
        venue: 'TechSpace Seattle',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        price: 99,
        capacity: 75,
        registeredCount: 5,
        organizer: organizer1._id,
        status: 'completed',
        tags: ['web development', 'react', 'node.js', 'coding'],
      },
      {
        title: 'Art & Culture Exhibition',
        description:
          'Explore contemporary art from emerging artists worldwide. Featuring paintings, sculptures, digital art installations, and interactive experiences. A celebration of creativity and cultural expression.',
        category: 'other',
        date: new Date('2026-06-01'),
        time: '11:00 AM',
        location: 'Boston, MA',
        venue: 'Boston Art Gallery',
        image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
        price: 15,
        capacity: 300,
        registeredCount: 0,
        organizer: organizer2._id,
        status: 'upcoming',
        tags: ['art', 'culture', 'exhibition', 'gallery'],
      },
    ]);

    console.log('🎟️  Creating bookings...');

    await Booking.insertMany([
      {
        event: events[0]._id,
        user: attendee1._id,
        ticketCount: 2,
        totalPrice: 598,
        status: 'confirmed',
      },
      {
        event: events[0]._id,
        user: attendee2._id,
        ticketCount: 1,
        totalPrice: 299,
        status: 'confirmed',
      },
      {
        event: events[1]._id,
        user: attendee1._id,
        ticketCount: 1,
        totalPrice: 79,
        status: 'confirmed',
      },
      {
        event: events[1]._id,
        user: attendee2._id,
        ticketCount: 1,
        totalPrice: 79,
        status: 'confirmed',
      },
      {
        event: events[2]._id,
        user: attendee1._id,
        ticketCount: 1,
        totalPrice: 150,
        status: 'confirmed',
      },
      {
        event: events[3]._id,
        user: attendee1._id,
        ticketCount: 1,
        totalPrice: 199,
        status: 'confirmed',
      },
      {
        event: events[3]._id,
        user: attendee2._id,
        ticketCount: 1,
        totalPrice: 199,
        status: 'confirmed',
      },
      {
        event: events[6]._id,
        user: attendee1._id,
        ticketCount: 1,
        totalPrice: 99,
        status: 'confirmed',
      },
    ]);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📧 Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin:     admin@eventrix.com / admin123');
    console.log('🧑‍💼 Organizer: sarah@eventrix.com / organizer123');
    console.log('🧑‍💼 Organizer: michael@eventrix.com / organizer123');
    console.log('👤 Attendee:  alex@eventrix.com / attendee123');
    console.log('👤 Attendee:  emily@eventrix.com / attendee123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
