import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for file processing
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} completed`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 413) {
      throw new Error('File too large. Please use a smaller file (max 10MB).');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'An unexpected error occurred.');
  }
);

/**
 * Parse soil report and get recommendations
 * @param {File|null} file - Uploaded file
 * @param {string|null} text - Text input
 * @param {Object} userContext - User context information
 * @returns {Promise<{soilData: Object, recommendations: Object}>}
 */
export async function uploadAndAnalyze(file, text, userContext = {}) {
  try {
    console.log('📋 Starting soil analysis process...');
    
    // Step 1: Parse soil report
    console.log('📊 Parsing soil report...');
    const parseResponse = await parseSoilReport(file, text);
    const soilData = parseResponse.data;
    console.log('✅ Soil parsing completed:', soilData);

    // Step 2: Get recommendations
    console.log('🤖 Generating recommendations...');
    const recommendResponse = await getRecommendations(soilData, userContext);
    const recommendations = recommendResponse.data;
    console.log('✅ Recommendations generated:', recommendations);

    return {
      soilData,
      recommendations
    };
  } catch (error) {
    console.error('❌ Upload and analyze error:', error);
    throw error;
  }
}

/**
 * Parse soil report from file or text
 * @param {File|null} file - Uploaded file
 * @param {string|null} text - Text input
 * @returns {Promise<Object>} - Parsed soil data
 */
export async function parseSoilReport(file, text) {
  const formData = new FormData();
  
  if (file) {
    formData.append('file', file);
    console.log(`📄 Uploading file: ${file.name} (${file.size} bytes)`);
  } else if (text) {
    formData.append('text', text);
    console.log(`📝 Submitting text: ${text.length} characters`);
  } else {
    throw new Error('Either file or text must be provided');
  }

  const response = await api.post('/parse-soil', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to parse soil report');
  }

  return response.data;
}

/**
 * Get farming recommendations based on soil data
 * @param {Object} soilData - Parsed soil data
 * @param {Object} userContext - User context information
 * @returns {Promise<Object>} - Recommendations
 */
export async function getRecommendations(soilData, userContext = {}) {
  console.log('🌾 Requesting recommendations with context:', userContext);
  
  const response = await api.post('/recommend', {
    soilData,
    userContext
  });

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to generate recommendations');
  }

  return response.data;
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} - Health status
 */
export async function healthCheck() {
  const response = await api.get('/health');
  return response.data;
}

export default api;