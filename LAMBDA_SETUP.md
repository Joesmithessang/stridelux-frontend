# Lambda Deployment Setup Guide

Your CI/CD pipeline is now configured for intelligent Lambda deployment. Here's everything you need to know.

---

## 📋 Quick Overview

### What's New
- ✅ **Smart change detection**: Only Lambdas with code changes are deployed
- ✅ **Git-based versioning**: Your Lambda code is versioned in the repo
- ✅ **Automated deployment**: Every merge to `main` triggers the pipeline
- ✅ **Separate concerns**: React app and Lambda deployments are independent

### Deployment Flow
```
Push to dev (or local branch)
       ↓
Create Pull Request to main
       ↓
CI runs (build app, run tests)
       ↓
Merge to main (approved)
       ↓
Deploy to Production (2 concurrent jobs)
├─ Frontend: Build React app → S3 → CloudFront invalidation
└─ Backend: Detect Lambda changes → Zip changed functions → Deploy to AWS
```

---

## 📁 Project Structure

### Lambda Directory
```
lambdas/
├── README.md                  # Lambda documentation
├── config.json                # Configuration mapping (edit this)
├── get-products/              # Example: simple Lambda
│   └── index.js
├── create-order/              # Example: Lambda with dependencies
│   ├── package.json
│   ├── index.js
│   └── node_modules/          # Committed (versioned in git)
└── process-payment/           # Your functions here
    ├── package.json
    ├── index.js
    └── node_modules/
```

### Key Files
- **`lambdas/config.json`**: Maps each Lambda directory to AWS function names (you'll edit this)
- **`scripts/deploy-lambdas.js`**: Main deployment script (runs on push to main)
- **`scripts/check-lambda-changes.js`**: Detects if Lambda code changed (used by CI/CD)
- **`.github/workflows/ci-cd.yml`**: Updated workflow with Lambda deployment steps

---

## 🚀 Getting Started

### Step 1: Add Your Lambda Functions

Copy your Lambda code to the `lambdas/` directory. For each function:

**Simple Lambda (no dependencies):**
```
lambdas/my-function/
└── index.js
```

**Lambda with dependencies:**
```
lambdas/my-function/
├── package.json
├── index.js
├── lib/
│   └── helpers.js
└── node_modules/  ← Run "npm install" to generate this
```

**Install dependencies for complex Lambdas:**
```bash
cd lambdas/my-function
npm install
cd ../..
```

Then commit everything (including `node_modules/`) to git:
```bash
git add lambdas/
git commit -m "Add Lambda functions"
```

### Step 2: Update `lambdas/config.json`

Edit the config to match your Lambda functions. Replace the example functions with yours:

```json
{
  "functions": {
    "get-products": {
      "directory": "get-products",
      "awsFunctionName": "stridelux-get-products",
      "handler": "index.handler",
      "runtime": "nodejs20.x",
      "description": "Retrieves products from DynamoDB"
    },
    "my-custom-function": {
      "directory": "my-custom-function",
      "awsFunctionName": "my-custom-function-prod",
      "handler": "index.handler",
      "runtime": "nodejs20.x",
      "description": "My custom Lambda"
    }
  }
}
```

**Key fields:**
- `directory`: Folder name in `lambdas/`
- `awsFunctionName`: Exact name of Lambda function in AWS
- `handler`: Handler path (usually `index.handler` for Node.js)
- `runtime`: Node version (`nodejs20.x`, `nodejs18.x`, etc.)

### Step 3: Ensure Lambda Functions Exist in AWS

Before deploying, create the Lambda functions in AWS Console or via Terraform:

```bash
# Example: Create a Lambda function (one-time setup)
aws lambda create-function \
  --function-name stridelux-get-products \
  --handler index.handler \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --zip-file fileb://lambda-placeholder.zip
```

Or use Terraform (recommended for disaster recovery):
```hcl
resource "aws_lambda_function" "get_products" {
  function_name = "stridelux-get-products"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn
  
  # Placeholder; will be updated by CI/CD
  filename = "placeholder.zip"
}
```

### Step 4: Configure GitHub Secrets (if not already done)

Add these AWS credentials to your GitHub repo settings (**Settings → Secrets and variables → Actions**):

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key  
- `AWS_REGION` - e.g., `us-east-1`

Plus any other secrets for React app (already configured).

---

## 📝 Workflow: Making Changes

### Scenario 1: Update React App Only
1. Edit `src/` files
2. Push to dev branch
3. Create PR to main
4. Merge to main
5. **Result**: React app rebuilds and deploys; Lambdas are skipped ✅

### Scenario 2: Update Lambda Code
1. Edit files in `lambdas/my-function/`
2. If you added dependencies: `cd lambdas/my-function && npm install`
3. Commit everything (including `node_modules/`)
4. Push to dev branch
5. Create PR to main
6. Merge to main
7. **Result**: Only changed Lambdas are zipped and deployed to AWS ✅

### Scenario 3: Update Both React and Lambda
1. Make changes in both `src/` and `lambdas/`
2. Commit
3. Push to dev and merge to main
4. **Result**: React app and changed Lambdas both deploy ✅

### Scenario 4: Update Only Lambda Config (config.json or README)
1. Edit `lambdas/config.json` or `lambdas/README.md`
2. Commit and push to main
3. **Result**: Config changes detected but no function code changed; deployment skipped ✅

---

## 🛠 Manual Deployment (Without Pushing)

If you need to deploy without going through Git, you can run the deployment script locally:

```bash
# Deploy all Lambdas
node scripts/deploy-lambdas.js --all

# Deploy a specific Lambda
node scripts/deploy-lambdas.js --function=get-products

# Dry-run (show what would be deployed)
node scripts/deploy-lambdas.js --dry-run
```

**Prerequisites:**
- AWS CLI configured: `aws configure`
- Node.js 18+ installed
- `lambdas/config.json` is up to date

---

## 🔄 CI/CD Pipeline Details

### On Every Push to Main

The workflow runs these jobs in order:

#### 1. **CI Job** (always)
- Builds React app
- Runs tests
- Creates artifacts

#### 2. **Deploy Job** (only after CI passes)
- Deploys React app to S3 + CloudFront
- **Checks for Lambda changes** (new!)
  - If Lambda files changed → Deploy them
  - If only React files changed → Skip Lambda deployment
- Generates deployment summary

### Change Detection Logic

The script checks:
- Changed files in `lambdas/*/` directories
- Ignores `lambdas/config.json` and `lambdas/README.md`
- Extracts function names from changed paths
- Only zips and uploads those functions

Example:
```
Changed files:
  - lambdas/get-products/index.js
  - src/components/Home.js

→ Deploys: get-products Lambda only
→ React app: deploys (always)
```

---

## 📊 Deployment Summary

After each deployment to main, GitHub displays a summary like:

```
✅ Deployment successful

Frontend
- Status: Deployed to CloudFront
- URL: https://your-domain.com
- Cache: Invalidated

Backend (Lambda)
- Status: Functions deployed  ← or "No changes (skipped)"

Metadata
- Commit: abc123def456
- Branch: main
- Triggered by: your-username
- Time: 2024-07-21 14:30 UTC
```

---

## 🐛 Troubleshooting

### Lambda deployment fails with "Function not found"

**Problem**: `aws lambda update-function-code` fails

**Solution**: 
1. Verify Lambda function exists in AWS
2. Verify function name in `lambdas/config.json` matches AWS
3. Verify AWS credentials in GitHub Secrets

### No Lambdas deploy but files changed

**Problem**: Changed Lambda files but deployment skipped

**Solution**:
1. Check that files are in `lambdas/` directory
2. Verify config.json has the function defined
3. Check deployment logs for errors

### Zip file is too large (>50 MB)

**Problem**: Lambda package exceeds 50 MB

**Solutions**:
1. Remove unnecessary `node_modules` (keep only production dependencies)
2. Use `npm ci --only=production` instead of `npm install`
3. Consider Lambda Layers for shared code
4. Compress with `gzip` before upload (if supported by your handler)

### Changes detected but only config.json changed

**Problem**: Deployment triggered unnecessarily

**Solution**: This is expected; the script ignores `config.json` changes. Push the config change separately if needed.

---

## 🏗 Terraform Integration (Disaster Recovery)

You can use Terraform to define your Lambda infrastructure for disaster recovery:

```hcl
# infra/lambda.tf
resource "aws_lambda_function" "get_products" {
  function_name = "stridelux-get-products"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_role.arn
  
  filename      = "build/.lambda-temp/get-products.zip"
  source_code_hash = filebase64sha256("build/.lambda-temp/get-products.zip")
}
```

Then run:
```bash
# Deploy all infrastructure
terraform apply -auto-approve

# Or with GitHub Actions (add a separate job after Lambda deployment)
```

---

## 📚 Additional Resources

- [AWS Lambda Guide](https://docs.aws.amazon.com/lambda/)
- [AWS CLI Lambda Commands](https://docs.aws.amazon.com/cli/latest/reference/lambda/)
- [Node.js Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)

---

## ❓ Questions?

Refer to:
- `lambdas/README.md` - Lambda directory documentation
- `lambdas/config.json` - Function configuration template
- `.github/workflows/ci-cd.yml` - Workflow definition

