import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  monthlySavings: number;
  priority: 'high' | 'medium' | 'low';
  color: string;
}

const goals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    icon: 'shield-checkmark',
    targetAmount: 10000,
    currentAmount: 8200,
    monthlySavings: 500,
    priority: 'high',
    color: '#10B981',
  },
  {
    id: '2',
    title: 'Vacation to Japan',
    icon: 'airplane',
    targetAmount: 5000,
    currentAmount: 2100,
    monthlySavings: 800,
    priority: 'medium',
    color: '#3B82F6',
  },
  {
    id: '3',
    title: 'New MacBook Pro',
    icon: 'laptop',
    targetAmount: 2500,
    currentAmount: 1200,
    monthlySavings: 400,
    priority: 'low',
    color: '#8B5CF6',
  },
  {
    id: '4',
    title: 'Home Renovation',
    icon: 'home',
    targetAmount: 15000,
    currentAmount: 3200,
    monthlySavings: 1200,
    priority: 'medium',
    color: '#F59E0B',
  },
];

export default function HomeScreen() {
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
      completionDate: completionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
  };

  const handleGoalPress = (goal: Goal) => {
    // Navigate to goal detail screen
    router.push({
      pathname: '/goal-detail',
      params: { goalId: goal.id }
    });
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F0FDF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Lasso</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#6B7280" />
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
        </View>

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
                    <View style={[styles.goalIcon, { backgroundColor: `${goal.color}15` }]}>
                      <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                    </View>
                    <View style={styles.goalPriority}>
                      <View style={[styles.priorityDot, { backgroundColor: goal.color }]} />
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
                            backgroundColor: goal.color 
                          }
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
                      <Text style={styles.goalTimelineLabel}>Complete by</Text>
                      <Text style={styles.goalTimelineValue}>
                        {progress.completionDate}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 32,
  },
  profileSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  balanceSubtext: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceChange: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 8,
  },
  balancePeriod: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
  },
  transactionsList: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  transactionAmountPositive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  goalsSection: {
    marginBottom: 32,
  },
  goalsScrollView: {
    marginTop: 16,
  },
  goalsContainer: {
    paddingRight: 24,
  },
  goalCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalPriority: {
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  goalProgressContainer: {
    marginBottom: 16,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'right',
  },
  goalAmounts: {
    marginBottom: 16,
  },
  goalCurrentAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  goalTargetAmount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  goalTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalTimelineItem: {
    flex: 1,
  },
  goalTimelineLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  goalTimelineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});