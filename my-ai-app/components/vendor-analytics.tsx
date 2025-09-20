import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { useTransactions } from "../contexts/TransactionContext";
import {
  analyzeVendorBalances,
  filterVendors,
  formatBalance,
  getBalanceColor,
  getVendorCategories,
  VendorBalance,
} from "../utils/vendor-analytics";

const { width } = Dimensions.get("window");

interface VendorAnalyticsProps {
  visible: boolean;
  onClose: () => void;
}

const VendorAnalytics: React.FC<VendorAnalyticsProps> = ({
  visible,
  onClose,
}) => {
  const { transactions, isLoading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [balanceType, setBalanceType] = useState<
    "all" | "positive" | "negative" | "zero"
  >("all");
  const [sortBy, setSortBy] = useState<
    "balance" | "spent" | "transactions" | "name" | "date"
  >("balance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedVendor, setSelectedVendor] = useState<VendorBalance | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  // Analyze vendor data
  const vendorAnalytics = useMemo(() => {
    if (!transactions.length) return null;
    return analyzeVendorBalances(transactions);
  }, [transactions]);

  // Get filtered vendors
  const filteredVendors = useMemo(() => {
    if (!vendorAnalytics) return [];

    return filterVendors(vendorAnalytics.vendors, {
      searchTerm,
      category: selectedCategory,
      balanceType,
      sortBy,
      sortOrder,
    });
  }, [
    vendorAnalytics,
    searchTerm,
    selectedCategory,
    balanceType,
    sortBy,
    sortOrder,
  ]);

  // Get available categories
  const categories = useMemo(() => {
    if (!vendorAnalytics) return [];
    return getVendorCategories(vendorAnalytics.vendors);
  }, [vendorAnalytics]);

  const renderSummaryCards = () => {
    if (!vendorAnalytics) return null;

    return (
      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={["#10B981", "#059669"]}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.summaryIcon}>
            <Ionicons name="people" size={24} color="white" />
          </View>
          <Text style={styles.summaryLabel}>Total Vendors</Text>
          <Text style={styles.summaryValue}>
            {vendorAnalytics.totalVendors}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={[
            getBalanceColor(vendorAnalytics.totalNetBalance),
            getBalanceColor(vendorAnalytics.totalNetBalance),
          ]}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.summaryIcon}>
            <Ionicons name="wallet" size={24} color="white" />
          </View>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={styles.summaryValue}>
            {formatBalance(vendorAnalytics.totalNetBalance)}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  const renderFilterBar = () => (
    <View style={styles.filterContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vendors..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9CA3AF"
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm("")}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="options" size={20} color="#6B7280" />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterOptions = () => {
    if (!showFilters) return null;

    return (
      <View style={styles.filterOptionsContainer}>
        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === "all" && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory("all")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === "all" && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category &&
                      styles.filterChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Balance Type Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Balance Type</Text>
          <View style={styles.filterRow}>
            {[
              { key: "all", label: "All", icon: "list" },
              { key: "positive", label: "They Owe", icon: "trending-up" },
              { key: "negative", label: "I Owe", icon: "trending-down" },
              { key: "zero", label: "Even", icon: "remove" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  balanceType === option.key && styles.filterOptionActive,
                ]}
                onPress={() => setBalanceType(option.key as any)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={balanceType === option.key ? "#10B981" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    balanceType === option.key && styles.filterOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort Options */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Sort By</Text>
          <View style={styles.filterRow}>
            {[
              { key: "balance", label: "Balance" },
              { key: "spent", label: "Spent" },
              { key: "transactions", label: "Count" },
              { key: "name", label: "Name" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionActive,
                ]}
                onPress={() => setSortBy(option.key as any)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <TouchableOpacity
                    onPress={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    <Ionicons
                      name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                      size={14}
                      color="#10B981"
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderVendorList = () => (
    <View style={styles.vendorListContainer}>
      <View style={styles.vendorListHeader}>
        <Text style={styles.vendorListTitle}>
          Vendors ({filteredVendors.length})
        </Text>
      </View>

      <ScrollView
        style={styles.vendorList}
        showsVerticalScrollIndicator={false}
      >
        {filteredVendors.map((vendor, index) => (
          <TouchableOpacity
            key={`${vendor.vendor}-${index}`}
            style={styles.vendorItem}
            onPress={() => setSelectedVendor(vendor)}
          >
            <View style={styles.vendorLeft}>
              <Text style={styles.vendorFlag}>{vendor.flag}</Text>
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName} numberOfLines={1}>
                  {vendor.vendor}
                </Text>
                <Text style={styles.vendorCategory}>{vendor.category}</Text>
              </View>
            </View>

            <View style={styles.vendorRight}>
              <Text
                style={[
                  styles.vendorBalance,
                  { color: getBalanceColor(vendor.netBalance) },
                ]}
              >
                {formatBalance(vendor.netBalance, vendor.currency)}
              </Text>
              <Text style={styles.vendorTransactions}>
                {vendor.transactionCount} transactions
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        ))}

        {filteredVendors.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No vendors found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderVendorDetail = () => {
    if (!selectedVendor) return null;

    return (
      <Modal
        visible={!!selectedVendor}
        animationType="none"
        presentationStyle="pageSheet"
        transparent={false}
      >
        <Animated.View
          entering={SlideInUp.duration(350).springify()}
          exiting={SlideOutDown.duration(250)}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalFlag}>{selectedVendor.flag}</Text>
              <View>
                <Text style={styles.modalTitle}>{selectedVendor.vendor}</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedVendor.category}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedVendor(null)}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Balance Summary */}
            <View style={styles.balanceSummary}>
              <View style={styles.balanceCard}>
                <Text style={styles.balanceCardLabel}>Net Balance</Text>
                <Text
                  style={[
                    styles.balanceCardValue,
                    { color: getBalanceColor(selectedVendor.netBalance) },
                  ]}
                >
                  {formatBalance(
                    selectedVendor.netBalance,
                    selectedVendor.currency
                  )}
                </Text>
              </View>

              <View style={styles.balanceDetails}>
                <View style={styles.balanceDetailItem}>
                  <Text style={styles.balanceDetailLabel}>Total Spent</Text>
                  <Text style={styles.balanceDetailValue}>
                    {selectedVendor.totalSpent.toFixed(2)}{" "}
                    {selectedVendor.currency}
                  </Text>
                </View>
                <View style={styles.balanceDetailItem}>
                  <Text style={styles.balanceDetailLabel}>Total Income</Text>
                  <Text style={styles.balanceDetailValue}>
                    {selectedVendor.totalIncome.toFixed(2)}{" "}
                    {selectedVendor.currency}
                  </Text>
                </View>
                <View style={styles.balanceDetailItem}>
                  <Text style={styles.balanceDetailLabel}>Transactions</Text>
                  <Text style={styles.balanceDetailValue}>
                    {selectedVendor.transactionCount}
                  </Text>
                </View>
              </View>
            </View>

            {/* Transaction History */}
            <View style={styles.transactionHistory}>
              <Text style={styles.transactionHistoryTitle}>
                Transaction History
              </Text>
              {selectedVendor.transactions.map((transaction, index) => (
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
                        size={16}
                        color={
                          transaction.type === "expense" ? "#EF4444" : "#10B981"
                        }
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDate}>
                        {transaction.date}
                      </Text>
                      <Text style={styles.transactionTime}>
                        {transaction.time}
                      </Text>
                    </View>
                  </View>
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
                    {transaction.type === "expense" ? "-" : "+"}
                    {transaction.amount} {transaction.currency}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="fullScreen"
      transparent={false}
    >
      <Animated.View
        entering={SlideInUp.duration(400).springify()}
        exiting={SlideOutDown.duration(300)}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["#F8FAFC", "#F0FDF4"]}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Vendor Analytics</Text>
              <Text style={styles.headerSubtitle}>
                Track balances with vendors
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading vendor data...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {renderSummaryCards()}
              {renderFilterBar()}
              {renderFilterOptions()}
              {renderVendorList()}
            </ScrollView>
          )}

          {renderVendorDetail()}
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  summaryContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
    fontWeight: "500",
  },
  filterOptionsContainer: {
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
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#10B981",
  },
  filterChipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "white",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterOptionActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  filterOptionText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "#10B981",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 4,
  },
  sortOptionActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  sortOptionText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  sortOptionTextActive: {
    color: "#10B981",
  },
  vendorListContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  vendorListHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  vendorListTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  vendorList: {
    maxHeight: 400,
  },
  vendorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  vendorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  vendorFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  vendorCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  vendorRight: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  vendorBalance: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  vendorTransactions: {
    fontSize: 12,
    color: "#6B7280",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  balanceSummary: {
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
  balanceCard: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  balanceCardLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  balanceCardValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceDetailItem: {
    alignItems: "center",
  },
  balanceDetailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  balanceDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  transactionHistory: {
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
  transactionHistoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    alignItems: "flex-start",
  },
  transactionDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default VendorAnalytics;
