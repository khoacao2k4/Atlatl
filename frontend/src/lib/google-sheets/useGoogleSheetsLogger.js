import { useState } from 'react';
import { logToGoogleSheets as serverLogToSheets } from './actions';

export const useGoogleSheetsLogger = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logToGoogleSheets = async (sheetName, data) => {
    console.log('Sheet name:', sheetName);
    console.log('Data:', data);
    setIsLoading(true);
    setError(null);

    try {
      const result = await serverLogToSheets(sheetName, data);
      
      setIsLoading(false);
      
      if (result.success) {
        return { success: true, result };
      } else {
        throw new Error(result.error || 'Failed to log to Google Sheets');
      }
    } catch (err) {
      console.error('Google Sheets Logger Error:', err);
      setError(err.message);
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { logToGoogleSheets, isLoading, error };
};