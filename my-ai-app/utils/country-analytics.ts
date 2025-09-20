import { FinanceTable } from './supabase';

export interface CountrySpending {
  country: string;
  flag: string;
  currency: string;
  amount: string;
  percentage: number;
  transactions: number;
  color: string;
}

/**
 * Get country flag emoji based on country name
 */
const getCountryFlag = (countryName: string): string => {
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
  
  // Netherlands variations
  if (countryLower.includes('netherlands') || countryLower.includes('holland') || countryLower.includes('niederlande')) {
    return '🇳🇱';
  }
  
  // Belgium variations
  if (countryLower.includes('belgium') || countryLower.includes('belgique') || countryLower.includes('belgien')) {
    return '🇧🇪';
  }
  
  // Spain variations
  if (countryLower.includes('spain') || countryLower.includes('españa') || countryLower.includes('spanien')) {
    return '🇪🇸';
  }
  
  // Portugal variations
  if (countryLower.includes('portugal') || countryLower.includes('portugues')) {
    return '🇵🇹';
  }
  
  // Ireland variations
  if (countryLower.includes('ireland') || countryLower.includes('éire')) {
    return '🇮🇪';
  }
  
  // Finland variations
  if (countryLower.includes('finland') || countryLower.includes('suomi')) {
    return '🇫🇮';
  }
  
  // Poland variations
  if (countryLower.includes('poland') || countryLower.includes('polska')) {
    return '🇵🇱';
  }
  
  // Hungary variations
  if (countryLower.includes('hungary') || countryLower.includes('magyarország')) {
    return '🇭🇺';
  }
  
  // Slovenia variations
  if (countryLower.includes('slovenia') || countryLower.includes('slovenija')) {
    return '🇸🇮';
  }
  
  // Slovakia variations
  if (countryLower.includes('slovakia') || countryLower.includes('slovensko')) {
    return '🇸🇰';
  }
  
  // Romania variations
  if (countryLower.includes('romania') || countryLower.includes('românia')) {
    return '🇷🇴';
  }
  
  // Bulgaria variations
  if (countryLower.includes('bulgaria') || countryLower.includes('българия')) {
    return '🇧🇬';
  }
  
  // Greece variations
  if (countryLower.includes('greece') || countryLower.includes('ελλάδα')) {
    return '🇬🇷';
  }
  
  // Turkey variations
  if (countryLower.includes('turkey') || countryLower.includes('türkiye')) {
    return '🇹🇷';
  }
  
  // Luxembourg variations
  if (countryLower.includes('luxembourg') || countryLower.includes('lëtzebuerg')) {
    return '🇱🇺';
  }
  
  // Canada variations
  if (countryLower.includes('canada') || countryLower.includes('kanada')) {
    return '🇨🇦';
  }
  
  // Japan variations
  if (countryLower.includes('japan') || countryLower.includes('nippon') || countryLower.includes('nihon')) {
    return '🇯🇵';
  }
  
  // Australia variations
  if (countryLower.includes('australia')) {
    return '🇦🇺';
  }
  
  // New Zealand variations
  if (countryLower.includes('new zealand') || countryLower.includes('aotearoa')) {
    return '🇳🇿';
  }
  
  // South Korea variations
  if (countryLower.includes('south korea') || countryLower.includes('korea') || countryLower.includes('한국')) {
    return '🇰🇷';
  }
  
  // China variations
  if (countryLower.includes('china') || countryLower.includes('中国')) {
    return '🇨🇳';
  }
  
  // India variations
  if (countryLower.includes('india') || countryLower.includes('भारत')) {
    return '🇮🇳';
  }
  
  // Brazil variations
  if (countryLower.includes('brazil') || countryLower.includes('brasil')) {
    return '🇧🇷';
  }
  
  // Mexico variations
  if (countryLower.includes('mexico') || countryLower.includes('méxico')) {
    return '🇲🇽';
  }
  
  // Default flag for unknown countries
  return '🌍';
};

/**
 * Normalize country name for consistent grouping
 */
const normalizeCountryName = (countryName: string): string => {
  if (!countryName) return 'Switzerland';
  
  const countryLower = countryName.toLowerCase();
  
  if (countryLower.includes('schweiz') || countryLower.includes('switzerland') || countryLower.includes('suisse')) {
    return 'Switzerland';
  }
  if (countryLower.includes('deutschland') || countryLower.includes('germany') || countryLower.includes('deutsch')) {
    return 'Germany';
  }
  if (countryLower.includes('österreich') || countryLower.includes('austria')) {
    return 'Austria';
  }
  if (countryLower.includes('france') || countryLower.includes('français') || countryLower.includes('francais')) {
    return 'France';
  }
  if (countryLower.includes('italia') || countryLower.includes('italy')) {
    return 'Italy';
  }
  if (countryLower.includes('danmark') || countryLower.includes('denmark')) {
    return 'Denmark';
  }
  if (countryLower.includes('norge') || countryLower.includes('norway')) {
    return 'Norway';
  }
  if (countryLower.includes('sverige') || countryLower.includes('sweden')) {
    return 'Sweden';
  }
  if (countryLower.includes('česká') || countryLower.includes('czech')) {
    return 'Czech Republic';
  }
  if (countryLower.includes('hrvatska') || countryLower.includes('croatia')) {
    return 'Croatia';
  }
  if (countryLower.includes('united kingdom') || countryLower.includes('uk') || countryLower.includes('britain') || countryLower.includes('england')) {
    return 'United Kingdom';
  }
  if (countryLower.includes('united states') || countryLower.includes('usa') || countryLower.includes('america')) {
    return 'United States';
  }
  if (countryLower.includes('netherlands') || countryLower.includes('holland')) {
    return 'Netherlands';
  }
  if (countryLower.includes('belgium') || countryLower.includes('belgique')) {
    return 'Belgium';
  }
  if (countryLower.includes('spain') || countryLower.includes('españa')) {
    return 'Spain';
  }
  if (countryLower.includes('portugal')) {
    return 'Portugal';
  }
  if (countryLower.includes('ireland') || countryLower.includes('éire')) {
    return 'Ireland';
  }
  if (countryLower.includes('finland') || countryLower.includes('suomi')) {
    return 'Finland';
  }
  if (countryLower.includes('poland') || countryLower.includes('polska')) {
    return 'Poland';
  }
  if (countryLower.includes('hungary') || countryLower.includes('magyarország')) {
    return 'Hungary';
  }
  if (countryLower.includes('slovenia') || countryLower.includes('slovenija')) {
    return 'Slovenia';
  }
  if (countryLower.includes('slovakia') || countryLower.includes('slovensko')) {
    return 'Slovakia';
  }
  if (countryLower.includes('romania') || countryLower.includes('românia')) {
    return 'Romania';
  }
  if (countryLower.includes('bulgaria') || countryLower.includes('българия')) {
    return 'Bulgaria';
  }
  if (countryLower.includes('greece') || countryLower.includes('ελλάδα')) {
    return 'Greece';
  }
  if (countryLower.includes('turkey') || countryLower.includes('türkiye')) {
    return 'Turkey';
  }
  if (countryLower.includes('luxembourg') || countryLower.includes('lëtzebuerg')) {
    return 'Luxembourg';
  }
  if (countryLower.includes('ireland') || countryLower.includes('éire')) {
    return 'Ireland';
  }
  if (countryLower.includes('finland') || countryLower.includes('suomi')) {
    return 'Finland';
  }
  if (countryLower.includes('poland') || countryLower.includes('polska')) {
    return 'Poland';
  }
  if (countryLower.includes('hungary') || countryLower.includes('magyarország')) {
    return 'Hungary';
  }
  if (countryLower.includes('slovenia') || countryLower.includes('slovenija')) {
    return 'Slovenia';
  }
  if (countryLower.includes('slovakia') || countryLower.includes('slovensko')) {
    return 'Slovakia';
  }
  if (countryLower.includes('romania') || countryLower.includes('românia')) {
    return 'Romania';
  }
  if (countryLower.includes('bulgaria') || countryLower.includes('българия')) {
    return 'Bulgaria';
  }
  if (countryLower.includes('greece') || countryLower.includes('ελλάδα')) {
    return 'Greece';
  }
  if (countryLower.includes('turkey') || countryLower.includes('türkiye')) {
    return 'Turkey';
  }
  if (countryLower.includes('canada') || countryLower.includes('kanada')) {
    return 'Canada';
  }
  if (countryLower.includes('japan') || countryLower.includes('nippon') || countryLower.includes('nihon')) {
    return 'Japan';
  }
  if (countryLower.includes('australia')) {
    return 'Australia';
  }
  if (countryLower.includes('new zealand') || countryLower.includes('aotearoa')) {
    return 'New Zealand';
  }
  if (countryLower.includes('south korea') || countryLower.includes('korea')) {
    return 'South Korea';
  }
  if (countryLower.includes('china')) {
    return 'China';
  }
  if (countryLower.includes('india')) {
    return 'India';
  }
  if (countryLower.includes('brazil') || countryLower.includes('brasil')) {
    return 'Brazil';
  }
  if (countryLower.includes('mexico') || countryLower.includes('méxico')) {
    return 'Mexico';
  }
  
  // Return the original country name with proper capitalization
  return countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase();
};

/**
 * Get predefined colors for countries
 */
const getCountryColor = (index: number): string => {
  const colors = [
    '#10B981', // Green
    '#3B82F6', // Blue
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#F97316', // Orange-red
    '#6366F1', // Indigo
    '#84CC16', // Lime
  ];
  return colors[index % colors.length];
};

/**
 * Generate country spending statistics from real transaction data
 */
export const generateCountrySpendingData = (transactions: FinanceTable[]): CountrySpending[] => {
  // Group transactions by country
  const countryMap = new Map<string, {
    totalAmount: number;
    transactionCount: number;
    transactions: FinanceTable[];
  }>();

  // Process each transaction
  transactions.forEach(transaction => {
    // Skip transactions without amount
    if (!transaction.amount_chf) return;
    
    // Get country name, default to Switzerland if empty
    const rawCountryName = transaction.acquirer_country_name || 'Switzerland';
    const countryName = normalizeCountryName(rawCountryName);
    
    // Debug logging for country detection
    if (rawCountryName !== 'Switzerland') {
      console.log(`🌍 Country detected: "${rawCountryName}" -> "${countryName}" (CHF ${transaction.amount_chf})`);
    }
    
    // Initialize country data if not exists
    if (!countryMap.has(countryName)) {
      countryMap.set(countryName, {
        totalAmount: 0,
        transactionCount: 0,
        transactions: [],
      });
    }
    
    const countryData = countryMap.get(countryName)!;
    countryData.totalAmount += Math.abs(transaction.amount_chf); // Use absolute value for spending
    countryData.transactionCount += 1;
    countryData.transactions.push(transaction);
  });

  // Calculate total spending across all countries
  const totalSpending = Array.from(countryMap.values())
    .reduce((sum, country) => sum + country.totalAmount, 0);

  // Convert to CountrySpending array and sort by amount
  const countrySpendingData: CountrySpending[] = Array.from(countryMap.entries())
    .map(([countryName, data], index) => {
      const percentage = totalSpending > 0 ? parseFloat(((data.totalAmount / totalSpending) * 100).toFixed(2)) : 0;
      
      return {
        country: countryName,
        flag: getCountryFlag(countryName),
        currency: 'CHF', // All amounts converted to CHF
        amount: data.totalAmount.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }),
        percentage,
        transactions: data.transactionCount,
        color: getCountryColor(index),
      };
    })
    .sort((a, b) => parseFloat(b.amount.replace(/,/g, '')) - parseFloat(a.amount.replace(/,/g, ''))) // Sort by amount descending
    .slice(0, 10); // Limit to top 10 countries

  // Recalculate percentages for top countries only
  const topCountriesTotal = countrySpendingData.reduce((sum, country) => 
    sum + parseFloat(country.amount.replace(/,/g, '')), 0);
  
  countrySpendingData.forEach(country => {
    const amount = parseFloat(country.amount.replace(/,/g, ''));
    country.percentage = topCountriesTotal > 0 ? parseFloat(((amount / topCountriesTotal) * 100).toFixed(2)) : 0;
  });

  // Debug summary
  console.log(`📊 Country Analytics Summary: ${countrySpendingData.length} countries, CHF ${topCountriesTotal.toFixed(2)} total`);
  countrySpendingData.forEach(country => {
    console.log(`  ${country.flag} ${country.country}: CHF ${country.amount} (${country.percentage}%, ${country.transactions} txns)`);
  });

  return countrySpendingData;
};

/**
 * Format amount for display
 */
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

/**
 * Get transactions for a specific country
 */
export const getTransactionsByCountry = (transactions: FinanceTable[], countryName: string): FinanceTable[] => {
  return transactions.filter(transaction => {
    const rawCountryName = transaction.acquirer_country_name || 'Switzerland';
    const normalizedCountry = normalizeCountryName(rawCountryName);
    return normalizedCountry === countryName;
  }).sort((a, b) => {
    // Sort by date descending (most recent first)
    const dateA = new Date(a.trx_date || 0);
    const dateB = new Date(b.trx_date || 0);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Get country statistics summary
 */
export const getCountryStatsSummary = (countryData: CountrySpending[]) => {
  const totalCountries = countryData.length;
  const totalTransactions = countryData.reduce((sum, country) => sum + country.transactions, 0);
  const totalAmount = countryData.reduce((sum, country) => 
    sum + parseFloat(country.amount.replace(/,/g, '')), 0);
  
  return {
    totalCountries,
    totalTransactions,
    totalAmount: formatAmount(totalAmount),
    topCountry: countryData[0] || null,
  };
};
