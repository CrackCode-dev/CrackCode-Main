import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('http://localhost:5051/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'CI Test',
        email: 'cittest+1@example.com',
        password: 'Passw0rd!',
        confirmPassword: 'Passw0rd!',
        acceptedTC: true,
      }),
    });

    console.log('status', res.status);
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
