// Simple test to verify image generation functionality
import { generateImageWithGemini, testGeminiConnection } from './config/gemini.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testImageGenerationFlow() {
  console.log('🧪 Testing Image Generation Flow...\n');

  // Test 1: Check Gemini connection
  console.log('1️⃣ Testing Gemini Connection...');
  const connectionTest = await testGeminiConnection();
  console.log('Connection result:', connectionTest);
  
  if (!connectionTest.success) {
    console.log('❌ Gemini connection failed. Proceeding with basic enhancement...\n');
  } else {
    console.log('✅ Gemini connection successful!\n');
  }

  // Test 2: Test image generation
  console.log('2️⃣ Testing Image Generation...');
  try {
    const testPrompt = 'A beautiful sunset over mountains with orange and pink clouds';
    const options = {
      style: 'realistic',
      size: '1024x1024',
      quality: 'high'
    };

    console.log('📝 Test prompt:', testPrompt);
    console.log('🎨 Options:', options);
    
    const result = await generateImageWithGemini(testPrompt, options);
    
    console.log('\n🎉 Image generation successful!');
    console.log('📊 Result summary:');
    console.log('- Success:', result.success);
    console.log('- Image URL:', result.imageUrl);
    console.log('- Enhanced Prompt:', result.enhancedPrompt);
    console.log('- Enhancement Method:', result.metadata.enhancementUsed);
    console.log('- Model Used:', result.metadata.model);
    
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
  }
}

// Run the test
testImageGenerationFlow().catch(console.error);
