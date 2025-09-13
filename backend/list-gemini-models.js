import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function listAvailableModels() {
  console.log('🔍 Listing available Gemini models...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No GEMINI_API_KEY found in environment variables');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await response.json();
    
    if (data.models) {
      console.log('✅ Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`);
        if (model.supportedGenerationMethods) {
          console.log(`  Supports: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      console.log('❌ Could not fetch models:', data);
    }
    
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
  }
}

listAvailableModels();
