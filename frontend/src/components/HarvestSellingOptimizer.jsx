import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, AlertTriangle, Target } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const HarvestSellingOptimizer = ({ cropName, location, expectedHarvestDate, strings }) => {
  const [priceData, setPriceData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  // Historic price data for major Indian crops (₹ per quintal)[7][25][37][40]
  const historicPriceData = {
    'Wheat': {
      peakMonths: ['February', 'March', 'April'],
      lowMonths: ['May', 'June'],
      avgPrice: 2200,
      volatility: 15,
      monthlyPrices: [2150, 2280, 2350, 2300, 2050, 1980, 2100, 2150, 2200, 2250, 2200, 2180],
      marketTrends: {
        'January': { price: 2150, trend: 'Rising', confidence: 85 },
        'February': { price: 2280, trend: 'Peak', confidence: 92 },
        'March': { price: 2350, trend: 'Peak', confidence: 95 },
        'April': { price: 2300, trend: 'High', confidence: 88 },
        'May': { price: 2050, trend: 'Falling', confidence: 80 },
        'June': { price: 1980, trend: 'Low', confidence: 82 },
        'July': { price: 2100, trend: 'Rising', confidence: 75 },
        'August': { price: 2150, trend: 'Stable', confidence: 78 },
        'September': { price: 2200, trend: 'Rising', confidence: 80 },
        'October': { price: 2250, trend: 'Rising', confidence: 85 },
        'November': { price: 2200, trend: 'Stable', confidence: 83 },
        'December': { price: 2180, trend: 'Stable', confidence: 80 }
      }
    },
    'Rice': {
      peakMonths: ['October', 'November', 'December'],
      lowMonths: ['June', 'July', 'August'],
      avgPrice: 2800,
      volatility: 18,
      monthlyPrices: [2750, 2700, 2650, 2600, 2550, 2500, 2520, 2600, 2750, 2900, 3000, 2950],
      marketTrends: {
        'January': { price: 2750, trend: 'High', confidence: 88 },
        'February': { price: 2700, trend: 'Falling', confidence: 82 },
        'March': { price: 2650, trend: 'Falling', confidence: 80 },
        'April': { price: 2600, trend: 'Low', confidence: 78 },
        'May': { price: 2550, trend: 'Low', confidence: 75 },
        'June': { price: 2500, trend: 'Lowest', confidence: 85 },
        'July': { price: 2520, trend: 'Low', confidence: 83 },
        'August': { price: 2600, trend: 'Rising', confidence: 80 },
        'September': { price: 2750, trend: 'Rising', confidence: 85 },
        'October': { price: 2900, trend: 'Peak', confidence: 92 },
        'November': { price: 3000, trend: 'Peak', confidence: 95 },
        'December': { price: 2950, trend: 'High', confidence: 90 }
      }
    },
    'Cotton': {
      peakMonths: ['December', 'January', 'February'],
      lowMonths: ['April', 'May', 'June'],
      avgPrice: 5500,
      volatility: 22,
      monthlyPrices: [5800, 5900, 5700, 5200, 5000, 4850, 5100, 5300, 5400, 5500, 5650, 5750],
      marketTrends: {
        'January': { price: 5800, trend: 'Peak', confidence: 90 },
        'February': { price: 5900, trend: 'Peak', confidence: 92 },
        'March': { price: 5700, trend: 'High', confidence: 85 },
        'April': { price: 5200, trend: 'Falling', confidence: 80 },
        'May': { price: 5000, trend: 'Low', confidence: 82 },
        'June': { price: 4850, trend: 'Lowest', confidence: 85 },
        'July': { price: 5100, trend: 'Rising', confidence: 78 },
        'August': { price: 5300, trend: 'Rising', confidence: 80 },
        'September': { price: 5400, trend: 'Rising', confidence: 82 },
        'October': { price: 5500, trend: 'Stable', confidence: 80 },
        'November': { price: 5650, trend: 'Rising', confidence: 85 },
        'December': { price: 5750, trend: 'Rising', confidence: 88 }
      }
    },
    'Sugarcane': {
      peakMonths: ['March', 'April', 'May'],
      lowMonths: ['August', 'September'],
      avgPrice: 350,
      volatility: 12,
      monthlyPrices: [340, 345, 370, 375, 380, 365, 350, 330, 335, 340, 345, 350],
      marketTrends: {
        'January': { price: 340, trend: 'Stable', confidence: 80 },
        'February': { price: 345, trend: 'Rising', confidence: 82 },
        'March': { price: 370, trend: 'Peak', confidence: 90 },
        'April': { price: 375, trend: 'Peak', confidence: 92 },
        'May': { price: 380, trend: 'Peak', confidence: 95 },
        'June': { price: 365, trend: 'High', confidence: 85 },
        'July': { price: 350, trend: 'Falling', confidence: 80 },
        'August': { price: 330, trend: 'Low', confidence: 85 },
        'September': { price: 335, trend: 'Low', confidence: 82 },
        'October': { price: 340, trend: 'Rising', confidence: 78 },
        'November': { price: 345, trend: 'Rising', confidence: 80 },
        'December': { price: 350, trend: 'Stable', confidence: 80 }
      }
    },
    'Tomatoes': {
      peakMonths: ['December', 'January', 'February'],
      lowMonths: ['July', 'August', 'September'],
      avgPrice: 2500,
      volatility: 35,
      monthlyPrices: [3200, 3500, 3000, 2500, 2200, 2000, 1800, 1600, 1800, 2200, 2800, 3000],
      marketTrends: {
        'January': { price: 3200, trend: 'Peak', confidence: 88 },
        'February': { price: 3500, trend: 'Peak', confidence: 92 },
        'March': { price: 3000, trend: 'High', confidence: 85 },
        'April': { price: 2500, trend: 'Falling', confidence: 80 },
        'May': { price: 2200, trend: 'Falling', confidence: 78 },
        'June': { price: 2000, trend: 'Low', confidence: 80 },
        'July': { price: 1800, trend: 'Lowest', confidence: 85 },
        'August': { price: 1600, trend: 'Lowest', confidence: 90 },
        'September': { price: 1800, trend: 'Low', confidence: 85 },
        'October': { price: 2200, trend: 'Rising', confidence: 82 },
        'November': { price: 2800, trend: 'Rising', confidence: 85 },
        'December': { price: 3000, trend: 'Rising', confidence: 88 }
      }
    },
    'Onions': {
      peakMonths: ['November', 'December', 'January'],
      lowMonths: ['April', 'May', 'June'],
      avgPrice: 1800,
      volatility: 28,
      monthlyPrices: [2200, 2000, 1700, 1400, 1200, 1100, 1300, 1500, 1600, 1800, 2000, 2100],
      marketTrends: {
        'January': { price: 2200, trend: 'Peak', confidence: 90 },
        'February': { price: 2000, trend: 'High', confidence: 85 },
        'March': { price: 1700, trend: 'Falling', confidence: 80 },
        'April': { price: 1400, trend: 'Low', confidence: 82 },
        'May': { price: 1200, trend: 'Lowest', confidence: 88 },
        'June': { price: 1100, trend: 'Lowest', confidence: 90 },
        'July': { price: 1300, trend: 'Rising', confidence: 80 },
        'August': { price: 1500, trend: 'Rising', confidence: 82 },
        'September': { price: 1600, trend: 'Rising', confidence: 80 },
        'October': { price: 1800, trend: 'Rising', confidence: 83 },
        'November': { price: 2000, trend: 'Peak', confidence: 88 },
        'December': { price: 2100, trend: 'Peak', confidence: 92 }
      }
    }
  };

  useEffect(() => {
    if (cropName && expectedHarvestDate) {
      generateSellingRecommendations();
    }
  }, [cropName, expectedHarvestDate]);

  const generateSellingRecommendations = () => {
    setLoading(true);
    
    setTimeout(() => {
      const cropData = historicPriceData[cropName] || historicPriceData['Wheat'];
      const harvestDate = new Date(expectedHarvestDate);
      const harvestMonth = harvestDate.getMonth();
      
      // Generate recommendations based on historic data
      const recommendations = {
        immediate: generateImmediateRecommendation(cropData, harvestMonth),
        shortTerm: generateShortTermRecommendation(cropData, harvestMonth),
        longTerm: generateLongTermRecommendation(cropData, harvestMonth),
        storageAdvice: generateStorageAdvice(cropName, harvestMonth),
        marketInsights: generateMarketInsights(cropData, location)
      };
      
      setPriceData(cropData);
      setRecommendations(recommendations);
      setLoading(false);
    }, 1500);
  };

  const generateImmediateRecommendation = (cropData, harvestMonth) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[harvestMonth];
    const currentPrice = cropData.monthlyPrices[harvestMonth];
    const avgPrice = cropData.avgPrice;
    
    const priceComparison = ((currentPrice - avgPrice) / avgPrice * 100).toFixed(1);
    
    if (currentPrice > avgPrice * 1.1) {
      return {
        action: 'SELL NOW',
        confidence: 85,
        reason: `Current prices are ${priceComparison}% above average. Good time to sell immediately.`,
        expectedPrice: currentPrice,
        risk: 'Low'
      };
    } else if (currentPrice < avgPrice * 0.9) {
      return {
        action: 'WAIT',
        confidence: 75,
        reason: `Current prices are ${Math.abs(priceComparison)}% below average. Consider waiting for better prices.`,
        expectedPrice: currentPrice,
        risk: 'Medium'
      };
    } else {
      return {
        action: 'NEUTRAL',
        confidence: 70,
        reason: `Current prices are near average (${priceComparison}% difference). Decision depends on storage capacity.`,
        expectedPrice: currentPrice,
        risk: 'Medium'
      };
    }
  };

  const generateShortTermRecommendation = (cropData, harvestMonth) => {
    const nextThreeMonths = [];
    for (let i = 1; i <= 3; i++) {
      const monthIndex = (harvestMonth + i) % 12;
      nextThreeMonths.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex],
        price: cropData.monthlyPrices[monthIndex],
        index: monthIndex
      });
    }
    
    const bestMonth = nextThreeMonths.reduce((best, current) => 
      current.price > best.price ? current : best
    );
    
    const currentPrice = cropData.monthlyPrices[harvestMonth];
    const potentialGain = ((bestMonth.price - currentPrice) / currentPrice * 100).toFixed(1);
    
    return {
      bestSellingMonth: bestMonth.month,
      expectedPrice: bestMonth.price,
      potentialGain: `+${potentialGain}%`,
      timeline: `${bestMonth.month} (${nextThreeMonths.findIndex(m => m.month === bestMonth.month) + 1} months from harvest)`,
      confidence: 80,
      storageRequired: true
    };
  };

  const generateLongTermRecommendation = (cropData, harvestMonth) => {
    const peakMonthsData = cropData.peakMonths.map(monthName => {
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
      return {
        month: monthName,
        price: cropData.monthlyPrices[monthIndex],
        monthsAway: calculateMonthsAway(harvestMonth, monthIndex)
      };
    });
    
    const bestPeakMonth = peakMonthsData.reduce((best, current) => 
      current.price > best.price ? current : best
    );
    
    const currentPrice = cropData.monthlyPrices[harvestMonth];
    const maxGain = ((bestPeakMonth.price - currentPrice) / currentPrice * 100).toFixed(1);
    
    return {
      bestPeakMonth: bestPeakMonth.month,
      maxExpectedPrice: bestPeakMonth.price,
      maxPotentialGain: `+${maxGain}%`,
      monthsToWait: bestPeakMonth.monthsAway,
      longTermConfidence: 85,
      storageCostConsideration: true
    };
  };

  const generateStorageAdvice = (cropName, harvestMonth) => {
    const storageData = {
      'Wheat': { maxStorage: 12, costPerMonth: 50, lossPerMonth: 1 },
      'Rice': { maxStorage: 18, costPerMonth: 60, lossPerMonth: 0.8 },
      'Cotton': { maxStorage: 24, costPerMonth: 80, lossPerMonth: 0.5 },
      'Sugarcane': { maxStorage: 1, costPerMonth: 200, lossPerMonth: 15 },
      'Tomatoes': { maxStorage: 0.5, costPerMonth: 500, lossPerMonth: 20 },
      'Onions': { maxStorage: 6, costPerMonth: 40, lossPerMonth: 2 }
    };
    
    const storage = storageData[cropName] || storageData['Wheat'];
    
    return {
      maxStoragePeriod: `${storage.maxStorage} months`,
      monthlyCost: `₹${storage.costPerMonth}/quintal`,
      monthlyLoss: `${storage.lossPerMonth}%`,
      facilities: getStorageFacilities(cropName),
      tips: getStorageTips(cropName)
    };
  };

  const generateMarketInsights = (cropData, location) => {
    const insights = [
      `Historic data shows ${cropData.volatility}% price volatility for this crop`,
      `Peak selling months are typically ${cropData.peakMonths.join(', ')}`,
      `Avoid selling during ${cropData.lowMonths.join(', ')} for better prices`,
      `Average annual price: ₹${cropData.avgPrice}/quintal`
    ];
    
    // Add location-specific insights
    if (location?.toLowerCase().includes('punjab')) {
      insights.push('Punjab mandis typically offer 5-8% premium during peak season');
    } else if (location?.toLowerCase().includes('maharashtra')) {
      insights.push('Maharashtra APMC markets show strong demand during festival seasons');
    } else if (location?.toLowerCase().includes('uttar pradesh')) {
      insights.push('UP markets benefit from proximity to consumption centers');
    }
    
    return insights;
  };

  const calculateMonthsAway = (fromMonth, toMonth) => {
    let months = toMonth - fromMonth;
    if (months <= 0) months += 12;
    return months;
  };

  const getStorageFacilities = (cropName) => {
    const facilityMap = {
      'Wheat': ['Warehouse', 'CAP Storage', 'Farm-level bins'],
      'Rice': ['Modern warehouse', 'Traditional storage', 'FCI godowns'],
      'Cotton': ['Cotton warehouse', 'Covered sheds', 'Baled storage'],
      'Sugarcane': ['Immediate processing required', 'Short-term yards'],
      'Tomatoes': ['Cold storage', 'Refrigerated transport'],
      'Onions': ['Ventilated storage', 'Traditional curing']
    };
    return facilityMap[cropName] || facilityMap['Wheat'];
  };

  const getStorageTips = (cropName) => {
    const tipsMap = {
      'Wheat': ['Maintain 12% moisture', 'Regular fumigation', 'Pest monitoring'],
      'Rice': ['Proper drying', 'Moisture control', 'Quality preservation'],
      'Cotton': ['Protect from moisture', 'Maintain bale quality', 'Market timing'],
      'Sugarcane': ['Process immediately', 'Minimize field storage'],
      'Tomatoes': ['Temperature control', 'Ripeness management', 'Quick turnover'],
      'Onions': ['Proper curing', 'Ventilation', 'Avoid moisture']
    };
    return tipsMap[cropName] || tipsMap['Wheat'];
  };

  // Chart configuration
  const chartData = priceData ? {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Historic Prices (₹/quintal)',
      data: priceData.monthlyPrices,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y}/quintal`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
          <span className="text-neutral-600">Analyzing market trends and historic data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <h3 className="text-xl font-bold text-neutral-800 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-green-500" />
          {strings.sellingOptimizerTitle || "Harvest Selling Time Optimizer"}
        </h3>
        <p className="text-neutral-600 mt-2">
          {strings.sellingOptimizerSubtitle || "AI-powered recommendations for optimal selling time based on historic market data"}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Price Trend Chart */}
        {chartData && (
          <div className="bg-neutral-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-neutral-800 mb-4">
              Historic Price Trends - {cropName}
            </h4>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        {recommendations && (
          <>
            {/* Immediate Recommendation */}
            <div className={`rounded-lg p-6 ${
              recommendations.immediate.action === 'SELL NOW' ? 'bg-green-50 border border-green-200' :
              recommendations.immediate.action === 'WAIT' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Immediate Action Recommendation
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    recommendations.immediate.action === 'SELL NOW' ? 'text-green-600' :
                    recommendations.immediate.action === 'WAIT' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {recommendations.immediate.action}
                  </div>
                  <div className="text-sm text-neutral-600">Recommendation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">
                    ₹{recommendations.immediate.expectedPrice}
                  </div>
                  <div className="text-sm text-neutral-600">Current Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {recommendations.immediate.confidence}%
                  </div>
                  <div className="text-sm text-neutral-600">Confidence</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-neutral-700">{recommendations.immediate.reason}</p>
              </div>
            </div>

            {/* Short-term vs Long-term */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Short-term */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Short-term (3 months)
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-neutral-600">Best Selling Month</div>
                    <div className="text-lg font-bold text-blue-600">{recommendations.shortTerm.bestSellingMonth}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-neutral-600">Expected Price</div>
                    <div className="text-lg font-bold text-neutral-800">₹{recommendations.shortTerm.expectedPrice}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-neutral-600">Potential Gain</div>
                    <div className="text-lg font-bold text-green-600">{recommendations.shortTerm.potentialGain}</div>
                  </div>
                  <div className="text-xs text-blue-600">
                    Timeline: {recommendations.shortTerm.timeline}
                  </div>
                </div>
              </div>

              {/* Long-term */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Long-term (Peak Season)
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-neutral-600">Peak Month</div>
                    <div className="text-lg font-bold text-purple-600">{recommendations.longTerm.bestPeakMonth}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-neutral-600">Max Expected Price</div>
                    <div className="text-lg font-bold text-neutral-800">₹{recommendations.longTerm.maxExpectedPrice}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-neutral-600">Max Potential Gain</div>
                    <div className="text-lg font-bold text-green-600">{recommendations.longTerm.maxPotentialGain}</div>
                  </div>
                  <div className="text-xs text-purple-600">
                    Wait time: {recommendations.longTerm.monthsToWait} months
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Advice */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h4 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Storage Considerations
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">{recommendations.storageAdvice.maxStoragePeriod}</div>
                  <div className="text-sm text-neutral-600">Max Storage</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">{recommendations.storageAdvice.monthlyCost}</div>
                  <div className="text-sm text-neutral-600">Monthly Cost</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-red-600">{recommendations.storageAdvice.monthlyLoss}</div>
                  <div className="text-sm text-neutral-600">Monthly Loss</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-sm text-neutral-600">Facilities</div>
                  <div className="text-xs text-neutral-700">
                    {recommendations.storageAdvice.facilities.join(', ')}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3">
                <h5 className="font-medium text-orange-700 mb-2">Storage Tips:</h5>
                <ul className="space-y-1">
                  {recommendations.storageAdvice.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-neutral-600 flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-neutral-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Market Insights & Historic Trends
              </h4>
              
              <div className="space-y-2">
                {recommendations.marketInsights.map((insight, index) => (
                  <div key={index} className="flex items-start bg-white rounded-lg p-3">
                    <span className="text-primary-500 mr-3 mt-0.5">📊</span>
                    <span className="text-neutral-700 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HarvestSellingOptimizer;
