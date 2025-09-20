import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

// Platform-specific storage configuration
const getStorage = () => {
  // Check if we're in a web environment
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    // Web platform - use localStorage
    return {
      getItem: (key: string) => {
        try {
          const item = localStorage.getItem(key);
          return Promise.resolve(item);
        } catch (error) {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          // Ignore storage errors
        }
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          // Ignore storage errors
        }
        return Promise.resolve();
      },
    };
  } else {
    // React Native platform - use AsyncStorage with dynamic import
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage;
    } catch (error) {
      // Fallback to no-op storage if AsyncStorage is not available
      return {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
      };
    }
  }
};

// Create Supabase client with conditional auth configuration
const createSupabaseClient = () => {
  const storage = getStorage();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: storage,
      autoRefreshToken: true,
      persistSession: typeof window !== 'undefined', // Only persist session on web
      detectSessionInUrl: false,
    },
  });
};

export const supabase = createSupabaseClient();

// Type definitions for your tables
export interface Finances {
  id: number;
  created_at: string;
}

export interface FinanceTable {
  id: number;
  money_account_name?: string;
  mac_curry_id?: string;
  mac_curry_name?: string;
  macc_type?: string;
  produkt?: string;
  kunden_name?: string;
  trx_id?: number;
  trx_type_id?: string;
  trx_type_short?: string;
  trx_type_name?: string;
  buchungs_art_short?: string;
  buchungs_art_name?: string;
  val_date?: string;
  trx_date?: string;
  direction?: number;
  trx_curry_name?: string;
  text_short_creditor?: string;
  text_creditor?: string;
  text_short_debitor?: string;
  text_debitor?: string;
  point_of_sale_and_location?: string;
  acquirer_country_name?: string;
  card_id?: string;
  cred_acc_text?: string;
  cred_iban?: string;
  cred_addr_text?: string;
  cred_ref_nr?: string;
  cred_info?: string;
  customer_id?: string;
  amount_cent?: number;
  transaction_exchange_rate?: number;
  transaction_fee_chf?: string;
  transaction_fee_cent?: string;
  amount_chf?: number;
  total_amount_chf?: number;
  total_amount_cent?: number;
  exchange_rate_used?: number;
  currency_conversion_info?: string;
  acquirer_country_code?: string;
  cred_addr_name?: string;
  cred_addr_street?: string;
  cred_addr_city?: string;
  cred_addr_country?: string;
  latitude?: string;
  longitude?: string;
  full_address?: string;
  category?: string;
}

export interface TransactionNormalized {
  money_account_name?: string;
  mac_curry_id?: string;
  mac_curry_name?: string;
  macc_type?: string;
  produkt?: string;
  kunden_name?: string;
  trx_id: number;
  trx_type_id?: string;
  trx_type_short?: string;
  trx_type_name?: string;
  buchungs_art_short?: string;
  buchungs_art_name?: string;
  val_date?: string;
  trx_date?: string;
  direction?: number;
  trx_curry_name?: string;
  text_short_creditor?: string;
  text_creditor?: string;
  text_short_debitor?: string;
  text_debitor?: string;
  point_of_sale_and_location?: string;
  acquirer_country_name?: string;
  card_id?: string;
  cred_acc_text?: string;
  cred_iban?: string;
  cred_addr_text?: string;
  cred_ref_nr?: string;
  cred_info?: string;
  customer_id?: string;
  amount_cent?: number;
  transaction_exchange_rate?: number;
  transaction_fee_chf?: string;
  transaction_fee_cent?: string;
  amount_chf?: number;
  total_amount_chf?: number;
  total_amount_cent?: number;
  exchange_rate_used?: number;
  currency_conversion_info?: string;
  acquirer_country_code?: string;
  cred_addr_name?: string;
  cred_addr_street?: string;
  cred_addr_city?: string;
  cred_addr_country?: string;
  latitude?: string;
  longitude?: string;
  full_address?: string;
  category?: string;
}

// Generic data fetching utilities
export class SupabaseDataService {
  /**
   * Fetch all records from a table
   */
  static async fetchAll<T>(tableName: string): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Fetch a single record by ID
   */
  static async fetchById<T>(tableName: string, id: string | number): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${tableName} with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch records with custom query
   */
  static async fetchWithQuery<T>(
    tableName: string, 
    query: (query: any) => any
  ): Promise<T[]> {
    try {
      const { data, error } = await query(supabase.from(tableName));
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching from ${tableName} with custom query:`, error);
      throw error;
    }
  }

  /**
   * Insert a new record
   */
  static async insert<T>(tableName: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update a record by ID
   */
  static async update<T>(tableName: string, id: string | number, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${tableName} with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record by ID
   */
  static async delete(tableName: string, id: string | number): Promise<void> {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting from ${tableName} with id ${id}:`, error);
      throw error;
    }
  }
}

// Specific functions for your finance tables

// Finances table functions
export const fetchFinances = () => SupabaseDataService.fetchAll<Finances>('Finances');
export const fetchFinanceById = (id: number) => SupabaseDataService.fetchById<Finances>('Finances', id);

// Finance_table functions
export const fetchFinanceTable = () => SupabaseDataService.fetchAll<FinanceTable>('finance_table');
export const fetchFinanceTableById = (id: number) => SupabaseDataService.fetchById<FinanceTable>('finance_table', id);
export const createFinanceTableRecord = (data: Partial<FinanceTable>) => SupabaseDataService.insert('finance_table', data);
export const updateFinanceTableRecord = (id: number, data: Partial<FinanceTable>) => SupabaseDataService.update('finance_table', id, data);
export const deleteFinanceTableRecord = (id: number) => SupabaseDataService.delete('finance_table', id);

// Transaction_normalized functions
export const fetchTransactionNormalized = () => SupabaseDataService.fetchAll<TransactionNormalized>('transaction_normalized');
export const fetchTransactionNormalizedById = (trx_id: number) => 
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) => 
    query.select('*').eq('trx_id', trx_id).single()
  );
export const createTransactionNormalizedRecord = (data: Partial<TransactionNormalized>) => SupabaseDataService.insert('transaction_normalized', data);
export const updateTransactionNormalizedRecord = (trx_id: number, data: Partial<TransactionNormalized>) => 
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) => 
    query.update(data).eq('trx_id', trx_id).select().single()
  );
export const deleteTransactionNormalizedRecord = (trx_id: number) => 
  SupabaseDataService.fetchWithQuery<void>('transaction_normalized', (query) => 
    query.delete().eq('trx_id', trx_id)
  );

// Advanced query functions for common use cases

// Fetch transactions by date range
export const fetchTransactionsByDateRange = (startDate: string, endDate: string) =>
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) =>
    query
      .select('*')
      .gte('trx_date', startDate)
      .lte('trx_date', endDate)
      .order('trx_date', { ascending: false })
  );

// Fetch transactions by category
export const fetchTransactionsByCategory = (category: string) =>
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) =>
    query
      .select('*')
      .eq('category', category)
      .order('trx_date', { ascending: false })
  );

// Fetch transactions by amount range
export const fetchTransactionsByAmountRange = (minAmount: number, maxAmount: number) =>
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) =>
    query
      .select('*')
      .gte('amount_chf', minAmount)
      .lte('amount_chf', maxAmount)
      .order('amount_chf', { ascending: false })
  );

// Fetch transactions by direction (income/expense)
export const fetchTransactionsByDirection = (direction: number) =>
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) =>
    query
      .select('*')
      .eq('direction', direction)
      .order('trx_date', { ascending: false })
  );

// Fetch recent transactions (last N records)
export const fetchRecentTransactions = (limit: number = 50) =>
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) =>
    query
      .select('*')
      .order('trx_date', { ascending: false })
      .limit(limit)
  );

// Fetch transactions by customer
export const fetchTransactionsByCustomer = (customerId: string) =>
  SupabaseDataService.fetchWithQuery<TransactionNormalized>('transaction_normalized', (query) =>
    query
      .select('*')
      .eq('customer_id', customerId)
      .order('trx_date', { ascending: false })
  );
