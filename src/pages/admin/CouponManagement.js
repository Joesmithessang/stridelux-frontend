import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const EMPTY_FORM = { code: '', discount: '', type: 'percentage', active: true };

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    adminService.getCoupons()
      .then((data) => { setCoupons(data); setLoading(false); })
      .catch(() => { setCoupons([]); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({ code: coupon.code, discount: coupon.discount, type: coupon.type, active: coupon.active });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, code: form.code.toUpperCase().trim(), discount: Number(form.discount) };
      if (editingCoupon) {
        const updated = await adminService.updateCoupon(editingCoupon.id, data);
        setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success('Coupon updated');
      } else {
        const created = await adminService.createCoupon(data);
        setCoupons((prev) => [...prev, created]);
        toast.success('Coupon created');
      }
      setModalOpen(false);
    } catch {
      toast.error('Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
      toast.success('Coupon deleted');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Coupons</h1>
          <p>{coupons.length} active coupon{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> Add Coupon
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><LoadingSpinner /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan={6} className="admin-empty">No coupons yet. Create one above.</td></tr>
              ) : coupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiTag style={{ color: '#f97316' }} />
                      <strong style={{ letterSpacing: '0.05em' }}>{c.code}</strong>
                    </div>
                  </td>
                  <td>{c.discount}{c.type === 'percentage' ? '%' : ' $'} off</td>
                  <td style={{ textTransform: 'capitalize' }}>{c.type}</td>
                  <td>
                    <span className={`admin-status ${c.active ? 'status-delivered' : 'status-cancelled'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => openEdit(c)} title="Edit">
                        <FiEdit2 />
                      </button>
                      {deleteConfirm === c.id ? (
                        <>
                          <button className="action-btn confirm-btn" onClick={() => handleDelete(c.id)} title="Confirm delete">
                            <FiCheck />
                          </button>
                          <button className="action-btn cancel-btn" onClick={() => setDeleteConfirm(null)} title="Cancel">
                            <FiX />
                          </button>
                        </>
                      ) : (
                        <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(c.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            <form className="admin-modal-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Coupon Code *</label>
                <input
                  required
                  placeholder="e.g. SAVE10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Discount Amount *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max={form.type === 'percentage' ? 100 : undefined}
                    step="1"
                    placeholder={form.type === 'percentage' ? '10' : '5.00'}
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
              </div>
              <div className="form-group form-group-check">
                <label>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  />
                  Active (visible to customers)
                </label>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
