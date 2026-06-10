import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['All', 'Sneakers', 'Apparel', 'Accessories'];
const BRANDS = ['All', 'Nike', 'Jordan', 'Adidas', 'New Balance', 'Puma'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  const category = searchParams.get('category') || 'All';
  const brand = searchParams.get('brand') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    productService.getAll({ category, brand, sort, search }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category, brand, sort, search]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'All' || !value) { next.delete(key); } else { next.set(key, value); }
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});
  const hasFilters = category !== 'All' || brand !== 'All' || search;

  return (
    <main className="shop-page">
      <div className="page-hero-mini">
        <div className="section-container">
          <p className="section-overline">Collection</p>
          <h1>Shop All</h1>
          {search && <p className="search-result-label">Results for "<strong>{search}</strong>" — {products.length} found</p>}
        </div>
      </div>

      <div className="section-container shop-layout-wrap">
        {/* Toolbar */}
        <div className="shop-toolbar">
          <div className="toolbar-left">
            <button className="btn btn-outline btn-sm filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
              <FiFilter /> Filters {hasFilters && <span className="filter-dot" />}
            </button>
            <span className="product-count">{products.length} products</span>
          </div>
          <div className="toolbar-right">
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className={`view-toggle ${gridView ? 'active' : ''}`} onClick={() => setGridView(true)} aria-label="Grid view"><FiGrid /></button>
            <button className={`view-toggle ${!gridView ? 'active' : ''}`} onClick={() => setGridView(false)} aria-label="List view"><FiList /></button>
          </div>
        </div>

        <div className="shop-body">
          {/* Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear all <FiX />
                </button>
              )}
            </div>

            <div className="filter-group">
              <h4 className="filter-group-title">Category <FiChevronDown /></h4>
              <div className="filter-options">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`filter-option ${category === c ? 'active' : ''}`}
                    onClick={() => setFilter('category', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-group-title">Brand <FiChevronDown /></h4>
              <div className="filter-options">
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    className={`filter-option ${brand === b ? 'active' : ''}`}
                    onClick={() => setFilter('brand', b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters chips */}
            {hasFilters && (
              <div className="active-chips">
                {category !== 'All' && (
                  <span className="filter-chip">{category} <button onClick={() => setFilter('category', 'All')}><FiX /></button></span>
                )}
                {brand !== 'All' && (
                  <span className="filter-chip">{brand} <button onClick={() => setFilter('brand', 'All')}><FiX /></button></span>
                )}
                {search && (
                  <span className="filter-chip">"{search}" <button onClick={() => setFilter('search', '')}><FiX /></button></span>
                )}
              </div>
            )}
          </aside>

          {/* Product grid */}
          <div className="products-area">
            {loading ? (
              <div className="loading-center"><LoadingSpinner /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>No products found for the selected filters.</p>
                <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : (
              <div className={`product-grid ${gridView ? '' : 'product-list'}`}>
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
