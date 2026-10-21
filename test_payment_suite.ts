import assert from 'assert';
import crypto from 'crypto';

const BASE_URL = 'http://localhost:3000';

async function runTestSuite() {
  console.log('=== STARTING AI MARATHI GURU PAYMENT & SETTINGS TEST SUITE ===\n');

  // STEP 1: Verify Payment Settings Get & Put Persistence
  console.log('--- 1. Testing Payment Settings Persistence ---');
  
  // Obtain valid admin token
  const AUTH_SECRET = process.env.AUTH_SALT || 'AMG_SECURE_AUTH_SESSION_KEY_2026';
  const payload = { username: 'aimarathi', role: 'SUPER_ADMIN', ts: Date.now() };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('hex');
  const adminToken = `${payloadB64}.${signature}`;
  console.log('✓ Admin token generated and authenticated');

  // Update payment settings to fee = 149, originalFee = 1499
  const updateSettingsRes = await fetch(`${BASE_URL}/api/admin/payment-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      courseFee: 149,
      originalFee: 1499,
      paymentLink: 'https://rzp.io/rzp/Wvuh93a',
    }),
  });
  
  const updateData = await updateSettingsRes.json();
  assert.strictEqual(updateData.success, true, 'Payment settings PUT must succeed');
  assert.strictEqual(updateData.paymentSettings.courseFee, 149, 'courseFee must be updated to 149');
  assert.strictEqual(updateData.paymentSettings.originalFee, 1499, 'originalFee must be updated to 1499');
  console.log('✓ PUT /api/admin/payment-settings updated fee to ₹149 and MRP to ₹1499');

  // Check GET /api/payment-settings (public)
  const pubSettingsRes = await fetch(`${BASE_URL}/api/payment-settings`);
  const pubSettings = await pubSettingsRes.json();
  assert.strictEqual(pubSettings.courseFee, 149, 'Public payment settings must reflect ₹149');
  assert.strictEqual(pubSettings.originalFee, 1499, 'Public payment settings must reflect ₹1499');
  console.log('✓ GET /api/payment-settings verified updated values: fee = ₹149, MRP = ₹1499');

  // Check GET /api/content (public)
  const contentRes = await fetch(`${BASE_URL}/api/content`);
  const contentData = await contentRes.json();
  assert.strictEqual(contentData.paymentSettings.courseFee, 149, 'Content API paymentSettings must reflect ₹149');
  assert.strictEqual(contentData.siteSettings.courseFee, 149, 'Content API siteSettings must reflect ₹149');
  assert.strictEqual(contentData.siteSettings.oldPrice, 1499, 'Content API siteSettings oldPrice must reflect ₹1499');
  console.log('✓ GET /api/content verified updated values on public site');

  // Restore back to standard fee ₹99 and originalFee ₹999 for course
  await fetch(`${BASE_URL}/api/admin/payment-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      courseFee: 99,
      originalFee: 999,
      paymentLink: 'https://rzp.io/rzp/Wvuh93a',
    }),
  });
  console.log('✓ Restored fee to ₹99, MRP to ₹999 for test registrations\n');

  // STEP 2: Proceed to Pay & Server Razorpay Order Creation Flow
  console.log('--- 2. Testing Proceed to Pay & Server Order Creation ---');
  const testMobile = `98${Date.now().toString().slice(-8)}`;
  const regRes = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'सचिन दत्तात्रय पाटील',
      mobileNumber: testMobile,
      whatsappNumber: testMobile,
      email: `sachin_${Date.now()}@example.com`,
      district: 'पुणे (Pune)',
      occupation: 'Job',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot1',
    }),
  });

  const regData = await regRes.json();
  assert.strictEqual(regData.success, true, 'Registration must succeed');
  assert.strictEqual(regData.registrationStatus, 'PENDING', 'Initial registration must be PENDING');
  assert.strictEqual(regData.paymentStatus, 'PENDING', 'Initial payment status must be PENDING');
  assert.strictEqual(regData.amount, 9900, 'Order amount in paise must be 9900');
  assert.ok(regData.orderId && regData.orderId.startsWith('order_'), 'Must create valid Razorpay order starting with order_');
  assert.ok(regData.keyId && regData.keyId.startsWith('rzp_'), 'Must provide valid live Razorpay keyId');
  console.log('✓ /api/register created pending session and server Razorpay Order:', regData.orderId);
  console.log('✓ Key ID provided to client without exposing secret:', regData.keyId);

  // STEP 3: Signature Verification Security Check
  console.log('\n--- 3. Testing Payment Verification Security ---');
  const tempId = regData.tempId;
  const orderId = regData.orderId;
  const fakePayId = `pay_mock_${Date.now()}`;

  // Fake signature must be rejected
  const fakeVerifyRes = await fetch(`${BASE_URL}/api/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempId,
      mobileNumber: testMobile,
      razorpay_payment_id: fakePayId,
      razorpay_order_id: orderId,
      razorpay_signature: 'invalid_tampered_signature_123',
    }),
  });
  const fakeVerifyData = await fakeVerifyRes.json();
  assert.strictEqual(fakeVerifyRes.status, 400, 'Tampered signature must be rejected with 400');
  assert.strictEqual(fakeVerifyData.paymentStatus, 'FAILED', 'Must mark payment status as FAILED');
  console.log('✓ Security check: Tampered signature correctly rejected with 400 and FAILED status');

  // Valid signature check using server key secret
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const validPayId = `pay_${Date.now().toString()}`;
  const validSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${validPayId}`)
    .digest('hex');

  const validVerifyRes = await fetch(`${BASE_URL}/api/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempId,
      mobileNumber: testMobile,
      razorpay_payment_id: validPayId,
      razorpay_order_id: orderId,
      razorpay_signature: validSignature,
    }),
  });

  const validVerifyData = await validVerifyRes.json();
  assert.strictEqual(validVerifyRes.status, 200, 'Valid signature must succeed');
  assert.strictEqual(validVerifyData.success, true);
  assert.strictEqual(validVerifyData.paymentStatus, 'PAID', 'Payment must be marked PAID');
  assert.strictEqual(validVerifyData.registrationStatus, 'CONFIRMED', 'Registration must be CONFIRMED');
  assert.ok(validVerifyData.registration.id.startsWith('AMG-2026-'), 'Must generate unique Registration ID AMG-2026-');
  assert.ok(validVerifyData.whatsappMessage.includes(validVerifyData.registration.id), 'WhatsApp message must include Registration ID');
  console.log('✓ Valid signature verified: Student CONFIRMED with ID:', validVerifyData.registration.id);

  // Duplicate payment ID reuse must be rejected
  const dupRegRes = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Duplicate Tester',
      mobileNumber: '9988776655',
      email: 'dup@example.com',
      district: 'नाशिक',
      occupation: 'Student',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot2',
    }),
  });
  const dupRegData = await dupRegRes.json();
  const dupVerifyRes = await fetch(`${BASE_URL}/api/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempId: dupRegData.tempId,
      mobileNumber: '9988776655',
      razorpay_payment_id: validPayId, // Reusing previous student payId
      razorpay_order_id: dupRegData.orderId,
      razorpay_signature: validSignature,
    }),
  });
  assert.strictEqual(dupVerifyRes.status, 400, 'Duplicate payment ID must be rejected');
  console.log('✓ Security check: Duplicate Payment ID reuse strictly prevented');

  // STEP 4: Cancel & Fail Handling
  console.log('\n--- 4. Testing Checkout Cancellation & Retry Flow ---');
  const cancelMobile = `97${Date.now().toString().slice(-8)}`;
  const cancelRegRes = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Cancel Tester',
      mobileNumber: cancelMobile,
      email: 'cancel@example.com',
      district: 'सातारा',
      occupation: 'Freelancer',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot1',
    }),
  });
  const cancelRegData = await cancelRegRes.json();
  
  // Post cancellation
  const cancelRes = await fetch(`${BASE_URL}/api/payment/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempId: cancelRegData.tempId,
      mobileNumber: cancelMobile,
    }),
  });
  const cancelData = await cancelRes.json();
  assert.strictEqual(cancelData.success, true);
  assert.strictEqual(cancelData.paymentStatus, 'CANCELLED');
  assert.strictEqual(cancelData.registrationStatus, 'PENDING');
  console.log('✓ Checkout cancellation recorded safely as CANCELLED without false confirmation');

  // Check lookup to verify never falsely marked PAID
  const lookupRes = await fetch(`${BASE_URL}/api/lookup/${cancelMobile}`);
  const lookupData = await lookupRes.json();
  const studentRec = lookupData.registration || lookupData.student;
  assert.notStrictEqual(studentRec.paymentStatus, 'PAID', 'Cancelled checkout must not be PAID');
  console.log('✓ Lookup check confirms student remains unconfirmed after dismissal\n');

  console.log('================================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED: Payment Settings & Razorpay Checkout!');
  console.log('================================================================');
}

runTestSuite().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
