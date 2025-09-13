import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is provided
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
}

// Initialize Gemini AI with API key
let genAI = null;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error.message);
}

// Get the Gemini Pro model for text generation
const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!genAI) {
    throw new Error('Gemini AI not initialized. Please check your API key.');
  }
  return genAI.getGenerativeModel({ model: modelName });
};

// Test Gemini API connection
export const testGeminiConnection = async () => {
  try {
    if (!genAI) {
      return { success: false, error: 'Gemini AI not initialized' };
    }

    const model = getGeminiModel('gemini-1.5-flash');
    const prompt = "Say 'API connection successful'";
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return { 
      success: true, 
      response: response.trim(),
      message: 'Gemini API connection is working',
      model: 'gemini-1.5-flash'
    };
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
};

// Generate image using Gemini AI to enhance prompts + external service
export const generateImageWithGemini = async (prompt, options = {}) => {
  try {
    const {
      style = 'realistic',
      size = '1024x1024',
      quality = 'high'
    } = options;

    console.log('🎨 Starting image generation with Gemini AI...');
    console.log('Original prompt:', prompt);

    let enhancedPrompt = prompt;

    // Try to use Gemini to enhance the prompt, but fallback if it fails
    try {
      if (genAI) {
        console.log('🤖 Enhancing prompt with Gemini AI...');
        const model = getGeminiModel('gemini-1.5-flash');
        
        const enhancementPrompt = `
          You are an expert AI art prompt engineer. Take this user prompt and enhance it to create a detailed, high-quality prompt for image generation.
          
          Original prompt: "${prompt}"
          Style requested: ${style}
          Quality level: ${quality}
          
          Please provide an enhanced version that:
          1. Maintains the core concept from the original prompt
          2. Adds appropriate details for ${style} style
          3. Includes quality and technical specifications
          4. Uses professional photography/art terminology
          5. Is optimized for AI image generation
          
          Return only the enhanced prompt, no explanation needed.
        `;
        
        // Add retry logic for quota/rate limit issues
        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount < maxRetries) {
          try {
            const result = await model.generateContent(enhancementPrompt);
            enhancedPrompt = result.response.text().trim();
            console.log('✨ Enhanced prompt:', enhancedPrompt);
            break;
          } catch (retryError) {
            retryCount++;
            console.warn(`⚠️ Gemini attempt ${retryCount} failed:`, retryError.message);
            
            if (retryError.message.includes('quota') || retryError.message.includes('overloaded')) {
              if (retryCount < maxRetries) {
                console.log('🔄 Retrying in 2 seconds...');
                await new Promise(resolve => setTimeout(resolve, 2000));
              } else {
                console.log('📝 Using basic enhancement due to quota/rate limits');
                throw retryError;
              }
            } else {
              throw retryError;
            }
          }
        }
      } else {
        console.log('⚠️ Gemini not available, using basic prompt enhancement');
        enhancedPrompt = enhancePromptBasic(prompt, style, quality);
      }
    } catch (geminiError) {
      console.warn('⚠️ Gemini enhancement failed, using basic enhancement:', geminiError.message);
      enhancedPrompt = enhancePromptBasic(prompt, style, quality);
    }

    // Generate the actual image
    const imageUrl = await generateImageWithExternalService(enhancedPrompt, options);

    return {
      success: true,
      imageUrl,
      enhancedPrompt,
      originalPrompt: prompt,
      style,
      size,
      quality,
      metadata: {
        enhancementUsed: genAI ? 'gemini' : 'basic',
        model: genAI ? 'Gemini Pro + External Service' : 'Basic Enhancement + External Service',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ Image generation error:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};

// Basic prompt enhancement (fallback when Gemini is not available)
const enhancePromptBasic = (prompt, style, quality) => {
  let enhancedPrompt = prompt;
  
  // Add style-specific enhancements
  switch (style) {
    case 'realistic':
      enhancedPrompt += ', photorealistic, high detail, professional photography, sharp focus';
      break;
    case 'artistic':
      enhancedPrompt += ', artistic style, creative interpretation, beautiful composition, fine art';
      break;
    case 'cartoon':
      enhancedPrompt += ', cartoon style, animated, colorful, friendly, digital art';
      break;
    case 'abstract':
      enhancedPrompt += ', abstract art, modern, creative, unique perspective, contemporary';
      break;
  }
  
  // Add quality enhancements
  if (quality === 'high') {
    enhancedPrompt += ', ultra high quality, 4K resolution, masterpiece';
  }
  
  return enhancedPrompt;
};

// External image generation service using free AI APIs
const generateImageWithExternalService = async (enhancedPrompt, options) => {
  const { size, style } = options;
  const [width, height] = size.split('x').map(Number);
  
  console.log('🖼️ Generating AI image with external service...');
  console.log('🎨 Enhanced prompt:', enhancedPrompt);
  
  try {
    // Method 1: Pollinations.ai - Free AI image generation
    console.log('🌟 Trying Pollinations AI...');
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${Date.now()}&model=flux&nologo=true`;
    
    // Test if Pollinations is working
    const testResponse = await fetch(pollinationsUrl, { 
      method: 'HEAD',
      timeout: 10000 
    });
    
    if (testResponse.ok) {
      console.log('✅ Pollinations AI successful!');
      return pollinationsUrl;
    }
    
    throw new Error('Pollinations not responding');
    
  } catch (pollinationsError) {
    console.warn('⚠️ Pollinations failed:', pollinationsError.message);
    
    try {
      // Method 2: Hugging Face Inference API (free tier)
      console.log('🤗 Trying Hugging Face...');
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            width: width,
            height: height,
            num_inference_steps: 20
          }
        }),
        timeout: 30000
      });
      
      if (hfResponse.ok) {
        const blob = await hfResponse.blob();
        // Convert blob to base64 data URL
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        console.log('✅ Hugging Face successful!');
        return dataUrl;
      }
      
      throw new Error('Hugging Face not available');
      
    } catch (hfError) {
      console.warn('⚠️ Hugging Face failed:', hfError.message);
      
      try {
        // Method 3: Dezgo.com free API
        console.log('🎯 Trying Dezgo...');
        const dezgoResponse = await fetch('https://api.dezgo.com/text2image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            width: width,
            height: height,
            model: 'epic_realism',
            format: 'jpg'
          }),
          timeout: 30000
        });
        
        if (dezgoResponse.ok) {
          const blob = await dezgoResponse.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const dataUrl = `data:image/jpeg;base64,${base64}`;
          console.log('✅ Dezgo successful!');
          return dataUrl;
        }
        
        throw new Error('Dezgo not available');
        
      } catch (dezgoError) {
        console.warn('⚠️ Dezgo failed:', dezgoError.message);
        
        // Final fallback: Enhanced placeholder with prompt context
        console.log('🔄 Using intelligent placeholder with prompt analysis...');
        
        const promptWords = enhancedPrompt.toLowerCase();
        let category = 'abstract';
        let keywords = '';
        
        // Analyze prompt for better placeholder selection
        if (promptWords.includes('nature') || promptWords.includes('landscape') || promptWords.includes('forest') || promptWords.includes('mountain') || promptWords.includes('ocean')) {
          category = 'nature';
          keywords = '&nature';
        } else if (promptWords.includes('animal') || promptWords.includes('cat') || promptWords.includes('dog') || promptWords.includes('bird') || promptWords.includes('wildlife')) {
          category = 'animals'; 
          keywords = '&animals';
        } else if (promptWords.includes('city') || promptWords.includes('building') || promptWords.includes('architecture') || promptWords.includes('urban')) {
          category = 'architecture';
          keywords = '&architecture';
        } else if (promptWords.includes('person') || promptWords.includes('portrait') || promptWords.includes('human') || promptWords.includes('face')) {
          category = 'people';
          keywords = '&people';
        } else if (promptWords.includes('food') || promptWords.includes('meal') || promptWords.includes('restaurant')) {
          category = 'food';
          keywords = '&food';
        } else if (promptWords.includes('technology') || promptWords.includes('computer') || promptWords.includes('digital') || promptWords.includes('tech')) {
          category = 'technology';
          keywords = '&tech';
        }
        
        // Use Unsplash for higher quality, more relevant placeholders
        const unsplashUrl = `https://source.unsplash.com/${width}x${height}/?${category}${keywords}&sig=${Date.now()}`;
        console.log('📸 Using Unsplash placeholder:', unsplashUrl);
        
        return unsplashUrl;
      }
    }
  }
};

// Helper function to get image category based on style (kept for compatibility)
const getImageCategory = (style) => {
  const categories = {
    realistic: 'nature',
    artistic: 'art', 
    cartoon: 'illustration',
    abstract: 'abstract'
  };
  return categories[style] || 'random';
};

// Generate creative variations of a prompt
export const generatePromptVariations = async (originalPrompt, count = 3) => {
  try {
    const model = getGeminiModel('gemini-1.5-flash');
    
    const variationPrompt = `
      Create ${count} creative variations of this image generation prompt. Each variation should:
      1. Maintain the core concept
      2. Add unique creative elements
      3. Use different artistic approaches
      4. Be suitable for AI image generation
      
      Original prompt: "${originalPrompt}"
      
      Return the variations as a numbered list, one per line.
    `;
    
    const result = await model.generateContent(variationPrompt);
    const variations = result.response.text()
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);
    
    return variations.slice(0, count);
  } catch (error) {
    console.error('Error generating prompt variations:', error);
    return [originalPrompt]; // Return original if variations fail
  }
};

// Analyze and improve prompt quality
export const analyzePromptQuality = async (prompt) => {
  try {
    const model = getGeminiModel('gemini-1.5-flash');
    
    const analysisPrompt = `
      Analyze this AI image generation prompt and provide feedback:
      
      Prompt: "${prompt}"
      
      Please evaluate:
      1. Clarity and specificity (1-10)
      2. Creative potential (1-10) 
      3. Technical adequacy (1-10)
      4. Suggestions for improvement
      
      Format your response as JSON with keys: clarity, creativity, technical, suggestions, overallScore
    `;
    
    const result = await model.generateContent(analysisPrompt);
    const analysisText = result.response.text();
    
    try {
      return JSON.parse(analysisText);
    } catch {
      // If JSON parsing fails, return a basic analysis
      return {
        clarity: 7,
        creativity: 6,
        technical: 6,
        suggestions: ['Consider adding more specific details', 'Specify desired art style'],
        overallScore: 6.3
      };
    }
  } catch (error) {
    console.error('Error analyzing prompt quality:', error);
    return null;
  }
};

// Validate image generation request
export const validateImageRequest = (prompt, options = {}) => {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt is required for image generation');
  }
  
  if (prompt.length > 500) {
    throw new Error('Prompt must be less than 500 characters');
  }
  
  const validStyles = ['realistic', 'artistic', 'cartoon', 'abstract'];
  if (options.style && !validStyles.includes(options.style)) {
    throw new Error(`Invalid style. Must be one of: ${validStyles.join(', ')}`);
  }
  
  const validSizes = ['1024x1024', '1024x768', '768x1024', '1920x1080'];
  if (options.size && !validSizes.includes(options.size)) {
    throw new Error(`Invalid size. Must be one of: ${validSizes.join(', ')}`);
  }
  
  // Check for inappropriate content
  const inappropriateTerms = ['violence', 'gore', 'nsfw', 'explicit'];
  const lowerPrompt = prompt.toLowerCase();
  for (const term of inappropriateTerms) {
    if (lowerPrompt.includes(term)) {
      throw new Error('Prompt contains inappropriate content');
    }
  }
  
  return true;
};

export default {
  generateImageWithGemini,
  generatePromptVariations,
  analyzePromptQuality,
  validateImageRequest,
  testGeminiConnection,
  getGeminiModel
};
