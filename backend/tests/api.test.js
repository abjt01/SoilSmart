const request = require('supertest');
const app = require('../app');

describe('SoilSmart API with Gemini AI', () => {
  
  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service', 'SoilSmart Backend');
    });
  });

  describe('POST /api/parse-soil', () => {
    it('should parse soil report from text input', async () => {
      const testText = `
        Soil Analysis Report
        pH Level: 6.5
        Organic Matter: 4.2%
        Nitrogen: 25 ppm
        Phosphorus: 18 ppm
        Potassium: 180 ppm
        Soil Texture: Loam
        Moisture: Medium
      `;

      const response = await request(app)
        .post('/api/parse-soil')
        .send({ text: testText })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('phLevel');
      expect(response.body.data).toHaveProperty('organicMatter');
      expect(response.body.data).toHaveProperty('nitrogen');
      expect(response.body.data).toHaveProperty('phosphorus');
      expect(response.body.data).toHaveProperty('potassium');
      expect(response.body.data).toHaveProperty('soilTexture');
      expect(response.body.data).toHaveProperty('soilHealthScore');
    });

    it('should return error for empty input', async () => {
      const response = await request(app)
        .post('/api/parse-soil')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/recommend', () => {
    const sampleSoilData = {
      soilHealthScore: 75,
      phLevel: 6.5,
      organicMatter: 4.2,
      nitrogen: 25,
      phosphorus: 18,
      potassium: 180,
      soilTexture: "Loam",
      moistureLevel: "Medium"
    };

    it('should generate recommendations from soil data', async () => {
      const response = await request(app)
        .post('/api/recommend')
        .send({
          soilData: sampleSoilData,
          userContext: {
            location: "Karnataka, India",
            budget: 2000,
            cropPreference: "vegetables"
          }
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('cropSuggestions');
      expect(response.body.data).toHaveProperty('fertilizers');
      expect(response.body.data).toHaveProperty('soilImprovements');
      expect(response.body.data).toHaveProperty('irrigationAdvice');
      expect(response.body.data).toHaveProperty('totalBudgetEstimate');
    });

    it('should return error for missing soil data', async () => {
      const response = await request(app)
        .post('/api/recommend')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});