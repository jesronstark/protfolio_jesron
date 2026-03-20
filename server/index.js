require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static React build in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// ─── MONGODB CONNECTION & SCHEMA ──────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const portfolioSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// ─── DATA PERSISTENCE ────────────────────────────────────
async function readData() {
  try {
    let doc = await Portfolio.findOne();
    if (!doc || !doc.data || Object.keys(doc.data).length === 0) {
      doc = await Portfolio.create({ data: getDefaultData() });
    }
    return doc.data;
  } catch (err) {
    console.error('Error reading data:', err);
    return getDefaultData();
  }
}

async function writeData(newData) {
  try {
    let doc = await Portfolio.findOne();
    if (doc) {
      doc.data = newData;
      doc.markModified('data');
      await doc.save();
    } else {
      await Portfolio.create({ data: newData });
    }
  } catch (err) {
    console.error('Error writing data:', err);
  }
}

function getDefaultData() {
  return {
    hero: {
      name: 'Jesron',
      title: 'Hi 👋 I\'m Jesron',
      subtitle: 'A passionate MERN Stack Developer from India',
      description: 'Full-Stack Developer building scalable web apps, secure APIs & beautiful interfaces.',
      roles: ['MERN Stack Developer', 'Backend Heavy', 'Ethical Hacker', 'UI/UX Designer'],
      resumeLink: '#',
      githubUsername: 'jesronstark'
    },
    about: {
      bio: 'I\'m Jesron — a full-stack MERN developer with a deep passion for building things from scratch. My work sits at the intersection of scalable backend architecture, ethical security research, and thoughtful UI/UX design.',
      bio2: 'When I\'m not building RESTful APIs or designing component systems, I\'m poking holes in web apps as an ethical hacker — because knowing how systems break makes me much better at building them to last.',
      tags: ['Open Source', 'API Design', 'Penetration Testing', 'System Design', 'DevOps', 'MongoDB', 'React'],
      location: 'India',
      email: 'Jesronstark@gmail.com',
      available: true
    },
    skills: {
      frontend: [
        { name: 'React.js', level: 92 },
        { name: 'Next.js', level: 88 },
        { name: 'JavaScript', level: 95 },
        { name: 'HTML5 / CSS3', level: 98 }
      ],
      backend: [
        { name: 'Node.js', level: 94 },
        { name: 'Express.js', level: 92 },
        { name: 'MongoDB', level: 88 },
        { name: 'REST APIs', level: 96 }
      ],
      devops: [
        { name: 'Git & GitHub', level: 85 },
        { name: 'Docker', level: 80 },
        { name: 'Pen Testing', level: 75 }
      ]
    },
    projects: [
      {
        id: 1,
        name: 'NodeForge API',
        description: 'Production-ready REST API boilerplate with JWT auth, rate limiting, and Docker support.',
        stack: ['Node.js', 'Express', 'MongoDB'],
        github: '#',
        live: '#',
        color: '#4f46e5'
      }
    ],
    experience: [
      {
        id: 1,
        role: 'Full-Stack Developer',
        company: 'Freelance',
        period: '2022 — Present',
        description: 'Building end-to-end web applications for clients. Specializing in MERN stack and REST APIs.'
      }
    ],
    social: {
      github: 'https://github.com/jesronstark',
      linkedin: 'https://linkedin.com/in/jesron',
      instagram: 'https://instagram.com/jesronnn',
      email: 'Jesronstark@gmail.com',
      whatsapp: '+919629199741'
    },
    contact: {
      heading: "Let's Build Together",
      subheading: 'Have a project in mind? I\'m available for freelance work and collaborations.'
    },
    stats: {
      repos: 24,
      commits: 430,
      prs: 85,
      stars: 162
    },
    emailConfig: {
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      pass: '',
      to: 'Jesronstark@gmail.com'
    }
  };
}

// ─── API ROUTES ───────────────────────────────────────────

// GET all portfolio data
app.get('/api/data', async (req, res) => {
  const data = await readData();
  // Don't expose email config to public
  const { emailConfig, ...publicData } = data;
  res.json(publicData);
});

// Admin: GET all data including config
app.get('/api/admin/data', async (req, res) => {
  res.json(await readData());
});

// Admin: UPDATE any section
app.put('/api/admin/:section', async (req, res) => {
  try {
    const data = await readData();
    const { section } = req.params;
    if (data[section] !== undefined) {
      data[section] = req.body;
      await writeData(data);
      res.json({ success: true, message: `${section} updated successfully` });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ADD project
app.post('/api/admin/projects', async (req, res) => {
  try {
    const data = await readData();
    const newProject = { ...req.body, id: Date.now() };
    if(!data.projects) data.projects = [];
    data.projects.push(newProject);
    await writeData(data);
    res.json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE project
app.delete('/api/admin/projects/:id', async (req, res) => {
  try {
    const data = await readData();
    if(data.projects) {
      data.projects = data.projects.filter(p => p.id !== parseInt(req.params.id));
      await writeData(data);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ADD experience
app.post('/api/admin/experience', async (req, res) => {
  try {
    const data = await readData();
    const newExp = { ...req.body, id: Date.now() };
    if(!data.experience) data.experience = [];
    data.experience.push(newExp);
    await writeData(data);
    res.json({ success: true, experience: newExp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE experience
app.delete('/api/admin/experience/:id', async (req, res) => {
  try {
    const data = await readData();
    if(data.experience) {
      data.experience = data.experience.filter(e => e.id !== parseInt(req.params.id));
      await writeData(data);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ADD skill
app.post('/api/admin/skills/:category', async (req, res) => {
  try {
    const data = await readData();
    const { category } = req.params;
    if (data.skills[category]) {
      data.skills[category].push(req.body);
      await writeData(data);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE skill
app.delete('/api/admin/skills/:category/:index', async (req, res) => {
  try {
    const data = await readData();
    const { category, index } = req.params;
    if (data.skills[category]) {
      data.skills[category].splice(parseInt(index), 1);
      await writeData(data);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact form - send email
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const data = await readData();
    const cfg = data.emailConfig;

    if (!cfg.user || !cfg.pass) {
      console.log('Contact form submission:', { name, email, message });
      return res.json({ success: true, message: 'Message received! (Email not configured)' });
    }

    const transporter = nodemailer.createTransporter({
      host: cfg.host,
      port: cfg.port,
      secure: false,
      auth: { user: cfg.user, pass: cfg.pass }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${cfg.user}>`,
      to: cfg.to || cfg.user,
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Catch-all for React Router
app.get('*', (req, res) => {
  const buildPath = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(buildPath, err => {
    if (err) res.status(500).json({ message: 'Portfolio API running. Build React app for frontend.' });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
