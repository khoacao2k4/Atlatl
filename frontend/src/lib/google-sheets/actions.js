'use server';

import { google } from 'googleapis';

const getGoogleSheetsClient = async () => {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
};

export async function logToGoogleSheets(sheetName, data) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const timestamp = new Date().toISOString();
    const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    let values;
    if (sheetName === 'EmailSignups') {
      values = [[
        formattedTimestamp,
        data.email,
        data.source || 'Unknown'
      ]];
    } else if (sheetName === 'ContactFormSubmissions') {
      values = [[
        formattedTimestamp,
        data.name,
        data.email,
        data.phone,
        data.message
      ]];
    } else {
      values = [[
        formattedTimestamp,
        ...Object.values(data)
      ]];
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    return {
      success: true,
      updatedRange: response.data.updates.updatedRange,
      updatedRows: response.data.updates.updatedRows,
    };

  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return {
      success: false,
      error: error.message
    };
  }
}