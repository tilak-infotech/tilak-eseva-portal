# ⚙️ SETUP GUIDE — AADHAAR-PAN LINK CHECK PORTAL
### Tilak Infotech | Step-by-Step Deployment Manual

---

## BEFORE YOU BEGIN — CHECKLIST

You will need:
- [ ] A Google Account (Tilak Infotech's — `tilakinfotech@gmail.com`)
- [ ] A GitHub account (free) OR a Netlify account (free)
- [ ] Your UPI ID (the one you want to receive ₹25 payments on)
- [ ] A UPI QR Code image for ₹25 (instructions below)
- [ ] Tilak Infotech logo image file (`logo.png`)
- [ ] A WhatsApp number (+91 70196 31612) to receive notifications

**Estimated Total Setup Time: 2–3 hours (first time)**

---

## PHASE 1 — GOOGLE SHEETS SETUP

### Step 1.1 — Create the Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank spreadsheet**
3. Name it: `Tilak Infotech - Aadhaar PAN Portal`
4. **Copy the Spreadsheet ID** from the URL bar:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SPREADSHEET_ID]/edit
   ```
   Save it somewhere — you'll need it in the AppScript.

### Step 1.2 — Create the 4 Tabs

Rename "Sheet1" and add 3 more tabs:

| Tab Name | Purpose |
|----------|---------|
| `Applications` | All submitted applications |
| `Ratings` | User feedback/ratings |
| `Complaints` | Filed complaints |
| `Logs` | System event log |

To add a tab: click the **+** at the bottom left of Sheets.

### Step 1.3 — Add Headers to Each Tab

**Applications tab — Row 1:**
```
App Code | Submission Date | Contact Number | Aadhaar Photo URL | PAN Photo URL | Payment Screenshot URL | Status | Admin Notes | Report Sent At | Processing Agent
```

**Ratings tab — Row 1:**
```
App Code | Rating (1-5) | Comment | Timestamp
```

**Complaints tab — Row 1:**
```
App Code | Contact Number | Complaint | Timestamp | Status
```

**Logs tab — Row 1:**
```
Timestamp | Event Type | App Code | Details
```

### Step 1.4 — Set Status Dropdown (Applications Tab, Column G)

1. Select the entire column G (Status) in Applications tab
2. Go to **Data → Data Validation**
3. Criteria: **List of items**
4. Enter: `Submitted,Payment Verified,Under Review,Completed,Rejected`
5. Click **Save**

This makes it easy for you to update status by clicking a dropdown.

### Step 1.5 — Format the Sheet

1. Select Row 1 of each tab
2. Bold: **Ctrl + B**
3. Background: Black (`#000000`), Text: White (`#FFFFFF`)
4. Freeze Row 1: **View → Freeze → 1 row**

---

## PHASE 2 — GOOGLE DRIVE SETUP

### Step 2.1 — Create the Main Folder

1. Go to [drive.google.com](https://drive.google.com)
2. Click **+ New → Folder**
3. Name it: `TilakInfotech-Portal`
4. Open the folder, **copy the Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/[THIS_IS_YOUR_FOLDER_ID]
   ```

### Step 2.2 — Create Subfolders

Inside `TilakInfotech-Portal`, create 3 folders:
- `Aadhaar-Photos`
- `PAN-Photos`
- `Payment-Screenshots`

The AppScript will auto-create these if they don't exist, but creating manually first is safer.

---

## PHASE 3 — CALLMEBOT WHATSAPP SETUP (FREE)

### Step 3.1 — Activate CallMeBot

From WhatsApp on the phone with number **+91 70196 31612**:

1. Add this contact to your phone: **+34 644 48 77 00** (CallMeBot)
2. Send this exact message to that contact on WhatsApp:
   ```
   I allow callmebot to send me messages
   ```
3. You will receive a reply with your **API Key** (e.g., `1234567`)
4. Save that API key — you'll use it in the AppScript config.

> ⚠️ If you don't receive a reply in 2 minutes, send the message again. Sometimes it takes 1–2 attempts.

---

## PHASE 4 — GOOGLE APPS SCRIPT SETUP

### Step 4.1 — Open Apps Script

1. Open your Google Sheet (`Tilak Infotech - Aadhaar PAN Portal`)
2. Click **Extensions → Apps Script**
3. This opens the Apps Script editor in a new tab

### Step 4.2 — Paste the Backend Code

1. Delete everything in the editor (Ctrl+A, Delete)
2. Open the file `Code.gs` from the delivered files
3. Paste the entire contents into the Apps Script editor

### Step 4.3 — Fill in Your Configuration

Find the `CONFIG` object at the top and replace:

```javascript
const CONFIG = {
  SPREADSHEET_ID: 'PASTE_YOUR_SPREADSHEET_ID_HERE',
  DRIVE_FOLDER_ID: 'PASTE_YOUR_DRIVE_FOLDER_ID_HERE',
  ADMIN_EMAIL: 'tilakinfotech@gmail.com',
  ADMIN_WHATSAPP: '917019631612',
  CALLMEBOT_API_KEY: 'PASTE_YOUR_CALLMEBOT_KEY_HERE',
  PORTAL_URL: 'PASTE_YOUR_PORTAL_URL_HERE_AFTER_HOSTING',
  ...
}
```

### Step 4.4 — Run the Setup Function (One Time)

1. In the function dropdown (top of editor), select `setupSpreadsheet`
2. Click **▶ Run**
3. It will ask for permissions — click **Review permissions → Allow**
4. This sets up all the sheet headers and formatting automatically

### Step 4.5 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙ next to "Type" and select **Web app**
3. Fill in:
   - **Description:** `Tilak Infotech Portal API v1`
   - **Execute as:** `Me (tilakinfotech@gmail.com)`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. Click **Authorize access** → Allow
6. **COPY THE WEB APP URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
7. Save this URL — you'll paste it in `index.html`

> ⚠️ Every time you change the AppScript code, you must create a **New Deployment** (not just save). The URL stays the same for new versions if you select "Manage deployments → Deploy as new version."

### Step 4.6 — Set Up Triggers

**Trigger 1: Sheet Edit → Status change detection**
1. In Apps Script editor, click the clock icon (⏰) on the left sidebar → **Triggers**
2. Click **+ Add Trigger** (bottom right)
3. Settings:
   - Function: `onSheetEdit`
   - Event source: `From spreadsheet`
   - Event type: `On edit`
4. Click **Save**

**Trigger 2: Daily Digest (9 AM)**
1. Click **+ Add Trigger again**
2. Settings:
   - Function: `dailyDigest`
   - Event source: `Time-driven`
   - Type: `Day timer`
   - Time: `9am to 10am`
3. Click **Save**

### Step 4.7 — Test the Backend

Open a browser and visit (replace with your URL):
```
https://script.google.com/macros/s/YOUR_ID/exec?action=status&code=999999
```

You should see:
```json
{"success": false, "error": "Application not found"}
```

That means it's working correctly.

---

## PHASE 5 — GENERATE UPI QR CODE

### Step 5.1 — Generate Your QR Code

1. Go to [upiqr.in](https://upiqr.in) or use PhonePe/GPay's QR generator
2. Enter:
   - **UPI ID:** Your actual UPI ID (e.g., `tilakinfotech@ybl`)
   - **Name:** Tilak Infotech
   - **Amount:** 25
   - **Currency:** INR
   - **Note:** Aadhaar PAN Verification
3. Download the QR code as a PNG image
4. Save it as `upi-qr.png` in the same folder as `index.html`

### Step 5.2 — Get Your UPI Deeplink

Your UPI deeplink for mobile will be:
```
upi://pay?pa=YOUR_UPI_ID&pn=TilakInfotech&am=25&cu=INR&tn=AadhaarPANVerification
```

Replace `YOUR_UPI_ID` with your actual UPI ID.

---

## PHASE 6 — FRONTEND CONFIGURATION

### Step 6.1 — Update index.html

Open `index.html` in a text editor (Notepad, VS Code, etc.)

Find and replace these values:

**1. Apps Script URL:**
```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```
Replace with your actual Web App URL.

**2. UPI VPA:**
```javascript
const UPI_VPA = '6362818201@okbizaxis';
```
Replace with your actual UPI ID.

**3. UPI Deeplink (in the mobile pay button):**
```html
href="upi://pay?pa=6362818201@okbizaxis&pn=TilakInfotech&am=25&cu=INR..."
```
Replace `tilakinfotech@upi` with your actual UPI ID.

**4. Modal UPI ID display:**
```html
UPI ID: <strong>tilakinfotech@upi</strong>
```

### Step 6.2 — Add Your Logo

Replace the text logo placeholder in `index.html`:

Find:
```html
<span style="font-size:22px; font-weight:800; letter-spacing:0.04em;">TILAK INFOTECH</span>
```

Replace with your logo image (both occurrences — onboarding and header):
```html
<img src="logo.png" alt="Tilak Infotech" style="height:40px; width:auto;" />
```

Make sure `logo.png` is in the same folder as `index.html`.

### Step 6.3 — Your Files Should Now Look Like:

```
your-folder/
├── index.html    ← Updated with real URLs & UPI ID
├── upi-qr.png   ← Your actual UPI QR for ₹25
├── logo.png     ← Tilak Infotech logo
└── favicon.ico  ← Optional
```

---

## PHASE 7 — HOSTING (FREE)

### Option A: GitHub Pages (Recommended — Free, Permanent)

**Step 7.1 — Create GitHub Account**
1. Go to [github.com](https://github.com) → Sign Up (free)

**Step 7.2 — Create Repository**
1. Click **+ New repository**
2. Name: `aadhaar-pan-portal`
3. Set to **Public**
4. Click **Create repository**

**Step 7.3 — Upload Files**
1. In the repository, click **Add file → Upload files**
2. Drag and drop: `index.html`, `upi-qr.png`, `logo.png`
3. Click **Commit changes**

**Step 7.4 — Enable GitHub Pages**
1. Go to **Settings** tab of the repository
2. Scroll to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main**, Folder: **/ (root)**
5. Click **Save**
6. Your URL will be: `https://yourusername.github.io/aadhaar-pan-portal/`

**Step 7.5 — Update AppScript Config**
Go back to Apps Script and update:
```javascript
PORTAL_URL: 'https://yourusername.github.io/aadhaar-pan-portal/',
```
Then redeploy.

---

### Option B: Netlify (Easier — Free)

1. Go to [netlify.com](https://netlify.com) → Sign Up
2. Drag your entire folder onto the Netlify dashboard
3. Get your URL instantly (e.g., `https://random-name.netlify.app`)
4. Optional: Set a custom domain under **Domain Settings**

---

## PHASE 8 — FINAL TESTING

### Test Checklist — Run Through This Before Going Live

**Test 1: Full Application Flow (Desktop)**
- [ ] Open URL in Chrome on a computer
- [ ] Click "Begin Application"
- [ ] Upload a test Aadhaar image (any image)
- [ ] Upload a test PAN image
- [ ] Enter a 10-digit phone number
- [ ] Click "Pay Now" → QR Modal opens
- [ ] Timer counts down from 60 seconds
- [ ] "I Have Completed Payment" button activates after 10s
- [ ] Click it → upload a test screenshot
- [ ] Submit → see success screen with 6-digit code
- [ ] Open Google Sheet → new row appears
- [ ] Check WhatsApp → notification received
- [ ] Check email → notification received
- [ ] Open Drive → photos saved in correct folders

**Test 2: localStorage Persistence**
- [ ] Start filling the form (upload Aadhaar)
- [ ] Close the tab
- [ ] Reopen the URL
- [ ] Should land back on the same step with data intact

**Test 3: Status Check**
- [ ] Go to "Check Status" tab
- [ ] Enter the 6-digit code from Test 1
- [ ] Status should show "Submitted"
- [ ] Go to Google Sheet → change status to "Completed"
- [ ] Refresh status on the portal → should show "Completed"
- [ ] Rating form should appear

**Test 4: Mobile (Android or iOS)**
- [ ] Open URL on phone
- [ ] Camera and Gallery buttons should appear (no drag-drop zone)
- [ ] "Pay ₹25 Now" button should open UPI app
- [ ] After payment, upload screenshot

---

## PHASE 9 — ADMIN DAILY WORKFLOW

Once the portal is live, here is your daily admin routine:

### Morning (Start of Day)
1. Open [sheets.google.com](https://sheets.google.com)
2. Open `Tilak Infotech - Aadhaar PAN Portal` → `Applications` tab
3. Look for rows with Status = `Submitted`

### For Each New Application:
1. Click the **Aadhaar Photo URL** in column D → opens Drive → download
2. Click the **PAN Photo URL** in column E → download
3. Click the **Payment Screenshot URL** in column F → verify payment
4. Change Status (column G) to `Payment Verified`
5. Go to [incometax.gov.in](https://incometax.gov.in) or official portal to check Aadhaar-PAN link
6. Add result to **Admin Notes** (column H)
7. Change Status to `Completed` or `Rejected`
8. The user's status page will update automatically

### Complaint Response:
1. Check `Complaints` tab
2. Contact the user via WhatsApp
3. Mark complaint as `Resolved` in column E

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|---------|
| Apps Script returns error | Re-deploy as new version; check all CONFIG values are filled |
| WhatsApp notifications not working | Re-send the setup message to CallMeBot; API key may have changed |
| Photos not saving to Drive | Check DRIVE_FOLDER_ID is correct; ensure folder is not trashed |
| Status not updating on frontend | Hard refresh the page (Ctrl+Shift+R); check AppScript GET endpoint |
| UPI deeplink not opening on mobile | Test with different UPI IDs; some banks require specific format |
| localStorage data lost | Only happens if user clears browser data; nothing to fix |
| CORS error in console | Re-deploy AppScript with Access = "Anyone" |
| Rate limited by CallMeBot | Free tier: ~30 messages/day; they reset daily |

---

## UPDATING THE PORTAL IN FUTURE

### To change the price (e.g., from ₹25 to ₹50):
1. Generate a new UPI QR for the new amount
2. Replace `upi-qr.png`
3. Find all `25` references in `index.html` and update
4. Update UPI deeplink `am=25` to new amount
5. Re-upload to GitHub/Netlify

### To change the reply SLA (e.g., from 2 hours to 4 hours):
- Search `index.html` for `2 hours` and update

### To add a new admin:
- Share the Google Sheet with their Google account (Editor access)
- Share the Drive folder
