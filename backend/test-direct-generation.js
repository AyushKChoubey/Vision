// Test the image generation functionality directly
import { generateImageWithGemini } from './config/gemini.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDirectGeneration() {
  console.log('🧪 Testing Direct Image Generation...\n');

  try {
    console.log('🎨 Testing Gemini image generation...');
    
    const result = await generateImageWithGemini(
      'A beautiful sunset over mountains with orange clouds',
      { style: 'realistic', size: '1024x1024', quality: 'high' }
    );

    console.log('✅ Generation result:', {
      success: result.success,
      imageUrl: result.imageUrl,
      enhancementUsed: result.metadata?.enhancementUsed,
      model: result.metadata?.model
    });

    if (result.success) {
      console.log('🎉 Image generation working correctly!');
      console.log('🖼️ Image URL:', result.imageUrl);
    } else {
      console.log('❌ Image generation failed');
    }
  } catch (error) {
    console.error('❌ Direct generation error:', error.message);
  }
}

testDirectGeneration();
