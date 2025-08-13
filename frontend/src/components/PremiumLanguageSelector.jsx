// frontend/src/components/PremiumLanguageSelector.jsx
import React, { useState } from 'react';

const PremiumLanguageSelector = ({ language, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', accent: '#3B82F6' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', accent: '#F59E0B' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', accent: '#10B981' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', accent: '#EF4444' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', accent: '#8B5CF6' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentLang.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
              {currentLang.name}
            </div>
            <div className="text-xs text-neutral-500">{currentLang.nativeName}</div>
          </div>
        </div>
        <svg className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 animate-slide-up">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-neutral-50 ${
                  language === lang.code ? 'bg-primary-50 ring-2 ring-primary-200' : ''
                }`}
                style={{ borderLeft: language === lang.code ? `4px solid ${lang.accent}` : 'none' }}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-semibold text-neutral-800">{lang.name}</div>
                  <div className="text-sm text-neutral-500">{lang.nativeName}</div>
                </div>
                {language === lang.code && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-600 text-center">
              🌍 Supporting farmers worldwide in their native language
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default PremiumLanguageSelector;
