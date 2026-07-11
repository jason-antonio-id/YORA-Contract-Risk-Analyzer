import { google } from 'googleapis';

let sheetsClient: any = null;

function getSheets() {
  if (!sheetsClient) {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    // Private key is split across two env vars because some hosts (e.g. Back4app)
    // truncate env var values at 1024 chars, which is shorter than a full RSA key.
    const privateKeyRaw = (process.env.GOOGLE_SHEETS_PRIVATE_KEY_1 || '') + (process.env.GOOGLE_SHEETS_PRIVATE_KEY_2 || '');
    if (!clientEmail || !privateKeyRaw) {
      console.error("GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY_1/2 is missing from env.");
      return null;
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKeyRaw.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
  }
  return sheetsClient;
}

export async function appendLead(email: string, status: string) {
  try {
    const sheets = getSheets();
    if (!sheets) {
      console.warn("Google Sheets client is not configured. Skipping appendLead.");
      return;
    }
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      console.warn("GOOGLE_SHEET_ID is not configured. Skipping appendLead.");
      return;
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'leads!A:C',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString(), email.trim().toLowerCase(), status]]
      }
    });
  } catch (error) {
    console.error("Failed to append lead to Google Sheets:", error);
  }
}

export async function appendAnalytics(event: string, email: string, contractType?: string, riskLevel?: string) {
  try {
    const sheets = getSheets();
    if (!sheets) {
      console.warn("Google Sheets client is not configured. Skipping appendAnalytics.");
      return;
    }
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      console.warn("GOOGLE_SHEET_ID is not configured. Skipping appendAnalytics.");
      return;
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'analytics!A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString(), event, email || '', contractType || '', riskLevel || '']]
      }
    });
  } catch (error) {
    console.error("Failed to append analytics to Google Sheets:", error);
  }
}

export async function getStats() {
  try {
    const sheets = getSheets();
    if (!sheets) {
      throw new Error("Google Sheets client is not configured.");
    }
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not configured.");
    }

    const leadsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'leads!A:C'
    });

    const analyticsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'analytics!A:E'
    });

    const leadsRows = leadsRes.data.values || [];
    const analyticsRows = analyticsRes.data.values || [];

    const startLeadsIdx = (leadsRows.length > 0 && leadsRows[0][1]?.toString().toLowerCase() === 'email') ? 1 : 0;
    const startAnalyticsIdx = (analyticsRows.length > 0 && analyticsRows[0][1]?.toString().toLowerCase() === 'event') ? 1 : 0;

    let total_verified_emails = 0;
    let total_analyses = 0;
    const emailsSet = new Set<string>();
    const verifiedEmailsSet = new Set<string>();
    const recent_events: any[] = [];

    for (let i = startLeadsIdx; i < leadsRows.length; i++) {
      const row = leadsRows[i];
      if (!row || row.length === 0) continue;
      const email = (row[1] || '').trim().toLowerCase();
      const status = (row[2] || '').trim().toLowerCase();

      if (email) {
        emailsSet.add(email);
        if (status === 'verified') {
          verifiedEmailsSet.add(email);
        }
      }
    }

    total_verified_emails = verifiedEmailsSet.size;

    for (let i = startAnalyticsIdx; i < analyticsRows.length; i++) {
      const row = analyticsRows[i];
      if (!row || row.length === 0) continue;
      const timestamp = row[0] || '';
      const event = row[1] || '';
      const email = (row[2] || '').trim().toLowerCase();
      const contractType = row[3] || '';
      const riskLevel = row[4] || '';

      if (event === 'analyze_success') {
        total_analyses++;
      }

      if (email) {
        emailsSet.add(email);
      }

      recent_events.push({
        ts: timestamp,
        event,
        email,
        contract_type: contractType,
        risk_level: riskLevel
      });
    }

    return {
      total_verified_emails,
      total_analyses,
      emails: Array.from(emailsSet),
      recent_events: recent_events.slice(-50).reverse() // Last 50 events, newest first
    };

  } catch (error) {
    console.error("Failed to read stats from Google Sheets:", error);
    throw error;
  }
}

export async function appendFeedback(email: string, rating: number, comment: string) {
  try {
    const sheets = getSheets();
    if (!sheets) return;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) return;
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'feedback!A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString(), email.trim().toLowerCase(), rating, comment || '']]
      }
    });
  } catch (error) {
    console.error("Failed to append feedback to Google Sheets:", error);
  }
}
