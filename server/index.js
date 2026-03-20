require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const portfolioSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

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

// Emptied all sample data to ensure complete customization from Admin
function getDefaultData() {
  return {
    hero: { name: '', title: '', subtitle: '', description: '', roles: [], resumeLink: '', githubUsername: '' },
    about: { bio: '', bio2: '', tags: [], location: '', email: '', available: true },
    skills: { frontend: [], backend: [], devops: [] },
    projects: [],
    experience: [],
    social: { github: '', linkedin: '', twitter: '', instagram: '', email: '', whatsapp: '', buymeacoffee: '' },
    contact: { heading: "", subheading: '' },
    stats: { repos: 0, commits: 0, prs: 0, stars: 0 },
    emailConfig: { host: 'smtp.gmail.com', port: 587, user: '', pass: '', to: '' }
  };
}

app.get('/api/data', async (req, res) => {
  const data = await readData();
  const { emailConfig, ...publicData } = data;
  res.json(publicData);
});

app.get('/api/admin/data', async (req, res) => {
  res.json(await readData());
});

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
      html: `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
    });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), err => {
    if (err) res.status(500).json({ message: 'API running. Serve frontend.' });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
