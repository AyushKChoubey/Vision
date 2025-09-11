import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('GEMINI_API_KEY found:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY preview:', `${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
}
console.log('Current working directory:', process.cwd());
console.log('__dirname equivalent:', import.meta.url);

// Try to list files in current directory
import { readdir } from 'fs/promises';
try {
  const files = await readdir('.');
  console.log('Files in current directory:', files);
  
  // Check if .env exists
  if (files.includes('.env')) {
    console.log('✅ .env file found in current directory');
  } else {
    console.log('❌ .env file NOT found in current directory');
  }
} catch (error) {
  console.error('Error reading directory:', error.message);
}
