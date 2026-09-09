import { LanguageCode, LanguageOption } from '../types';

export const ALL_INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
  { code: 'sa', label: 'Sanskrit', nativeLabel: 'संस्कृतम्' },
  { code: 'mai', label: 'Maithili', nativeLabel: 'मैथिली' },
  { code: 'bho', label: 'Bhojpuri', nativeLabel: 'भोजपुरी' },
  { code: 'ne', label: 'Nepali', nativeLabel: 'नेपाली' },
];

export interface Translations {
  portalTitle: string;
  portalSubtitle: string;
  citizenPortal: string;
  officialsPortal: string;
  fileComplaint: string;
  slaRules: string;
  complaintHistory: string;
  trackStatus: string;
  notifications: string;
  signOut: string;
  issueOrder: string;
  overview: string;
  allComplaints: string;
  allOrders: string;
  departmentQueues: string;
  routingRulesAdmin: string;
  grievanceMap: string;
  autoRoutingPreview: string;
  submitComplaint: string;
  potholeExample: string;
  titlePlaceholder: string;
  descPlaceholder: string;
  selectWard: string;
  phoneLabel: string;
  mpinLabel: string;
  loginBtn: string;
  demoCitizen: string;
  demoOfficial: string;
}

export const TRANSLATIONS: Record<string, Translations> = {
  en: {
    portalTitle: 'LokSeva National Grievance Portal',
    portalSubtitle: 'Government of India • Multi-Department Auto-Routing Platform',
    citizenPortal: 'Citizen Services',
    officialsPortal: 'Government Officials',
    fileComplaint: 'File Citizen Complaint',
    slaRules: 'Service Level Agreement (SLA)',
    complaintHistory: 'Complaint History',
    trackStatus: 'Track Status of Process',
    notifications: 'Notifications',
    signOut: 'Sign Out',
    issueOrder: 'Issue Government Order',
    overview: 'Dashboard Overview',
    allComplaints: 'All Complaints',
    allOrders: 'All Government Orders',
    departmentQueues: 'Department Queues',
    routingRulesAdmin: 'Routing Rules Admin',
    grievanceMap: 'Grievance Hotspot Map',
    autoRoutingPreview: 'Live Auto-Routing Engine',
    submitComplaint: 'Submit Grievance to Govt',
    potholeExample: 'e.g. Deep pothole AND broken street light near MG Road market causing accidents...',
    titlePlaceholder: 'Brief summary of issues (e.g. Potholes & Streetlight & Garbage)',
    descPlaceholder: 'Describe all issues in detail. As you type, our auto-routing engine analyzes keywords and assigns the complaint to multiple departments at once.',
    selectWard: 'Select Administrative Ward / Zone',
    phoneLabel: 'Citizen Mobile Number',
    mpinLabel: '4-Digit MPIN',
    loginBtn: 'Enter Portal',
    demoCitizen: 'Demo Citizen',
    demoOfficial: 'Demo District Collector',
  },
  hi: {
    portalTitle: 'लोकसेवा राष्ट्रीय शिकायत निवारण पोर्टल',
    portalSubtitle: 'भारत सरकार • बहु-विभागीय स्वतः अग्रेषण मंच',
    citizenPortal: 'नागरिक सेवाएं',
    officialsPortal: 'सरकारी अधिकारी पोर्टल',
    fileComplaint: 'नागरिक शिकायत दर्ज करें',
    slaRules: 'सेवा स्तर अनुबंध (SLA नियम)',
    complaintHistory: 'शिकायत इतिहास',
    trackStatus: 'प्रक्रिया की स्थिति जांचें',
    notifications: 'सूचनाएं',
    signOut: 'साइन आउट',
    issueOrder: 'सरकारी आदेश जारी करें',
    overview: 'डैशबोर्ड अवलोकन',
    allComplaints: 'सभी शिकायतें',
    allOrders: 'सभी सरकारी आदेश',
    departmentQueues: 'विभागीय कार्यसूची',
    routingRulesAdmin: 'अग्रेषण नियम व्यवस्थापक',
    grievanceMap: 'शिकायत मानचित्र एवं दोहराव',
    autoRoutingPreview: 'सजीव बहु-विभागीय स्वतः अग्रेषण',
    submitComplaint: 'शिकायत सरकार को भेजें',
    potholeExample: 'उदा. मुख्य सड़क पर गड्ढा और बंद स्ट्रीट लाइट तथा कचरे का ढेर...',
    titlePlaceholder: 'समस्या का संक्षिप्त शीर्षक (गड्ढा, लाइट, कचरा)',
    descPlaceholder: 'अपनी सभी समस्याएं विस्तार से लिखें। जैसे ही आप लिखेंगे, हमारी प्रणाली स्वतः संबंधित विभागों को शिकायत अग्रेषित करेगी।',
    selectWard: 'प्रशासनिक वार्ड / क्षेत्र चुनें',
    phoneLabel: 'नागरिक मोबाइल नंबर',
    mpinLabel: '4-अंकीय एमपिन (MPIN)',
    loginBtn: 'पोर्टल में प्रवेश करें',
    demoCitizen: 'डेमो नागरिक',
    demoOfficial: 'डेमो जिला कलेक्टर',
  },
  ta: {
    portalTitle: 'லோக் சேவா தேசிய குறைதீர்ப்பு தளம்',
    portalSubtitle: 'இந்திய அரசு • பல துறை தானியங்கி வழித்தட தளம்',
    citizenPortal: 'குடிமக்கள் சேவைகள்',
    officialsPortal: 'அரசு அதிகாரிகள்',
    fileComplaint: 'குடிமக்கள் புகார் பதிவு',
    slaRules: 'சேவை நிலை ஒப்பந்தம் (SLA)',
    complaintHistory: 'புகார் வரலாறு',
    trackStatus: 'நிலை கண்காணிப்பு',
    notifications: 'அறிவிப்புகள்',
    signOut: 'வெளியேறு',
    issueOrder: 'அரசு ஆணை பிறப்பி',
    overview: 'கண்காணிப்பு பலகை',
    allComplaints: 'அனைத்து புகார்கள்',
    allOrders: 'அனைத்து அரசு ஆணைகள்',
    departmentQueues: 'துறை சார்ந்த வரிசைகள்',
    routingRulesAdmin: 'வழித்தட விதிகள் நிர்வாகம்',
    grievanceMap: 'குறைதீர்ப்பு வரைபடம்',
    autoRoutingPreview: 'நேரடி பல துறை வழித்தடம்',
    submitComplaint: 'புகாரை சமர்ப்பிக்கவும்',
    potholeExample: 'எ.கா. பள்ளம் மற்றும் பழுதடைந்த தெருவிளக்கு...',
    titlePlaceholder: 'புகாரின் சுருக்கம்',
    descPlaceholder: 'உங்கள் புகாரை விவரிக்கவும். தானியங்கி முறை சரியான துறைகளுக்கு அனுப்பும்.',
    selectWard: 'நிர்வாக வார்டு தேர்ந்தெடுக்கவும்',
    phoneLabel: 'கைபேசி எண்',
    mpinLabel: '4-இலக்க MPIN',
    loginBtn: 'உள்நுழைய',
    demoCitizen: 'மாதிரி குடிமகன்',
    demoOfficial: 'மாவட்ட ஆட்சியர்',
  },
  te: {
    portalTitle: 'లోక్‌సేవ జాతీయ ఫిర్యాదుల పోర్టల్',
    portalSubtitle: 'భారత ప్రభుత్వం • బహుళ విభాగ ఆటో-రూటింగ్ వేదిక',
    citizenPortal: 'పౌర సేవలు',
    officialsPortal: 'ప్రభుత్వ అధికారులు',
    fileComplaint: 'పౌర ఫిర్యాదు నమోదు',
    slaRules: 'సర్వీస్ లెవల్ అగ్రిమెంట్ (SLA)',
    complaintHistory: 'ఫిర్యాదుల చరిత్ర',
    trackStatus: 'స్థితిని ట్రాక్ చేయండి',
    notifications: 'నోటిఫికేషన్లు',
    signOut: 'లాగ్ అవుట్',
    issueOrder: 'ప్రభుత్వ ఉత్తర్వు జారీ',
    overview: 'డాష్‌బోర్డ్ సారాంశం',
    allComplaints: 'అన్ని ఫిర్యాదులు',
    allOrders: 'అన్ని ప్రభుత్వ ఉత్తర్వులు',
    departmentQueues: 'శాఖల క్యూలు',
    routingRulesAdmin: 'రూటింగ్ నిబంధనలు',
    grievanceMap: 'ఫిర్యాదుల మ్యాప్',
    autoRoutingPreview: 'లైవ్ ఆటో-రూటింగ్ ప్రివ్యూ',
    submitComplaint: 'ఫిర్యాదును సమర్పించండి',
    potholeExample: 'ఉదాహరణ: రోడ్డు గుంత మరియు వీధి దీపం పనిచేయకపోవడం...',
    titlePlaceholder: 'ఫిర్యాదు సంక్షిప్త శీర్షిక',
    descPlaceholder: 'సమస్యల వివరాలు టైప్ చేయండి.',
    selectWard: 'పరిపాలనా వార్డును ఎంచుకోండి',
    phoneLabel: 'మొబైల్ నంబర్',
    mpinLabel: '4-అంకెల MPIN',
    loginBtn: 'ప్రవేశించండి',
    demoCitizen: 'డెమో పౌరుడు',
    demoOfficial: 'జిల్లా కలెక్టర్',
  },
  bn: {
    portalTitle: 'লোকসেবা জাতীয় অভিযোগ প্রতিকার পোর্টাল',
    portalSubtitle: 'ভারত সরকার • বহু-বিভাগীয় স্বয়ংক্রিয় রাউটিং প্ল্যাটফর্ম',
    citizenPortal: 'নাগরিক পরিষেবা',
    officialsPortal: 'সরকারি আধিকারিক',
    fileComplaint: 'নাগরিক অভিযোগ দায়ের',
    slaRules: 'পরিষেবা স্তর চুক্তি (SLA)',
    complaintHistory: 'অভিযোগ ইতিহাস',
    trackStatus: 'অগ্রগতি পর্যবেক্ষণ',
    notifications: 'বিজ্ঞপ্তি',
    signOut: 'লগ আউট',
    issueOrder: 'সরকারি আদেশ জারি',
    overview: 'ড্যাশবোর্ড সারসংক্ষেপ',
    allComplaints: 'সকল অভিযোগ',
    allOrders: 'সকল সরকারি নির্দেশ',
    departmentQueues: 'বিভাগীয় সারি',
    routingRulesAdmin: 'রাউটিং নিয়ম প্রশাসন',
    grievanceMap: 'অভিযোগ মানচিত্র',
    autoRoutingPreview: 'লাইভ অটো-রাউটিং প্রিভিউ',
    submitComplaint: 'অভিযোগ জমা দিন',
    potholeExample: 'যেমন: খানাখন্দ এবং বিকল রাস্তার বাতি...',
    titlePlaceholder: 'অভিযোগের সংক্ষিপ্ত শিরোনাম',
    descPlaceholder: 'সমস্যাগুলির বিস্তারিত বিবরণ লিখুন।',
    selectWard: 'প্রশাসনিক ওয়ার্ড নির্বাচন করুন',
    phoneLabel: 'মোবাইল নম্বর',
    mpinLabel: '৪-সংখ্যার MPIN',
    loginBtn: 'প্রবেশ করুন',
    demoCitizen: 'ডেমো নাগরিক',
    demoOfficial: 'জেলা শাসক (DM)',
  },
};

export function getTranslation(lang: LanguageCode): Translations {
  return TRANSLATIONS[lang] || TRANSLATIONS['en'];
}
