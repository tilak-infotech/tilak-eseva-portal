/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Moon, Sun, ArrowRight, Check, AlertTriangle, UploadCloud, 
  Copy, CheckCircle, ArrowLeft, Loader2, MessageCircle, 
  HelpCircle, Clock, Zap, Search, FileText, X, Star, CreditCard
} from 'lucide-react';
import { 
  CATEGORIES, I18N_TRANSLATIONS, FACTS_UPDATES, NEWS_TICKER_ITEMS, ServiceCategory, SubService 
} from './servicesData';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6xVszKwq7tlHZTtetvTjh1P3ri1gA1dqIXdOApsCYTkUNHqp-4aevmsPTume3F-IChA/exec'; 
const UPI_VPA = '6362818201@okbizaxis';
const STORAGE_KEY = 'tilak_seva_state_v1.3';
const PRICE = 25;

const generateCode = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export default function Home() {
  // ── CORE STATE HOLDERS ──────────────────────────────────────────────────
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return (saved === 'light') ? 'light' : 'dark';
    }
    return 'dark';
  });
  const [lang, setLang] = useState<'en' | 'kn'>('en');
  const [viewState, setViewState] = useState<'splash' | 'onboarding' | 'portal'>('splash');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Tracking & Selection Node States
  const [targetService, setTargetService] = useState<SubService | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [appCode, setAppCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const d = JSON.parse(savedData);
          if (d.appCode) return d.appCode;
        }
      } catch (e) {}
    }
    return null;
  });

  // Base64 Images Upload
  const [doc1Photo, setDoc1Photo] = useState<{ base64: string; name: string } | null>(null);
  const [doc2Photo, setDoc2Photo] = useState<{ base64: string; name: string } | null>(null);
  const [payPhoto, setPayPhoto] = useState<{ base64: string; name: string } | null>(null);
  const [contactNumber, setContactNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const d = JSON.parse(savedData);
          if (d.contactNumber) return d.contactNumber.replace('+91', '');
        }
      } catch (e) {}
    }
    return '';
  });

  // Mobile Recharge Fields
  const [rechargeMobile, setRechargeMobile] = useState<string>('');
  const [rechargeOperator, setRechargeOperator] = useState<string>('Jio');
  const [rechargePlan, setRechargePlan] = useState<string>('');

  // Form Step Validation Flags
  const [doc1Error, setDoc1Error] = useState<boolean>(false);
  const [contactError, setContactError] = useState<boolean>(false);
  const [payPhotoError, setPayPhotoError] = useState<boolean>(false);
  const [rechargeError, setRechargeError] = useState<boolean>(false);

  // QR Modal & Countdown Settings
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrTimer, setQrTimer] = useState<number>(60);
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);
  const [qrDisabled, setQrDisabled] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // Status Check Tracker Panel
  const [statusCode, setStatusCode] = useState<string>('');
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<any | null>(null);
  const [ratingLevel, setRatingLevel] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [ratingSuccess, setRatingSuccess] = useState<boolean>(false);

  // Dom refs
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRefPay = useRef<HTMLInputElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);

  // ── CORE SYNC EFFECTS ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 0);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const isFirstTime = localStorage.getItem('tilak_onboard_v1.3') !== 'done';
    const launchTimer = setTimeout(() => {
      setViewState(isFirstTime ? 'onboarding' : 'portal');
    }, 1800);
    return () => clearTimeout(launchTimer);
  }, []);

  const saveLocalState = (fields: any) => {
    if (typeof window === 'undefined') return;
    try {
      const savedData = localStorage.getItem(STORAGE_KEY) || '{}';
      const parsed = JSON.parse(savedData);
      const updated = { ...parsed, ...fields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const parseTrackingHeader = (): string => {
    if (appCode) return appCode;
    const generated = generateCode();
    setAppCode(generated);
    saveLocalState({ appCode: generated });
    return generated;
  };

  const formatLiveClock = (): string => {
    if (!currentTime) return '';
    return currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' ' + currentTime.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFilteredCategories = (): ServiceCategory[] => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CATEGORIES;
    return CATEGORIES.map(cat => {
      const matchedSubs = cat.subServices.filter(sub => 
        sub.name.toLowerCase().includes(query) ||
        sub.nameKn.includes(query) ||
        sub.shortDesc.toLowerCase().includes(query) ||
        sub.shortDescKn.includes(query)
      );
      if (matchedSubs.length > 0) {
        return { ...cat, subServices: matchedSubs };
      }
      return null;
    }).filter(cat => cat !== null) as ServiceCategory[];
  };

  const isQueryMatchingAadhaar = !searchQuery.trim() || 
    /aadhaar|pan|aadhar|link|check|verify|tax|identity/i.test(searchQuery);

  const isQueryMatchingRecharge = !searchQuery.trim() || 
    /recharge|jio|airtel|vi|bsnl|telecom|bill|data|phone|refill/i.test(searchQuery);

  const t = (key: string): string => {
    return I18N_TRANSLATIONS[lang]?.[key] || I18N_TRANSLATIONS['en']?.[key] || key;
  };

  // Convert File uploads to Base64 String
  const processImageUpload = (file: File, type: 'doc1' | 'doc2' | 'pay') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const filePayload = { base64: base64String, name: file.name };
      if (type === 'doc1') {
        setDoc1Photo(filePayload);
        setDoc1Error(false);
      } else if (type === 'doc2') {
        setDoc2Photo(filePayload);
      } else if (type === 'pay') {
        setPayPhoto(filePayload);
        setPayPhotoError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHardReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('tilak_onboard_v1.3');
      window.location.reload();
    }
  };

  const getCurrentPrice = (): number => {
    if (targetService?.id === 'mobile-recharge') {
      const numericVal = parseInt(rechargePlan.replace(/\D/g, '')) || 0;
      return numericVal + PRICE;
    }
    return PRICE;
  };

  // ── WIZARD ACTIONS AND CHANNELS ──────────────────────────────────────────
  const handleNextStep = () => {
    const isRecharge = targetService?.id === 'mobile-recharge';
    if (isRecharge) {
      if (currentStep === 1) {
        if (!/^\d{10}$/.test(rechargeMobile.trim())) {
          setRechargeError(true);
          return;
        }
        if (!/^\d{10}$/.test(contactNumber.trim())) {
          setContactError(true);
          return;
        }
        const planAmountParsed = parseInt(rechargePlan.replace(/\D/g, '')) || 0;
        if (!rechargePlan.trim() || planAmountParsed <= 0) {
          setRechargeError(true);
          return;
        }
        setRechargeError(false);
        setContactError(false);
      }
      if (currentStep === 3 && !payPhoto) {
        setPayPhotoError(true);
        return;
      }
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 300, behavior: 'instant' });
      return;
    }

    // Default 3-stage validation for Aadhaar PAN linkage status check
    if (currentStep === 1) {
      if (!doc1Photo || !doc2Photo) {
        setDoc1Error(true);
        return;
      }
      setDoc1Error(false);
      if (!/^\d{10}$/.test(contactNumber.trim())) {
        setContactError(true);
        return;
      }
      setContactError(false);
    }
    if (currentStep === 3 && !payPhoto) {
      setPayPhotoError(true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 300, behavior: 'instant' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const launchUPIPayment = () => {
    parseTrackingHeader();
    setPaymentInitiated(true);
    setShowQRModal(true);
    setQrTimer(60);
    setQrDisabled(true);

    const checkActivation = setTimeout(() => {
      setQrDisabled(false);
    }, 4000);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const closeUPIModal = () => {
    setShowQRModal(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const completePaymentGate = () => {
    closeUPIModal();
    setPaymentInitiated(true);
    setCurrentStep(3); // Receipt verification screenshot step
  };

  const triggerMobileUPILink = (appType?: 'default' | 'gpay' | 'phonepe' | 'paytm') => {
    const code = parseTrackingHeader();
    setPaymentInitiated(true);
    
    let gateway = 'upi://pay';
    if (appType === 'gpay') gateway = 'tez://upi/pay';
    else if (appType === 'phonepe') gateway = 'phonepe://pay';
    else if (appType === 'paytm') gateway = 'paytmmp://pay';

    const cleanLink = `${gateway}?pa=${encodeURIComponent(UPI_VPA)}&pn=Tilak%20Infotech&am=${getCurrentPrice()}&cu=INR&tn=Verification_${code}`;
    if (typeof window !== 'undefined') {
      window.location.assign(cleanLink);
    }
  };

  const handleAssistanceSubmit = async () => {
    if (!payPhoto) {
      setPayPhotoError(true);
      return;
    }

    const isRecharge = targetService?.id === 'mobile-recharge';
    const code = parseTrackingHeader();
    setSubmitLoading(true);

    const serviceLabelName = isRecharge 
      ? `Mobile Recharge (${rechargeOperator} | ${rechargeMobile} | Plan: ₹${rechargePlan})`
      : targetService?.name || 'Selected E-Service';

    const payload = {
      action: 'submit',
      appCode: code,
      serviceName: serviceLabelName,
      contactNumber: `+91${contactNumber}`,
      aadhaarPhoto: doc1Photo?.base64 || '',
      panPhoto: doc2Photo?.base64 || '',
      paymentScreenshot: payPhoto?.base64 || '',
      submittedAt: new Date().toISOString()
    };

    const backupLogs = {
      appCode: code,
      serviceName: serviceLabelName,
      submittedAt: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      contactNumber: `+91 ${contactNumber.slice(0, 3)}XXXXXX`,
      status: 'Submitted',
      statusStep: 1,
      adminNotes: isRecharge 
        ? `Mobile recharge order logged for ${rechargeOperator} line ${rechargeMobile}. Our team is verifying payment confirmation screenshot. Standard execution under 2 minutes.`
        : 'Your Aadhaar-PAN linkage update checker is received. Our manual queue is matching database records. Average completion under 5 minutes.'
    };

    try {
      localStorage.setItem('local_case_' + code, JSON.stringify(backupLogs));
    } catch (e) {}

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      setSubmitLoading(false);
      setCurrentStep(4);
    } catch (err) {
      console.warn("API queue logged offline in container dev sandboxes.", err);
      setSubmitLoading(false);
      setCurrentStep(4);
    }
  };

  // Status query and local state storage
  const handleCheckStatus = async () => {
    if (!/^\d{6}$/.test(statusCode.trim())) {
      setStatusError('Standard registry codes are exactly 6 numerical digits in size.');
      setStatusData(null);
      return;
    }
    
    setStatusError(null);
    setStatusLoading(true);
    setStatusData(null);

    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=track&appCode=${statusCode.trim()}`);
      const apiResult = await response.json();
      
      setStatusLoading(false);
      if (apiResult.success && apiResult.data) {
        setStatusData(apiResult.data);
      } else {
        const localData = localStorage.getItem('local_case_' + statusCode.trim());
        if (localData) {
          setStatusData(JSON.parse(localData));
        } else {
          setStatusError('Application code is not registered inside Tilak Infotech active databases.');
        }
      }
    } catch (err) {
      setStatusLoading(false);
      const localData = localStorage.getItem('local_case_' + statusCode.trim());
      if (localData) {
        setStatusData(JSON.parse(localData));
      } else {
        setStatusError('Database server offline. Preserved offline matching check on local sandboxes failed.');
      }
    }
  };

  const handleRatingReviewSubmit = () => {
    setRatingSuccess(true);
    setTimeout(() => {
      setRatingSuccess(false);
      setRatingComment('');
    }, 2800);
  };

  const copyResultTrackingCode = () => {
    if (appCode) {
      navigator.clipboard.writeText(appCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getReviewerStatusMessage = (label: string): string => {
    if (label === 'Submitted') {
      return lang === 'en' 
        ? 'Manual priority queue logged. Desk operator database matchup ongoing.' 
        : 'ದಾಖಲೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ಅಧಿಕಾರಿಗಳು ಪ್ರಕ್ರಿಯೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿದ್ದಾರೆ.';
    }
    return label;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#FFFFFF] transition-colors duration-300">
      
      {/* ── A. ANIMATED SPLASH SCREEN (Once per session loop) ── */}
      <AnimatePresence>
        {viewState === 'splash' && (
          <motion.div 
            id="splash_container"
            className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col items-center justify-center p-6 text-white"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-white text-black flex items-center justify-center rounded-2xl shadow-2xl scale-[1.05] animate-pulse">
                <Shield size={32} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-black tracking-widest uppercase mb-1">TILAK SEVA</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  Official Citizen Assisted Portals &bull; Secure Encrypted
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── B. FIRST-TIME ONBOARDING OVERLAY SLIDER ── */}
      <AnimatePresence>
        {viewState === 'onboarding' && (
          <motion.div 
            id="onboarding_layer"
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 text-white hover:no-underline"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-xl mx-auto">
                <Shield size={24} className="stroke-[2.5]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Welcome to Tilak E-Seva Portal</h2>
                <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                  Get seamless assisted filings with accurate mobile uploads. Checked and manually verified by database registrars in under 2 minutes.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-zinc-800 text-[10px] font-mono flex items-center justify-center font-bold">1</div>
                  <p className="text-[11px] text-zinc-300 font-semibold pt-0.5">Select Aadhaar linkage updates or custom Prepaid connections refills.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-zinc-800 text-[10px] font-mono flex items-center justify-center font-bold">2</div>
                  <p className="text-[11px] text-zinc-300 font-semibold pt-0.5">Perform instant secure QR code UPI validation transfers.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-zinc-800 text-[10px] font-mono flex items-center justify-center font-bold">3</div>
                  <p className="text-[11px] text-zinc-300 font-semibold pt-0.5">Confirm tracking ID code on front monitor dashboard checks.</p>
                </div>
              </div>

              <button 
                className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs select-none cursor-pointer"
                onClick={() => {
                  localStorage.setItem('tilak_onboard_v1.3', 'done');
                  setViewState('portal');
                }}
              >
                Access Portal Now &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── C. FIXED TOP NAVIGATION HEADER ── */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 text-white backdrop-blur-md border-b border-[#333333] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          <button 
            id="brand_logo_btn"
            className="flex items-center gap-3 text-left focus:outline-none hover:opacity-85 transition-opacity cursor-pointer"
            onClick={() => {
              setTargetService(null);
              setCurrentStep(1);
            }}
          >
            <div className="w-9 h-9 bg-white text-black flex items-center justify-center rounded-lg shadow-inner">
              <Shield size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase">TILAK INFOTECH</h2>
              <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wide">
                E-SEVA GATEWAY
              </div>
            </div>
          </button>

          {/* Controls menu row */}
          <div className="flex items-center gap-3">
            
            {/* Quick Track Status shortcut */}
            <button 
              id="header_track_status_btn"
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono leading-none bg-[#1A1A1A] hover:bg-[#2A2A2A] text-zinc-350 border border-zinc-900 cursor-pointer text-white font-bold uppercase transition-colors"
              onClick={() => {
                setTargetService(null);
                setTimeout(() => {
                  trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              title="Track Existing Application Code"
            >
              Track Status
            </button>

            {/* Language toggle EN | ಕ */}
            <button 
              id="language_switcher"
              className="px-2.5 py-1.5 rounded-lg text-xs leading-none bg-[#1A1A1A] border border-zinc-800 hover:border-zinc-650 cursor-pointer text-white font-bold uppercase transition-colors"
              onClick={() => setLang(l => l === 'en' ? 'kn' : 'en')}
              title="Toggle Language"
            >
              {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </button>

            {/* Monochrome theme switch */}
            <button 
              id="theme_toggler"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A1A1A] border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Restart button */}
            <button 
              id="reset_app_btn"
              className="hidden md:block text-[9px] font-bold font-mono uppercase tracking-wider px-2 py-1.5 rounded bg-zinc-950 text-neutral-4D0 border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
              onClick={handleHardReset}
            >
              Reset
            </button>
          </div>

        </div>
      </header>

      {/* ── D. THE NEWS TICKER ── */}
      <section id="ticker_section" className="bg-[#111111] dark:bg-black border-b border-[#333333] text-white/90 py-2.5 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 text-xs font-semibold">
          <span className="flex-shrink-0 bg-white text-black px-2.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
            <Clock size={11} /> {t('newsTitle')}
          </span>
          <div className="marquee-wrapper overflow-hidden relative w-full h-4">
            <div className="marquee-content flex gap-12 whitespace-nowrap text-[11px] font-mono font-medium text-[#AAAAAA]">
              {(NEWS_TICKER_ITEMS[lang] || NEWS_TICKER_ITEMS.en).map((n, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>{n}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── E. HERO BANNER AREA ── */}
      <section id="banner_section" className="relative overflow-hidden bg-[#0A0A0A] text-white py-12 md:py-16 border-b border-[#333333] grid-bg">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[11px] font-bold tracking-tight text-[#AAAAAA]">
            <Shield size={12} className="text-white" />
            <span>Official Assisted E-Services Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            {lang === 'en' ? 'Direct Assisted E-Service Platform' : 'ನೇರ ಇ-ಸೇವೆಯ ಇಂಟರ್ಫೇಸ್ ಚಾನಲ್'}<br />
            <span className="text-[#AAAAAA]">{lang === 'en' ? 'Secure Verification & Refills' : 'ಯಶಸ್ವಿ ಜೋಡಣೆ ಕೇವಲ 2 ನಿಮಿಷಗಳಲ್ಲಿ.'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#AAAAAA] max-w-xl mx-auto font-medium leading-relaxed">
            Quick mobile prepaid refills and Aadhaar-PAN statutory registry couplings. Handled and verified manually by Tilak Infotech prioritizer agents.
          </p>

          {/* SEARCH BOX FILTER */}
          <div className="max-w-xl mx-auto relative mt-6 flex items-center">
            <Search className="absolute left-4 text-zinc-500" size={16} />
            <input 
              id="global_search_input"
              type="text"
              className="w-full bg-[#111111] border border-[#333333] hover:border-zinc-750 focus:border-white focus:outline-none py-3.5 pl-12 pr-4 rounded-xl text-xs sm:text-sm font-semibold tracking-tight h-12 shadow-2xl placeholder:text-zinc-650 text-white"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTargetService(null);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#AAAAAA] font-mono mr-1">Quick Links:</span>
            {['Aadhaar', 'PAN', 'Jio', 'Airtel', 'Recharge'].map((sBtn) => (
              <button 
                key={sBtn}
                className="px-3 py-1 bg-[#111111] hover:bg-[#1A1A1A] border border-[#333333] text-[11px] rounded-lg tracking-tight transition-all text-[#AAAAAA] hover:text-white cursor-pointer font-semibold"
                onClick={() => {
                  setSearchQuery(sBtn);
                  setTargetService(null);
                }}
              >
                {sBtn}
              </button>
            ))}
          </div>

          {/* Live Clock Integration */}
          <div className="pt-2">
            <span id="live_seconds_clock" className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-[#AAAAAA] bg-zinc-900 border border-zinc-950 rounded-lg px-3.5 py-1.5 shadow-inner">
              <Clock size={13} className="text-white" /> {currentTime ? formatLiveClock() : 'Synchronizing Clock...'}
            </span>
          </div>

        </div>
      </section>

      {/* ── F. MAIN SERVICE WRAPPER (LANDING OR ACTION SERVICE PAGE) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {!targetService ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Active E-Services Selection */}
              <div className="space-y-6">
                <div className="border-b border-zinc-200 dark:border-[#333333] pb-4 flex justify-between items-center sm:flex-row flex-col gap-3 text-center sm:text-left">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {lang === 'en' ? 'Direct Assisted E-Service Channels' : 'ಸಕ್ರಿಯ ಇ-ಸೇವಾ ನಾಗರಿಕ ಕೇಂದ್ರಗಳು'}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-[#AAAAAA] mt-1">
                      {lang === 'en' ? 'Select an active official service below to start instant assisted filing.' : 'ಅತ್ಯಂತ ತ್ವರಿತ ಇ-ಸೇವೆ ಪಡೆಯಲು ಕೆಳಗಿನ ಯಾವುದೇ ಪರಿಶೀಲನಾ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#111111] text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-lg border border-zinc-800">
                    2 INDIVIDUAL ACTIVE SERVICES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-2">
                  {/* CARD 1: Aadhaar-PAN Link Linkage Checker */}
                  {isQueryMatchingAadhaar && (
                    <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#222222] rounded-3xl p-6 md:p-8 hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-black dark:text-white group-hover:scale-105 transition-transform">
                          <Shield size={22} className="stroke-[2.2]" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded font-extrabold tracking-wider animate-pulse">ACTIVE GATEWAY</span>
                            <span className="text-[10px] font-mono uppercase text-zinc-400">AADHAAR SECURE</span>
                          </div>
                          <h3 className="text-xl font-bold tracking-tight">
                            {lang === 'en' ? 'Aadhaar-PAN Link Linkage Check' : 'ಆಧಾರ್ ಮತ್ತು ಪಾನ್ ಪರಿಶೀಲನಾ ಚಾನೆಲ್'}
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-[#AAAAAA] leading-relaxed">
                            {lang === 'en' ? 'Instantly check the coupling and official connection state of your Aadhaar & PAN Card in the tax records.' : 'ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆಗೆ ಪಾನ್ ಕಾರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಜೋಡಣೆಯಾಗಿದೆಯೇ ಎಂದು ತಕ್ಷಣವೇ ಪರಿಶೀಲಿಸಿ.'}
                          </p>
                        </div>
                      </div>
                      <div className="pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-500">FEE: ₹25.00</span>
                        <button 
                          id="select_aadhar_btn"
                          className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          onClick={() => {
                            const service = CATEGORIES[0].subServices[0];
                            setTargetService(service);
                            setCurrentStep(1);
                            setDoc1Photo(null);
                            setDoc2Photo(null);
                            setPayPhoto(null);
                            setRechargeMobile('');
                            setRechargePlan('');
                          }}
                        >
                          Select Service &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CARD 2: Mobile Recharge Service */}
                  {isQueryMatchingRecharge && (
                    <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#222222] rounded-3xl p-6 md:p-8 hover:border-black dark:hover:border-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-black dark:text-white group-hover:scale-105 transition-transform">
                          <Zap size={22} className="stroke-[2.2]" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded font-extrabold tracking-wider animate-pulse">ACTIVE GATEWAY</span>
                            <span className="text-[10px] font-mono uppercase text-[#AAAAAA]">TELECOM & REFILLS</span>
                          </div>
                          <h3 className="text-xl font-bold tracking-tight">
                            {lang === 'en' ? 'Mobile Recharge & Cellular Refills' : 'ಮೊಬೈಲ್ ಪ್ರಿಪೇಯ್ಡ್ ರೀಚಾರ್ಜ್ ಸೇವೆ'}
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-[#AAAAAA] leading-relaxed">
                            {lang === 'en' ? 'Refill cellular network data talktime, or unlimited data plans for Jio, Airtel, Vi, and BSNL lines instant.' : 'ಜಿಯೋ, ಏರ್‌ಟೆಲ್, ವಿ, ಬಿಎಸ್‌ಎನ್‌ಎಲ್ ಸೇರಿದಂತೆ ಎಲ್ಲಾ ನೆಟ್‌ವರ್ಕ್ ಮೊಬೈಲ್ ಕರೆ ಮತ್ತು ಇಂಟರ್ನೆಟ್ ರೀಚಾರ್ಜ್ ಜಾರಿಗೊಳಿಸಿ.'}
                          </p>
                        </div>
                      </div>
                      <div className="pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-500 font-semibold">Pack Cost + ₹25 Fee</span>
                        <button 
                          id="select_recharge_btn"
                          className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          onClick={() => {
                            const service = CATEGORIES[1].subServices[0];
                            setTargetService(service);
                            setCurrentStep(1);
                            setDoc1Photo(null);
                            setDoc2Photo(null);
                            setPayPhoto(null);
                            setRechargeMobile('');
                            setRechargePlan('');
                          }}
                        >
                          Select Service &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isQueryMatchingAadhaar && !isQueryMatchingRecharge && (
                  <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-[#333333] rounded-2xl bg-white dark:bg-[#111111] p-6 max-w-md mx-auto">
                    <HelpCircle size={32} className="mx-auto text-zinc-400 mb-2 font-light" />
                    <h4 className="text-xs font-bold">{t('comingSoon')}</h4>
                    <p className="text-[11px] text-[#AAAAAA] mt-1">
                      Could not find any available services matching &quot;{searchQuery}&quot;. Try searching &quot;Aadhaar&quot;, &quot;PAN&quot; or &quot;Recharge&quot;.
                    </p>
                    <button 
                      className="mt-4 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-xs"
                      onClick={() => setSearchQuery('')}
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Secure Tracker Search Panel */}
              <div ref={trackerRef} className="max-w-xl mx-auto space-y-6 pt-12 border-t border-dashed border-zinc-200 dark:border-zinc-800 select-none">
                <div className="text-center md:text-left space-y-1">
                  <h3 className="text-base font-bold tracking-tight">{t('trackBoxTitle')}</h3>
                  <p className="text-xs text-zinc-500 dark:text-[#AAAAAA]">
                    {t('trackBoxDesc')}
                  </p>
                </div>

                <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow text-left">
                  <div className="flex border border-zinc-300 dark:border-zinc-800 rounded-xl overflow-hidden bg-[#F5F5F5] dark:bg-zinc-950 shadow-inner h-12">
                    <input 
                      id="status_query_input"
                      type="text"
                      className="flex-1 bg-transparent px-4 font-mono text-sm font-bold uppercase tracking-widest placeholder:font-sans focus:outline-none text-black dark:text-white"
                      placeholder={t('trackPlaceholder')}
                      maxLength={6}
                      inputMode="numeric"
                      value={statusCode}
                      onChange={(e) => setStatusCode(e.target.value.replace(/\D/g, ''))}
                    />
                    <button 
                      id="status_query_submit"
                      className="bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs uppercase px-5 hover:opacity-90 select-none cursor-pointer"
                      onClick={handleCheckStatus}
                    >
                      {t('queryCodeBtn')}
                    </button>
                  </div>

                  {statusError && (
                    <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span>{statusError}</span>
                    </div>
                  )}

                  {statusLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="text-zinc-500 animate-spin" />
                    </div>
                  )}

                  {statusData && (
                    <div className="space-y-6 pt-4 border-t border-zinc-150 dark:border-zinc-900 animate-fade-in">
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-[#F5F5F5]/30 dark:bg-zinc-950/20 text-xs text-left">
                        <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-[#AAAAAA] py-3 px-4 font-mono font-bold border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                          <span>{t('caseIdLabel')}: #{statusData.appCode}</span>
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-3 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
                            {statusData.serviceName || 'E-Seva Query'}
                          </span>
                        </div>

                        <div className="p-4 space-y-3.5">
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                            <span className="text-zinc-500">{t('registeredAt')}</span>
                            <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200">{statusData.submittedAt || 'Today'}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
                            <span className="text-zinc-500">{t('destPhone')}</span>
                            <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200">{statusData.contactNumber}</span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-zinc-500 self-center">{t('verificationPhase')}</span>
                            <span className="text-[10.5px] py-1 px-3.5 rounded bg-black dark:bg-white text-white dark:text-black font-extrabold uppercase tracking-wide">
                              {statusData.status}
                            </span>
                          </div>

                          {statusData.adminNotes && (
                            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-850 text-left space-y-1">
                              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-zinc-400 font-mono">
                                {t('remarksHeading')}
                              </span>
                              <p className="text-xs font-semibold leading-relaxed text-zinc-700 dark:text-[#AAAAAA] bg-[#F5F5F5] dark:bg-zinc-950 p-3.5 border border-zinc-200 dark:border-zinc-900 rounded-lg shadow-inner">
                                {statusData.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dynamic Monochromatic steps */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between pb-2 select-none w-full gap-0.5 overflow-visible">
                          {[1, 2, 3, 4].map((stepIdx) => {
                            const phasesMap = {
                              en: ['Logged', 'Paid verified', 'Auditing', 'Completed'],
                              kn: ['ದಾಖಲಾಗಿದೆ', 'ಪಾವತಿಯಾಗಿದೆ', 'ಪರಿಶೀಲನೆ', 'ಮುಗಿದಿದೆ']
                            };
                            const nodeLabels = phasesMap[lang] || phasesMap.en;
                            const isNodeDone = stepIdx < (statusData.statusStep || 1);
                            const isNodeActive = stepIdx === (statusData.statusStep || 1);

                            return (
                              <React.Fragment key={stepIdx}>
                                <div className="flex flex-col items-center flex-1">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[9px] border transition-all ${
                                    isNodeDone ? 'bg-zinc-800 dark:bg-white text-white dark:text-black border-transparent' :
                                    isNodeActive ? 'bg-black text-white dark:bg-zinc-950 dark:text-white border-zinc-500 dark:border-zinc-400' :
                                    'bg-zinc-100 dark:bg-zinc-950 text-zinc-400 border-zinc-200 dark:border-zinc-900'
                                  }`}>
                                    {isNodeDone ? <Check size={8} className="stroke-[3]" /> : stepIdx}
                                  </div>
                                  <span className={`text-[8px] uppercase tracking-wider mt-1.5 font-bold hidden sm:block ${
                                    isNodeActive ? 'text-black dark:text-white' : 'text-zinc-500'
                                  }`}>
                                    {nodeLabels[stepIdx - 1]}
                                  </span>
                                </div>
                                {stepIdx < 4 && (
                                  <div className={`h-[1px] flex-1 mb-3 transition-colors duration-300 self-center ${
                                    isNodeDone ? 'bg-zinc-800 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-850'
                                  }`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <p className="p-3 bg-zinc-50 dark:bg-zinc-950 text-xs text-center border border-zinc-200 dark:border-zinc-900 rounded-lg leading-relaxed shadow-inner">
                          {getReviewerStatusMessage(statusData.status)}
                        </p>
                      </div>

                      {statusData.status === 'Completed' && (
                        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-900 pt-5 mt-4 space-y-4 text-center">
                          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            {t('rateServiceTitle')}
                          </h3>
                          <p className="text-xs text-zinc-500">{t('rateServiceDesc')}</p>

                          <div className="flex gap-2.5 my-2 justify-center select-none">
                            {[1, 2, 3, 4, 5].map((stars) => (
                              <button 
                                key={stars} 
                                className={`text-3xl focus:outline-none cursor-pointer transition-transform hover:scale-110 ${
                                  stars <= ratingLevel ? 'text-black dark:text-white' : 'text-zinc-200 dark:text-zinc-800'
                                }`}
                                onClick={() => setRatingLevel(stars)}
                              >
                                ★
                              </button>
                            ))}
                          </div>

                          <textarea 
                            className="rating-textarea w-full text-xs font-mono rounded-xl p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 focus:outline-none focus:border-zinc-500 text-black dark:text-white"
                            placeholder="Review comments or turnaround feedback..."
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                          />

                          {!ratingSuccess ? (
                            <button 
                              className="w-full bg-[#111111] text-white dark:bg-white dark:text-black py-2.5 rounded-xl font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={handleRatingReviewSubmit}
                            >
                              {t('submitFeedback')}
                            </button>
                          ) : (
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 text-xs font-semibold rounded-lg text-emerald-500">
                              {t('ratingReceipt')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="service_action"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: -10 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto space-y-8 select-none text-left"
            >
              {/* Back breadcrumb navigation */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-150 dark:border-zinc-900">
                <button 
                  id="breadcrumb_back_btn"
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
                  onClick={() => {
                    setTargetService(null);
                    setCurrentStep(1);
                  }}
                >
                  &larr; Back to Services Hub
                </button>
                <span className="text-[10px] font-mono font-bold bg-[#F5F5F5] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                  REF ID: #{appCode || 'PENDING'}
                </span>
              </div>

              {/* Service header title */}
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold tracking-tight">
                  {lang === 'en' ? targetService.name : targetService.nameKn}
                </h2>
                <div className="p-3.5 bg-yellow-500/10 dark:bg-yellow-500/5 text-amber-600 dark:text-amber-500 text-[11px] leading-relaxed rounded-xl font-semibold border border-yellow-500/15 flex items-start gap-2.5">
                  <span className="text-sm">⚠️</span>
                  <span>
                    {lang === 'en' 
                      ? 'Statutory warning context: Provide original digital photograph copies or desk scanner images under the citizen identity compliance bill. Double linkage audits confirm safety.'
                      : 'ಶಾಸನಬದ್ಧ ಎಚ್ಚರಿಕೆ: ಸರಿಯಾದ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಸುಳ್ಳು ಮಾಹಿತಿ ನೀಡಿದರೆ ಕಾನೂನು ಕ್ರಮ ಜರುಗಿಸಲಾಗುವುದು.'}
                  </span>
                </div>
              </div>

              {/* STAGES MARQUEE PROGRESSION */}
              {currentStep <= 3 && (
                <div className="flex items-center justify-between pb-2 select-none w-full gap-0.5 overflow-visible">
                  {[1, 2, 3].map((stepIdx) => {
                    const stepLabels = targetService?.id === 'mobile-recharge'
                      ? [lang === 'en' ? 'Recharge Package' : 'ಮೊಬೈಲ್ ಮಾಹಿತಿ', lang === 'en' ? 'Fee Payment' : 'ಪಾವತಿ', lang === 'en' ? 'Receipt Snapshot' : 'ರಶೀದಿ ಅಪ್ಲೋಡ್']
                      : [lang === 'en' ? 'Documents Photo' : 'ದಾಖಲೆ ಚಿತ್ರ', lang === 'en' ? 'Verification Fee' : 'ಪರಿಶೀಲನಾ ಶುಲ್ಕ', lang === 'en' ? 'Submit Screenshot' : 'ರಶೀದಿ ಅಪ್ಲೋಡ್'];
                    const isActive = stepIdx === currentStep;
                    const isDone = stepIdx < currentStep;

                    return (
                      <React.Fragment key={stepIdx}>
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                            isDone ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-black' :
                            isActive ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-lg scale-105' :
                            'bg-zinc-100 border-zinc-200 dark:bg-zinc-950 dark:border-zinc-900 text-zinc-450'
                          }`}>
                            {isDone ? <Check size={12} className="stroke-[3]" /> : stepIdx}
                          </div>
                          <span className={`text-[9.5px] uppercase tracking-wider font-bold mt-2 text-center ${
                            isActive ? 'text-black dark:text-white' : 'text-zinc-500'
                          }`}>
                            {stepLabels[stepIdx - 1]}
                          </span>
                        </div>
                        {stepIdx < 3 && (
                          <div className={`h-[1px] flex-1 mb-5 transition-all duration-300 ${
                            isDone ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-850'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* EXPERIENCE MULTI GATES */}
              {targetService.id === 'aadhar-pan-link' ? (
                /* ─── AADHAAR-PAN PORTAL FLUID ACTION ─── */
                <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md animate-fade-in text-left">
                  
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono">STEP 1: IDENTITY DETAILS & IMAGES</h3>
                        <p className="text-xs text-zinc-400 mt-1">Please enter your callback tracking number and upload sharp photos of the identity records.</p>
                      </div>

                      {/* WhatsApp Delivery Input */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          {lang === 'en' ? 'Active WhatsApp Mobile Number' : 'ಸಕ್ರಿಯ ವಾಟ್ಸಾಪ್ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'}
                        </label>
                        <div className="flex rounded-xl overflow-hidden shadow-inner h-12 border border-zinc-250 dark:border-zinc-850">
                          <span className="bg-[#F5F5F5] dark:bg-zinc-950 px-4 font-mono font-bold text-zinc-500 border-r border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-xs text-center select-none">
                            +91
                          </span>
                          <input 
                            type="text" 
                            maxLength={10}
                            placeholder="Mobile line connection for confirmation"
                            className="flex-1 bg-white dark:bg-zinc-950 focus:outline-none p-3.5 text-xs font-semibold font-mono text-black dark:text-white"
                            value={contactNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setContactNumber(val);
                              saveLocalState({ contactNumber: val });
                            }}
                          />
                        </div>
                      </div>

                      {/* Aadhaar Upload zone */}
                      <div className="space-y-2.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          {lang === 'en' ? 'Aadhaar Card Front Photo' : 'ಆಧಾರ್ ಕಾರ್ಡ್ ಮುಂಭಾಗದ ফೋಟೋ'}
                        </label>
                        
                        {!doc1Photo ? (
                          <div 
                            className="border border-dashed border-zinc-350 dark:border-zinc-800 rounded-xl py-10 px-6 text-center cursor-pointer flex flex-col items-center justify-center gap-3 bg-[#F5F5F5] dark:bg-zinc-950 hover:border-black dark:hover:border-white transition-all shadow-inner"
                            onClick={() => fileInputRef1.current?.click()}
                          >
                            <UploadCloud size={28} className="text-zinc-500" />
                            <span className="text-xs text-zinc-600 dark:text-[#AAAAAA] max-w-sm font-semibold">
                              Click to select or drag & drop Aadhaar Front photo file here
                            </span>
                          </div>
                        ) : (
                          <div className="border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-xs">
                              <span className="truncate max-w-[200px] font-mono">{doc1Photo.name}</span>
                              <button className="font-extrabold text-[#991B1B] hover:underline cursor-pointer" onClick={() => setDoc1Photo(null)}>
                                {t('removeFile')}
                              </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                              <img src={doc1Photo.base64} alt="Aadhaar photo preview" className="max-h-[140px] object-contain rounded-lg shadow" />
                            </div>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef1} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => e.target.files?.[0] && processImageUpload(e.target.files[0], 'doc1')} 
                        />
                      </div>

                      {/* PAN Upload zone */}
                      <div className="space-y-2.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          {lang === 'en' ? 'PAN Card Front Photo' : 'ಪಾನ್ ಕಾರ್ಡ್ ಮುಂಭಾಗದ ಫೋಟೋ'}
                        </label>
                        
                        {!doc2Photo ? (
                          <div 
                            className="border border-dashed border-zinc-350 dark:border-zinc-800 rounded-xl py-10 px-6 text-center cursor-pointer flex flex-col items-center justify-center gap-3 bg-[#F5F5F5] dark:bg-zinc-950 hover:border-black dark:hover:border-white transition-all shadow-inner"
                            onClick={() => fileInputRef2.current?.click()}
                          >
                            <UploadCloud size={28} className="text-zinc-500" />
                            <span className="text-xs text-zinc-600 dark:text-[#AAAAAA] max-w-sm font-semibold">
                              Click to select or drag & drop PAN Card photo file here
                            </span>
                          </div>
                        ) : (
                          <div className="border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-xs">
                              <span className="truncate max-w-[200px] font-mono">{doc2Photo.name}</span>
                              <button className="font-extrabold text-[#991B1B] hover:underline cursor-pointer" onClick={() => setDoc2Photo(null)}>
                                {t('removeFile')}
                              </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                              <img src={doc2Photo.base64} alt="PAN card photo preview" className="max-h-[140px] object-contain rounded-lg shadow" />
                            </div>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef2} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => e.target.files?.[0] && processImageUpload(e.target.files[0], 'doc2')} 
                        />
                      </div>

                      {doc1Error && (
                        <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Both Aadhaar Front and PAN Card photos are mandatory items. Kindly upload both files.</span>
                        </div>
                      )}

                      {contactError && (
                        <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Please provide a valid active 10-digit smartphone WhatsApp mobile number.</span>
                        </div>
                      )}

                      <div className="pt-2">
                        <button className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-xl text-xs font-bold cursor-pointer hover:opacity-95 shadow flex items-center justify-center gap-1.5" onClick={handleNextStep}>
                          {t('proceedNext')} &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Pay Verification Fee */}
                  {currentStep === 2 && (
                    <div className="space-y-6 text-center select-none">
                      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3 text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono">STEP 2: UPI VERIFICATION FEE</h3>
                        <p className="text-xs text-zinc-400 mt-1">Manual registry queue validation fee.</p>
                      </div>

                      <div className="py-6 border border-zinc-300 dark:border-[#333333] bg-[#F5F5F5]/40 dark:bg-zinc-900 rounded-xl space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold font-mono">ASSISTANCE AGENT SERVICE CODE</span>
                        <h2 className="text-3xl font-extrabold text-[#111111] dark:text-white tracking-tight">₹{getCurrentPrice()}.00</h2>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-450 max-w-sm mx-auto pt-2">
                          Immediate registration on our database priority desk channel requires verifying and clearing processing fee.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <button 
                          id="scan_qr_button"
                          className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-xl justify-center flex items-center gap-2 font-bold cursor-pointer hover:opacity-90"
                          onClick={launchUPIPayment}
                        >
                          <UploadCloud size={14} /> Scan Unified UPI QR Code
                        </button>

                        <div className="flex items-center justify-center gap-2 px-6">
                          <span className="h-[1px] bg-zinc-200 dark:bg-zinc-850 flex-1"></span>
                          <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest font-mono">Mobile Shortcuts</span>
                          <span className="h-[1px] bg-zinc-200 dark:bg-zinc-850 flex-1"></span>
                        </div>

                        {/* Gateways grids */}
                        <div className="grid grid-cols-3 gap-2">
                          {['gpay', 'phonepe', 'paytm'].map((app) => {
                            const labels: Record<string, string> = { gpay: 'GooglePay', phonepe: 'PhonePe', paytm: 'Paytm' };
                            const icons: Record<string, string> = { gpay: '🏦', phonepe: '💜', paytm: '💙' };
                            return (
                              <button 
                                key={app}
                                id={`mobile_gate_${app}`}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-255 dark:border-zinc-850 bg-[#F5F5F5] dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-semibold font-mono text-[10px] cursor-pointer text-black dark:text-white"
                                onClick={() => triggerMobileUPILink(app as any)}
                              >
                                <span className="text-base mb-1">{icons[app]}</span>
                                <span className="text-zinc-700 dark:text-zinc-300">{labels[app]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {paymentInitiated && (
                        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-900 pt-4 space-y-3">
                          <p className="text-xs text-emerald-500 font-semibold flex items-center justify-center gap-1.5 leading-relaxed">
                            <CheckCircle size={14} className="text-emerald-500" /> UPI intent dispatched to device. Tap confirm below to update receipt screenshot file.
                          </p>
                          <button 
                            id="confirm_payment_btn"
                            className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-xl font-bold cursor-pointer shadow hover:opacity-90 transition-opacity"
                            onClick={() => setCurrentStep(3)}
                          >
                            Confirm Paid &rarr; Next Step
                          </button>
                        </div>
                      )}

                      <div className="pt-4 flex gap-3">
                        <button className="flex-1 border border-zinc-350 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 py-3 rounded-xl text-xs cursor-pointer" onClick={handlePrevStep}>
                          {t('goBack')}
                        </button>
                        <button className="flex-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 py-3 rounded-xl text-xs font-bold cursor-pointer text-black dark:text-white" onClick={() => setCurrentStep(3)}>
                          Next step (Screenshot upload) &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Screenshot upload check */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono">STEP 3: UPLOAD TRANSACTION RECEIPT</h3>
                        <p className="text-xs text-zinc-400 mt-1">Please upload transaction verification bill image showing clear reference ID to lock priority queue.</p>
                      </div>

                      <div className="space-y-2">
                        {!payPhoto ? (
                          <div 
                            className="border border-dashed border-zinc-350 dark:border-zinc-850 rounded-xl py-12 px-6 text-center cursor-pointer flex flex-col items-center justify-center gap-3 bg-[#F5F5F5] dark:bg-zinc-950 hover:border-black dark:hover:border-white transition-all shadow-inner"
                            onClick={() => fileInputRefPay.current?.click()}
                          >
                            <UploadCloud size={32} className="text-zinc-500" />
                            <span className="text-xs text-[#666666] dark:text-[#AAAAAA] max-w-sm font-semibold">
                              Click here to upload transaction screenshot snapshot photo
                            </span>
                          </div>
                        ) : (
                          <div className="border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-xs">
                              <span className="truncate max-w-[200px] font-mono">{payPhoto.name}</span>
                              <button className="font-extrabold text-[#991B1B] hover:underline cursor-pointer" onClick={() => setPayPhoto(null)}>
                                {t('removeFile')}
                              </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                              <img src={payPhoto.base64} alt="pay proof preview" className="max-h-[160px] object-contain rounded shadow" />
                            </div>
                          </div>
                        )}

                        <input 
                          type="file" 
                          ref={fileInputRefPay} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => e.target.files?.[0] && processImageUpload(e.target.files[0], 'pay')} 
                        />
                      </div>

                      {payPhotoError && (
                        <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Transaction paid image photo screenshot is mandatory checklist item. Please add receipt file.</span>
                        </div>
                      )}

                      {!submitLoading ? (
                        <div className="pt-2 flex gap-3">
                          <button className="flex-1 border border-zinc-350 dark:border-zinc-800 py-3 rounded-xl text-xs cursor-pointer" onClick={handlePrevStep}>
                            {t('goBack')}
                          </button>
                          <button className="flex-1 bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-bold text-xs cursor-pointer shadow hover:opacity-90" onClick={handleAssistanceSubmit}>
                            {t('submitForm')}
                          </button>
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center justify-center gap-2 text-center">
                          <Loader2 size={24} className="text-zinc-500 animate-spin" />
                          <span className="text-[10px] font-mono tracking-widest text-[#AAAAAA] animate-pulse uppercase">
                            Transmitting secure identity packets logs...
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                /* ─── MOBILE RECHARGE PORTAL ACTION ─── */
                <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md animate-fade-in text-left">
                  
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono">STEP 1: MOBILE INFORMATION PACKS</h3>
                        <p className="text-xs text-zinc-400 mt-1">Please select the service provider operator line and pick an active recharge plan.</p>
                      </div>

                      {/* Subscriber connection field */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          {lang === 'en' ? 'Target Subscriber Number' : 'ರೀಚಾರ್ಜ್ ಮಾಡಬೇಕಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'}
                        </label>
                        <div className="flex border border-zinc-255 dark:border-zinc-850 rounded-xl overflow-hidden shadow-inner h-12">
                          <span className="bg-[#F5F5F5] dark:bg-zinc-950 px-4 font-mono font-bold text-zinc-500 border-r border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-xs select-none">
                            +91
                          </span>
                          <input 
                            type="text" 
                            maxLength={10}
                            placeholder="Enter 10-digit prepaid mobile number to recharge"
                            className="flex-1 bg-white dark:bg-zinc-950 focus:outline-none p-3.5 text-xs font-semibold font-mono text-black dark:text-white"
                            value={rechargeMobile}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setRechargeMobile(val);
                            }}
                          />
                        </div>
                      </div>

                      {/* Operator selection dropup */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          {lang === 'en' ? 'Select Carrier Network Provider' : 'ಮೊಬೈಲ್ ಸೇವೆ ಒದಗಿಸುವ ಆಪರೇಟರ್ ಪತ್ತೆ'}
                        </label>
                        <select 
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 focus:outline-none p-3.5 rounded-xl text-xs font-semibold font-mono text-black dark:text-white"
                          value={rechargeOperator}
                          onChange={(e) => setRechargeOperator(e.target.value)}
                        >
                          <option value="Jio">Jio (Reliance Jio India Infocomm)</option>
                          <option value="Airtel">Airtel (Bharti Airtel Mobile)</option>
                          <option value="Vi">Vi (Vodafone Idea Cellular)</option>
                          <option value="BSNL">BSNL (Bharat Sanchar Nigam Mobile)</option>
                        </select>
                      </div>

                      {/* Interactive Popular Plans Selection */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          Select Recharge Plan Pack
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                          {[
                            { value: '₹299 Pack', rate: '₹299', desc: '1.5GB/day Unlimited calls, Truly Free SMS validity (28 Days)' },
                            { value: '₹349 Pack', rate: '₹349', desc: '2.0GB/day + Unlimited True 5G cellular speed data (28 Days)' },
                            { value: '₹719 Pack', rate: '₹719', desc: '1.5GB/day Unlimited calls, Truly Free SMS validity (84 Days)' },
                            { value: '₹859 Pack', rate: '₹859', desc: '2.0GB/day + Unlimited True 5G cellular speed data (84 Days)' },
                            { value: '₹1799 Pack', rate: '₹1799', desc: '24GB Total bundle storage high validity (365 Days)' },
                            { value: '₹3599 Pack', rate: '₹3599', desc: '2.5GB/day + Unlimited 5G annual power pack (365 Days)' }
                          ].map((plan) => (
                            <button
                              key={plan.value}
                              className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-1 cursor-pointer select-none ${
                                rechargePlan === plan.value 
                                  ? 'border-black bg-zinc-50 dark:border-white dark:bg-zinc-950 shadow-md scale-[1.01]' 
                                  : 'border-zinc-200 dark:border-zinc-905 bg-white dark:bg-black/20 hover:border-zinc-400'
                              }`}
                              onClick={() => setRechargePlan(plan.value)}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-mono text-xs font-bold text-black dark:text-white bg-zinc-150 dark:bg-zinc-850 px-2 py-0.5 rounded">
                                  {plan.rate}
                                </span>
                                {plan.desc.includes('5G') && (
                                  <span className="text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded tracking-widest uppercase animate-pulse">
                                    5G SPEED
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold mt-1">
                                {plan.desc}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* WhatsApp Connection confirmation number */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                          {lang === 'en' ? 'Active WhatsApp Confirmation Number' : 'ದೃಢೀಕರಣಕ್ಕಾಗಿ ವಾಟ್ಸಾಪ್ ಫೋನ್ ಸಂಖ್ಯೆ'}
                        </label>
                        <div className="flex border border-zinc-250 dark:border-zinc-850 rounded-xl overflow-hidden shadow-inner h-12">
                          <span className="bg-[#F5F5F5] dark:bg-zinc-950 px-4 font-mono font-bold text-zinc-500 border-r border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-xs select-none">
                            +91
                          </span>
                          <input 
                            type="text" 
                            maxLength={10}
                            placeholder="Active smartphone WhatsApp line"
                            className="flex-1 bg-white dark:bg-zinc-950 focus:outline-none p-3.5 text-xs font-semibold font-mono text-black dark:text-white"
                            value={contactNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setContactNumber(val);
                            }}
                          />
                        </div>
                      </div>

                      {rechargeError && (
                        <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Subscriber number is 10-digits and active recharge plan package is mandatory item.</span>
                        </div>
                      )}

                      {contactError && (
                        <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Please provide a valid active 10-digit smartphone WhatsApp mobile number.</span>
                        </div>
                      )}

                      <div className="pt-2">
                        <button className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-xl font-bold cursor-pointer hover:scale-[1.01] transition-all text-xs" onClick={handleNextStep}>
                          Next Step: Pay & Open WhatsApp &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment checkout and instant WhatsApp text trigger */}
                  {currentStep === 2 && (
                    <div className="space-y-6 text-center select-none animate-fade-in">
                      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3 text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono">STEP 2: CHECKOUT & REDIRECT TO WHATSAPP</h3>
                        <p className="text-xs text-zinc-400 mt-1">Please check total billing due and launch the preloaded WhatsApp text.</p>
                      </div>

                      <div className="py-6 border border-emerald-500/25 bg-emerald-500/[0.02] dark:bg-zinc-950 rounded-2xl p-5 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-extrabold font-mono">RECHARGE DUE LOG SUMMARY</span>
                        <div className="text-3xl font-extrabold tracking-tight pt-2">₹{getCurrentPrice()}.00</div>
                        <p className="text-[10px] text-zinc-550 dark:text-zinc-500 max-w-sm mx-auto pt-2.5">
                          Calculated as recharge plan price + ₹25 secure agent convenience fee. Verify and proceed below.
                        </p>
                      </div>

                      {/* Direct WhatsApp Redirection Action */}
                      <div className="space-y-4">
                        <a 
                          id="recharge_wa_action_btn"
                          href={`https://wa.me/917019631612?text=${encodeURIComponent(
                            `Hello Tilak E-Seva! I'm requesting an instant mobile recharge refill.\n\n📱 Subscriber Number: +91 ${rechargeMobile}\n🌐 Carrier operator: ${rechargeOperator}\n📦 Plan Selected: ${rechargePlan}\n\n💳 Combined Total (Plan + ₹25 convenience fee): ₹${getCurrentPrice()}.00\n\nI have completed deposit. Please verify and run immediately!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#22C55E] hover:bg-emerald-600 active:scale-[0.99] text-white rounded-xl py-4 text-xs font-extrabold leading-none flex items-center justify-center gap-2 border border-transparent shadow hover:scale-[1.01] transform transition-all cursor-pointer pulse"
                          onClick={() => setPaymentInitiated(true)}
                        >
                          <MessageCircle size={16} /> Open & Dispatch Order to WhatsApp
                        </a>

                        <p className="text-[11.5px] text-zinc-500 text-center max-w-sm mx-auto italic">
                          Click the Green button to preload inputs on our customer chat. Then scan the UPI code below to transfer!
                        </p>
                      </div>

                      {/* QR code scanning block */}
                      <div className="pt-4 space-y-4 border-t border-dashed border-zinc-200 dark:border-zinc-850">
                        <div className="flex items-center justify-center gap-2 px-6">
                          <span className="h-[1px] bg-zinc-200 dark:bg-zinc-850 flex-1"></span>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Scan QR to pay ₹{getCurrentPrice()}</span>
                          <span className="h-[1px] bg-zinc-200 dark:bg-zinc-850 flex-1"></span>
                        </div>

                        <button 
                          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl justify-center flex items-center gap-2 text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={launchUPIPayment}
                        >
                          🏦 Scan Unified UPI QR Code
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          {['gpay', 'phonepe', 'paytm'].map((app) => {
                            const labels: Record<string, string> = { gpay: 'GooglePay', phonepe: 'PhonePe', paytm: 'Paytm' };
                            const icons: Record<string, string> = { gpay: '🏦', phonepe: '💜', paytm: '💙' };
                            return (
                              <button 
                                key={app}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F5F5F5] dark:bg-zinc-950/40 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-semibold font-mono text-[10px] cursor-pointer text-black dark:text-white"
                                onClick={() => triggerMobileUPILink(app as any)}
                              >
                                <span className="text-base mb-1">{icons[app]}</span>
                                <span className="text-zinc-700 dark:text-zinc-300">{labels[app]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {paymentInitiated && (
                        <div className="p-3 bg-emerald-500/10 dark:bg-zinc-950/45 text-emerald-500 text-xs border border-emerald-500/20 rounded-xl leading-relaxed text-center font-semibold">
                          ✅ Payment intent initialized. Send your paid screenshot on WhatsApp or upload below.
                        </div>
                      )}

                      <div className="pt-4 flex gap-3 pb-2">
                        <button className="flex-1 border border-zinc-350 dark:border-zinc-850 py-3 rounded-xl text-xs cursor-pointer text-zinc-650 dark:text-zinc-300" onClick={handlePrevStep}>
                          {t('goBack')}
                        </button>
                        <button className="flex-1 bg-zinc-100 dark:bg-zinc-900 py-3 rounded-xl text-xs font-bold cursor-pointer text-black dark:text-white" onClick={() => setCurrentStep(3)}>
                          Next: Submit Paid Screenshot &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Screenshot upload bill confirmation */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono">STEP 3: REGISTER RECHARGE PAYMENT</h3>
                        <p className="text-xs text-zinc-400 mt-1">Please upload screenshot of paid transaction of ₹{getCurrentPrice()} to record on our priority dispatch queue logs.</p>
                      </div>

                      <div className="space-y-2">
                        {!payPhoto ? (
                          <div 
                            className="border border-dashed border-zinc-350 dark:border-zinc-800 rounded-xl py-12 px-6 text-center cursor-pointer flex flex-col items-center justify-center gap-3 bg-[#F5F5F5] dark:bg-zinc-950 hover:border-black dark:hover:border-white transition-all shadow-inner"
                            onClick={() => fileInputRefPay.current?.click()}
                          >
                            <UploadCloud size={32} className="text-zinc-500" />
                            <span className="text-xs text-[#666666] dark:text-[#AAAAAA] max-w-sm font-semibold">
                              Click here to upload paid snapshot proof image copy
                            </span>
                          </div>
                        ) : (
                          <div className="border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                            <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-xs">
                              <span className="truncate max-w-[200px] font-mono">{payPhoto.name}</span>
                              <button className="font-extrabold text-[#991B1B] hover:underline cursor-pointer" onClick={() => setPayPhoto(null)}>
                                {t('removeFile')}
                              </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                              <img src={payPhoto.base64} alt="pay proof preview" className="max-h-[160px] object-contain rounded shadow" />
                            </div>
                          </div>
                        )}

                        <input 
                          type="file" 
                          ref={fileInputRefPay} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => e.target.files?.[0] && processImageUpload(e.target.files[0], 'pay')} 
                        />
                      </div>

                      {payPhotoError && (
                        <div className="text-xs text-red-500 bg-red-400/5 dark:bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Paid screenshot receipt is dynamic verification safety trigger. Kindly upload scan.</span>
                        </div>
                      )}

                      {!submitLoading ? (
                        <div className="pt-2 flex gap-3">
                          <button className="flex-1 border border-zinc-350 dark:border-zinc-800 py-3 rounded-xl text-xs cursor-pointer text-zinc-600 dark:text-zinc-300" onClick={handlePrevStep}>
                            {t('goBack')}
                          </button>
                          <button className="flex-1 bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-bold cursor-pointer text-xs hover:opacity-90 transition-opacity" onClick={handleAssistanceSubmit}>
                            Confirm & Log Order Completed
                          </button>
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center justify-center gap-2 text-center">
                          <Loader2 size={24} className="text-zinc-500 animate-spin" />
                          <span className="text-[10px] font-mono tracking-widest text-[#AAAAAA] animate-pulse uppercase">
                            Locking cellular recharge queue records...
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Step 4: Completed success response screen representation */}
              {currentStep === 4 && (
                <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 text-center select-none shadow-md animate-fade-in text-left">
                  <div className="w-14 h-14 bg-emerald-550/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto rounded-2xl shadow">
                    <Check size={28} className="stroke-[3]" />
                  </div>

                  <div className="space-y-1.5 text-center">
                    <h2 className="text-xl font-extrabold tracking-tight">{t('successTitle')}</h2>
                    <p className="text-xs text-zinc-500 dark:text-[#AAAAAA] max-w-sm mx-auto leading-relaxed">
                      {t('successDesc')}
                    </p>
                  </div>

                  <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-[#F5F5F5] dark:bg-zinc-950 max-w-sm mx-auto space-y-2 rounded-2xl relative text-center">
                    <span className="block text-[8px] tracking-widest uppercase text-zinc-400 font-mono font-bold">
                      {t('queryCodeLabel')}
                    </span>
                    <h1 className="text-3xl font-mono tracking-widest font-extrabold text-black dark:text-white select-all">
                      {appCode || '------'}
                    </h1>
                    
                    <button 
                      id="success_cpy_btn"
                      className="border border-zinc-350 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1 px-3 text-[10px] mx-auto flex items-center gap-1.5 rounded-lg min-w-[102px] justify-center h-8 cursor-pointer" 
                      onClick={copyResultTrackingCode}
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={11} className="text-[#22C55E]" />
                          <span className="text-emerald-600 font-bold">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>{t('copyCode')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500 text-center max-w-sm mx-auto leading-relaxed">
                    {t('turnaroundNotice')} Standard turnaround checks are executed in under 2 minutes. Feel free to copy the ID above and track below, or query live on the front page.
                  </p>

                  <div className="pt-4 space-y-3 max-w-[280px] mx-auto">
                    <button 
                      id="success_track_redir"
                      className="w-full bg-black text-white dark:bg-white dark:text-black py-2.5 rounded-xl font-bold cursor-pointer text-xs hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setStatusCode(appCode || '');
                        setTargetService(null);
                        setTimeout(() => {
                          handleCheckStatus();
                          trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }}
                    >
                      Track Registry Check Live
                    </button>
                    
                    <a 
                      href="https://wa.me/917019631612"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#22C55E] text-white rounded-xl py-2.5 text-xs font-bold leading-none flex items-center justify-center gap-1.5 border border-transparent shadow hover:bg-emerald-600 cursor-pointer"
                    >
                      <MessageCircle size={14} /> Open Customer Desk
                    </a>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── H. SECURE SCAN DRAWER MODAL OVERLAY (UPI qr countdown) ── */}
      {showQRModal && (
        <div className="modal-overlay show" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && closeUPIModal()}>
          <div className="modal-box p-6 w-full max-w-[340px] relative text-center select-none shadow-2xl">
            
            <button className="modal-close" onClick={closeUPIModal}>✕</button>
            
            <div className="space-y-0.5 mb-4">
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono font-bold">QR COUPLING DEPOSIT ROUTE</span>
              <h3 className="text-sm font-bold">Scan to verify payment</h3>
            </div>

            <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-inner flex items-center justify-center mx-auto mb-4 w-48 h-48 select-none">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `upi://pay?pa=${UPI_VPA}&pn=Tilak%20Infotech&am=${getCurrentPrice()}&cu=INR&tn=Verification_${appCode || '999999'}`
                )}`} 
                alt="Payment QR Code Link" 
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900 text-xs font-semibold leading-relaxed mb-4 text-[#111111] dark:text-white">
              Transfer exactly: <strong className="text-sm">₹{getCurrentPrice()}.00</strong>
              <div className="text-[10px] text-zinc-450 mt-1 uppercase font-mono font-bold">VPA: {UPI_VPA}</div>
            </div>

            <div className="space-y-3">
              <button 
                id="modal_payment_verified_btn"
                className="w-full bg-[#111111] leading-none text-white dark:bg-white dark:text-black py-3 rounded-xl font-bold cursor-pointer text-xs"
                onClick={completePaymentGate}
              >
                Done! Upload screenshot screenshot &rarr;
              </button>

              <div className="text-[10px] text-zinc-400 font-mono uppercase font-bold">
                UPI intent session expires in {qrTimer}s
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── I. FLOATING STICKY WHATSAPP COMPONENT ── */}
      <a 
        id="whatsapp_float_assist"
        href="https://wa.me/917019631612" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-[#22C55E] hover:bg-emerald-600 shadow-2xl rounded-full flex items-center justify-center text-white cursor-pointer transition-all hover:scale-105 active:scale-95 pulse"
        title="Connect directly with Tilak Desk Assistance via WhatsApp"
      >
        <MessageCircle size={24} className="fill-current" />
      </a>

      {/* ── J. BRAND GENERAL FOOTER ── */}
      <footer className="mt-12 py-12 bg-[#0A0A0A] border-t border-[#333333] text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs select-none text-left">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg shadow-inner">
                <Shield size={16} className="stroke-[2.5]" />
              </div>
              <h4 className="font-bold tracking-widest text-[#AAAAAA] uppercase">TILAK SECURE</h4>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed">
              Assisted digital registration networks under the Tilak Infotech database system. Certified secure.
            </p>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-zinc-500 font-mono mb-4">RESOURCES</h5>
            <ul className="space-y-2 font-semibold">
              <li><button onClick={() => { setTargetService(null); setSearchQuery('Aadhaar'); }} className="text-zinc-400 hover:text-white cursor-pointer">Aadhaar Verification</button></li>
              <li><button onClick={() => { setTargetService(null); setSearchQuery('PAN'); }} className="text-zinc-400 hover:text-white cursor-pointer">PAN Coupling Status</button></li>
              <li><button onClick={() => { setTargetService(null); setSearchQuery('Recharge'); }} className="text-zinc-400 hover:text-white cursor-pointer">BSNL & Jio Refills</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-zinc-500 font-mono mb-4">PRIVACY & TRUST</h5>
            <p className="text-zinc-400 leading-relaxed">
              All transfers are encrypted using official UPI VPAs. Uploaded document files are processed temporarily on single worker execution thread queues and deleted after 2 hours.
            </p>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-zinc-500 font-mono mb-4">SUPPORT DESK</h5>
            <p className="text-zinc-400 leading-relaxed mb-3">
              Need instant queue logs or manual matching help? Connect directly with our dispatch supervisors.
            </p>
            <a 
              href="https://wa.me/917019631612"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-555/10 bg-[#22C55E]/10 select-none hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 font-bold rounded-lg transition-colors cursor-pointer"
            >
              <MessageCircle size={12} /> Live WhatsApp Desk
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#AAAAAA] font-mono">
          <p>© {new Date().getFullYear()} Tilak Infotech Citizen Services Registry. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline">Secure Socket Layer v3</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
