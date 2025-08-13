import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, IndianRupee, Award } from 'lucide-react';

const CropRecommendationCard = ({ crop, index, strings, marketPrice, cultivationCost }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const getSuitabilityColor = (score) => {
    if (score >= 85) return 'from-green-400 to-emerald-600';
    if (score >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const getCropIcon = (cropName) => {
    const icons = {
      'Tomatoes': '🍅', 'Tomato': '🍅',
      'Corn': '🌽', 'Maize': '🌽',
      'Wheat': '🌾', 'Rice': '🌾',
      'Peppers': '🌶️', 'Pepper': '🌶️',
      'Onions': '🧅', 'Potato': '🥔',
      'Cotton': '🌿', 'Sugarcane': '🎋'
    };
    return icons[cropName] || '🌱';
  };

  // Calculate profitability
  const yieldInTons = parseFloat(crop.expectedYield.split('-')[0]) || 15;
  const grossRevenue = yieldInTons * marketPrice;
  const netProfit = grossRevenue - cultivationCost;
  const profitMargin = ((netProfit / grossRevenue) * 100).toFixed(1);

  return (
    <div 
      className="relative h-64 w-full cursor-pointer transform-gpu transition-transform duration-500 hover:scale-105 perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Front Side */}
      <div 
        className={`absolute inset-0 backface-hidden rounded-xl shadow-lg border border-neutral-200 transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={`h-full rounded-xl bg-gradient-to-br ${getSuitabilityColor(crop.suitabilityScore)} p-6 text-white relative overflow-hidden`}>
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl drop-shadow-lg">{getCropIcon(crop.cropName)}</span>
              <div className="text-right">
                <div className="text-2xl font-bold flex items-center">
                  <Award className="w-5 h-5 mr-1" />
                  {crop.suitabilityScore}%
                </div>
                <div className="text-sm opacity-90">Suitable</div>
              </div>
            </div>
            
            <h4 className="text-2xl font-bold mb-4 drop-shadow-lg">{crop.cropName}</h4>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center bg-white/20 rounded-lg p-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <div>
                  <div className="text-sm opacity-90">Expected Yield</div>
                  <div className="font-semibold">{crop.expectedYield}</div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/20 rounded-lg p-2">
                <Calendar className="w-4 h-4 mr-2" />
                <div>
                  <div className="text-sm opacity-90">Growth Period</div>
                  <div className="font-semibold">{crop.growthPeriod}</div>
                </div>
              </div>

              <div className="flex items-center bg-white/20 rounded-lg p-2">
                <IndianRupee className="w-4 h-4 mr-2" />
                <div>
                  <div className="text-sm opacity-90">Expected Profit</div>
                  <div className="font-semibold">₹{netProfit.toLocaleString('en-IN')}/ha</div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-xs opacity-75 mt-4">
              Click to see detailed analysis →
            </div>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div 
        className={`absolute inset-0 backface-hidden rounded-xl shadow-lg border border-neutral-200 bg-white rotate-y-180 transition-transform duration-700 ${
          isFlipped ? 'rotate-y-0' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-neutral-800">{crop.cropName}</h4>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="text-neutral-400 hover:text-neutral-600 text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* Profitability Analysis */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Profitability Analysis
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Gross Revenue:</span>
                  <span className="font-semibold text-green-800">₹{grossRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Cultivation Cost:</span>
                  <span className="font-semibold text-red-600">₹{cultivationCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-2">
                  <span className="text-green-800 font-semibold">Net Profit:</span>
                  <span className="font-bold text-green-800">₹{netProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-center bg-green-100 rounded p-2">
                  <span className="text-green-800 font-bold">{profitMargin}% Profit Margin</span>
                </div>
              </div>
            </div>
            
            {/* Why Recommended */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">🎯 Why Recommended?</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Perfect soil pH compatibility</li>
                <li>• Optimal nutrient availability</li>
                <li>• High market demand</li>
                <li>• Suitable for local climate</li>
                <li>• Good profit potential</li>
              </ul>
            </div>

            {/* Success Tips */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 mb-2">💡 Success Tips</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Plant during recommended season</li>
                <li>• Use quality certified seeds</li>
                <li>• Follow IPM practices</li>
                <li>• Monitor soil moisture regularly</li>
                <li>• Apply fertilizers as per schedule</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendationCard;
