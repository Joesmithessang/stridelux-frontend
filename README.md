# StrideLux — Frontend

React single-page application for the StrideLux e-commerce platform. Hosted on Amazon S3 and delivered via CloudFront. Integrates with a serverless AWS backend through API Gateway, with Amazon Cognito handling authentication.

---

## Architecture

```
User → Route 53 → CloudFront → S3 (React SPA)
                       │
                       └──→ API Gateway (HTTP API)
                                    │
                             Cognito JWT Authorizer
                                    │
                              Lambda Functions
                                    │
                               DynamoDB
```

The frontend is a compiled static bundle. All AWS communication happens client-side via Axios against the API Gateway URL. Authentication tokens are issued by Cognito and attached to requests by an Axios interceptor.

A dual-path service layer (`src/services/`) supports a mock mode for local development and demonstration — toggled by `REACT_APP_USE_MOCK` — and a production mode that routes all calls to the live AWS backend.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + React Router v7 |
| Authentication | AWS Amplify v6 / Amazon Cognito |
| HTTP client | Axios (with JWT interceptor) |
| Hosting | Amazon S3 (static) + CloudFront (CDN) |
| CI/CD | GitHub Actions |
| Code quality | SonarCloud |
| Security scanning | Trivy |

---

## User Roles

| Role | Access |
|---|---|
| Guest | Browse, cart, checkout (no account required) |
| Customer | + Order history, wishlist, account settings |
| Admin | Dedicated `/admin` dashboard — product CRUD, order management, user/employee management, reports |

Role authorisation is enforced both client-side (route guards) and server-side (Cognito group membership checked in Lambda).

---

## Project Structure

```
src/
├── config/aws-config.js          # Amplify.configure() + env var exports
├── context/                      # Auth, Cart, Wishlist providers
├── components/                   # Navbar, Footer, ProtectedRoute, AdminRoute
├── data/                         # Mock seed data (products, orders, users)
├── services/                     # Dual-path API layer (mock + real)
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   ├── cartService.js
│   ├── userService.js
│   └── adminService.js
├── pages/
│   ├── Home, Shop, ProductDetails, Cart, Checkout
│   ├── Login, Register, ForgotPassword
│   ├── Account, Wishlist, OrderConfirmation
│   └── admin/
│       ├── AdminDashboard
│       ├── ProductManagement
│       ├── OrderManagement
│       ├── UserManagement
│       └── Reports
└── App.js                        # Route definitions
```

---

## Getting Started

```bash
git clone https://github.com/Joesmithessang/stridelux-frontend.git
cd stridelux-frontend
npm install --legacy-peer-deps
cp .env.example .env   # populate values
npm start              # http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_COGNITO_USER_POOL_ID` | Cognito user pool ID |
| `REACT_APP_COGNITO_CLIENT_ID` | Cognito app client ID |
| `REACT_APP_COGNITO_REGION` | AWS region |
| `REACT_APP_API_GATEWAY_URL` | API Gateway stage URL |
| `REACT_APP_S3_MEDIA_URL` | S3 media bucket base URL |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `REACT_APP_USE_MOCK` | `true` = local seed data, `false` = live AWS |

**Mock mode credentials:**

| Role | Email | Password |
|---|---|---|
| Customer | `customer@test.com` | `Test1234!` |
| Admin | `admin@test.com` | `Admin1234!` |

---

## CI/CD Pipeline

```
Pull Request → main
  ├── Trivy — CVE, secret, misconfiguration scan (CRITICAL blocks merge)
  ├── SonarCloud — static analysis, quality gate
  └── Build & Test — npm ci, tests, mock-mode build

Push → main
  └── Deploy to Production
        ├── Build with real secrets (GitHub Actions secrets)
        ├── Sync /build → S3 (hashed assets: 1-year cache; index.html: no-cache)
        └── CloudFront invalidation — /* 
```

### Required Secrets

| Secret | |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` | IAM deploy credentials |
| `S3_BUCKET_NAME` / `CLOUDFRONT_DISTRIBUTION_ID` | Deployment targets |
| `REACT_APP_COGNITO_USER_POOL_ID` / `REACT_APP_COGNITO_CLIENT_ID` / `REACT_APP_COGNITO_REGION` | Cognito config |
| `REACT_APP_API_GATEWAY_URL` / `REACT_APP_S3_MEDIA_URL` / `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Runtime config |
| `SONAR_TOKEN` | SonarCloud analysis |

---

## Related Repositories

| Repository | Description |
|---|---|
| [stridelux-backend](https://github.com/Joesmithessang/stridelux-backend) | Lambda functions — products, orders, payments, admin, cart |
| [stridelux-infra](https://github.com/Joesmithessang/stridelux-infra) | Terraform IaC — all AWS resource definitions |
