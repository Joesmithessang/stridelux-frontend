import { useState, useEffect } from 'react';
import {
  FiSearch, FiMail, FiPhone, FiShoppingBag, FiUserCheck,
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const TABS = [
  { key: 'customers', label: 'Customers', icon: <FiShoppingBag /> },
  { key: 'team', label: 'Team & Staff', icon: <FiUserCheck /> },
];

const STATUS_CLASS = { active: 'status-delivered', inactive: 'status-cancelled' };

const ROLES = [
  'Administrator',
  'Customer Support Lead',
  'Support Agent',
  'Inventory Manager',
  'Marketing Specialist',
  'Operations Manager',
];

const DEPARTMENTS = ['Management', 'Customer Support', 'Operations', 'Marketing'];

const EMPTY_FORM = { name: '', email: '', phone: '', role: '', department: '', status: 'active' };

export default function UserManagement() {
  const [tab, setTab] = useState('customers');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    adminService.getUsers().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="admin-loading"><LoadingSpinner /></div>;

  const customers = (data.customers || []).filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const employees = (data.employees || []).filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setEditingEmployee(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setForm({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      role: employee.role || '',
      department: employee.department || '',
      status: employee.status || 'active',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEmployee(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEmployee) {
        const updated = await adminService.updateEmployee(editingEmployee.id, form);
        setData((prev) => ({
          ...prev,
          employees: prev.employees.map((emp) => (emp.id === updated.id ? updated : emp)),
        }));
        toast.success('Team member updated.');
      } else {
        const created = await adminService.createEmployee(form);
        setData((prev) => ({ ...prev, employees: [...prev.employees, created] }));
        toast.success('Team member added.');
      }
      closeModal();
    } catch (err) {
      toast.error(err?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteEmployee(id);
      setData((prev) => ({ ...prev, employees: prev.employees.filter((emp) => emp.id !== id) }));
      setDeletingId(null);
      toast.success('Team member removed.');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete.');
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Users</h1>
          <p>Manage customers and team members</p>
        </div>
        {tab === 'team' && (
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <FiPlus /> Add Team Member
          </button>
        )}
      </div>

      <div className="user-mgmt-controls">
        <div className="user-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`user-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => { setTab(t.key); setSearch(''); setDeletingId(null); }}
            >
              {t.icon}
              {t.label}
              <span className="user-tab-count">
                {t.key === 'customers' ? data.customers?.length : data.employees?.length}
              </span>
            </button>
          ))}
        </div>
        <div className="user-search-wrap">
          <FiSearch className="user-search-icon" />
          <input
            type="text"
            placeholder={tab === 'customers' ? 'Search customers…' : 'Search team…'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="user-search-input"
          />
        </div>
      </div>

      {/* ── Customers (read-only) ── */}
      {tab === 'customers' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Customers</h3>
            <span>{customers.length} result{customers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={6} className="admin-empty">No customers found.</td></tr>
                ) : customers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">{u.name.charAt(0).toUpperCase()}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <p className="user-contact-line"><FiMail size={12} /> {u.email}</p>
                      {u.phone && <p className="user-contact-line cell-sub"><FiPhone size={12} /> {u.phone}</p>}
                    </td>
                    <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                    <td>{u.totalOrders}</td>
                    <td><strong>${u.totalSpent?.toFixed(2)}</strong></td>
                    <td>
                      <span className={`admin-status ${STATUS_CLASS[u.status] || ''}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Team & Staff (with CRUD) ── */}
      {tab === 'team' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Team & Staff</h3>
            <span>{employees.length} result{employees.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan={7} className="admin-empty">No team members found.</td></tr>
                ) : employees.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm employee">{u.name.charAt(0).toUpperCase()}</div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <p className="user-contact-line"><FiMail size={12} /> {u.email}</p>
                      {u.phone && <p className="user-contact-line cell-sub"><FiPhone size={12} /> {u.phone}</p>}
                    </td>
                    <td>{u.role}</td>
                    <td><span className="dept-badge">{u.department}</span></td>
                    <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`admin-status ${STATUS_CLASS[u.status] || ''}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {deletingId === u.id ? (
                        <div className="action-btns">
                          <button
                            className="action-btn confirm-btn"
                            title="Confirm delete"
                            onClick={() => handleDelete(u.id)}
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="action-btn cancel-btn"
                            title="Cancel"
                            onClick={() => setDeletingId(null)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className="action-btns">
                          <button
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() => openEdit(u)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Delete"
                            onClick={() => setDeletingId(u.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create / Edit modal ── */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingEmployee ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button className="modal-close-btn" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSave} className="admin-modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required placeholder="Jane Smith" {...field('name')} />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" required placeholder="jane@stridelux.com" {...field('email')} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="+1 416-555-0100" {...field('phone')} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select {...field('status')}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Role *</label>
                  <select required {...field('role')}>
                    <option value="">Select role…</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select required {...field('department')}>
                    <option value="">Select department…</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving…' : editingEmployee ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
