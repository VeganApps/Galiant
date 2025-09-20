import { DisplayTransaction } from './transaction-transform';

export interface VendorBalance {
  vendor: string;
  totalSpent: number;
  totalIncome: number;
  netBalance: number; // negative = you owe, positive = they owe you
  transactionCount: number;
  currency: string;
  flag: string;
  category: string;
  lastTransactionDate: string;
  transactions: DisplayTransaction[];
}

export interface VendorAnalytics {
  vendors: VendorBalance[];
  totalVendors: number;
  topSpendingVendor: VendorBalance | null;
  largestBalance: VendorBalance | null;
  totalNetBalance: number;
}

/**
 * Analyze transactions and group by vendor/merchant
 */
export const analyzeVendorBalances = (transactions: DisplayTransaction[]): VendorAnalytics => {
  const vendorMap = new Map<string, VendorBalance>();

  // Group transactions by vendor
  transactions.forEach(transaction => {
    const vendorKey = transaction.merchant.toLowerCase().trim();
    const amount = parseFloat(transaction.amount);
    
    if (!vendorMap.has(vendorKey)) {
      vendorMap.set(vendorKey, {
        vendor: transaction.merchant,
        totalSpent: 0,
        totalIncome: 0,
        netBalance: 0,
        transactionCount: 0,
        currency: transaction.currency,
        flag: transaction.flag,
        category: transaction.category,
        lastTransactionDate: transaction.date,
        transactions: [],
      });
    }

    const vendorBalance = vendorMap.get(vendorKey)!;
    vendorBalance.transactionCount++;
    vendorBalance.transactions.push(transaction);
    
    // Update last transaction date (assuming transactions are sorted)
    if (new Date(transaction.date) > new Date(vendorBalance.lastTransactionDate)) {
      vendorBalance.lastTransactionDate = transaction.date;
    }

    if (transaction.type === 'expense') {
      vendorBalance.totalSpent += amount;
      vendorBalance.netBalance -= amount; // You spent money (negative balance)
    } else {
      vendorBalance.totalIncome += amount;
      vendorBalance.netBalance += amount; // You received money (positive balance)
    }
  });

  const vendors = Array.from(vendorMap.values())
    .sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance)); // Sort by absolute balance

  const totalNetBalance = vendors.reduce((sum, vendor) => sum + vendor.netBalance, 0);
  const topSpendingVendor = vendors.reduce((top, vendor) => 
    vendor.totalSpent > (top?.totalSpent || 0) ? vendor : top, null as VendorBalance | null);
  const largestBalance = vendors.reduce((largest, vendor) => 
    Math.abs(vendor.netBalance) > Math.abs(largest?.netBalance || 0) ? vendor : largest, null as VendorBalance | null);

  return {
    vendors,
    totalVendors: vendors.length,
    topSpendingVendor,
    largestBalance,
    totalNetBalance,
  };
};

/**
 * Filter vendors by various criteria
 */
export const filterVendors = (
  vendors: VendorBalance[],
  filters: {
    searchTerm?: string;
    category?: string;
    minBalance?: number;
    maxBalance?: number;
    balanceType?: 'all' | 'positive' | 'negative' | 'zero';
    sortBy?: 'balance' | 'spent' | 'transactions' | 'name' | 'date';
    sortOrder?: 'asc' | 'desc';
  }
): VendorBalance[] => {
  let filtered = [...vendors];

  // Search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(vendor =>
      vendor.vendor.toLowerCase().includes(searchLower) ||
      vendor.category.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(vendor => vendor.category === filters.category);
  }

  // Balance range filter
  if (filters.minBalance !== undefined) {
    filtered = filtered.filter(vendor => Math.abs(vendor.netBalance) >= filters.minBalance!);
  }
  if (filters.maxBalance !== undefined) {
    filtered = filtered.filter(vendor => Math.abs(vendor.netBalance) <= filters.maxBalance!);
  }

  // Balance type filter
  if (filters.balanceType && filters.balanceType !== 'all') {
    switch (filters.balanceType) {
      case 'positive':
        filtered = filtered.filter(vendor => vendor.netBalance > 0);
        break;
      case 'negative':
        filtered = filtered.filter(vendor => vendor.netBalance < 0);
        break;
      case 'zero':
        filtered = filtered.filter(vendor => vendor.netBalance === 0);
        break;
    }
  }

  // Sorting
  if (filters.sortBy) {
    const sortOrder = filters.sortOrder || 'desc';
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'balance':
          return (Math.abs(b.netBalance) - Math.abs(a.netBalance)) * multiplier;
        case 'spent':
          return (b.totalSpent - a.totalSpent) * multiplier;
        case 'transactions':
          return (b.transactionCount - a.transactionCount) * multiplier;
        case 'name':
          return a.vendor.localeCompare(b.vendor) * multiplier;
        case 'date':
          return (new Date(b.lastTransactionDate).getTime() - new Date(a.lastTransactionDate).getTime()) * multiplier;
        default:
          return 0;
      }
    });
  }

  return filtered;
};

/**
 * Get unique categories from vendor data
 */
export const getVendorCategories = (vendors: VendorBalance[]): string[] => {
  const categories = new Set<string>();
  vendors.forEach(vendor => categories.add(vendor.category));
  return Array.from(categories).sort();
};

/**
 * Format balance for display
 */
export const formatBalance = (balance: number, currency: string = 'CHF'): string => {
  const absBalance = Math.abs(balance);
  const formatted = absBalance.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  if (balance > 0) {
    return `+${formatted} ${currency}`; // They owe you
  } else if (balance < 0) {
    return `-${formatted} ${currency}`; // You owe them
  } else {
    return `${formatted} ${currency}`; // Even
  }
};

/**
 * Get balance color based on amount
 */
export const getBalanceColor = (balance: number): string => {
  if (balance > 0) return '#10B981'; // Green - positive balance
  if (balance < 0) return '#EF4444'; // Red - negative balance
  return '#6B7280'; // Gray - neutral/zero
};
