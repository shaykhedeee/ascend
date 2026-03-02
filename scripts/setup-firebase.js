// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Firebase Setup Script
// Run this after creating your Firebase project to configure push notifications.
//
// Usage:
//   node scripts/setup-firebase.js
//
// Prerequisites:
//   1. Create a Firebase project at https://console.firebase.google.com
//   2. Add an Android app with package name: life.resurgo.app
//   3. Download the google-services.json file
//   4. Generate a Firebase service account key (JSON)
// ═══════════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const GOOGLE_SERVICES_PATH = path.join(
  __dirname, '..', 'android', 'app', 'google-services.json'
);

const ENV_EXAMPLE_PATH = path.join(__dirname, '..', '.env.local.example');

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('  RESURGO — Firebase Setup');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Step 1: Check for google-services.json
if (fs.existsSync(GOOGLE_SERVICES_PATH)) {
  console.log('✅ google-services.json found at:');
  console.log(`   ${GOOGLE_SERVICES_PATH}`);
  
  try {
    const config = JSON.parse(fs.readFileSync(GOOGLE_SERVICES_PATH, 'utf8'));
    const projectId = config.project_info?.project_id;
    const appId = config.client?.[0]?.client_info?.mobilesdk_app_id;
    
    console.log(`   Project ID: ${projectId || 'unknown'}`);
    console.log(`   App ID: ${appId || 'unknown'}`);
    console.log('');
  } catch (e) {
    console.log('   ⚠️  Could not parse file:', e.message);
  }
} else {
  console.log('❌ google-services.json NOT found');
  console.log('');
  console.log('   To set up Firebase Cloud Messaging:');
  console.log('');
  console.log('   1. Go to https://console.firebase.google.com');
  console.log('   2. Create a new project (or use an existing one)');
  console.log('   3. Click "Add app" → Android');
  console.log('   4. Package name: life.resurgo.app');
  console.log('   5. App nickname: Resurgo');
  console.log('   6. Download google-services.json');
  console.log(`   7. Place it at: android/app/google-services.json`);
  console.log('');
}

// Step 2: Check for service account key
console.log('───────────────────────────────────────────────────────────');
console.log('');
console.log('📋 Service Account Key (for Convex backend):');
console.log('');
console.log('   The backend needs a Firebase service account key to send');
console.log('   push notifications via FCM HTTP v1 API.');
console.log('');
console.log('   1. Go to Firebase Console → Project Settings → Service Accounts');
console.log('   2. Click "Generate new private key"');
console.log('   3. Download the JSON file');
console.log('   4. Copy the ENTIRE JSON content');
console.log('   5. Set it as a Convex environment variable:');
console.log('');
console.log('      npx convex env set FIREBASE_SERVICE_ACCOUNT_JSON \'{"type":"service_account",...}\'');
console.log('');
console.log('   Or paste it in the Convex dashboard under:');
console.log('   Settings → Environment Variables → FIREBASE_SERVICE_ACCOUNT_JSON');
console.log('');

// Step 3: Verify Convex env
console.log('───────────────────────────────────────────────────────────');
console.log('');
console.log('📋 Required Convex Environment Variables:');
console.log('');
console.log('   FIREBASE_SERVICE_ACCOUNT_JSON   (full JSON key)');
console.log('');
console.log('───────────────────────────────────────────────────────────');
console.log('');
console.log('📋 Build Commands:');
console.log('');
console.log('   Debug APK:');
console.log('     npm run android:sync && npm run android:build');
console.log('');
console.log('   Release APK (requires keystore):');
console.log('     npm run android:build:release');
console.log('');
console.log('   Open in Android Studio:');
console.log('     npm run android:open');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
