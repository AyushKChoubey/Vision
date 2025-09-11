// Test the image generation API endpoint directly
import fetch from 'node-fetch';

async function testImageGenerationAPI() {
  console.log('🧪 Testing Image Generation API Endpoint...\n');

  // Test the health endpoint first
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.text();
    console.log('Health response:', healthData);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return;
  }

  // Test the auth endpoint (register a test user)
  try {
    console.log('\n2️⃣ Testing user registration...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      })
    });

    let authToken = null;
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      authToken = registerData.token;
      console.log('✅ User registered successfully');
    } else {
      // Try to login instead
      console.log('Registration failed, trying login...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPassword123!'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        console.log('✅ User logged in successfully');
      } else {
        const loginError = await loginResponse.text();
        console.error('❌ Login failed:', loginError);
        return;
      }
    }

    // Test image generation endpoint
    if (authToken) {
      console.log('\n3️⃣ Testing image generation endpoint...');
      const imageResponse = await fetch('http://localhost:5000/api/creations/generate/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          prompt: 'A beautiful sunset over mountains with orange and pink clouds',
          style: 'realistic',
          size: '1024x1024',
          type: 'image'
        })
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        console.log('✅ Image generation started successfully!');
        console.log('Response:', JSON.stringify(imageData, null, 2));
      } else {
        const errorText = await imageResponse.text();
        console.error('❌ Image generation failed:', imageResponse.status, errorText);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testImageGenerationAPI();
