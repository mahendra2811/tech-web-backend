import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import Project from '../models/project.model';
import Service from '../models/service.model';
import Testimonial from '../models/testimonial.model';

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'editor@example.com',
    password: 'password123',
    firstName: 'Editor',
    lastName: 'User',
    role: 'editor'
  },
  {
    email: 'client@example.com',
    password: 'password123',
    firstName: 'Client',
    lastName: 'User',
    role: 'client'
  }
];

const projects = [
  {
    title: 'E-commerce Platform',
    category: 'Web Development',
    description: 'A full-featured e-commerce platform with product management, cart, and checkout functionality.',
    detailedDescription: 'This e-commerce platform was built using React, Node.js, and MongoDB. It features a responsive design, product search and filtering, user authentication, shopping cart, payment processing with Stripe, and an admin dashboard for managing products, orders, and users.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    techStack: [
      { name: 'React', icon: 'react' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'MongoDB', icon: 'mongodb' }
    ],
    image: 'ecommerce-platform.jpg',
    gallery: ['ecommerce-1.jpg', 'ecommerce-2.jpg', 'ecommerce-3.jpg'],
    featured: true,
    projectDate: new Date('2023-05-15'),
    tags: ['e-commerce', 'web app', 'responsive'],
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://ecommerce-example.com',
    isOpenSource: true,
    status: 'active'
  },
  {
    title: 'Task Management App',
    category: 'Mobile App',
    description: 'A task management application for iOS and Android with real-time updates and team collaboration.',
    detailedDescription: 'This task management app was built using React Native and Firebase. It allows users to create tasks, assign them to team members, set due dates, and track progress. The app features real-time updates, push notifications, and offline support.',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
    techStack: [
      { name: 'React Native', icon: 'react' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Redux', icon: 'redux' }
    ],
    image: 'task-management.jpg',
    gallery: ['task-app-1.jpg', 'task-app-2.jpg'],
    featured: true,
    projectDate: new Date('2023-08-10'),
    tags: ['mobile app', 'productivity', 'collaboration'],
    githubUrl: 'https://github.com/example/task-app',
    liveUrl: 'https://taskapp-example.com',
    isOpenSource: false,
    status: 'active'
  },
  {
    title: 'Portfolio Website',
    category: 'Web Design',
    description: 'A modern portfolio website for a digital artist with a gallery and contact form.',
    detailedDescription: 'This portfolio website was designed and developed for a digital artist to showcase their work. It features a responsive design, image gallery with filtering options, contact form, and blog section. The website was built using Next.js and TailwindCSS.',
    technologies: ['Next.js', 'TailwindCSS', 'Framer Motion'],
    techStack: [
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'TailwindCSS', icon: 'tailwind' },
      { name: 'Framer Motion', icon: 'framer' }
    ],
    image: 'portfolio-website.jpg',
    gallery: ['portfolio-1.jpg', 'portfolio-2.jpg'],
    featured: false,
    projectDate: new Date('2023-03-20'),
    tags: ['portfolio', 'web design', 'responsive'],
    githubUrl: 'https://github.com/example/portfolio',
    liveUrl: 'https://portfolio-example.com',
    isOpenSource: true,
    status: 'active'
  }
];

const services = [
  {
    title: 'Web Development',
    description: 'Custom web application development using modern technologies and best practices.',
    detailedDescription: 'We build custom web applications tailored to your business needs. Our team of experienced developers uses modern technologies and follows best practices to deliver high-quality, scalable, and maintainable web applications.',
    icon: 'code',
    features: [
      'Custom web application development',
      'Frontend and backend development',
      'API development and integration',
      'E-commerce solutions',
      'Content management systems'
    ],
    price: {
      amount: 5000,
      currency: 'USD',
      billingCycle: 'one-time'
    }
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile app development for iOS and Android.',
    detailedDescription: 'We develop native and cross-platform mobile applications for iOS and Android. Our team uses the latest technologies and follows platform-specific design guidelines to deliver high-quality mobile apps that provide a great user experience.',
    icon: 'smartphone',
    features: [
      'iOS and Android app development',
      'Cross-platform development',
      'UI/UX design',
      'App store submission',
      'Maintenance and support'
    ],
    price: {
      amount: 8000,
      currency: 'USD',
      billingCycle: 'one-time'
    }
  },
  {
    title: 'UI/UX Design',
    description: 'User-centered design services to create intuitive and engaging user experiences.',
    detailedDescription: 'Our UI/UX design services focus on creating intuitive and engaging user experiences. We follow a user-centered design approach, conducting research, creating wireframes and prototypes, and iterating based on user feedback to ensure the final product meets user needs and business goals.',
    icon: 'palette',
    features: [
      'User research',
      'Wireframing and prototyping',
      'Visual design',
      'Usability testing',
      'Design systems'
    ],
    price: {
      amount: 3000,
      currency: 'USD',
      billingCycle: 'one-time'
    }
  }
];

const testimonials = [
  {
    name: 'John Smith',
    position: 'CEO',
    company: 'Tech Innovations',
    content: 'Working with this team was a game-changer for our business. They delivered a high-quality web application that exceeded our expectations and helped us streamline our operations.',
    rating: 5,
    avatar: 'john-smith.jpg',
    featured: true
  },
  {
    name: 'Sarah Johnson',
    position: 'Marketing Director',
    company: 'Growth Marketing',
    content: 'The mobile app they developed for us has received great feedback from our users. The team was professional, responsive, and delivered the project on time and within budget.',
    rating: 5,
    avatar: 'sarah-johnson.jpg',
    featured: true
  },
  {
    name: 'Michael Brown',
    position: 'Product Manager',
    company: 'Innovate Solutions',
    content: 'Their UI/UX design services transformed our product. The user experience is now intuitive and engaging, and we\'ve seen a significant increase in user satisfaction and retention.',
    rating: 4,
    avatar: 'michael-brown.jpg',
    featured: false
  }
];

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

// Seed data
const seedData = async (): Promise<void> => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});

    console.log('Data cleared');

    // Create users
    await User.create(users);
    console.log('Users seeded');

    // Create projects
    await Project.create(projects);
    console.log('Projects seeded');

    // Create services
    await Service.create(services);
    console.log('Services seeded');

    // Create testimonials
    await Testimonial.create(testimonials);
    console.log('Testimonials seeded');

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
    process.exit(1);
  }
};

// Run the seeder
connectDB().then(() => {
  seedData();
});