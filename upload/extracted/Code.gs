// ============================================================
// TILAK INFOTECH — AADHAAR-PAN LINK CHECK PORTAL
// Google Apps Script Backend — Code.gs
// Deploy as: Web App | Execute as: Me | Access: Anyone
// ============================================================

// ── CONFIGURATION ────────────────────────────────────────────
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',       // ← Replace
  DRIVE_FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID_HERE',     // ← Replace
  ADMIN_EMAIL: 'tilakinfotech@gmail.com',
  ADMIN_WHATSAPP: '917019631612',
  CALLMEBOT_API_KEY: 'YOUR_CALLMEBOT_KEY_HERE',     // ← Replace after setup
  PORTAL_URL: 'YOUR_GITHUB_PAGES_URL_HERE',         // ← Replace

  SHEETS: {
    APPLICATIONS: 'Applications',
    RATINGS: 'Ratings',
    COMPLAINTS: 'Complaints',
    LOGS: 'Logs',
  },

  DRIVE_FOLDERS: {
    AADHAAR: 'Aadhaar-Photos',
    PAN: 'PAN-Photos',
    PAYMENT: 'Payment-Screenshots',
  },

  STATUS_STEPS: {
    'Submitted': 1,
    'Payment Verified': 2,
    'Under Review': 3,
    'Completed': 4,
    'Rejected': 0,
  },
};

// ── CORS HELPER ──────────────────────────────────────────────
function corsResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── ROUTER: doGet ─────────────────────────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  const code = e.parameter.code;

  try {
    if (action === 'status' && code) {
      return corsResponse(getApplicationStatus(code));
    }
    return corsResponse({ success: false, error: 'Invalid action' });
  } catch (err) {
    logError('doGet', err.message);
    return corsResponse({ success: false, error: 'Server error' });
  }
}

// ── ROUTER: doPost ────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'submit') return corsResponse(handleNewApplication(data));
    if (action === 'rating') return corsResponse(handleRating(data));
    if (action === 'complaint') return corsResponse(handleComplaint(data));

    return corsResponse({ success: false, error: 'Unknown action' });
  } catch (err) {
    logError('doPost', err.message);
    return corsResponse({ success: false, error: 'Server error: ' + err.message });
  }
}

// ── HANDLER: New Application ──────────────────────────────────
function handleNewApplication(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.APPLICATIONS);

  // Validate required fields
  if (!data.appCode || !data.contactNumber) {
    return { success: false, error: 'Missing required fields' };
  }

  // Check for duplicate code
  const existing = findRowByCode(sheet, data.appCode);
  if (existing) {
    return { success: false, error: 'Duplicate application code' };
  }

  // Save photos to Google Drive
  const rootFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);

  let aadhaarUrl = '';
  let panUrl = '';
  let paymentUrl = '';

  if (data.aadhaarPhoto) {
    aadhaarUrl = saveBase64ToDrive(
      rootFolder,
      CONFIG.DRIVE_FOLDERS.AADHAAR,
      data.aadhaarPhoto,
      `${data.appCode}_aadhaar_${Date.now()}.jpg`
    );
  }

  if (data.panPhoto) {
    panUrl = saveBase64ToDrive(
      rootFolder,
      CONFIG.DRIVE_FOLDERS.PAN,
      data.panPhoto,
      `${data.appCode}_pan_${Date.now()}.jpg`
    );
  }

  if (data.paymentScreenshot) {
    paymentUrl = saveBase64ToDrive(
      rootFolder,
      CONFIG.DRIVE_FOLDERS.PAYMENT,
      data.paymentScreenshot,
      `${data.appCode}_payment_${Date.now()}.jpg`
    );
  }

  // Write to Google Sheets
  const submittedAt = new Date();
  const row = [
    data.appCode,          // A: App Code
    submittedAt,           // B: Submission Date
    data.contactNumber,    // C: Contact Number
    aadhaarUrl,            // D: Aadhaar Photo URL
    panUrl,                // E: PAN Photo URL
    paymentUrl,            // F: Payment Screenshot URL
    'Submitted',           // G: Status
    '',                    // H: Admin Notes
    '',                    // I: Report Sent At
    '',                    // J: Processing Agent
  ];

  sheet.appendRow(row);

  // Send notifications
  const notifData = {
    appCode: data.appCode,
    contact: data.contactNumber,
    submittedAt: submittedAt.toLocaleString('en-IN'),
    aadhaarUrl,
    panUrl,
    paymentUrl,
  };

  sendWhatsAppNotification(notifData);
  sendEmailNotification(notifData);

  // Log
  logEvent('NEW_APPLICATION', data.appCode, `Contact: ${data.contactNumber}`);

  return {
    success: true,
    appCode: data.appCode,
    message: 'Application submitted successfully',
  };
}

// ── HANDLER: Get Status ────────────────────────────────────────
function getApplicationStatus(code) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.APPLICATIONS);

  const rowIndex = findRowByCode(sheet, code);
  if (!rowIndex) {
    return { success: false, error: 'Application not found' };
  }

  const row = sheet.getRange(rowIndex, 1, 1, 10).getValues()[0];
  const status = row[6] || 'Submitted';
  const statusStep = CONFIG.STATUS_STEPS[status] || 1;
  const contactMasked = maskPhone(row[2]);

  return {
    success: true,
    appCode: row[0],
    status: status,
    statusStep: statusStep,
    submittedAt: row[1] ? new Date(row[1]).toLocaleString('en-IN') : '',
    contactNumber: contactMasked,
    adminNotes: row[7] || '',
    reportSentAt: row[8] ? new Date(row[8]).toLocaleString('en-IN') : '',
  };
}

// ── HANDLER: Rating ────────────────────────────────────────────
function handleRating(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.RATINGS);

  if (!data.appCode || !data.rating) {
    return { success: false, error: 'Missing rating data' };
  }

  sheet.appendRow([
    data.appCode,
    data.rating,
    data.comment || '',
    new Date(),
  ]);

  logEvent('RATING_SUBMITTED', data.appCode, `Rating: ${data.rating}`);

  return { success: true, message: 'Thank you for your feedback!' };
}

// ── HANDLER: Complaint ─────────────────────────────────────────
function handleComplaint(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.COMPLAINTS);

  sheet.appendRow([
    data.appCode || 'N/A',
    data.contactNumber || '',
    data.complaint || '',
    new Date(),
    'Open',
  ]);

  logEvent('COMPLAINT', data.appCode || 'N/A', data.complaint || '');

  // Notify admin of complaint
  const msg = `⚠️ New Complaint Received!\nCode: ${data.appCode || 'N/A'}\nContact: ${data.contactNumber || 'N/A'}\nComplaint: ${data.complaint || ''}`;
  sendWhatsAppRaw(msg);

  return { success: true, message: 'Complaint submitted. We will contact you soon.' };
}

// ── NOTIFICATION: WhatsApp ─────────────────────────────────────
function sendWhatsAppNotification(data) {
  const msg = [
    '🔔 *New Application Received!*',
    '',
    `📋 Code: *${data.appCode}*`,
    `📞 Contact: ${data.contact}`,
    `🕐 Time: ${data.submittedAt}`,
    '',
    `📄 Aadhaar Photo: ${data.aadhaarUrl || 'Not uploaded'}`,
    `📄 PAN Photo: ${data.panUrl || 'Not uploaded'}`,
    `💳 Payment Proof: ${data.paymentUrl || 'Not uploaded'}`,
    '',
    `✅ *Action: Update status in Google Sheets*`,
    `🔗 ${CONFIG.PORTAL_URL}`,
  ].join('\n');

  sendWhatsAppRaw(msg);
}

function sendWhatsAppRaw(message) {
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CONFIG.ADMIN_WHATSAPP}&text=${encodeURIComponent(message)}&apikey=${CONFIG.CALLMEBOT_API_KEY}`;
    UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (err) {
    logError('WhatsApp', err.message);
  }
}

// ── NOTIFICATION: Email ────────────────────────────────────────
function sendEmailNotification(data) {
  try {
    const subject = `New Application #${data.appCode} — Tilak Infotech Portal`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: #000; color: #fff; padding: 20px 24px;">
          <h2 style="margin:0; font-size: 18px;">TILAK INFOTECH</h2>
          <p style="margin:4px 0 0; font-size: 13px; color: #ccc;">Aadhaar-PAN Link Check Portal</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="margin-top:0;">New Application Received</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; width: 40%;">Application Code</td>
              <td style="padding: 10px 0; font-family: monospace; font-size: 18px;">${data.appCode}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Contact Number</td>
              <td style="padding: 10px 0;">${data.contact}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Submitted At</td>
              <td style="padding: 10px 0;">${data.submittedAt}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Aadhaar Photo</td>
              <td style="padding: 10px 0;"><a href="${data.aadhaarUrl}">View File</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">PAN Photo</td>
              <td style="padding: 10px 0;"><a href="${data.panUrl}">View File</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Payment Screenshot</td>
              <td style="padding: 10px 0;"><a href="${data.paymentUrl}">View File</a></td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-left: 3px solid #000;">
            <strong>Action Required:</strong> Review the uploaded documents and update the application status in Google Sheets.
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 16px 24px; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
          Tilak Infotech · tilakinfotech@gmail.com · +91 70196 31612
        </div>
      </div>
    `;

    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, '', { htmlBody });
  } catch (err) {
    logError('Email', err.message);
  }
}

// ── TRIGGER: Sheet Edit (Status Change) ───────────────────────
// Install this as "On edit" trigger from Apps Script dashboard
function onSheetEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    if (sheet.getName() !== CONFIG.SHEETS.APPLICATIONS) return;

    const col = e.range.getColumn();
    if (col !== 7) return; // Only watch Status column (G)

    const row = e.range.getRow();
    if (row <= 1) return; // Skip header row

    const appCode = sheet.getRange(row, 1).getValue();
    const newStatus = e.value;

    logEvent('STATUS_CHANGED', appCode, `New status: ${newStatus}`);

    // If completed, set Report Sent At timestamp
    if (newStatus === 'Completed') {
      sheet.getRange(row, 9).setValue(new Date());
    }

    // Notify admin (optional confirmation)
    // sendWhatsAppRaw(`✅ Status updated: ${appCode} → ${newStatus}`);

  } catch (err) {
    logError('onSheetEdit', err.message);
  }
}

// ── TRIGGER: Daily Digest ──────────────────────────────────────
// Install as time-based trigger: every day 9AM
function dailyDigest() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.APPLICATIONS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    const pending = rows.filter(r => ['Submitted', 'Payment Verified', 'Under Review'].includes(r[6]));
    const completed = rows.filter(r => r[6] === 'Completed');
    const today = rows.filter(r => {
      const d = new Date(r[1]);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    });

    const msg = [
      `📊 *Daily Digest — ${new Date().toLocaleDateString('en-IN')}*`,
      '',
      `📌 Pending Applications: ${pending.length}`,
      `✅ Completed Today: ${today.filter(r => r[6] === 'Completed').length}`,
      `📥 New Today: ${today.length}`,
      `📦 Total Applications: ${rows.length}`,
    ].join('\n');

    sendWhatsAppRaw(msg);
  } catch (err) {
    logError('dailyDigest', err.message);
  }
}

// ── UTILITY: Save Base64 to Drive ─────────────────────────────
function saveBase64ToDrive(rootFolder, subFolderName, base64String, fileName) {
  try {
    // Get or create subfolder
    let folder;
    const existing = rootFolder.getFoldersByName(subFolderName);
    if (existing.hasNext()) {
      folder = existing.next();
    } else {
      folder = rootFolder.createFolder(subFolderName);
    }

    // Strip base64 prefix (data:image/jpeg;base64,...)
    const base64Data = base64String.includes(',')
      ? base64String.split(',')[1]
      : base64String;

    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      'image/jpeg',
      fileName
    );

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return file.getUrl();
  } catch (err) {
    logError('saveBase64ToDrive', err.message);
    return '';
  }
}

// ── UTILITY: Find Row By App Code ─────────────────────────────
function findRowByCode(sheet, code) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(code)) {
      return i + 1; // 1-indexed row number
    }
  }
  return null;
}

// ── UTILITY: Mask Phone ────────────────────────────────────────
function maskPhone(phone) {
  const s = String(phone);
  if (s.length >= 10) {
    return s.slice(0, -6) + 'X XXXXX';
  }
  return s;
}

// ── UTILITY: Log Event ────────────────────────────────────────
function logEvent(eventType, appCode, details) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
    sheet.appendRow([new Date(), eventType, appCode, details]);
  } catch (err) {
    // silent fail for logging
  }
}

// ── UTILITY: Log Error ────────────────────────────────────────
function logError(source, message) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
    sheet.appendRow([new Date(), 'ERROR:' + source, '', message]);
  } catch (err) {
    // silent fail
  }
}

// ── SETUP: Initialize Spreadsheet ─────────────────────────────
// Run this ONCE manually after creating the spreadsheet
function setupSpreadsheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  // Create tabs
  const tabDefs = [
    {
      name: CONFIG.SHEETS.APPLICATIONS,
      headers: ['App Code', 'Submission Date', 'Contact Number', 'Aadhaar Photo URL',
                'PAN Photo URL', 'Payment Screenshot URL', 'Status', 'Admin Notes',
                'Report Sent At', 'Processing Agent'],
    },
    {
      name: CONFIG.SHEETS.RATINGS,
      headers: ['App Code', 'Rating (1-5)', 'Comment', 'Timestamp'],
    },
    {
      name: CONFIG.SHEETS.COMPLAINTS,
      headers: ['App Code', 'Contact Number', 'Complaint', 'Timestamp', 'Status'],
    },
    {
      name: CONFIG.SHEETS.LOGS,
      headers: ['Timestamp', 'Event Type', 'App Code', 'Details'],
    },
  ];

  tabDefs.forEach(tabDef => {
    let sheet = ss.getSheetByName(tabDef.name);
    if (!sheet) {
      sheet = ss.insertSheet(tabDef.name);
    }
    // Set headers
    const headerRange = sheet.getRange(1, 1, 1, tabDef.headers.length);
    headerRange.setValues([tabDef.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#000000');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  });

  Logger.log('✅ Spreadsheet setup complete!');
}
