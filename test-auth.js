const fetch = require('node-fetch');

async function testAuth() {
  try {
    console.log('Testing registration...');
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'testuser', email: 'test@example.com', password: 'password123' })
    });
    const registerData = await registerResponse.json();
    console.log('Register Status:', registerResponse.status);
    console.log('Register Response:', registerData);

    if (registerResponse.ok) {
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      });
      const loginData = await loginResponse.json();
      console.log('Login Status:', loginResponse.status);
      console.log('Login Response:', loginData);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuth();