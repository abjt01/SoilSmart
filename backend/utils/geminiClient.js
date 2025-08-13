const axios = require('axios');

const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  maxTokens: 2048,
  temperature: 0.1
};

/**
 * Make API call to Google Gemini
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - Gemini response
 */
async function callGemini(prompt) {
  if (!GEMINI_CONFIG.apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: GEMINI_CONFIG.temperature,
        maxOutputTokens: GEMINI_CONFIG.maxTokens,
        topP: 0.8,
        topK: 10
      }
    };

    console.log('🤖 Calling Gemini AI...');
    
    const response = await axios.post(
      `${GEMINI_CONFIG.baseUrl}?key=${GEMINI_CONFIG.apiKey}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini AI response received');
    return text.trim();

  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 400) {
        throw new Error(`Gemini API Bad Request: ${errorData.error?.message || 'Invalid request'}`);
      } else if (status === 401) {
        throw new Error('Gemini API: Invalid API key');
      } else if (status === 403) {
        throw new Error('Gemini API: Access forbidden - check API key permissions');
      } else if (status === 429) {
        throw new Error('Gemini API: Rate limit exceeded - please try again later');
      } else if (status === 500) {
        throw new Error('Gemini API: Internal server error - please try again');
      } else {
        throw new Error(`Gemini API Error: ${status} - ${errorData.error?.message || 'Unknown error'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Gemini API: Request timeout - please try again');
    } else {
      throw new Error(`Gemini API: ${error.message}`);
    }
  }
}

/**
 * Parse soil report text using Gemini AI with enhanced prompts
 * @param {string} soilReportText - Raw soil report text
 * @returns {Promise<Object>} - Parsed soil data
 */
async function parseSoilReport(soilReportText) {
  const prompt = `You are a soil analysis expert specializing in Indian agricultural practices. Parse the following soil report text and extract key information.

CRITICAL INSTRUCTIONS:
- Output MUST be valid JSON only — no surrounding text, explanations, or markdown
- Extract EXACT numbers from the text - DO NOT multiply or scale values
- If input says "pH: 6.2", output exactly 6.2
- If input says "Nitrogen: 25 ppm", output exactly 25
- If input says "Organic Matter: 3.5%", output exactly 3.5
- Handle different units: ppm, mg/kg, kg/ha, % (convert appropriately)
- Use reasonable defaults ONLY if values are completely missing
- Consider Indian soil conditions and typical ranges

Required JSON Schema:
{
  "soilHealthScore": number (0-100, calculated based on all parameters),
  "phLevel": number (0-14, exact value from report),
  "organicMatter": number (percentage, exact value from report),
  "nitrogen": number (ppm or mg/kg, exact value from report),
  "phosphorus": number (ppm or mg/kg, exact value from report),  
  "potassium": number (ppm or mg/kg, exact value from report),
  "soilTexture": "Clay|Loam|Sand|Silt|Mixed",
  "moistureLevel": "Low|Medium|High",
  "recommendations": ["string array of 3-5 specific recommendations"]
}

Indian Context Guidelines:
- Typical Indian soil pH range: 4.5-8.5
- Organic matter typically: 0.5-4.0%
- Nitrogen (available): 150-500 kg/ha or equivalent ppm
- Phosphorus (available): 10-50 ppm
- Potassium (available): 100-300 ppm

Few-shot Examples:

Example 1:
Input: "Soil pH: 6.8, Organic Matter: 3.2%, Available N: 280 kg/ha, Available P: 18 ppm, Available K: 165 ppm, Sandy Loam, Good drainage"
Output: {"soilHealthScore": 78, "phLevel": 6.8, "organicMatter": 3.2, "nitrogen": 280, "phosphorus": 18, "potassium": 165, "soilTexture": "Loam", "moistureLevel": "Medium", "recommendations": ["Maintain current pH levels", "Continue organic matter management", "Apply balanced NPK fertilizer", "Monitor soil moisture regularly"]}

Example 2:
Input: "pH level 5.2, low organic content 1.8%, N: 15 ppm, P: 8 ppm, K: 85 ppm, heavy clay soil, waterlogged conditions"
Output: {"soilHealthScore": 42, "phLevel": 5.2, "organicMatter": 1.8, "nitrogen": 15, "phosphorus": 8, "potassium": 85, "soilTexture": "Clay", "moistureLevel": "High", "recommendations": ["Apply lime to increase pH to 6.0-6.5", "Improve drainage with furrows", "Add 3-5 tons organic matter per hectare", "Apply nitrogen and phosphorus fertilizers", "Consider raised bed cultivation"]}

Example 3:
Input: "pH: 7.2, OM: 2.5%, Nitrogen: 220 mg/kg, Phosphorus: 12 mg/kg, Potassium: 145 mg/kg, Loamy sand"
Output: {"soilHealthScore": 65, "phLevel": 7.2, "organicMatter": 2.5, "nitrogen": 220, "phosphorus": 12, "potassium": 145, "soilTexture": "Sand", "moistureLevel": "Medium", "recommendations": ["pH is optimal for most crops", "Increase organic matter to 3-4%", "Add compost to improve water retention", "Apply potassium fertilizer before planting"]}

Soil Report Text:
${soilReportText}

JSON Output:`;

  const response = await callGemini(prompt);
  
  try {
    // Clean response - remove any markdown formatting and extract JSON
    let cleanResponse = response.replace(/``````/g, '').trim();
    
    // Try to extract JSON object if there's extra text
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    const parsedData = JSON.parse(cleanResponse);
    
    // Validate the response structure
    if (!parsedData.soilHealthScore || !parsedData.phLevel || !parsedData.organicMatter) {
      throw new Error('Incomplete data structure from Gemini');
    }
    
    return parsedData;
    
  } catch (parseError) {
    console.error('❌ JSON Parse Error:', parseError.message);
    console.error('Raw Gemini Response:', response);
    throw new Error(`Invalid JSON response from Gemini: ${parseError.message}`);
  }
}

/**
 * Generate farming recommendations using Gemini AI with Indian context
 * @param {Object} soilData - Parsed soil data
 * @param {Object} userContext - User context (location, budget, etc.)
 * @returns {Promise<Object>} - Farming recommendations
 */
async function generateRecommendations(soilData, userContext) {
  const prompt = `You are an agricultural expert specializing in Indian farming practices. Based on the soil analysis and user context, provide comprehensive farming recommendations.

CRITICAL INSTRUCTIONS:
- Output MUST be valid JSON only — no surrounding text, explanations, or markdown
- Follow the exact schema provided below
- ALL COSTS MUST BE IN INDIAN RUPEES (₹) per hectare
- Consider Indian climate, seasons (Kharif/Rabi), and market conditions
- Provide practical, actionable recommendations for Indian farmers
- Fertilizer costs should be realistic: ₹2,000-₹8,000 per hectare typically

Required JSON Schema:
{
  "cropSuggestions": [
    {
      "cropName": "string",
      "suitabilityScore": number (0-100),
      "expectedYield": "string with units per hectare",
      "growthPeriod": "string duration"
    }
  ],
  "fertilizers": [
    {
      "name": "string",
      "quantity": "string with units per hectare",
      "cost": number (INR per hectare - between 1500-8000),
      "application": "string instructions"
    }
  ],
  "soilImprovements": ["string array of specific improvements"],
  "irrigationAdvice": "string with specific guidance",
  "totalBudgetEstimate": number (total INR for 1 hectare including all costs)
}

Indian Agricultural Context:
- Consider monsoon patterns and seasonal cropping
- Use Indian crop varieties and market prices
- Include traditional and modern farming practices
- Account for small farmer constraints (budget, land size)

Fertilizer Cost Guidelines (INR per hectare):
- Urea: ₹2,500-4,000
- DAP: ₹2,000-3,500  
- Potash: ₹1,800-3,000
- Organic compost: ₹3,000-5,000
- Micronutrients: ₹800-1,500

Crop Examples for Indian Context:
- Rice: 4-6 tons/ha, Kharif season
- Wheat: 3.5-4.5 tons/ha, Rabi season
- Cotton: 15-20 quintals/ha, Kharif season
- Tomatoes: 25-35 tons/ha, Rabi/Summer
- Sugarcane: 70-90 tons/ha, Annual

Few-shot Examples:

Example 1:
Soil: {"soilHealthScore": 85, "phLevel": 6.5, "organicMatter": 4.2, "nitrogen": 280, "phosphorus": 18, "potassium": 180, "soilTexture": "Loam"}
Context: {"location": "Karnataka", "budget": 50000, "cropPreference": "vegetables"}
Output: {"cropSuggestions": [{"cropName": "Tomatoes", "suitabilityScore": 92, "expectedYield": "28-35 tons/ha", "growthPeriod": "90-110 days"}, {"cropName": "Onions", "suitabilityScore": 88, "expectedYield": "25-30 tons/ha", "growthPeriod": "120-140 days"}], "fertilizers": [{"name": "NPK 19-19-19", "quantity": "200 kg/ha", "cost": 3200, "application": "Apply 1/3 at planting, 1/3 at 30 days, 1/3 at flowering"}, {"name": "Vermicompost", "quantity": "2 tons/ha", "cost": 4500, "application": "Apply 2 weeks before planting and mix with soil"}], "soilImprovements": ["Maintain current organic matter levels", "Install drip irrigation system", "Apply zinc sulphate 25 kg/ha"], "irrigationAdvice": "Use drip irrigation for water efficiency. Water every 2-3 days during vegetative growth, reduce during fruiting. Maintain soil moisture at 70-80% field capacity.", "totalBudgetEstimate": 42000}

Example 2:
Soil: {"soilHealthScore": 55, "phLevel": 5.8, "organicMatter": 2.1, "nitrogen": 150, "phosphorus": 8, "potassium": 95, "soilTexture": "Clay"}
Context: {"location": "Punjab", "budget": 35000, "cropPreference": "grains"}
Output: {"cropSuggestions": [{"cropName": "Rice", "suitabilityScore": 78, "expectedYield": "4.5-5.5 tons/ha", "growthPeriod": "120-140 days"}, {"cropName": "Wheat", "suitabilityScore": 72, "expectedYield": "3.8-4.2 tons/ha", "growthPeriod": "110-130 days"}], "fertilizers": [{"name": "Urea", "quantity": "130 kg/ha", "cost": 3400, "application": "Apply in 3 splits: 1/3 at transplanting, 1/3 at tillering, 1/3 at panicle initiation"}, {"name": "DAP", "quantity": "100 kg/ha", "cost": 2800, "application": "Apply full dose as basal before transplanting"}, {"name": "Muriate of Potash", "quantity": "70 kg/ha", "cost": 2200, "application": "Apply half at transplanting, half at panicle initiation"}], "soilImprovements": ["Apply lime 1.5 tons/ha to increase pH", "Add 4 tons/ha farm yard manure", "Improve drainage with proper bunding"], "irrigationAdvice": "For rice: Maintain 2-5 cm standing water. For wheat: Irrigate at crown root initiation, tillering, jointing, flowering and grain filling stages.", "totalBudgetEstimate": 28500}

Soil Data:
${JSON.stringify(soilData)}

User Context:
${JSON.stringify(userContext)}

JSON Output:`;

  const response = await callGemini(prompt);
  
  try {
    // Clean response - remove any markdown formatting and extract JSON
    let cleanResponse = response.replace(/``````/g, '').trim();
    
    // Try to extract JSON object if there's extra text
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    const parsedData = JSON.parse(cleanResponse);
    
    // Validate the response structure
    if (!parsedData.cropSuggestions || !parsedData.fertilizers || !parsedData.totalBudgetEstimate) {
      throw new Error('Incomplete recommendation structure from Gemini');
    }
    
    // Ensure all costs are in reasonable INR range
    parsedData.fertilizers.forEach(fertilizer => {
      if (fertilizer.cost > 50000) { // If cost seems too high (converted from USD)
        fertilizer.cost = Math.round(fertilizer.cost / 10); // Adjust to reasonable INR
      }
      if (fertilizer.cost < 500) { // If cost seems too low
        fertilizer.cost = fertilizer.cost * 50; // Scale up to reasonable INR
      }
    });
    
    return parsedData;
    
  } catch (parseError) {
    console.error('❌ JSON Parse Error:', parseError.message);
    console.error('Raw Gemini Response:', response);
    throw new Error(`Invalid JSON response from Gemini: ${parseError.message}`);
  }
}

module.exports = {
  parseSoilReport,
  generateRecommendations,
  callGemini
};
