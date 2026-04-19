import { useState, useEffect } from 'react';
import { FileText, ShieldCheck, Activity, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/consultations/patient`);
        setConsultations(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const treated = consultations.filter(c => c.status === 'treated').length;
  const pending = consultations.filter(c => c.status === 'pending').length;

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Your health records, secured on the blockchain</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon purple"><FileText size={24} /></div>
          <div className="stat-info">
            <h4>Total Records</h4>
            <div className="stat-value">{consultations.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <h4>Treated</h4>
            <div className="stat-value">{treated}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Activity size={24} /></div>
          <div className="stat-info">
            <h4>Pending</h4>
            <div className="stat-value">{pending}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><Upload size={24} /></div>
          <div className="stat-info">
            <h4>DID</h4>
            <div className="stat-value" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
              {user?.did ? `${user.did.slice(0, 20)}...` : 'Not set'}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Consultations</h3>
        </div>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
        ) : consultations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No consultations yet. Find a doctor to get started.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th><th>Category</th><th>Diagnosis</th>
                  <th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c._id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {c.doctorId?.name || 'Unknown'}
                    </td>
                    <td><span className="badge badge-info">{c.category}</span></td>
                    <td>{c.diagnosis || '—'}</td>
                    <td>
                      <span className={`badge ${
                        c.status === 'treated' ? 'badge-success' :
                        c.status === 'pending' ? 'badge-warning' :
                        c.status === 'referred' ? 'badge-primary' : 'badge-info'
                      }`}>{c.status}</span>
                    </td>
                    <td>{new Date(c.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
