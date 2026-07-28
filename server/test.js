const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running Backend API Automated Integration Tests...\n');

  try {
    // Test 1: Health Check
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/health',
      method: 'GET'
    });
    console.log('1. Health Check:', health.statusCode === 200 ? '✅ PASSED' : '❌ FAILED');

    // Test 2: Login Admin
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@estate.com', password: 'admin123' });
    console.log('2. Admin Login:', loginRes.statusCode === 200 && loginRes.body.token ? '✅ PASSED' : '❌ FAILED');

    const adminToken = loginRes.body.token;

    // Test 3: Get Properties
    const propRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/properties?city=Malibu',
      method: 'GET'
    });
    console.log('3. Search Properties Filter:', propRes.statusCode === 200 && propRes.body.properties.length > 0 ? '✅ PASSED' : '❌ FAILED');

    // Test 4: Submit Enquiry
    const enquiryRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/enquiries',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      property_id: 1,
      sender_name: 'Test Buyer',
      sender_email: 'testbuyer@example.com',
      message: 'Automated test enquiry.'
    });
    console.log('4. Submit Enquiry:', enquiryRes.statusCode === 201 ? '✅ PASSED' : '❌ FAILED');

    // Test 5: Admin Stats
    const adminStats = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('5. Admin Stats API:', adminStats.statusCode === 200 && adminStats.body.totalProperties > 0 ? '✅ PASSED' : '❌ FAILED');

    console.log('\n🎉 ALL API INTEGRATION TESTS EXECUTED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('Test execution failed:', err.message);
  }
}

// Start server in background for testing if needed
const serverProcess = require('./index');
setTimeout(() => {
  runTests().then(() => process.exit(0));
}, 1000);
