require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'protofolio-asstes',
  api_key: '827524244388968',
  api_secret: 'yEWOTfBY_3MLoWdSXL-gPJL_jvQ'
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static frontend and local uploads securely
app.use(express.static(path.join(__dirname, '../client/dist')));
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Multer for local hero background profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

const portfolioSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Full comprehensive data matching resume
function getDefaultData() {
  return {
    hero: { 
      name: 'Jesron R', 
      title: 'Backend-focused MERN Developer', 
      subtitle: 'Building Scalable APIs & Clean System Architecture', 
      description: 'B.E. ECE Student consistently shipping real-world projects utilizing Node.js, Docker, AWS, and Linux. Natural problem-solver, driven by curiosity, with a profound grasp of deep data structure algorithms.', 
      roles: ['MERN Stack', 'Backend Heavy', 'Cloud Architecting'], 
      resumeLink: '#', 
      githubUsername: 'jesron',
      heroImage: '/profile.jpg' // Local fallback
    },
    about: { 
      bio: "I'm a self-taught backend developer—starting with Python scripts at 15. I thrive on dissecting HTTP internals, reading codebases, creating CLI utilities with Bash, and configuring environments.", 
      bio2: "Currently studying AWS Solutions Architect principles and actively participating in Open-Source infrastructure configurations. A proud Linux terminal dweller (Vim, tmux).", 
      tags: ['System Design', 'MVC Architecture', 'Async Programming', 'JWT Auth'], 
      location: 'Madurai, India', 
      email: 'Jesronstark@gmail.com', 
      available: true 
    },
    skills: { 
      frontend: [
        {name: 'JavaScript (ES6+)', level: 95}, {name: 'React.js', level: 90}
      ], 
      backend: [
        {name: 'Node.js', level: 95}, {name: 'Express.js', level: 94}, {name: 'MongoDB', level: 90}, {name: 'Python', level: 85}, {name: 'C', level: 75}
      ], 
      devops: [
        {name: 'AWS (EC2, S3)', level: 85}, {name: 'Docker', level: 80}, {name: 'Linux (Ubuntu/Debian)', level: 90}, {name: 'Nginx', level: 75}, {name: 'Git & GitHub', level: 95}, {name: 'SPL (Splunk)', level: 70}
      ] 
    },
    projects: [
      {
        id: 1, name: 'Backend REST API Service', description: 'Production-ready REST API with JWT access control. Containerised via Docker, Nginx reverse proxy, deployed onto AWS EC2. Automated data ingestion pipeline with Python scripts.',
        stack: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS EC2'], github: '', live: '', color: '#0ea5e9',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop'
      },
      {
        id: 2, name: 'Real-time E-Commerce Chat App', description: 'Full-stack Socket.IO bi-directional chat system with persistent history, online presence tracking, and managed custom room sessions completely written from scratch over a raw Linux environment.',
        stack: ['MERN Stack', 'Socket.IO', 'Linux SSL'], github: '', live: '', color: '#10b981',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop'
      },
      {
        id: 3, name: 'Log Monitoring Dashboard', description: 'Splunk-based anomaly detection using SPL queries. Python powered back-end logging with a React frontend to filter operational severity markers accurately.',
        stack: ['SPL', 'Python', 'React', 'Splunk'], github: '', live: '', color: '#f43f5e',
        coverImage: 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2000&auto=format&fit=crop'
      }
    ],
    experience: [
      { id: 101, role: 'B.E. Electronics & Communication', company: 'SACS MAVMM Engineering College', period: 'Expected May 2027', description: 'Studying core computer network capabilities, operating systems concepts, and fundamental Digital Systems.' }
    ],
    social: { github: 'https://github.com/jesron', linkedin: 'https://linkedin.com/in/jesron', email: 'Jesronstark@gmail.com', whatsapp: '+919629199741' },
    contact: { heading: "Command Your Backend", subheading: "I'm always open to discussing system architectures, cloud infrastructure, and backend optimization routines. Have a complex scalability problem? Let's connect." },
    stats: { repos: 0, commits: 0, prs: 0, stars: 0 },
    emailConfig: { host: 'smtp.gmail.com', port: 587, user: '', pass: '', to: '' }
  };
}

async function readData() {
  try {
    let doc = await Portfolio.findOne();
    if (!doc || !doc.data || Object.keys(doc.data).length === 0) {
      doc = await Portfolio.create({ data: getDefaultData() });
    }
    // Deep clone the object so Mongoose schema array watchers don't crash when filtering array nodes
    return JSON.parse(JSON.stringify(doc.data));
  } catch (err) {
    return getDefaultData();
  }
}

async function writeData(newData) {
  let doc = await Portfolio.findOne();
  if (doc) { doc.data = newData; doc.markModified('data'); await doc.save(); } 
  else { await Portfolio.create({ data: newData }); }
}

app.get('/api/data', async (req, res) => {
  const data = await readData();
  const { emailConfig, ...publicData } = data;
  res.json(publicData);
});

app.get('/api/admin/data', async (req, res) => res.json(await readData()));

app.put('/api/admin/:section', async (req, res) => {
  try {
    const data = await readData();
    const { section } = req.params;
    if (data[section] !== undefined) {
      data[section] = req.body;
      await writeData(data);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Profile Pic Upload (Local Storage Node.js)
app.post('/api/admin/hero/avatar', upload.single('profileImage'), async (req, res) => {
  try {
    if(!req.file) throw new Error("No payload detected.");
    const data = await readData();
    data.hero.heroImage = `/uploads/${req.file.filename}`;
    await writeData(data);
    res.json({ success: true, heroImage: data.hero.heroImage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create Project (Upload to Cloudinary via base64)
app.post('/api/admin/projects', async (req, res) => {
  try {
    let coverUrl = null;
    if (req.body.imageBase64) {
      const uploadRes = await cloudinary.uploader.upload(req.body.imageBase64, { folder: 'portfolio_projects' });
      coverUrl = uploadRes.secure_url;
    }
    const data = await readData();
    const newProject = { 
      id: Date.now(), 
      name: req.body.name, 
      description: req.body.description,
      stack: req.body.stack,
      github: req.body.github,
      live: req.body.live,
      color: req.body.color || '#3b82f6',
      coverImage: coverUrl
    };
    if(!data.projects) data.projects = [];
    data.projects.push(newProject);
    await writeData(data);
    res.json({ success: true, project: newProject });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/projects/:id', async (req, res) => {
  try {
    const data = await readData();
    if(data.projects) {
      data.projects = data.projects.filter(p => p.id !== parseInt(req.params.id));
      await writeData(data);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/experience', async (req, res) => {
  try {
    const data = await readData();
    data.experience.push({ ...req.body, id: Date.now() });
    await writeData(data);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/experience/:id', async (req, res) => {
  try {
    const data = await readData();
    data.experience = data.experience.filter(e => e.id !== parseInt(req.params.id));
    await writeData(data);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/admin/skills/:category', async (req, res) => {
  try {
    const data = await readData();
    data.skills[req.params.category].push(req.body);
    await writeData(data);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/skills/:category/:index', async (req, res) => {
  try {
    const data = await readData();
    data.skills[req.params.category].splice(parseInt(req.params.index), 1);
    await writeData(data);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Github syncing
app.get('/api/github/:username', async (req, res) => {
  try { const response = await fetch(`https://api.github.com/users/${req.params.username}`); res.json(await response.json()); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('/api/github/:username/repos', async (req, res) => {
  try { const response = await fetch(`https://api.github.com/users/${req.params.username}/repos?per_page=100&sort=stars`); res.json(await response.json()); } catch (err) { res.status(500).json({ error: err.message }); }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), err => {
    if (err) res.status(500).json({ message: 'API running. Serve frontend.' });
  });
});

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
