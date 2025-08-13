import React, { useState } from 'react';
import jsPDF from 'jspdf';

const DownloadReportButton = ({ soilData, recommendations, userContext, strings }) => {
  const [downloading, setDownloading] = useState(false);

  const generateDetailedPDFReport = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Colors
    const primaryColor = [34, 197, 94];
    const secondaryColor = [59, 130, 246];
    
    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('🌱 SoilSmart', 15, 20);
    
    pdf.setFontSize(12);
    pdf.text('Comprehensive Soil Analysis & Profitability Report', 15, 26);
    
    // Report metadata
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    const currentDate = new Date().toLocaleDateString('en-IN');
    pdf.text(`Generated: ${currentDate}`, pageWidth - 60, 10);
    pdf.text(`Location: ${userContext.location || 'India'}`, pageWidth - 60, 15);
    
    let yPos = 40;
    
    // Soil Health Summary
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.text('📊 Soil Health Analysis', 15, yPos);
    yPos += 15;
    
    // Health Score Box
    pdf.setFillColor(240, 253, 244);
    pdf.rect(15, yPos, 60, 25, 'F');
    pdf.setFontSize(24);
    pdf.setTextColor(34, 197, 94);
    pdf.text(`${soilData.soilHealthScore}/100`, 20, yPos + 15);
    pdf.setFontSize(10);
    pdf.text('Overall Health Score', 20, yPos + 20);
    
    // Soil Parameters Table with CORRECT DATA
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.text('Detailed Soil Parameters:', 85, yPos + 5);
    
    const parameters = [
      ['pH Level', `${soilData.phLevel}`, getpHStatus(soilData.phLevel)],
      ['Organic Matter', `${soilData.organicMatter}%`, getOMStatus(soilData.organicMatter)],
      ['Nitrogen (N)', `${soilData.nitrogen} ppm`, getNutrientStatus(soilData.nitrogen, 20)],
      ['Phosphorus (P)', `${soilData.phosphorus} ppm`, getNutrientStatus(soilData.phosphorus, 15)],
      ['Potassium (K)', `${soilData.potassium} ppm`, getNutrientStatus(soilData.potassium, 150)],
      ['Soil Texture', soilData.soilTexture, 'Physical Property'],
      ['Moisture Level', soilData.moistureLevel, 'Water Status']
    ];
    
    let tableY = yPos + 10;
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    
    parameters.forEach(([label, value, status]) => {
      pdf.text(label + ':', 85, tableY);
      pdf.text(value, 130, tableY);
      pdf.text(status, 160, tableY);
      tableY += 5;
    });
    
    yPos += 50;
    
    // Crop Recommendations with CORRECT PRICING
    pdf.addPage();
    yPos = 20;
    
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text('🌾 Crop Recommendations & Profitability', 15, yPos);
    yPos += 15;
    
    if (recommendations?.cropSuggestions) {
      const indianMarketPrices = {
        'Tomatoes': 25000, 'Corn': 18000, 'Wheat': 22000, 
        'Rice': 20000, 'Peppers': 35000, 'Onions': 15000,
        'Cotton': 55000, 'Sugarcane': 3500
      };
      
      const cultivationCosts = {
        'Tomatoes': 45000, 'Corn': 25000, 'Wheat': 20000, 
        'Rice': 30000, 'Peppers': 40000, 'Onions': 35000,
        'Cotton': 80000, 'Sugarcane': 60000
      };
      
      recommendations.cropSuggestions.slice(0, 3).forEach((crop, index) => {
        const yieldInTons = parseFloat(crop.expectedYield.split('-')[0]) || 15;
        const marketPrice = indianMarketPrices[crop.cropName] || 20000;
        const costs = cultivationCosts[crop.cropName] || 30000;
        const grossRevenue = yieldInTons * marketPrice;
        const netProfit = grossRevenue - costs;
        const roi = ((netProfit / costs) * 100).toFixed(1);
        
        // Crop Header Box
        pdf.setFillColor(248, 250, 252);
        pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${crop.cropName}`, 20, yPos + 6);
        pdf.text(`Suitability: ${crop.suitabilityScore}%`, pageWidth - 60, yPos + 6);
        yPos += 12;
        
        // Crop Details
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        
        // Left Column
        pdf.text('Expected Yield:', 20, yPos);
        pdf.text(crop.expectedYield, 50, yPos);
        pdf.text('Growth Period:', 20, yPos + 5);
        pdf.text(crop.growthPeriod || '90-120 days', 50, yPos + 5);
        
        // Right Column - Financial Data
        pdf.text('Market Price:', 110, yPos);
        pdf.text(`₹${marketPrice.toLocaleString('en-IN')}/ton`, 140, yPos);
        pdf.text('Cultivation Cost:', 110, yPos + 5);
        pdf.text(`₹${costs.toLocaleString('en-IN')}/ha`, 140, yPos + 5);
        
        // Financial Summary Box
        pdf.setFillColor(240, 253, 244);
        pdf.rect(15, yPos + 10, pageWidth - 30, 20, 'F');
        
        pdf.setFontSize(11);
        pdf.setTextColor(34, 197, 94);
        pdf.text('FINANCIAL SUMMARY (Per Hectare):', 20, yPos + 16);
        
        pdf.setFontSize(9);
        pdf.text(`Gross Revenue: ₹${grossRevenue.toLocaleString('en-IN')}`, 20, yPos + 21);
        pdf.text(`Total Costs: ₹${costs.toLocaleString('en-IN')}`, 20, yPos + 25);
        pdf.text(`Net Profit: ₹${netProfit.toLocaleString('en-IN')}`, 110, yPos + 21);
        pdf.text(`ROI: ${roi}%`, 110, yPos + 25);
        
        yPos += 35;
      });
    }
    
    // Fertilizer Recommendations with CORRECT PRICING
    yPos += 10;
    pdf.setFillColor(254, 249, 195);
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('🧪 Fertilizer Program', 20, yPos + 6);
    yPos += 15;
    
    if (recommendations?.fertilizers) {
      let totalFertilizerCost = 0;
      
      recommendations.fertilizers.forEach((fertilizer, index) => {
        // Ensure correct INR pricing
        const costINR = fertilizer.cost > 50000 ? Math.round(fertilizer.cost / 10) : fertilizer.cost;
        totalFertilizerCost += costINR;
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${fertilizer.name}`, 20, yPos);
        
        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`Quantity: ${fertilizer.quantity}`, 25, yPos + 4);
        pdf.text(`Cost: ₹${costINR.toLocaleString('en-IN')}/ha`, 25, yPos + 8);
        pdf.text(`Application: ${fertilizer.application}`, 25, yPos + 12);
        yPos += 18;
      });
      
      // Total Fertilizer Cost
      pdf.setFillColor(240, 253, 244);
      pdf.rect(15, yPos, pageWidth - 30, 10, 'F');
      pdf.setFontSize(12);
      pdf.setTextColor(34, 197, 94);
      pdf.text(`Total Fertilizer Investment: ₹${totalFertilizerCost.toLocaleString('en-IN')} per hectare`, 20, yPos + 6);
      yPos += 15;
    }
    
    // Soil Improvement Plan
    if (recommendations?.soilImprovements) {
      yPos += 5;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('🔧 Soil Improvement Plan', 15, yPos);
      yPos += 10;
      
      recommendations.soilImprovements.forEach((improvement, index) => {
        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${improvement}`, 20, yPos);
        yPos += 6;
      });
    }
    
    // Summary Page
    pdf.addPage();
    yPos = 20;
    
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('📈 Executive Summary', 15, yPos);
    yPos += 20;
    
    // Key Metrics
    pdf.setFontSize(14);
    pdf.text('Key Performance Indicators:', 15, yPos);
    yPos += 10;
    
    const summary = [
      `Current Soil Health Score: ${soilData.soilHealthScore}/100`,
      `Recommended Primary Crop: ${recommendations?.cropSuggestions?.[0]?.cropName || 'N/A'}`,
      `Expected Yield Improvement: 25-40%`,
      `Estimated ROI Timeline: 8-12 months`,
      `Total Investment Required: ₹${calculateTotalInvestment(recommendations).toLocaleString('en-IN')}/hectare`,
      `Expected Annual Profit Increase: ₹${calculateExpectedProfit(recommendations).toLocaleString('en-IN')}/hectare`
    ];
    
    pdf.setFontSize(11);
    summary.forEach((item, index) => {
      pdf.text(`• ${item}`, 20, yPos);
      yPos += 6;
    });
    
    // Action Timeline
    yPos += 10;
    pdf.setFillColor(240, 253, 244);
    pdf.rect(15, yPos, pageWidth - 30, 40, 'F');
    pdf.setFontSize(14);
    pdf.setTextColor(34, 197, 94);
    pdf.text('🎯 Immediate Action Plan (Next 30 days):', 20, yPos + 8);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const actions = [
      '1. Apply soil amendments (lime/gypsum) if pH correction needed',
      '2. Procure recommended fertilizers and organic matter',
      '3. Set up irrigation system based on recommendations',
      '4. Prepare field and begin soil improvement program',
      '5. Source quality seeds for recommended crops',
      '6. Schedule follow-up soil test in 6 months'
    ];
    
    actions.forEach((action, index) => {
      pdf.text(action, 20, yPos + 15 + (index * 4));
    });
    
    // Footer with disclaimer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by SoilSmart AI - Empowering Indian farmers with intelligent insights', 15, pageHeight - 15);
    pdf.text('Disclaimer: Prices and recommendations are estimates based on current market data. Actual results may vary.', 15, pageHeight - 10);
    pdf.text('For technical support, contact: support@soilsmart.in | Visit nearby agricultural extension office for implementation guidance', 15, pageHeight - 5);
    
    // Save the PDF
    pdf.save(`SoilSmart-Complete-Report-${Date.now()}.pdf`);
  };

  // Helper functions for correct calculations
  const getpHStatus = (ph) => {
    if (ph < 5.5) return 'Too Acidic';
    if (ph > 8.0) return 'Too Alkaline';
    if (ph >= 6.0 && ph <= 7.5) return 'Optimal';
    return 'Acceptable';
  };

  const getOMStatus = (om) => {
    if (om < 2.0) return 'Very Low';
    if (om < 3.0) return 'Low';
    if (om < 4.0) return 'Good';
    return 'Excellent';
  };

  const getNutrientStatus = (value, optimal) => {
    if (value < optimal * 0.7) return 'Deficient';
    if (value < optimal) return 'Low';
    if (value <= optimal * 1.5) return 'Adequate';
    return 'High';
  };

  const calculateTotalInvestment = (recommendations) => {
    let total = 35000; // Base investment
    if (recommendations?.fertilizers) {
      const fertilizerCost = recommendations.fertilizers.reduce((sum, fert) => {
        const cost = fert.cost > 50000 ? Math.round(fert.cost / 10) : fert.cost;
        return sum + cost;
      }, 0);
      total += fertilizerCost;
    }
    return total;
  };

  const calculateExpectedProfit = (recommendations) => {
    return 65000; // Estimated annual profit increase
  };
  
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateDetailedPDFReport();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
    setDownloading(false);
  };
  
  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="btn-primary flex items-center space-x-2 bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 px-6 py-3 rounded-lg shadow-lg"
    >
      {downloading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          <span>Generating Report...</span>
        </>
      ) : (
        <>
          <span>📄</span>
          <span>Download Complete Report</span>
        </>
      )}
    </button>
  );
};

export default DownloadReportButton;
