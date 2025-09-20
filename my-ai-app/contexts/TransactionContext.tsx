import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CACHE_KEYS, cacheService } from "../utils/cache-service";
import {
  fetchRecentTransactionDataRecords,
  TransactionData,
} from "../utils/supabase";
import {
  DisplayTransaction,
  transformTransactionDataToDisplay,
} from "../utils/transaction-transform";

interface TransactionContextType {
  transactions: DisplayTransaction[];
  rawTransactions: TransactionData[];
  isLoading: boolean;
  isDataLoaded: boolean;
  refreshTransactions: () => Promise<void>;
  clearCache: () => Promise<void>;
  getCacheInfo: () => Promise<any>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<DisplayTransaction[]>([]);
  const [rawTransactions, setRawTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadMoneyTableData = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    try {
      console.log("🚀 Loading transactions...");

      // Try to load from cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedRawData = await cacheService.get<TransactionData[]>(
          CACHE_KEYS.RAW_TRANSACTIONS
        );
        const cachedTransactions = await cacheService.get<DisplayTransaction[]>(
          CACHE_KEYS.TRANSACTIONS
        );

        if (cachedRawData && cachedTransactions) {
          console.log("📱 Using cached data:", cachedRawData.length, "records");
          setRawTransactions(cachedRawData);
          setTransactions(cachedTransactions);
          setIsDataLoaded(true);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API if no cache or force refresh
      console.log("🌐 Fetching from transaction_data table...");
      const transactionData = await fetchRecentTransactionDataRecords(500); // Increased limit for better caching
      console.log("✅ API data loaded:", transactionData.length, "records");

      if (transactionData.length > 0) {
        const transformedData =
          transformTransactionDataToDisplay(transactionData);

        // Update state
        setRawTransactions(transactionData);
        setTransactions(transformedData);
        setIsDataLoaded(true);

        // Cache the data
        await cacheService.set(CACHE_KEYS.RAW_TRANSACTIONS, transactionData);
        await cacheService.set(CACHE_KEYS.TRANSACTIONS, transformedData);

        console.log(
          "📊 Data cached and transformed:",
          transformedData.length,
          "transactions"
        );
      }
    } catch (error) {
      console.error("❌ Error loading transaction data:", error);

      // Try to fall back to cache on error
      try {
        const cachedRawData = await cacheService.get<TransactionData[]>(
          CACHE_KEYS.RAW_TRANSACTIONS
        );
        const cachedTransactions = await cacheService.get<DisplayTransaction[]>(
          CACHE_KEYS.TRANSACTIONS
        );

        if (cachedRawData && cachedTransactions) {
          console.log("🔄 Falling back to cached data");
          setRawTransactions(cachedRawData);
          setTransactions(cachedTransactions);
          setIsDataLoaded(true);
        }
      } catch (cacheError) {
        console.error("❌ Error loading cached data:", cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    await loadMoneyTableData(true); // Force refresh
  };

  const clearCache = async () => {
    await cacheService.clearAll();
    setTransactions([]);
    setRawTransactions([]);
    setIsDataLoaded(false);
    console.log("🧹 Cache cleared, reloading...");
    await loadMoneyTableData(true);
  };

  const getCacheInfo = async () => {
    return await cacheService.getCacheInfo();
  };

  useEffect(() => {
    loadMoneyTableData();
  }, []);

  const value: TransactionContextType = {
    transactions,
    rawTransactions,
    isLoading,
    isDataLoaded,
    refreshTransactions,
    clearCache,
    getCacheInfo,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
