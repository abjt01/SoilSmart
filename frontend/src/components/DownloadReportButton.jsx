import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Chart } from 'chart.js/auto';

const DownloadReportButton = ({ soilData, recommendations, userContext, strings }) => {
  const [downloading, setDownloading] = useState(false);

  const generateChartImage = async (chartConfig, width = 400, height = 300) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      const chart = new Chart(ctx, chartConfig);
      
      setTimeout(() => {
        const imageData = canvas.toDataURL('image/png');
        chart.destroy();
        resolve(imageData);
      }, 500);
    });
  };

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
    pdf.text('Soil Health Analysis', 15, yPos);
    yPos += 10;
    
    // Health score gauge
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw gauge
    const centerX = 100;
    const centerY = 100;
    const radius = 70;
    const score = soilData.soilHealthScore;
    
    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 12;
    ctx.stroke();
    
    // Progress arc
    const angle = (score / 100) * 2 * Math.PI - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle);
    ctx.strokeStyle = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Score text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score, centerX, centerY + 10);
    ctx.font = '14px Arial';
    ctx.fillText('/100', centerX, centerY + 30);
    
    const gaugeImage = canvas.toDataURL('image/png');
    pdf.addImage(gaugeImage, 'PNG', 15, yPos, 50, 50);
    
    // Soil parameters table
    pdf.setFontSize(14);
    pdf.text('Soil Parameters:', 80, yPos + 10);
    
    const parameters = [
      ['pH Level', `${soilData.phLevel}`],
      ['Organic Matter', `${soilData.organicMatter}%`],
      ['Nitrogen (N)', `${soilData.nitrogen} ppm`],
      ['Phosphorus (P)', `${soilData.phosphorus} ppm`],
      ['Potassium (K)', `${soilData.potassium} ppm`],
      ['Soil Texture', soilData.soilTexture],
      ['Moisture Level', soilData.moistureLevel]
    ];
    
    let tableY = yPos + 15;
    pdf.setFontSize(11);
    parameters.forEach(([label, value]) => {
      pdf.text(label + ':', 80, tableY);
      pdf.text(value, 140, tableY);
      tableY += 6;
    });
    
    yPos += 60;
    
    // Profitability Analysis
    pdf.addPage();
    yPos = 20;
    
    pdf.setFontSize(18);
    pdf.text('Profitability Analysis', 15, yPos);
    yPos += 15;
    
    if (recommendations?.cropSuggestions) {
      const indianMarketPrices = {
        'Tomatoes': 25000, 'Corn': 18000, 'Wheat': 22000, 
        'Rice': 20000, 'Peppers': 35000, 'Onions': 15000
      };
      
      const cultivationCosts = {
        'Tomatoes': 45000, 'Corn': 25000, 'Wheat': 20000, 
        'Rice': 30000, 'Peppers': 40000, 'Onions': 35000
      };
      
      recommendations.cropSuggestions.forEach((crop, index) => {
        const yieldInTons = parseFloat(crop.expectedYield.split('-')[0]) || 15;
        const marketPrice = indianMarketPrices[crop.cropName] || 20000;
        const costs = cultivationCosts[crop.cropName] || 30000;
        const grossRevenue = yieldInTons * marketPrice;
        const netProfit = grossRevenue - costs;
        const roi = ((netProfit / costs) * 100).toFixed(1);
        
        // Crop profitability box
        pdf.setFillColor(240, 253, 244);
        pdf.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
        
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${index + 1}. ${crop.cropName}`, 20, yPos + 3);
        
        pdf.setFontSize(10);
        pdf.text(`Suitability: ${crop.suitabilityScore}%`, 20, yPos + 8);
        pdf.text(`Expected Yield: ${crop.expectedYield}`, 20, yPos + 13);
        pdf.text(`Investment: ₹${costs.toLocaleString('en-IN')}`, 20, yPos + 18);
        
        pdf.text(`Market Price: ₹${marketPrice.toLocaleString('en-IN')}/ton`, 100, yPos + 8);
        pdf.text(`Gross Revenue: ₹${grossRevenue.toLocaleString('en-IN')}`, 100, yPos + 13);
        pdf.text(`Net Profit: ₹${netProfit.toLocaleString('en-IN')}`, 100, yPos + 18);
        pdf.text(`ROI: ${roi}%`, 100, yPos + 23);
        
        yPos += 40;
      });
    }
    
    // Financial Summary
    yPos += 10;
    pdf.setFillColor(254, 249, 195);
    pdf.rect(15, yPos, pageWidth - 30, 25, 'F');
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Financial Summary', 20, yPos + 8);
    
    if (recommendations?.totalBudgetEstimate) {
      const totalBudgetINR = recommendations.totalBudgetEstimate * 82;
      pdf.setFontSize(12);
      pdf.text(`Total Investment Required: ₹${totalBudgetINR.toLocaleString('en-IN')}`, 20, yPos + 15);
      pdf.text(`Expected ROI: 45-65% annually`, 20, yPos + 20);
    }
    
    // Recommendations page
    pdf.addPage();
    yPos = 20;
    
    pdf.setFontSize(18);
    pdf.text('Agricultural Recommendations', 15, yPos);
    yPos += 15;
    
    // Fertilizer recommendations
    if (recommendations?.fertilizers) {
      pdf.setFontSize(14);
      pdf.text('Fertilizer Program:', 15, yPos);
      yPos += 8;
      
      recommendations.fertilizers.forEach((fertilizer, index) => {
        const costINR = fertilizer.cost * 82;
        pdf.setFontSize(11);
        pdf.text(`${index + 1}. ${fertilizer.name}`, 20, yPos);
        pdf.text(`Quantity: ${fertilizer.quantity}`, 25, yPos + 5);
        pdf.text(`Cost: ₹${costINR.toLocaleString('en-IN')}`, 25, yPos + 10);
        pdf.text(`Application: ${fertilizer.application}`, 25, yPos + 15);
        yPos += 22;
      });
    }
    
    // Soil improvements
    if (recommendations?.soilImprovements) {
      yPos += 5;
      pdf.setFontSize(14);
      pdf.text('Soil Improvement Measures:', 15, yPos);
      yPos += 8;
      
      recommendations.soilImprovements.forEach((improvement, index) => {
        pdf.setFontSize(11);
        pdf.text(`${index + 1}. ${improvement}`, 20, yPos);
        yPos += 6;
      });
    }
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by SoilSmart AI - Empowering Indian farmers with intelligent insights', 15, pageHeight - 10);
    pdf.text('Disclaimer: Prices and recommendations are estimates. Actual results may vary based on market conditions.', 15, pageHeight - 6);
    
    // Save the PDF
    pdf.save(`SoilSmart-Detailed-Report-${Date.now()}.pdf`);
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
          <span>Download Detailed Report</span>
        </>
      )}
    </button>
  );
};

export default DownloadReportButton;
