import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, RefreshCw, Filter } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments/doctor`);
      setAppointments(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await axios.put(`${API_BASE_URL}/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) { console.error(err); }
    finally { setActionLoading(''); }
  };

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const statusConfig = {
    pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Pending' },
    confirmed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Confirmed' },
    cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Cancelled' },
    completed: { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', label: 'Completed' },
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="page animate-in">
      <div className="page-header flex-between">
        <div>
          <h1>Appointments</h1>
          <p>Manage patient appointment requests</p>
        </div>
        <button className="btn btn-secondary" onClick={() => fetchAppointments(true)} disabled={refreshing}>
          <RefreshCw size={16} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" onClick={() => setFilter('pending')} style={{ cursor: 'pointer', borderLeft: filter === 'pending' ? '3px solid #f59e0b' : 'none' }}>
          <div className="stat-icon amber"><Clock size={24} /></div>
          <div className="stat-info">
            <h4>Pending</h4>
            <div className="stat-value">{counts.pending}</div>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('confirmed')} style={{ cursor: 'pointer', borderLeft: filter === 'confirmed' ? '3px solid #10b981' : 'none' }}>
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <h4>Confirmed</h4>
            <div className="stat-value">{counts.confirmed}</div>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('completed')} style={{ cursor: 'pointer', borderLeft: filter === 'completed' ? '3px solid #22d3ee' : 'none' }}>
          <div className="stat-icon cyan"><Calendar size={24} /></div>
          <div className="stat-info">
            <h4>Completed</h4>
            <div className="stat-value">{counts.completed}</div>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('all')} style={{ cursor: 'pointer', borderLeft: filter === 'all' ? '3px solid #818cf8' : 'none' }}>
          <div className="stat-icon purple"><Filter size={24} /></div>
          <div className="stat-info">
            <h4>Total</h4>
            <div className="stat-value">{counts.all}</div>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <p>{filter === 'all' ? 'No appointments yet.' : `No ${filter} appointments.`}</p>
          {filter !== 'all' && (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setFilter('all')}>
              Show All
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(apt => {
            const sc = statusConfig[apt.status] || statusConfig.pending;
            const isPending = apt.status === 'pending';
            const isConfirmed = apt.status === 'confirmed';

            return (
              <div key={apt._id} className="card" style={{
                borderLeft: `3px solid ${sc.color}`,
                padding: '1.25rem',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  {/* Patient Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: `linear-gradient(135deg, ${sc.color}33, ${sc.color}66)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: sc.color, fontWeight: 800, fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {apt.patientId?.name?.charAt(0) || 'P'}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        {apt.patientId?.name || 'Unknown Patient'}
                      </h4>
                      <span style={{
                        padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem', fontWeight: 600,
                        background: sc.bg, color: sc.color
                      }}>
                        {sc.label}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                      {apt.patientId?.email}
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} color={sc.color} /> {formatDate(apt.date)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} color={sc.color} /> {apt.timeSlot}
                      </span>
                    </div>

                    {apt.reason && (
                      <p style={{
                        fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem',
                        background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)', borderLeft: `2px solid ${sc.color}`
                      }}>
                        💬 {apt.reason}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                    {isPending && (
                      <>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'var(--gradient-success)', color: 'white' }}
                          disabled={actionLoading === apt._id}
                          onClick={() => updateStatus(apt._id, 'confirmed')}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{ color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                          disabled={actionLoading === apt._id}
                          onClick={() => updateStatus(apt._id, 'cancelled')}>
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                    {isConfirmed && (
                      <>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'var(--gradient-secondary)', color: 'white' }}
                          disabled={actionLoading === apt._id}
                          onClick={() => updateStatus(apt._id, 'completed')}>
                          <CheckCircle size={14} /> Complete
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{ color: 'var(--accent-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                          disabled={actionLoading === apt._id}
                          onClick={() => updateStatus(apt._id, 'cancelled')}>
                          <XCircle size={14} /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
