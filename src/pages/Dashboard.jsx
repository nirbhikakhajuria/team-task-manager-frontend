import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState({ all: [], overdue: [], inProgress: [], done: [], todo: [] });
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/my'),
      ]);
      setProjects(projectsRes.data);
      setMyTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', newProject);
      setProjects([...projects, res.data]);
      setNewProject({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.statsRow}>
        <div style={{...styles.statCard, borderTop: '4px solid #7c6af7'}}>
          <h3>{myTasks.all.length}</h3>
          <p>Total Tasks</p>
        </div>
        <div style={{...styles.statCard, borderTop: '4px solid #f6ad55'}}>
          <h3>{myTasks.inProgress.length}</h3>
          <p>In Progress</p>
        </div>
        <div style={{...styles.statCard, borderTop: '4px solid #68d391'}}>
          <h3>{myTasks.done.length}</h3>
          <p>Completed</p>
        </div>
        <div style={{...styles.statCard, borderTop: '4px solid #fc8181'}}>
          <h3>{myTasks.overdue.length}</h3>
          <p>Overdue</p>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2>Projects</h2>
          {user.role === 'admin' && (
            <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreateProject} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Project Name"
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Description (optional)"
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            />
            <button style={styles.btn} type="submit">Create Project</button>
          </form>
        )}

        {projects.length === 0 ? (
          <p style={styles.empty}>No projects yet. {user.role === 'admin' ? 'Create one!' : 'Ask an admin to add you.'}</p>
        ) : (
          <div style={styles.grid}>
            {projects.map(project => (
              <div
                key={project.id}
                style={styles.projectCard}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <h3 style={styles.projectName}>{project.name}</h3>
                <p style={styles.projectDesc}>{project.description || 'No description'}</p>
                <div style={styles.projectMeta}>
                  <span>👥 {project.members?.length || 0} members</span>
                  <span>📋 {project.Tasks?.length || 0} tasks</span>
                </div>
                <div style={styles.taskBar}>
                  <span style={{...styles.badge, background: '#e9d8fd', color: '#6b46c1'}}>
                    {project.Tasks?.filter(t => t.status === 'todo').length || 0} Todo
                  </span>
                  <span style={{...styles.badge, background: '#fefcbf', color: '#b7791f'}}>
                    {project.Tasks?.filter(t => t.status === 'in_progress').length || 0} In Progress
                  </span>
                  <span style={{...styles.badge, background: '#c6f6d5', color: '#276749'}}>
                    {project.Tasks?.filter(t => t.status === 'done').length || 0} Done
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {myTasks.overdue.length > 0 && (
        <div style={styles.section}>
          <h2 style={{color: '#e53e3e'}}>⚠️ Overdue Tasks</h2>
          {myTasks.overdue.map(task => (
            <div key={task.id} style={styles.overdueCard}>
              <strong>{task.title}</strong>
              <span style={styles.overdueDate}>Due: {task.dueDate}</span>
              <span style={{...styles.badge, background: '#fed7d7', color: '#c53030'}}>
                {task.Project?.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  loading: { padding: '40px', textAlign: 'center', fontSize: '18px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: {
    background: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center',
  },
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  btn: {
    padding: '8px 16px', background: '#7c6af7', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  form: {
    background: 'white', padding: '20px', borderRadius: '12px',
    marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex', gap: '12px', flexWrap: 'wrap',
  },
  input: {
    flex: 1, padding: '10px 14px', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '14px', minWidth: '200px',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  projectCard: {
    background: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer',
    transition: 'transform 0.2s', border: '1px solid #eee',
  },
  projectName: { margin: '0 0 8px', color: '#1e1e2e' },
  projectDesc: { color: '#666', fontSize: '14px', margin: '0 0 12px' },
  projectMeta: { display: 'flex', gap: '12px', fontSize: '13px', color: '#888', marginBottom: '12px' },
  taskBar: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  badge: { padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
  empty: { color: '#888', fontStyle: 'italic' },
  overdueCard: {
    background: '#fff5f5', padding: '14px 20px', borderRadius: '8px',
    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px',
    border: '1px solid #fed7d7',
  },
  overdueDate: { color: '#e53e3e', fontSize: '13px' },
};

export default Dashboard;