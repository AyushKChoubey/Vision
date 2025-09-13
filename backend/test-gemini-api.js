import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Key...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key found:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No API key found');
  
  if (!apiKey) {
    console.error('❌ No GEMINI_API_KEY found in environment variables');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names for Gemini Pro
    const modelNames = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'models/gemini-pro'];
    
    console.log('📡 Attempting to connect to Gemini API...');
    
    for (const modelName of modelNames) {
      try {
        console.log(`🔍 Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = "Say 'Hello, API is working!'";
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        console.log(`✅ Success with ${modelName}! Gemini API responded:`, response);
        console.log('🎉 Your API key is valid and working!');
        console.log(`💡 Use this model name: ${modelName}`);
        return; // Exit on first success
      } catch (modelError) {
        console.log(`❌ Failed with ${modelName}:`, modelError.message);
      }
    }
    
    throw new Error('All model names failed');
    
  } catch (error) {
    console.error('❌ Error testing Gemini API:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code || 'Unknown');
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if your API key is correct');
      console.log('2. Make sure the API key has the right permissions');
      console.log('3. Verify the API key is enabled for Gemini Pro');
      console.log('4. Check if billing is enabled for your Google Cloud project');
    }
  }
}

testGeminiAPI();
