import { Platform } from 'react-native';
import { supabase } from './supabase';

export interface CSVExportParams {
  start: string; // ISO 8601 date
  end: string; // ISO 8601 date
  category?: string; // optional category filter
}

export interface CSVExportResponse {
  success: boolean;
  data?: string; // CSV content
  filename?: string;
  error?: string;
}

/**
 * Extract the Supabase project reference from the URL
 * Example: https://abc123def.supabase.co -> abc123def
 */
function getSupabaseProjectRef(): string {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL is not configured');
  }
  
  try {
    const url = new URL(supabaseUrl);
    const projectRef = url.hostname.split('.')[0];
    return projectRef;
  } catch (error) {
    throw new Error('Invalid Supabase URL format');
  }
}

/**
 * Call the Supabase Edge Function to export expenses as CSV
 */
export async function exportExpensesCSV(params: CSVExportParams): Promise<CSVExportResponse> {
  try {
    const projectRef = getSupabaseProjectRef();
    
    // Build the Edge Function URL
    const baseUrl = `https://${projectRef}.functions.supabase.co/export-expenses-csv`;
    const url = new URL(baseUrl);
    
    // Add query parameters
    url.searchParams.set('start', params.start);
    url.searchParams.set('end', params.end);
    if (params.category) {
      url.searchParams.set('category', params.category);
    }

    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if we have a session
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      // Use anon key as fallback
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      if (anonKey) {
        headers.Authorization = `Bearer ${anonKey}`;
      }
    }

    console.log('Calling CSV export:', {
      url: url.toString(),
      params,
      hasAuth: !!session?.access_token
    });

    // Make the request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CSV export failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return {
        success: false,
        error: `Export failed: ${response.status} ${response.statusText}. ${errorText}`
      };
    }

    // Get the CSV content
    const csvContent = await response.text();
    
    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'expenses.csv';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=([^;\n]*)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '').trim();
      }
    }

    console.log('CSV export successful:', {
      contentLength: csvContent.length,
      filename
    });

    return {
      success: true,
      data: csvContent,
      filename
    };

  } catch (error) {
    console.error('CSV export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Platform-specific file download handler
 */
export function downloadCSVFile(csvContent: string, filename: string): void {
  if (Platform.OS === 'web') {
    // Web platform - create download link
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download CSV file:', error);
      throw new Error('Failed to download file');
    }
  } else {
    // Mobile platforms - you might want to use expo-sharing or similar
    // For now, we'll copy to clipboard as a fallback
    console.warn('File download not implemented for mobile platforms. Content copied to clipboard.');
    // You could implement sharing functionality here using expo-sharing
    throw new Error('File download not supported on mobile. Consider implementing sharing instead.');
  }
}

/**
 * Helper function to format dates for the API
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

/**
 * Helper function to get common date ranges
 */
export function getDateRangePresets() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    thisMonth: {
      label: 'This Month',
      start: formatDateForAPI(startOfMonth),
      end: formatDateForAPI(endOfMonth)
    },
    lastMonth: {
      label: 'Last Month',
      start: formatDateForAPI(startOfLastMonth),
      end: formatDateForAPI(endOfLastMonth)
    },
    thisYear: {
      label: 'This Year',
      start: formatDateForAPI(startOfYear),
      end: formatDateForAPI(now)
    },
    last30Days: {
      label: 'Last 30 Days',
      start: formatDateForAPI(thirtyDaysAgo),
      end: formatDateForAPI(now)
    }
  };
}
