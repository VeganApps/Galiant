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
import { router, useLocalSearchParams } from 'expo-router';

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
  description: string;
  category: string;
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
    description: 'Building a safety net for unexpected expenses and financial emergencies.',
    category: 'Financial Security',
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
    description: 'Dream trip to Japan including flights, accommodation, and experiences.',
    category: 'Travel',
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
    description: 'Upgrading to the latest MacBook Pro for work and creative projects.',
    category: 'Technology',
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
    description: 'Kitchen and bathroom renovation to modernize the home.',
    category: 'Home Improvement',
  },
];

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams();
  const goal = goals.find(g => g.id === goalId as string);

  if (!goal) {
    return (
      <LinearGradient
        colors={['#F8FAFC', '#F0FDF4']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>Goal not found</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const calculateGoalProgress = () => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsToComplete = Math.ceil(remaining / goal.monthlySavings);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsToComplete);
    
    return {
      percentage: Math.min(percentage, 100),
      remaining,
      monthsToComplete,
      completionDate: completionDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }),
      weeklySavings: Math.round(goal.monthlySavings / 4),
      dailySavings: Math.round(goal.monthlySavings / 30),
    };
  };

  const progress = calculateGoalProgress();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Priority';
    }
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Goal Details</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Goal Header Card */}
          <View style={[styles.goalHeaderCard, { borderLeftColor: goal.color }]}>
            <View style={styles.goalHeaderContent}>
              <View style={[styles.goalIconLarge, { backgroundColor: `${goal.color}15` }]}>
                <Ionicons name={goal.icon as any} size={32} color={goal.color} />
              </View>
              <View style={styles.goalHeaderInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalCategory}>{goal.category}</Text>
                <View style={styles.priorityContainer}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(goal.priority) }]} />
                  <Text style={styles.priorityText}>{getPriorityText(goal.priority)}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>

          {/* Progress Overview */}
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Progress Overview</Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>
                  ${goal.currentAmount.toLocaleString()}
                </Text>
                <Text style={styles.progressStatLabel}>Saved</Text>
              </View>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>
                  ${progress.remaining.toLocaleString()}
                </Text>
                <Text style={styles.progressStatLabel}>Remaining</Text>
              </View>
              <View style={styles.progressStatItem}>
                <Text style={styles.progressStatValue}>
                  {progress.percentage.toFixed(0)}%
                </Text>
                <Text style={styles.progressStatLabel}>Complete</Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${progress.percentage}%`,
                      backgroundColor: goal.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressBarText}>
                ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Timeline & Savings */}
          <View style={styles.timelineCard}>
            <Text style={styles.sectionTitle}>Timeline & Savings Plan</Text>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, { backgroundColor: `${goal.color}15` }]}>
                <Ionicons name="calendar" size={20} color={goal.color} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Expected Completion</Text>
                <Text style={styles.timelineValue}>{progress.completionDate}</Text>
                <Text style={styles.timelineSubtext}>
                  {progress.monthsToComplete} months remaining
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, { backgroundColor: `${goal.color}15` }]}>
                <Ionicons name="cash" size={20} color={goal.color} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Monthly Savings</Text>
                <Text style={styles.timelineValue}>${goal.monthlySavings.toLocaleString()}</Text>
                <Text style={styles.timelineSubtext}>
                  ${progress.weeklySavings}/week • ${progress.dailySavings}/day
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.addMoneyButton}>
              <LinearGradient
                colors={[goal.color, goal.color]}
                style={styles.addMoneyGradient}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addMoneyText}>Add Money</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.adjustButton}>
              <View style={styles.adjustButtonContent}>
                <Ionicons name="settings" size={20} color="#6B7280" />
                <Text style={styles.adjustButtonText}>Adjust Goal</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Milestones */}
          <View style={styles.milestonesCard}>
            <Text style={styles.sectionTitle}>Milestones</Text>
            <View style={styles.milestonesList}>
              {[25, 50, 75, 100].map((milestone) => {
                const milestoneAmount = (goal.targetAmount * milestone) / 100;
                const isReached = goal.currentAmount >= milestoneAmount;
                const isCurrent = milestone === Math.floor(progress.percentage / 25) * 25;
                
                return (
                  <View key={milestone} style={styles.milestoneItem}>
                    <View style={[
                      styles.milestoneDot,
                      { 
                        backgroundColor: isReached ? goal.color : '#E5E7EB',
                        borderColor: isCurrent ? goal.color : 'transparent',
                        borderWidth: isCurrent ? 3 : 0,
                      }
                    ]} />
                    <View style={styles.milestoneContent}>
                      <Text style={styles.milestoneLabel}>
                        {milestone}% - ${milestoneAmount.toLocaleString()}
                      </Text>
                      <Text style={styles.milestoneStatus}>
                        {isReached ? 'Completed' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                );
              })}
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeaderCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalHeaderInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  goalCategory: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  goalDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 12,
    borderRadius: 6,
  },
  progressBarText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  timelineCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timelineSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  addMoneyButton: {
    flex: 1,
    marginRight: 12,
  },
  addMoneyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  addMoneyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  adjustButton: {
    flex: 1,
    marginLeft: 12,
  },
  adjustButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  adjustButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  milestonesCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  milestonesList: {
    marginTop: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  milestoneDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  milestoneStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
  },
});
