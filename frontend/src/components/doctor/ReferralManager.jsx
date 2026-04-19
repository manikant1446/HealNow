import { useState, useEffect } from 'react';
import { Share2, Check, X, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function ReferralManager() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    toDoctorEmail: '', patientEmail: '', reason: '', notes: '', priority: 'medium'
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReferrals(); }, []);

  const fetchReferrals = async () => {
    try {
      const [inc, out] = await Promise.all([
        axios.get(`${API_BASE_URL}/referrals/incoming`),
        axios.get(`${API_BASE_URL}/referrals/outgoing`)
      ]);
      setIncoming(inc.data);
      setOutgoing(out.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const createReferral = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axios.post(`${API_BASE_URL}/referrals`, form);
      setShowForm(false);
      setForm({ toDoctorEmail: '', patientEmail: '', reason: '', notes: '', priority: 'medium' });
      fetchReferrals();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create referral');
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(`${API_BASE_URL}/referrals/${id}/${action}`);
      fetchReferrals();
    } catch (err) { console.error(err); }
  };

  const statusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={16} color="var(--accent-warning)" />;
      case 'accepted': return <Check size={16} color="var(--accent-success)" />;
      case 'declined': return <X size={16} color="var(--accent-danger)" />;
      case 'completed': return <Check size={16} color="var(--accent-primary)" />;
      default: return null;
    }
  };

  const referrals = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <div className="page animate-in">
      <div className="page-header flex-between">
        <div>
          <h1>Referral Manager</h1>
          <p>Collaborate with other doctors for patient care</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Share2 size={16} /> New Referral
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create Referral</h3>
          {formError && <div className="error-message">{formError}</div>}
          <form onSubmit={createReferral}>
            <div className="grid grid-3">
              <div className="form-group">
                <label>Refer To (Doctor Email)</label>
                <input type="email" className="form-input" placeholder="doctor@email.com"
                  value={form.toDoctorEmail} onChange={e => setForm({ ...form, toDoctorEmail: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Patient Email</label>
                <input type="email" className="form-input" placeholder="patient@email.com"
                  value={form.patientEmail} onChange={e => setForm({ ...form, patientEmail: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-select" value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Referral</label>
              <input type="text" className="form-input" placeholder="Why are you referring this patient?"
                value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Clinical Notes</label>
              <textarea className="form-textarea" placeholder="Additional notes for the receiving doctor..."
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Send Referral</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming')}>
          Incoming ({incoming.length})
        </button>
        <button className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}>
          Outgoing ({outgoing.length})
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading...</p>
      ) : referrals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No {activeTab} referrals yet
        </div>
      ) : (
        referrals.map(ref => (
          <div key={ref._id} className={`referral-card priority-${ref.priority}`}>
            <div className={`referral-icon stat-icon ${
              ref.priority === 'critical' ? 'red' :
              ref.priority === 'high' ? 'amber' :
              ref.priority === 'medium' ? 'purple' : 'green'
            }`}>
              {ref.priority === 'critical' ? <AlertTriangle size={20} /> : <Share2 size={20} />}
            </div>
            <div className="referral-body">
              <h4>
                {activeTab === 'incoming'
                  ? `From Dr. ${ref.fromDoctorId?.name || 'Unknown'}`
                  : `To Dr. ${ref.toDoctorId?.name || 'Unknown'}`}
              </h4>
              <p>Patient: {ref.patientId?.name || 'Unknown'} • {ref.reason}</p>
              <p style={{ marginTop: '0.25rem' }}>
                {statusIcon(ref.status)} <span style={{ marginLeft: '0.25rem' }}>{ref.status}</span>
                {' • '}{new Date(ref.createdAt).toLocaleDateString()}
              </p>
              {ref.notes && <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>"{ref.notes}"</p>}
              {activeTab === 'incoming' && ref.status === 'pending' && (
                <div className="referral-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleAction(ref._id, 'accept')}>
                    <Check size={14} /> Accept
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleAction(ref._id, 'decline')}>
                    <X size={14} /> Decline
                  </button>
                </div>
              )}
              {ref.status === 'accepted' && (
                <div className="referral-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => handleAction(ref._id, 'complete')}>
                    <Check size={14} /> Mark Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
