import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTransactions } from "../../contexts/TransactionContext";

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

const transactions: Transaction[] = [
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
    currency: "DKK",
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
    currency: "EUR",
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
    currency: "HRK",
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
    currency: "EUR",
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
    currency: "NOK",
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
    currency: "CZK",
    flag: "🇨🇿",
    date: "Sep 26",
    time: "7:45 PM",
    type: "expense",
    icon: "restaurant",
  },
];

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { transactions, isLoading, isDataLoaded } = useTransactions();

  const filters = [
    "All",
    "Income",
    "Expenses",
    "Shopping",
    "Business Services",
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Transportation":
        return "#3B82F6";
      case "Food & Dining":
        return "#F59E0B";
      case "Groceries":
        return "#10B981";
      case "Shopping":
        return "#10B981";
      case "Business Services":
        return "#8B5CF6";
      case "Travel":
        return "#8B5CF6";
      case "Accommodation":
        return "#EF4444";
      case "Entertainment":
        return "#EC4899";
      case "Utilities":
        return "#6B7280";
      case "Income":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Income") return transaction.type === "income";
    if (selectedFilter === "Expenses") return transaction.type === "expense";
    return transaction.category === selectedFilter;
  });

  return (
    <LinearGradient
      colors={["#F8FAFC", "#F0FDF4"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Transaction History</Text>
            <Text style={styles.subtitle}>Your financial activity</Text>
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
            {!isDataLoaded ? (
              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Ionicons name="hourglass" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.merchantName}>
                      Loading transactions...
                    </Text>
                    <Text style={styles.transactionCategory}>Please wait</Text>
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
                <View key={transaction.id} style={styles.transactionItem}>
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
                      <Ionicons
                        name={transaction.icon as any}
                        size={20}
                        color={getCategoryColor(transaction.category)}
                      />
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
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
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
    paddingVertical: 20,
    paddingBottom: 24,
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
});
