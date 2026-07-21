# Quick Reference: Lambda Deployment

## 🚀 Deploy Lambdas

### Automatic (via Git)
```bash
# Just push to main - Lambdas with changes deploy automatically
git push origin dev
git push origin main  # Creates PR and triggers CI/CD
```

### Manual
```bash
# Deploy all Lambdas
node scripts/deploy-lambdas.js --all

# Deploy specific Lambda
node scripts/deploy-lambdas.js --function=get-products

# Dry-run
node scripts/deploy-lambdas.js --dry-run
```

---

## 📝 Adding a New Lambda

### Step 1: Create folder
```bash
mkdir lambdas/my-new-function
cd lambdas/my-new-function
```

### Step 2: Add code
- **No dependencies**: Just create `index.js`
- **With dependencies**: Also create `package.json` and run `npm install`

### Step 3: Update config
Edit `lambdas/config.json`:
```json
"my-new-function": {
  "directory": "my-new-function",
  "awsFunctionName": "stridelux-my-new-function",
  "handler": "index.handler",
  "runtime": "nodejs20.x"
}
```

### Step 4: Create Lambda in AWS
```bash
aws lambda create-function \
  --function-name stridelux-my-new-function \
  --handler index.handler \
  --runtime nodejs20.x \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --zip-file fileb://placeholder.zip
```

### Step 5: Push to Git
```bash
git add lambdas/
git commit -m "Add new Lambda: my-new-function"
git push
```

---

## 🔧 Common Tasks

### Update Lambda code without dependencies
```bash
# 1. Edit lambdas/my-function/index.js
# 2. Git push
git add lambdas/my-function/
git commit -m "Update my-function logic"
git push
```

### Update Lambda with new dependencies
```bash
# 1. Edit package.json
# 2. Install
cd lambdas/my-function
npm install

# 3. Git push (includes node_modules)
cd ../..
git add lambdas/my-function/
git commit -m "Add dependencies to my-function"
git push
```

### Test Lambda locally before pushing
```bash
# 1. Create test event
cat > test-event.json << 'EOF'
{
  "body": "{\"key\": \"value\"}"
}
EOF

# 2. Run locally (requires sam CLI)
sam local invoke GetProductsFunction -e test-event.json
```

---

## 📊 CI/CD Flow

```
Your Changes
    ↓
Push to dev branch
    ↓
Create Pull Request to main
    ↓
GitHub CI runs:
├─ Build React app ✓
├─ Run tests ✓
└─ Create artifacts ✓
    ↓
(Review & Approve PR)
    ↓
Merge to main
    ↓
GitHub Deploy job runs:
├─ Build React for production
├─ Upload to S3
├─ Invalidate CloudFront
├─ Check Lambda changes
└─ Deploy changed Lambdas only ← NEW!
    ↓
✅ Production Updated
```

---

## ❌ Troubleshooting

### "Function not found" error
```bash
# 1. Check function exists in AWS
aws lambda list-functions --query 'Functions[?FunctionName==`stridelux-my-function`]'

# 2. Verify name in config.json matches exactly
cat lambdas/config.json | grep awsFunctionName

# 3. If not found, create it
aws lambda create-function --function-name stridelux-my-function ...
```

### AWS CLI not configured
```bash
# Configure
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx
export AWS_REGION=us-east-1

# Test
aws sts get-caller-identity
```

### Zip file too large
```bash
# Check size
cd lambdas/my-function
du -sh .

# Reduce size
npm install --only=production
rm -rf node_modules/.bin  # Optional, already omitted by default
```

---

## 📖 Files to Know

| File | Purpose |
|------|---------|
| `lambdas/config.json` | Maps directories to AWS Lambda names |
| `lambdas/README.md` | Full Lambda documentation |
| `scripts/deploy-lambdas.js` | Deployment script (auto-runs on push) |
| `scripts/check-lambda-changes.js` | Detects changes (used by CI/CD) |
| `.github/workflows/ci-cd.yml` | CI/CD pipeline definition |
| `LAMBDA_SETUP.md` | Full setup guide (this file) |

---

## 🔐 Secrets Needed in GitHub

For automatic deployment, these must be in GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

Set in: **Settings → Secrets and variables → Actions**

