import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your financial progress</Text>
        </View>

        {/* Monthly Overview Cards */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>This Month</Text>
              <Text style={styles.statValue}>+$2,400</Text>
              <Text style={styles.statChange}>+12% from last month</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={24} color="#F59E0B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Savings Goal</Text>
              <Text style={styles.statValue}>$8,200</Text>
              <Text style={styles.statChange}>82% complete</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Spending Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.categoriesContainer}>
            <View style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.categoryIconGradient}
                >
                  <Ionicons name="restaurant" size={20} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>Food & Dining</Text>
                <Text style={styles.categoryAmount}>$1,240</Text>
              </View>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryProgress, { width: '75%', backgroundColor: '#EF4444' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.categoryIconGradient}
                >
                  <Ionicons name="car" size={20} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>Transportation</Text>
                <Text style={styles.categoryAmount}>$890</Text>
              </View>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryProgress, { width: '55%', backgroundColor: '#3B82F6' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.categoryIconGradient}
                >
                  <Ionicons name="shirt" size={20} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>Shopping</Text>
                <Text style={styles.categoryAmount}>$650</Text>
              </View>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryProgress, { width: '40%', backgroundColor: '#8B5CF6' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.categoryIconGradient}
                >
                  <Ionicons name="medical" size={20} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>Healthcare</Text>
                <Text style={styles.categoryAmount}>$420</Text>
              </View>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryProgress, { width: '25%', backgroundColor: '#06B6D4' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <View style={styles.trendsContainer}>
            <LinearGradient
              colors={['#F472B6', '#FB7185']}
              style={styles.trendCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.trendHeader}>
                <Ionicons name="arrow-up" size={20} color="white" />
                <Text style={styles.trendTitle}>Income Growth</Text>
              </View>
              <Text style={styles.trendValue}>+15.2%</Text>
              <Text style={styles.trendDescription}>vs last month</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.trendCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.trendHeader}>
                <Ionicons name="arrow-down" size={20} color="white" />
                <Text style={styles.trendTitle}>Expense Reduction</Text>
              </View>
              <Text style={styles.trendValue}>-8.7%</Text>
              <Text style={styles.trendDescription}>vs last month</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Financial Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Goals</Text>
          <View style={styles.goalsContainer}>
            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Emergency Fund</Text>
                <Text style={styles.goalAmount}>$8,200 / $10,000</Text>
              </View>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgress, { width: '82%' }]} />
              </View>
              <Text style={styles.goalDescription}>82% complete • $1,800 remaining</Text>
            </View>

            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Vacation Fund</Text>
                <Text style={styles.goalAmount}>$2,100 / $5,000</Text>
              </View>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgress, { width: '42%', backgroundColor: '#8B5CF6' }]} />
              </View>
              <Text style={styles.goalDescription}>42% complete • $2,900 remaining</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryBar: {
    width: 60,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginLeft: 12,
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
  },
  trendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
    fontWeight: '500',
  },
  trendValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  trendDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  goalsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  goalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  goalAmount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
