import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchMoneyTable, FinanceTable } from "../utils/supabase";
import {
  DisplayTransaction,
  transformMoneyTableToDisplay,
} from "../utils/transaction-transform";

interface TransactionContextType {
  transactions: DisplayTransaction[];
  rawTransactions: FinanceTable[];
  isLoading: boolean;
  isDataLoaded: boolean;
  refreshTransactions: () => Promise<void>;
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
  const [rawTransactions, setRawTransactions] = useState<FinanceTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadMoneyTableData = async () => {
    setIsLoading(true);
    try {
      console.log("🚀 Loading money table data...");
      const moneyData = await fetchMoneyTable();
      console.log("✅ Money Table Data loaded:", moneyData.length, "records");

      if (moneyData.length > 0) {
        const transformedData = transformMoneyTableToDisplay(moneyData);
        setRawTransactions(moneyData);
        setTransactions(transformedData);
        setIsDataLoaded(true);
        console.log("📊 Transformed transactions:", transformedData.length);
      }
    } catch (error) {
      console.error("❌ Error loading money table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    await loadMoneyTableData();
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
