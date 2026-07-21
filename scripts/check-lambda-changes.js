#!/usr/bin/env node

/**
 * Lambda Change Detection Script
 * 
 * Checks if any Lambda code has changed compared to the base branch.
 * Returns exit code 0 if changes detected, 1 if no changes.
 * 
 * This is used by GitHub Actions to conditionally run Lambda deployment.
 * 
 * Usage:
 *   node scripts/check-lambda-changes.js
 */

const { execSync } = require('child_process');

function checkForLambdaChanges() {
  try {
    // Get the comparison base (main for production, develop for staging)
    let base = 'origin/main';

    try {
      // Check if we're on a PR
      if (process.env.GITHUB_BASE_REF) {
        base = process.env.GITHUB_BASE_REF;
      }
    } catch (e) {
      // Continue with default base
    }

    console.log(`Comparing against: ${base}`);

    // Get list of changed files in lambdas/ directory
    const output = execSync(
      `git diff --name-only ${base}...HEAD -- lambdas/`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();

    const changedFiles = output.split('\n').filter(f => f && f !== 'lambdas/config.json' && f !== 'lambdas/README.md');

    if (changedFiles.length > 0) {
      console.log('\n✅ Lambda changes detected:');
      changedFiles.forEach(f => console.log(`   - ${f}`));
      console.log('\n');
      process.exit(0); // Changes detected
    } else {
      console.log('✅ No Lambda code changes detected (config/README changes ignored)');
      process.exit(1); // No changes
    }
  } catch (error) {
    if (error.status === 128) {
      // Git error - likely first commit or branch doesn't exist
      console.log('⚠️  Unable to compare (likely first commit). Assuming no Lambda changes.');
      process.exit(1);
    }
    console.error('Error checking Lambda changes:', error.message);
    process.exit(1);
  }
}

checkForLambdaChanges();
