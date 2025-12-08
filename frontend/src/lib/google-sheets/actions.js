'use server';

import { google } from 'googleapis';

const getGoogleSheetsClient = async () => {
  // Temporary debugging
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  
  console.log('=== GOOGLE SHEETS DEBUG ===');
  console.log('Email:', email);
  console.log('Email length:', email?.length);
  console.log('Email has quotes:', email?.startsWith('"'));
  console.log('Email trimmed equals original:', email === email?.trim());
  
  console.log('Sheet ID:', sheetId);
  console.log('Sheet ID length:', sheetId?.length);
  console.log('Sheet ID has quotes:', sheetId?.startsWith('"'));
  
  console.log('Key first 30 chars:', key?.substring(0, 30));
  console.log('Key last 30 chars:', key?.substring(key?.length - 30));
  console.log('Key has quotes:', key?.startsWith('"'));
  console.log('Key length:', key?.length);
  console.log('=========================');
  
  const privateKey = key?.replace(/\\n/g, '\n');
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email?.trim(),
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