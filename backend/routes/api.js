const express = require('express');
const multer = require('multer');
const { processFile } = require('../utils/fileProcessor');
const { parseSoilReport, generateRecommendations } = require('../utils/geminiClient');
const { fallbackParsing, fallbackRecommendations } = require('../utils/fallbackLogic');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, JPG, and TXT files are allowed.'));
    }
  }
});

// POST /api/parse-soil - Fixed route definition
router.post('/parse-soil', upload.single('file'), async (req, res) => {
  try {
    let extractedText = '';

    if (req.file) {
      // Process uploaded file
      extractedText = await processFile(req.file);
    } else if (req.body.text) {
      // Use provided text directly
      extractedText = req.body.text;
    } else {
      return res.status(400).json({ error: 'No file or text provided' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the file' });
    }

    let parsedResult;
    
    try {
      // Try Gemini parsing first
      parsedResult = await parseSoilReport(extractedText);
    } catch (geminiError) {
      console.warn('Gemini parsing failed, using fallback:', geminiError.message);
      // Use fallback parsing
      parsedResult = fallbackParsing(extractedText);
    }

    res.json({
      success: true,
      data: parsedResult,
      extractedText: extractedText.substring(0, 500) + '...' // First 500 chars for reference
    });

  } catch (error) {
    console.error('Parse soil error:', error);
    res.status(500).json({ 
      error: 'Failed to parse soil report', 
      message: error.message 
    });
  }
});

// POST /api/recommend - Fixed route definition
router.post('/recommend', async (req, res) => {
  try {
    const { soilData, userContext } = req.body;

    if (!soilData) {
      return res.status(400).json({ error: 'Soil data is required' });
    }

    // Validate required soil data fields
    const requiredFields = ['soilHealthScore', 'phLevel', 'organicMatter', 'nitrogen', 'phosphorus', 'potassium'];
    const missingFields = requiredFields.filter(field => soilData[field] === undefined);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required soil data fields', 
        missingFields 
      });
    }

    let recommendations;
    
    try {
      // Try Gemini recommendations first
      recommendations = await generateRecommendations(soilData, userContext || {});
    } catch (geminiError) {
      console.warn('Gemini recommendations failed, using fallback:', geminiError.message);
      // Use fallback recommendations
      recommendations = fallbackRecommendations(soilData, userContext || {});
    }

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    console.error('Recommend error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations', 
      message: error.message 
    });
  }
});

module.exports = router;
