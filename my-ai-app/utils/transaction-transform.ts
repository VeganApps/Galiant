import { TransactionData } from './supabase';

export interface DisplayTransaction {
  id: string;
  merchant: string;
  category: string;
  amount: string;
  currency: string;
  flag: string;
  date: string;
  time: string;
  type: 'expense' | 'income';
  icon: string;
}

// Transform transaction data to display format
export const transformTransactionDataToDisplay = (data: TransactionData[]): DisplayTransaction[] => {
  return data.map((record, index) => {
    // Determine if it's income or expense based on direction
    const isIncome = record.direction === 1;
    const type: 'expense' | 'income' = isIncome ? 'income' : 'expense';
    
    // Extract merchant name from text_short_debitor or text_creditor
    const merchantName = isIncome 
      ? record.text_short_creditor || record.text_creditor || 'Unknown'
      : record.text_short_debitor || record.text_debitor || 'Unknown';
    
    // Clean up merchant name (remove reference numbers, etc.)
    const cleanMerchantName = merchantName
      .replace(/\/\s*[A-Z0-9]+\s*$/, '') // Remove trailing reference numbers
      .replace(/^\s*[A-Z0-9]+\s*\/\s*/, '') // Remove leading reference numbers
      .trim();
    
    // Format amount
    const amount = record.amount_chf ? record.amount_chf.toFixed(2) : '0.00';
    
    // Get currency and flag - all amounts are converted to CHF
    const currency = 'CHF';
    const countryName = record.cred_addr_country || record.acquirer_country_name || '';
    const flag = getCountryFlag(countryName, currency);
    
    // Format date and time
    const transactionDate = record.trx_date ? new Date(record.trx_date) : new Date();
    const date = formatDate(transactionDate);
    const time = formatTime(transactionDate);
    
    // Get category and icon - prioritize icon_url from new schema
    const category = record.category || 'Other';
    const icon = record.icon_url || getCategoryIcon(category);
    
    return {
      id: record.trx_id?.toString() || index.toString(),
      merchant: cleanMerchantName || 'Unknown Transaction',
      category,
      amount,
      currency,
      flag,
      date,
      time,
      type,
      icon,
    };
  })
};

// Get country flag emoji based on country name, fallback to currency
const getCountryFlag = (countryName: string, currency: string): string => {
  // First try to match by country name
  if (countryName) {
    const countryLower = countryName.toLowerCase();
    
    // Swiss variations
    if (countryLower.includes('schweiz') || countryLower.includes('switzerland') || countryLower.includes('suisse')) {
      return '🇨🇭';
    }
    
    // German variations
    if (countryLower.includes('deutschland') || countryLower.includes('germany') || countryLower.includes('deutsch')) {
      return '🇩🇪';
    }
    
    // Austrian variations
    if (countryLower.includes('österreich') || countryLower.includes('austria') || countryLower.includes('österr')) {
      return '🇦🇹';
    }
    
    // French variations
    if (countryLower.includes('france') || countryLower.includes('français') || countryLower.includes('francais')) {
      return '🇫🇷';
    }
    
    // Italian variations
    if (countryLower.includes('italia') || countryLower.includes('italy') || countryLower.includes('italien')) {
      return '🇮🇹';
    }
    
    // Danish variations
    if (countryLower.includes('danmark') || countryLower.includes('denmark') || countryLower.includes('dänemark')) {
      return '🇩🇰';
    }
    
    // Norwegian variations
    if (countryLower.includes('norge') || countryLower.includes('norway') || countryLower.includes('norwegen')) {
      return '🇳🇴';
    }
    
    // Swedish variations
    if (countryLower.includes('sverige') || countryLower.includes('sweden') || countryLower.includes('schweden')) {
      return '🇸🇪';
    }
    
    // Czech variations
    if (countryLower.includes('česká') || countryLower.includes('czech') || countryLower.includes('tschechien')) {
      return '🇨🇿';
    }
    
    // Croatian variations
    if (countryLower.includes('hrvatska') || countryLower.includes('croatia') || countryLower.includes('kroatien')) {
      return '🇭🇷';
    }
    
    // UK variations
    if (countryLower.includes('united kingdom') || countryLower.includes('uk') || countryLower.includes('britain') || countryLower.includes('england')) {
      return '🇬🇧';
    }
    
    // US variations
    if (countryLower.includes('united states') || countryLower.includes('usa') || countryLower.includes('america')) {
      return '🇺🇸';
    }
  }
  
  // Fallback to currency if no country match found
  switch (currency) {
    case 'CHF':
      return '🇨🇭';
    case 'EUR':
      return '🇪🇺';
    case 'USD':
      return '🇺🇸';
    case 'GBP':
      return '🇬🇧';
    case 'DKK':
      return '🇩🇰';
    case 'NOK':
      return '🇳🇴';
    case 'SEK':
      return '🇸🇪';
    case 'CZK':
      return '🇨🇿';
    case 'HRK':
      return '🇭🇷';
    default:
      return '🌍';
  }
};

// Get category icon
const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    // Food & Dining
    case 'food & dining':
    case 'restaurant':
    case 'dining':
      return 'restaurant';
    
    // Groceries
    case 'groceries':
    case 'grocery':
      return 'basket';
    
    // Transportation
    case 'transportation':
    case 'transport':
    case 'transit':
      return 'car';
    
    // Shopping
    case 'shopping':
    case 'retail':
      return 'bag';
    
    // Entertainment
    case 'entertainment':
    case 'entertain':
      return 'musical-notes';
    
    // Bills & Utilities
    case 'bills & utilities':
    case 'bills':
    case 'utilities':
    case 'utility':
      return 'flash';
    
    // Healthcare
    case 'healthcare':
    case 'health':
    case 'medical':
      return 'medical';
    
    // Education
    case 'education':
    case 'school':
    case 'learning':
      return 'school';
    
    // Travel
    case 'travel':
    case 'trip':
    case 'vacation':
      return 'airplane';
    
    // Business Services
    case 'business services':
    case 'business':
    case 'professional':
      return 'briefcase';
    
    // Financial Services
    case 'financial services':
    case 'banking':
    case 'finance':
      return 'card';
    
    // Insurance
    case 'insurance':
    case 'coverage':
      return 'shield-checkmark';
    
    // Taxes
    case 'taxes':
    case 'tax':
      return 'document-text';
    
    // Income
    case 'income':
    case 'salary':
    case 'wage':
    case 'earnings':
      return 'trending-up';
    
    // Transfers
    case 'transfers':
    case 'transfer':
    case 'move money':
      return 'swap-horizontal';
    
    // ATM & Cash
    case 'atm & cash':
    case 'atm':
    case 'cash':
    case 'withdrawal':
      return 'cash';
    
    // Fees & Charges
    case 'fees & charges':
    case 'fees':
    case 'charges':
    case 'penalty':
      return 'warning';
    
    // Other
    case 'other':
    case 'miscellaneous':
    case 'misc':
    default:
      return 'receipt';
  }
};

// Format date for display
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Format time for display
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};
