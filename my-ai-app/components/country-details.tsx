import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import {
  formatAmount,
  getTransactionsByCountry,
} from "../utils/country-analytics";
import { FinanceTable } from "../utils/supabase";
import { transformMoneyTableToDisplay } from "../utils/transaction-transform";

interface CountryDetailsProps {
  visible: boolean;
  onClose: () => void;
  countryName: string;
  countryFlag: string;
  countryColor: string;
  rawTransactions: FinanceTable[];
}

const CountryDetails: React.FC<CountryDetailsProps> = ({
  visible,
  onClose,
  countryName,
  countryFlag,
  countryColor,
  rawTransactions,
}) => {
  // Get transactions for this country
  const countryTransactions = useMemo(() => {
    if (!visible || !countryName) return [];
    return getTransactionsByCountry(rawTransactions, countryName);
  }, [rawTransactions, countryName, visible]);

  // Transform to display format for easier rendering
  const displayTransactions = useMemo(() => {
    return transformMoneyTableToDisplay(countryTransactions);
  }, [countryTransactions]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = countryTransactions.reduce(
      (sum, txn) => sum + Math.abs(txn.amount_chf || 0),
      0
    );

    // Debug direction values
    const expenseTransactions = countryTransactions.filter(
      (txn) => txn.direction !== 1
    );
    const incomeTransactions = countryTransactions.filter(
      (txn) => txn.direction === 1
    );

    console.log(
      `💰 ${countryName} Stats: ${countryTransactions.length} total, ${expenseTransactions.length} expenses, ${incomeTransactions.length} income`
    );

    const totalExpenses = expenseTransactions.reduce(
      (sum, txn) => sum + Math.abs(txn.amount_chf || 0),
      0
    );
    const totalIncome = incomeTransactions.reduce(
      (sum, txn) => sum + Math.abs(txn.amount_chf || 0),
      0
    );

    return {
      totalAmount,
      totalExpenses,
      totalIncome,
      transactionCount: countryTransactions.length,
    };
  }, [countryTransactions]);

  const renderStatCard = (
    title: string,
    value: string,
    icon: string,
    color: string
  ) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="fullScreen"
      transparent={false}
    >
      <Animated.View
        entering={SlideInUp.duration(350).springify()}
        exiting={SlideOutDown.duration(250)}
        style={styles.container}
      >
        <LinearGradient
          colors={["#F8FAFC", "#F0FDF4"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.countryFlag}>{countryFlag}</Text>
              <View style={styles.headerText}>
                <Text style={styles.countryName}>{countryName}</Text>
                <Text style={styles.transactionCount}>
                  {stats.transactionCount} transactions
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Statistics Cards */}
            <View style={styles.statsContainer}>
              {renderStatCard(
                "Total Spending",
                `CHF ${formatAmount(stats.totalAmount)}`,
                "wallet",
                countryColor
              )}
              {renderStatCard(
                "Expenses",
                `CHF ${formatAmount(stats.totalExpenses)}`,
                "trending-down",
                "#EF4444"
              )}
              {renderStatCard(
                "Income",
                `CHF ${formatAmount(stats.totalIncome)}`,
                "trending-up",
                "#10B981"
              )}
            </View>

            {/* Transaction List */}
            <View style={styles.transactionsSection}>
              <Text style={styles.sectionTitle}>All Transactions</Text>

              {displayTransactions.length > 0 ? (
                <View style={styles.transactionsList}>
                  {displayTransactions.map((transaction, index) => (
                    <View
                      key={`${transaction.id}-${index}`}
                      style={styles.transactionItem}
                    >
                      <View style={styles.transactionLeft}>
                        <View
                          style={[
                            styles.transactionIcon,
                            {
                              backgroundColor:
                                transaction.type === "expense"
                                  ? "#FEE2E2"
                                  : "#D1FAE5",
                            },
                          ]}
                        >
                          <Ionicons
                            name={transaction.icon as any}
                            size={18}
                            color={
                              transaction.type === "expense"
                                ? "#EF4444"
                                : "#10B981"
                            }
                          />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={styles.merchantName} numberOfLines={1}>
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
                        <Text
                          style={[
                            styles.transactionAmount,
                            {
                              color:
                                transaction.type === "expense"
                                  ? "#EF4444"
                                  : "#10B981",
                            },
                          ]}
                        >
                          {transaction.type === "expense" ? "-" : "+"}CHF{" "}
                          {transaction.amount}
                        </Text>
                        <Text style={styles.transactionCurrency}>
                          {transaction.currency !== "CHF" &&
                            `(${transaction.currency})`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>
                    No transactions found
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    No transactions recorded for {countryName}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  countryFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  countryName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  transactionCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  transactionsSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  transactionsList: {
    maxHeight: 400,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionCurrency: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default CountryDetails;
