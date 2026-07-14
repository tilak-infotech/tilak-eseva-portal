// Data and Translation configurations for Tilak E-Seva Portal
// Highly optimized for Aadhaar-PAN Link Linkage Status and Mobile Recharge services.

export interface FAQItem {
  q: string;
  a: string;
  qKn?: string;
  aKn?: string;
}

export interface SubService {
  id: string;
  name: string;
  nameKn: string;
  shortDesc: string;
  shortDescKn: string;
  overview: string;
  overviewKn: string;
  eligibility: string[];
  eligibilityKn: string[];
  documents: string[];
  documentsKn: string[];
  feeGovt: number;
  feeProcessing: number;
  process: string[];
  processKn: string[];
  faqs: FAQItem[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameKn: string;
  iconName: string;
  status: "Available" | "Coming Soon";
  statusKn: string;
  subServices: SubService[];
}

export const CATEGORIES: ServiceCategory[] = [
  {
    id: "aadhaar-pan-verification",
    name: "Aadhaar & PAN Services",
    nameKn: "ಆಧಾರ್ ಮತ್ತು ಪಾನ್ ಸೇವೆಗಳು",
    iconName: "Shield",
    status: "Available",
    statusKn: "ಲಭ್ಯವಿದೆ",
    subServices: [
      {
        id: "aadhar-pan-link",
        name: "Aadhar-Pan Link Update Checker",
        nameKn: "ಆಧಾರ್-ಪಾನ್ ಲಿಂಕ್ ಅಪ್‌ಡೇಟ್ ಪರಿಶೀಲನೆ",
        shortDesc: "Instantly check the coupling and official connection state of your Aadhaar & PAN Card.",
        shortDescKn: "ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆಗೆ ಪಾನ್ ಕಾರ್ಡ್ ಲಿಂಕ್ ಆಗಿದೆಯೇ ಎಂದು ತಕ್ಷಣವೇ ಪರಿಶೀಲಿಸಿ.",
        overview: "Ensures strict alignment with income tax department directives by validating whether your Permanent Account Number (PAN) is correctly linked to your Aadhaar card with real-time official database matching.",
        overviewKn: "ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆಯ ನಿಯಮಾವಳಿಗಳ ಅನ್ವಯ ನಿಮ್ಮ ಪಾನ್ ಕಾರ್ಡ್ ಆಕ್ಟಿವ್ ಆಧಾರ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಸೇರಲ್ಪಟ್ಟಿದೆಯೇ ಎಂದು ನಿಖರವಾಗಿ ಪರಿಶೀಲಿಸಿ.",
        eligibility: ["Any individual Indian citizen or taxpayer holding an active Aadhaar and PAN."],
        eligibilityKn: ["ಮಾನ್ಯ ಆಧಾರ್ ಮತ್ತು ಪಾನ್ ಗುರುತಿನ ಚೀಟಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ಭಾರತೀಯ ನಾಗರಿಕರು."],
        documents: ["Aadhaar Card number / photo", "PAN Card number / photo"],
        documentsKn: ["ಆಧಾರ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ / ಫೋಟೋ", "ಪಾನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ / ಫೋಟೋ"],
        feeGovt: 0,
        feeProcessing: 25,
        process: [
          "Enter your registered WhatsApp number for progress logs.",
          "Upload legible photos of your Aadhaar and PAN card.",
          "Scan the UPI QR Code to pay the ₹25 checkout processing rate.",
          "Upload your screenshot bill. Tracking Case ID is instantly logged. Access reviewer remarks within 10 minutes."
        ],
        processKn: [
          "ನಿಮ್ಮ ವಾಟ್ಸಾಪ್ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
          "ಫಾರ್ಮ್‌ನಲ್ಲಿ ಆಧಾರ್ ಮತ್ತು ಪಾನ್ ಕಾರ್ಡ್‌ನ ಸ್ಪಷ್ಟ ಫೋಟೋಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ.",
          "ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ₹25 ಪ್ರೊಸೆಸಿಂಗ್ ಸೇವಾ ಶುಲ್ಕವನ್ನು ಪಾವತಿಸಿ.",
          "ಪಾವತಿ ರಶೀದಿಯನ್ನು ಸಲ್ಲಿಸಿ. 10 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆಗೆ ಪರಿಶೀಲನಾ ವರದಿ ಸಿಗಲಿದೆ."
        ],
        faqs: [
          {
            q: "Why should check Aadhaar-PAN link status?",
            a: "As per tax department notifications, unlinked PAN cards may become inoperative, affecting salary deposits, real estate purchases, or bank accounts.",
            qKn: "ಆಧಾರ್-ಪಾನ್ ಲಿಂಕ್ ಹಂತವನ್ನು ಪರಿಶೀಲಿಸುವುದು ಏಕೆ ಮುಖ್ಯ?",
            aKn: "ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆಯ ಆದೇಶದಂತೆ, ಲಿಂಕ್ ಮಾಡದ ಪಾನ್ ಕಾರ್ಡ್‌ಗಳು ನಿಷ್ಕ್ರಿಯಗೊಳ್ಳಬಹುದು, ಇದರಿಂದ ಬ್ಯಾಂಕಿಂಗ್ ವ್ಯವಹಾರಗಳು ಮತ್ತು ಐಟಿ ರಿಟರ್ನ್ಸ್‌ನಲ್ಲಿ ತೊಂದರೆಯಾಗಬಹುದು."
          },
          {
            q: "How long does verification take?",
            a: "Our reviewer queue processes your matching records of linking within 10 to 15 minutes of fee submission.",
            qKn: "ಪರಿಶೀಲನೆಗೆ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?",
            aKn: "ನೀವು ಅರ್ಜಿ ಮತ್ತು ಶುಲ್ಕವನ್ನು ಸಲ್ಲಿಸಿದ ಕೇವಲ 10 ರಿಂದ 15 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ವಾಟ್ಸಾಪ್‌ಗೆ ಪರಿಶೀಲನಾ ವರದಿ ರವಾನಿಸಲಾಗುತ್ತದೆ."
          }
        ]
      }
    ]
  },
  {
    id: "telecom-recharge-category",
    name: "Mobile Recharge Services",
    nameKn: "ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್ ಸೇವೆಗಳು",
    iconName: "Zap",
    status: "Available",
    statusKn: "ಲಭ್ಯವಿದೆ",
    subServices: [
      {
        id: "mobile-recharge",
        name: "Mobile Recharge Service",
        nameKn: "ಮೊಬೈಲ್ ಪ್ರಿಪೇಯ್ಡ್ ರೀಚಾರ್ಜ್ ಸೇವೆ",
        shortDesc: "Instant cellular connection recharge, talktime, high-speed data vouchers or unlimited utility top-ups.",
        shortDescKn: "ಜಿಯೋ, ಏರ್‌ಟೆಲ್, ವಿ, ಬಿಎಸ್‌ಎನ್‌ಎಲ್ ಸೇರಿದಂತೆ ಎಲ್ಲಾ ಮೊಬೈಲ್ ಕರೆ ಮತ್ತು ಇಂಟರ್ನೆಟ್ ಅತ್ಯಂತ ತ್ವರಿತ ರೀಚಾರ್ಜ್.",
        overview: "A premium frictionless cellular service offering high-speed network plan refills with zero ads, directly routing token triggers to main telecom registers for instant network updates.",
        overviewKn: "ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿ ಜಾಹೀರಾತುಗಳ ಕಿರಿಕಿರಿ ಇಲ್ಲದೆ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಅತ್ಯಂತ ತ್ವರಿತವಾಗಿ ರೀಚಾರ್ಜ್ ಮಾಡುವ ವಿಶ್ವಾಸಾರ್ಹ ಸೇವೆ.",
        eligibility: ["All prepaid or postpaid connection subscribers across India."],
        eligibilityKn: ["ಎಲ್ಲಾ ಸಕ್ರಿಯ ಪ್ರಿ-ಪೇಯ್ಡ್ ಅಥವಾ ಪೋಸ್ಟ್ ಪೇಯ್ಡ್ ಮೊಬೈಲ್ ಚಂದಾದಾರರು."],
        documents: ["Target Recharge Mobile Number", "Selected Plan Amount Detail"],
        documentsKn: ["ರೀಚಾರ್ಜ್ ಮಾಡಬೇಕಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", "ಪ್ಲಾನ್ ಮೊತ್ತ ಮತ್ತು ವಿವರಣೆ"],
        feeGovt: 0,
        feeProcessing: 25,
        process: [
          "Provide cellular mobile number, select network carrier, and fill targeted plan top-up value sum.",
          "Verify the combined checkout checkout sum (Plan value + ₹25 secure support service charge).",
          "Open your favorite UPI App (GPay/PhonePe/Paytm) and scan the dynamic generated checkout QR.",
          "Log your payment bill screenshot. Your recharge will be credited directly to your handset line under 2 minutes!"
        ],
        processKn: [
          "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ಆಪರೇಟರ್ ಹಾಗೂ ರೀಚಾರ್ಜ್ ಮಾಡಿಸಬೇಕಿರುವ ಪ್ಲಾನ್ ಮೊತ್ತವನ್ನು ಸೆಲೆಕ್ಟ್ ಮಾಡಿ.",
          "ಒಟ್ಟು ಮೊತ್ತವನ್ನು ಪರಿಶೀಲಿಸಿ (ನಿಮ್ಮ ರೀಚಾರ್ಜ್ ಪ್ಲಾನ್ ಮೊತ್ತ + ₹25 ಇ-ಸೇವಾ ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ).",
          "ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಮುಂಗಡ ಮೊತ್ತವನ್ನು ಯುಪಿಐ ಮೂಲಕ ಪಾವತಿಸಿ.",
          "ಪಾವತಿ ರಶೀದಿಯನ್ನು ಸಬ್ಮಿಟ್ ಮಾಡಿ. ಕೇವಲ 2 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್ ಪೂರ್ಣಗೊಳ್ಳಲಿದೆ!"
        ],
        faqs: [
          {
            q: "Are cellular data plans immediately triggered?",
            a: "Yes. Refills are automatically pushed to main servers instantly once the desk reviewers receive screenshot receipt confirmation.",
            qKn: "ಡೇಟಾ ಮತ್ತು ಕಾಲಿಂಗ್ ಪ್ಲಾನ್ ತಕ್ಷಣ ಸಕ್ರಿಯವಾಗುತ್ತದೆಯೇ?",
            aKn: "ಹೌದು. ನಿಮ್ಮ ರಶೀದಿಯನ್ನು ಸಲ್ಲಿಸಿ ನಮ್ಮ ಸಿಬ್ಬಂದಿ ಚೆಕ್ ಮಾಡಿದ ತಕ್ಷಣ ಆಟೋಮ್ಯಾಟಿಕ್ ಸರ್ವರ್ ಮೂಲಕ ರೀಚಾರ್ಜ್ ಸಕ್ರಿಯಗೊಳ್ಳುತ್ತದೆ."
          },
          {
            q: "What is the checkout surcharge?",
            a: "We add a standard nominal ₹25 assistance and transaction processing fee to support 24/7 dedicated server operations.",
            qKn: "ರೂ. 25 ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ ಏಕೆ?",
            aKn: "ನಿಮ್ಮ ರೀಚಾರ್ಜ್ ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ಮತ್ತು ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿಸಲು ಸಹಾಯ ಮಾಡುವ ನಮ್ಮ ನಿರಂತರ ಸೇವೆಗಾಗಿ ಕನಿಷ್ಠ ರೂ. 25 ಶುಲ್ಕವನ್ನು ವಿಧಿಸಲಾಗುತ್ತದೆ."
          }
        ]
      }
    ]
  }
];

export const I18N_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    appTitle: "Tilak E-Seva Portal",
    appSubTitle: "Powered by Tilak Infotech",
    tagline: "All Services. One Platform. Powered by Trust.",
    newsTitle: "Live Updates",
    searchPlaceholder: "Search services (Aadhaar, PAN Link Checker, Mobile Recharge...)",
    servicesHub: "Services Directory",
    applyService: "Apply Assistance",
    trackStatus: "Track Status",
    aiAssistant: "AI Support",
    statsServices: "Active E-Services",
    statsCategories: "Available Domains",
    statsHappy: "Happy Citizens",
    statsSupport: "Expert Live Desk",
    ctaHelpTitle: "Avoid Long Queue Lines & Delays",
    ctaHelpDesc: "Don't sit in government queues. Our professional e-services team processes your status link checks and telecom recharges securely with immediate dispatch.",
    whatsappButton: "WhatsApp Desk Support",
    howItWorksTitle: "Frictionless Checkout Framework",
    howStep1: "1. Select Service",
    howStep1Desc: "Choose Aadhaar-PAN Connection Checks or Instant Mobile Recharges from our pristine modern grid.",
    howStep2: "2. View Checklist",
    howStep2Desc: "See precise processing charges, eligibility criteria, and required fields with pristine simplicity.",
    howStep3: "3. Input details & Pay",
    howStep3Desc: "Enter details like WhatsApp line or recharge plan and scan our secure instant UPI QR code safely.",
    howStep4: "4. Fast Dispatch",
    howStep4Desc: "Upload receipt confirmation and view expert reviewer confirmation or mobile credits under 5 minutes.",
    available: "Available",
    comingSoon: "Coming Soon",
    viewDetails: "View Checklist",
    overview: "Service Overview",
    eligibility: "Eligibility Benchmark",
    documentsReq: "Prerequisites & Requirements",
    feesHeading: "Service Fee Structure",
    processHeading: "Filing & Processing Stages",
    faqHeading: "Dedicated Service FAQs",
    applyOnlineAssistance: "Start Application Assistance",
    serviceCode: "Service Tag ID",
    govtFee: "Govt / Operator Rate",
    tilakFee: "Tilak Handling Fee",
    assistPre: "₹25 (One-time secure processing)",
    registerTitle: "Service Registration Gateway",
    stepLabelDoc1: "Aadhaar Card Front Proof",
    stepLabelDoc2: "PAN Card Front Proof",
    stepLabelPhone: "WhatsApp Number",
    stepLabelPay: "Payment Transfer",
    stepLabelConfirm: "Upload Bill Receipt",
    stepLabelRechargeDetails: "Mobile Target Info",
    dragAndDrop: "Drag & drop file photo or click device camera to snap",
    removeFile: "Remove image",
    whatsappVerifyHint: "We will message status details directly to this active WhatsApp number.",
    proceedNext: "Next Step",
    goBack: "Go Back",
    submitForm: "Submit Verification Request",
    finalizingLog: "Transmitting document packets to secure Tilak system...",
    successTitle: "E-Service Logging Successful",
    successDesc: "Your manual processing queue identifier has been created successfully, locked for instant desk reviewer audit.",
    queryCodeLabel: "Assisted Case Tracking ID-Code",
    copyCode: "Copy ID Code",
    copied: "Copied!",
    turnaroundNotice: "The standard expert turnaround is under 5-10 minutes. Review notes are live on tracking.",
    chatWelcome: "Hello! I am your citizen advisor. Choose a service or ask questions about fees.",
    chatPlaceholder: "Type your query...",
    chatSending: "Consulting...",
    trackBoxTitle: "Case Tracking Code Lookup",
    trackBoxDesc: "Enter your 6-digit Case ID block code to view reviewer remarks and receipt logs.",
    trackPlaceholder: "E.g. 104523",
    queryCodeBtn: "Query Logs",
    caseIdLabel: "CASE ENVELOPE ID",
    registeredAt: "Application Logged",
    destPhone: "WhatsApp Notification Destination",
    verificationPhase: "Verification Phase",
    remarksHeading: "Expert Reviewer Remarks",
    rateServiceTitle: "Rate Processing Turnaround",
    rateServiceDesc: "Please provide your rating benchmark below.",
    submitFeedback: "Log Verified Review",
    ratingReceipt: "✓ Service rating registered under Tilak. Thank you.",
    privacyPolicy: "Transient uploads are digitally destroyed after 24 hours under sandbox guidelines."
  },
  kn: {
    appTitle: "ತಿಲಕ್ ಇ-ಸೇವಾ ಪೋರ್ಟಲ್",
    appSubTitle: "ತಿಲಕ್ ಇನ್ಫೋಟೆಕ್ ಪ್ರಾಯೋಜಿತ",
    tagline: "ಎಲ್ಲಾ ಸೇವೆಗಳು. ಒಂದೇ ವೇದಿಕೆ. ತತ್ವ ಮತ್ತು ವಿಶ್ವಾಸ.",
    newsTitle: "ಲೈವ್ ಅಪ್ಡೇಟ್",
    searchPlaceholder: "ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ (ಆಧಾರ್-ಪಾನ್ ಲಿಂಕ್ ಚೇಕರ್, ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್...)",
    servicesHub: "ಸೇವಾ ಮಾಹಿತಿ ಪಟ್ಟಿ",
    applyService: "ಅರ್ಜಿ ಸಹಾಯ",
    trackStatus: "ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ",
    aiAssistant: "ಸಹಾಯ",
    statsServices: "ಸಕ್ರಿಯ ಸೇವೆಗಳು",
    statsCategories: "ಲಭ್ಯವಿರುವ ವಿಭಾಗಗಳು",
    statsHappy: "ಸಂತೃಪ್ತ ನಾಗರಿಕರು",
    statsSupport: "ಲೈವ್ ಹೆಲ್ಪ್ ಡೆಸ್ಕ್",
    ctaHelpTitle: "ಉದ್ದನೆಯ ಸಾಲುಗಳನ್ನು ಮತ್ತು ವಿಳಂಬವನ್ನು ತಪ್ಪಿಸಿ",
    ctaHelpDesc: "ಸರ್ಕಾರಿ ಕಚೇರಿಗಳಲ್ಲಿ ಕಾಯಬೇಡಿ. ನಮ್ಮ ವೃತ್ತಿಪರ ಇ-ಸೇವೆಗಳ ತಂಡವು ನಿಮ್ಮ ಲಿಂಕ್ ಹಂತಗಳು ಮತ್ತು ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್‌ಗಳನ್ನು ಅತ್ಯಂತ ಸುರಕ್ಷಿತವಾಗಿ, ಕೇವಲ 5 ನಿಮಿಷಗಳಲ್ಲಿ ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ.",
    whatsappButton: "ವಾಟ್ಸಾಪ್ ಸಹಾಯವಾಣಿ",
    howItWorksTitle: "ಸುಲಭ ಪರಿಶೀಲನಾ ಹಂತಗಳು",
    howStep1: "1. ಮೊದಲು ಸೇವೆ ಆಯ್ಕೆಮಾಡಿ",
    howStep1Desc: "ನಮ್ಮ ಆಧಾರ್-ಪಾನ್ ಲಿಂಕ್ ಚೆಕ್ ಅಥವಾ ಮೊಬೈಲ್ ಪ್ರಿಪೇಯ್ಡ್ ರೀಚಾರ್ಜ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಆಯ್ಕೆಮಾಡಿ.",
    howStep2: "2. ಪ್ರಕ್ರಿಯೆ ನೋಡಿ",
    howStep2Desc: "ಸೇವೆಯ ಅರ್ಹತೆ, ಶುಲ್ಕ ಮತ್ತು ಅತ್ಯಗತ್ಯ ಫೈಲ್ ಪ್ರೇಕ್ಷಕರನ್ನು ಕೇವಲ ಒಂದು ನೋಟದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    howStep3: "3. ಮಾಹಿತಿ ಮತ್ತು ಪಾವತಿ",
    howStep3Desc: "ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ ಅಥವಾ ರೀಚಾರ್ಜ್ ಪ್ಲಾನ್ ಸಲ್ಲಿಸಿ ನಮ್ಮ ಸುರಕ್ಷಿತ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.",
    howStep4: "4. ತಕ್ಷಣ ಸೇವೆ ಸಕ್ರಿಯ",
    howStep4Desc: "ಪಾವತಿ ರಶೀದಿ ಅಪ್ಲೋಡ್ ಮಾಡಿ ತಕ್ಷಣ ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್ ಕ್ರೆಡಿಟ್ ಅಥವಾ ಆಧಾರ್ ವರದಿ ಪಡೆದುಕೊಳ್ಳಿ.",
    available: "ಲಭ್ಯವಿದೆ",
    comingSoon: "ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ",
    viewDetails: "ವಿವರಗಳು",
    overview: "ಸೇವೆಯ ಅವಲೋಕನ",
    eligibility: "ಅರ್ಹತೆಯ ಮಾನದಂಡ",
    documentsReq: "ಅತ್ಯಗತ್ಯ ದಾಖಲೆಗಳು / ಪ್ರಕ್ರಿಯೆಗಳು",
    feesHeading: "ಸೇವಾ ಶುಲ್ಕದ ವಿವರಣೆ",
    processHeading: "ಅಪ್ಲಿಕೇಶನ್ ಪ್ರಕ್ರಿಯೆಯ ಹಂತಗಳು",
    faqHeading: "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೋತ್ತರಗಳು",
    applyOnlineAssistance: "ಅರ್ಜಿ ಸಹಾಯ ಪ್ರಾರಂಭಿಸಿ",
    serviceCode: "ಸೇವಾ ಕೋಡ್",
    govtFee: "ಸರ್ಕಾರಿ / ಆಪರೇಟರ್ ಬೆಲೆ",
    tilakFee: "ತಿಲಕ್ ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕ",
    assistPre: "₹25 (ಒಂದು ಬಾರಿ ಸುರಕ್ಷಿತ ಸೇವೆ)",
    registerTitle: "ಇ-ಸೇವಾ ಅರ್ಜಿ ನೋಂದಣಿ",
    stepLabelDoc1: "ಆಧಾರ್ ಮುಂಭಾಗದ ಫೋಟೋ",
    stepLabelDoc2: "ಪಾನ್ ಮುಂಭಾಗದ ಫೋಟೋ",
    stepLabelPhone: "ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ",
    stepLabelPay: "ಯುಪಿಐ ಪಾವತಿ",
    stepLabelConfirm: "ರಶೀದಿ ಅಪ್ಲೋಡ್",
    stepLabelRechargeDetails: "ಮೊಬೈಲ್ ಮಾಹಿತಿ",
    dragAndDrop: "ಫೈಲ್ ಡ್ರಾಗ್ ಮಾಡಿ ಅಥವಾ ಕ್ಯಾಮೆರಾ ಮೂಲ ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ",
    removeFile: "ಚಿತ್ರ ತೆಗೆದುಹಾಕಿ",
    whatsappVerifyHint: "ದಾಖಲೆಗಳ ಸ್ಥಿತಿಯನ್ನು ನೇರವಾಗಿ ಈ ವಾಟ್ಸಾಪ್ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",
    proceedNext: "ಮುಂದಿನ ಹಂತ",
    goBack: "ಹಿಂದೆ ಹೋಗಿ",
    submitForm: "ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ",
    finalizingLog: "ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳನ್ನು ತಿಲಕ್ ಇನ್ಫೋಟೆಕ್ ಸಿಸ್ಟಮ್‌ಗೆ ರವಾನಿಸಲಾಗುತ್ತಿದೆ...",
    successTitle: "ಅರ್ಜಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ",
    successDesc: "ನಿಮ್ಮ ಇ-ಸೇವಾ ಪ್ರಕರಣದ ಐಡಿ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದ್ದು, ನಮ್ಮ ಸಿಬ್ಬಂದಿ ತಕ್ಷಣ ಪರಿಶೀಲನೆ ನಡೆಸಲಿದ್ದಾರೆ.",
    queryCodeLabel: "ಇ-ಸೇವಾ ಪ್ರಕರಣದ ಟ್ರ್ಯಾಕಿಂಗ್ ಐಡಿ",
    copyCode: "ಕೋಡ್ ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    turnaroundNotice: "ಸರಾಸರಿ ಸೇವಾ ಸಮಯ ಕೇವಲ 5 ರಿಂದ 10 ನಿಮಿಷಗಳು. ಲೈವ್ ಅಪ್ಡೇಟ್ ಟ್ರ್ಯಾಕ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುತ್ತದೆ.",
    chatWelcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಲಹೆಗಾರ. ಇ-ಸೇವೆ ಅಥವಾ ಶುಲ್ಕಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ಕೇಳಿ.",
    chatPlaceholder: "ನಿಮ್ಮ ಸಂದೇಶ...",
    chatSending: "ಮರುಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    trackBoxTitle: "ಪ್ರಕರಣದ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕಿಂಗ್",
    trackBoxDesc: "ನಿಮ್ಮ 6-ಅಂಕಿಯ ಪ್ರಕರಣದ ಐಡಿ ಸಲ್ಲಿಸಿ, ಸಿಬ್ಬಂದಿಯ ಪರಿಶೀಲನಾ ವರದಿಯನ್ನು ಲೈವ್ ಆಗಿ ನೋಡಿ.",
    trackPlaceholder: "ಉದಾಹರಣೆಗೆ 104523",
    queryCodeBtn: "ವರದಿ ನೋಡಿ",
    caseIdLabel: "ಪ್ರಕರಣದ ಐಡಿ ಸಂಖ್ಯೆ",
    registeredAt: "ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾದ ದಿನಾಂಕ",
    destPhone: "ವಾಟ್ಸಾಪ್ ನೋಟಿಫಿಕೇಶನ್ ಸಂಖ್ಯೆ",
    verificationPhase: "ಪರಿಶೀಲನಾ ಹಂತ",
    remarksHeading: "ಸಿಬ್ಬಂದಿಯ ಪರಿಶೀಲನಾ ವರದಿ ಮತ್ತು ಕಾಮೆಂಟ್",
    rateServiceTitle: "ನಮ್ಮ ಸೇವೆಯನ್ನು ರೇಟ್ ಮಾಡಿ",
    rateServiceDesc: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅಮೂಲ್ಯ ರೇಟಿಂಗ್ ಒದಗಿಸಿ.",
    submitFeedback: "ರೇಟಿಂಗ್ ಸಲ್ಲಿಸಿ",
    ratingReceipt: "✓ ನಿಮ್ಮ ರೇಟಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು.",
    privacyPolicy: "ಸುರಕ್ಷತೆಯ ದೃಷ್ಟಿಯಿಂದ ಅಪ್ಲೋಡ್ ಮಾಡಲಾದ ಫೈಲ್‌ಗಳನ್ನು 24 ಗಂಟೆಗಳಲ್ಲಿ ಸರ್ವರ್‌ನಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಾಶಪಡಿಸಲಾಗುತ್ತದೆ."
  }
};

export const FACTS_UPDATES: Record<string, string[]> = {
  en: [
    "Aadhaar-PAN pairing prevents penalizing text structures of frozen utility lines.",
    "Bypassing complex logins, E-Seva serves immediate direct telecom loading in 2 minutes.",
    "Real-time desk updates are dispatched straight to your personal WhatsApp portal.",
    "Under secure privacy laws, file packets are permanently purged after 24 hours."
  ],
  kn: [
    "ಆಧಾರ್-ಪಾನ್ ಜೋಡಣೆ ಮಾಡಿಸುವುದರಿಂದ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಮತ್ತು ಆದಾಯ ತೆರಿಗೆ ತೊಂದರೆಗಳು ತಪ್ಪುತ್ತವೆ.",
    "ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿ ಅಪ್ಲಿಕೇಶನ್‌ಗಳಿಲ್ಲದೆ, ನೇರವಾಗಿ ಕೇವಲ 2 ನಿಮಿಷಗಳಲ್ಲಿ ಮೊಬೈಲ್ ರೀಚಾರ್ಜ್ ಪೂರ್ಣಗೊಳ್ಳಲಿದೆ.",
    "ದಾಖಲೆಯ ಪರಿಶೀಲನಾ ವರದಿಗಳನ್ನು ನಿಮ್ಮ ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆಗೆ ನೇರವಾಗಿ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",
    "ನಿಮ್ಮ ಗೌಪ್ಯತೆಯ ರಕ್ಷಣೆಗಾಗಿ ಸಲ್ಲಿಕೆಯಾದ ದಾಖಲೆಗಳನ್ನು 24 ಗಂಟೆಗಳಲ್ಲಿ ಭಾರತೀಯ ಸರ್ವರ್‌ನಿಂದ ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ."
  ]
};

export const NEWS_TICKER_ITEMS: Record<string, string[]> = {
  en: [
    "🔥 EXTREME VALUE: Standard assistance convenience fee is permanently frozen at ₹25 only!",
    "⚠️ IMPORTANT: Unlinked PAN cards may become inoperative under Income Tax Act Section 139AA.",
    "🚀 UPDATE: Instantly trigger Jio, Airtel, Vi and BSNL refills across all prepaid connections on India networks."
  ],
  kn: [
    "🔥 ಕೊಡುಗೆ: ನಮ್ಮ ಎಲ್ಲಾ ಪ್ರೀಮಿಯಂ ಸೇವೆಗಳ ಮೇಲಿನ ಪ್ರೊಸೆಸಿಂಗ್ ವೆಚ್ಚ ಕೇವಲ ರೂ. 25 ಕ್ಕೆ ಸದಾ ಸ್ಥಿರವಾಗಿರುತ್ತದೆ!",
    "⚠️ ಆದೇಶ: ಲಿಂಕ್ ಆಗದ ಪಾನ್ ಕಾರ್ಡ್‌ಗಳು ಆದಾಯ ತೆರಿಗೆ ಕಾಯ್ದೆ 139AA ಅಡಿಯಲ್ಲಿ ನಿಷ್ಕ್ರಿಯವಾಗಬಹುದು, ತಕ್ಷಣ ಲಿಂಕ್ ಹಂತ ಚೆಕ್ ಮಾಡಿ.",
    "🚀 ಅಪ್ಡೇಟ್: ಜಿಯೋ, ಏರ್‌ಟೆಲ್, ವಿ ಮತ್ತು ಬಿಎಸ್‌ಎನ್‌ಎಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಗೆ ಅತ್ಯಂತ ವೇಗವಾಗಿ ಪ್ರಿಪೇಯ್ಡ್ ರೀಚಾರ್ಜ್ ಸೇವೆ ಸಕ್ರಿಯವಾಗಿದೆ."
  ]
};
