import products from '../data/products';
import ProductCard from '../components/ProductCard';

function Shop() {
  return (
    <main className="shop-page">
      <div className="shop-header">
        <div>
          <p className="tagline dark">SHOP</p>
          <h1>Shop Collection</h1>
        </div>

        <select className="sort-box">
          <option>Sort by: Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <h3>Categories</h3>
          <p>All</p>
          <p>Sneakers</p>
          <p>Apparel</p>
          <p>Accessories</p>

          <h3>Brand</h3>
          <p>Nike</p>
          <p>Jordan</p>
          <p>Adidas</p>
          <p>New Balance</p>
        </aside>

        <section className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default Shop;