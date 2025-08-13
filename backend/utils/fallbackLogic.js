/**
 * Enhanced Fallback parsing logic when Gemini AI is unavailable
 * @param {string} text - Soil report text
 * @returns {Object} - Parsed soil data
 */
function fallbackParsing(text) {
  console.log('🔄 Using enhanced fallback parsing logic...');
  const textLower = text.toLowerCase();
  
  // Extract pH level with better regex patterns
  let phLevel = 7.0; // neutral default
  const phPatterns = [
    /ph[:\s]*(\d+\.?\d*)/i,
    /ph\s*=\s*(\d+\.?\d*)/i,
    /ph\s*value[:\s]*(\d+\.?\d*)/i,
    /ph\s*level[:\s]*(\d+\.?\d*)/i
  ];
  
  for (const pattern of phPatterns) {
    const match = text.match(pattern);
    if (match) {
      phLevel = Math.max(0, Math.min(14, parseFloat(match[1]))); // Clamp to valid pH range
      break;
    }
  }
  
  // Extract organic matter percentage with multiple patterns
  let organicMatter = 3.0; // default
  const omPatterns = [
    /organic\s*matter[:\s]*(\d+\.?\d*)%?/i,
    /om[:\s]*(\d+\.?\d*)%?/i,
    /organic\s*carbon[:\s]*(\d+\.?\d*)%?/i,
    /oc[:\s]*(\d+\.?\d*)%?/i
  ];
  
  for (const pattern of omPatterns) {
    const match = text.match(pattern);
    if (match) {
      organicMatter = Math.max(0, Math.min(15, parseFloat(match[1]))); // Clamp to realistic range
      break;
    }
  }
  
  // Extract nutrients with enhanced patterns
  let nitrogen = 20; // ppm default
  let phosphorus = 15;
  let potassium = 150;
  
  // Nitrogen patterns
  const nPatterns = [
    /nitrogen[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /available\s*nitrogen[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /\bn[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /n2o5[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i
  ];
  
  for (const pattern of nPatterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1]);
      const unit = match[2] ? match[2].toLowerCase() : 'ppm';
      
      // Convert to ppm if needed
      if (unit === 'kg/ha') value = value * 0.8; // Rough conversion
      if (unit === '%') value = value * 10000; // Convert % to ppm
      
      nitrogen = Math.max(0, Math.min(1000, value)); // Clamp to realistic range
      break;
    }
  }
  
  // Phosphorus patterns
  const pPatterns = [
    /phosphorus[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /available\s*phosphorus[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /\bp[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /p2o5[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i
  ];
  
  for (const pattern of pPatterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1]);
      const unit = match[2] ? match[2].toLowerCase() : 'ppm';
      
      if (unit === 'kg/ha') value = value * 0.5;
      if (unit === '%') value = value * 10000;
      
      phosphorus = Math.max(0, Math.min(500, value));
      break;
    }
  }
  
  // Potassium patterns
  const kPatterns = [
    /potassium[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /available\s*potassium[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /\bk[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i,
    /k2o[:\s]*(\d+\.?\d*)\s*(ppm|kg\/ha|%)?/i
  ];
  
  for (const pattern of kPatterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1]);
      const unit = match[2] ? match[2].toLowerCase() : 'ppm';
      
      if (unit === 'kg/ha') value = value * 0.8;
      if (unit === '%') value = value * 10000;
      
      potassium = Math.max(0, Math.min(2000, value));
      break;
    }
  }
  
  // Enhanced soil texture detection
  let soilTexture = "Loam"; // default
  const textureKeywords = {
    "Clay": ['clay', 'heavy clay', 'clayey', 'clay loam'],
    "Sand": ['sand', 'sandy', 'sandy loam', 'light sand'],
    "Silt": ['silt', 'silty', 'silt loam', 'silty clay'],
    "Mixed": ['mixed', 'varied', 'combination']
  };
  
  for (const [texture, keywords] of Object.entries(textureKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      soilTexture = texture;
      break;
    }
  }
  
  // Enhanced moisture level detection
  let moistureLevel = "Medium";
  const moistureKeywords = {
    "Low": ['dry', 'arid', 'low moisture', 'drought', 'water deficit'],
    "High": ['wet', 'waterlogged', 'high moisture', 'saturated', 'flooded'],
    "Medium": ['moderate', 'adequate', 'normal moisture']
  };
  
  for (const [level, keywords] of Object.entries(moistureKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      moistureLevel = level;
      break;
    }
  }
  
  // Calculate enhanced soil health score
  const soilHealthScore = calculateEnhancedSoilHealthScore(phLevel, organicMatter, nitrogen, phosphorus, potassium, soilTexture);
  
  console.log(`📊 Extracted values: pH=${phLevel}, OM=${organicMatter}%, N=${nitrogen}ppm, P=${phosphorus}ppm, K=${potassium}ppm`);
  
  return {
    soilHealthScore,
    phLevel,
    organicMatter,
    nitrogen,
    phosphorus,
    potassium,
    soilTexture,
    moistureLevel,
    recommendations: generateEnhancedRecommendations(phLevel, organicMatter, soilTexture, nitrogen, phosphorus, potassium)
  };
}

/**
 * Enhanced soil health score calculation with weighted factors
 */
function calculateEnhancedSoilHealthScore(ph, om, n, p, k, texture) {
  let score = 0;
  let maxScore = 0;
  
  // pH scoring with optimal ranges (weight: 25%)
  maxScore += 25;
  if (ph >= 6.0 && ph <= 7.5) score += 25; // Optimal
  else if (ph >= 5.5 && ph <= 8.0) score += 22; // Good
  else if (ph >= 5.0 && ph <= 8.5) score += 18; // Acceptable
  else if (ph >= 4.5 && ph <= 9.0) score += 12; // Poor
  else score += 5; // Very poor
  
  // Organic matter scoring (weight: 25%)
  maxScore += 25;
  if (om >= 5.0) score += 25; // Excellent
  else if (om >= 3.5) score += 22; // Very good
  else if (om >= 2.5) score += 18; // Good
  else if (om >= 1.5) score += 12; // Fair
  else score += 5; // Poor
  
  // Nitrogen scoring (weight: 15%)
  maxScore += 15;
  if (n >= 25) score += 15; // High
  else if (n >= 20) score += 13; // Good
  else if (n >= 15) score += 10; // Medium
  else if (n >= 10) score += 7; // Low
  else score += 3; // Very low
  
  // Phosphorus scoring (weight: 15%)
  maxScore += 15;
  if (p >= 20) score += 15; // High
  else if (p >= 15) score += 13; // Good
  else if (p >= 10) score += 10; // Medium
  else if (p >= 5) score += 7; // Low
  else score += 3; // Very low
  
  // Potassium scoring (weight: 20%)
  maxScore += 20;
  if (k >= 200) score += 20; // High
  else if (k >= 150) score += 17; // Good
  else if (k >= 100) score += 13; // Medium
  else if (k >= 50) score += 8; // Low
  else score += 3; // Very low
  
  // Texture bonus/penalty
  const textureModifiers = {
    "Loam": 3, // Best for most crops
    "Clay": -2, // Drainage issues
    "Sand": -3, // Nutrient retention issues
    "Silt": 1, // Generally good
    "Mixed": 0 // Neutral
  };
  
  score += textureModifiers[texture] || 0;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Generate enhanced recommendations based on all soil parameters
 */
function generateEnhancedRecommendations(ph, om, texture, n, p, k) {
  const recommendations = [];
  
  // pH recommendations
  if (ph < 5.5) {
    recommendations.push("Apply agricultural lime (2-3 tons/ha) to increase pH to optimal range");
  } else if (ph < 6.0) {
    recommendations.push("Apply lime (1-2 tons/ha) to slightly increase pH");
  } else if (ph > 8.5) {
    recommendations.push("Apply sulfur (200-300 kg/ha) or organic matter to lower pH");
  } else if (ph > 8.0) {
    recommendations.push("Add organic compost to help buffer high pH");
  }
  
  // Organic matter recommendations
  if (om < 2.0) {
    recommendations.push("Urgently increase organic matter with 5-7 tons/ha of compost or FYM");
  } else if (om < 3.0) {
    recommendations.push("Add 3-5 tons/ha of well-decomposed organic matter");
  } else if (om >= 5.0) {
    recommendations.push("Maintain excellent organic matter levels through regular additions");
  }
  
  // Nutrient-specific recommendations
  if (n < 15) {
    recommendations.push("Apply nitrogen fertilizer: Urea 100-150 kg/ha in split doses");
  } else if (n > 40) {
    recommendations.push("Nitrogen levels are high - reduce nitrogen fertilizer application");
  }
  
  if (p < 10) {
    recommendations.push("Apply phosphorus: DAP 100-125 kg/ha at planting");
  } else if (p > 30) {
    recommendations.push("Phosphorus is adequate - avoid over-application");
  }
  
  if (k < 100) {
    recommendations.push("Apply potassium: Muriate of Potash 80-100 kg/ha");
  } else if (k > 300) {
    recommendations.push("Potassium levels are high - monitor for nutrient imbalances");
  }
  
  // Texture-based recommendations
  if (texture === "Clay") {
    recommendations.push("Improve drainage through ridges/furrows and organic matter addition");
    recommendations.push("Avoid working soil when wet to prevent compaction");
  } else if (texture === "Sand") {
    recommendations.push("Add clay/compost to improve water and nutrient retention");
    recommendations.push("Use frequent, light irrigation and mulching");
  }
  
  // General recommendations
  recommendations.push("Conduct soil testing every 2-3 years for monitoring");
  recommendations.push("Consider cover crops during fallow periods");
  
  return recommendations;
}

/**
 * Enhanced fallback recommendation logic with Indian market context
 */
function fallbackRecommendations(soilData, userContext) {
  console.log('🔄 Using enhanced fallback recommendations logic...');
  
  const { phLevel, organicMatter, soilTexture, nitrogen, phosphorus, potassium, soilHealthScore } = soilData;
  const { location, budget = 50000, cropPreference } = userContext; // Default ₹50,000 budget
  
  // Generate enhanced crop suggestions
  const cropSuggestions = generateEnhancedCropSuggestions(soilData, cropPreference, location);
  
  // Generate realistic fertilizer recommendations in INR
  const fertilizers = generateRealisticFertilizerRecommendations(nitrogen, phosphorus, potassium, budget);
  
  // Generate comprehensive soil improvements
  const soilImprovements = generateComprehensiveSoilImprovements(soilData);
  
  // Generate location-aware irrigation advice
  const irrigationAdvice = generateLocationAwareIrrigationAdvice(soilTexture, location);
  
  // Calculate realistic budget estimate in INR
  const totalBudgetEstimate = calculateRealisticBudgetEstimate(fertilizers, soilImprovements);
  
  return {
    cropSuggestions,
    fertilizers,
    soilImprovements,
    irrigationAdvice,
    totalBudgetEstimate
  };
}

/**
 * Generate enhanced crop suggestions based on Indian agricultural practices
 */
function generateEnhancedCropSuggestions(soilData, preference, location) {
  const { phLevel, organicMatter, soilTexture, nitrogen, phosphorus, potassium, soilHealthScore } = soilData;
  
  // Indian crop database with realistic yields and requirements
  const indianCrops = [
    { 
      cropName: "Tomatoes", 
      baseScore: 85, 
      expectedYield: "25-35 tons/ha", 
      growthPeriod: "90-120 days",
      phRange: [6.0, 7.0],
      seasons: ["Kharif", "Rabi"]
    },
    { 
      cropName: "Wheat", 
      baseScore: 80, 
      expectedYield: "3.5-4.5 tons/ha", 
      growthPeriod: "120-150 days",
      phRange: [6.0, 7.5],
      seasons: ["Rabi"]
    },
    { 
      cropName: "Rice", 
      baseScore: 75, 
      expectedYield: "4-6 tons/ha", 
      growthPeriod: "120-140 days",
      phRange: [5.5, 7.0],
      seasons: ["Kharif"]
    },
    { 
      cropName: "Cotton", 
      baseScore: 70, 
      expectedYield: "15-20 quintals/ha", 
      growthPeriod: "160-180 days",
      phRange: [6.0, 8.0],
      seasons: ["Kharif"]
    },
    { 
      cropName: "Sugarcane", 
      baseScore: 78, 
      expectedYield: "70-90 tons/ha", 
      growthPeriod: "10-12 months",
      phRange: [6.0, 7.5],
      seasons: ["Annual"]
    },
    { 
      cropName: "Onions", 
      baseScore: 82, 
      expectedYield: "20-30 tons/ha", 
      growthPeriod: "120-150 days",
      phRange: [6.0, 7.0],
      seasons: ["Kharif", "Rabi"]
    }
  ];
  
  // Filter by preference
  let filteredCrops = indianCrops;
  if (preference) {
    const preferenceMap = {
      'vegetables': ['Tomatoes', 'Onions', 'Peppers', 'Potato'],
      'grains': ['Wheat', 'Rice', 'Corn', 'Barley'],
      'cash': ['Cotton', 'Sugarcane', 'Groundnut'],
      'fruits': ['Mango', 'Citrus', 'Grapes']
    };
    
    if (preferenceMap[preference.toLowerCase()]) {
      filteredCrops = indianCrops.filter(crop => 
        preferenceMap[preference.toLowerCase()].some(p => crop.cropName.includes(p))
      );
    }
  }
  
  // Calculate suitability scores
  const scoredCrops = filteredCrops.map(crop => {
    let score = crop.baseScore;
    
    // pH compatibility
    if (phLevel >= crop.phRange[0] && phLevel <= crop.phRange[1]) {
      score += 10;
    } else if (Math.abs(phLevel - (crop.phRange[0] + crop.phRange[1]) / 2) > 1.0) {
      score -= 15;
    }
    
    // Organic matter impact
    if (organicMatter >= 3.0) score += 5;
    else if (organicMatter < 2.0) score -= 8;
    
    // Soil texture compatibility
    const texturePreferences = {
      "Tomatoes": ["Loam", "Clay"],
      "Wheat": ["Loam", "Clay"],
      "Rice": ["Clay", "Silt"],
      "Cotton": ["Clay", "Loam"],
      "Onions": ["Loam", "Sand"]
    };
    
    if (texturePreferences[crop.cropName]?.includes(soilTexture)) {
      score += 8;
    }
    
    // Nutrient adequacy
    if (nitrogen >= 20 && phosphorus >= 15 && potassium >= 150) score += 7;
    else if (nitrogen < 10 || phosphorus < 8 || potassium < 80) score -= 10;
    
    // Overall soil health impact
    if (soilHealthScore >= 80) score += 5;
    else if (soilHealthScore < 60) score -= 8;
    
    return {
      ...crop,
      suitabilityScore: Math.max(0, Math.min(100, Math.round(score)))
    };
  });
  
  return scoredCrops
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 4); // Top 4 recommendations
}

/**
 * Generate realistic fertilizer recommendations in INR
 */
function generateRealisticFertilizerRecommendations(n, p, k, budget) {
  const fertilizers = [];
  const budgetINR = budget || 50000; // Default ₹50,000
  
  // Nitrogen fertilizers
  if (n < 20) {
    fertilizers.push({
      name: "Urea (46-0-0)",
      quantity: "100-125 kg/ha",
      cost: 3200, // ₹3,200 per hectare
      application: "Apply in 2-3 splits: 1/3 at planting, 1/3 at 30 days, 1/3 at 60 days"
    });
  } else if (n < 15) {
    fertilizers.push({
      name: "Calcium Ammonium Nitrate",
      quantity: "150 kg/ha",
      cost: 4500,
      application: "Apply in split doses during active growth"
    });
  }
  
  // Phosphorus fertilizers
  if (p < 15) {
    fertilizers.push({
      name: "DAP (18-46-0)",
      quantity: "100 kg/ha",
      cost: 2800, // ₹2,800 per hectare
      application: "Apply full dose at the time of planting/sowing"
    });
  } else if (p < 10) {
    fertilizers.push({
      name: "Single Super Phosphate",
      quantity: "200 kg/ha",
      cost: 2200,
      application: "Apply as basal dose before planting"
    });
  }
  
  // Potassium fertilizers
  if (k < 150) {
    fertilizers.push({
      name: "Muriate of Potash (0-0-60)",
      quantity: "80 kg/ha",
      cost: 2400, // ₹2,400 per hectare
      application: "Apply half at planting, half at flowering stage"
    });
  } else if (k < 100) {
    fertilizers.push({
      name: "Sulphate of Potash",
      quantity: "100 kg/ha",
      cost: 3800,
      application: "Apply in split doses for better utilization"
    });
  }
  
  // Organic fertilizers (always recommended)
  fertilizers.push({
    name: "Vermicompost",
    quantity: "2-3 tons/ha",
    cost: 4500, // ₹4,500 per hectare
    application: "Apply 2-3 weeks before planting and mix with soil"
  });
  
  // Micronutrient fertilizers
  fertilizers.push({
    name: "Zinc Sulphate",
    quantity: "25 kg/ha",
    cost: 800,
    application: "Apply to soil or as foliar spray"
  });
  
  // Filter based on budget constraints
  let totalCost = 0;
  const filteredFertilizers = [];
  
  for (const fertilizer of fertilizers) {
    if (totalCost + fertilizer.cost <= budgetINR) {
      filteredFertilizers.push(fertilizer);
      totalCost += fertilizer.cost;
    }
  }
  
  return filteredFertilizers.length > 0 ? filteredFertilizers : fertilizers.slice(0, 3);
}

/**
 * Generate comprehensive soil improvement recommendations
 */
function generateComprehensiveSoilImprovements(soilData) {
  const improvements = [];
  const { phLevel, organicMatter, soilTexture, nitrogen, phosphorus, potassium, soilHealthScore } = soilData;
  
  // pH management
  if (phLevel < 5.5) {
    improvements.push("Apply agricultural lime: 2-3 tons/ha (₹8,000-12,000/ha)");
  } else if (phLevel > 8.5) {
    improvements.push("Apply gypsum: 1-2 tons/ha (₹6,000-10,000/ha)");
  }
  
  // Organic matter enhancement
  if (organicMatter < 2.0) {
    improvements.push("Urgent: Add 5-7 tons/ha of FYM or compost (₹15,000-20,000/ha)");
  } else if (organicMatter < 3.0) {
    improvements.push("Add 3-5 tons/ha of organic matter annually (₹10,000-15,000/ha)");
  }
  
  // Soil texture management
  if (soilTexture === "Clay") {
    improvements.push("Create drainage channels and raised beds (₹5,000-8,000/ha)");
    improvements.push("Add coarse organic matter for better aeration");
  } else if (soilTexture === "Sand") {
    improvements.push("Add clay/bentonite to improve water retention (₹8,000-12,000/ha)");
    improvements.push("Use mulching to reduce water loss");
  }
  
  // Nutrient management
  if (nitrogen < 15) {
    improvements.push("Establish nitrogen-fixing cover crops (Legumes)");
  }
  
  if (phosphorus < 10) {
    improvements.push("Apply rock phosphate for long-term P availability");
  }
  
  // Biological improvements
  improvements.push("Introduce beneficial microorganisms (₹2,000-3,000/ha)");
  improvements.push("Practice crop rotation to maintain soil health");
  
  // Water management
  if (soilTexture === "Clay") {
    improvements.push("Install subsurface drainage system");
  } else {
    improvements.push("Implement drip irrigation for water efficiency");
  }
  
  return improvements;
}

/**
 * Generate location-aware irrigation advice
 */
function generateLocationAwareIrrigationAdvice(texture, location) {
  let advice = "Monitor soil moisture at 15-20cm depth regularly. ";
  
  // Texture-based advice
  if (texture === "Sand") {
    advice += "Sandy soils need frequent, light irrigation (every 2-3 days, 15-20mm). ";
  } else if (texture === "Clay") {
    advice += "Clay soils require deep, less frequent irrigation (every 7-10 days, 40-50mm). ";
  } else {
    advice += "Loamy soils benefit from moderate irrigation (every 4-5 days, 25-30mm). ";
  }
  
  // Location-specific advice
  if (location) {
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('rajasthan') || locationLower.includes('gujarat')) {
      advice += "In arid regions, use drip irrigation and mulching to conserve water. ";
    } else if (locationLower.includes('kerala') || locationLower.includes('west bengal')) {
      advice += "In high rainfall areas, focus on drainage during monsoon. ";
    } else if (locationLower.includes('punjab') || locationLower.includes('haryana')) {
      advice += "In irrigated plains, practice alternate wetting and drying for rice. ";
    } else if (locationLower.includes('karnataka') || locationLower.includes('andhra')) {
      advice += "Use tank irrigation and rainwater harvesting where possible. ";
    }
  }
  
  advice += "Consider installing soil moisture sensors for precision irrigation.";
  
  return advice;
}

/**
 * Calculate realistic budget estimate in INR
 */
function calculateRealisticBudgetEstimate(fertilizers, improvements) {
  // Fertilizer costs
  const fertilizerCost = fertilizers.reduce((sum, fert) => sum + fert.cost, 0);
  
  // Improvement costs (extract from strings or use estimates)
  let improvementCost = 0;
  improvements.forEach(improvement => {
    const costMatch = improvement.match(/₹([\d,]+)(?:-[\d,]+)?/);
    if (costMatch) {
      const cost = parseInt(costMatch[1].replace(/,/g, ''));
      improvementCost += cost;
    } else {
      // Default costs for improvements without specified amounts
      improvementCost += 3000;
    }
  });
  
  // Add labor and miscellaneous costs (20% of material costs)
  const laborCost = (fertilizerCost + improvementCost) * 0.2;
  
  const totalEstimate = fertilizerCost + improvementCost + laborCost;
  
  return Math.round(totalEstimate);
}

module.exports = {
  fallbackParsing,
  fallbackRecommendations,
  calculateEnhancedSoilHealthScore,
  generateEnhancedRecommendations,
  generateEnhancedCropSuggestions,
  generateRealisticFertilizerRecommendations,
  generateComprehensiveSoilImprovements,
  generateLocationAwareIrrigationAdvice,
  calculateRealisticBudgetEstimate
};

