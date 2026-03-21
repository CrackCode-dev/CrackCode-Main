import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE = 'http://localhost:5051/api';

(async () => {
  try {
    // Generate unique email for each test run
    const uniqueEmail = `citest-${Date.now()}@example.com`;

    console.log('▶️  Testing User Registration\n');
    console.log('📧 Email:', uniqueEmail);
    console.log('🔗 URL:', `${API_BASE}/auth/register\n`);

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'CI Test User',
        email: uniqueEmail,
        password: 'TestPass@123456',
        confirmPassword: 'TestPass@123456',
        acceptedTC: true,
      }),
    });

    console.log(`📊 Status Code: ${res.status}`);

    const text = await res.text();
    
    try {
      const data = JSON.parse(text);
      console.log('✅ Response:', JSON.stringify(data, null, 2));

      if (res.status === 200 || res.status === 201) {
        if (data.success) {
          console.log('\n✅ Registration SUCCESSFUL');
          console.log('   TempId:', data.tempId);
          process.exit(0);
        } else {
          console.log('\n❌ Registration FAILED:', data.message);
          process.exit(1);
        }
      } else {
        console.log('\n❌ Server Error:', data.message || 'Unknown error');
        process.exit(1);
      }
    } catch (parseErr) {
      console.log('❌ Response (raw):', text);
      console.error('Failed to parse JSON:', parseErr.message);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Request failed:', err.message);
    process.exit(1);
  }
})();
