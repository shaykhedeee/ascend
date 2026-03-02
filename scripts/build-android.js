#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Android Build Script
// Builds the Capacitor Android project and produces a signed APK
//
// Usage:
//   node scripts/build-android.js          # Debug build
//   node scripts/build-android.js release  # Signed release build
//
// Prerequisites:
//   - Android SDK (ANDROID_HOME set)
//   - Java 17+
//   - Capacitor Android platform added (`npx cap add android`)
//   - For release: keystore at ./resurgo-release.keystore
// ═══════════════════════════════════════════════════════════════════════════════

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isRelease = process.argv.includes('release');
const projectRoot = path.resolve(__dirname, '..');
const androidDir = path.join(projectRoot, 'android');

function run(cmd, opts = {}) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: opts.cwd || projectRoot, ...opts });
}

// ─── Pre-flight checks ──────────────────────────────────────────────────────
if (!fs.existsSync(androidDir)) {
  console.log('Android platform not found. Adding...');
  run('npx cap add android');
}

// Sync web assets + Capacitor config to Android
console.log('\n🔄 Syncing Capacitor...');
run('npx cap sync android');

// ─── Build ──────────────────────────────────────────────────────────────────
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const buildTask = isRelease ? 'assembleRelease' : 'assembleDebug';

console.log(`\n🏗️  Building Android (${isRelease ? 'RELEASE' : 'DEBUG'})...`);
run(`${gradlew} ${buildTask}`, { cwd: androidDir });

// ─── Locate output APK ─────────────────────────────────────────────────────
const apkDir = path.join(androidDir, 'app', 'build', 'outputs', 'apk');
const variant = isRelease ? 'release' : 'debug';
const apkPath = path.join(apkDir, variant, `app-${variant}.apk`);

if (fs.existsSync(apkPath)) {
  // Copy APK to public/downloads for serving from the website
  const downloadsDir = path.join(projectRoot, 'public', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }
  const destPath = path.join(downloadsDir, 'resurgo-latest.apk');
  fs.copyFileSync(apkPath, destPath);

  const sizeBytes = fs.statSync(destPath).size;
  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);

  console.log(`\n✅ APK built successfully!`);
  console.log(`   📦 ${destPath}`);
  console.log(`   📏 ${sizeMB} MB`);
  console.log(`   🔧 Variant: ${variant}`);
} else {
  console.error(`\n❌ APK not found at expected path: ${apkPath}`);
  console.error('   Check the Gradle output above for errors.');
  process.exit(1);
}
