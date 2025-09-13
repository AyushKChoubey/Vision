// Test the image generation with polling
import fetch from 'node-fetch';

async function testFullFlow() {
  console.log('🧪 Testing Full Image Generation Flow...\n');

  let authToken = null;

  // Step 1: Login
  try {
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123!'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      console.log('✅ Login successful');
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return;
  }

  // Step 2: Generate image
  let creationId = null;
  try {
    console.log('\n2️⃣ Starting image generation...');
    const imageResponse = await fetch('http://localhost:5000/api/creations/generate/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        prompt: 'A beautiful sunset over mountains with orange clouds',
        style: 'realistic',
        size: '1024x1024',
        type: 'image'
      })
    });

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      creationId = imageData.data.creation._id;
      console.log('✅ Image generation started, ID:', creationId);
    } else {
      const errorText = await imageResponse.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
    return;
  }

  // Step 3: Poll for completion
  if (creationId) {
    console.log('\n3️⃣ Polling for completion...');
    for (let attempt = 1; attempt <= 20; attempt++) {
      try {
        console.log(`📡 Poll attempt ${attempt}/20...`);
        
        const pollResponse = await fetch(`http://localhost:5000/api/creations/${creationId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (pollResponse.ok) {
          const pollData = await pollResponse.json();
          const creation = pollData.data.creation;
          
          console.log(`📊 Status: ${creation.status}`);
          
          if (creation.status === 'completed') {
            console.log('🎉 SUCCESS! Image generated!');
            console.log('🖼️ Image URL:', creation.fileUrl);
            console.log('⏱️ Generation time:', creation.generationTime, 'seconds');
            return;
          } else if (creation.status === 'failed') {
            console.log('❌ Generation failed:', creation.error);
            return;
          }
        }

        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('❌ Polling error:', error.message);
      }
    }
    
    console.log('⏰ Polling timeout - generation took too long');
  }
}

testFullFlow();
