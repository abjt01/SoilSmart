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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* NEW: Testing Labs Section - Prominently Displayed */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-8 border border-blue-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center">
            <span className="text-4xl mr-3">🗺️</span>
            Find Soil Testing Labs Near You
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Get your soil tested first! Find certified laboratories in your area for accurate soil analysis before using our AI recommendations.
          </p>
        </div>

        {/* Quick Lab Finder */}
        <div className="bg-white/70 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <div className="flex items-end">
              <button
                onClick={() => setShowLabsSection(!showLabsSection)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                {showLabsSection ? 'Hide Labs' : 'Find Nearby Labs'}
              </button>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-blue-600">Certified Labs</div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-semibold text-green-800">NABL Certified</div>
              <div className="text-xs text-green-600">Government Approved</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-semibold text-yellow-800">Quick Results</div>
              <div className="text-xs text-yellow-600">2-5 days turnaround</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-semibold text-purple-800">Affordable</div>
              <div className="text-xs text-purple-600">₹150-800 per test</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-2xl mb-2">📞</div>
              <div className="text-sm font-semibold text-red-800">Direct Contact</div>
              <div className="text-xs text-red-600">Call & GPS directions</div>
            </div>
          </div>
        </div>

        {/* Expanded Labs Section */}
        {showLabsSection && (
          <div className="animate-slide-up">
            <SoilTestingLabLocator
              userLocation={userContext.location || 'Karnataka, India'}
              strings={strings}
            />
          </div>
        )}

        {/* Why Test First - Information */}
        <div className="bg-white/50 rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <span className="mr-2">🔬</span>
            Why Get Professional Soil Testing First?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">📊 What You'll Get:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Detailed NPK analysis (Nitrogen, Phosphorus, Potassium)</li>
                <li>• Exact pH levels and soil acidity/alkalinity</li>
                <li>• Organic matter percentage</li>
                <li>• Micronutrient deficiencies (Zinc, Boron, etc.)</li>
                <li>• Soil texture and water retention capacity</li>
                <li>• Professional fertilizer recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Perfect for SoilSmart AI:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload your lab report to our AI analyzer</li>
                <li>• Get enhanced recommendations with market prices</li>
                <li>• Calculate exact profitability and ROI</li>
                <li>• Plan irrigation and harvest timing</li>
                <li>• Generate comprehensive farming strategy</li>
                <li>• 5-language support for detailed insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Upload Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl shadow-2xl p-8 border border-green-100 backdrop-blur-lg hover:shadow-green-200/60 transition-all duration-500"
      >
        {/* Upload Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-900 mb-4 flex items-center justify-center">
            <span className="text-4xl mr-3">🌱</span>
            Already Have Your Soil Test Report?
          </h2>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Upload your soil test results and get AI-powered analysis with detailed recommendations and profitability insights.
          </p>
        </div>

        <label className="block text-xl font-bold text-green-900 mb-6 flex items-center space-x-2">
          <span className="text-3xl">📄</span>
          <span>{strings.uploadReport}</span>
        </label>

        <div
          className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
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
              <div className="text-4xl mb-3 text-green-500">📋</div>
              <div className="font-medium text-green-700">{file.name}</div>
              <div className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-2 text-sm text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4 text-green-400">📤</div>
              <div className="text-lg font-medium text-gray-700 mb-2">
                {strings.dragDropText}
              </div>
              <div className="text-sm text-gray-500">{strings.supportedFormats}</div>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="my-8">
          <div className="text-center mb-4">
            <span className="px-4 py-2 bg-green-100 rounded-full text-sm font-medium text-green-700">
              {strings.orAlternatively}
            </span>
          </div>
          <label className="block text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
            <span className="text-2xl">✏️</span>
            <span>{strings.pasteText}</span>
          </label>
          <textarea
            value={textInput}
            onChange={handleTextChange}
            placeholder={strings.textPlaceholder}
            rows="6"
            className="w-full rounded-lg border border-green-200 p-4 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/50 shadow-inner resize-none"
          />
        </div>

        {/* Enhanced User Context Section */}
        <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center space-x-2">
          <span>📝</span>
          <span>Farm Details & Preferences</span>
        </h3>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📍 {strings.location}</label>
            <input
              type="text"
              value={userContext.location}
              onChange={(e) => handleContextChange('location', e.target.value)}
              placeholder={strings.locationPlaceholder || "e.g., Bangalore, Karnataka"}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">💰 Budget (₹)</label>
            <input
              type="number"
              value={userContext.budget}
              onChange={(e) => handleContextChange('budget', e.target.value)}
              placeholder="50000"
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🌾 {strings.cropPreference}</label>
            <select
              value={userContext.cropPreference}
              onChange={(e) => handleContextChange('cropPreference', e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            >
              <option value="">{strings.selectCrop}</option>
              <option value="vegetables">🥕 {strings.vegetables || "Vegetables"}</option>
              <option value="grains">🌾 {strings.grains || "Grains"}</option>
              <option value="fruits">🍎 {strings.fruits || "Fruits"}</option>
              <option value="legumes">🫘 {strings.legumes || "Legumes"}</option>
              <option value="cash">💰 Cash Crops</option>
            </select>
          </div>
        </div>

        {/* Enhanced Agricultural Planning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💧 Preferred Irrigation Method
            </label>
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            >
              <option value="">Select irrigation method</option>
              <option value="drip">💧 Drip Irrigation (Most Efficient - 90%)</option>
              <option value="sprinkler">🌧️ Sprinkler Irrigation (75% Efficient)</option>
              <option value="flood">🌊 Flood/Basin Irrigation (Traditional)</option>
              <option value="furrow">🚜 Furrow Irrigation (Row Crops)</option>
              <option value="subsurface">🏠 Subsurface Irrigation (Premium)</option>
            </select>
            <div className="mt-1 text-xs text-gray-500">
              💡 This will help calculate water requirements and costs
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Expected Harvest Date
            </label>
            <input
              type="date"
              value={expectedHarvestDate}
              onChange={(e) => setExpectedHarvestDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="mt-1 text-xs text-gray-500">
              📈 For optimal selling time recommendations
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (!file && !textInput.trim())}
          className={`w-full py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-3 transition-all duration-300 ${
            loading || (!file && !textInput.trim())
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-yellow-500 text-white hover:from-green-600 hover:to-yellow-600 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
          <div className="mt-6">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute h-full bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 animate-pulse" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>🔬 Processing soil data...</span>
              <span>🤖 AI analysis in progress...</span>
              <span>📊 Generating insights...</span>
            </div>
          </div>
        )}
      </form>

      {/* Enhanced Features Section */}
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
