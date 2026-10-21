import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING RAZORPAY PAYMENT INTEGRATION TESTS ===\n');

  const runId = Date.now().toString().slice(-6);
  const m1 = `90${runId}01`;
  const m2 = `90${runId}02`;
  const m3 = `90${runId}03`;
  const m6 = `90${runId}06`;
  const m7 = `90${runId}07`;

  // TEST 1: Registration and Successful Payment Webhook (payment_link.paid)
  console.log('--- TEST 1: Registration & Successful Payment Webhook ---');
  const reg1Res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Student One',
      mobileNumber: m1,
      whatsappNumber: m1,
      email: `student1_${runId}@example.com`,
      district: 'पुणे (Pune)',
      occupation: 'Student',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot1',
    }),
  });
  const reg1Data = await reg1Res.json();
  assert.strictEqual(reg1Data.success, true, 'Registration 1 should succeed');
  assert.strictEqual(reg1Data.registrationStatus, 'PENDING', 'Initial registration must be PENDING');
  assert.strictEqual(reg1Data.paymentStatus, 'PENDING', 'Initial payment must be PENDING');
  assert.strictEqual(reg1Data.paymentUrl, 'https://rzp.io/rzp/Wvuh93a', 'Must point to new Razorpay link');
  console.log('✓ Pending registration created successfully with link:', reg1Data.paymentUrl);

  // Send webhook for Student 1
  const payId1 = `pay_test_${Date.now()}_1`;
  const hook1Res = await fetch(`${BASE_URL}/api/payment/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment_link.paid',
      payload: {
        payment_link: {
          entity: {
            id: 'plink_Wvuh93a',
            short_url: 'https://rzp.io/rzp/Wvuh93a',
            amount: 9900,
            amount_paid: 9900,
            currency: 'INR',
            customer: {
              name: 'Test Student One',
              contact: `+91${m1}`,
              email: `student1_${runId}@example.com`,
            },
          },
        },
        payment: {
          entity: {
            id: payId1,
            amount: 9900,
            currency: 'INR',
            status: 'captured',
            contact: `+91${m1}`,
            email: `student1_${runId}@example.com`,
          },
        },
      },
    }),
  });
  const hook1Data = await hook1Res.json();
  assert.strictEqual(hook1Data.status, 'ok', 'Webhook response should be ok');
  assert.ok(hook1Data.registrationId.startsWith('AMG-2026-'), 'Must generate AMG-2026- ID');
  console.log('✓ Webhook verified payment and generated Registration ID:', hook1Data.registrationId);

  // Verify status in lookup API
  const lookup1Res = await fetch(`${BASE_URL}/api/lookup/${m1}`);
  const lookup1Data = await lookup1Res.json();
  assert.strictEqual(lookup1Data.success, true);
  const student1 = lookup1Data.registration || lookup1Data.student;
  assert.strictEqual(student1.paymentStatus, 'PAID');
  assert.strictEqual(student1.registrationStatus, 'CONFIRMED');
  assert.strictEqual(student1.paymentId, payId1);
  console.log('✓ Student 1 lookup confirmed: PAID & CONFIRMED\n');

  // TEST 2: Failed Payment Webhook (payment.failed)
  console.log('--- TEST 2: Failed Payment Webhook ---');
  const reg2Res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Student Two',
      mobileNumber: m2,
      email: `student2_${runId}@example.com`,
      district: 'सातारा (Satara)',
      occupation: 'Job',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot1',
    }),
  });
  const reg2Data = await reg2Res.json();
  assert.strictEqual(reg2Data.success, true);

  const hook2Res = await fetch(`${BASE_URL}/api/payment/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            id: `pay_failed_${Date.now()}`,
            contact: `+91${m2}`,
            error_description: 'Bank server timeout / Insufficient funds',
          },
        },
      },
    }),
  });
  const hook2Data = await hook2Res.json();
  assert.strictEqual(hook2Data.status, 'ok');

  const lookup2Res = await fetch(`${BASE_URL}/api/lookup/${m2}`);
  const lookup2Data = await lookup2Res.json();
  const student2 = lookup2Data.registration || lookup2Data.student;
  assert.strictEqual(student2.paymentStatus, 'FAILED');
  assert.strictEqual(student2.registrationStatus, 'PENDING');
  console.log('✓ Student 2 correctly marked FAILED with reason:', student2.failureReason, '\n');

  // TEST 3: Abandoned Payment
  console.log('--- TEST 3: Abandoned Payment ---');
  const reg3Res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Student Three',
      mobileNumber: m3,
      email: `student3_${runId}@example.com`,
      district: 'नाशिक (Nashik)',
      occupation: 'Freelancer',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot2',
    }),
  });
  const reg3Data = await reg3Res.json();

  const status3Res = await fetch(`${BASE_URL}/api/payment/check-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempId: reg3Data.tempId,
      mobileNumber: m3,
    }),
  });
  const status3Data = await status3Res.json();
  assert.strictEqual(status3Data.paymentStatus, 'PENDING');
  assert.strictEqual(status3Data.registrationStatus, 'PENDING');
  console.log('✓ Abandoned checkout safely remains PENDING without false confirmation\n');

  // TEST 4: Fake Success URL / Query parameters
  console.log('--- TEST 4: Fake Success URL Protection ---');
  const fakeStatusRes = await fetch(`${BASE_URL}/api/payment/check-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempId: reg3Data.tempId,
      mobileNumber: m3,
      razorpay_payment_id: 'pay_fake_hacker_123',
      razorpay_payment_link_status: 'paid', // Fake claim
    }),
  });
  const fakeStatusData = await fakeStatusRes.json();
  assert.notStrictEqual(fakeStatusData.paymentStatus, 'PAID', 'Must NOT mark PAID on fake query param');
  assert.strictEqual(fakeStatusData.paymentStatus, 'PENDING');
  console.log('✓ Fake success URL attempt rejected; status remains:', fakeStatusData.paymentStatus, '\n');

  // TEST 5: Duplicate Webhook Handling
  console.log('--- TEST 5: Duplicate Webhook Idempotency ---');
  const hookDupRes = await fetch(`${BASE_URL}/api/payment/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment_link.paid',
      payload: {
        payment_link: {
          entity: {
            id: 'plink_Wvuh93a',
            amount: 9900,
            currency: 'INR',
            customer: { contact: `+91${m1}` },
          },
        },
        payment: {
          entity: {
            id: payId1,
            amount: 9900,
            currency: 'INR',
            status: 'captured',
            contact: `+91${m1}`,
          },
        },
      },
    }),
  });
  const hookDupData = await hookDupRes.json();
  assert.strictEqual(hookDupData.status, 'already_processed', 'Duplicate webhook must be idempotent');
  console.log('✓ Duplicate webhook correctly handled idempotently:', hookDupData.status, '\n');

  // TEST 6: Wrong Amount or Currency
  console.log('--- TEST 6: Wrong Amount or Currency Rejection ---');
  const reg6Res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Student Six',
      mobileNumber: m6,
      email: `student6_${runId}@example.com`,
      district: 'नागपूर (Nagpur)',
      occupation: 'Job',
      courseDateId: 'cd_2026_09_20',
      selectedSlot: 'slot1',
    }),
  });
  await reg6Res.json();

  // Test underpaid webhook (₹50 instead of ₹99)
  const hookUnderpaidRes = await fetch(`${BASE_URL}/api/payment/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment_link.paid',
      payload: {
        payment_link: {
          entity: {
            id: 'plink_Wvuh93a',
            amount: 5000, // ₹50
            currency: 'INR',
            customer: { contact: `+91${m6}` },
          },
        },
        payment: {
          entity: {
            id: `pay_underpaid_${Date.now()}`,
            amount: 5000,
            currency: 'INR',
            contact: `+91${m6}`,
          },
        },
      },
    }),
  });
  assert.strictEqual(hookUnderpaidRes.status, 400, 'Underpaid webhook must return HTTP 400');
  const hookUnderpaidData = await hookUnderpaidRes.json();
  assert.strictEqual(hookUnderpaidData.status, 'underpaid');
  console.log('✓ Underpaid transaction rejected with status:', hookUnderpaidData.status, '\n');

  // TEST 7: Delayed Webhook Reconciles Correct Registration
  console.log('--- TEST 7: Delayed Webhook Reconciliation ---');
  const reg7Res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Student Seven',
      mobileNumber: m7,
      email: `student7_${runId}@example.com`,
      district: 'कोल्हापूर (Kolhapur)',
      occupation: 'Business Owner',
      courseDateId: 'cd_2026_09_27',
      selectedSlot: 'slot2',
    }),
  });
  const reg7Data = await reg7Res.json();
  assert.strictEqual(reg7Data.paymentStatus, 'PENDING');

  // Delayed webhook arrives minutes/hours later
  const payId7 = `pay_delayed_${Date.now()}`;
  const hook7Res = await fetch(`${BASE_URL}/api/payment/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'payment_link.paid',
      payload: {
        payment_link: {
          entity: {
            id: 'plink_Wvuh93a',
            amount: 9900,
            currency: 'INR',
            customer: {
              name: 'Test Student Seven',
              contact: `+91${m7}`,
              email: `student7_${runId}@example.com`,
            },
          },
        },
        payment: {
          entity: {
            id: payId7,
            amount: 9900,
            currency: 'INR',
            status: 'captured',
            contact: `+91${m7}`,
          },
        },
      },
    }),
  });
  const hook7Data = await hook7Res.json();
  assert.strictEqual(hook7Data.status, 'ok');

  const lookup7Res = await fetch(`${BASE_URL}/api/lookup/${m7}`);
  const lookup7Data = await lookup7Res.json();
  const student7 = lookup7Data.registration || lookup7Data.student;
  assert.strictEqual(student7.paymentStatus, 'PAID');
  assert.strictEqual(student7.registrationStatus, 'CONFIRMED');
  assert.strictEqual(student7.paymentId, payId7);
  console.log('✓ Delayed webhook safely reconciled and confirmed registration ID:', student7.id);

  console.log('\n=== ALL 7 PAYMENT INTEGRATION TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
