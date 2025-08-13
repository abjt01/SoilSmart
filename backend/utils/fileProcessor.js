const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

/**
 * Process uploaded file and extract text
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - Extracted text
 */
async function processFile(file) {
  const { mimetype, buffer } = file;

  try {
    switch (mimetype) {
      case 'application/pdf':
        return await extractTextFromPDF(buffer);
      
      case 'image/png':
      case 'image/jpeg':
        return await extractTextFromImage(buffer);
      
      case 'text/plain':
        return buffer.toString('utf-8');
      
      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
}

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(buffer) {
  try {
    console.log('📄 Processing PDF file...');
    const data = await pdfParse(buffer);
    console.log(`✅ PDF processed - extracted ${data.text.length} characters`);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

/**
 * Extract text from image buffer using OCR
 * @param {Buffer} buffer - Image file buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromImage(buffer) {
  try {
    console.log('🖼️ Processing image with OCR...');
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    console.log(`✅ OCR completed - extracted ${text.length} characters`);
    return text;
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

module.exports = {
  processFile,
  extractTextFromPDF,
  extractTextFromImage
};