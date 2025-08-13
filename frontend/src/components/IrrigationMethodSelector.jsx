import React, { useState } from 'react';
import { Droplets, Calculator, Info } from 'lucide-react';

const IrrigationMethodSelector = ({ onIrrigationSelect, strings, soilTexture, cropType, area = 1 }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [waterRequirement, setWaterRequirement] = useState(null);
  const [seasonalData, setSeasonalData] = useState(null);

  // Comprehensive irrigation methods database for India
  const irrigationMethods = {
    'drip': {
      name: 'Drip Irrigation',
      icon: '💧',
      description: 'Water directly to plant roots through emitters',
      waterEfficiency: 90,
      suitableCrops: ['Tomatoes', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits'],
      suitableSoils: ['Sandy', 'Loam', 'Clay'],
      initialCost: '₹80,000-1,50,000/hectare',
      waterSaving: '30-50%',
      advantages: [
        'Highest water efficiency (90%)',
        'Precise fertilizer application',
        'Reduced weed growth',
        'No water logging',
        'Disease control'
      ],
      disadvantages: [
        'High initial investment',
        'Requires skilled maintenance',
        'Clogging of emitters',
        'Not suitable for all crops'
      ],
      monthlyWaterReq: {
        'Kharif': [120, 140, 160, 180, 160, 140, 120, 100, 80, 60, 40, 30],
        'Rabi': [40, 60, 80, 120, 140, 160, 140, 120, 100, 80, 60, 40],
        'Zaid': [60, 80, 120, 160, 180, 160, 140, 120, 100, 80, 60, 40]
      }
    },
    'sprinkler': {
      name: 'Sprinkler Irrigation',
      icon: '🌧️',
      description: 'Water sprayed over crops like rainfall',
      waterEfficiency: 75,
      suitableCrops: ['Wheat', 'Maize', 'Soybean', 'Groundnut', 'Vegetables'],
      suitableSoils: ['Sandy', 'Loam'],
      initialCost: '₹40,000-80,000/hectare',
      waterSaving: '20-30%',
      advantages: [
        'Uniform water distribution',
        'Suitable for undulating land',
        'Frost protection',
        'Lower cost than drip',
        'Easy to operate'
      ],
      disadvantages: [
        'Wind affects distribution',
        'Higher evaporation losses',
        'Disease spread through water',
        'Power requirement'
      ],
      monthlyWaterReq: {
        'Kharif': [150, 170, 190, 210, 190, 170, 150, 130, 110, 90, 70, 50],
        'Rabi': [60, 80, 100, 140, 160, 180, 160, 140, 120, 100, 80, 60],
        'Zaid': [80, 100, 140, 180, 200, 180, 160, 140, 120, 100, 80, 60]
      }
    },
    'flood': {
      name: 'Flood/Basin Irrigation',
      icon: '🌊',
      description: 'Traditional flooding of entire field',
      waterEfficiency: 45,
      suitableCrops: ['Rice', 'Jute', 'Sugarcane'],
      suitableSoils: ['Clay', 'Silt'],
      initialCost: '₹10,000-25,000/hectare',
      waterSaving: '0%',
      advantages: [
        'Low initial cost',
        'Simple technology',
        'Suitable for rice cultivation',
        'No sophisticated equipment needed',
        'Traditional farmer knowledge'
      ],
      disadvantages: [
        'Highest water consumption',
        'Uneven water distribution',
        'Waterlogging problems',
        'High labor requirement',
        'Soil erosion'
      ],
      monthlyWaterReq: {
        'Kharif': [250, 280, 320, 350, 320, 280, 250, 220, 190, 160, 130, 100],
        'Rabi': [120, 150, 180, 220, 250, 280, 250, 220, 190, 160, 130, 100],
        'Zaid': [150, 180, 220, 280, 320, 280, 250, 220, 190, 160, 130, 100]
      }
    },
    'furrow': {
      name: 'Furrow Irrigation',
      icon: '🚜',
      description: 'Water flows in furrows between crop rows',
      waterEfficiency: 60,
      suitableCrops: ['Cotton', 'Sugarcane', 'Maize', 'Vegetables'],
      suitableSoils: ['Loam', 'Clay'],
      initialCost: '₹15,000-35,000/hectare',
      waterSaving: '10-20%',
      advantages: [
        'Moderate water efficiency',
        'Suitable for row crops',
        'Lower cost than micro-irrigation',
        'Good for sloping land',
        'Prevents waterlogging'
      ],
      disadvantages: [
        'Uneven water infiltration',
        'Labor intensive',
        'Soil compaction',
        'Not suitable for all soils'
      ],
      monthlyWaterReq: {
        'Kharif': [180, 200, 220, 240, 220, 200, 180, 160, 140, 120, 100, 80],
        'Rabi': [80, 100, 120, 160, 180, 200, 180, 160, 140, 120, 100, 80],
        'Zaid': [100, 120, 160, 200, 220, 200, 180, 160, 140, 120, 100, 80]
      }
    },
    'subsurface': {
      name: 'Subsurface Irrigation',
      icon: '🏠',
      description: 'Water delivered below ground surface',
      waterEfficiency: 85,
      suitableCrops: ['High-value crops', 'Perennial fruits', 'Vegetables'],
      suitableSoils: ['Sandy', 'Loam'],
      initialCost: '₹1,20,000-2,00,000/hectare',
      waterSaving: '40-60%',
      advantages: [
        'Minimal evaporation losses',
        'No surface weed growth',
        'Suitable for saline conditions',
        'Precise water control',
        'No interference with field operations'
      ],
      disadvantages: [
        'Very high initial cost',
        'Complex installation',
        'Maintenance difficulties',
        'Limited to specific soil types'
      ],
      monthlyWaterReq: {
        'Kharif': [100, 120, 140, 160, 140, 120, 100, 80, 60, 40, 30, 20],
        'Rabi': [30, 50, 70, 100, 120, 140, 120, 100, 80, 60, 40, 30],
        'Zaid': [50, 70, 100, 140, 160, 140, 120, 100, 80, 60, 40, 30]
      }
    }
  };

  const calculateWaterRequirement = (method, crop, soil, season = 'Kharif') => {
    const methodData = irrigationMethods[method];
    if (!methodData) return null;

    const baseRequirement = methodData.monthlyWaterReq[season] || methodData.monthlyWaterReq['Kharif'];

    const soilFactors = { 'Sandy': 1.2, 'Loam': 1.0, 'Clay': 0.8, 'Silt': 0.9 };
    const cropFactors = { 'Rice': 1.5, 'Sugarcane': 1.4, 'Cotton': 1.2, 'Wheat': 1.0, 'Maize': 1.1, 'Tomatoes': 1.2, 'Vegetables': 1.1 };

    const soilFactor = soilFactors[soil] || 1.0;
    const cropFactor = cropFactors[crop] || 1.0;

    const adjustedRequirement = baseRequirement.map(month => Math.round(month * soilFactor * cropFactor * area));

    const totalAnnual = adjustedRequirement.reduce((sum, month) => sum + month, 0);
    const peakMonth = Math.max(...adjustedRequirement);
    const costPerYear = calculateIrrigationCost(method, totalAnnual);

    return {
      monthlyReq: adjustedRequirement,
      totalAnnual,
      peakMonth,
      costPerYear,
      efficiency: methodData.waterEfficiency,
      waterSaved: totalAnnual * (1 - methodData.waterEfficiency / 100)
    };
  };

  const calculateIrrigationCost = (method, totalWater) => {
    const operatingCosts = { 'drip': 2.5, 'sprinkler': 3.0, 'flood': 1.5, 'furrow': 2.0, 'subsurface': 2.8 };
    return Math.round(totalWater * operatingCosts[method]);
  };

  const handleMethodSelect = (methodKey) => {
    setSelectedMethod(methodKey);
    const requirement = calculateWaterRequirement(methodKey, cropType, soilTexture);
    setWaterRequirement(requirement);

    const seasons = ['Kharif', 'Rabi', 'Zaid'];
    const seasonalReq = seasons.map(season => ({
      season,
      ...calculateWaterRequirement(methodKey, cropType, soilTexture, season)
    }));

    setSeasonalData(seasonalReq);

    if (onIrrigationSelect) {
      onIrrigationSelect({
        method: methodKey,
        methodData: irrigationMethods[methodKey],
        waterRequirement: requirement,
        seasonalData: seasonalReq
      });
    }
  };

  const getMethodRecommendation = (soil, crop) => {
    if (soil === 'Sandy' && ['Vegetables', 'Fruits'].includes(crop)) return 'drip';
    if (soil === 'Clay' && crop === 'Rice') return 'flood';
    if (['Wheat', 'Maize'].includes(crop)) return 'sprinkler';
    if (['Cotton', 'Sugarcane'].includes(crop)) return 'furrow';
    return 'drip';
  };

  const recommendedMethod = getMethodRecommendation(soilTexture, cropType);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <h3 className="text-xl font-bold text-neutral-800 flex items-center">
          <Droplets className="w-6 h-6 mr-3 text-blue-500" />
          {strings.irrigationMethodTitle || "Select Irrigation Method"}
        </h3>
        <p className="text-neutral-600 mt-2">
          {strings.irrigationMethodSubtitle || "Choose the best irrigation system for your crop and soil"}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(irrigationMethods).map(([key, method]) => (
            <div
              key={key}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedMethod === key ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
              } ${recommendedMethod === key ? 'ring-2 ring-green-200' : ''}`}
              onClick={() => handleMethodSelect(key)}
            >
              {recommendedMethod === key && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </div>
              )}
              <div className="text-center">
                <div className="text-3xl mb-2">{method.icon}</div>
                <h4 className="font-semibold text-neutral-800 mb-1">{method.name}</h4>
                <p className="text-sm text-neutral-600 mb-3">{method.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Efficiency:</span>
                    <span className="font-medium text-primary-600">{method.waterEfficiency}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Cost:</span>
                    <span className="font-medium text-neutral-700">{method.initialCost}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Water Saving:</span>
                    <span className="font-medium text-green-600">{method.waterSaving}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedMethod && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-neutral-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                {irrigationMethods[selectedMethod].name} Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">✅ Advantages</h5>
                  <ul className="space-y-1">
                    {irrigationMethods[selectedMethod].advantages.map((adv, i) => (
                      <li key={i} className="text-sm text-neutral-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-700 mb-2">⚠️ Considerations</h5>
                  <ul className="space-y-1">
                    {irrigationMethods[selectedMethod].disadvantages.map((dis, i) => (
                      <li key={i} className="text-sm text-neutral-600 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {dis}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {waterRequirement && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                  Water Requirement Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{waterRequirement.totalAnnual}</div>
                    <div className="text-sm text-neutral-600">Liters/Year</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{waterRequirement.peakMonth}</div>
                    <div className="text-sm text-neutral-600">Peak Month (L)</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{waterRequirement.efficiency}%</div>
                    <div className="text-sm text-neutral-600">Efficiency</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">₹{waterRequirement.costPerYear.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-neutral-600">Annual Cost</div>
                  </div>
                </div>

                {seasonalData && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-4">Seasonal Water Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {seasonalData.map((season, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-neutral-700 mb-2">{season.season} Season</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Total Water:</span>
                              <span className="font-medium">{season.totalAnnual}L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Peak Month:</span>
                              <span className="font-medium">{season.peakMonth}L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Cost:</span>
                              <span className="font-medium">₹{season.costPerYear.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IrrigationMethodSelector;
