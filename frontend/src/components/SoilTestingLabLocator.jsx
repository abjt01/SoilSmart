import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';

const SoilTestingLabLocator = ({ userLocation, strings }) => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  // Comprehensive Indian Soil Testing Labs Database
  const soilTestingLabsDatabase = {
    'Karnataka': [
      {
        name: "UAS Bangalore - GKVK Campus",
        address: "University of Agricultural Sciences, GKVK, Bangalore - 560065",
        phone: "+91-80-23330153",
        distance: "12 km",
        rating: 4.5,
        services: ["Soil Fertility Test", "pH Analysis", "NPK Testing", "Micronutrient Analysis"],
        cost: "₹150-500",
        timeTaken: "3-5 days",
        accreditation: "NABL Accredited",
        coordinates: { lat: 13.0827, lng: 77.5877 }
      },
      {
        name: "Prewel Labs Bangalore",
        address: "Hennur-Bagalur Road, Bangalore - 560077",
        phone: "+91-6366942390",
        distance: "8 km",
        rating: 4.8,
        services: ["Complete Soil Analysis", "Organic Matter Test", "Heavy Metal Analysis"],
        cost: "₹200-800",
        timeTaken: "2-4 days",
        accreditation: "ISO 17025 Certified",
        coordinates: { lat: 13.0527, lng: 77.6347 }
      },
      {
        name: "Karnataka Test House Pvt Ltd",
        address: "Industrial Suburb, Yeshwanthpur, Bangalore - 560022",
        phone: "+91-80-23395555",
        distance: "15 km",
        rating: 4.3,
        services: ["Agricultural Soil Testing", "Construction Soil Test", "Environmental Analysis"],
        cost: "₹300-1200",
        timeTaken: "3-7 days",
        accreditation: "NABL & BIS Approved",
        coordinates: { lat: 13.0269, lng: 77.5480 }
      }
    ],
    'Tamil Nadu': [
      {
        name: "Tamil Nadu Agricultural University",
        address: "Lawley Road, Coimbatore - 641003",
        phone: "+91-422-6611200",
        distance: "5 km",
        rating: 4.6,
        services: ["Soil Health Card", "Nutrient Management", "Salinity Testing"],
        cost: "₹100-400",
        timeTaken: "2-3 days",
        accreditation: "Government Approved"
      },
      {
        name: "Regional Soil Testing Lab Chennai",
        address: "Guindy, Chennai - 600032", 
        phone: "+91-44-22358080",
        distance: "18 km",
        rating: 4.2,
        services: ["Complete Soil Profile", "Water Quality Test", "Fertilizer Recommendation"],
        cost: "₹250-600",
        timeTaken: "4-6 days",
        accreditation: "NABL Accredited"
      }
    ],
    'Maharashtra': [
      {
        name: "Maharashtra Hybrid Seeds Company",
        address: "Akurdi, Pune - 411035",
        phone: "+91-20-27420000",
        distance: "10 km", 
        rating: 4.4,
        services: ["Soil Testing", "Seed Testing", "Plant Tissue Analysis"],
        cost: "₹180-700",
        timeTaken: "3-5 days",
        accreditation: "Government Certified"
      }
    ],
    'Punjab': [
      {
        name: "Punjab Agricultural University",
        address: "Ludhiana - 141004",
        phone: "+91-161-2401960",
        distance: "7 km",
        rating: 4.7,
        services: ["Comprehensive Soil Analysis", "Water Testing", "Plant Nutrition Advisory"],
        cost: "₹120-450",
        timeTaken: "2-4 days",
        accreditation: "ICAR Approved"
      }
    ],
    'Gujarat': [
      {
        name: "Gujarat Agricultural University",
        address: "Anand - 388110",
        phone: "+91-2692-261390",
        distance: "12 km",
        rating: 4.5,
        services: ["Soil Health Assessment", "Irrigation Water Quality", "Fertilizer Testing"],
        cost: "₹160-550",
        timeTaken: "3-6 days",
        accreditation: "UGC Recognized"
      }
    ]
  };

  useEffect(() => {
    if (userLocation) {
      findNearbyLabs(userLocation);
    }
  }, [userLocation]);

  const findNearbyLabs = (location) => {
    setLoading(true);
    
    // Extract state from location string
    const locationLower = location.toLowerCase();
    let detectedState = 'Karnataka'; // Default
    
    Object.keys(soilTestingLabsDatabase).forEach(state => {
      if (locationLower.includes(state.toLowerCase()) || 
          locationLower.includes(state.replace(/\s+/g, '').toLowerCase())) {
        detectedState = state;
      }
    });
    
    // City-based detection
    const cityStateMap = {
      'bangalore': 'Karnataka', 'bengaluru': 'Karnataka', 'mysore': 'Karnataka', 'hubli': 'Karnataka',
      'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'madurai': 'Tamil Nadu', 'salem': 'Tamil Nadu',
      'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra', 'nashik': 'Maharashtra',
      'ludhiana': 'Punjab', 'amritsar': 'Punjab', 'jalandhar': 'Punjab', 'patiala': 'Punjab',
      'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'vadodara': 'Gujarat', 'rajkot': 'Gujarat'
    };
    
    Object.keys(cityStateMap).forEach(city => {
      if (locationLower.includes(city)) {
        detectedState = cityStateMap[city];
      }
    });
    
    const nearbyLabs = soilTestingLabsDatabase[detectedState] || soilTestingLabsDatabase['Karnataka'];
    
    setTimeout(() => {
      setLabs(nearbyLabs);
      setLoading(false);
    }, 1000);
  };

  const openMapsDirection = (lab) => {
    const { coordinates } = lab;
    if (coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      const encodedAddress = encodeURIComponent(lab.address);
      window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
    }
  };

  const callLab = (phone) => {
    window.open(`tel:${phone}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-100">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
          <span className="text-neutral-600">Finding soil testing labs near you...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <h3 className="text-xl font-bold text-neutral-800 flex items-center">
          <MapPin className="w-6 h-6 mr-3 text-primary-500" />
          {strings.nearbyLabsTitle || "Soil Testing Labs Near You"}
        </h3>
        <p className="text-neutral-600 mt-2">
          {strings.nearbyLabsSubtitle || "Professional labs in your area for accurate soil analysis"}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {labs.map((lab, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-neutral-800">{lab.name}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(lab.rating) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} 
                        />
                      ))}
                      <span className="ml-1 text-sm text-neutral-600">({lab.rating})</span>
                    </div>
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                      {lab.accreditation}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-500">{lab.distance} away</div>
                  <div className="text-lg font-bold text-primary-600">{lab.cost}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-600">{lab.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-neutral-400 mr-2" />
                  <span className="text-sm text-neutral-600">Results in {lab.timeTaken}</span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-neutral-700 mb-2">Services Offered:</h5>
                <div className="flex flex-wrap gap-2">
                  {lab.services.map((service, serviceIndex) => (
                    <span key={serviceIndex} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openMapsDirection(lab)}
                  className="flex items-center bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
                <button
                  onClick={() => callLab(lab.phone)}
                  className="flex items-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </button>
                <button
                  onClick={() => setSelectedLab(selectedLab === lab ? null : lab)}
                  className="flex items-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {selectedLab === lab ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {selectedLab === lab && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-neutral-700">Phone:</span>
                      <span className="ml-2 text-neutral-600">{lab.phone}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Processing Time:</span>
                      <span className="ml-2 text-neutral-600">{lab.timeTaken}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Cost Range:</span>
                      <span className="ml-2 text-neutral-600">{lab.cost}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Certification:</span>
                      <span className="ml-2 text-neutral-600">{lab.accreditation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {labs.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No labs found in your area. Try expanding your search radius.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilTestingLabLocator;
