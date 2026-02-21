export const USERS = [
  {
    email: 'admin@agrobot.com',
    name: 'Admin',
    password: 'password123',
    role: 'ADMIN' as const,
  },
  {
    email: 'farmer@agrobot.com',
    name: 'Jasur',
    password: 'password123',
    role: 'FARMER' as const,
  },
  {
    email: 'demo@agrobot.com',
    name: 'Demo Farmer',
    password: 'password123',
    role: 'FARMER' as const,
  },
]

export const FARMS = [
  {
    name: 'Samarkand Cotton Farm',
    location: 'Samarkand, Uzbekistan',
    area: 120,
    soilType: 'LOAM' as const,
    ownerEmail: 'farmer@agrobot.com',
  },
  {
    name: 'Tashkent Wheat Field',
    location: 'Tashkent Region, Uzbekistan',
    area: 85,
    soilType: 'CLAY' as const,
    ownerEmail: 'demo@agrobot.com',
  },
]

export const FIELDS = [
  {
    name: 'North Cotton Block',
    area: 45,
    cropType: 'Cotton',
    farmIndex: 0,
  },
  {
    name: 'South Cotton Block',
    area: 35,
    cropType: 'Cotton',
    farmIndex: 0,
  },
  {
    name: 'Tomato Greenhouse',
    area: 12,
    cropType: 'Tomato',
    farmIndex: 0,
  },
  {
    name: 'Main Wheat Field',
    area: 60,
    cropType: 'Wheat',
    farmIndex: 1,
  },
  {
    name: 'Experimental Plot',
    area: 10,
    cropType: 'Corn',
    farmIndex: 1,
  },
]

export const ROBOTS = [
  {
    name: 'AgroBot-01',
    serialNumber: 'ARB-2026-001',
    status: 'ONLINE' as const,
    batteryLevel: 87,
    firmwareVersion: '2.1.0',
    farmIndex: 0,
  },
  {
    name: 'AgroBot-02',
    serialNumber: 'ARB-2026-002',
    status: 'CHARGING' as const,
    batteryLevel: 34,
    firmwareVersion: '2.1.0',
    farmIndex: 0,
  },
  {
    name: 'AgroBot-03',
    serialNumber: 'ARB-2026-003',
    status: 'ONLINE' as const,
    batteryLevel: 92,
    firmwareVersion: '2.0.5',
    farmIndex: 1,
  },
]

export const SEASONS = [
  {
    name: 'Cotton Season 2026',
    year: 2026,
    cropType: 'Cotton',
    status: 'ACTIVE' as const,
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-10-30'),
    farmIndex: 0,
  },
  {
    name: 'Winter Wheat 2025-2026',
    year: 2026,
    cropType: 'Wheat',
    status: 'ACTIVE' as const,
    startDate: new Date('2025-10-01'),
    endDate: new Date('2026-06-15'),
    farmIndex: 1,
  },
]

export const TELEMETRY_READINGS = [
  { moisture: 23.5, ph: 6.4, nitrogen: 42, phosphorus: 17, potassium: 35, ec: 1.2, temperature: 28.3, humidity: 45, fieldIndex: 0, robotIndex: 0 },
  { moisture: 31.2, ph: 6.8, nitrogen: 38, phosphorus: 22, potassium: 40, ec: 1.5, temperature: 27.1, humidity: 52, fieldIndex: 1, robotIndex: 0 },
  { moisture: 18.7, ph: 7.1, nitrogen: 55, phosphorus: 28, potassium: 45, ec: 1.8, temperature: 30.5, humidity: 38, fieldIndex: 2, robotIndex: 1 },
  { moisture: 27.8, ph: 6.2, nitrogen: 35, phosphorus: 15, potassium: 30, ec: 1.1, temperature: 25.6, humidity: 48, fieldIndex: 3, robotIndex: 2 },
  { moisture: 15.3, ph: 5.9, nitrogen: 48, phosphorus: 20, potassium: 38, ec: 1.4, temperature: 32.1, humidity: 35, fieldIndex: 4, robotIndex: 2 },
]

export const ALERTS = [
  {
    title: 'Low soil moisture',
    message: 'Moisture level dropped below 20% threshold in North Cotton Block. Immediate irrigation recommended.',
    severity: 'HIGH' as const,
    status: 'ACTIVE' as const,
    fieldIndex: 0,
  },
  {
    title: 'pH imbalance detected',
    message: 'Soil pH is below optimal range (5.9). Consider lime application.',
    severity: 'MEDIUM' as const,
    status: 'ACTIVE' as const,
    fieldIndex: 4,
  },
  {
    title: 'High temperature warning',
    message: 'Field temperature exceeded 30°C. Monitor crop stress indicators.',
    severity: 'LOW' as const,
    status: 'RESOLVED' as const,
    fieldIndex: 2,
  },
]

export const RECOMMENDATIONS = [
  {
    title: 'Apply drip irrigation',
    description: 'Apply 12-18mm drip irrigation within 24 hours to restore optimal moisture levels in the cotton block.',
    category: 'Irrigation',
    priority: 1,
    fieldIndex: 0,
  },
  {
    title: 'Monitor for fungal symptoms',
    description: 'Check leaves for early signs of Alternaria and Fusarium. High humidity conditions detected.',
    category: 'Plant Health',
    priority: 2,
    fieldIndex: 1,
  },
  {
    title: 'Apply nitrogen fertilizer',
    description: 'Nitrogen levels are suboptimal for wheat growth stage. Apply 40kg/ha urea.',
    category: 'Fertilization',
    priority: 1,
    fieldIndex: 3,
  },
  {
    title: 'Recheck soil EC after irrigation',
    description: 'Electrical conductivity should be monitored post-irrigation to ensure salt levels remain safe.',
    category: 'Monitoring',
    priority: 3,
    fieldIndex: 0,
  },
  {
    title: 'Lime application for pH correction',
    description: 'Apply 2-3 tons/ha of agricultural lime to raise pH from 5.9 to optimal 6.5 range.',
    category: 'Soil Amendment',
    priority: 2,
    fieldIndex: 4,
  },
]

export const PLANT_ANALYSES = [
  {
    imageUrl: '/uploads/analysis/cotton-leaf-01.jpg',
    disease: null,
    confidence: 0.95,
    healthy: true,
    fieldIndex: 0,
  },
  {
    imageUrl: '/uploads/analysis/cotton-leaf-02.jpg',
    disease: 'Alternaria Leaf Spot',
    confidence: 0.82,
    healthy: false,
    fieldIndex: 1,
  },
  {
    imageUrl: '/uploads/analysis/wheat-leaf-01.jpg',
    disease: null,
    confidence: 0.91,
    healthy: true,
    fieldIndex: 3,
  },
  {
    imageUrl: '/uploads/analysis/tomato-leaf-01.jpg',
    disease: 'Early Blight',
    confidence: 0.78,
    healthy: false,
    fieldIndex: 2,
  },
]
