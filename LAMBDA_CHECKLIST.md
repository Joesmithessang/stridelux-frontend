# Lambda Deployment Setup Checklist

Complete these steps to get your Lambda deployment pipeline working.

---

## ✅ Prerequisites

- [ ] AWS Account with appropriate IAM permissions
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Node.js 18+ installed
- [ ] Git repo already has CI/CD pipeline (you already have this)
- [ ] GitHub repo access with admin rights to manage secrets

---

## ✅ Part 1: Infrastructure Setup

### AWS Console / CLI

- [ ] **Create Lambda Functions** in AWS Console or via CLI/Terraform
  - [ ] `stridelux-get-products` (or your function names)
  - [ ] `stridelux-create-order` (if you have this)
  - [ ] `stridelux-send-notification` (if you have this)
  - [ ] Any other Lambda functions you need
  
  **Quick CLI example:**
  ```bash
  aws lambda create-function \
    --function-name stridelux-get-products \
    --handler index.handler \
    --runtime nodejs20.x \
    --role arn:aws:iam::ACCOUNT_ID:role/lambda-basic-execution \
    --zip-file fileb://placeholder.zip
  ```

- [ ] **Create IAM Role** for Lambda execution (if not already done)
  ```bash
  # Use existing role or create new one with basic execution policy
  # Role name example: lambda-basic-execution
  ```

- [ ] **Set Environment Variables** for each Lambda (if needed)
  - Example: `PRODUCTS_TABLE=stridelux-products`
  - Example: `STRIPE_SECRET_KEY=sk_live_xxx`

---

## ✅ Part 2: Repository Setup

### Git & Local

- [ ] Your local repo has the new `lambdas/` folder
- [ ] Your local repo has new scripts (`scripts/deploy-lambdas.js`, etc.)
- [ ] Your `.gitignore` is updated (already done ✓)
- [ ] Your `.github/workflows/ci-cd.yml` is updated (already done ✓)

**Verify:**
```bash
ls -la lambdas/
ls -la scripts/deploy-lambdas.js
cat lambdas/config.json  # Should have your functions
```

---

## ✅ Part 3: Lambda Code

### Upload Your Lambda Functions

- [ ] Create directory structure:
  ```
  lambdas/
  ├── function-1/
  │   └── index.js
  ├── function-2/
  │   ├── package.json
  │   ├── index.js
  │   └── node_modules/  (from npm install)
  └── config.json  (updated with your functions)
  ```

- [ ] For Lambdas **with dependencies**:
  ```bash
  cd lambdas/function-name
  npm install
  cd ../..
  git add lambdas/function-name/  # Include node_modules
  ```

- [ ] For simple Lambdas **without dependencies**:
  - Just add `index.js` file
  - Commit to git

---

## ✅ Part 4: Configuration

### Update config.json

- [ ] Edit `lambdas/config.json`
- [ ] Add all your Lambda functions
- [ ] **Verify:**
  - `directory` matches folder name in `lambdas/`
  - `awsFunctionName` matches Lambda name in AWS Console
  - `handler` is correct (usually `index.handler`)
  - `runtime` is correct (usually `nodejs20.x`)

**Example:**
```json
{
  "functions": {
    "get-products": {
      "directory": "get-products",
      "awsFunctionName": "stridelux-get-products",
      "handler": "index.handler",
      "runtime": "nodejs20.x"
    }
  }
}
```

---

## ✅ Part 5: GitHub Secrets

### Configure CI/CD Access to AWS

1. Go to your GitHub repo
2. **Settings → Secrets and variables → Actions**
3. Add these secrets:

- [ ] `AWS_ACCESS_KEY_ID` - Your AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- [ ] `AWS_REGION` - e.g., `us-east-1`

**Already configured (if doing full app deployment):**
- [ ] `REACT_APP_COGNITO_USER_POOL_ID`
- [ ] `REACT_APP_COGNITO_CLIENT_ID`
- [ ] `REACT_APP_API_GATEWAY_URL`
- [ ] `S3_BUCKET_NAME`
- [ ] `CLOUDFRONT_DISTRIBUTION_ID`
- [ ] etc.

---

## ✅ Part 6: Verify CI/CD Pipeline

### Test Automatic Deployment

- [ ] Commit everything to git:
  ```bash
  git add .
  git commit -m "Add Lambda deployment infrastructure"
  ```

- [ ] Push to dev branch:
  ```bash
  git push origin dev
  ```

- [ ] Create Pull Request to main (via GitHub)

- [ ] **Check CI runs:**
  - [ ] Go to **Actions** tab
  - [ ] See CI job running (build, test)
  - [ ] Verify it passes ✓

- [ ] **Merge PR to main** (after CI passes)

- [ ] **Check Deploy runs:**
  - [ ] Go to **Actions** tab
  - [ ] See Deploy job running
  - [ ] **Check Lambda deployment step:**
    - Should say "Checking for Lambda changes"
    - Should see your Lambdas being deployed
    - Look for ✅ "Deploy Lambda functions (if changed)" step

- [ ] **Verify in AWS Console:**
  - Go to Lambda Console
  - Check each function's code was updated
  - Check "Last Modified" timestamp is recent

---

## ✅ Part 7: Manual Testing (Optional)

### Test Manual Deployment

```bash
# Test that deployment script works locally
node scripts/deploy-lambdas.js --dry-run

# If dry-run succeeds, try deploying a specific Lambda
node scripts/deploy-lambdas.js --function=get-products

# Or deploy all
node scripts/deploy-lambdas.js --all
```

---

## ✅ Part 8: Documentation

- [ ] Read `LAMBDA_SETUP.md` (full guide)
- [ ] Read `LAMBDA_QUICKREF.md` (quick reference)
- [ ] Keep `lambdas/README.md` updated as you add functions
- [ ] Update team wiki/docs with your Lambda naming conventions

---

## 🎯 Success Indicators

After completing all steps, you should see:

✅ **In GitHub Actions on main branch:**
- CI job completes successfully
- Deploy job shows:
  - Frontend deployed to S3/CloudFront ✓
  - Lambda functions deployed (or "skipped" if no changes) ✓
  - Deployment summary in job output

✅ **In AWS Lambda Console:**
- Each function shows recent "Last Modified" time
- Code is updated to your latest version

✅ **In Git:**
- `lambdas/` folder in repo with all functions
- `config.json` with all function mappings
- No errors when pushing/merging

---

## ❌ Troubleshooting

### Issue: "Lambda function not found"
**Solution:** 
1. Check Lambda exists in AWS: `aws lambda list-functions`
2. Verify name in `config.json` matches exactly
3. Create Lambda if missing: `aws lambda create-function ...`

### Issue: CI passes but Deploy job fails
**Solution:**
1. Check GitHub Secrets are set
2. Verify AWS credentials are valid
3. Check IAM role has Lambda permissions

### Issue: Deploy skips Lambda even though I changed code
**Solution:**
1. Verify files are in `lambdas/*/` directory
2. Check `config.json` has the function defined
3. Commit to git: `git add lambdas/`

### Issue: npm install fails
**Solution:**
1. Check Node.js version: `node --version` (need 18+)
2. Delete `node_modules` and try again
3. Check package.json syntax is valid

---

## 📞 Next Steps

1. **Complete this checklist** ✓
2. **Upload your Lambda code** to `lambdas/`
3. **Update config.json** with your functions
4. **Push to GitHub** and watch Actions tab
5. **Verify deployment** in AWS Console
6. **Share with team** - give them `LAMBDA_QUICKREF.md`

---

**Enjoy automated Lambda deployment!** 🚀

Questions? See:
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [LAMBDA_SETUP.md](LAMBDA_SETUP.md)
- [LAMBDA_QUICKREF.md](LAMBDA_QUICKREF.md)
