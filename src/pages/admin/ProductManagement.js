import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EMPTY_PRODUCT = {
  name: '', category: 'Sneakers', brand: '', price: '', compareAtPrice: '',
  thumbnail: '', sizes: '', description: '', inStock: true, stockCount: 0,
  tags: '',
};

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    productService.getAll({}).then((data) => { setProducts(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
           p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ ...EMPTY_PRODUCT });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      compareAtPrice: product.compareAtPrice || '',
      thumbnail: product.thumbnail || product.image || '',
      sizes: product.sizes?.join(', ') || '',
      description: product.description || '',
      inStock: product.inStock,
      stockCount: product.stockCount || 0,
      tags: product.tags?.join(', ') || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        stockCount: Number(form.stockCount),
      };
      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        toast.success('Product updated');
      } else {
        await productService.create(data);
        toast.success('Product created');
      }
      load();
      setModalOpen(false);
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      load();
      setDeleteConfirm(null);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="admin-search-bar">
        <FiSearch />
        <input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')}><FiX /></button>}
      </div>

      {loading ? (
        <div className="admin-loading"><LoadingSpinner /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <img src={p.thumbnail || p.image} alt={p.name} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>
                    ${p.price}
                    {p.compareAtPrice && <s className="compare-price"> ${p.compareAtPrice}</s>}
                  </td>
                  <td>{p.stockCount}</td>
                  <td>
                    <span className={`admin-status ${p.inStock ? 'status-delivered' : 'status-cancelled'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit-btn" onClick={() => openEdit(p)} title="Edit">
                        <FiEdit2 />
                      </button>
                      {deleteConfirm === p.id ? (
                        <>
                          <button className="action-btn confirm-btn" onClick={() => handleDelete(p.id)} title="Confirm delete">
                            <FiCheck />
                          </button>
                          <button className="action-btn cancel-btn" onClick={() => setDeleteConfirm(null)} title="Cancel">
                            <FiX />
                          </button>
                        </>
                      ) : (
                        <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(p.id)} title="Delete">
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

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            <form className="admin-modal-form" onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Sneakers</option>
                    <option>Apparel</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Compare Price ($)</label>
                  <input type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL / S3 Path</label>
                <input placeholder="/images/product.jpg" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sizes (comma-separated)</label>
                  <input placeholder="7, 8, 9, 10" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Stock Count</label>
                  <input type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input placeholder="new, bestseller, sale" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div className="form-group form-group-check">
                  <label>
                    <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                    In Stock
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
