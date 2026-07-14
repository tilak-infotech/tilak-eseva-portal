// ============================================================
// TILAK INFOTECH — E-SEVA PORTAL
// Improved Google Apps Script Backend — Code.gs
// Deploy as: Web App | Execute as: Me | Access: Anyone
// ============================================================

// ── CONFIGURATION ────────────────────────────────────────────
const CONFIG = {
  SPREADSHEET_ID: '13b4TO9FVxysSdFAqVLItWWGT7aRFVBwjm5e7TUwgtGI', // ← Your Google Sheet ID
  ADMIN_EMAIL: 'tilakinfotech@gmail.com',
  ADMIN_WHATSAPP: '917019631612',
  CALLMEBOT_API_KEY: 'YOUR_CALLMEBOT_KEY_HERE',                  // ← Replace after setup

  SHEETS: {
    APPLICATIONS: 'Applications',
    RATINGS: 'Ratings',
    COMPLAINTS: 'Complaints',
    LOGS: 'Logs',
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
    return corsResponse({ success: false, error: 'Server error: ' + err.message });
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
  if (!data.appCode || !data.contactNumber || !data.applicantName) {
    return { success: false, error: 'Missing required fields' };
  }

  // Check for duplicate code
  const existing = findRowByCode(sheet, data.appCode);
  if (existing) {
    return { success: false, error: 'Duplicate application code' };
  }

  // Write to Google Sheets (Expanded Columns)
  const submittedAt = new Date();
  const row = [
    data.appCode,                                     // A: App Code
    submittedAt,                                      // B: Submission Date
    data.serviceName || data.serviceSlug || 'N/A',    // C: Service Name
    data.applicantName,                               // D: Applicant Name
    data.contactNumber,                               // E: Contact Number
    data.email || '',                                 // F: Email
    data.formData || '',                              // G: Form Details (Details text)
    data.paymentRef || '',                            // H: Payment Reference ID
    data.feeAmount || '',                             // I: Fee Amount
    'Submitted',                                      // J: Status
    '',                                               // K: Admin Notes
    '',                                               // L: Report Sent At
    '',                                               // M: Processing Agent
  ];

  sheet.appendRow(row);

  // Send notifications
  const notifData = {
    appCode: data.appCode,
    serviceName: data.serviceName || 'Service',
    applicantName: data.applicantName,
    contact: data.contactNumber,
    submittedAt: submittedAt.toLocaleString('en-IN'),
    paymentRef: data.paymentRef || 'N/A',
    feeAmount: data.feeAmount || 'N/A',
  };

  sendWhatsAppNotification(notifData);
  sendEmailNotification(notifData);

  // Log
  logEvent('NEW_APPLICATION', data.appCode, `Applicant: ${data.applicantName} | Contact: ${data.contactNumber}`);

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

  const row = sheet.getRange(rowIndex, 1, 1, 13).getValues()[0];
  const status = row[9] || 'Submitted';
  const statusStep = CONFIG.STATUS_STEPS[status] || 1;
  const contactMasked = maskPhone(row[4]);

  return {
    success: true,
    appCode: row[0],
    submittedAt: row[1] ? new Date(row[1]).toLocaleString('en-IN') : '',
    serviceName: row[2],
    applicantName: row[3],
    contactNumber: contactMasked,
    paymentRef: row[7],
    feeAmount: row[8],
    status: status,
    statusStep: statusStep,
    adminNotes: row[10] || '',
    reportSentAt: row[11] ? new Date(row[11]).toLocaleString('en-IN') : '',
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
  const msg = `⚠️ *New Complaint Received!*\nCode: ${data.appCode || 'N/A'}\nContact: ${data.contactNumber || 'N/A'}\nComplaint: ${data.complaint || ''}`;
  sendWhatsAppRaw(msg);

  return { success: true, message: 'Complaint submitted. We will contact you soon.' };
}

// ── NOTIFICATION: WhatsApp ─────────────────────────────────────
function sendWhatsAppNotification(data) {
  const msg = [
    '🔔 *New E-Seva Application!*',
    '',
    `📋 Code: *${data.appCode}*`,
    `💼 Service: ${data.serviceName}`,
    `👤 Applicant: ${data.applicantName}`,
    `📞 Contact: ${data.contact}`,
    `💳 UPI Ref: ${data.paymentRef}`,
    `💰 Fee Paid: ₹${data.feeAmount}`,
    `🕐 Time: ${data.submittedAt}`,
    '',
    `✅ *Action: Process this application in Google Sheets*`
  ].join('\n');

  sendWhatsAppRaw(msg);
}

// ── NOTIFICATION: Email ────────────────────────────────────────
function sendEmailNotification(data) {
  try {
    const subject = `New Application #${data.appCode} — Tilak E-Seva Portal`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: #000; color: #fff; padding: 20px 24px;">
          <h2 style="margin:0; font-size: 18px;">TILAK INFOTECH</h2>
          <p style="margin:4px 0 0; font-size: 13px; color: #ccc;">E-Seva Portal Application</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="margin-top:0;">New Application Received</h3>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; width: 40%;">Application Code</td>
              <td style="padding: 10px 0; font-family: monospace; font-size: 18px; font-weight: bold;">${data.appCode}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Service Name</td>
              <td style="padding: 10px 0;">${data.serviceName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Applicant Name</td>
              <td style="padding: 10px 0;">${data.applicantName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Contact Number</td>
              <td style="padding: 10px 0;">${data.contact}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">UPI Ref ID</td>
              <td style="padding: 10px 0;">${data.paymentRef}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Fee Amount</td>
              <td style="padding: 10px 0;">₹${data.feeAmount}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Submitted At</td>
              <td style="padding: 10px 0;">${data.submittedAt}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-left: 3px solid #000;">
            <strong>Action Required:</strong> Please review this submission and update the status in your Google Sheets dashboard.
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
function onSheetEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    if (sheet.getName() !== CONFIG.SHEETS.APPLICATIONS) return;

    const col = e.range.getColumn();
    if (col !== 10) return; // Column J is Status in the expanded sheet

    const row = e.range.getRow();
    if (row <= 1) return; // Skip header

    const appCode = sheet.getRange(row, 1).getValue();
    const newStatus = e.value;

    logEvent('STATUS_CHANGED', appCode, `New status: ${newStatus}`);

    // If completed, set Report Sent At timestamp (Column L is index 12)
    if (newStatus === 'Completed') {
      sheet.getRange(row, 12).setValue(new Date());
    }
  } catch (err) {
    logError('onSheetEdit', err.message);
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
    // silent fail
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

function sendWhatsAppRaw(message) {
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CONFIG.ADMIN_WHATSAPP}&text=${encodeURIComponent(message)}&apikey=${CONFIG.CALLMEBOT_API_KEY}`;
    UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  } catch (err) {
    logError('WhatsApp', err.message);
  }
}

// ── SETUP: Initialize Spreadsheet ─────────────────────────────
// Run this ONCE manually after creating/replacing your spreadsheet tabs
function setupSpreadsheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const tabDefs = [
    {
      name: CONFIG.SHEETS.APPLICATIONS,
      headers: [
        'App Code',          // A
        'Submission Date',   // B
        'Service Name',      // C
        'Applicant Name',    // D
        'Contact Number',    // E
        'Email',             // F
        'Form Details',      // G
        'Payment Ref',       // H
        'Fee Amount',        // I
        'Status',            // J
        'Admin Notes',       // K
        'Report Sent At',    // L
        'Processing Agent'   // M
      ],
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
    sheet.clear();
    // Set headers
    const headerRange = sheet.getRange(1, 1, 1, tabDef.headers.length);
    headerRange.setValues([tabDef.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#000000');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  });

  Logger.log('✅ Spreadsheet setup complete with expanded columns!');
}
