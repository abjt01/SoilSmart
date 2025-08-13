import React from 'react';

const StyleTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌱 SoilSmart Style Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing colors, gradients, and animations
          </p>
        </div>

        {/* Color Palette Test */}
        <div className="card-3d p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Color Palette</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="w-full h-8 bg-green-500 rounded mb-2"></div>
              <span className="text-sm text-green-800">Green</span>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="w-full h-8 bg-blue-500 rounded mb-2"></div>
              <span className="text-sm text-blue-800">Blue</span>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="w-full h-8 bg-purple-500 rounded mb-2"></div>
              <span className="text-sm text-purple-800">Purple</span>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <div className="w-full h-8 bg-yellow-500 rounded mb-2"></div>
              <span className="text-sm text-yellow-800">Yellow</span>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <div className="w-full h-8 bg-red-500 rounded mb-2"></div>
              <span className="text-sm text-red-800">Red</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="w-full h-8 bg-gray-500 rounded mb-2"></div>
              <span className="text-sm text-gray-800">Gray</span>
            </div>
          </div>
        </div>

        {/* Button Tests */}
        <div className="card-3d p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Button Styles</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">
              🌱 Primary Button
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200">
              📊 Blue Button
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-200">
              🎨 Purple Button
            </button>
          </div>
        </div>

        {/* Gradient Tests */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-2">Gradient Card 1</h3>
            <p>Green to Blue gradient</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-2">Gradient Card 2</h3>
            <p>Purple to Pink gradient</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-2">Gradient Card 3</h3>
            <p>Yellow to Orange gradient</p>
          </div>
        </div>

        {/* Animation Test */}
        <div className="card-3d p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Animation Test</h2>
          <p className="text-gray-600 mb-4">This card should fade in smoothly</p>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-green-800 font-semibold">✅ If you can see colors, gradients, and smooth effects, TailwindCSS is working!</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StyleTest;
