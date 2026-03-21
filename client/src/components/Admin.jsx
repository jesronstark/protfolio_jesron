import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlus, FiGithub, FiUploadCloud, FiImage, FiRefreshCw } from 'react-icons/fi';

import './Admin.css';

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [newProject, setNewProject] = useState({ name: '', description: '', stack: '', github: '', live: '', color: '#0ea5e9' });
  const [newProjectFile, setNewProjectFile] = useState(null); // Local bas64 buffer state
  const [newHeroImg, setNewHeroImg] = useState(null); // File object
  
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });
  const [newSkill, setNewSkill] = useState({ category: 'frontend', name: '', level: 90 });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchAdminData();
  }, [isAuthenticated]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      setData(await res.json());
      setLoading(false);
    } catch { showStatus('Failed to load admin data.'); setLoading(false); }
  };

  const showStatus = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 4000); };

  const handleUpdateSection = async (section, updatedData) => {
    try {
      const res = await fetch(`/api/admin/${section}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) });
      if ((await res.json()).success) { showStatus(`Data stream updated for ${section}!`); fetchAdminData(); }
    } catch { showStatus('Error updating data.'); }
  };

  // Profile Local Upload
  const handleHeroImageUpload = async () => {
    if (!newHeroImg) return showStatus("Select an image first!");
    const formData = new FormData();
    formData.append('profileImage', newHeroImg);
    showStatus("Uploading asset to local filesystem...");
    try {
      const res = await fetch('/api/admin/hero/avatar', { method: 'POST', body: formData });
      const json = await res.json();
      if(json.success) { showStatus("Hero Asset Deployed Successfully!"); fetchAdminData(); setNewHeroImg(null); }
    } catch { showStatus("Upload failure."); }
  };

  const handleProjectImageConvert = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProjectFile(reader.result); // Base64
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectFile) return showStatus("Error: Cloudinary Projects require a Cover Image.");
    showStatus("Synchronising Asset to Cloudinary...");
    const projectData = { ...newProject, stack: newProject.stack.split(',').map(s => s.trim()), imageBase64: newProjectFile };
    try {
      const res = await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projectData) });
      if ((await res.json()).success) {
        showStatus('Cloud Project added!');
        setNewProject({ name: '', description: '', stack: '', github: '', live: '', color: '#0ea5e9' });
        setNewProjectFile(null);
        fetchAdminData();
      }
    } catch { showStatus('Error adding cloud project'); }
  };

  const handleDeleteProject = async (id) => {
    if(!window.confirm('Delete this project? If cloud synced, the reference will be wiped.')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { showStatus('Project wiped!'); fetchAdminData(); }
    } catch { showStatus('Error wiping project'); }
  };

  // ... (Experience, Skills, Github synced correctly as before) ...
  const handleGithubSync = async () => {
    if (!data.hero?.githubUsername) return showStatus("Please set your GitHub Username in Hero settings first!");
    setSyncing(true);
    try {
      const resProf = await fetch(`/api/github/${data.hero.githubUsername}`);
      const profData = await resProf.json();
      const resRepos = await fetch(`/api/github/${data.hero.githubUsername}/repos`);
      const reposData = await resRepos.json();

      const computedStats = {
        repos: profData.public_repos || 0,
        commits: 1320, prs: 85,
        stars: reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0) || 0
      };

      await fetch(`/api/admin/stats`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(computedStats) });
      showStatus('GitHub Integration Sync Successful!'); fetchAdminData();
    } catch { showStatus('Error syncing GitHub data. Check username.'); }
    setSyncing(false);
  };

  const handleAddExp = async (e) => { /*...*/ e.preventDefault(); await fetch('/api/admin/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newExp) }); showStatus('Exp Logged'); fetchAdminData(); }
  const handleDeleteExp = async (id) => { /*...*/ await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' }); fetchAdminData(); }
  const handleAddSkill = async (e) => { /*...*/ e.preventDefault(); await fetch(`/api/admin/skills/${newSkill.category}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newSkill.name, level: parseInt(newSkill.level) }) }); fetchAdminData(); }
  const handleDeleteSkill = async (cat, idx) => { /*...*/ await fetch(`/api/admin/skills/${cat}/${idx}`, { method: 'DELETE' }); fetchAdminData(); }

  const handleLogin = (e) => { e.preventDefault(); if (password === 'jesron0328') setIsAuthenticated(true); else showStatus('Invalid Access Node'); };

  if (!isAuthenticated) return (
    <div className="admin-container auth-wrapper">
      <div className="auth-mesh"></div>
      <form onSubmit={handleLogin} className="glass-panel auth-panel">
        <h2 className="auth-title text-gradient">COMMAND CENTER</h2>
        <p className="auth-subtitle">Restricted Security Portal</p>
        {status && <div className="admin-toast">{status}</div>}
        <div className="form-group">
          <input type="password" placeholder="ENTER CLEARANCE KEY" className="form-input auth-input" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="btn btn-primary w-full">ESTABLISH CONNECTION</button>
      </form>
    </div>
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loading-grid"></div></div>;

  return (
    <div className="admin-container workspace">
       <header className="admin-header glass-panel">
         <div className="header-brand"><h2>Root Dashboard</h2><span className="badge-live">Secured</span></div>
         <div className="header-actions">
           <button onClick={handleGithubSync} className="btn btn-outline" disabled={syncing}>
              {syncing ? <FiRefreshCw className="spin" /> : <FiGithub />} Sync GitHub
           </button>
           <a href="/" className="btn btn-outline exit-btn">Close Terminal</a>
         </div>
       </header>

       {status && <div className="admin-toast glass-panel">{status}</div>}

       <main className="admin-content-grid">
          <div className="admin-grid-2">
            
            <section className="admin-section glass-panel">
              <div className="section-head"><h3>Identity Node</h3></div>
              <div className="form-group"><input type="text" className="form-input" placeholder="Title" value={data.hero?.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} /></div>
              <div className="form-group"><input type="text" className="form-input" placeholder="Description" value={data.hero?.description} onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})} /></div>
              <div className="form-group"><input type="text" className="form-input" placeholder="GitHub User" value={data.hero?.githubUsername} onChange={e => setData({...data, hero: {...data.hero, githubUsername: e.target.value}})} /></div>
              
              <div className="file-upload-zone mt-4">
                <h4>Profile Avatar</h4>
                {data.hero?.heroImage && <img src={data.hero.heroImage} alt="Current" height="60" className="mt-2 mb-2" style={{borderRadius: '4px'}} />}
                <div className="flex gap-2">
                  <input type="file" className="form-input" accept="image/*" onChange={(e) => setNewHeroImg(e.target.files[0])} />
                  <button className="btn btn-outline" onClick={handleHeroImageUpload}><FiUploadCloud/></button>
                </div>
              </div>
              
              <button className="btn btn-primary mt-4" onClick={() => handleUpdateSection('hero', data.hero)}>Save Identity</button>
            </section>

            <section className="admin-section glass-panel">
               <div className="section-head"><h3>Narrative Config</h3></div>
               <textarea className="form-input" rows="8" value={data.about?.bio} onChange={e => setData({...data, about: {...data.about, bio: e.target.value}})} />
               <button className="btn btn-primary mt-4" onClick={() => handleUpdateSection('about', data.about)}>Save Narrative</button>
            </section>
          </div>

          <section className="admin-section glass-panel mt-6">
            <div className="section-head"><h3>Cloudinary Project Architect</h3></div>
            <div className="admin-list">
              {data.projects?.map(p => (
                <div key={p.id} className="admin-list-item">
                  <div className="list-info">
                    {p.coverImage && <img src={p.coverImage} width="40" height="30" style={{objectFit:'cover', borderRadius:'4px'}} alt=""/>}
                    <strong>{p.name}</strong> <span style={{color: p.color}}>•</span>
                  </div>
                  <button className="btn-icon" onClick={() => handleDeleteProject(p.id)}><FiTrash2 /></button>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddProject} className="admin-add-form border-top mt-4 pt-4">
              <div className="admin-grid-2">
                <div>
                  <input type="text" className="form-input mb-2" placeholder="Project Name" value={newProject.name} onChange={e=>setNewProject({...newProject, name: e.target.value})} required/>
                  <input type="text" className="form-input mb-2" placeholder="Tech Stack (CSV)" value={newProject.stack} onChange={e=>setNewProject({...newProject, stack: e.target.value})} required/>
                  <input type="url" className="form-input mb-2" placeholder="Github Live URL" value={newProject.live} onChange={e=>setNewProject({...newProject, live: e.target.value})} />
                  <textarea className="form-input" rows="3" placeholder="Full Description" value={newProject.description} onChange={e=>setNewProject({...newProject, description: e.target.value})} required></textarea>
                </div>
                <div>
                  <label className="form-label"><FiImage/> Cloudinary Cover Sync</label>
                  <input type="file" className="form-input mb-4" accept="image/*" onChange={handleProjectImageConvert} required />
                  {newProjectFile && <img src={newProjectFile} alt="Prev" width="100%" height="150" style={{objectFit:'cover', borderRadius:'8px', border:'1px solid var(--border-color)', marginBottom:'1rem'}} />}
                  <div className="flex gap-4">
                    <input type="color" className="color-picker" title="Neon Accent Color" value={newProject.color} onChange={e=>setNewProject({...newProject, color: e.target.value})} />
                    <button type="submit" className="btn btn-primary w-full"><FiUploadCloud/> Push Cloud Origin</button>
                  </div>
                </div>
              </div>
            </form>
          </section>

          <div className="admin-grid-2 mt-6">
            <section className="admin-section glass-panel">
              <div className="section-head"><h3>Experience Ledger</h3></div>
              <div className="admin-list">
                {data.experience?.map(e => (
                  <div key={e.id} className="admin-list-item">
                    <div className="list-info">
                      <div>
                        <strong>{e.role}</strong>
                        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{e.company} | {e.period}</div>
                      </div>
                    </div>
                    <button className="btn-icon" onClick={() => handleDeleteExp(e.id)}><FiTrash2 /></button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddExp} className="admin-add-form border-top mt-4 pt-4">
                <input type="text" className="form-input mb-2" placeholder="Digital Role" value={newExp.role} onChange={v => setNewExp({...newExp, role: v.target.value})} required/>
                <input type="text" className="form-input mb-2" placeholder="Organization" value={newExp.company} onChange={v => setNewExp({...newExp, company: v.target.value})} required/>
                <input type="text" className="form-input mb-2" placeholder="Timeline (e.g. 2023 - Present)" value={newExp.period} onChange={v => setNewExp({...newExp, period: v.target.value})} required/>
                <textarea className="form-input mb-2" rows="3" placeholder="Mission Description" value={newExp.description} onChange={v => setNewExp({...newExp, description: v.target.value})} required></textarea>
                <button type="submit" className="btn btn-primary w-full"><FiPlus/> Add Protocol</button>
              </form>
            </section>

            <section className="admin-section glass-panel">
              <div className="section-head"><h3>Skillset Array</h3></div>
              <div className="flex gap-2 mb-4">
                {['frontend', 'backend', 'devops'].map(cat => (
                  <button key={cat} onClick={() => setNewSkill({...newSkill, category: cat})} className={`btn btn-outline ${newSkill.category === cat ? 'active-cat' : ''}`} style={{padding: '5px 12px', fontSize: '0.8rem', borderColor: newSkill.category === cat ? 'var(--accent-primary)' : ''}}>
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="admin-list">
                {data.skills?.[newSkill.category]?.map((s, idx) => (
                  <div key={idx} className="admin-list-item">
                    <div className="list-info">
                      <strong>{s.name}</strong> <span style={{color: 'var(--accent-primary)', fontSize: '0.8rem'}}>{s.level}%</span>
                    </div>
                    <button className="btn-icon" onClick={() => handleDeleteSkill(newSkill.category, idx)}><FiTrash2 /></button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddSkill} className="admin-add-form border-top mt-4 pt-4">
                <input type="text" className="form-input mb-2" placeholder="Tech / Stack" value={newSkill.name} onChange={v => setNewSkill({...newSkill, name: v.target.value})} required/>
                <div className="flex gap-4 items-center mb-2">
                   <label className="form-label mb-0">Level %</label>
                   <input type="range" className="w-full" min="0" max="100" value={newSkill.level} onChange={v => setNewSkill({...newSkill, level: v.target.value})} />
                   <span style={{minWidth: '35px'}}>{newSkill.level}</span>
                </div>
                <button type="submit" className="btn btn-primary w-full"><FiPlus/> Inject Skill</button>
              </form>
            </section>
          </div>
       </main>
    </div>
  );
}

