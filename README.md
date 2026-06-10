# STRIDELUX — Premium Sneakers & Streetwear

A full-stack e-commerce web application built with React and designed for deployment on AWS. The frontend is fully functional in mock mode with no backend required, and switches to real AWS services by toggling a single environment variable.

---

## Tech Stack

**Frontend**
- React 19 + React Router v7
- AWS Amplify v6 (`aws-amplify/auth`) for Cognito authentication
- Axios for API Gateway HTTP calls
- React Hot Toast for notifications

**Target AWS Backend**
- **Auth** — Amazon Cognito (user pools, groups)
- **API** — API Gateway + AWS Lambda
- **Database** — Amazon DynamoDB
- **Storage** — Amazon S3 (product images, static hosting)
- **Payments** — Stripe
- **Notifications** — Amazon SNS / SES

---

## User Access Levels

| Role | Capabilities |
|---|---|
| **Guest** | Browse products, add to cart, checkout with email/phone/shipping info |
| **Customer** | All guest features + order history, wishlist, account settings |
| **Admin** | Dedicated dashboard — product CRUD, order management, user/team management, reports |

---

## Features

- Product catalogue with search, filter by category/brand, and sort
- Product detail pages with size selection, image gallery, and related products
- Persistent shopping cart and wishlist (localStorage)
- 3-step checkout (Shipping → Payment → Review) for both guests and authenticated users
- Order confirmation page with order summary
- Customer account page with order history and profile settings
- Full admin panel: dashboard with revenue chart, product management, order management, user management, sales reports
- Dark premium design — Space Grotesk + Inter fonts, `#f55e1e` orange accent
- Responsive across desktop, tablet, and mobile

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/your-username/stridelux-ecommerce.git
cd stridelux-ecommerce
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_COGNITO_REGION=us-east-1
REACT_APP_API_GATEWAY_URL=https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_S3_MEDIA_URL=https://your-bucket.s3.amazonaws.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_USE_MOCK=true
```

> **Note:** `.env` is listed in `.gitignore` and must never be committed. Use `.env.example` as the reference template.

### Run in Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

---

## Mock Mode vs Production Mode

The app has a dual-path service layer. Every API call has a mock branch and a real branch, toggled by `REACT_APP_USE_MOCK`.

| Setting | Behaviour |
|---|---|
| `REACT_APP_USE_MOCK=true` | Uses local seed data and localStorage — no AWS account needed |
| `REACT_APP_USE_MOCK=false` | All calls go to real Cognito, API Gateway, Lambda, and DynamoDB |

**Mock mode test credentials:**

| Role | Email | Password |
|---|---|---|
| Customer | `customer@test.com` | `Test1234!` |
| Admin | `admin@test.com` | `Admin1234!` |

Admin changes (products, team members) persist to `localStorage` in mock mode and reset to seed data on cache clear.

---

## Project Structure

```
src/
├── config/
│   └── aws-config.js          # Amplify.configure() + env var exports
├── context/
│   ├── AuthContext.js          # Authentication state and actions
│   ├── CartContext.js          # Cart state (localStorage)
│   └── WishlistContext.js      # Wishlist state (localStorage)
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── ProductCard.js
│   ├── ProtectedRoute.js       # Redirects unauthenticated users to /login
│   └── AdminRoute.js           # Redirects non-admins away from /admin
├── data/
│   ├── products.js             # Seed product catalogue (10 items)
│   ├── mockOrders.js           # Seed orders (2 items)
│   └── mockUsers.js            # Seed customers and employees
├── services/
│   ├── api.js                  # Axios instance with Cognito JWT interceptor
│   ├── authService.js          # signIn / signUp / signOut / getCurrentUser
│   ├── productService.js       # Product CRUD (localStorage-backed in mock mode)
│   ├── orderService.js         # Order creation and status updates
│   ├── cartService.js          # Cart operations
│   ├── userService.js          # Profile and address management
│   └── adminService.js         # Dashboard stats, reports, employee CRUD
├── pages/
│   ├── Home.js
│   ├── Shop.js
│   ├── ProductDetails.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── Login.js
│   ├── Register.js
│   ├── ForgotPassword.js
│   ├── Account.js
│   ├── Wishlist.js
│   ├── OrderConfirmation.js
│   ├── About.js
│   ├── Contact.js
│   ├── Terms.js
│   ├── Privacy.js
│   └── admin/
│       ├── AdminLayout.js      # Sidebar shell for all /admin routes
│       ├── AdminDashboard.js
│       ├── ProductManagement.js
│       ├── OrderManagement.js
│       ├── UserManagement.js
│       └── Reports.js
├── App.js                      # Route definitions
├── App.css                     # Full design system and component styles
└── index.css                   # Base reset
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server at localhost:3000 |
| `npm test` | Run tests in interactive watch mode |
| `npm run build` | Build optimised production bundle to `/build` |

---

## CI/CD Pipeline

Automated via GitHub Actions (`.github/workflows/ci-cd.yml`).

**On every pull request to `main`:**
1. Install dependencies
2. Run tests
3. Build with mock mode (validates compilation)

**On every push to `main`:**
1. All PR checks above
2. Build with real environment secrets injected from GitHub repository secrets
3. Sync `/build` to S3 (hashed assets cached 1 year; `index.html` never cached)
4. Invalidate CloudFront distribution so all users receive the new build immediately

### Required GitHub Secrets

Configure these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `REACT_APP_COGNITO_USER_POOL_ID` | Cognito user pool ID |
| `REACT_APP_COGNITO_CLIENT_ID` | Cognito app client ID |
| `REACT_APP_COGNITO_REGION` | AWS region |
| `REACT_APP_API_GATEWAY_URL` | API Gateway stage URL |
| `REACT_APP_S3_MEDIA_URL` | S3 media bucket URL |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `AWS_ACCESS_KEY_ID` | IAM deploy user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM deploy user secret key |
| `AWS_REGION` | Deployment region |
| `S3_BUCKET_NAME` | Static site bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `CLOUDFRONT_DOMAIN` | CloudFront domain (e.g. `d1abc.cloudfront.net`) |

---

## Connecting the AWS Backend

When the backend is ready:

1. Populate all values in `.env`
2. Set `REACT_APP_USE_MOCK=false`
3. Each service file in `src/services/` will automatically route calls to the real API — no other changes needed

The service layer is designed so that mock and real paths are co-located, making the transition straightforward.

---

## License

Private — all rights reserved.
