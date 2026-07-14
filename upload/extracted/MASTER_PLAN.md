# 🏛️ AADHAAR-PAN LINK CHECK PORTAL — COMPLETE MASTER PLAN
### By Tilak Infotech | Version 1.0 | Production-Ready Blueprint

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Feature Breakdown](#4-feature-breakdown)
5. [User Flow & Journey](#5-user-flow--journey)
6. [Frontend Structure](#6-frontend-structure)
7. [Backend System (Google Sheets + AppScript)](#7-backend-system)
8. [Storage Architecture (Google Drive)](#8-storage-architecture)
9. [Notification System](#9-notification-system)
10. [Data Schema](#10-data-schema)
11. [AppScript Automations](#11-appscript-automations)
12. [Security & Privacy](#12-security--privacy)
13. [Deployment Plan](#13-deployment-plan)
14. [Testing Checklist](#14-testing-checklist)
15. [Maintenance Guide](#15-maintenance-guide)

---

## 1. PROJECT OVERVIEW

**Product Name:** Aadhaar-PAN Link Check Portal  
**Client:** Tilak Infotech  
**Contact:** +91 70196 31612 | tilakinfotech@gmail.com  
**Purpose:** Allow citizens to submit their Aadhaar & PAN card photographs for a manual link-status verification by the Tilak Infotech team, with payment gateway, status tracking, and WhatsApp/email notifications.  
**Price per Application:** ₹25/-  
**Delivery SLA:** 2 hours from payment confirmation  

### Core Objectives
- Zero-friction document submission for non-tech-savvy users
- Persistent browser-side storage to prevent data loss on navigation
- Free backend using Google Workspace (Sheets + Drive + AppScript)
- Real-time status updates reflected from the admin's Google Sheet edits
- WhatsApp + Email notifications to admin on every new submission

---

## 2. ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Single HTML Page (Vanilla JS + CSS)                    │ │
│  │  - Onboarding Screen                                    │ │
│  │  - Application Form (Multi-Step)                        │ │
│  │  - Payment Flow                                         │ │
│  │  - Status Tracker Tab                                   │ │
│  │  - localStorage persistence                             │ │
│  └────────────────────┬────────────────────────────────────┘ │
└───────────────────────┼──────────────────────────────────────┘
                        │ HTTPS (fetch/XHR)
                        ▼
┌──────────────────────────────────────────────────────────────┐
│              GOOGLE APPS SCRIPT (Web App — Free)              │
│  - doPost() → receive form submissions                        │
│  - doGet()  → serve application status by code               │
│  - Trigger: WhatsApp API call on new row                      │
│  - Trigger: Gmail send on new row                             │
│  - Drive API: save uploaded screenshots                       │
└──────┬───────────────────────────────┬────────────────────────┘
       │                               │
       ▼                               ▼
┌─────────────────┐         ┌──────────────────────┐
│  GOOGLE SHEETS  │         │     GOOGLE DRIVE      │
│  Tab 1: Apps    │         │  /TilakInfotech/      │
│  Tab 2: Status  │         │    Payments/          │
│  Tab 3: Ratings │         │    AadhaarPhotos/     │
│  Tab 4: Logs    │         │    PanPhotos/         │
└─────────────────┘         └──────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                  NOTIFICATION CHANNELS                         │
│   WhatsApp: +91 70196 31612 (via CallMeBot free API)          │
│   Email: tilakinfotech@gmail.com (via GmailApp in AppScript)  │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. TECHNOLOGY STACK

| Layer | Technology | Cost | Reason |
|-------|-----------|------|--------|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (ES6+) | Free | No build step, universal compatibility |
| Persistence | Browser localStorage + sessionStorage | Free | No server needed for state |
| Backend API | Google Apps Script (Web App) | Free | Integrates natively with Sheets & Drive |
| Database | Google Sheets | Free | Easy for non-tech admin to manage |
| File Storage | Google Drive | Free (15GB) | Linked to same Google account |
| Notifications | CallMeBot WhatsApp API + GmailApp | Free | No paid API needed |
| Hosting | GitHub Pages / Netlify / Firebase Hosting | Free | Static file, no server needed |
| Payment UX | UPI QR Code (static image, pre-set ₹25) | Free | No payment gateway integration needed |

---

## 4. FEATURE BREAKDOWN

### 4.1 Frontend Features

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| F1 | Onboarding/Explainer Screen | High | 4-step process explanation |
| F2 | Aadhaar photo upload (drag-drop / camera) | High | Device-aware input |
| F3 | PAN photo upload (drag-drop / camera) | High | Device-aware input |
| F4 | Upload instructions & validations | High | Clear visible guidelines |
| F5 | Contact number input with validation | High | +91 format, 10 digits |
| F6 | Pay Now button | High | Triggers payment flow |
| F7 | Web: UPI QR popup with 60s timer | High | Desktop detection |
| F8 | Mobile: UPI deeplink redirect | High | Mobile detection |
| F9 | Payment screenshot upload | High | After payment step |
| F10 | localStorage full-state persistence | Critical | Survives tab switches, back/forward |
| F11 | Unique 6-digit application code generation | High | Client-side, stored in localStorage |
| F12 | Success screen with 2hr SLA message | High | WhatsApp contact info |
| F13 | Status Checker Tab | High | Input code → show status |
| F14 | Progress bar for application status | High | 4-stage pipeline |
| F15 | Feedback/Rating collection | Medium | Shown only if status = Completed |
| F16 | Complaint Button | Medium | Opens WhatsApp chat |
| F17 | Responsive layout (mobile/tablet/desktop) | Critical | All breakpoints |

### 4.2 Backend Features

| # | Feature | Tool |
|---|---------|------|
| B1 | Receive new application (POST) | Apps Script doPost() |
| B2 | Store data to Google Sheets | SpreadsheetApp |
| B3 | Save uploaded files to Google Drive | DriveApp |
| B4 | WhatsApp notification to admin | CallMeBot API |
| B5 | Email notification to admin | GmailApp |
| B6 | Serve application status (GET) | doGet() |
| B7 | Auto-update status from Sheets | Sheet edit triggers |
| B8 | Rating/feedback collection | Apps Script endpoint |
| B9 | Complaint logging | Sheets tab |
| B10 | Daily digest email | Time-based trigger |

---

## 5. USER FLOW & JOURNEY

### 5.1 New Application Flow

```
START
  │
  ▼
[ONBOARDING SCREEN]
  → Step 1: What this service does
  → Step 2: Documents you need
  → Step 3: Payment info (₹25)
  → Step 4: Expected turnaround (2 hrs)
  → [Begin Application] button
  │
  ▼
[STEP 1: AADHAAR PHOTO UPLOAD]
  → Instructions shown prominently
  → Desktop: Drag & Drop zone + "Choose File" button
  → Mobile: "Take Photo" (camera) + "Choose from Gallery"
  → Preview shown after upload
  → Validation: file type (jpg/png/webp), max 5MB
  → [Next] button (disabled until valid upload)
  │
  ▼
[STEP 2: PAN CARD PHOTO UPLOAD]
  → Same UX as Aadhaar upload
  → [Next] button
  │
  ▼
[STEP 3: CONTACT NUMBER]
  → Indian phone number input (+91 auto-prefixed)
  → Instructions: "Our team will contact you on this number"
  → [Proceed to Payment] button
  │
  ▼
[STEP 4: PAYMENT]
  ┌─── Desktop ─────────────────────────────┐
  │  Popup modal with UPI QR Code           │
  │  "Scan and pay ₹25 to Tilak Infotech"   │
  │  60-second countdown timer              │
  │  "I have paid" button (after 10s)       │
  └─────────────────────────────────────────┘
  ┌─── Mobile ──────────────────────────────┐
  │  "Pay ₹25 Now" button                   │
  │  Opens UPI deeplink → payment app       │
  │  "I have paid" button after redirect    │
  └─────────────────────────────────────────┘
  │
  ▼
[STEP 5: PAYMENT SCREENSHOT UPLOAD]
  → "Upload screenshot of your payment"
  → Same upload UX as photos
  → [Submit Application] button
  │
  ▼
[STEP 6: SUBMISSION]
  → POST all data to Apps Script endpoint
  → Loading state shown
  → 6-digit unique code displayed (generated client-side)
  → SUCCESS SCREEN:
    "Your application (Code: XXXXXX) has been submitted.
     You will receive your report within 2 hours.
     If not received, contact us on WhatsApp: +91 70196 31612"
  → [Copy Code] button
  → [Check Status] button → switches to Status Tab
```

### 5.2 Status Check Flow

```
[STATUS TAB]
  → Input: 6-digit application code
  → [Check Status] button
  → GET request to Apps Script
  │
  ▼
[STATUS RESULT CARD]
  → Application details (masked Aadhaar last 4 digits, contact)
  → Progress Bar:
    ● Submitted → ● Payment Verified → ● Under Review → ● Report Sent
  → Current status highlighted
  → If COMPLETED:
    → "Rate your experience" → Star rating (1-5) + comment
    → [Submit Rating]
```

### 5.3 Admin Flow (Google Sheets)

```
Admin receives WhatsApp + Email notification
  → Opens Google Sheets
  → Reviews application row
  → Downloads Aadhaar/PAN photos from Drive link in sheet
  → Performs manual Aadhaar-PAN link check
  → Updates "Status" column in sheet
  → User's status page reflects change instantly (on next poll)
  → On "Completed": adds report notes to sheet
```

---

## 6. FRONTEND STRUCTURE

### 6.1 File Structure
```
/
├── index.html          ← Entire app (single file)
├── logo.png            ← Tilak Infotech logo
├── upi-qr.png          ← Pre-generated UPI QR for ₹25
└── favicon.ico
```

### 6.2 HTML Sections (within index.html)

```
<body>
  ├── #onboarding-screen
  │   ├── .logo
  │   ├── .process-steps (4 cards)
  │   └── #btn-begin
  │
  ├── #app-screen (hidden initially)
  │   ├── .tab-bar
  │   │   ├── [New Application] tab
  │   │   └── [Check Status] tab
  │   │
  │   ├── #tab-application
  │   │   ├── .step-indicator (1-2-3-4-5)
  │   │   ├── #step-1 (Aadhaar upload)
  │   │   ├── #step-2 (PAN upload)
  │   │   ├── #step-3 (Contact)
  │   │   ├── #step-4 (Payment)
  │   │   ├── #step-5 (Screenshot)
  │   │   └── #step-6 (Success)
  │   │
  │   └── #tab-status
  │       ├── .code-input-area
  │       └── .status-result-card
  │
  ├── #payment-modal (hidden)
  │   ├── .qr-code-image
  │   ├── .timer-display
  │   └── #btn-paid
  │
  └── .complaint-btn (fixed bottom-right)
```

### 6.3 JavaScript Modules (within <script> tag)

```javascript
// Module 1: State Management
const AppState = {
  currentStep, aadhaarPhoto, panPhoto, contactNumber,
  paymentScreenshot, appCode, isSubmitted
}
// Save on every change → localStorage.setItem('tilak_app_state', JSON.stringify(AppState))
// Load on page load → JSON.parse(localStorage.getItem('tilak_app_state'))

// Module 2: Device Detection
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)

// Module 3: Upload Handler
function handleFileUpload(inputEl, stateKey, previewEl) { ... }

// Module 4: Payment Handler
function initiatePayment() {
  if (isMobile) {
    window.location.href = `upi://pay?pa=UPI_ID&pn=TilakInfotech&am=25&cu=INR`
  } else {
    showQRModal()
  }
}

// Module 5: Code Generator
function generateAppCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Module 6: API Client
async function submitApplication(formData) { ... }
async function fetchStatus(code) { ... }

// Module 7: Persistence
function saveState() { ... }
function loadState() { ... }
function clearState() { ... }

// Module 8: Status Poller
// Poll every 30 seconds when status tab is open
setInterval(pollStatus, 30000)
```

---

## 7. BACKEND SYSTEM

### 7.1 Google Sheets Structure

**Spreadsheet Name:** `Tilak Infotech - Aadhaar PAN Portal`

**Tab 1: Applications**
| Column | Field | Notes |
|--------|-------|-------|
| A | App Code | 6-digit unique code |
| B | Submission Date | Auto timestamp |
| C | Contact Number | +91XXXXXXXXXX |
| D | Aadhaar Photo URL | Google Drive link |
| E | PAN Photo URL | Google Drive link |
| F | Payment Screenshot URL | Google Drive link |
| G | Status | Submitted / Payment Verified / Under Review / Completed / Rejected |
| H | Admin Notes | Internal notes |
| I | Report Sent At | Timestamp |
| J | Processing Agent | Who verified |

**Tab 2: Ratings**
| Column | Field |
|--------|-------|
| A | App Code |
| B | Rating (1-5) |
| C | Comment |
| D | Timestamp |

**Tab 3: Complaints**
| Column | Field |
|--------|-------|
| A | App Code (optional) |
| B | Contact Number |
| C | Complaint Text |
| D | Timestamp |
| E | Status (Open/Resolved) |

**Tab 4: Logs**
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | Event Type |
| C | App Code |
| D | Details |

### 7.2 Apps Script Endpoints

**Web App URL:** Deployed as `Execute as: Me`, `Access: Anyone`

```
POST /exec → Submit new application
GET  /exec?action=status&code=XXXXXX → Get status
GET  /exec?action=complaint → Submit complaint
POST /exec (action=rating) → Submit rating
```

---

## 8. STORAGE ARCHITECTURE

### 8.1 Google Drive Folder Structure

```
My Drive/
└── TilakInfotech-Portal/
    ├── Aadhaar-Photos/
    │   └── {AppCode}_{timestamp}.jpg
    ├── PAN-Photos/
    │   └── {AppCode}_{timestamp}.jpg
    └── Payment-Screenshots/
        └── {AppCode}_{timestamp}.jpg
```

### 8.2 File Handling

- Files uploaded by user are base64-encoded in the browser
- Sent as base64 strings in the POST body to Apps Script
- Apps Script decodes and saves via `DriveApp.createFile()`
- Returns the public share link, stored in Sheets column D/E/F
- File naming: `{AppCode}_aadhaar_{timestamp}.jpg`

---

## 9. NOTIFICATION SYSTEM

### 9.1 WhatsApp (CallMeBot — Free)

**Setup Steps:**
1. Send "I allow callmebot to send me messages" to +34 644 48 77 00 on WhatsApp from +91 70196 31612
2. Receive API key (e.g., `123456`)
3. Use in AppScript:

```javascript
function sendWhatsApp(message) {
  const phone = '917019631612' // no +
  const apiKey = 'YOUR_CALLMEBOT_KEY'
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`
  UrlFetchApp.fetch(url)
}
```

**Message Template on New Application:**
```
🔔 New Application Received!
Code: XXXXXX
Contact: +91 XXXXXXXXXX
Time: DD/MM/YYYY HH:MM
Aadhaar Photo: [Drive Link]
PAN Photo: [Drive Link]
Payment Screenshot: [Drive Link]
Action Needed: Review & update status in Sheets
```

### 9.2 Email (GmailApp — Free)

```javascript
function sendEmail(appData) {
  GmailApp.sendEmail(
    'tilakinfotech@gmail.com',
    `New Application #${appData.code}`,
    `...full details...`,
    { htmlBody: `...styled HTML email...` }
  )
}
```

---

## 10. DATA SCHEMA

### 10.1 localStorage Schema (Client-Side)

```json
{
  "tilak_portal_state": {
    "version": "1.0",
    "appCode": "847291",
    "currentStep": 3,
    "aadhaarPhotoBase64": "data:image/jpeg;base64,...",
    "aadhaarPhotoName": "aadhaar.jpg",
    "panPhotoBase64": "data:image/jpeg;base64,...",
    "panPhotoName": "pan.jpg",
    "contactNumber": "+917019631612",
    "paymentInitiated": true,
    "paymentScreenshotBase64": "data:image/jpeg;base64,...",
    "isSubmitted": false,
    "submittedAt": null,
    "lastSaved": "2024-01-01T10:00:00.000Z"
  }
}
```

### 10.2 API Payload (POST — New Application)

```json
{
  "action": "submit",
  "appCode": "847291",
  "contactNumber": "+917019631612",
  "aadhaarPhoto": "base64string...",
  "panPhoto": "base64string...",
  "paymentScreenshot": "base64string...",
  "submittedAt": "2024-01-01T10:00:00.000Z"
}
```

### 10.3 API Response (GET — Status)

```json
{
  "success": true,
  "appCode": "847291",
  "status": "Under Review",
  "statusStep": 3,
  "submittedAt": "2024-01-01T10:00:00.000Z",
  "contactNumber": "+917019XXXXXX",
  "adminNotes": "",
  "reportSentAt": null
}
```

---

## 11. APPSCRIPT AUTOMATIONS

### 11.1 Trigger: On Form Submission (HTTP POST)

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents)
  if (data.action === 'submit') return handleNewApplication(data)
  if (data.action === 'rating') return handleRating(data)
  if (data.action === 'complaint') return handleComplaint(data)
}
```

### 11.2 Trigger: On Sheet Edit (Status Change)

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet()
  if (sheet.getName() === 'Applications') {
    const col = e.range.getColumn()
    if (col === 7) { // Status column
      const appCode = sheet.getRange(e.range.getRow(), 1).getValue()
      const newStatus = e.value
      logStatusChange(appCode, newStatus)
    }
  }
}
```

### 11.3 Trigger: Daily Digest (Time-Based)

```javascript
// Runs every day at 9 AM
function dailyDigest() {
  const pending = getPendingApplications()
  GmailApp.sendEmail('tilakinfotech@gmail.com', 
    `Daily Digest: ${pending.length} pending applications`, ...)
}
```

### 11.4 Trigger: Status GET Endpoint

```javascript
function doGet(e) {
  const action = e.parameter.action
  const code = e.parameter.code
  if (action === 'status') {
    const row = findApplicationByCode(code)
    if (!row) return jsonResponse({ success: false, error: 'Not found' })
    return jsonResponse({
      success: true,
      appCode: code,
      status: row[6],
      statusStep: statusToStep(row[6]),
      submittedAt: row[1],
      contactNumber: maskPhone(row[2])
    })
  }
}
```

---

## 12. SECURITY & PRIVACY

| Concern | Mitigation |
|---------|-----------|
| Aadhaar data sensitivity | Files stored in private Google Drive, access only to Tilak Infotech Google account |
| Base64 photos in POST | HTTPS ensures transport encryption |
| Apps Script URL public | No sensitive data in GET params; POST body used for submissions |
| localStorage exposure | Only accessible to same origin; cleared on successful submission |
| Photo retention | Define internal SLA for deletion (e.g., 90 days) |
| CORS | Apps Script Web App handles CORS natively |
| Rate limiting | AppScript has built-in 6-min execution limit; add row-count check |
| Unique code collision | 6-digit → 900,000 possibilities; check collision before inserting |

**Privacy Notice:** Display a brief privacy notice before submission:
> "Your documents are stored securely and used solely for Aadhaar-PAN link verification. We do not share your information with any third party."

---

## 13. DEPLOYMENT PLAN

### Phase 1: Setup (Day 1)
- [ ] Create Google Account / use existing Tilak Infotech account
- [ ] Create Google Sheet with 4 tabs as defined in Section 7.1
- [ ] Create Google Drive folder structure as in Section 8.1
- [ ] Set up CallMeBot WhatsApp by sending setup message
- [ ] Note down CallMeBot API key

### Phase 2: Backend (Day 2)
- [ ] Open Google Sheet → Extensions → Apps Script
- [ ] Write and test all AppScript functions
- [ ] Deploy as Web App (Execute as: Me, Access: Anyone)
- [ ] Note down the Web App URL
- [ ] Test POST and GET endpoints via Postman or curl

### Phase 3: Frontend (Day 3)
- [ ] Build index.html with all sections
- [ ] Replace `APPS_SCRIPT_URL` constant with actual URL
- [ ] Replace UPI ID in deeplink with actual Tilak Infotech UPI ID
- [ ] Add actual UPI QR code image (generated from phonepe/gpay)
- [ ] Add Tilak Infotech logo.png

### Phase 4: Testing (Day 4)
- [ ] Full flow test on Chrome desktop
- [ ] Full flow test on Android Chrome
- [ ] Full flow test on iOS Safari
- [ ] Test localStorage persistence (navigate away and return)
- [ ] Test status checker with a submitted code
- [ ] Test admin Sheet edit → status update on frontend
- [ ] Test WhatsApp notification delivery
- [ ] Test email notification delivery

### Phase 5: Hosting & Go-Live (Day 5)
- [ ] Push to GitHub repository
- [ ] Enable GitHub Pages (or deploy to Netlify)
- [ ] Set custom domain if required (e.g., portal.tilakinfotech.com)
- [ ] Final QA on live URL
- [ ] Share URL with team

---

## 14. TESTING CHECKLIST

### Frontend Tests
- [ ] Onboarding screen renders correctly on mobile and desktop
- [ ] Aadhaar upload works via drag-drop (desktop)
- [ ] Aadhaar upload works via camera (mobile)
- [ ] PAN upload works via drag-drop (desktop)
- [ ] PAN upload works via camera (mobile)
- [ ] File size validation (>5MB rejected)
- [ ] File type validation (non-image rejected)
- [ ] Contact number validation (non-10-digit rejected)
- [ ] QR modal opens on desktop Pay Now
- [ ] UPI deeplink fires on mobile Pay Now
- [ ] 60-second timer counts down correctly
- [ ] "I have paid" button appears after 10 seconds
- [ ] Payment screenshot upload works
- [ ] Application submits successfully
- [ ] 6-digit code displays on success screen
- [ ] Code is saved in localStorage
- [ ] Navigating away and returning restores all entered data
- [ ] Status tab fetches correct status by code
- [ ] Progress bar shows correct stage
- [ ] Rating form appears only on Completed status
- [ ] Complaint button opens WhatsApp

### Backend Tests
- [ ] POST to Apps Script creates new row in Sheet
- [ ] Photos are saved to correct Drive folders
- [ ] WhatsApp message received on submission
- [ ] Email received on submission
- [ ] GET status returns correct data
- [ ] Editing status in Sheet reflects in API response

---

## 15. MAINTENANCE GUIDE

### Daily Tasks (Admin)
1. Open Google Sheet, check "Applications" tab
2. Download Aadhaar & PAN photos from Drive links
3. Perform manual Aadhaar-PAN link check on income tax portal
4. Update "Status" column to "Under Review" → "Completed" or "Rejected"
5. Add notes in "Admin Notes" column

### How to Change the Price
1. Update UPI QR code (generate new one at bhim.upi.org or phonepe)
2. Update the `₹25` text in index.html (search for "25")
3. Update UPI deeplink amount: `am=25` → new amount

### How to Check Complaints
1. Open "Complaints" tab in Google Sheet
2. Review open complaints
3. Mark as Resolved once handled

### How to Export Data
- File → Download → CSV for any tab
- All Drive files can be bulk downloaded from the folder

---

*Document prepared by AI based on Tilak Infotech's project requirements.*  
*Version 1.0 — Ready for implementation.*
