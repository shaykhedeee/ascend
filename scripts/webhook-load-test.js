// Simple webhook load test script for Clerk billing endpoint
const fetch = require('node-fetch');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhooks/clerk-billing';
const CONCURRENCY = parseInt(process.env.LOAD_CONCURRENCY || '50', 10);
const TOTAL = parseInt(process.env.LOAD_TOTAL || '1000', 10);

const svixHeaders = () => {
  const now = Math.floor(Date.now() / 1000).toString();
  return {
    'svix-id': `evt_${Math.random().toString(36).slice(2, 10)}`,
    'svix-timestamp': now,
    'svix-signature': 'v1,good',
    'content-type': 'application/json',
  };
};

async function sendWebhook(i) {
  const body = JSON.stringify({
    user_id: `clerk_loadtest_${i % 100}`,
    plan_id: 'pro_monthly',
  });
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: svixHeaders(),
      body,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  let sent = 0, success = 0, fail = 0;
  const start = Date.now();
  const promises = [];
  for (let i = 0; i < TOTAL; i++) {
    promises.push(sendWebhook(i).then((ok) => {
      if (ok) success++; else fail++;
    }));
    sent++;
    if (promises.length >= CONCURRENCY) {
      await Promise.all(promises.splice(0, CONCURRENCY));
    }
  }
  await Promise.all(promises);
  const elapsed = (Date.now() - start) / 1000;
  console.log(`Sent: ${sent}, Success: ${success}, Fail: ${fail}, Time: ${elapsed}s`);
}

main();
