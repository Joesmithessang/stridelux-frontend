function Checkout() {
  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <section className="checkout-form">
          <h2>Shipping Address</h2>

          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email Address" />
          <input type="text" placeholder="Street Address" />
          <input type="text" placeholder="City" />
          <input type="text" placeholder="Postal Code" />

          <h2>Shipping Method</h2>

          <label className="shipping-option">
            <input type="radio" name="shipping" defaultChecked />
            Standard Shipping — $10.00
          </label>

          <label className="shipping-option">
            <input type="radio" name="shipping" />
            Express Shipping — $20.00
          </label>

          <button className="details-cart-btn">Continue to Payment</button>
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div>
            <p>Subtotal</p>
            <p>$330.00</p>
          </div>

          <div>
            <p>Shipping</p>
            <p>$10.00</p>
          </div>

          <hr />

          <div>
            <strong>Total</strong>
            <strong>$340.00</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;