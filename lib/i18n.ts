export type Lang = "en" | "hi" | "mr" | "kn" | "ne";

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
];

export const DEFAULT_LANG: Lang = "en";

export function isValidLang(s: string | undefined | null): s is Lang {
  return !!s && LANGS.some((l) => l.code === s);
}

// Locale tag for Intl APIs. Marathi falls back to Hindi/Indic numerals on most devices.
export function intlLocale(lang: Lang): string {
  return { en: "en-IN", hi: "hi-IN", mr: "mr-IN", kn: "kn-IN", ne: "ne-NP" }[lang];
}

export interface Strings {
  // Header / meta
  appTitle: string;
  tagline: string;
  description: string;
  // Landing
  step1Location: string;
  step2Spray: string;
  seeForecast: string;
  loading: string;
  disclaimer: string;
  // LocationPicker
  useMyLocation: string;
  locating: string;
  orSearch: string;
  searchPlaceholder: string;
  orPinMap: string;
  hideMap: string;
  selected: string;
  change: string;
  loadingMap: string;
  geoUnsupported: string;
  geoFailed: string;
  // SprayTypePicker — labels for each profile (id-keyed)
  profile_pesticide_contact: string;
  profile_pesticide_contact_desc: string;
  profile_pesticide_systemic: string;
  profile_pesticide_systemic_desc: string;
  profile_fungicide_contact: string;
  profile_fungicide_contact_desc: string;
  profile_fungicide_systemic: string;
  profile_fungicide_systemic_desc: string;
  profile_herbicide: string;
  profile_herbicide_desc: string;
  profile_foliar_fertilizer: string;
  profile_foliar_fertilizer_desc: string;
  profile_drone: string;
  profile_drone_desc: string;
  // Ratings
  ratingGreen: string;
  ratingYellow: string;
  ratingRed: string;
  // Forecast page
  back: string;
  bestWindow: string;
  noSuitableWindows: string;
  noSuitableBody: string;
  allWindows: string;
  hourlyForecast: string;
  windowsFound: string; // template containing {n}, optional pipe-separated singular|plural ("1 window|{n} windows")
  // Calendar legend
  legendGood: string;
  legendMarginal: string;
  legendAvoid: string;
  legendNight: string;
  tapHourHint: string;
  // Hour modal
  rating: string;
  temperature: string;
  humidity: string;
  wind: string;
  gusts: string;
  rainRisk: string;
  thisHour: string;
  deltaT: string;
  dropletDrying: string;
  rainNext: string;
  peak: string;
  whatsGood: string;
  whatsNot: string;
  close: string;
  // Explainer
  whyMatters: string;
  show: string;
  hide: string;
  expDeltaTTitle: string;
  expDeltaTBody: string;
  expWindTitle: string;
  expWindBody: string;
  expRainTitle: string;
  expRainBody: string;
  expTimeTitle: string;
  expTimeBody: string;
  // Errors
  invalidRequest: string;
  invalidLocationSpray: string;
  startOver: string;
  cantFetchWeather: string;
  tryAgain: string;
  // Calendar day labels
  today: string;
  tomorrow: string;
  // Misc
  weatherCredit: string;
  language: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  viewOnGithub: string;
}

const en: Strings = {
  appTitle: "Spray Window Predictor",
  tagline: "When can I spray?",
  description:
    "See the next 5 days of hourly spray windows for your field. Free, no signup, powered by Open-Meteo weather data.",
  step1Location: "1. Location",
  step2Spray: "2. What are you spraying?",
  seeForecast: "See 5-day forecast",
  loading: "Loading…",
  disclaimer:
    "Always follow product label instructions. This tool is a guide, not a substitute for professional agronomic advice.",
  useMyLocation: "Use my current location",
  locating: "Locating…",
  orSearch: "or search a city",
  searchPlaceholder: "e.g. Bengaluru, Pune, Kathmandu",
  orPinMap: "or pin on a map",
  hideMap: "Hide map",
  selected: "Selected",
  change: "Change",
  loadingMap: "Loading map…",
  geoUnsupported: "Geolocation not supported by this browser",
  geoFailed: "Could not get location",
  profile_pesticide_contact: "Contact pesticide",
  profile_pesticide_contact_desc: "Surface-acting insecticide (e.g., contact pyrethroid).",
  profile_pesticide_systemic: "Systemic pesticide",
  profile_pesticide_systemic_desc: "Plant-absorbed insecticide. Needs uptake window.",
  profile_fungicide_contact: "Contact fungicide",
  profile_fungicide_contact_desc: "Surface fungicide (e.g., Mancozeb). Needs long dry window.",
  profile_fungicide_systemic: "Systemic fungicide",
  profile_fungicide_systemic_desc: "Absorbed fungicide. More tolerant of humidity.",
  profile_herbicide: "Herbicide",
  profile_herbicide_desc: "Weed killer. Needs uptake window and low drift.",
  profile_foliar_fertilizer: "Foliar fertilizer",
  profile_foliar_fertilizer_desc: "Liquid nutrient via leaves. Cool + humid preferred.",
  profile_drone: "Drone application",
  profile_drone_desc:
    "Aerial spray via drone. Tighter wind/gust limits due to fine droplets and downwash drift.",
  ratingGreen: "Good",
  ratingYellow: "Marginal",
  ratingRed: "Avoid",
  back: "Back",
  bestWindow: "Best window",
  noSuitableWindows: "No suitable windows in next 5 days",
  noSuitableBody:
    "Weather conditions are unfavorable. Check back tomorrow or pick a different product.",
  allWindows: "All spray windows",
  hourlyForecast: "Hourly forecast (5 days)",
  windowsFound: "{n} window found|{n} windows found",
  legendGood: "Good",
  legendMarginal: "Marginal",
  legendAvoid: "Avoid",
  legendNight: "Night",
  tapHourHint: "Tap any hour for details",
  rating: "Rating",
  temperature: "Temperature",
  humidity: "Humidity",
  wind: "Wind",
  gusts: "Gusts",
  rainRisk: "Rain risk",
  thisHour: "this hr",
  deltaT: "Delta-T",
  dropletDrying: "Droplet drying index",
  rainNext: "Look-ahead rain",
  peak: "peak",
  whatsGood: "What's good",
  whatsNot: "What's not",
  close: "Close",
  whyMatters: "Why this matters",
  show: "Show",
  hide: "Hide",
  expDeltaTTitle: "Delta-T (droplet drying)",
  expDeltaTBody:
    "Delta-T is the gap between air temperature and wet-bulb temperature. Below 2°C the air is too saturated and droplets pool on the leaf without drying. Above 10°C droplets evaporate before they reach the target. Sweet spot: 2–8°C.",
  expWindTitle: "Wind and drift",
  expWindBody:
    "Under 3 km/h is dead-calm: a temperature inversion can trap vapor near the ground and drift it laterally. Over 15 km/h sustained, or gusts over 20 km/h, sends droplets off-target. Ideal: 3–10 km/h steady breeze.",
  expRainTitle: "Rain windows",
  expRainBody:
    "Contact products need a long dry window (6–8h) so the chemical binds to the leaf before rain washes it off. Systemic products only need a short uptake window (2–4h). Avoid rain in the past 2h too — wet leaves dilute the spray.",
  expTimeTitle: "Time of day",
  expTimeBody:
    "Hot midday hours (10 AM – 4 PM, >28°C) combine high evaporation, strong UV breakdown, and unstable air. Early morning and late afternoon usually offer cooler, more stable conditions.",
  invalidRequest: "Invalid request",
  invalidLocationSpray: "Missing or invalid location / spray type.",
  startOver: "Start over",
  cantFetchWeather: "Couldn't fetch weather",
  tryAgain: "Try again",
  today: "Today",
  tomorrow: "Tomorrow",
  weatherCredit: "Weather: Open-Meteo. Always follow product label.",
  language: "Language",
  theme: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",
  viewOnGithub: "View on GitHub",
};

const hi: Strings = {
  appTitle: "छिड़काव समय भविष्यवक्ता",
  tagline: "मैं कब छिड़काव कर सकता हूँ?",
  description:
    "अपने खेत के लिए अगले 5 दिनों की प्रति-घंटा छिड़काव खिड़कियाँ देखें। मुफ्त, बिना साइन-अप, Open-Meteo मौसम डेटा द्वारा संचालित।",
  step1Location: "१. स्थान",
  step2Spray: "२. आप क्या छिड़काव कर रहे हैं?",
  seeForecast: "5-दिवसीय पूर्वानुमान देखें",
  loading: "लोड हो रहा है…",
  disclaimer:
    "हमेशा उत्पाद लेबल निर्देशों का पालन करें। यह उपकरण एक मार्गदर्शक है, पेशेवर कृषि सलाह का विकल्प नहीं।",
  useMyLocation: "मेरा वर्तमान स्थान उपयोग करें",
  locating: "स्थान खोज रहे हैं…",
  orSearch: "या शहर खोजें",
  searchPlaceholder: "जैसे बेंगलुरु, पुणे, काठमांडू",
  orPinMap: "या नक्शे पर पिन करें",
  hideMap: "नक्शा छुपाएँ",
  selected: "चयनित",
  change: "बदलें",
  loadingMap: "नक्शा लोड हो रहा है…",
  geoUnsupported: "इस ब्राउज़र में जीपीएस समर्थित नहीं है",
  geoFailed: "स्थान प्राप्त नहीं हो सका",
  profile_pesticide_contact: "संपर्क कीटनाशक",
  profile_pesticide_contact_desc: "सतह पर काम करने वाला कीटनाशक (जैसे पाइरेथ्रॉइड)।",
  profile_pesticide_systemic: "प्रणालीगत कीटनाशक",
  profile_pesticide_systemic_desc: "पौधे द्वारा सोखा जाने वाला कीटनाशक। अवशोषण समय चाहिए।",
  profile_fungicide_contact: "संपर्क फफूंदनाशक",
  profile_fungicide_contact_desc: "सतह फफूंदनाशक (जैसे मैन्कोज़ेब)। लंबा सूखा समय चाहिए।",
  profile_fungicide_systemic: "प्रणालीगत फफूंदनाशक",
  profile_fungicide_systemic_desc: "अवशोषित फफूंदनाशक। नमी सहनशील।",
  profile_herbicide: "खरपतवारनाशक",
  profile_herbicide_desc: "खरपतवार मारक। अवशोषण समय और कम हवा चाहिए।",
  profile_foliar_fertilizer: "पर्णीय उर्वरक",
  profile_foliar_fertilizer_desc: "पत्तियों के द्वारा तरल पोषक तत्व। ठंडा + नम बेहतर।",
  profile_drone: "ड्रोन छिड़काव",
  profile_drone_desc:
    "ड्रोन द्वारा हवाई छिड़काव। महीन बूँदों और रोटर हवा के कारण सख्त सीमाएँ।",
  ratingGreen: "अच्छा",
  ratingYellow: "सामान्य",
  ratingRed: "टालें",
  back: "वापस",
  bestWindow: "सबसे अच्छा समय",
  noSuitableWindows: "अगले 5 दिनों में कोई उपयुक्त समय नहीं",
  noSuitableBody: "मौसम प्रतिकूल है। कल फिर देखें या अलग उत्पाद चुनें।",
  allWindows: "सभी छिड़काव खिड़कियाँ",
  hourlyForecast: "प्रति-घंटा पूर्वानुमान (5 दिन)",
  windowsFound: "{n} खिड़कियाँ मिलीं",
  legendGood: "अच्छा",
  legendMarginal: "सामान्य",
  legendAvoid: "टालें",
  legendNight: "रात",
  tapHourHint: "विवरण के लिए किसी भी घंटे को छुएँ",
  rating: "रेटिंग",
  temperature: "तापमान",
  humidity: "आर्द्रता",
  wind: "हवा",
  gusts: "झोंके",
  rainRisk: "बारिश का खतरा",
  thisHour: "इस घंटे",
  deltaT: "डेल्टा-T",
  dropletDrying: "बूँद सूखने का सूचकांक",
  rainNext: "आगे की बारिश",
  peak: "चरम",
  whatsGood: "क्या अच्छा है",
  whatsNot: "क्या ठीक नहीं है",
  close: "बंद करें",
  whyMatters: "यह क्यों मायने रखता है",
  show: "दिखाएँ",
  hide: "छुपाएँ",
  expDeltaTTitle: "डेल्टा-T (बूँद सूखना)",
  expDeltaTBody:
    "डेल्टा-T हवा के तापमान और गीले-बल्ब तापमान के बीच का अंतर है। 2°C से कम पर हवा अत्यधिक नम होती है और बूँदें पत्ते पर बिना सूखे जमा रहती हैं। 10°C से ऊपर बूँदें लक्ष्य तक पहुँचने से पहले वाष्पित हो जाती हैं। सर्वोत्तम: 2–8°C।",
  expWindTitle: "हवा और बहाव",
  expWindBody:
    "3 किमी/घंटा से कम बिल्कुल शांत है: तापमान उत्क्रमण से धुआँ ज़मीन के पास जमा होकर बगल में बह सकता है। 15 किमी/घंटा से अधिक स्थिर, या 20 किमी/घंटा से अधिक झोंके, बूँदों को लक्ष्य से बाहर भेज देते हैं। आदर्श: 3–10 किमी/घंटा।",
  expRainTitle: "बारिश की खिड़कियाँ",
  expRainBody:
    "संपर्क उत्पादों को लंबी सूखी खिड़की (6–8 घंटे) चाहिए ताकि रसायन बारिश से धुलने से पहले पत्ते से बंधे। प्रणालीगत उत्पादों को केवल छोटी अवशोषण खिड़की (2–4 घंटे) चाहिए। पिछले 2 घंटे की बारिश से भी बचें — गीले पत्ते छिड़काव को पतला कर देते हैं।",
  expTimeTitle: "दिन का समय",
  expTimeBody:
    "गर्म दोपहर के घंटे (10 AM – 4 PM, >28°C) उच्च वाष्पीकरण, मजबूत UV टूटन, और अस्थिर हवा को जोड़ते हैं। सुबह जल्दी और देर दोपहर आमतौर पर ठंडी, स्थिर परिस्थितियाँ देते हैं।",
  invalidRequest: "अमान्य अनुरोध",
  invalidLocationSpray: "स्थान / छिड़काव प्रकार गायब या अमान्य।",
  startOver: "नए सिरे से शुरू करें",
  cantFetchWeather: "मौसम डेटा नहीं मिला",
  tryAgain: "फिर कोशिश करें",
  today: "आज",
  tomorrow: "कल",
  weatherCredit: "मौसम: Open-Meteo. हमेशा उत्पाद लेबल का पालन करें।",
  language: "भाषा",
  theme: "थीम",
  themeLight: "हल्की",
  themeDark: "गहरी",
  themeSystem: "सिस्टम",
  viewOnGithub: "GitHub पर देखें",
};

const mr: Strings = {
  appTitle: "फवारणी वेळ अंदाज",
  tagline: "मी कधी फवारणी करू शकतो?",
  description:
    "तुमच्या शेतासाठी पुढील 5 दिवसांच्या प्रत्येक तासाच्या फवारणी वेळा पहा. मोफत, साइन-अप नाही, Open-Meteo हवामान डेटा.",
  step1Location: "१. स्थान",
  step2Spray: "२. तुम्ही काय फवारत आहात?",
  seeForecast: "5-दिवसांचा अंदाज पहा",
  loading: "लोड होत आहे…",
  disclaimer:
    "नेहमी उत्पादन लेबल सूचनांचे पालन करा. हे साधन मार्गदर्शक आहे, व्यावसायिक कृषी सल्ल्याचा पर्याय नाही.",
  useMyLocation: "माझे सध्याचे स्थान वापरा",
  locating: "स्थान शोधत आहे…",
  orSearch: "किंवा शहर शोधा",
  searchPlaceholder: "उदा. पुणे, बेंगलुरू, काठमांडू",
  orPinMap: "किंवा नकाशावर पिन करा",
  hideMap: "नकाशा लपवा",
  selected: "निवडलेले",
  change: "बदला",
  loadingMap: "नकाशा लोड होत आहे…",
  geoUnsupported: "हा ब्राउझर GPS समर्थन देत नाही",
  geoFailed: "स्थान मिळू शकले नाही",
  profile_pesticide_contact: "संपर्क कीटकनाशक",
  profile_pesticide_contact_desc: "पृष्ठभाग कीटकनाशक (उदा. पायरेथ्रॉइड).",
  profile_pesticide_systemic: "प्रणालीगत कीटकनाशक",
  profile_pesticide_systemic_desc: "वनस्पतीद्वारे शोषले जाणारे कीटकनाशक. शोषण वेळ हवी.",
  profile_fungicide_contact: "संपर्क बुरशीनाशक",
  profile_fungicide_contact_desc: "पृष्ठभाग बुरशीनाशक (उदा. मॅन्कोझेब). लांब कोरडी वेळ हवी.",
  profile_fungicide_systemic: "प्रणालीगत बुरशीनाशक",
  profile_fungicide_systemic_desc: "शोषक बुरशीनाशक. आर्द्रता सहन करते.",
  profile_herbicide: "तणनाशक",
  profile_herbicide_desc: "तण मारक. शोषण वेळ आणि कमी वारा हवा.",
  profile_foliar_fertilizer: "पर्णीय खत",
  profile_foliar_fertilizer_desc: "पानांद्वारे द्रव पोषक. थंड + दमट चांगले.",
  profile_drone: "ड्रोन फवारणी",
  profile_drone_desc: "ड्रोनद्वारे हवाई फवारणी. बारीक थेंब आणि वारा वाहामुळे कठोर मर्यादा.",
  ratingGreen: "चांगले",
  ratingYellow: "मध्यम",
  ratingRed: "टाळा",
  back: "मागे",
  bestWindow: "सर्वोत्तम वेळ",
  noSuitableWindows: "पुढील 5 दिवसांत योग्य वेळ नाही",
  noSuitableBody: "हवामान प्रतिकूल आहे. उद्या पुन्हा पहा किंवा वेगळे उत्पादन निवडा.",
  allWindows: "सर्व फवारणी वेळा",
  hourlyForecast: "प्रति-तास अंदाज (5 दिवस)",
  windowsFound: "{n} वेळा सापडल्या",
  legendGood: "चांगले",
  legendMarginal: "मध्यम",
  legendAvoid: "टाळा",
  legendNight: "रात्र",
  tapHourHint: "तपशीलासाठी कोणत्याही तासावर टॅप करा",
  rating: "रेटिंग",
  temperature: "तापमान",
  humidity: "आर्द्रता",
  wind: "वारा",
  gusts: "वारा झोत",
  rainRisk: "पावसाचा धोका",
  thisHour: "या तासात",
  deltaT: "डेल्टा-T",
  dropletDrying: "थेंब सुकण्याचा निर्देशांक",
  rainNext: "पुढील पाऊस",
  peak: "उच्चतम",
  whatsGood: "काय चांगले आहे",
  whatsNot: "काय ठीक नाही",
  close: "बंद करा",
  whyMatters: "हे का महत्त्वाचे आहे",
  show: "दाखवा",
  hide: "लपवा",
  expDeltaTTitle: "डेल्टा-T (थेंब सुकणे)",
  expDeltaTBody:
    "डेल्टा-T म्हणजे हवेच्या तापमानात आणि ओल्या-बल्ब तापमानात फरक. 2°C खाली हवा अती आर्द्र असते आणि थेंब पानावर साचतात. 10°C वर थेंब लक्ष्यापर्यंत पोचण्यापूर्वी बाष्पीभूत होतात. सर्वोत्तम: 2–8°C.",
  expWindTitle: "वारा आणि फैलाव",
  expWindBody:
    "3 किमी/तास खाली अगदी शांत: तापमान उलथापालथीने वायू जमिनीजवळ साचतो. 15 किमी/तास वर सतत किंवा 20 किमी/तास झोत थेंबांना लक्ष्याबाहेर पाठवतात. आदर्श: 3–10 किमी/तास.",
  expRainTitle: "पावसाच्या वेळा",
  expRainBody:
    "संपर्क उत्पादनांना लांब कोरडी वेळ (6–8 तास) हवी. प्रणालीगत उत्पादनांना फक्त शोषण वेळ (2–4 तास) हवी. मागील 2 तासांचा पाऊस देखील टाळा.",
  expTimeTitle: "दिवसाची वेळ",
  expTimeBody:
    "गरम दुपार (सकाळी 10 – दुपारी 4, >28°C) उच्च बाष्पीभवन आणि अस्थिर हवा एकत्र आणतात. सकाळ आणि उशीरा दुपार स्थिर असतात.",
  invalidRequest: "अवैध विनंती",
  invalidLocationSpray: "स्थान / फवारणी प्रकार गहाळ किंवा अवैध.",
  startOver: "पुन्हा सुरू करा",
  cantFetchWeather: "हवामान डेटा मिळवू शकलो नाही",
  tryAgain: "पुन्हा प्रयत्न करा",
  today: "आज",
  tomorrow: "उद्या",
  weatherCredit: "हवामान: Open-Meteo. नेहमी उत्पादन लेबलचे पालन करा.",
  language: "भाषा",
  theme: "थीम",
  themeLight: "हलकी",
  themeDark: "गडद",
  themeSystem: "सिस्टम",
  viewOnGithub: "GitHub वर पहा",
};

const kn: Strings = {
  appTitle: "ಸಿಂಪಡಣೆ ಸಮಯ ಮುನ್ಸೂಚಕ",
  tagline: "ನಾನು ಯಾವಾಗ ಸಿಂಪಡಿಸಬಹುದು?",
  description:
    "ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಮುಂದಿನ 5 ದಿನಗಳ ಗಂಟೆಯ ಸಿಂಪಡಣೆ ಸಮಯವನ್ನು ನೋಡಿ. ಉಚಿತ, ಸೈನ್-ಅಪ್ ಇಲ್ಲ, Open-Meteo ಹವಾಮಾನ ದತ್ತಾಂಶ.",
  step1Location: "೧. ಸ್ಥಳ",
  step2Spray: "೨. ನೀವು ಏನು ಸಿಂಪಡಿಸುತ್ತಿದ್ದೀರಿ?",
  seeForecast: "5-ದಿನದ ಮುನ್ಸೂಚನೆ ನೋಡಿ",
  loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  disclaimer:
    "ಯಾವಾಗಲೂ ಉತ್ಪನ್ನದ ಲೇಬಲ್ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ. ಇದು ಮಾರ್ಗದರ್ಶಿ, ವೃತ್ತಿಪರ ಕೃಷಿ ಸಲಹೆಯ ಬದಲಿಯಲ್ಲ.",
  useMyLocation: "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
  locating: "ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ…",
  orSearch: "ಅಥವಾ ನಗರವನ್ನು ಹುಡುಕಿ",
  searchPlaceholder: "ಉದಾ. ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಪುಣೆ",
  orPinMap: "ಅಥವಾ ನಕ್ಷೆಯಲ್ಲಿ ಪಿನ್ ಮಾಡಿ",
  hideMap: "ನಕ್ಷೆ ಮರೆಮಾಡಿ",
  selected: "ಆಯ್ಕೆಯಾಗಿದೆ",
  change: "ಬದಲಾಯಿಸಿ",
  loadingMap: "ನಕ್ಷೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  geoUnsupported: "ಈ ಬ್ರೌಸರ್ GPS ಬೆಂಬಲಿಸುವುದಿಲ್ಲ",
  geoFailed: "ಸ್ಥಳ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",
  profile_pesticide_contact: "ಸಂಪರ್ಕ ಕೀಟನಾಶಕ",
  profile_pesticide_contact_desc: "ಮೇಲ್ಮೈ-ಕ್ರಿಯಾಶೀಲ ಕೀಟನಾಶಕ (ಉದಾ. ಪೈರೆಥ್ರಾಯ್ಡ್).",
  profile_pesticide_systemic: "ಪ್ರಣಾಳಿಕ ಕೀಟನಾಶಕ",
  profile_pesticide_systemic_desc: "ಸಸ್ಯ ಹೀರಿಕೊಳ್ಳುವ ಕೀಟನಾಶಕ. ಹೀರಿಕೆ ಸಮಯ ಬೇಕು.",
  profile_fungicide_contact: "ಸಂಪರ್ಕ ಶಿಲೀಂಧ್ರನಾಶಕ",
  profile_fungicide_contact_desc: "ಮೇಲ್ಮೈ ಶಿಲೀಂಧ್ರನಾಶಕ (ಉದಾ. ಮ್ಯಾಂಕೋಜ಼ೆಬ್). ಉದ್ದ ಒಣ ಸಮಯ ಬೇಕು.",
  profile_fungicide_systemic: "ಪ್ರಣಾಳಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ",
  profile_fungicide_systemic_desc: "ಹೀರಿಕೆಯಾದ ಶಿಲೀಂಧ್ರನಾಶಕ. ಆರ್ದ್ರತೆ ಸಹಿಸುತ್ತದೆ.",
  profile_herbicide: "ಕಳೆನಾಶಕ",
  profile_herbicide_desc: "ಕಳೆ ಕೊಲ್ಲುವ ಔಷಧಿ. ಹೀರಿಕೆ ಸಮಯ ಮತ್ತು ಕಡಿಮೆ ಗಾಳಿ ಬೇಕು.",
  profile_foliar_fertilizer: "ಎಲೆ ರಸಗೊಬ್ಬರ",
  profile_foliar_fertilizer_desc: "ಎಲೆಗಳ ಮೂಲಕ ದ್ರವ ಪೋಷಕಾಂಶ. ತಂಪು + ಆರ್ದ್ರ ಸೂಕ್ತ.",
  profile_drone: "ಡ್ರೋನ್ ಸಿಂಪಡಣೆ",
  profile_drone_desc:
    "ಡ್ರೋನ್ ಮೂಲಕ ವಾಯು ಸಿಂಪಡಣೆ. ಸಣ್ಣ ಹನಿಗಳಿಂದಾಗಿ ಬಿಗಿಯಾದ ಗಾಳಿ ಮಿತಿಗಳು.",
  ratingGreen: "ಒಳ್ಳೆಯದು",
  ratingYellow: "ಸಾಧಾರಣ",
  ratingRed: "ಬೇಡ",
  back: "ಹಿಂದೆ",
  bestWindow: "ಅತ್ಯುತ್ತಮ ಸಮಯ",
  noSuitableWindows: "ಮುಂದಿನ 5 ದಿನಗಳಲ್ಲಿ ಸೂಕ್ತ ಸಮಯವಿಲ್ಲ",
  noSuitableBody: "ಹವಾಮಾನ ಅನುಕೂಲವಿಲ್ಲ. ನಾಳೆ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಬೇರೆ ಉತ್ಪನ್ನ ಆಯ್ಕೆಮಾಡಿ.",
  allWindows: "ಎಲ್ಲಾ ಸಿಂಪಡಣೆ ಸಮಯಗಳು",
  hourlyForecast: "ಗಂಟೆಯ ಮುನ್ಸೂಚನೆ (5 ದಿನ)",
  windowsFound: "{n} ಸಮಯ ಸಿಕ್ಕಿತು",
  legendGood: "ಒಳ್ಳೆಯದು",
  legendMarginal: "ಸಾಧಾರಣ",
  legendAvoid: "ಬೇಡ",
  legendNight: "ರಾತ್ರಿ",
  tapHourHint: "ವಿವರಗಳಿಗಾಗಿ ಯಾವುದೇ ಗಂಟೆಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
  rating: "ರೇಟಿಂಗ್",
  temperature: "ತಾಪಮಾನ",
  humidity: "ಆರ್ದ್ರತೆ",
  wind: "ಗಾಳಿ",
  gusts: "ಗಾಳಿ ಬೀಸುಗಳು",
  rainRisk: "ಮಳೆ ಅಪಾಯ",
  thisHour: "ಈ ಗಂಟೆ",
  deltaT: "ಡೆಲ್ಟಾ-T",
  dropletDrying: "ಹನಿ ಒಣಗಿಸುವ ಸೂಚಕ",
  rainNext: "ಮುಂದಿನ ಮಳೆ",
  peak: "ಗರಿಷ್ಠ",
  whatsGood: "ಯಾವುದು ಒಳ್ಳೆಯದು",
  whatsNot: "ಯಾವುದು ಸರಿಯಿಲ್ಲ",
  close: "ಮುಚ್ಚಿ",
  whyMatters: "ಇದು ಏಕೆ ಮುಖ್ಯ",
  show: "ತೋರಿಸಿ",
  hide: "ಮರೆಮಾಡಿ",
  expDeltaTTitle: "ಡೆಲ್ಟಾ-T (ಹನಿ ಒಣಗಿಸುವಿಕೆ)",
  expDeltaTBody:
    "ಡೆಲ್ಟಾ-T ಎಂದರೆ ಗಾಳಿಯ ತಾಪಮಾನ ಮತ್ತು ಒದ್ದೆ-ಬಲ್ಬ್ ತಾಪಮಾನದ ನಡುವಿನ ಅಂತರ. 2°C ಗಿಂತ ಕಡಿಮೆ ಇದ್ದರೆ ಗಾಳಿ ತುಂಬಾ ಆರ್ದ್ರ, ಹನಿಗಳು ಎಲೆಯ ಮೇಲೆ ಒಣಗದೆ ಉಳಿಯುತ್ತವೆ. 10°C ಮೇಲೆ ಹನಿಗಳು ಗುರಿ ತಲುಪುವ ಮೊದಲೇ ಆವಿಯಾಗುತ್ತವೆ. ಸೂಕ್ತ: 2–8°C.",
  expWindTitle: "ಗಾಳಿ ಮತ್ತು ಚಲನೆ",
  expWindBody:
    "3 ಕಿಮೀ/ಗಂಟೆಗಿಂತ ಕಡಿಮೆ ಸಂಪೂರ್ಣ ಶಾಂತ: ತಾಪಮಾನ ತಿರುಗುವಿಕೆ ಹಬೆಯನ್ನು ನೆಲದ ಬಳಿ ಬಂಧಿಸುತ್ತದೆ. 15 ಕಿಮೀ/ಗಂಟೆ ಮೇಲೆ ಅಥವಾ 20 ಕಿಮೀ/ಗಂಟೆ ಬೀಸುಗಳು ಹನಿಗಳನ್ನು ಗುರಿ ಬಿಟ್ಟು ಕಳುಹಿಸುತ್ತವೆ. ಆದರ್ಶ: 3–10 ಕಿಮೀ/ಗಂಟೆ.",
  expRainTitle: "ಮಳೆ ಸಮಯಗಳು",
  expRainBody:
    "ಸಂಪರ್ಕ ಉತ್ಪನ್ನಗಳಿಗೆ ಉದ್ದ ಒಣ ಸಮಯ (6–8 ಗಂಟೆ) ಬೇಕು. ಪ್ರಣಾಳಿಕ ಉತ್ಪನ್ನಗಳಿಗೆ ಸಣ್ಣ ಹೀರಿಕೆ ಸಮಯ (2–4 ಗಂಟೆ) ಸಾಕು. ಕಳೆದ 2 ಗಂಟೆಯ ಮಳೆಯನ್ನೂ ತಪ್ಪಿಸಿ.",
  expTimeTitle: "ದಿನದ ಸಮಯ",
  expTimeBody:
    "ಬಿಸಿಲಿನ ಮಧ್ಯಾಹ್ನ (ಬೆಳಗ್ಗೆ 10 – ಮಧ್ಯಾಹ್ನ 4, >28°C) ಹೆಚ್ಚಿನ ಆವಿಯಾಗುವಿಕೆ ಮತ್ತು ಅಸ್ಥಿರ ಗಾಳಿ ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ. ಬೆಳಗಿನ ಮುಂಜಾನೆ ಮತ್ತು ತಡ-ಮಧ್ಯಾಹ್ನ ಸಾಮಾನ್ಯವಾಗಿ ತಂಪು ಮತ್ತು ಸ್ಥಿರ.",
  invalidRequest: "ಅಮಾನ್ಯ ವಿನಂತಿ",
  invalidLocationSpray: "ಸ್ಥಳ / ಸಿಂಪಡಣೆ ಪ್ರಕಾರ ಕಾಣೆಯಾಗಿದೆ ಅಥವಾ ಅಮಾನ್ಯ.",
  startOver: "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ",
  cantFetchWeather: "ಹವಾಮಾನ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",
  tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  today: "ಇಂದು",
  tomorrow: "ನಾಳೆ",
  weatherCredit: "ಹವಾಮಾನ: Open-Meteo. ಯಾವಾಗಲೂ ಉತ್ಪನ್ನ ಲೇಬಲ್ ಪಾಲಿಸಿ.",
  language: "ಭಾಷೆ",
  theme: "ಥೀಮ್",
  themeLight: "ತಿಳಿ",
  themeDark: "ಗಾಢ",
  themeSystem: "ಸಿಸ್ಟಮ್",
  viewOnGithub: "GitHub ನಲ್ಲಿ ನೋಡಿ",
};

const ne: Strings = {
  appTitle: "छर्ने समय अनुमानक",
  tagline: "म कहिले छर्न सक्छु?",
  description:
    "तपाईंको खेतको लागि अर्को 5 दिनको प्रति-घण्टा छर्ने समय हेर्नुहोस्। निःशुल्क, साइन-अप छैन, Open-Meteo मौसम डेटा द्वारा संचालित।",
  step1Location: "१. स्थान",
  step2Spray: "२. तपाईं के छर्दै हुनुहुन्छ?",
  seeForecast: "5-दिने पूर्वानुमान हेर्नुहोस्",
  loading: "लोड हुँदै…",
  disclaimer:
    "सधैं उत्पादन लेबल निर्देशनहरू पालना गर्नुहोस्। यो उपकरण मार्गदर्शक हो, पेशेवर कृषि सल्लाहको विकल्प होइन।",
  useMyLocation: "मेरो हालको स्थान प्रयोग गर्नुहोस्",
  locating: "स्थान खोज्दै…",
  orSearch: "वा सहर खोज्नुहोस्",
  searchPlaceholder: "जस्तै काठमाडौं, पोखरा, बेंगलुरु",
  orPinMap: "वा नक्साँमा पिन गर्नुहोस्",
  hideMap: "नक्सा लुकाउनुहोस्",
  selected: "छानिएको",
  change: "परिवर्तन गर्नुहोस्",
  loadingMap: "नक्सा लोड हुँदै…",
  geoUnsupported: "यो ब्राउजरले GPS समर्थन गर्दैन",
  geoFailed: "स्थान पाउन सकिएन",
  profile_pesticide_contact: "सम्पर्क कीटनाशक",
  profile_pesticide_contact_desc: "सतह कीटनाशक (जस्तै पाइरेथ्रोइड)।",
  profile_pesticide_systemic: "प्रणालीगत कीटनाशक",
  profile_pesticide_systemic_desc: "बिरुवाले सोस्ने कीटनाशक। सोस्ने समय चाहिन्छ।",
  profile_fungicide_contact: "सम्पर्क ढुसीनाशक",
  profile_fungicide_contact_desc: "सतह ढुसीनाशक (जस्तै म्यान्कोजेब)। लामो सुक्खा समय चाहिन्छ।",
  profile_fungicide_systemic: "प्रणालीगत ढुसीनाशक",
  profile_fungicide_systemic_desc: "सोसिने ढुसीनाशक। आर्द्रता सहन्छ।",
  profile_herbicide: "झारनाशक",
  profile_herbicide_desc: "झार मार्ने औषधि। सोस्ने समय र कम हावा चाहिन्छ।",
  profile_foliar_fertilizer: "पात मलखाद",
  profile_foliar_fertilizer_desc: "पातबाट तरल पोषक तत्व। चिसो + आर्द्र राम्रो।",
  profile_drone: "ड्रोन छर्ने",
  profile_drone_desc:
    "ड्रोनद्वारा हवाई छर्ने। साना थोपा र पंखा हावाको कारण कडा सीमा।",
  ratingGreen: "राम्रो",
  ratingYellow: "ठीकै",
  ratingRed: "नगर्नुहोस्",
  back: "फिर्ता",
  bestWindow: "उत्तम समय",
  noSuitableWindows: "अर्को 5 दिनमा उपयुक्त समय छैन",
  noSuitableBody: "मौसम प्रतिकूल छ। भोलि फेरि हेर्नुहोस् वा अर्को उत्पादन छान्नुहोस्।",
  allWindows: "सबै छर्ने समयहरू",
  hourlyForecast: "प्रति-घण्टा पूर्वानुमान (5 दिन)",
  windowsFound: "{n} समय फेला पर्‍यो",
  legendGood: "राम्रो",
  legendMarginal: "ठीकै",
  legendAvoid: "नगर्नुहोस्",
  legendNight: "रात",
  tapHourHint: "विवरणको लागि कुनै पनि घण्टा थिच्नुहोस्",
  rating: "रेटिङ",
  temperature: "तापक्रम",
  humidity: "आर्द्रता",
  wind: "हावा",
  gusts: "हावाको झोक्का",
  rainRisk: "वर्षाको जोखिम",
  thisHour: "यो घण्टा",
  deltaT: "डेल्टा-T",
  dropletDrying: "थोपा सुक्ने सूचकांक",
  rainNext: "अगाडिको वर्षा",
  peak: "चरम",
  whatsGood: "के राम्रो छ",
  whatsNot: "के ठीक छैन",
  close: "बन्द गर्नुहोस्",
  whyMatters: "यो किन महत्त्वपूर्ण छ",
  show: "देखाउनुहोस्",
  hide: "लुकाउनुहोस्",
  expDeltaTTitle: "डेल्टा-T (थोपा सुक्ने)",
  expDeltaTBody:
    "डेल्टा-T भनेको हावा र भिजेको-बल्ब तापक्रम बीचको फरक हो। 2°C भन्दा कम हावा अति आर्द्र हुन्छ। 10°C भन्दा माथि थोपा लक्ष्यमा पुग्नु अघि वाष्पीकरण हुन्छ। उत्तम: 2–8°C।",
  expWindTitle: "हावा र बहाव",
  expWindBody:
    "3 किमी/घण्टा भन्दा कम पूर्ण शान्त: तापक्रम उल्टाइले धुवाँलाई जमिन नजिक राख्छ। 15 किमी/घण्टा भन्दा माथि वा 20 किमी/घण्टा झोक्काले थोपा लक्ष्य बाहिर पठाउँछ। आदर्श: 3–10 किमी/घण्टा।",
  expRainTitle: "वर्षा समयहरू",
  expRainBody:
    "सम्पर्क उत्पादनलाई लामो सुक्खा समय (6–8 घण्टा) चाहिन्छ। प्रणालीगत उत्पादनलाई सानो सोस्ने समय (2–4 घण्टा) पुग्छ। विगत 2 घण्टाको वर्षाबाट पनि बच्नुहोस्।",
  expTimeTitle: "दिनको समय",
  expTimeBody:
    "गर्मी मध्यान्ह (बिहान 10 – दिउँसो 4, >28°C) उच्च वाष्पीकरण र अस्थिर हावा संयोजन गर्छ। बिहान सबेरै र दिउँसो ढिलो प्रायः चिसो र स्थिर हुन्छ।",
  invalidRequest: "अमान्य अनुरोध",
  invalidLocationSpray: "स्थान / छर्ने प्रकार हराइरहेको वा अमान्य।",
  startOver: "नयाँ सुरू गर्नुहोस्",
  cantFetchWeather: "मौसम डेटा पाउन सकिएन",
  tryAgain: "फेरि प्रयास गर्नुहोस्",
  today: "आज",
  tomorrow: "भोलि",
  weatherCredit: "मौसम: Open-Meteo। सधैं उत्पादन लेबल पालन गर्नुहोस्।",
  language: "भाषा",
  theme: "थिम",
  themeLight: "उज्यालो",
  themeDark: "अँध्यारो",
  themeSystem: "सिस्टम",
  viewOnGithub: "GitHub मा हेर्नुहोस्",
};

const DICT: Record<Lang, Strings> = { en, hi, mr, kn, ne };

export function getT(lang: Lang): Strings {
  return DICT[lang] ?? DICT[DEFAULT_LANG];
}
