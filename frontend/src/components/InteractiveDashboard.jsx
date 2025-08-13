import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, IndianRupee, Calendar, Target, Award } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const SoilHealthGauge = ({ score, label, color = "#10B981" }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <circle
          cx="50" cy="50" r="45"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-2000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-800">{score}</div>
          <div className="text-xs text-neutral-500">/100</div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-neutral-700">{label}</p>
      </div>
    </div>
  );
};

const ProfitabilityCard = ({ crop, soilSuitability, marketPrice, costPerHectare, expectedYield }) => {
  const yieldInTons = parseFloat(expectedYield.split('-')[0]) || 15;
  const pricePerTon = marketPrice;
  const grossRevenue = yieldInTons * pricePerTon;
  const netProfit = grossRevenue - costPerHectare;
  const profitMargin = ((netProfit / grossRevenue) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-bold text-green-800">{crop}</h4>
        <div className="flex items-center space-x-1 text-green-600">
          <Award className="w-5 h-5" />
          <span className="font-semibold">{soilSuitability}% Suitable</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/70 rounded-lg p-3">
          <div className="text-sm text-green-600 font-medium">Expected Yield</div>
          <div className="text-lg font-bold text-green-800">{yieldInTons} tons/hectare</div>
        </div>
        <div className="bg-white/70 rounded-lg p-3">
          <div className="text-sm text-green-600 font-medium">Market Price</div>
          <div className="text-lg font-bold text-green-800 flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            {pricePerTon.toLocaleString('en-IN')}/ton
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-green-200">
          <span className="text-green-700">Gross Revenue</span>
          <span className="font-bold text-green-800 flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            {grossRevenue.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-green-200">
          <span className="text-green-700">Total Costs</span>
          <span className="font-bold text-red-600 flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            {costPerHectare.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 bg-green-100 rounded-lg px-3">
          <span className="text-green-800 font-semibold">Net Profit</span>
          <div className="text-right">
            <div className="font-bold text-green-800 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              <IndianRupee className="w-4 h-4 mr-1" />
              {netProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-green-600">{profitMargin}% margin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InteractiveDashboard = ({ soilData, recommendations, strings }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!soilData) return null;

  // Indian market prices (₹ per ton)
  const indianMarketPrices = {
    'Tomatoes': 25000, 'Tomato': 25000,
    'Corn': 18000, 'Maize': 18000,
    'Wheat': 22000, 'Rice': 20000,
    'Peppers': 35000, 'Pepper': 35000,
    'Onions': 15000, 'Potato': 12000,
    'Cotton': 55000, 'Sugarcane': 3500
  };

  // Indian cultivation costs (₹ per hectare)
  const cultivationCosts = {
    'Tomatoes': 45000, 'Corn': 25000, 'Wheat': 20000, 
    'Rice': 30000, 'Peppers': 40000, 'Onions': 35000
  };

  // Nutrient status data for radar chart
  const nutrientData = {
    labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Organic Matter', 'pH Balance', 'Moisture'],
    datasets: [{
      label: 'Current Levels',
      data: [
        (soilData.nitrogen / 50) * 100,
        (soilData.phosphorus / 40) * 100,
        (soilData.potassium / 300) * 100,
        (soilData.organicMatter / 8) * 100,
        ((soilData.phLevel - 4) / (8 - 4)) * 100,
        soilData.moistureLevel === 'High' ? 90 : soilData.moistureLevel === 'Medium' ? 60 : 30
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(34, 197, 94, 1)',
    }]
  };

  // Crop profitability comparison
  const profitabilityData = {
    labels: recommendations?.cropSuggestions?.map(crop => crop.cropName) || [],
    datasets: [{
      label: 'Expected Profit (₹/hectare)',
      data: recommendations?.cropSuggestions?.map(crop => {
        const yieldInTons = parseFloat(crop.expectedYield.split('-')[0]) || 15;
        const marketPrice = indianMarketPrices[crop.cropName] || 20000;
        const costs = cultivationCosts[crop.cropName] || 30000;
        return (yieldInTons * marketPrice) - costs;
      }) || [],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(139, 92, 246, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Seasonal planting calendar
  const seasonalData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Optimal Planting Score',
      data: [30, 40, 85, 90, 95, 75, 60, 70, 85, 90, 80, 40],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'nutrients', label: '🧪 Soil Analysis', icon: '🧪' },
    { id: 'profitability', label: '💰 Profitability', icon: '💰' },
    { id: 'recommendations', label: '🌾 Crops', icon: '🌾' },
    { id: 'planning', label: '📅 Planning', icon: '📅' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-neutral-100 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:block">{tab.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Soil Health Metrics */}
          <div className="bg-gradient-to-br from-primary-50 via-white to-earth-50 rounded-xl shadow-lg p-6 border border-neutral-100">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">🌱</span>
              Soil Health Dashboard
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <SoilHealthGauge score={soilData.soilHealthScore} label="Overall Health" color="#10B981" />
              <SoilHealthGauge score={Math.round(((soilData.phLevel - 4) / (8 - 4)) * 100)} label="pH Balance" color="#3B82F6" />
              <SoilHealthGauge score={Math.round((soilData.organicMatter / 8) * 100)} label="Organic Matter" color="#F59E0B" />
              <SoilHealthGauge 
                score={soilData.moistureLevel === 'High' ? 90 : soilData.moistureLevel === 'Medium' ? 65 : 35} 
                label="Moisture Level" 
                color="#8B5CF6" 
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white/70 rounded-lg p-4 text-center border border-neutral-200">
                <div className="text-2xl mb-2">⚗️</div>
                <div className="text-sm text-neutral-600">pH Level</div>
                <div className="text-xl font-bold text-neutral-800">{soilData.phLevel}</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-neutral-200">
                <div className="text-2xl mb-2">🍃</div>
                <div className="text-sm text-neutral-600">Organic Matter</div>
                <div className="text-xl font-bold text-neutral-800">{soilData.organicMatter}%</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-neutral-200">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm text-neutral-600">Texture</div>
                <div className="text-lg font-bold text-neutral-800">{soilData.soilTexture}</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-neutral-200">
                <div className="text-2xl mb-2">🔵</div>
                <div className="text-sm text-neutral-600">Nitrogen</div>
                <div className="text-lg font-bold text-blue-600">{soilData.nitrogen} ppm</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-neutral-200">
                <div className="text-2xl mb-2">🟣</div>
                <div className="text-sm text-neutral-600">Phosphorus</div>
                <div className="text-lg font-bold text-purple-600">{soilData.phosphorus} ppm</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-neutral-200">
                <div className="text-2xl mb-2">🟠</div>
                <div className="text-sm text-neutral-600">Potassium</div>
                <div className="text-lg font-bold text-orange-600">{soilData.potassium} ppm</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nutrients Tab */}
      {activeTab === 'nutrients' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">🧪</span>
              Detailed Soil Analysis
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-neutral-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-neutral-700 mb-4 text-center">Nutrient Profile</h4>
                <div className="h-80">
                  <Radar 
                    data={nutrientData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          grid: { color: 'rgba(0, 0, 0, 0.1)' },
                          pointLabels: { font: { size: 12 } }
                        }
                      },
                      plugins: {
                        legend: { display: false }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Nutrient Details */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-800">Nitrogen (N)</span>
                    <span className="text-blue-600 font-bold">{soilData.nitrogen} ppm</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((soilData.nitrogen / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-blue-700">
                    {soilData.nitrogen > 30 ? 'Excellent' : soilData.nitrogen > 20 ? 'Good' : soilData.nitrogen > 15 ? 'Moderate' : 'Low'} - 
                    Essential for leaf growth and green color
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-purple-800">Phosphorus (P)</span>
                    <span className="text-purple-600 font-bold">{soilData.phosphorus} ppm</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((soilData.phosphorus / 40) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-purple-700">
                    {soilData.phosphorus > 25 ? 'Excellent' : soilData.phosphorus > 15 ? 'Good' : soilData.phosphorus > 10 ? 'Moderate' : 'Low'} - 
                    Critical for root development and flowering
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-orange-800">Potassium (K)</span>
                    <span className="text-orange-600 font-bold">{soilData.potassium} ppm</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-orange-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((soilData.potassium / 300) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-orange-700">
                    {soilData.potassium > 200 ? 'Excellent' : soilData.potassium > 150 ? 'Good' : soilData.potassium > 100 ? 'Moderate' : 'Low'} - 
                    Important for fruit quality and disease resistance
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-green-800">Organic Matter</span>
                    <span className="text-green-600 font-bold">{soilData.organicMatter}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((soilData.organicMatter / 8) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-green-700">
                    {soilData.organicMatter > 5 ? 'Excellent' : soilData.organicMatter > 3 ? 'Good' : soilData.organicMatter > 2 ? 'Moderate' : 'Low'} - 
                    Improves soil structure and water retention
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profitability Tab */}
      {activeTab === 'profitability' && (
        <div className="space-y-6">
          {/* Profit Comparison Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">💰</span>
              Crop Profitability Analysis
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-neutral-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-neutral-700 mb-4 text-center">Expected Profit Comparison (₹/hectare)</h4>
                <div className="h-80">
                  <Bar 
                    data={profitabilityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `₹${context.parsed.y.toLocaleString('en-IN')} profit/hectare`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '₹' + (value / 1000) + 'K';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Investment Analysis */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 border border-green-200">
                  <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Investment Summary
                  </h4>
                  
                  {recommendations?.cropSuggestions?.slice(0, 1).map((crop, index) => {
                    const yieldInTons = parseFloat(crop.expectedYield.split('-')[0]) || 15;
                    const marketPrice = indianMarketPrices[crop.cropName] || 20000;
                    const costs = cultivationCosts[crop.cropName] || 30000;
                    const grossRevenue = yieldInTons * marketPrice;
                    const netProfit = grossRevenue - costs;
                    const roi = ((netProfit / costs) * 100).toFixed(1);

                    return (
                      <div key={index} className="space-y-3">
                        <div className="text-center mb-4">
                          <h5 className="text-xl font-bold text-green-800">{crop.cropName}</h5>
                          <p className="text-green-600">Top Recommended Crop</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/70 rounded-lg p-3">
                            <div className="text-sm text-green-600">Investment</div>
                            <div className="text-lg font-bold text-green-800 flex items-center">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {costs.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-white/70 rounded-lg p-3">
                            <div className="text-sm text-green-600">Expected Revenue</div>
                            <div className="text-lg font-bold text-green-800 flex items-center">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {grossRevenue.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-white/70 rounded-lg p-3">
                            <div className="text-sm text-green-600">Net Profit</div>
                            <div className="text-lg font-bold text-green-800 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {netProfit.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-white/70 rounded-lg p-3">
                            <div className="text-sm text-green-600">ROI</div>
                            <div className="text-lg font-bold text-green-800">{roi}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Risk Assessment */}
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Risk Factors</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Market price fluctuations: ±15-20%</li>
                    <li>• Weather dependency: High</li>
                    <li>• Disease risk: {soilData.soilHealthScore > 70 ? 'Low' : 'Medium'}</li>
                    <li>• Input cost inflation: 5-8% annually</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Crop Profitability Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations?.cropSuggestions?.slice(0, 4).map((crop, index) => (
              <ProfitabilityCard
                key={index}
                crop={crop.cropName}
                soilSuitability={crop.suitabilityScore}
                marketPrice={indianMarketPrices[crop.cropName] || 20000}
                costPerHectare={cultivationCosts[crop.cropName] || 30000}
                expectedYield={crop.expectedYield}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">🌾</span>
              Detailed Crop Recommendations
            </h3>
            
            {recommendations?.cropSuggestions && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.cropSuggestions.map((crop, index) => (
                  <div key={index} className="bg-gradient-to-br from-primary-50 to-earth-50 rounded-xl p-6 border border-primary-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-neutral-800">{crop.cropName}</h4>
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-primary-600" />
                        <span className="text-lg font-bold text-primary-600">{crop.suitabilityScore}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-sm text-neutral-600">Expected Yield</div>
                        <div className="text-lg font-bold text-neutral-800">{crop.expectedYield}</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-sm text-neutral-600">Growth Period</div>
                        <div className="text-lg font-bold text-neutral-800">{crop.growthPeriod}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-green-100 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800">Why Recommended?</div>
                        <div className="text-xs text-green-600 mt-1">
                          Perfect soil pH match, optimal nutrient levels for maximum yield
                        </div>
                      </div>
                      
                      <div className="bg-blue-100 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800">Market Information</div>
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          Current price: 
                          <IndianRupee className="w-3 h-3 mx-1" />
                          {(indianMarketPrices[crop.cropName] || 20000).toLocaleString('en-IN')}/ton
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fertilizer Recommendations */}
          {recommendations?.fertilizers && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
              <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
                <span className="mr-2">🧪</span>
                Fertilizer Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.fertilizers.map((fertilizer, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-neutral-800">{fertilizer.name}</h4>
                      <div className="text-sm font-bold text-purple-600 flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {(fertilizer.cost * 82).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 space-y-1">
                      <div>📦 Quantity: {fertilizer.quantity}</div>
                      <div>📝 Application: {fertilizer.application}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Planning Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">📅</span>
              Agricultural Planning Calendar
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seasonal Planting Chart */}
              <div className="bg-neutral-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-neutral-700 mb-4 text-center">Optimal Planting Periods</h4>
                <div className="h-80">
                  <Line 
                    data={seasonalData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `Planting Score: ${context.parsed.y}%`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Monthly Planning Guide */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-200">
                  <h5 className="font-bold text-green-800 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Best Planting Months
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Kharif Season</span>
                      <span className="font-semibold text-green-800">Jun - Jul</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Rabi Season</span>
                      <span className="font-semibold text-green-800">Oct - Nov</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Zaid Season</span>
                      <span className="font-semibold text-green-800">Mar - Apr</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 className="font-bold text-blue-800 mb-2">🌦️ Weather Considerations</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Monitor monsoon predictions</li>
                    <li>• Avoid extreme temperature periods</li>
                    <li>• Plan irrigation during dry spells</li>
                    <li>• Consider micro-climate variations</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h5 className="font-bold text-yellow-800 mb-2">📋 Pre-Planting Checklist</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• ✓ Soil preparation and tillage</li>
                    <li>• ✓ Seed quality verification</li>
                    <li>• ✓ Irrigation system check</li>
                    <li>• ✓ Fertilizer and pesticide procurement</li>
                    <li>• ✓ Weather forecast review</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDashboard;
