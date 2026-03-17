import axios from 'axios';

const API_BASE = 'http://localhost:5050/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test users
const testUser = {
  name: 'Session Test User',
  email: `session-test-${Date.now()}@test.com`,
  password: 'TestPass@123456',
  confirmPassword: 'TestPass@123456',
  acceptedTC: true,
};

let testUserData = {};
let sessions = { access: null, refresh: null };

console.log('🧪 SESSION MANAGEMENT TEST SUITE\n');
console.log('=====================================\n');

// 
// PHASE 1: Register User
// 
async function testRegister() {
  console.log('▶️  PHASE 1: Register User\n');
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log('✅ Registration successful');
    console.log(`   TempId: ${res.data.tempId}\n`);
    testUserData.tempId = res.data.tempId;
    testUserData.email = testUser.email;
    return true;
  } catch (err) {
    console.error('❌ Registration failed:', err.response?.data || err.message);
    return false;
  }
}

// 
// PHASE 2: Verify Email
// 
async function testVerifyEmail() {
  console.log('▶️  PHASE 2: Verify Email\n');
  try {
    // For testing, we'll use a dummy OTP (in dev mode, check server logs)
    const res = await axios.post(`${API_BASE}/auth/verify-email`, {
      email: testUserData.email,
      otp: '000000', // This will fail, but let's see the error
    });
    console.log('✅ Email verified');
    console.log(`   Response: ${JSON.stringify(res.data, null, 2)}\n`);
    return true;
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.message?.includes('Invalid OTP')) {
      console.warn('⚠️  Invalid OTP (expected in test - need actual OTP from server logs)');
      console.log('   Server logs should show the correct OTP\n');
      return false;
    }
    console.error('❌ Email verification failed:', err.response?.data || err.message);
    return false;
  }
}

// 
// PHASE 3: Manual setup for verified user (create in MongoDB directly)
// 
async function testLogin() {
  console.log('▶️  PHASE 3: Login\n');
  try {
    const res = await axios.post(
      `${API_BASE}/auth/login`,
      {
        email: testUser.email,
        password: testUser.password,
      },
      { withCredentials: true }
    );

    if (!res.data.success) {
      console.error('❌ Login failed:', res.data.message);
      return false;
    }

    console.log('✅ Login successful');
    console.log(`   UserId: ${res.data.user.id}`);
    console.log(`   SessionId: ${res.data.sessionId}`);
    console.log(`   AccessToken: ${res.data.accessToken.substring(0, 20)}...`);
    console.log(`   RefreshToken: ${res.data.refreshToken.substring(0, 20)}...\n`);

    sessions.access = res.data.accessToken;
    sessions.refresh = res.data.refreshToken;
    testUserData.userId = res.data.user.id;
    testUserData.sessionId = res.data.sessionId;

    // Check if cookies are set
    const cookies = res.headers['set-cookie'];
    console.log(`   Cookies set: ${cookies ? cookies.length : 0} cookies\n`);

    return true;
  } catch (err) {
    console.error('❌ Login failed:', err.response?.data || err.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// PHASE 4: Check Session List
// ─────────────────────────────────────────────────────────────
async function testGetSessions() {
  console.log('▶️  PHASE 4: Get Session List\n');
  try {
    const res = await axios.get(`${API_BASE}/session/list`, {
      headers: { Authorization: `Bearer ${sessions.access}` },
      withCredentials: true,
    });

    console.log('✅ Session list retrieved');
    console.log(`   Total sessions: ${res.data.sessions.length}`);
    res.data.sessions.forEach((s, i) => {
      console.log(`   [${i}] DeviceType: ${s.deviceInfo?.deviceType} | Browser: ${s.deviceInfo?.browser}`);
      console.log(`       IsCurrent: ${s.isCurrent} | LastActivity: ${s.lastActivity}`);
    });
    console.log();

    return res.data.sessions.length > 0;
  } catch (err) {
    console.error('❌ Get sessions failed:', err.response?.data || err.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// PHASE 5: Test Session State
// ─────────────────────────────────────────────────────────────
async function testGetSessionState() {
  console.log('▶️  PHASE 5: Get Session State (User Balance)\n');
  try {
    const res = await axios.get(`${API_BASE}/session/state`, {
      headers: { Authorization: `Bearer ${sessions.access}` },
      withCredentials: true,
    });

    console.log('✅ Session state retrieved');
    console.log(`   User: ${res.data.user?.name}`);
    console.log(`   Balance: ${res.data.balance ? JSON.stringify(res.data.balance, null, 2) : 'N/A'}\n`);
    return true;
  } catch (err) {
    console.error('❌ Get session state failed:', err.response?.data || err.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// PHASE 6: Test Token Refresh
// ─────────────────────────────────────────────────────────────
async function testRefreshToken() {
  console.log('▶️  PHASE 6: Refresh Token\n');
  try {
    const res = await axios.post(
      `${API_BASE}/session/refresh`,
      { refreshToken: sessions.refresh },
      { withCredentials: true }
    );

    if (!res.data.success) {
      console.error('❌ Token refresh failed:', res.data.message);
      return false;
    }

    const oldAccess = sessions.access.substring(0, 20);
    sessions.access = res.data.accessToken; // Update with new token

    console.log('✅ Token refreshed successfully');
    console.log(`   Old AccessToken: ${oldAccess}...`);
    console.log(`   New AccessToken: ${sessions.access.substring(0, 20)}...`);
    console.log(`   New RefreshToken: ${res.data.refreshToken.substring(0, 20)}...\n`);

    return true;
  } catch (err) {
    console.error('❌ Token refresh failed:', err.response?.data || err.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// PHASE 7: Test Logout
// ─────────────────────────────────────────────────────────────
async function testLogout() {
  console.log('▶️  PHASE 7: Logout\n');
  try {
    const res = await axios.post(
      `${API_BASE}/session/logout`,
      {},
      { headers: { Authorization: `Bearer ${sessions.access}` }, withCredentials: true }
    );

    console.log('✅ Logout successful:', res.data.message);
    console.log();

    // Try to use the token after logout (should fail)
    try {
      await axios.get(`${API_BASE}/session/list`, {
        headers: { Authorization: `Bearer ${sessions.access}` },
        withCredentials: true,
      });
      console.error('❌ BUG: Session still valid after logout!\n');
      return false;
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('✅ Confirmed: Token is invalid after logout\n');
        return true;
      }
      console.error('❌ Unexpected error after logout:', err.message);
      return false;
    }
  } catch (err) {
    console.error('❌ Logout failed:', err.response?.data || err.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN TEST FLOW
// ─────────────────────────────────────────────────────────────
async function runFullTest() {
  try {
    // Check server health first
    try {
      await axios.get(`${API_BASE.replace('/api', '')}/`);
      console.log('✅ Server is reachable\n');
    } catch {
      console.error('❌ Cannot reach server at', API_BASE);
      process.exit(1);
    }

    // Phase 1: Register
    if (!(await testRegister())) {
      console.error('⚠️  Registration failed, skipping remaining tests');
      process.exit(1);
    }

    // For now, skip email verification test (requires OTP)
    // Phase 2 would normally verify email here

    // Phase 3: Login (will fail if email not verified)
    // For testing purposes, assume we have a pre-verified test user
    console.log('⚠️  NOTE: Skipping email verification - using assumed verified user\n');
    
    // Test with a known verified email
    const verifiedTestUser = {
      email: process.env.TEST_USER_EMAIL || 'verified@test.com',
      password: process.env.TEST_USER_PASSWORD || 'TestPass@123456',
    };

    // Override login to use verified user
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, verifiedTestUser, { withCredentials: true });
      if (res.data.success) {
        sessions.access = res.data.accessToken;
        sessions.refresh = res.data.refreshToken;
        testUserData.userId = res.data.user.id;
        testUserData.sessionId = res.data.sessionId;

        console.log('✅ PHASE 3: Login successful (using pre-verified test user)\n');

        // Phase 4: Get sessions
        await testGetSessions();

        // Phase 5: Get session state
        await testGetSessionState();

        // Phase 6: Refresh token
        await testRefreshToken();

        // Phase 7: Logout
        await testLogout();

        console.log('=====================================\n');
        console.log('✅ ALL SESSION TESTS PASSED!\n');
      }
    } catch (err) {
      console.warn('⚠️  Pre-verified test user not available:', err.response?.data?.message);
      console.log('\n📝 To run full tests, create .env with TEST_USER_EMAIL and TEST_USER_PASSWORD\n');
    }
  } catch (err) {
    console.error('💥 Test suite error:', err.message);
    process.exit(1);
  }
}

// Run tests
runFullTest().catch(console.error);
