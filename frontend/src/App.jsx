import React, { useState } from 'react';
import UploadCard from './components/UploadCard';
import PremiumLanguageSelector from './components/PremiumLanguageSelector';
import InteractiveDashboard from './components/InteractiveDashboard';
import DownloadReportButton from './components/DownloadReportButton';
import { strings } from './locales/strings';

function App() {
  const [language, setLanguage] = useState('en');
  const [soilData, setSoilData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = strings[language] || strings.en;

  const handleAnalysisComplete = (parsedData, recommendationData) => {
    setSoilData(parsedData);
    setRecommendations(recommendationData);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleReset = () => {
    setSoilData(null);
    setRecommendations(null);
    setError(null);
    setLoading(false);
  };

  // ✅ NEW: Handle logo click to go home
  const handleLogoClick = () => {
    handleReset(); // This will take user back to upload page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* ✅ UPDATED: Clickable logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={handleLogoClick}
              title="Go to Home"
            >
              <div className="text-3xl">🌱</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SoilSmart</h1>
                <p className="text-sm text-gray-600">{t.tagline}</p>
              </div>
            </div>
            <PremiumLanguageSelector 
              language={language} 
              onChange={setLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        {!soilData ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t.welcomeTitle}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t.welcomeSubtitle}
              </p>
            </div>
            
            <UploadCard 
              strings={t}
              onAnalysisComplete={handleAnalysisComplete}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        ) : (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {t.analysisResults}
              </h2>
              <div className="flex items-center space-x-3">
                <DownloadReportButton
                  soilData={soilData}
                  recommendations={recommendations}
                  userContext={{}}
                  strings={t}
                />
                <button
                  onClick={handleReset}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>🔄</span>
                  <span>{t.newAnalysis}</span>
                </button>
              </div>
            </div>
            
            <InteractiveDashboard 
              soilData={soilData}
              recommendations={recommendations}
              strings={t}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold">SoilSmart</span>
            </div>
            <p className="text-gray-400">
              {t.footerText}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              © 2025 SoilSmart. Built with MERN Stack & Gemini AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
