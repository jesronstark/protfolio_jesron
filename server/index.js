const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static React build in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// ─── DATA PERSISTENCE ────────────────────────────────────
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return getDefaultData();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return getDefaultData();
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
      githubUsername: 'jesron'
    },
    about: {
      bio: 'I\'m Jesron — a full-stack MERN developer from India with a deep passion for building things from scratch. My work sits at the intersection of scalable backend architecture, ethical security research, and thoughtful UI/UX design.',
      bio2: 'When I\'m not building RESTful APIs or designing component systems, I\'m poking holes in web apps as an ethical hacker — because knowing how systems break makes me much better at building them to last.',
      tags: ['Open Source', 'API Design', 'Penetration Testing', 'System Design', 'Figma', 'DevOps', 'MongoDB', 'PostgreSQL'],
      location: 'India (IST, UTC+5:30)',
      email: 'jesron@example.com',
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
        { name: 'PostgreSQL', level: 82 },
        { name: 'REST APIs', level: 96 }
      ],
      devops: [
        { name: 'AWS', level: 78 },
        { name: 'Docker', level: 80 },
        { name: 'GitHub Actions', level: 85 },
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
      },
      {
        id: 2,
        name: 'SecureVault',
        description: 'Encrypted secret manager with AES-256 encryption, CLI and web dashboard.',
        stack: ['Node.js', 'PostgreSQL', 'Docker'],
        github: '#',
        live: '#',
        color: '#7c3aed'
      },
      {
        id: 3,
        name: 'ReactDash',
        description: 'Modular analytics dashboard with real-time charts and dark/light themes.',
        stack: ['React', 'Next.js', 'Chart.js'],
        github: '#',
        live: '#',
        color: '#0ea5e9'
      }
    ],
    experience: [
      {
        id: 1,
        role: 'Full-Stack Developer',
        company: 'Freelance / Contract',
        period: '2022 — Present',
        description: 'Building end-to-end web applications for clients across India and globally. Specializing in MERN stack, REST APIs, and cloud deployments on AWS.'
      },
      {
        id: 2,
        role: 'Ethical Hacker / Security Analyst',
        company: 'Bug Bounty & Consulting',
        period: '2021 — Present',
        description: 'Conducting penetration tests, vulnerability assessments, and security audits. Reported critical CVEs to major platforms. Expert in OWASP Top 10.'
      },
      {
        id: 3,
        role: 'UI/UX Designer',
        company: 'Self-Directed & Client Work',
        period: '2020 — Present',
        description: 'Designing intuitive, accessible interfaces using Figma. Created design systems and component libraries for SaaS products and dashboards.'
      }
    ],
    social: {
      github: 'https://github.com/jesron',
      linkedin: 'https://linkedin.com/in/jesron',
      twitter: 'https://twitter.com/jesron',
      instagram: 'https://instagram.com/jesron',
      email: 'jesron@example.com',
      whatsapp: '+919999999999',
      buymeacoffee: 'https://buymeacoffee.com/jesron'
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
      to: 'jesron@example.com'
    }
  };
}

// ─── API ROUTES ───────────────────────────────────────────

// GET all portfolio data
app.get('/api/data', (req, res) => {
  const data = readData();
  // Don't expose email config to public
  const { emailConfig, ...publicData } = data;
  res.json(publicData);
});

// Admin: GET all data including config
app.get('/api/admin/data', (req, res) => {
  res.json(readData());
});

// Admin: UPDATE any section
app.put('/api/admin/:section', (req, res) => {
  try {
    const data = readData();
    const { section } = req.params;
    if (data[section] !== undefined) {
      data[section] = req.body;
      writeData(data);
      res.json({ success: true, message: `${section} updated successfully` });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ADD project
app.post('/api/admin/projects', (req, res) => {
  try {
    const data = readData();
    const newProject = { ...req.body, id: Date.now() };
    data.projects.push(newProject);
    writeData(data);
    res.json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE project
app.delete('/api/admin/projects/:id', (req, res) => {
  try {
    const data = readData();
    data.projects = data.projects.filter(p => p.id !== parseInt(req.params.id));
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ADD experience
app.post('/api/admin/experience', (req, res) => {
  try {
    const data = readData();
    const newExp = { ...req.body, id: Date.now() };
    data.experience.push(newExp);
    writeData(data);
    res.json({ success: true, experience: newExp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE experience
app.delete('/api/admin/experience/:id', (req, res) => {
  try {
    const data = readData();
    data.experience = data.experience.filter(e => e.id !== parseInt(req.params.id));
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: ADD skill
app.post('/api/admin/skills/:category', (req, res) => {
  try {
    const data = readData();
    const { category } = req.params;
    if (data.skills[category]) {
      data.skills[category].push(req.body);
      writeData(data);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: DELETE skill
app.delete('/api/admin/skills/:category/:index', (req, res) => {
  try {
    const data = readData();
    const { category, index } = req.params;
    if (data.skills[category]) {
      data.skills[category].splice(parseInt(index), 1);
      writeData(data);
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

    const data = readData();
    const cfg = data.emailConfig;

    if (!cfg.user || !cfg.pass) {
      // If no email configured, just log it
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

// GitHub stats proxy
app.get('/api/github/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('GitHub API error');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/github/:username/repos', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`);
    if (!response.ok) throw new Error('GitHub API error');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all for React Router
app.get('*', (req, res) => {
  const buildPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(buildPath)) {
    res.sendFile(buildPath);
  } else {
    res.json({ message: 'Portfolio API running. Build React app for frontend.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
