import React, { useState, useRef } from 'react';
import { uploadAndAnalyze } from '../utils/api';

const UploadCard = ({ strings, onAnalysisComplete, onError, loading, setLoading }) => {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
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
      const { soilData, recommendations } = await uploadAndAnalyze(
        file, textInput.trim() || null, userContext
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
    <div className="max-w-3xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-3xl shadow-2xl p-8 border border-green-100 backdrop-blur-lg hover:shadow-green-200/60 transition-all duration-500"
      >
        {/* Upload Section */}
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

        {/* Additional Optional Details */}
        <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center space-x-2">
          <span>📝</span>
          <span>Additional Details (Optional)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">📍 {strings.location}</label>
            <input
              type="text"
              value={userContext.location}
              onChange={(e) => handleContextChange('location', e.target.value)}
              placeholder={strings.locationPlaceholder}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">💰 Budget (INR)</label>
            <input
              type="number"
              value={userContext.budget}
              onChange={(e) => handleContextChange('budget', e.target.value)}
              placeholder="50000"
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">🌾 {strings.cropPreference}</label>
            <select
              value={userContext.cropPreference}
              onChange={(e) => handleContextChange('cropPreference', e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-green-400 bg-white/50"
            >
              <option value="">{strings.selectCrop}</option>
              <option value="vegetables">🥕 {strings.vegetables}</option>
              <option value="grains">🌾 {strings.grains}</option>
              <option value="fruits">🍎 {strings.fruits}</option>
              <option value="legumes">🫘 {strings.legumes}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (!file && !textInput.trim())}
          className={`w-full py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-3 transition-all duration-300 ${
            loading || (!file && !textInput.trim())
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-yellow-500 text-white hover:from-green-600 hover:to-yellow-600 hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{strings.analyzing}</span>
            </>
          ) : (
            <>
              <span>🔬</span>
              <span>{strings.analyzeButton}</span>
            </>
          )}
        </button>

        {/* Loading Bar */}
        {loading && (
          <div className="mt-4">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="absolute h-full bg-gradient-to-r from-green-500 to-yellow-500 animate-pulse" style={{ width: '70%' }}></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">{strings.processingMessage}</p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔬",
              title: "Advanced Analysis",
              description: "AI-powered soil composition analysis with detailed nutrient breakdown"
            },
            {
              icon: "🌾",
              title: "Crop Recommendations",
              description: "Personalized crop suggestions based on your soil profile and location"
            },
            {
              icon: "📊",
              title: "Actionable Insights",
              description: "Clear, actionable recommendations to improve soil health and yield"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-green-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default UploadCard;
