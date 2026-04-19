import { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/contacts`);
      setContacts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addContact = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post(`${API_BASE_URL}/contacts`, { email, nickname });
      setSuccess('Contact added successfully!');
      setEmail(''); setNickname('');
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add contact');
    }
  };

  const removeContact = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`);
      fetchContacts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page animate-in">
      <div className="page-header">
        <h1>My Contacts</h1>
        <p>Manage your social trust network</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3><UserPlus size={18} style={{ marginRight: '0.5rem' }} />Add Contact</h3>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div style={{
            background: 'rgba(16,185,129,0.1)', color: '#10b981',
            padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem', marginBottom: '1rem',
            border: '1px solid rgba(16,185,129,0.2)'
          }}>{success}</div>}

          <form onSubmit={addContact}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-input" placeholder="contact@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Nickname (optional)</label>
              <input type="text" className="form-input" placeholder="How you know them"
                value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={16} /> Add Contact
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><Users size={18} style={{ marginRight: '0.5rem' }} />Contact List</h3>
            <span className="badge badge-info">{contacts.length} contacts</span>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : contacts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              No contacts yet. Add someone to build your trust network.
            </p>
          ) : (
            <div>
              {contacts.map((c) => (
                <div key={c._id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem', background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-secondary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: 'white'
                  }}>
                    {c.contactUserId?.name?.charAt(0) || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {c.nickname || c.contactUserId?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.contactUserId?.email} • {c.contactUserId?.role}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeContact(c._id)}
                    style={{ color: 'var(--accent-danger)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
