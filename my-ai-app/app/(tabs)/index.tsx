import SGKBLogo from "@/components/sgkb-logo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";
import VendorAnalytics from "../../components/vendor-analytics";
import { useTransactions } from "../../contexts/TransactionContext";

const { width } = Dimensions.get("window");

interface Goal {
  id: string;
  title: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  monthlySavings: number;
  priority: "high" | "medium" | "low";
  color: string;
}

const goals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    icon: "shield-checkmark",
    targetAmount: 10000,
    currentAmount: 8200,
    monthlySavings: 500,
    priority: "high",
    color: "#10B981",
  },
  {
    id: "2",
    title: "Vacation to Japan",
    icon: "airplane",
    targetAmount: 4500,
    currentAmount: 1900,
    monthlySavings: 700,
    priority: "medium",
    color: "#3B82F6",
  },
  {
    id: "3",
    title: "New MacBook Pro",
    icon: "laptop",
    targetAmount: 2300,
    currentAmount: 1100,
    monthlySavings: 350,
    priority: "low",
    color: "#8B5CF6",
  },
  {
    id: "4",
    title: "Home Renovation",
    icon: "home",
    targetAmount: 13500,
    currentAmount: 2900,
    monthlySavings: 1100,
    priority: "medium",
    color: "#F59E0B",
  },
];

export default function HomeScreen() {
  const { transactions, isDataLoaded } = useTransactions();
  const [showVendorAnalytics, setShowVendorAnalytics] = React.useState(false);

  const calculateGoalProgress = (goal: Goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsToComplete = Math.ceil(remaining / goal.monthlySavings);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsToComplete);

    return {
      percentage: Math.min(percentage, 100),
      remaining,
      monthsToComplete,
      completionDate: completionDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };
  };

  const handleGoalPress = (goal: Goal) => {
    // Navigate to goal detail screen
    router.push({
      pathname: "/goal-detail",
      params: { goalId: goal.id },
    });
  };

  return (
    <LinearGradient
      colors={["#F0FDF4", "#ECFDF5", "#FFFFFF"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Background pattern */}
      <View style={styles.bgPattern} pointerEvents="none">
        <LinearGradient
          colors={["rgba(16,185,129,0.18)", "rgba(16,185,129,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bgBlobTopRight}
        />
        <LinearGradient
          colors={["rgba(52,211,153,0.16)", "rgba(16,185,129,0)"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.bgBlobBottomLeft}
        />
      </View>
      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          entering={SlideInRight.duration(300).springify()}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>Nils</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <Animated.View
            style={styles.balanceSection}
            entering={FadeInUp.delay(100).duration(600).springify()}
          >
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>CHF 121,000</Text>
            <View style={styles.balanceSubtext}>
              <Text style={styles.balanceChange}>+2.4%</Text>
              <Text style={styles.balancePeriod}>from last month</Text>
            </View>
          </Animated.View>
          <View style={styles.sgkbSection}>
            <SGKBLogo size={16} />
            <Text style={styles.sgkbText}>St. Galler Kantonalbank</Text>
          </View>

          {/* Financial Overview */}
          <Animated.View
            style={styles.financialContainer}
            entering={FadeInUp.delay(200).duration(600).springify()}
          >
            <View style={styles.financialHeader}>
              <Text style={styles.financialTitle}>Financial Overview</Text>
              <Text style={styles.financialPeriod}>This Month</Text>
            </View>

            <View style={styles.financialGrid}>
              <View style={styles.financialCard}>
                <View style={styles.financialIconContainer}>
                  <Ionicons name="trending-up" size={20} color="#34D399" />
                </View>
                <View style={styles.financialContent}>
                  <Text style={styles.financialValue}>CHF 21,000</Text>
                  <Text style={styles.financialLabel}>Total Income</Text>
                  <Text style={styles.financialChange}>
                    +12.5% vs last month
                  </Text>
                </View>
              </View>

              <View style={styles.financialCard}>
                <View
                  style={[
                    styles.financialIconContainer,
                    { backgroundColor: "rgba(248, 113, 113, 0.2)" },
                  ]}
                >
                  <Ionicons name="trending-down" size={20} color="#F87171" />
                </View>
                <View style={styles.financialContent}>
                  <Text style={styles.financialValue}>CHF 11,000</Text>
                  <Text style={styles.financialLabel}>Total Expenses</Text>
                  <Text style={styles.financialChange}>
                    +8.2% vs last month
                  </Text>
                </View>
              </View>

              <View style={styles.financialCard}>
                <View
                  style={[
                    styles.financialIconContainer,
                    { backgroundColor: "rgba(59, 130, 246, 0.2)" },
                  ]}
                >
                  <Ionicons name="wallet" size={20} color="#3B82F6" />
                </View>
                <View style={styles.financialContent}>
                  <Text style={styles.financialValue}>CHF 10,000</Text>
                  <Text style={styles.financialLabel}>Net Savings</Text>
                  <Text style={styles.financialChange}>
                    +18.3% vs last month
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            style={styles.actionsSection}
            entering={FadeInUp.delay(300).duration(600).springify()}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Ionicons name="add" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Add Money</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Ionicons name="card" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => setShowVendorAnalytics(true)}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="people" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Vendors</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push("/analytics")}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="analytics" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Analytics</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View
            style={styles.transactionsSection}
            entering={FadeInUp.delay(400).duration(600).springify()}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity onPress={() => router.push("/history")}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {isDataLoaded && transactions.length > 0 ? (
                transactions.slice(0, 3).map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Ionicons
                        name={transaction.icon as any}
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionName}>
                        {transaction.merchant}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date}, {transaction.time}
                      </Text>
                    </View>
                    <Text
                      style={
                        transaction.type === "income"
                          ? styles.transactionAmountPositive
                          : styles.transactionAmount
                      }
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {transaction.amount}
                    </Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Ionicons name="storefront" size={20} color="#6B7280" />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionName}>
                        Loading transactions...
                      </Text>
                      <Text style={styles.transactionDate}>Please wait</Text>
                    </View>
                    <Text style={styles.transactionAmount}>-</Text>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Vendor Analytics Modal */}
      <VendorAnalytics
        visible={showVendorAnalytics}
        onClose={() => setShowVendorAnalytics(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgPattern: {
    ...(StyleSheet.absoluteFillObject as any),
    zIndex: 0,
  },
  bgBlobTopRight: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    right: -80,
    top: -60,
    transform: [{ rotate: "20deg" }],
  },
  bgBlobBottomLeft: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    left: -100,
    bottom: 140,
    transform: [{ rotate: "-15deg" }],
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  profileSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "400",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111827",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    marginHorizontal: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  balanceSubtext: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceChange: {
    fontSize: 14,
    color: "#34D399",
    fontWeight: "600",
    marginRight: 8,
  },
  balancePeriod: {
    fontSize: 14,
    color: "#6B7280",
  },
  sgkbSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  sgkbText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 8,
  },
  financialContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    marginHorizontal: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  financialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  financialTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  financialPeriod: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  financialGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  financialCard: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  financialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(52, 211, 153, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  financialContent: {
    alignItems: "center",
  },
  financialValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  financialLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },
  financialChange: {
    fontSize: 11,
    color: "#34D399",
    fontWeight: "600",
    textAlign: "center",
  },
  actionsSection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  actionLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  transactionsSection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  seeAllText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "500",
  },
  transactionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F87171",
  },
  transactionAmountPositive: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34D399",
  },
  goalsSection: {
    marginBottom: 32,
  },
  goalsScrollView: {
    marginTop: 16,
  },
  goalsContainer: {
    paddingLeft: 24,
    paddingRight: 0,
  },
  goalCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderLeftWidth: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  goalPriority: {
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  goalProgressContainer: {
    marginBottom: 16,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "right",
  },
  goalAmounts: {
    marginBottom: 16,
  },
  goalCurrentAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  goalTargetAmount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  goalTimeline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalTimelineItem: {
    flex: 1,
  },
  goalTimelineLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  goalTimelineValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
