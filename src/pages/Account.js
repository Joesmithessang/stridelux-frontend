function Account() {
  return (
    <main className="account-page">
      <div className="account-card">
        <div className="avatar">CO</div>

        <div>
          <h1>Christian Onwuanaku</h1>
          <p>christian@example.com</p>
        </div>
      </div>

      <div className="account-menu">
        <p>Orders</p>
        <p>Wishlist</p>
        <p>Addresses</p>
        <p>Payment Methods</p>
        <p>Account Settings</p>
        <p>Logout</p>
      </div>
    </main>
  );
}

export default Account;