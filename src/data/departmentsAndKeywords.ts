import { Department, DepartmentId, KeywordMapping, RoutedDepartment } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'PWD',
    name: 'Public Works Department (PWD)',
    hindiName: 'लोक निर्माण विभाग',
    code: 'PWD',
    category: 'Infrastructure & Roads',
    icon: 'Hammer',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    headOfficer: 'Er. Rajeshwar Rao, Chief Engineer',
    contactEmail: 'chief.pwd@gov.in',
    contactPhone: '011-23091001',
    slaDefaultHours: 48,
  },
  {
    id: 'WATER',
    name: 'Water Supply & Sewerage Board',
    hindiName: 'जल प्रदाय एवं सीवरेज बोर्ड',
    code: 'WSSB',
    category: 'Utilities & Sanitation',
    icon: 'Droplets',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    headOfficer: 'Smt. Kavitha Krishnan, Managing Director',
    contactEmail: 'director.water@gov.in',
    contactPhone: '011-23091002',
    slaDefaultHours: 24,
  },
  {
    id: 'ELECTRICITY',
    name: 'Electricity / Power Distribution',
    hindiName: 'विद्युत वितरण निगम',
    code: 'DISCOM',
    category: 'Energy & Power',
    icon: 'Zap',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    headOfficer: 'Shri Anand Verma, Superintending Engineer',
    contactEmail: 'discom.helpdesk@gov.in',
    contactPhone: '011-23091003',
    slaDefaultHours: 24,
  },
  {
    id: 'HEALTH',
    name: 'Public Health & Sanitation',
    hindiName: 'सार्वजनिक स्वास्थ्य एवं चिकित्सा',
    code: 'DPH',
    category: 'Healthcare & Epidemics',
    icon: 'Activity',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    headOfficer: 'Dr. Meenakshi Sundaram, Chief Medical Officer',
    contactEmail: 'cmo.health@gov.in',
    contactPhone: '011-23091004',
    slaDefaultHours: 12,
  },
  {
    id: 'MUNICIPAL',
    name: 'Municipal Corporation',
    hindiName: 'नगर निगम',
    code: 'MC',
    category: 'Civic Sanitation & Waste',
    icon: 'Trash2',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    headOfficer: 'Shri Vikramaditya Sen, Municipal Commissioner',
    contactEmail: 'commissioner.mc@gov.in',
    contactPhone: '011-23091005',
    slaDefaultHours: 12,
  },
  {
    id: 'POLICE',
    name: 'Police & Law Enforcement',
    hindiName: 'पुलिस एवं विधि व्यवस्था',
    code: 'POL',
    category: 'Public Safety & Law',
    icon: 'ShieldAlert',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headOfficer: 'Shri R. K. Shekhawat, IPS, Deputy Commissioner',
    contactEmail: 'dcp.traffic.crime@gov.in',
    contactPhone: '112 / 011-23091006',
    slaDefaultHours: 6,
  },
  {
    id: 'EDUCATION',
    name: 'Education Department',
    hindiName: 'शिक्षा विभाग',
    code: 'EDU',
    category: 'Schools & Literacy',
    icon: 'GraduationCap',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    headOfficer: 'Dr. Sunita Banerjee, Director of Public Instruction',
    contactEmail: 'director.schools@gov.in',
    contactPhone: '011-23091007',
    slaDefaultHours: 72,
  },
  {
    id: 'REVENUE',
    name: 'Revenue & Land Administration',
    hindiName: 'राजस्व एवं भूमि प्रशासन',
    code: 'REV',
    category: 'Land Records & Tehsildar',
    icon: 'FileText',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    headOfficer: 'Shri Balram Tyagi, District Revenue Officer',
    contactEmail: 'collectorate.revenue@gov.in',
    contactPhone: '011-23091008',
    slaDefaultHours: 96,
  },
  {
    id: 'TRANSPORT',
    name: 'Transport & Traffic Management',
    hindiName: 'परिवहन एवं यातायात प्रबंधन',
    code: 'RTO',
    category: 'Public Transit & Signals',
    icon: 'Bus',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    headOfficer: 'Smt. Prerna Deshmukh, Regional Transport Officer',
    contactEmail: 'rto.complaints@gov.in',
    contactPhone: '011-23091009',
    slaDefaultHours: 48,
  },
  {
    id: 'FIRE',
    name: 'Fire & Emergency Services',
    hindiName: 'अग्निशमन एवं आपातकालीन सेवा',
    code: 'FIRE',
    category: 'Disaster & Fire Safety',
    icon: 'Flame',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    headOfficer: 'Shri Devendra Negi, Chief Fire Officer',
    contactEmail: 'fire.controlroom@gov.in',
    contactPhone: '101 / 011-23091010',
    slaDefaultHours: 4,
  },
];

export const INITIAL_KEYWORDS: KeywordMapping[] = [
  // PWD - Roads & Infrastructure (10 keywords)
  { id: 'kw-pwd-1', keyword: 'pothole', departmentId: 'PWD', category: 'Roads', weight: 1.0 },
  { id: 'kw-pwd-2', keyword: 'potholes', departmentId: 'PWD', category: 'Roads', weight: 1.0 },
  { id: 'kw-pwd-3', keyword: 'broken road', departmentId: 'PWD', category: 'Roads', weight: 0.9 },
  { id: 'kw-pwd-4', keyword: 'road caved', departmentId: 'PWD', category: 'Roads', weight: 1.0 },
  { id: 'kw-pwd-5', keyword: 'flyover crack', departmentId: 'PWD', category: 'Bridges', weight: 1.0 },
  { id: 'kw-pwd-6', keyword: 'footpath broken', departmentId: 'PWD', category: 'Pedestrian', weight: 0.8 },
  { id: 'kw-pwd-7', keyword: 'stormwater drain', departmentId: 'PWD', category: 'Drainage', weight: 0.9 },
  { id: 'kw-pwd-8', keyword: 'manhole cover broken', departmentId: 'PWD', category: 'Roads', weight: 1.0 },
  { id: 'kw-pwd-9', keyword: 'asphalt peeling', departmentId: 'PWD', category: 'Roads', weight: 0.8 },
  { id: 'kw-pwd-10', keyword: 'culvert damage', departmentId: 'PWD', category: 'Bridges', weight: 0.9 },
  { id: 'kw-pwd-11', keyword: 'road repair', departmentId: 'PWD', category: 'Roads', weight: 0.8 },

  // WATER - Water Supply & Sewerage (10 keywords)
  { id: 'kw-wat-1', keyword: 'water leak', departmentId: 'WATER', category: 'Water Supply', weight: 1.0 },
  { id: 'kw-wat-2', keyword: 'pipe burst', departmentId: 'WATER', category: 'Water Supply', weight: 1.0 },
  { id: 'kw-wat-3', keyword: 'contaminated water', departmentId: 'WATER', category: 'Water Quality', weight: 1.0 },
  { id: 'kw-wat-4', keyword: 'dirty water', departmentId: 'WATER', category: 'Water Quality', weight: 0.9 },
  { id: 'kw-wat-5', keyword: 'low water pressure', departmentId: 'WATER', category: 'Water Supply', weight: 0.8 },
  { id: 'kw-wat-6', keyword: 'sewage overflow', departmentId: 'WATER', category: 'Sewerage', weight: 1.0 },
  { id: 'kw-wat-7', keyword: 'blocked drain', departmentId: 'WATER', category: 'Sewerage', weight: 0.9 },
  { id: 'kw-wat-8', keyword: 'water tanker', departmentId: 'WATER', category: 'Water Supply', weight: 0.8 },
  { id: 'kw-wat-9', keyword: 'muddy water', departmentId: 'WATER', category: 'Water Quality', weight: 0.9 },
  { id: 'kw-wat-10', keyword: 'sewer line blocked', departmentId: 'WATER', category: 'Sewerage', weight: 1.0 },
  { id: 'kw-wat-11', keyword: 'no water supply', departmentId: 'WATER', category: 'Water Supply', weight: 1.0 },

  // ELECTRICITY - Power & Streetlights (10 keywords)
  { id: 'kw-elec-1', keyword: 'street light', departmentId: 'ELECTRICITY', category: 'Lighting', weight: 1.0 },
  { id: 'kw-elec-2', keyword: 'streetlight', departmentId: 'ELECTRICITY', category: 'Lighting', weight: 1.0 },
  { id: 'kw-elec-3', keyword: 'broken light', departmentId: 'ELECTRICITY', category: 'Lighting', weight: 0.8 },
  { id: 'kw-elec-4', keyword: 'power outage', departmentId: 'ELECTRICITY', category: 'Power', weight: 1.0 },
  { id: 'kw-elec-5', keyword: 'blackout', departmentId: 'ELECTRICITY', category: 'Power', weight: 1.0 },
  { id: 'kw-elec-6', keyword: 'transformer sparking', departmentId: 'ELECTRICITY', category: 'Hazard', weight: 1.0 },
  { id: 'kw-elec-7', keyword: 'loose wire', departmentId: 'ELECTRICITY', category: 'Hazard', weight: 1.0 },
  { id: 'kw-elec-8', keyword: 'hanging electric wire', departmentId: 'ELECTRICITY', category: 'Hazard', weight: 1.0 },
  { id: 'kw-elec-9', keyword: 'voltage fluctuation', departmentId: 'ELECTRICITY', category: 'Power', weight: 0.9 },
  { id: 'kw-elec-10', keyword: 'electric pole leaning', departmentId: 'ELECTRICITY', category: 'Hazard', weight: 0.9 },
  { id: 'kw-elec-11', keyword: 'meter faulty', departmentId: 'ELECTRICITY', category: 'Billing', weight: 0.7 },

  // HEALTH - Public Health & Sanitation (10 keywords)
  { id: 'kw-hlth-1', keyword: 'dengue', departmentId: 'HEALTH', category: 'Vector Disease', weight: 1.0 },
  { id: 'kw-hlth-2', keyword: 'malaria', departmentId: 'HEALTH', category: 'Vector Disease', weight: 1.0 },
  { id: 'kw-hlth-3', keyword: 'mosquito breeding', departmentId: 'HEALTH', category: 'Vector Control', weight: 1.0 },
  { id: 'kw-hlth-4', keyword: 'primary health centre', departmentId: 'HEALTH', category: 'Healthcare', weight: 0.9 },
  { id: 'kw-hlth-5', keyword: 'phc closed', departmentId: 'HEALTH', category: 'Healthcare', weight: 1.0 },
  { id: 'kw-hlth-6', keyword: 'doctor absent', departmentId: 'HEALTH', category: 'Healthcare', weight: 0.8 },
  { id: 'kw-hlth-7', keyword: 'food poisoning', departmentId: 'HEALTH', category: 'Food Safety', weight: 1.0 },
  { id: 'kw-hlth-8', keyword: 'stagnant water epidemic', departmentId: 'HEALTH', category: 'Sanitation', weight: 0.9 },
  { id: 'kw-hlth-9', keyword: 'vaccination stock', departmentId: 'HEALTH', category: 'Immunization', weight: 0.8 },
  { id: 'kw-hlth-10', keyword: 'ambulance delay', departmentId: 'HEALTH', category: 'Emergency Health', weight: 0.9 },

  // MUNICIPAL - Garbage & Civic Hygiene (10 keywords)
  { id: 'kw-mun-1', keyword: 'garbage piling up', departmentId: 'MUNICIPAL', category: 'Waste', weight: 1.0 },
  { id: 'kw-mun-2', keyword: 'garbage', departmentId: 'MUNICIPAL', category: 'Waste', weight: 1.0 },
  { id: 'kw-mun-3', keyword: 'trash overflow', departmentId: 'MUNICIPAL', category: 'Waste', weight: 1.0 },
  { id: 'kw-mun-4', keyword: 'dustbin broken', departmentId: 'MUNICIPAL', category: 'Waste', weight: 0.8 },
  { id: 'kw-mun-5', keyword: 'dead animal', departmentId: 'MUNICIPAL', category: 'Sanitation', weight: 1.0 },
  { id: 'kw-mun-6', keyword: 'stray dogs', departmentId: 'MUNICIPAL', category: 'Animal Control', weight: 0.9 },
  { id: 'kw-mun-7', keyword: 'stray cattle', departmentId: 'MUNICIPAL', category: 'Animal Control', weight: 0.9 },
  { id: 'kw-mun-8', keyword: 'public toilet dirty', departmentId: 'MUNICIPAL', category: 'Hygiene', weight: 0.9 },
  { id: 'kw-mun-9', keyword: 'illegal dumping', departmentId: 'MUNICIPAL', category: 'Waste', weight: 1.0 },
  { id: 'kw-mun-10', keyword: 'street sweeping not done', departmentId: 'MUNICIPAL', category: 'Sanitation', weight: 0.8 },
  { id: 'kw-mun-11', keyword: 'plastic burning', departmentId: 'MUNICIPAL', category: 'Pollution', weight: 0.9 },

  // POLICE - Law & Order, Traffic Police (10 keywords)
  { id: 'kw-pol-1', keyword: 'noise pollution', departmentId: 'POLICE', category: 'Public Nuisance', weight: 0.9 },
  { id: 'kw-pol-2', keyword: 'loud speaker midnight', departmentId: 'POLICE', category: 'Public Nuisance', weight: 1.0 },
  { id: 'kw-pol-3', keyword: 'illegal parking', departmentId: 'POLICE', category: 'Traffic', weight: 0.9 },
  { id: 'kw-pol-4', keyword: 'theft', departmentId: 'POLICE', category: 'Crime', weight: 1.0 },
  { id: 'kw-pol-5', keyword: 'harassment', departmentId: 'POLICE', category: 'Safety', weight: 1.0 },
  { id: 'kw-pol-6', keyword: 'drunk driving', departmentId: 'POLICE', category: 'Traffic Safety', weight: 1.0 },
  { id: 'kw-pol-7', keyword: 'chain snatching', departmentId: 'POLICE', category: 'Crime', weight: 1.0 },
  { id: 'kw-pol-8', keyword: 'extortion', departmentId: 'POLICE', category: 'Crime', weight: 1.0 },
  { id: 'kw-pol-9', keyword: 'unauthorized gathering', departmentId: 'POLICE', category: 'Law & Order', weight: 0.8 },
  { id: 'kw-pol-10', keyword: 'rash driving', departmentId: 'POLICE', category: 'Traffic', weight: 0.9 },

  // EDUCATION - Schools & Anganwadi (9 keywords)
  { id: 'kw-edu-1', keyword: 'school', departmentId: 'EDUCATION', category: 'Infrastructure', weight: 0.9 },
  { id: 'kw-edu-2', keyword: 'schools', departmentId: 'EDUCATION', category: 'Infrastructure', weight: 0.9 },
  { id: 'kw-edu-3', keyword: 'government school building', departmentId: 'EDUCATION', category: 'Infrastructure', weight: 1.0 },
  { id: 'kw-edu-4', keyword: 'midday meal', departmentId: 'EDUCATION', category: 'Nutrition', weight: 1.0 },
  { id: 'kw-edu-5', keyword: 'teacher absent', departmentId: 'EDUCATION', category: 'Faculty', weight: 0.9 },
  { id: 'kw-edu-6', keyword: 'school roof collapse', departmentId: 'EDUCATION', category: 'Safety', weight: 1.0 },
  { id: 'kw-edu-7', keyword: 'no drinking water in school', departmentId: 'EDUCATION', category: 'Sanitation', weight: 0.9 },
  { id: 'kw-edu-8', keyword: 'textbook shortage', departmentId: 'EDUCATION', category: 'Curriculum', weight: 0.8 },
  { id: 'kw-edu-9', keyword: 'anganwadi center', departmentId: 'EDUCATION', category: 'Early Education', weight: 0.9 },

  // REVENUE - Land, Tehsildar, Encroachments (9 keywords)
  { id: 'kw-rev-1', keyword: 'encroachment', departmentId: 'REVENUE', category: 'Land', weight: 1.0 },
  { id: 'kw-rev-2', keyword: 'illegal construction on govt land', departmentId: 'REVENUE', category: 'Land', weight: 1.0 },
  { id: 'kw-rev-3', keyword: 'patta dispute', departmentId: 'REVENUE', category: 'Land Records', weight: 1.0 },
  { id: 'kw-rev-4', keyword: 'land boundary dispute', departmentId: 'REVENUE', category: 'Survey', weight: 0.9 },
  { id: 'kw-rev-5', keyword: 'tehsildar delay', departmentId: 'REVENUE', category: 'Governance', weight: 0.8 },
  { id: 'kw-rev-6', keyword: 'ration card issue', departmentId: 'REVENUE', category: 'Public Distribution', weight: 0.9 },
  { id: 'kw-rev-7', keyword: 'caste certificate delay', departmentId: 'REVENUE', category: 'Certificates', weight: 0.8 },
  { id: 'kw-rev-8', keyword: 'illegal sand mining', departmentId: 'REVENUE', category: 'Mining & Land', weight: 1.0 },
  { id: 'kw-rev-9', keyword: 'lake bed encroachment', departmentId: 'REVENUE', category: 'Waterbody', weight: 1.0 },

  // TRANSPORT - Buses, Signals, Stops (9 keywords)
  { id: 'kw-trans-1', keyword: 'bus route', departmentId: 'TRANSPORT', category: 'Public Bus', weight: 0.9 },
  { id: 'kw-trans-2', keyword: 'traffic signal', departmentId: 'TRANSPORT', category: 'Signals', weight: 1.0 },
  { id: 'kw-trans-3', keyword: 'signal not working', departmentId: 'TRANSPORT', category: 'Signals', weight: 1.0 },
  { id: 'kw-trans-4', keyword: 'speed breaker unpainted', departmentId: 'TRANSPORT', category: 'Road Safety', weight: 0.8 },
  { id: 'kw-trans-5', keyword: 'bus stop damaged', departmentId: 'TRANSPORT', category: 'Infrastructure', weight: 0.8 },
  { id: 'kw-trans-6', keyword: 'overcrowded bus', departmentId: 'TRANSPORT', category: 'Transit', weight: 0.7 },
  { id: 'kw-trans-7', keyword: 'auto rickshaw overcharging', departmentId: 'TRANSPORT', category: 'Permits', weight: 0.8 },
  { id: 'kw-trans-8', keyword: 'zebra crossing missing', departmentId: 'TRANSPORT', category: 'Pedestrian', weight: 0.8 },
  { id: 'kw-trans-9', keyword: 'broken barricade', departmentId: 'TRANSPORT', category: 'Road Safety', weight: 0.8 },

  // FIRE - Fire & Emergency (9 keywords)
  { id: 'kw-fire-1', keyword: 'fire hazard', departmentId: 'FIRE', category: 'Fire Safety', weight: 1.0 },
  { id: 'kw-fire-2', keyword: 'gas leak', departmentId: 'FIRE', category: 'Emergency', weight: 1.0 },
  { id: 'kw-fire-3', keyword: 'cylinder blast', departmentId: 'FIRE', category: 'Emergency', weight: 1.0 },
  { id: 'kw-fire-4', keyword: 'building safety violation', departmentId: 'FIRE', category: 'Compliance', weight: 0.9 },
  { id: 'kw-fire-5', keyword: 'blocked emergency exit', departmentId: 'FIRE', category: 'Safety', weight: 1.0 },
  { id: 'kw-fire-6', keyword: 'fallen tree blocking road', departmentId: 'FIRE', category: 'Disaster', weight: 0.9 },
  { id: 'kw-fire-7', keyword: 'flood rescue', departmentId: 'FIRE', category: 'Rescue', weight: 1.0 },
  { id: 'kw-fire-8', keyword: 'chemical spill', departmentId: 'FIRE', category: 'Hazardous', weight: 1.0 },
  { id: 'kw-fire-9', keyword: 'fire extinguisher missing', departmentId: 'FIRE', category: 'Compliance', weight: 0.8 },
];

/**
 * Auto-Routing Engine
 * Scans complaint or government order text across the keyword mappings.
 * Returns an array of routed departments with their matched keywords.
 */
export function routeTextToDepartments(
  text: string,
  keywordsDatabase: KeywordMapping[] = INITIAL_KEYWORDS
): RoutedDepartment[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const normalizedText = text.toLowerCase();
  const departmentMatches: Record<DepartmentId, Set<string>> = {
    PWD: new Set(),
    WATER: new Set(),
    ELECTRICITY: new Set(),
    HEALTH: new Set(),
    MUNICIPAL: new Set(),
    POLICE: new Set(),
    EDUCATION: new Set(),
    REVENUE: new Set(),
    TRANSPORT: new Set(),
    FIRE: new Set(),
  };

  for (const item of keywordsDatabase) {
    const kw = item.keyword.toLowerCase();
    // Match word boundaries or exact phrase substring
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(normalizedText) || normalizedText.includes(kw)) {
      departmentMatches[item.departmentId].add(item.keyword);
    }
  }

  // Also include domain synonyms for common keywords
  if (/\b(potholes?|road|crater|bitumen|bridge|divider|drain)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(potholes?|road|crater|bitumen|bridge|divider|drain)\b/i);
    if (matched) departmentMatches.PWD.add(matched[0]);
  }
  if (/\b(water|tap|sewage|drainage|pipeline|tanker|sewer)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(water|tap|sewage|drainage|pipeline|tanker|sewer)\b/i);
    if (matched) departmentMatches.WATER.add(matched[0]);
  }
  if (/\b(streetlight|street light|light|electricity|power|transformer|wire|current)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(streetlight|street light|light|electricity|power|transformer|wire|current)\b/i);
    if (matched) departmentMatches.ELECTRICITY.add(matched[0]);
  }
  if (/\b(garbage|trash|waste|rubbish|dump|filth|debris|dead animal|stray cattle)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(garbage|trash|waste|rubbish|dump|filth|debris|dead animal|stray cattle)\b/i);
    if (matched) departmentMatches.MUNICIPAL.add(matched[0]);
  }
  if (/\b(clinic|hospital|dengue|doctor|medicine|health|malaria|infection)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(clinic|hospital|dengue|doctor|medicine|health|malaria|infection)\b/i);
    if (matched) departmentMatches.HEALTH.add(matched[0]);
  }
  if (/\b(police|theft|snatching|patrol|crime|safety|harassment|loudspeaker)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(police|theft|snatching|patrol|crime|safety|harassment|loudspeaker)\b/i);
    if (matched) departmentMatches.POLICE.add(matched[0]);
  }
  if (/\b(school|teachers?|classroom|student|midday meal|education|books?)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(school|teachers?|classroom|student|midday meal|education|books?)\b/i);
    if (matched) departmentMatches.EDUCATION.add(matched[0]);
  }
  if (/\b(land|patta|encroach|tehsil|revenue|survey|registry)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(land|patta|encroach|tehsil|revenue|survey|registry)\b/i);
    if (matched) departmentMatches.REVENUE.add(matched[0]);
  }
  if (/\b(traffic|signal|bus|buses|transport|speed breaker|zebra crossing|rickshaw)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(traffic|signal|bus|buses|transport|speed breaker|zebra crossing|rickshaw)\b/i);
    if (matched) departmentMatches.TRANSPORT.add(matched[0]);
  }
  if (/\b(fire|blast|cylinder|gas leak|emergency|rescue|extinguisher)\b/i.test(normalizedText)) {
    const matched = normalizedText.match(/\b(fire|blast|cylinder|gas leak|emergency|rescue|extinguisher)\b/i);
    if (matched) departmentMatches.FIRE.add(matched[0]);
  }

  const results: RoutedDepartment[] = [];
  const now = new Date().toISOString();

  for (const [deptId, keywordsSet] of Object.entries(departmentMatches)) {
    if (keywordsSet.size > 0) {
      results.push({
        departmentId: deptId as DepartmentId,
        matchedKeywords: Array.from(keywordsSet),
        status: 'PENDING',
        updatedAt: now,
      });
    }
  }

  return results;
}

export const KEYWORD_DATABASE = INITIAL_KEYWORDS;
