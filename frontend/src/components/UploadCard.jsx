import React, { useState, useRef } from 'react';
import { uploadAndAnalyze } from '../utils/api';
import SoilTestingLabLocator from './SoilTestingLabLocator';

const UploadCard = ({ strings, onAnalysisComplete, onError, loading, setLoading }) => {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [irrigationMethod, setIrrigationMethod] = useState('');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [showLabsSection, setShowLabsSection] = useState(false);
  const [userContext, setUserContext] = useState({
    location: '',
    budget: '',
    cropPreference: ''
  });
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile); setTextInput('');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile); setTextInput('');
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];
    const maxSize = 10 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) { onError(strings.invalidFileType); return false; }
    if (file.size > maxSize) { onError(strings.fileTooLarge); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !textInput.trim()) { onError(strings.noInputProvided); return; }
    setLoading(true);
    try {
      const enhancedContext = {
        ...userContext,
        irrigationMethod,
        expectedHarvestDate
      };
      
      const { soilData, recommendations } = await uploadAndAnalyze(
        file, textInput.trim() || null, enhancedContext
      );
      onAnalysisComplete(soilData, recommendations);
    } catch (error) {
      onError(error.message);
    } finally { setLoading(false); }
  };

  const handleContextChange = (field, value) => {
    setUserContext(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    if (e.target.value.trim()) setFile(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* NEW: Side-by-Side Layout - Testing Labs & Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT SIDE: Testing Labs Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-8 border border-blue-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center">
              <span className="text-3xl lg:text-4xl mr-3">🗺️</span>
              Find Soil Testing Labs Near You
            </h2>
            <p className="text-lg text-blue-700">
              Get your soil tested first! Find certified laboratories in your area for accurate soil analysis.
            </p>
          </div>

          {/* Quick Lab Finder */}
          <div className="bg-white/70 rounded-2xl p-6 mb-6">
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">📍 Your Location</label>
                <input
                  type="text"
                  value={userContext.location}
                  onChange={(e) => handleContextChange('location', e.target.value)}
                  placeholder="Enter your city/district (e.g., Bangalore, Karnataka)"
                  className="w-full rounded-lg border border-blue-200 p-3 focus:ring-2 focus:ring-blue-400 bg-white/80"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowLabsSection(!showLabsSection)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg mr-3"
                >
                  {showLabsSection ? 'Hide Labs' : 'Find Nearby Labs'}
                </button>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">500+</div>
                  <div className="text-xs text-blue-600">Certified Labs</div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-lg mb-1">✅</div>
                <div className="text-xs font-semibold text-green-800">NABL Certified</div>
                <div className="text-xs text-green-600">Govt Approved</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-lg mb-1">⚡</div>
                <div className="text-xs font-semibold text-yellow-800">Quick Results</div>
                <div className="text-xs text-yellow-600">2-5 days</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-lg mb-1">💰</div>
                <div className="text-xs font-semibold text-purple-800">Affordable</div>
                <div className="text-xs text-purple-600">₹150-800</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-lg mb-1">📞</div>
                <div className="text-xs font-semibold text-red-800">Direct Contact</div>
                <div className="text-xs text-red-600">Call & GPS</div>
              </div>
            </div>
          </div>

          {/* Why Test First */}
          <div className="bg-white/50 rounded-2xl p-4">
            <h3 className="text-md font-bold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">🔬</span>
              Why Get Professional Testing?
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">📊 What You'll Get:</h4>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• Detailed NPK analysis</li>
                  <li>• Exact pH levels</li>
                  <li>• Organic matter %</li>
                  <li>• Micronutrient deficiencies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">🎯 Perfect for AI Analysis:</h4>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• Enhanced recommendations</li>
                  <li>• Exact profitability calculations</li>
                  <li>• Irrigation planning</li>
                  <li>• 5-language detailed insights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Upload Section */}
        <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl shadow-2xl p-8 border border-green-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-green-900 mb-4 flex items-center justify-center">
              <span className="text-3xl lg:text-4xl mr-3">🌱</span>
              Already Have Your Soil Test Report?
            </h2>
            <p className="text-lg text-green-700">
              Upload your soil test results and get AI-powered analysis with detailed recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Section */}
            <div>
              <label className="block text-lg font-bold text-green-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">📄</span>
                <span>{strings.uploadReport}</span>
              </label>

              <div
                className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? 'border-green-500 bg-green-50'
                    : file
                    ? 'border-green-300 bg-green-50/40'
                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50/20'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {file ? (
                  <div>
                    <div className="text-3xl mb-2 text-green-500">📋</div>
                    <div className="font-medium text-green-700 text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-2 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-3 text-green-400">📤</div>
                    <div className="text-md font-medium text-gray-700 mb-2">
                      {strings.dragDropText}
                    </div>
                    <div className="text-sm text-gray-500">{strings.supportedFormats}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <div className="text-center mb-3">
                <span className="px-3 py-1 bg-green-100 rounded-full text-sm font-medium text-green-700">
                  {strings.orAlternatively}
                </span>
              </div>
              <label className="block text-md font-semibold text-green-900 mb-2 flex items-center space-x-2">
                <span className="text-xl">✏️</span>
                <span>{strings.pasteText}</span>
              </label>
              <textarea
                value={textInput}
                onChange={handleTextChange}
                placeholder={strings.textPlaceholder}
                rows="4"
                className="w-full rounded-lg border border-green-200 p-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/50 shadow-inner resize-none text-sm"
              />
            </div>

            {/* Basic Information - Compact */}
            <div>
              <h3 className="text-md font-bold text-green-900 mb-3 flex items-center space-x-2">
                <span>📝</span>
                <span>Farm Details</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">📍 Location</label>
                  <input
                    type="text"
                    value={userContext.location}
                    onChange={(e) => handleContextChange('location', e.target.value)}
                    placeholder="e.g., Bangalore, Karnataka"
                    className="w-full rounded-lg border border-gray-200 p-2 focus:ring-2 focus:ring-green-400 bg-white/50 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">💰 Budget (₹)</label>
                    <input
                      type="number"
                      value={userContext.budget}
                      onChange={(e) => handleContextChange('budget', e.target.value)}
                      placeholder="50000"
                      className="w-full rounded-lg border border-gray-200 p-2 focus:ring-2 focus:ring-green-400 bg-white/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🌾 Crop Type</label>
                    <select
                      value={userContext.cropPreference}
                      onChange={(e) => handleContextChange('cropPreference', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2 focus:ring-2 focus:ring-green-400 bg-white/50 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="vegetables">🥕 Vegetables</option>
                      <option value="grains">🌾 Grains</option>
                      <option value="fruits">🍎 Fruits</option>
                      <option value="legumes">🫘 Legumes</option>
                      <option value="cash">💰 Cash Crops</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options - Compact */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">💧 Irrigation Method</label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 focus:ring-2 focus:ring-green-400 bg-white/50 text-sm"
                >
                  <option value="">Select method</option>
                  <option value="drip">💧 Drip (90% Efficient)</option>
                  <option value="sprinkler">🌧️ Sprinkler (75% Efficient)</option>
                  <option value="flood">🌊 Flood (Traditional)</option>
                  <option value="furrow">🚜 Furrow (Row Crops)</option>
                  <option value="subsurface">🏠 Subsurface (Premium)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📅 Expected Harvest Date</label>
                <input
                  type="date"
                  value={expectedHarvestDate}
                  onChange={(e) => setExpectedHarvestDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 focus:ring-2 focus:ring-green-400 bg-white/50 text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!file && !textInput.trim())}
              className={`w-full py-3 rounded-lg text-md font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                loading || (!file && !textInput.trim())
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-yellow-500 text-white hover:from-green-600 hover:to-yellow-600 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{strings.analyzing}</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>{strings.analyzeButton || "Get AI-Powered Analysis"}</span>
                </>
              )}
            </button>

            {loading && (
              <div className="mt-4">
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 animate-pulse" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>🔬 Processing...</span>
                  <span>🤖 AI analysis...</span>
                  <span>📊 Generating...</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Expanded Labs Section - Full Width */}
      {showLabsSection && (
        <div className="animate-slide-up">
          <SoilTestingLabLocator
            userLocation={userContext.location || 'Karnataka, India'}
            strings={strings}
          />
        </div>
      )}

      {/* Enhanced Features Section - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: "🔬",
            title: "Advanced AI Analysis",
            description: "Gemini AI-powered soil composition analysis with detailed nutrient breakdown and health scoring"
          },
          {
            icon: "🌾",
            title: "Smart Crop Recommendations",
            description: "Personalized crop suggestions with profitability analysis and Indian market pricing in ₹"
          },
          {
            icon: "📊",
            title: "Complete Farm Intelligence",
            description: "Lab locations, irrigation planning, harvest timing, and comprehensive PDF reports"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
          >
            <div className="text-4xl mb-4 animate-bounce">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="text-center">
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span className="text-green-500">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">⚡</span>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">🇮🇳</span>
            <span>Made for Indian Farmers</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-purple-500">🌍</span>
            <span>5 Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
