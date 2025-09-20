import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated";
import { useTransactions } from "../../contexts/TransactionContext";
import type { CSVExportParams } from "../../utils/csv-export";
import {
  downloadCSVFile,
  exportExpensesCSV,
  getDateRangePresets,
} from "../../utils/csv-export";
import { TransactionData } from "../../utils/supabase";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: string;
  currency: string;
  flag: string;
  date: string;
  time: string;
  type: "expense" | "income";
  icon: string;
}

const staticTransactionData: Transaction[] = [
  {
    id: "1",
    merchant: "Zürich Central Station",
    category: "Transportation",
    amount: "12.50",
    currency: "CHF",
    flag: "🇨🇭",
    date: "Today",
    time: "2:30 PM",
    type: "expense",
    icon: "train",
  },
  {
    id: "2",
    merchant: "Migros Supermarket",
    category: "Groceries",
    amount: "45.80",
    currency: "CHF",
    flag: "🇨🇭",
    date: "Today",
    time: "1:15 PM",
    type: "expense",
    icon: "storefront",
  },
  {
    id: "3",
    merchant: "Copenhagen Airport",
    category: "Travel",
    amount: "89.50",
    currency: "CHF",
    flag: "🇩🇰",
    date: "Yesterday",
    time: "6:45 AM",
    type: "expense",
    icon: "airplane",
  },
  {
    id: "4",
    merchant: "Starbucks Vienna",
    category: "Food & Dining",
    amount: "4.20",
    currency: "CHF",
    flag: "🇪🇺",
    date: "Yesterday",
    time: "3:20 PM",
    type: "expense",
    icon: "cafe",
  },
  {
    id: "5",
    merchant: "Dubrovnik Hotel",
    category: "Accommodation",
    amount: "120.00",
    currency: "CHF",
    flag: "🇭🇷",
    date: "Sep 28",
    time: "11:30 PM",
    type: "expense",
    icon: "bed",
  },
  {
    id: "6",
    merchant: "Salary Deposit",
    category: "Income",
    amount: "3,500.00",
    currency: "CHF",
    flag: "🇨🇭",
    date: "Sep 28",
    time: "9:00 AM",
    type: "income",
    icon: "card",
  },
  {
    id: "7",
    merchant: "Spotify Premium",
    category: "Entertainment",
    amount: "9.99",
    currency: "CHF",
    flag: "🇪🇺",
    date: "Sep 27",
    time: "2:00 PM",
    type: "expense",
    icon: "musical-notes",
  },
  {
    id: "8",
    merchant: "Oslo Metro",
    category: "Transportation",
    amount: "35.00",
    currency: "CHF",
    flag: "🇳🇴",
    date: "Sep 27",
    time: "8:15 AM",
    type: "expense",
    icon: "subway",
  },
  {
    id: "9",
    merchant: "Swisscom Mobile",
    category: "Utilities",
    amount: "25.00",
    currency: "CHF",
    flag: "🇨🇭",
    date: "Sep 26",
    time: "10:30 AM",
    type: "expense",
    icon: "phone-portrait",
  },
  {
    id: "10",
    merchant: "Prague Restaurant",
    category: "Food & Dining",
    amount: "18.50",
    currency: "CHF",
    flag: "🇨🇿",
    date: "Sep 26",
    time: "7:45 PM",
    type: "expense",
    icon: "restaurant",
  },
];

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { transactions, rawTransactions, isLoading, isDataLoaded } =
    useTransactions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);
  const [selectedDisplay, setSelectedDisplay] = useState<Transaction | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["financial", "transaction"])
  );
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("last30Days");
  const [selectedExportCategory, setSelectedExportCategory] = useState<
    string | undefined
  >(undefined);

  // Debug logging
  console.log("HistoryScreen render:", {
    isLoading,
    isDataLoaded,
    transactionsCount: transactions.length,
    rawTransactionsCount: rawTransactions.length,
  });

  const openTransactionDetails = (txn: Transaction) => {
    // Find the corresponding raw transaction data
    let raw = rawTransactions.find(
      (r) => (r.trx_id?.toString() || "") === txn.id
    );

    // If no raw transaction found (using static data), create a mock one for demonstration
    if (!raw) {
      raw = {
        trx_id: parseInt(txn.id),
        text_short_debitor: txn.merchant,
        text_debitor: txn.merchant,
        amount_chf: parseFloat(txn.amount),
        trx_date: new Date().toISOString(),
        category: txn.category,
        trx_curry_name: txn.currency,
        direction: txn.type === "income" ? 1 : 0,
        acquirer_country_name: txn.flag === "🇨🇭" ? "Switzerland" : "Unknown",
        // Add some demo fields to showcase the enhanced modal
        transaction_fee_chf: (parseFloat(txn.amount) * 0.02).toFixed(2),
        exchange_rate_used: 1.0,
        money_account_name: "Primary Account",
        trx_type_name: txn.type === "income" ? "Credit" : "Debit",
        point_of_sale_and_location: `${txn.merchant} Location`,
        cred_iban: "CH93 0076 2011 6238 5295 7",
        full_address: "Sample Address, Switzerland",
      } as TransactionData;
    }

    console.log("Opening transaction details:", {
      displayTransaction: txn,
      rawTransaction: raw,
      availableRawTransactions: rawTransactions.length,
      isUsingStaticData: !isDataLoaded || transactions.length === 0,
    });

    setSelectedTransaction(raw);
    setSelectedDisplay(txn);
    setIsModalVisible(true);
  };

  const closeTransactionDetails = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
    setSelectedDisplay(null);
    setExpandedSections(new Set(["financial", "transaction"]));
  };

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert("Copied", `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const handleCSVExport = async () => {
    try {
      setIsExporting(true);

      // Get date range based on selection
      const datePresets = getDateRangePresets();
      const dateRange =
        datePresets[selectedDateRange as keyof typeof datePresets];

      if (!dateRange) {
        Alert.alert("Error", "Invalid date range selected");
        return;
      }

      const exportParams: CSVExportParams = {
        start: dateRange.start,
        end: dateRange.end,
        category: selectedExportCategory || undefined,
      };

      console.log("Starting CSV export with params:", exportParams);

      const result = await exportExpensesCSV(exportParams);

      if (result.success && result.data) {
        // Handle the download based on platform
        try {
          downloadCSVFile(result.data, result.filename || "expenses.csv");
          Alert.alert(
            "Export Successful",
            `Your expenses data has been exported for ${dateRange.label}${
              selectedExportCategory ? ` (${selectedExportCategory})` : ""
            }`
          );
        } catch (downloadError) {
          // Fallback: copy to clipboard on mobile
          if (Platform.OS !== "web") {
            await Clipboard.setString(result.data);
            Alert.alert(
              "Export Complete",
              "CSV data has been copied to your clipboard since direct download is not available on mobile."
            );
          } else {
            throw downloadError;
          }
        }
      } else {
        Alert.alert("Export Failed", result.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("CSV export error:", error);
      Alert.alert(
        "Export Error",
        error instanceof Error ? error.message : "Failed to export data"
      );
    } finally {
      setIsExporting(false);
      setIsExportModalVisible(false);
    }
  };

  const openExportModal = () => {
    setIsExportModalVisible(true);
  };

  const getTransactionStatus = (transaction: TransactionData) => {
    const date = new Date(transaction.trx_date || transaction.val_date || "");
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1)
      return { status: "Processing", color: "#F59E0B", icon: "time-outline" };
    if (diffHours < 24)
      return {
        status: "Completed",
        color: "#10B981",
        icon: "checkmark-circle-outline",
      };
    return {
      status: "Settled",
      color: "#6B7280",
      icon: "shield-checkmark-outline",
    };
  };

  const getTransactionTypeColor = (transaction: TransactionData) => {
    const direction = transaction.direction;
    if (direction === 1) return "#10B981"; // Income - Green
    return "#EF4444"; // Expense - Red
  };

  const filters = [
    "All",
    "Income",
    "Expenses",
    "Food & Dining",
    "Shopping",
    "Transportation",
    "Business Services",
    "Entertainment",
    "Healthcare",
    "Travel",
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      // Food & Dining
      case "food & dining":
      case "restaurant":
      case "dining":
        return "#F59E0B"; // Orange

      // Groceries
      case "groceries":
      case "grocery":
        return "#10B981"; // Green

      // Transportation
      case "transportation":
      case "transport":
      case "transit":
        return "#3B82F6"; // Blue

      // Shopping
      case "shopping":
      case "retail":
        return "#8B5CF6"; // Purple

      // Entertainment
      case "entertainment":
      case "entertain":
        return "#EC4899"; // Pink

      // Bills & Utilities
      case "bills & utilities":
      case "bills":
      case "utilities":
      case "utility":
        return "#6B7280"; // Gray

      // Healthcare
      case "healthcare":
      case "health":
      case "medical":
        return "#EF4444"; // Red

      // Education
      case "education":
      case "school":
      case "learning":
        return "#06B6D4"; // Cyan

      // Travel
      case "travel":
      case "trip":
      case "vacation":
        return "#0EA5E9"; // Sky Blue

      // Business Services
      case "business services":
      case "business":
      case "professional":
        return "#6366F1"; // Indigo

      // Financial Services
      case "financial services":
      case "banking":
      case "finance":
        return "#059669"; // Emerald

      // Insurance
      case "insurance":
      case "coverage":
        return "#0891B2"; // Teal

      // Taxes
      case "taxes":
      case "tax":
        return "#DC2626"; // Red-600

      // Income
      case "income":
      case "salary":
      case "wage":
      case "earnings":
        return "#10B981"; // Green

      // Transfers
      case "transfers":
      case "transfer":
      case "move money":
        return "#7C3AED"; // Violet

      // ATM & Cash
      case "atm & cash":
      case "atm":
      case "cash":
      case "withdrawal":
        return "#F97316"; // Orange-500

      // Fees & Charges
      case "fees & charges":
      case "fees":
      case "charges":
      case "penalty":
        return "#EF4444"; // Red

      // Other
      case "other":
      case "miscellaneous":
      case "misc":
      default:
        return "#6B7280"; // Gray
    }
  };

  const getDetailIcon = (key: string) => {
    switch (key.toLowerCase()) {
      // Amount and financial fields
      case "amount_cent":
      case "amount_chf":
      case "total_amount_chf":
      case "total_amount_cent":
        return "cash-outline";
      case "transaction_fee_chf":
      case "transaction_fee_cent":
        return "receipt-outline";
      case "exchange_rate_used":
      case "transaction_exchange_rate":
        return "swap-horizontal-outline";

      // Date and time fields
      case "val_date":
      case "trx_date":
        return "calendar-outline";

      // Transaction identification
      case "trx_id":
      case "customer_id":
        return "barcode-outline";
      case "trx_type_id":
      case "trx_type_short":
      case "trx_type_name":
        return "layers-outline";
      case "buchungs_art_short":
      case "buchungs_art_name":
        return "document-outline";

      // Account and card information
      case "money_account_name":
      case "mac_curry_id":
      case "mac_curry_name":
      case "macc_type":
        return "card-outline";
      case "produkt":
      case "kunden_name":
        return "person-outline";
      case "card_id":
        return "card-outline";

      // Merchant and transaction details
      case "text_short_debitor":
      case "text_debitor":
      case "text_short_creditor":
      case "text_creditor":
        return "business-outline";
      case "point_of_sale_and_location":
        return "location-outline";
      case "acquirer_country_name":
      case "acquirer_country_code":
        return "flag-outline";

      // Creditor information
      case "cred_acc_text":
      case "cred_iban":
        return "card-outline";
      case "cred_addr_text":
      case "cred_addr_name":
      case "cred_addr_street":
      case "cred_addr_city":
      case "cred_addr_country":
      case "full_address":
        return "location-outline";
      case "cred_ref_nr":
      case "cred_info":
        return "document-text-outline";

      // Currency and conversion
      case "trx_curry_name":
        return "globe-outline";
      case "currency_conversion_info":
        return "calculator-outline";
      case "direction":
        return "arrow-forward-outline";

      // Location data
      case "latitude":
      case "longitude":
        return "navigate-outline";

      // Categorization
      case "category":
        return "pricetag-outline";
      case "icon_url":
      case "vendor_for_logo":
        return "image-outline";

      default:
        return "information-circle-outline";
    }
  };

  const formatFieldValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === "") return "";

    switch (key.toLowerCase()) {
      case "amount_cent":
      case "total_amount_cent":
        return `${(Number(value) / 100).toFixed(2)} CHF`;
      case "amount_chf":
      case "total_amount_chf":
        return `${Number(value).toFixed(2)} CHF`;
      case "transaction_fee_chf":
        return `${value} CHF`;
      case "transaction_fee_cent":
        return `${(Number(value) / 100).toFixed(2)} CHF`;
      case "exchange_rate_used":
      case "transaction_exchange_rate":
        return `${Number(value).toFixed(4)}`;
      case "val_date":
      case "trx_date":
        try {
          return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          return String(value);
        }
      case "direction":
        return Number(value) === 1 ? "Incoming" : "Outgoing";
      case "latitude":
      case "longitude":
        return `${Number(value).toFixed(6)}°`;
      case "cred_iban":
        // Format IBAN with spaces for readability
        return String(value)
          .replace(/(.{4})/g, "$1 ")
          .trim();
      default:
        return String(value);
    }
  };

  const getFieldDisplayName = (key: string): string => {
    const displayNames: { [key: string]: string } = {
      // Financial fields
      amount_cent: "Amount (Cents)",
      amount_chf: "Amount (CHF)",
      total_amount_chf: "Total Amount (CHF)",
      total_amount_cent: "Total Amount (Cents)",
      transaction_fee_chf: "Transaction Fee",
      transaction_fee_cent: "Transaction Fee (Cents)",
      exchange_rate_used: "Exchange Rate",
      transaction_exchange_rate: "Transaction Exchange Rate",
      currency_conversion_info: "Currency Conversion Info",

      // Account and product info
      money_account_name: "Account Name",
      mac_curry_id: "Account Currency ID",
      mac_curry_name: "Account Currency",
      macc_type: "Account Type",
      produkt: "Product",
      kunden_name: "Customer Name",

      // Transaction details
      trx_id: "Transaction ID",
      trx_type_id: "Transaction Type ID",
      trx_type_short: "Transaction Type",
      trx_type_name: "Transaction Type Name",
      buchungs_art_short: "Booking Type",
      buchungs_art_name: "Booking Type Name",
      val_date: "Value Date",
      trx_date: "Transaction Date",
      direction: "Direction",
      trx_curry_name: "Transaction Currency",

      // Merchant and location
      text_short_debitor: "Merchant (Short)",
      text_debitor: "Merchant",
      text_short_creditor: "Creditor (Short)",
      text_creditor: "Creditor",
      point_of_sale_and_location: "Point of Sale",
      acquirer_country_name: "Country",
      acquirer_country_code: "Country Code",

      // Card and payment
      card_id: "Card ID",
      customer_id: "Customer ID",

      // Creditor information
      cred_acc_text: "Creditor Account",
      cred_iban: "IBAN",
      cred_addr_text: "Creditor Address",
      cred_addr_name: "Creditor Name",
      cred_addr_street: "Street Address",
      cred_addr_city: "City",
      cred_addr_country: "Country",
      cred_ref_nr: "Reference Number",
      cred_info: "Additional Info",

      // Location
      latitude: "Latitude",
      longitude: "Longitude",
      full_address: "Full Address",

      // Categorization
      category: "Category",
      icon_url: "Icon URL",
      vendor_for_logo: "Vendor Logo",
    };

    return (
      displayNames[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  const organizeTransactionData = (transaction: TransactionData) => {
    const sections = {
      financial: {
        title: "Financial Details",
        icon: "cash-outline",
        fields: [
          "amount_chf",
          "amount_cent",
          "total_amount_chf",
          "total_amount_cent",
          "transaction_fee_chf",
          "transaction_fee_cent",
          "exchange_rate_used",
          "transaction_exchange_rate",
          "currency_conversion_info",
        ],
      },
      transaction: {
        title: "Transaction Info",
        icon: "document-text-outline",
        fields: [
          "trx_id",
          "trx_type_short",
          "trx_type_name",
          "buchungs_art_short",
          "buchungs_art_name",
          "val_date",
          "trx_date",
          "direction",
          "trx_curry_name",
        ],
      },
      merchant: {
        title: "Merchant & Location",
        icon: "business-outline",
        fields: [
          "text_short_debitor",
          "text_debitor",
          "text_short_creditor",
          "text_creditor",
          "point_of_sale_and_location",
          "acquirer_country_name",
          "acquirer_country_code",
        ],
      },
      account: {
        title: "Account & Card",
        icon: "card-outline",
        fields: [
          "money_account_name",
          "mac_curry_name",
          "macc_type",
          "produkt",
          "card_id",
          "customer_id",
          "kunden_name",
        ],
      },
      creditor: {
        title: "Creditor Information",
        icon: "person-outline",
        fields: [
          "cred_acc_text",
          "cred_iban",
          "cred_addr_name",
          "cred_addr_street",
          "cred_addr_city",
          "cred_addr_country",
          "cred_addr_text",
          "cred_ref_nr",
          "cred_info",
        ],
      },
      location: {
        title: "Location Data",
        icon: "location-outline",
        fields: ["latitude", "longitude", "full_address"],
      },
      categorization: {
        title: "Categorization",
        icon: "pricetag-outline",
        fields: ["category", "icon_url", "vendor_for_logo"],
      },
    };

    return Object.entries(sections)
      .map(([key, section]) => ({
        ...section,
        data: section.fields
          .map((field) => ({
            key: field,
            value: transaction[field as keyof TransactionData],
            displayName: getFieldDisplayName(field),
            formattedValue: formatFieldValue(
              field,
              transaction[field as keyof TransactionData]
            ),
            icon: getDetailIcon(field),
          }))
          .filter(
            (item) =>
              item.value !== undefined &&
              item.value !== null &&
              item.value !== ""
          ),
      }))
      .filter((section) => section.data.length > 0);
  };

  // Use real transactions from context, fallback to static data for demo
  const displayTransactions =
    isDataLoaded && transactions.length > 0
      ? transactions
      : staticTransactionData;

  const filteredTransactions = displayTransactions.filter((transaction) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Income") return transaction.type === "income";
    if (selectedFilter === "Expenses") return transaction.type === "expense";
    return transaction.category === selectedFilter;
  });

  console.log("Filtered transactions:", {
    displayTransactionsCount: displayTransactions.length,
    filteredCount: filteredTransactions.length,
    selectedFilter,
  });

  return (
    <LinearGradient
      colors={["#F8FAFC", "#F0FDF4"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          entering={SlideInUp.duration(300).springify()}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Transaction History</Text>
                <Text style={styles.subtitle}>Your financial activity</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={openExportModal}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={24} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transactions List */}
          <View style={styles.transactionsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: "#F3F4F6" },
                      ]}
                    >
                      <Ionicons name="sync" size={20} color="#10B981" />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.merchantName}>
                        Loading your transactions...
                      </Text>
                      <Text style={styles.transactionCategory}>
                        Fetching recent activity
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : !isDataLoaded ? (
              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Ionicons name="hourglass" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.merchantName}>Preparing data...</Text>
                    <Text style={styles.transactionCategory}>Almost ready</Text>
                  </View>
                </View>
              </View>
            ) : filteredTransactions.length === 0 ? (
              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name="receipt-outline"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.merchantName}>
                      No transactions found
                    </Text>
                    <Text style={styles.transactionCategory}>
                      Try a different filter
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <TouchableOpacity
                  key={transaction.id}
                  style={styles.transactionItem}
                  activeOpacity={0.8}
                  onPress={() => openTransactionDetails(transaction)}
                >
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        {
                          backgroundColor: `${getCategoryColor(
                            transaction.category
                          )}15`,
                        },
                      ]}
                    >
                      {/^https?:\/\//.test(transaction.icon) ||
                      transaction.icon.startsWith("data:") ? (
                        <Image
                          source={{ uri: transaction.icon }}
                          style={styles.transactionImage}
                        />
                      ) : (
                        <Ionicons
                          name={transaction.icon as any}
                          size={20}
                          color={getCategoryColor(transaction.category)}
                        />
                      )}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.merchantName}>
                        {transaction.merchant}
                      </Text>
                      <Text style={styles.transactionCategory}>
                        {transaction.category}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date} • {transaction.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <View style={styles.amountContainer}>
                      <Text style={styles.flag}>{transaction.flag}</Text>
                      <Text
                        style={[
                          styles.amount,
                          transaction.type === "income"
                            ? styles.amountPositive
                            : styles.amountNegative,
                        ]}
                      >
                        {transaction.type === "expense" ? "-" : "+"}
                        {transaction.amount}
                      </Text>
                      <Text style={styles.currency}>
                        {transaction.currency}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
      {/* Enhanced Transaction Details Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeTransactionDetails}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={styles.modalContainer}
            entering={SlideInUp.duration(500).springify()}
          >
            {/* Enhanced Header with Dynamic Gradient */}
            <LinearGradient
              colors={
                selectedTransaction
                  ? [getTransactionTypeColor(selectedTransaction), "#059669"]
                  : ["#10B981", "#059669"]
              }
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalTitleContainer}>
                  <Animated.View
                    style={styles.modalIconContainer}
                    entering={BounceIn.delay(200)}
                  >
                    {selectedDisplay &&
                      (/^https?:\/\//.test(selectedDisplay.icon) ||
                      selectedDisplay.icon.startsWith("data:") ? (
                        <Image
                          source={{ uri: selectedDisplay.icon }}
                          style={styles.modalTransactionImage}
                        />
                      ) : (
                        <Ionicons
                          name={selectedDisplay.icon as any}
                          size={28}
                          color="white"
                        />
                      ))}
                  </Animated.View>
                  <View style={styles.modalTitleTextContainer}>
                    <Text style={styles.modalTitle} numberOfLines={1}>
                      {selectedTransaction?.text_short_debitor ||
                        selectedTransaction?.text_debitor ||
                        selectedTransaction?.text_short_creditor ||
                        selectedTransaction?.text_creditor ||
                        selectedDisplay?.merchant ||
                        "Transaction Details"}
                    </Text>
                    <View style={styles.modalSubtitleRow}>
                      <Text style={styles.modalSubtitle}>
                        {selectedDisplay?.category || "Transaction"}
                      </Text>
                      {selectedTransaction && (
                        <View style={styles.modalStatusBadge}>
                          <Ionicons
                            name={
                              getTransactionStatus(selectedTransaction)
                                .icon as any
                            }
                            size={12}
                            color="white"
                          />
                          <Text style={styles.modalStatusText}>
                            {getTransactionStatus(selectedTransaction).status}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={closeTransactionDetails}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Enhanced Amount Display with Cards */}
            {selectedDisplay && selectedTransaction && (
              <Animated.View
                style={styles.modalAmountSection}
                entering={FadeInDown.delay(300)}
              >
                <View style={styles.modalAmountCard}>
                  <View style={styles.modalAmountContainer}>
                    <Text style={styles.modalAmountLabel}>
                      Transaction Amount
                    </Text>
                    <View style={styles.modalAmountRow}>
                      <Text style={styles.modalFlag}>
                        {selectedDisplay.flag}
                      </Text>
                      <Text
                        style={[
                          styles.modalAmount,
                          selectedDisplay.type === "income"
                            ? styles.modalAmountPositive
                            : styles.modalAmountNegative,
                        ]}
                      >
                        {selectedDisplay.type === "expense" ? "-" : "+"}
                        {selectedDisplay.amount}
                      </Text>
                      <Text style={styles.modalCurrency}>
                        {selectedDisplay.currency}
                      </Text>
                    </View>
                    <Text style={styles.modalDate}>
                      {selectedDisplay.date} • {selectedDisplay.time}
                    </Text>
                  </View>

                  {/* Additional Financial Info */}
                  <View style={styles.modalFinancialSummary}>
                    {selectedTransaction.transaction_fee_chf && (
                      <View style={styles.modalFeeInfo}>
                        <Text style={styles.modalFeeLabel}>
                          Transaction Fee
                        </Text>
                        <Text style={styles.modalFeeAmount}>
                          {selectedTransaction.transaction_fee_chf} CHF
                        </Text>
                      </View>
                    )}
                    {selectedTransaction.exchange_rate_used &&
                      selectedTransaction.exchange_rate_used !== 1.0 && (
                        <View style={styles.modalExchangeInfo}>
                          <Text style={styles.modalExchangeLabel}>
                            Exchange Rate
                          </Text>
                          <Text style={styles.modalExchangeAmount}>
                            {selectedTransaction.exchange_rate_used}
                          </Text>
                        </View>
                      )}
                  </View>
                </View>
              </Animated.View>
            )}

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Enhanced Organized Transaction Details Sections */}
              {selectedTransaction &&
                organizeTransactionData(selectedTransaction).map(
                  (section, sectionIndex) => {
                    const sectionKey =
                      Object.keys({
                        financial: "financial",
                        transaction: "transaction",
                        merchant: "merchant",
                        account: "account",
                        creditor: "creditor",
                        location: "location",
                        categorization: "categorization",
                      }).find((key) =>
                        section.title.includes(
                          key
                            .split("")
                            .map((c, i) => (i === 0 ? c.toUpperCase() : c))
                            .join("")
                        )
                      ) || section.title.toLowerCase().replace(/\s+/g, "");

                    const isExpanded = expandedSections.has(sectionKey);

                    return (
                      <Animated.View
                        key={section.title}
                        style={styles.modalSection}
                        entering={FadeIn.delay(400 + sectionIndex * 100)}
                      >
                        <TouchableOpacity
                          style={styles.modalSectionHeader}
                          onPress={() => toggleSection(sectionKey)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.modalSectionHeaderLeft}>
                            <View style={styles.modalSectionIconContainer}>
                              <Ionicons
                                name={section.icon as any}
                                size={20}
                                color="#10B981"
                              />
                            </View>
                            <Text style={styles.modalSectionTitle}>
                              {section.title}
                            </Text>
                            <View style={styles.modalSectionBadge}>
                              <Text style={styles.modalSectionBadgeText}>
                                {section.data.length}
                              </Text>
                            </View>
                          </View>
                          <Animated.View
                            style={[
                              styles.modalSectionChevron,
                              isExpanded && styles.modalSectionChevronExpanded,
                            ]}
                          >
                            <Ionicons
                              name="chevron-down"
                              size={20}
                              color="#6B7280"
                            />
                          </Animated.View>
                        </TouchableOpacity>

                        {isExpanded && (
                          <Animated.View
                            entering={FadeIn.duration(300)}
                            style={styles.modalSectionContent}
                          >
                            {section.data.map((item, itemIndex) => (
                              <Animated.View
                                key={item.key}
                                style={styles.detailRow}
                                entering={FadeInDown.delay(itemIndex * 50)}
                              >
                                <View style={styles.detailLeft}>
                                  <View style={styles.detailIconContainer}>
                                    <Ionicons
                                      name={item.icon as any}
                                      size={16}
                                      color="#10B981"
                                    />
                                  </View>
                                  <Text style={styles.detailKey}>
                                    {item.displayName}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() =>
                                    copyToClipboard(
                                      item.formattedValue,
                                      item.displayName
                                    )
                                  }
                                  style={styles.detailValueContainer}
                                  activeOpacity={0.7}
                                >
                                  <Text
                                    style={[
                                      styles.detailValue,
                                      // Special styling for amounts
                                      (item.key.includes("amount") ||
                                        item.key.includes("fee")) &&
                                        styles.detailValueAmount,
                                      // Special styling for IBAN
                                      item.key === "cred_iban" &&
                                        styles.detailValueMono,
                                    ]}
                                  >
                                    {item.formattedValue}
                                  </Text>
                                  <Ionicons
                                    name="copy-outline"
                                    size={14}
                                    color="#9CA3AF"
                                    style={styles.copyIcon}
                                  />
                                </TouchableOpacity>
                              </Animated.View>
                            ))}

                            {/* Special Actions for Location Data */}
                            {section.title === "Location Data" &&
                              selectedTransaction?.latitude &&
                              selectedTransaction?.longitude && (
                                <Animated.View
                                  entering={FadeIn.delay(200)}
                                  style={styles.modalLocationActions}
                                >
                                  <TouchableOpacity
                                    style={styles.mapLinkButton}
                                    onPress={() => {
                                      const url = `https://maps.google.com/?q=${selectedTransaction.latitude},${selectedTransaction.longitude}`;
                                      console.log("Opening map:", url);
                                      Alert.alert(
                                        "Map Link",
                                        `Would open: ${url}`
                                      );
                                    }}
                                  >
                                    <Ionicons
                                      name="map"
                                      size={16}
                                      color="#10B981"
                                    />
                                    <Text style={styles.mapLinkText}>
                                      View on Map
                                    </Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    style={styles.copyLocationButton}
                                    onPress={() =>
                                      copyToClipboard(
                                        `${selectedTransaction.latitude}, ${selectedTransaction.longitude}`,
                                        "Coordinates"
                                      )
                                    }
                                  >
                                    <Ionicons
                                      name="location"
                                      size={16}
                                      color="#6B7280"
                                    />
                                    <Text style={styles.copyLocationText}>
                                      Copy Coordinates
                                    </Text>
                                  </TouchableOpacity>
                                </Animated.View>
                              )}

                            {/* Special Actions for Financial Data */}
                            {section.title === "Financial Details" && (
                              <Animated.View
                                entering={FadeIn.delay(200)}
                                style={styles.modalFinancialActions}
                              >
                                {selectedTransaction.trx_id && (
                                  <TouchableOpacity
                                    style={styles.transactionIdButton}
                                    onPress={() =>
                                      copyToClipboard(
                                        selectedTransaction.trx_id.toString(),
                                        "Transaction ID"
                                      )
                                    }
                                  >
                                    <Ionicons
                                      name="barcode"
                                      size={16}
                                      color="#10B981"
                                    />
                                    <Text style={styles.transactionIdText}>
                                      Copy Transaction ID
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </Animated.View>
                            )}
                          </Animated.View>
                        )}
                      </Animated.View>
                    );
                  }
                )}

              {/* Enhanced Action Buttons */}
              <Animated.View
                style={styles.modalActions}
                entering={FadeInUp.delay(600)}
              >
                <View style={styles.modalActionButtonsRow}>
                  <TouchableOpacity
                    style={styles.modalSecondaryButton}
                    onPress={closeTransactionDetails}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="#6B7280"
                    />
                    <Text style={styles.modalSecondaryText}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={closeTransactionDetails}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.modalPrimaryText}>Got it</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* CSV Export Modal */}
      <Modal
        visible={isExportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={styles.exportModalContainer}
            entering={SlideInUp.duration(500).springify()}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.exportModalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.exportModalHeaderContent}>
                <View style={styles.exportModalTitleContainer}>
                  <View style={styles.exportModalIconContainer}>
                    <Ionicons name="download-outline" size={28} color="white" />
                  </View>
                  <View>
                    <Text style={styles.exportModalTitle}>
                      Export Transactions
                    </Text>
                    <Text style={styles.exportModalSubtitle}>
                      Download CSV data
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setIsExportModalVisible(false)}
                  style={styles.exportModalCloseButton}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView
              style={styles.exportModalContent}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Date Range Selection */}
              <View style={styles.exportSection}>
                <Text style={styles.exportSectionTitle}>Date Range</Text>
                {Object.entries(getDateRangePresets()).map(
                  ([key, preset]: [string, any]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.dateRangeOption,
                        selectedDateRange === key &&
                          styles.dateRangeOptionSelected,
                      ]}
                      onPress={() => setSelectedDateRange(key)}
                    >
                      <View style={styles.dateRangeLeft}>
                        <View
                          style={[
                            styles.radioButton,
                            selectedDateRange === key &&
                              styles.radioButtonSelected,
                          ]}
                        >
                          {selectedDateRange === key && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="white"
                            />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.dateRangeLabel,
                            selectedDateRange === key &&
                              styles.dateRangeLabelSelected,
                          ]}
                        >
                          {preset.label}
                        </Text>
                      </View>
                      <Text style={styles.dateRangeText}>
                        {preset.start} to {preset.end}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              {/* Category Filter */}
              <View style={styles.exportSection}>
                <Text style={styles.exportSectionTitle}>
                  Category Filter (Optional)
                </Text>
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    selectedExportCategory === undefined &&
                      styles.categoryOptionSelected,
                  ]}
                  onPress={() => setSelectedExportCategory(undefined)}
                >
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedExportCategory === undefined &&
                          styles.radioButtonSelected,
                      ]}
                    >
                      {selectedExportCategory === undefined && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.categoryLabel,
                        selectedExportCategory === undefined &&
                          styles.categoryLabelSelected,
                      ]}
                    >
                      All Categories
                    </Text>
                  </View>
                </TouchableOpacity>

                {filters
                  .filter(
                    (f) => f !== "All" && f !== "Income" && f !== "Expenses"
                  )
                  .map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        selectedExportCategory === category &&
                          styles.categoryOptionSelected,
                      ]}
                      onPress={() => setSelectedExportCategory(category)}
                    >
                      <View style={styles.categoryLeft}>
                        <View
                          style={[
                            styles.radioButton,
                            selectedExportCategory === category &&
                              styles.radioButtonSelected,
                          ]}
                        >
                          {selectedExportCategory === category && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="white"
                            />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.categoryLabel,
                            selectedExportCategory === category &&
                              styles.categoryLabelSelected,
                          ]}
                        >
                          {category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>

            {/* Export Actions */}
            <View style={styles.exportModalActions}>
              <TouchableOpacity
                style={styles.exportCancelButton}
                onPress={() => setIsExportModalVisible(false)}
              >
                <Text style={styles.exportCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.exportConfirmButton,
                  isExporting && styles.exportConfirmButtonDisabled,
                ]}
                onPress={handleCSVExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Ionicons name="sync" size={20} color="white" />
                    <Text style={styles.exportConfirmText}>Exporting...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="download" size={20} color="white" />
                    <Text style={styles.exportConfirmText}>Export CSV</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  downloadButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersContent: {
    paddingRight: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "white",
  },
  transactionsContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionImage: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  amountPositive: {
    color: "#10B981",
  },
  amountNegative: {
    color: "#EF4444",
  },
  currency: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  loadingContainer: {
    opacity: 0.7,
  },
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    maxHeight: "95%",
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHeader: {
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalTransactionImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  modalTitleTextContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    marginBottom: 6,
  },
  modalSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    flex: 1,
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  modalStatusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalAmountSection: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalAmountCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  modalAmountContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalAmountLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  modalAmount: {
    fontSize: 36,
    fontWeight: "800",
    marginRight: 8,
  },
  modalAmountPositive: {
    color: "#10B981",
  },
  modalAmountNegative: {
    color: "#EF4444",
  },
  modalCurrency: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "700",
  },
  modalDate: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  modalFinancialSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  modalFeeInfo: {
    alignItems: "center",
  },
  modalFeeLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  modalFeeAmount: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "700",
  },
  modalExchangeInfo: {
    alignItems: "center",
  },
  modalExchangeLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  modalExchangeAmount: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "700",
  },
  modalContent: {
    flex: 1,
    paddingTop: 8,
  },
  modalSection: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  modalSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8FAFC",
  },
  modalSectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalSectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  modalSectionBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  modalSectionBadgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
  },
  modalSectionChevron: {
    marginLeft: 12,
  },
  modalSectionChevronExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  modalSectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailKey: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    flex: 1,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
    marginRight: 6,
  },
  detailValueAmount: {
    color: "#10B981",
  },
  detailValueMono: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 12,
  },
  copyIcon: {
    opacity: 0.6,
  },
  modalLocationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  mapLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  mapLinkText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "700",
    marginLeft: 8,
  },
  copyLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
  },
  copyLocationText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginLeft: 8,
  },
  modalFinancialActions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  transactionIdButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  transactionIdText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "700",
    marginLeft: 8,
  },
  modalActions: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
    backgroundColor: "#F8FAFC",
  },
  modalActionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modalSecondaryText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  // Export Modal Styles
  exportModalContainer: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  exportModalHeader: {
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  exportModalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exportModalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  exportModalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  exportModalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  exportModalSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  exportModalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  exportModalContent: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  exportSection: {
    marginBottom: 32,
  },
  exportSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  dateRangeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  dateRangeOptionSelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#10B981",
  },
  dateRangeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "white",
  },
  radioButtonSelected: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  dateRangeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  dateRangeLabelSelected: {
    color: "#10B981",
  },
  dateRangeText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryOptionSelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#10B981",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  categoryLabelSelected: {
    color: "#10B981",
  },
  exportModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
    backgroundColor: "#F8FAFC",
    gap: 12,
  },
  exportCancelButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  exportCancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "700",
  },
  exportConfirmButton: {
    flex: 2,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exportConfirmButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  exportConfirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
