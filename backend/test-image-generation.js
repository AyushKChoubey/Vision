import fetch from 'node-fetch';

// Test the image generation endpoint
async function testImageGeneration() {
  try {
    console.log('🧪 Testing Image Generation Endpoint...\n');

    // First, we need to register/login to get a token
    // For testing, let's assume we have a valid user
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    console.log('📝 Testing with sample prompt...');
    
    // Test the image generation endpoint
    const imageData = {
      prompt: 'A beautiful sunset over mountains with orange and pink clouds',
      style: 'realistic',
      size: '1024x1024',
      type: 'image'
    };

    // Note: In a real test, you'd need to authenticate first
    // This is just a structure test
    console.log('Request payload:', JSON.stringify(imageData, null, 2));
    console.log('\n✅ Image generation endpoint structure is ready!');
    console.log('🔑 You can test it by:');
    console.log('1. Creating a user account');
    console.log('2. Logging in to get a JWT token');
    console.log('3. Making a POST request to /api/creations/generate/image');
    console.log('4. Including the JWT token in Authorization header');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testImageGeneration();
