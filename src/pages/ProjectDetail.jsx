import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const [newMember, setNewMember] = useState({ email: '', role: 'member' });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/project/${id}`, newTask);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
      setShowTaskForm(false);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, newMember);
      setNewMember({ email: '', role: 'member' });
      setShowMemberForm(false);
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchProject();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!project) return <div style={styles.loading}>Project not found</div>;

  const todoTasks = project.Tasks?.filter(t => t.status === 'todo') || [];
  const inProgressTasks = project.Tasks?.filter(t => t.status === 'in_progress') || [];
  const doneTasks = project.Tasks?.filter(t => t.status === 'done') || [];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
          <h1 style={styles.title}>{project.name}</h1>
          <p style={styles.desc}>{project.description || 'No description'}</p>
        </div>
        <div style={styles.headerActions}>
          {user.role === 'admin' && (
            <>
              <button style={styles.btn} onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? 'Cancel' : '+ Add Task'}
              </button>
              <button style={{...styles.btn, background: '#4a5568'}} onClick={() => setShowMemberForm(!showMemberForm)}>
                {showMemberForm ? 'Cancel' : '+ Add Member'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Task Form */}
      {showTaskForm && (
        <div style={styles.formCard}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <input
              style={styles.input}
              placeholder="Task Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              style={styles.input}
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <select
              style={styles.input}
              value={newTask.assignedTo}
              onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
            >
              <option value="">Assign to...</option>
              {project.members?.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <button style={styles.btn} type="submit">Create Task</button>
          </form>
        </div>
      )}

      {showMemberForm && (
        <div style={styles.formCard}>
          <h3>Add Member</h3>
          <form onSubmit={handleAddMember} style={styles.inlineForm}>
            <input
              style={styles.input}
              placeholder="Member Email"
              type="email"
              value={newMember.email}
              onChange={e => setNewMember({ ...newMember, email: e.target.value })}
              required
            />
            <select
              style={styles.input}
              value={newMember.role}
              onChange={e => setNewMember({ ...newMember, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button style={styles.btn} type="submit">Add Member</button>
          </form>
        </div>
      )}

      <div style={styles.membersSection}>
        <h3>👥 Team Members</h3>
        <div style={styles.membersList}>
          {project.members?.map(member => (
            <div key={member.id} style={styles.memberChip}>
              <span>👤 {member.name}</span>
              <span style={styles.memberRole}>{member.ProjectMember?.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.board}>
        {/* Todo Column */}
        <div style={styles.column}>
          <div style={{...styles.columnHeader, borderTop: '4px solid #7c6af7'}}>
            <h3>📋 Todo</h3>
            <span style={styles.count}>{todoTasks.length}</span>
          </div>
          {todoTasks.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>

        <div style={styles.column}>
          <div style={{...styles.columnHeader, borderTop: '4px solid #f6ad55'}}>
            <h3>⚡ In Progress</h3>
            <span style={styles.count}>{inProgressTasks.length}</span>
          </div>
          {inProgressTasks.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>


        <div style={styles.column}>
          <div style={{...styles.columnHeader, borderTop: '4px solid #68d391'}}>
            <h3>✅ Done</h3>
            <span style={styles.count}>{doneTasks.length}</span>
          </div>
          {doneTasks.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onStatusChange }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div style={{...styles.taskCard, border: isOverdue ? '1px solid #fc8181' : '1px solid #eee'}}>
      <p style={styles.taskTitle}>{task.title}</p>
      {task.description && <p style={styles.taskDesc}>{task.description}</p>}
      {task.dueDate && (
        <p style={{...styles.taskDue, color: isOverdue ? '#e53e3e' : '#888'}}>
          📅 {task.dueDate} {isOverdue && '⚠️ Overdue'}
        </p>
      )}
      {task.assignee && <p style={styles.taskAssignee}>👤 {task.assignee.name}</p>}
      <select
        style={styles.statusSelect}
        value={task.status}
        onChange={e => onStatusChange(task.id, e.target.value)}
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  loading: { padding: '40px', textAlign: 'center', fontSize: '18px' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px',
  },
  headerActions: { display: 'flex', gap: '12px' },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#7c6af7', fontSize: '14px', marginBottom: '8px',
    display: 'block', padding: 0,
  },
  title: { margin: '0 0 4px', color: '#1e1e2e', fontSize: '28px' },
  desc: { margin: 0, color: '#666', fontSize: '14px' },
  btn: {
    padding: '8px 16px', background: '#7c6af7', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  formCard: {
    background: 'white', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  inlineForm: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  input: {
    width: '100%', padding: '10px 14px', marginBottom: '12px',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box',
  },
  membersSection: { marginBottom: '24px' },
  membersList: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' },
  memberChip: {
    background: 'white', padding: '6px 14px', borderRadius: '20px',
    fontSize: '13px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    display: 'flex', gap: '8px', alignItems: 'center',
  },
  memberRole: {
    background: '#e9d8fd', color: '#6b46c1',
    padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
  },
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  column: { background: '#f7f8fa', borderRadius: '12px', padding: '16px', minHeight: '400px' },
  columnHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #eee',
  },
  count: {
    background: '#e2e8f0', borderRadius: '12px',
    padding: '2px 10px', fontSize: '13px', fontWeight: 'bold',
  },
  taskCard: {
    background: 'white', padding: '14px', borderRadius: '8px',
    marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  taskTitle: { margin: '0 0 6px', fontWeight: '600', fontSize: '14px', color: '#1e1e2e' },
  taskDesc: { margin: '0 0 6px', fontSize: '12px', color: '#666' },
  taskDue: { margin: '0 0 4px', fontSize: '12px' },
  taskAssignee: { margin: '0 0 8px', fontSize: '12px', color: '#888' },
  statusSelect: {
    width: '100%', padding: '6px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
    background: '#f7f8fa',
  },
};

export default ProjectDetail;