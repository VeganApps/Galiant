import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
<<<<<<< HEAD
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchFinanceTable,
  fetchTransactionNormalized,
} from "../../utils/supabase";
=======
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SGKBLogo from '@/components/sgkb-logo';
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5

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
    targetAmount: 5000,
    currentAmount: 2100,
    monthlySavings: 800,
    priority: "medium",
    color: "#3B82F6",
  },
  {
    id: "3",
    title: "New MacBook Pro",
    icon: "laptop",
    targetAmount: 2500,
    currentAmount: 1200,
    monthlySavings: 400,
    priority: "low",
    color: "#8B5CF6",
  },
  {
    id: "4",
    title: "Home Renovation",
    icon: "home",
    targetAmount: 15000,
    currentAmount: 3200,
    monthlySavings: 1200,
    priority: "medium",
    color: "#F59E0B",
  },
];

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchFinanceData = async () => {
    setIsLoading(true);
    try {
      console.log("🚀 Fetching finance table data...");
      const financeData = await fetchFinanceTable();
      console.log("✅ Finance Table Data:", financeData);
      console.log("📊 Total records:", financeData.length);

      if (financeData.length > 0) {
        console.log("📝 Sample record:", financeData[0]);
      }

      Alert.alert(
        "Data Fetched Successfully!",
        `Retrieved ${financeData.length} records from finance_table. Check console for details.`
      );
    } catch (error) {
      console.error("❌ Error fetching finance data:", error);
      Alert.alert(
        "Error",
        `Failed to fetch data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTransactionData = async () => {
    setIsLoading(true);
    try {
      console.log("🚀 Fetching transaction normalized data...");
      const transactionData = await fetchTransactionNormalized();
      console.log("✅ Transaction Normalized Data:", transactionData);
      console.log("📊 Total records:", transactionData.length);

      if (transactionData.length > 0) {
        console.log("📝 Sample record:", transactionData[0]);
      }

      Alert.alert(
        "Data Fetched Successfully!",
        `Retrieved ${transactionData.length} records from transaction_normalized. Check console for details.`
      );
    } catch (error) {
      console.error("❌ Error fetching transaction data:", error);
      Alert.alert(
        "Error",
        `Failed to fetch data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

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
<<<<<<< HEAD
      colors={["#F8FAFC", "#F0FDF4"]}
=======
      colors={['#F0FDF4', '#ECFDF5', '#FFFFFF']}
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>Lasso</Text>
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
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>$121,000</Text>
            <View style={styles.balanceSubtext}>
              <Text style={styles.balanceChange}>+2.4%</Text>
              <Text style={styles.balancePeriod}>from last month</Text>
            </View>
          </View>
<<<<<<< HEAD

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$21,000</Text>
              <Text style={styles.statLabel}>Income</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$11,000</Text>
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$10,000</Text>
              <Text style={styles.statLabel}>Savings</Text>
            </View>
          </View>
=======
          <View style={styles.sgkbSection}>
            <SGKBLogo size={16} />
            <Text style={styles.sgkbText}>St. Galler Kantonalbank</Text>
          </View>
        </View>

        {/* Financial Overview */}
        <View style={styles.financialContainer}>
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
                <Text style={styles.financialValue}>$21,000</Text>
                <Text style={styles.financialLabel}>Total Income</Text>
                <Text style={styles.financialChange}>+12.5% vs last month</Text>
              </View>
            </View>
            
            <View style={styles.financialCard}>
              <View style={[styles.financialIconContainer, { backgroundColor: 'rgba(248, 113, 113, 0.2)' }]}>
                <Ionicons name="trending-down" size={20} color="#F87171" />
              </View>
              <View style={styles.financialContent}>
                <Text style={styles.financialValue}>$11,000</Text>
                <Text style={styles.financialLabel}>Total Expenses</Text>
                <Text style={styles.financialChange}>+8.2% vs last month</Text>
              </View>
            </View>
            
            <View style={styles.financialCard}>
              <View style={[styles.financialIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Ionicons name="wallet" size={20} color="#3B82F6" />
              </View>
              <View style={styles.financialContent}>
                <Text style={styles.financialValue}>$10,000</Text>
                <Text style={styles.financialLabel}>Net Savings</Text>
                <Text style={styles.financialChange}>+18.3% vs last month</Text>
              </View>
            </View>
          </View>
        </View>
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
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
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Ionicons name="receipt" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Bills</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Ionicons name="analytics" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Analytics</Text>
              </TouchableOpacity>
            </View>

            {/* Temporary Supabase Test Buttons */}
            <View style={styles.testButtonsContainer}>
              <Text style={styles.testSectionTitle}>
                🔧 Supabase Test Buttons
              </Text>
              <View style={styles.testButtonsGrid}>
                <TouchableOpacity
                  style={[
                    styles.testButton,
                    isLoading && styles.testButtonDisabled,
                  ]}
                  onPress={handleFetchFinanceData}
                  disabled={isLoading}
                >
                  <View style={styles.testButtonIcon}>
                    <Ionicons name="server" size={20} color="#EF4444" />
                  </View>
                  <Text style={styles.testButtonLabel}>
                    Fetch Finance Table
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.testButton,
                    isLoading && styles.testButtonDisabled,
                  ]}
                  onPress={handleFetchTransactionData}
                  disabled={isLoading}
                >
                  <View style={styles.testButtonIcon}>
                    <Ionicons
                      name="swap-horizontal"
                      size={20}
                      color="#EF4444"
                    />
                  </View>
                  <Text style={styles.testButtonLabel}>Fetch Transactions</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

<<<<<<< HEAD
          {/* Goals Section */}
          <View style={styles.goalsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Goals</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.goalsScrollView}
              contentContainerStyle={styles.goalsContainer}
            >
              {goals.slice(0, 3).map((goal) => {
                const progress = calculateGoalProgress(goal);
                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[styles.goalCard, { borderLeftColor: goal.color }]}
                    onPress={() => handleGoalPress(goal)}
                  >
                    <View style={styles.goalHeader}>
                      <View
                        style={[
                          styles.goalIcon,
                          { backgroundColor: `${goal.color}15` },
                        ]}
                      >
                        <Ionicons
                          name={goal.icon as any}
                          size={20}
                          color={goal.color}
                        />
                      </View>
                      <View style={styles.goalPriority}>
                        <View
                          style={[
                            styles.priorityDot,
                            { backgroundColor: goal.color },
                          ]}
                        />
                      </View>
                    </View>

                    <Text style={styles.goalTitle}>{goal.title}</Text>

                    <View style={styles.goalProgressContainer}>
                      <View style={styles.goalProgressBar}>
                        <View
                          style={[
                            styles.goalProgressFill,
                            {
                              width: `${progress.percentage}%`,
                              backgroundColor: goal.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.goalProgressText}>
                        {progress.percentage.toFixed(0)}%
                      </Text>
                    </View>

                    <View style={styles.goalAmounts}>
                      <Text style={styles.goalCurrentAmount}>
                        ${goal.currentAmount.toLocaleString()}
                      </Text>
                      <Text style={styles.goalTargetAmount}>
                        of ${goal.targetAmount.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.goalTimeline}>
                      <View style={styles.goalTimelineItem}>
                        <Text style={styles.goalTimelineLabel}>Remaining</Text>
                        <Text style={styles.goalTimelineValue}>
                          ${progress.remaining.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.goalTimelineItem}>
                        <Text style={styles.goalTimelineLabel}>
                          Complete by
                        </Text>
                        <Text style={styles.goalTimelineValue}>
                          {progress.completionDate}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
=======
        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transactionsList}>
              <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="storefront" size={20} color="#6B7280" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>Saber Store</Text>
                  <Text style={styles.transactionDate}>Today, 2:30 PM</Text>
                </View>
                <Text style={styles.transactionAmount}>-$22.00</Text>
              </View>
              <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="wifi" size={20} color="#6B7280" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>Wi-Fi Bill</Text>
                  <Text style={styles.transactionDate}>Yesterday</Text>
                </View>
                <Text style={styles.transactionAmount}>-$120.00</Text>
              </View>
              <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons name="card" size={20} color="#10B981" />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>Salary</Text>
                  <Text style={styles.transactionDate}>Sep 28</Text>
                </View>
                <Text style={styles.transactionAmountPositive}>+$3,500.00</Text>
              </View>
            </View>
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
  bgPattern: {
    ...StyleSheet.absoluteFillObject as any,
    zIndex: 0,
  },
  bgBlobTopRight: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    right: -80,
    top: -60,
    transform: [{ rotate: '20deg' }],
  },
  bgBlobBottomLeft: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    left: -100,
    bottom: 140,
    transform: [{ rotate: '-15deg' }],
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
<<<<<<< HEAD
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
=======
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    shadowRadius: 8,
    elevation: 2,
  },
  balanceSection: {
<<<<<<< HEAD
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
=======
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    marginHorizontal: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
<<<<<<< HEAD
    color: "#10B981",
    fontWeight: "600",
=======
    color: '#34D399',
    fontWeight: '600',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    marginRight: 8,
  },
  balancePeriod: {
    fontSize: 14,
<<<<<<< HEAD
    color: "#9CA3AF",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
=======
    color: '#6B7280',
  },
  sgkbSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  sgkbText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  financialContainer: {
    backgroundColor: '#FFFFFF',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
<<<<<<< HEAD
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
=======
    marginHorizontal: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  financialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  financialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
  },
  financialPeriod: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financialCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  financialIconContainer: {
    width: 40,
    height: 40,
<<<<<<< HEAD
    backgroundColor: "#E5E7EB",
=======
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  financialContent: {
    alignItems: 'center',
  },
  financialValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  financialLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  financialChange: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '600',
    textAlign: 'center',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
<<<<<<< HEAD
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
=======
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
<<<<<<< HEAD
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
=======
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(16, 185, 129, 0.25)',
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
<<<<<<< HEAD
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
=======
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
<<<<<<< HEAD
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
=======
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    marginRight: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
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
<<<<<<< HEAD
    color: "#9CA3AF",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  transactionAmountPositive: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
=======
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F87171',
  },
  transactionAmountPositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34D399',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
<<<<<<< HEAD
    backgroundColor: "white",
=======
    backgroundColor: '#FFFFFF',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderLeftWidth: 4,
<<<<<<< HEAD
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
=======
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
<<<<<<< HEAD
    backgroundColor: "#F3F4F6",
=======
    backgroundColor: '#E5E7EB',
>>>>>>> f2a3a4b143440c060f10db666bfc0aaf90259aa5
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
  // Test button styles
  testButtonsContainer: {
    marginTop: 24,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  testSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 12,
    textAlign: "center",
  },
  testButtonsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  testButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#FECACA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  testButtonDisabled: {
    opacity: 0.5,
  },
  testButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  testButtonLabel: {
    fontSize: 11,
    color: "#DC2626",
    fontWeight: "500",
    textAlign: "center",
  },
});
