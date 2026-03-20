import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import './Admin.css';

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // State for new items
  const [newProject, setNewProject] = useState({ name: '', description: '', stack: '', github: '', live: '', color: '#6366f1' });
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });
  const [newSkill, setNewSkill] = useState({ category: 'frontend', name: '', level: 90 });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setStatus('Failed to load admin data.');
      setLoading(false);
    }
  };

  const showStatus = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(''), 3000);
  };

  const handleUpdateSection = async (section, updatedData) => {
    try {
      const res = await fetch(`/api/admin/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const result = await res.json();
      if (result.success) {
        showStatus(`Successfully updated ${section}!`);
        fetchAdminData();
      } else {
        showStatus(`Failed to update ${section}.`);
      }
    } catch (err) {
      showStatus('Error updating data.');
    }
  };

  // --- Projects CRUD ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    const projectData = {
      ...newProject,
      stack: newProject.stack.split(',').map(s => s.trim())
    };
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if ((await res.json()).success) {
        showStatus('Project added!');
        setNewProject({ name: '', description: '', stack: '', github: '', live: '', color: '#6366f1' });
        fetchAdminData();
      }
    } catch(err) { showStatus('Error adding project'); }
  };

  const handleDeleteProject = async (id) => {
    if(!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        showStatus('Project deleted!');
        fetchAdminData();
      }
    } catch(err) { showStatus('Error deleting project'); }
  };

  // --- Experience CRUD ---
  const handleAddExp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
      if ((await res.json()).success) {
        showStatus('Experience added!');
        setNewExp({ role: '', company: '', period: '', description: '' });
        fetchAdminData();
      }
    } catch(err) { showStatus('Error adding experience'); }
  };

  const handleDeleteExp = async (id) => {
    if(!window.confirm('Delete this experience?')) return;
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        showStatus('Experience deleted!');
        fetchAdminData();
      }
    } catch(err) { showStatus('Error deleting experience'); }
  };

  // --- Skills CRUD ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/skills/${newSkill.category}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSkill.name, level: parseInt(newSkill.level) })
      });
      if ((await res.json()).success) {
        showStatus('Skill added!');
        setNewSkill({ ...newSkill, name: '', level: 90 });
        fetchAdminData();
      }
    } catch(err) { showStatus('Error adding skill'); }
  };

  const handleDeleteSkill = async (category, index) => {
    if(!window.confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${category}/${index}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        showStatus('Skill deleted!');
        fetchAdminData();
      }
    } catch(err) { showStatus('Error deleting skill'); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      showStatus('Incorrect password!');
    }
  };

  if (!isAuthenticated) return (
    <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="bg-mesh"></div>
      <form onSubmit={handleLogin} className="glass-panel" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 1 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }} className="text-gradient">Admin Login</h2>
        {status && <div className="admin-status" style={{ borderColor: '#ef4444', color: '#ef4444' }}>{status}</div>}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <a href="/" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }} className="text-muted">Return to Portfolio</a>
      </form>
    </div>
  );

  if (loading) return (
    <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div className="admin-container">
       <div className="bg-mesh"></div>
       <header className="admin-header glass-panel">
         <h2>JESRON - Admin Panel</h2>
         <a href="/" className="btn btn-outline">Back to Site</a>
       </header>

       {status && <div className="admin-status glass-panel">{status}</div>}

       <main className="admin-content">
          
          {/* SEC 1: HERO & ABOUT */}
          <div className="admin-grid-2">
            <section className="admin-section glass-panel">
              <h3>Hero Settings</h3>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={data.hero?.title || ''} 
                        onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input type="text" className="form-input" value={data.hero?.subtitle || ''} 
                        onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} />
              </div>
              <button className="btn btn-primary" onClick={() => handleUpdateSection('hero', data.hero)}>Save Hero</button>
            </section>

            <section className="admin-section glass-panel">
              <h3>About Settings</h3>
              <div className="form-group">
                <label className="form-label">Bio (Paragraph 1)</label>
                <textarea className="form-input" rows="3" value={data.about?.bio || ''} 
                        onChange={e => setData({...data, about: {...data.about, bio: e.target.value}})} />
              </div>
              <button className="btn btn-primary" onClick={() => handleUpdateSection('about', data.about)}>Save About</button>
            </section>
          </div>

          {/* SEC 2: PROJECTS */}
          <section className="admin-section glass-panel">
            <h3>Manage Projects</h3>
            <div className="admin-list">
              {data.projects?.map(p => (
                <div key={p.id} className="admin-list-item">
                  <div>
                    <strong>{p.name}</strong> <span style={{color:'var(--text-muted)'}}>- {p.stack.join(', ')}</span>
                  </div>
                  <button className="btn-icon" onClick={() => handleDeleteProject(p.id)}><FiTrash2 /></button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddProject} className="admin-add-form border-top mt-4">
              <h4>Add New Project</h4>
              <div className="admin-grid-2 mt-2">
                <input type="text" className="form-input" placeholder="Project Name" value={newProject.name} onChange={e=>setNewProject({...newProject, name: e.target.value})} required/>
                <input type="text" className="form-input" placeholder="Stack (comma separated)" value={newProject.stack} onChange={e=>setNewProject({...newProject, stack: e.target.value})} required/>
                <input type="url" className="form-input" placeholder="GitHub URL" value={newProject.github} onChange={e=>setNewProject({...newProject, github: e.target.value})} />
                <input type="url" className="form-input" placeholder="Live Demo URL" value={newProject.live} onChange={e=>setNewProject({...newProject, live: e.target.value})} />
              </div>
              <div className="admin-grid-2 mt-2">
                <textarea className="form-input" placeholder="Description" rows="2" value={newProject.description} onChange={e=>setNewProject({...newProject, description: e.target.value})} required></textarea>
                <div className="flex-col gap-2">
                  <label className="form-label">Theme Color</label>
                  <input type="color" value={newProject.color} onChange={e=>setNewProject({...newProject, color: e.target.value})} />
                  <button type="submit" className="btn btn-primary mt-2"><FiPlus/> Add Project</button>
                </div>
              </div>
            </form>
          </section>

          {/* SEC 3: EXPERIENCE */}
          <section className="admin-section glass-panel">
            <h3>Manage Experience</h3>
            <div className="admin-list">
              {data.experience?.map(e => (
                <div key={e.id} className="admin-list-item">
                  <div>
                    <strong>{e.role}</strong> at <span>{e.company}</span> ({e.period})
                  </div>
                  <button className="btn-icon" onClick={() => handleDeleteExp(e.id)}><FiTrash2 /></button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddExp} className="admin-add-form border-top mt-4">
              <h4>Add New Experience</h4>
              <div className="admin-grid-2 mt-2">
                <input type="text" className="form-input" placeholder="Role (e.g. Developer)" value={newExp.role} onChange={e=>setNewExp({...newExp, role: e.target.value})} required/>
                <input type="text" className="form-input" placeholder="Company" value={newExp.company} onChange={e=>setNewExp({...newExp, company: e.target.value})} required/>
                <input type="text" className="form-input" placeholder="Period (e.g. 2022 - Present)" value={newExp.period} onChange={e=>setNewExp({...newExp, period: e.target.value})} required/>
                <button type="submit" className="btn btn-primary h-full"><FiPlus/> Add Experience</button>
              </div>
              <textarea className="form-input mt-2" placeholder="Description" rows="2" value={newExp.description} onChange={e=>setNewExp({...newExp, description: e.target.value})} required></textarea>
            </form>
          </section>

          {/* SEC 4: SKILLS */}
          <section className="admin-section glass-panel">
            <h3>Manage Skills</h3>
            <div className="admin-grid-3">
              {['frontend', 'backend', 'devops'].map(cat => (
                <div key={cat} className="skill-cat-col">
                  <h4>{cat.toUpperCase()}</h4>
                  <div className="admin-list mini">
                    {data.skills?.[cat]?.map((skill, idx) => (
                      <div key={idx} className="admin-list-item mini-item">
                        <span>{skill.name} ({skill.level}%)</span>
                        <button className="btn-icon small" onClick={() => handleDeleteSkill(cat, idx)}><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddSkill} className="admin-add-form border-top mt-4">
              <h4>Add New Skill</h4>
              <div className="admin-grid-3 mt-2">
                <select className="form-input" value={newSkill.category} onChange={e=>setNewSkill({...newSkill, category: e.target.value})}>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                </select>
                <input type="text" className="form-input" placeholder="Skill Name (e.g. React)" value={newSkill.name} onChange={e=>setNewSkill({...newSkill, name: e.target.value})} required/>
                <div className="flex gap-2">
                  <input type="number" className="form-input" placeholder="%" min="1" max="100" style={{width:'80px'}} value={newSkill.level} onChange={e=>setNewSkill({...newSkill, level: e.target.value})} required/>
                  <button type="submit" className="btn btn-primary"><FiPlus/></button>
                </div>
              </div>
            </form>
          </section>

       </main>
    </div>
  );
}
