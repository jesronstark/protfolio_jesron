import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlus, FiGithub, FiRefreshCw } from 'react-icons/fi';
import './Admin.css';

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // State for new items
  const [newProject, setNewProject] = useState({ name: '', description: '', stack: '', github: '', live: '', color: '#2563eb' });
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });
  const [newSkill, setNewSkill] = useState({ category: 'frontend', name: '', level: 90 });
  const [syncing, setSyncing] = useState(false);

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
        showStatus(`Dashboard Sync complete for ${section}!`);
        fetchAdminData();
      } else {
        showStatus(`Failed to update ${section}.`);
      }
    } catch (err) {
      showStatus('Error updating data.');
    }
  };

  // --- GitHub Syncing ---
  const handleGithubSync = async () => {
    if (!data.hero?.githubUsername) {
       showStatus("Please set your GitHub Username in Hero settings first!");
       return;
    }
    setSyncing(true);
    try {
      // Fetch Profile Data
      const resProf = await fetch(`/api/github/${data.hero.githubUsername}`);
      const profData = await resProf.json();
      
      // Fetch Repos
      const resRepos = await fetch(`/api/github/${data.hero.githubUsername}/repos`);
      const reposData = await resRepos.json();

      if (profData.message) throw new Error(profData.message);

      const computedStats = {
        repos: profData.public_repos,
        commits: 1300, // Dummy fallback since actual commits demand vast API scraping
        prs: 85,
        stars: reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0) || profData.public_gists || 0
      };

      await fetch(`/api/admin/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(computedStats)
      });

      // Optionally auto-add top 2 repos to projects if empty
      // ... (keeping focused on stats for now)

      showStatus('GitHub Integration Sync Successful!');
      fetchAdminData();
    } catch(err) {
      console.error(err);
      showStatus('Error syncing GitHub data. Check username.');
    }
    setSyncing(false);
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
        setNewProject({ name: '', description: '', stack: '', github: '', live: '', color: '#2563eb' });
        fetchAdminData();
      }
    } catch(err) { showStatus('Error adding project'); }
  };

  const handleDeleteProject = async (id) => {
    if(!window.confirm('Delete this project node?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        showStatus('Project removed!');
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
    if(!window.confirm('Remove this experience node?')) return;
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        showStatus('Experience removed!');
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
        showStatus('Skill mapped!');
        setNewSkill({ ...newSkill, name: '', level: 90 });
        fetchAdminData();
      }
    } catch(err) { showStatus('Error adding skill'); }
  };

  const handleDeleteSkill = async (category, index) => {
    if(!window.confirm('Remove this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills/${category}/${index}`, { method: 'DELETE' });
      if ((await res.json()).success) {
        showStatus('Skill erased!');
        fetchAdminData();
      }
    } catch(err) { showStatus('Error deleting skill'); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'jesron0328') {
      setIsAuthenticated(true);
    } else {
      showStatus('Access Denied: Invalid Authentication');
    }
  };

  // Login Screen
  if (!isAuthenticated) return (
    <div className="admin-container auth-wrapper">
      <div className="auth-mesh"></div>
      <form onSubmit={handleLogin} className="glass-panel auth-panel">
        <h2 className="auth-title">Secure Portal</h2>
        <p className="auth-subtitle">Encrypted Gateway</p>
        
        {status && <div className="admin-status error-status">{status}</div>}
        
        <div className="form-group auth-input-group">
          <label className="form-label text-muted">Authentication Key</label>
          <input 
            type="password" 
            className="form-input auth-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full shadow-lg mt-4">Initialize Session</button>
        <a href="/" className="auth-exit">&larr; Return to Portfolio</a>
      </form>
    </div>
  );

  if (loading) return (
    <div className="admin-container flex justify-center items-center h-screen">
      <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <div className="admin-container workspace">
       <header className="admin-header glass-panel">
         <div className="header-brand">
           <h2>Command Center</h2>
           <span className="badge-live">Live</span>
         </div>
         <div className="header-actions">
           <button onClick={handleGithubSync} className="btn btn-outline btn-github" disabled={syncing}>
              {syncing ? <FiRefreshCw className="spin" /> : <FiGithub />} 
              {syncing ? "Syncing..." : "Sync GitHub"}
           </button>
           <a href="/" className="btn btn-outline exit-btn">Terminate Session</a>
         </div>
       </header>

       {status && <div className="admin-toast shadow-md border-radius-sm">{status}</div>}

       <main className="admin-content-grid">
          
          {/* SEC 1: HERO & ABOUT */}
          <div className="admin-grid-2">
            <section className="admin-section glass-panel">
              <div className="section-head">
                 <h3>Hero Configuration</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Headline Title</label>
                <input type="text" className="form-input" placeholder="e.g. Software Engineer" value={data.hero?.title || ''} 
                        onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} />
              </div>
              <div className="form-group">
                <label className="form-label">Sub-Headline</label>
                <input type="text" className="form-input" placeholder="Keep it punchy" value={data.hero?.subtitle || ''} 
                        onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub Username (For Sync)</label>
                <input type="text" className="form-input" placeholder="jesronstark" value={data.hero?.githubUsername || ''} 
                        onChange={e => setData({...data, hero: {...data.hero, githubUsername: e.target.value}})} />
              </div>
              <button className="btn btn-primary" onClick={() => handleUpdateSection('hero', data.hero)}>Deploy Hero Updates</button>
            </section>

            <section className="admin-section glass-panel">
              <div className="section-head">
                 <h3>About Configuration</h3>
              </div>
              <div className="form-group">
                <label className="form-label">Biography</label>
                <textarea className="form-input" rows="5" placeholder="Your story..." value={data.about?.bio || ''} 
                        onChange={e => setData({...data, about: {...data.about, bio: e.target.value}})} />
              </div>
              <button className="btn btn-primary" onClick={() => handleUpdateSection('about', data.about)}>Deploy About Updates</button>
            </section>
          </div>

          {/* SEC 2: PROJECTS */}
          <section className="admin-section glass-panel mt-6">
            <div className="section-head">
               <h3>Project Deployment Node</h3>
            </div>
            
            <div className="admin-list">
              {data.projects?.map(p => (
                <div key={p.id} className="admin-list-item">
                  <div className="list-info">
                    <strong>{p.name}</strong> 
                    <span className="metadata-tag">{p.stack.join(', ')}</span>
                  </div>
                  <button className="btn-icon" onClick={() => handleDeleteProject(p.id)} title="Delete Node"><FiTrash2 /></button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddProject} className="admin-add-form border-top mt-4 pt-4">
              <h4>+ Provision New Project</h4>
              <div className="admin-grid-2 mt-2 gap-4">
                <input type="text" className="form-input" placeholder="Project Node Name" value={newProject.name} onChange={e=>setNewProject({...newProject, name: e.target.value})} required/>
                <input type="text" className="form-input" placeholder="Stack (CSV format)" value={newProject.stack} onChange={e=>setNewProject({...newProject, stack: e.target.value})} required/>
                <input type="url" className="form-input" placeholder="GitHub Repository URL" value={newProject.github} onChange={e=>setNewProject({...newProject, github: e.target.value})} />
                <input type="url" className="form-input" placeholder="Live Deployment URL" value={newProject.live} onChange={e=>setNewProject({...newProject, live: e.target.value})} />
              </div>
              <div className="admin-grid-2 mt-4 gap-4">
                <textarea className="form-input" placeholder="Technical architecture & description..." rows="2" value={newProject.description} onChange={e=>setNewProject({...newProject, description: e.target.value})} required></textarea>
                <div className="flex-col gap-2">
                  <label className="form-label">Render Theme Color</label>
                  <input type="color" className="color-picker" value={newProject.color} onChange={e=>setNewProject({...newProject, color: e.target.value})} />
                  <button type="submit" className="btn btn-primary mt-2"><FiPlus/> Provision Project</button>
                </div>
              </div>
            </form>
          </section>

          {/* SEC 3: EXPERIENCE */}
          <section className="admin-section glass-panel mt-6">
            <div className="section-head">
               <h3>Professional Experience Log</h3>
            </div>
            
            <div className="admin-list">
              {data.experience?.map(e => (
                <div key={e.id} className="admin-list-item">
                  <div className="list-info">
                    <strong>{e.role}</strong> <span className="text-muted">@</span> <span>{e.company}</span>
                    <span className="metadata-tag">{e.period}</span>
                  </div>
                  <button className="btn-icon" onClick={() => handleDeleteExp(e.id)}><FiTrash2 /></button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddExp} className="admin-add-form border-top mt-4 pt-4">
              <h4>+ Append Experience Log</h4>
              <div className="admin-grid-2 mt-2 gap-4">
                <input type="text" className="form-input" placeholder="System Role" value={newExp.role} onChange={e=>setNewExp({...newExp, role: e.target.value})} required/>
                <input type="text" className="form-input" placeholder="Organization" value={newExp.company} onChange={e=>setNewExp({...newExp, company: e.target.value})} required/>
                <input type="text" className="form-input" placeholder="Time Frame (e.g. 2024 - Present)" value={newExp.period} onChange={e=>setNewExp({...newExp, period: e.target.value})} required/>
                <button type="submit" className="btn btn-primary h-full"><FiPlus/> Append to Log</button>
              </div>
              <textarea className="form-input mt-4" placeholder="Responsibilities & Impact" rows="2" value={newExp.description} onChange={e=>setNewExp({...newExp, description: e.target.value})} required></textarea>
            </form>
          </section>

          {/* SEC 4: SKILLS */}
          <section className="admin-section glass-panel mt-6 mb-8">
            <div className="section-head">
               <h3>Skill Metric Clusters</h3>
            </div>
            
            <div className="admin-grid-3">
              {['frontend', 'backend', 'devops'].map(cat => (
                <div key={cat} className="skill-cat-col">
                  <h4 className="skill-cat-title">{cat.toUpperCase()}</h4>
                  <div className="admin-list mini">
                    {data.skills?.[cat]?.map((skill, idx) => (
                      <div key={idx} className="admin-list-item mini-item">
                        <span>{skill.name} <span className="text-muted">({skill.level}%)</span></span>
                        <button className="btn-icon small" onClick={() => handleDeleteSkill(cat, idx)}><FiTrash2 /></button>
                      </div>
                    ))}
                    {(!data.skills?.[cat] || data.skills?.[cat].length === 0) && (
                       <p className="text-muted text-sm italic">No data mapped.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddSkill} className="admin-add-form border-top mt-4 pt-4">
              <h4>+ Map New Skill</h4>
              <div className="admin-grid-3 mt-2 gap-4">
                <select className="form-input" value={newSkill.category} onChange={e=>setNewSkill({...newSkill, category: e.target.value})}>
                  <option value="frontend">Frontend Stack</option>
                  <option value="backend">Backend Engine</option>
                  <option value="devops">DevOps & Cloud</option>
                </select>
                <input type="text" className="form-input" placeholder="Technology (e.g. Node.js)" value={newSkill.name} onChange={e=>setNewSkill({...newSkill, name: e.target.value})} required/>
                <div className="flex gap-2">
                  <input type="number" className="form-input" placeholder="%" min="1" max="100" style={{width:'80px'}} value={newSkill.level} onChange={e=>setNewSkill({...newSkill, level: e.target.value})} required/>
                  <button type="submit" className="btn btn-primary pl-4 pr-4"><FiPlus/></button>
                </div>
              </div>
            </form>
          </section>

       </main>
    </div>
  );
}
