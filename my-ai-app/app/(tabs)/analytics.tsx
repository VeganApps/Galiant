import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CountrySpending {
  country: string;
  flag: string;
  currency: string;
  amount: string;
  percentage: number;
  transactions: number;
  color: string;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  category: 'upselling' | 'insight' | 'savings' | 'navigation';
  priority: 'high' | 'medium' | 'low';
  icon: string;
  color: string;
  action: string;
  value?: string;
}

const countrySpendingData: CountrySpending[] = [
  {
    country: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    amount: '2,450.30',
    percentage: 45,
    transactions: 28,
    color: '#10B981',
  },
  {
    country: 'Denmark',
    flag: '🇩🇰',
    currency: 'DKK',
    amount: '1,230.50',
    percentage: 22,
    transactions: 15,
    color: '#3B82F6',
  },
  {
    country: 'Croatia',
    flag: '🇭🇷',
    currency: 'HRK',
    amount: '890.75',
    percentage: 16,
    transactions: 8,
    color: '#F59E0B',
  },
  {
    country: 'Austria',
    flag: '🇦🇹',
    currency: 'EUR',
    amount: '420.30',
    percentage: 8,
    transactions: 6,
    color: '#8B5CF6',
  },
  {
    country: 'Norway',
    flag: '🇳🇴',
    currency: 'NOK',
    amount: '310.25',
    percentage: 6,
    transactions: 4,
    color: '#EC4899',
  },
  {
    country: 'Czech Republic',
    flag: '🇨🇿',
    currency: 'CZK',
    amount: '180.40',
    percentage: 3,
    transactions: 3,
    color: '#EF4444',
  },
];

const aiSuggestions: AISuggestion[] = [
  {
    id: '1',
    title: 'Credit Card Recommendation',
    description: 'Save on transaction fees with our premium credit card. Based on your international spending pattern, you could save up to $120 annually.',
    category: 'upselling',
    priority: 'high',
    icon: 'card',
    color: '#10B981',
    action: 'Apply Now',
    value: 'Save $120/year',
  },
  {
    id: '2',
    title: 'Subscription Monitor',
    description: 'Track all your monthly subscriptions in one place. You have 8 active subscriptions costing $89/month.',
    category: 'insight',
    priority: 'medium',
    icon: 'list',
    color: '#3B82F6',
    action: 'View Details',
    value: '$89/month',
  },
  {
    id: '3',
    title: 'Spending Heatmap',
    description: 'Get your personalized spending recap like Spotify Wrapped. See your financial journey across countries and categories.',
    category: 'upselling',
    priority: 'medium',
    icon: 'map',
    color: '#F59E0B',
    action: 'Generate Report',
    value: 'Free Report',
  },
  {
    id: '4',
    title: 'Smart Savings',
    description: 'Switch from COOP to LIDL for groceries and save $45/month. Based on your current spending pattern.',
    category: 'savings',
    priority: 'high',
    icon: 'trending-down',
    color: '#8B5CF6',
    action: 'Save Now',
    value: 'Save $45/month',
  },
  {
    id: '5',
    title: 'Navigation Helper',
    description: 'Having trouble finding something? Our AI assistant can guide you through any feature in the app.',
    category: 'navigation',
    priority: 'low',
    icon: 'compass',
    color: '#EC4899',
    action: 'Ask Galiant',
    value: 'AI Powered',
  },
  {
    id: '6',
    title: 'Credit Line Increase',
    description: 'For your upcoming home renovation, consider increasing your credit line. You qualify for up to $25,000.',
    category: 'upselling',
    priority: 'medium',
    icon: 'trending-up',
    color: '#EF4444',
    action: 'Apply',
    value: 'Up to $25,000',
  },
];

export default function AnalyticsScreen() {
  const [selectedCountry, setSelectedCountry] = useState<CountrySpending | null>(null);

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
            colors={['#22C55E', '#16A34A']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={24} color="#22C55E" />
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
                  colors={['#34D399', '#10B981']}
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
                <View style={[styles.categoryProgress, { width: '55%', backgroundColor: '#34D399' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <LinearGradient
                  colors={['#4ADE80', '#22C55E']}
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
                <View style={[styles.categoryProgress, { width: '40%', backgroundColor: '#4ADE80' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <LinearGradient
                  colors={['#6EE7B7', '#34D399']}
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
                <View style={[styles.categoryProgress, { width: '25%', backgroundColor: '#6EE7B7' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <View style={styles.trendsContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
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
              colors={['#22C55E', '#16A34A']}
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
                <View style={[styles.goalProgress, { width: '42%', backgroundColor: '#34D399' }]} />
              </View>
              <Text style={styles.goalDescription}>42% complete • $2,900 remaining</Text>
            </View>
          </View>
        </View>

        {/* World Map Spending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Country</Text>
          <Text style={styles.sectionSubtitle}>Your international spending activity</Text>
          
          {/* Interactive World Map Visualization */}
          <View style={styles.worldMapContainer}>
            <View style={styles.mapGrid}>
              {/* Simplified world map representation */}
              <View style={styles.mapRow}>
                <View style={styles.mapCell} />
                <TouchableOpacity 
                  style={[styles.mapCell, styles.countryCell, { backgroundColor: `${countrySpendingData[4].color}20` }]}
                  onPress={() => setSelectedCountry(countrySpendingData[4])}
                >
                  <Text style={styles.countryFlag}>{countrySpendingData[4].flag}</Text>
                </TouchableOpacity>
                <View style={styles.mapCell} />
                <TouchableOpacity 
                  style={[styles.mapCell, styles.countryCell, { backgroundColor: `${countrySpendingData[3].color}20` }]}
                  onPress={() => setSelectedCountry(countrySpendingData[3])}
                >
                  <Text style={styles.countryFlag}>{countrySpendingData[3].flag}</Text>
                </TouchableOpacity>
                <View style={styles.mapCell} />
              </View>
              
              <View style={styles.mapRow}>
                <View style={styles.mapCell} />
                <View style={styles.mapCell} />
                <TouchableOpacity 
                  style={[styles.mapCell, styles.countryCell, { backgroundColor: `${countrySpendingData[2].color}20` }]}
                  onPress={() => setSelectedCountry(countrySpendingData[2])}
                >
                  <Text style={styles.countryFlag}>{countrySpendingData[2].flag}</Text>
                </TouchableOpacity>
                <View style={styles.mapCell} />
                <View style={styles.mapCell} />
              </View>
              
              <View style={styles.mapRow}>
                <View style={styles.mapCell} />
                <TouchableOpacity 
                  style={[styles.mapCell, styles.countryCell, { backgroundColor: `${countrySpendingData[1].color}20` }]}
                  onPress={() => setSelectedCountry(countrySpendingData[1])}
                >
                  <Text style={styles.countryFlag}>{countrySpendingData[1].flag}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.mapCell, styles.countryCell, { backgroundColor: `${countrySpendingData[0].color}20` }]}
                  onPress={() => setSelectedCountry(countrySpendingData[0])}
                >
                  <Text style={styles.countryFlag}>{countrySpendingData[0].flag}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.mapCell, styles.countryCell, { backgroundColor: `${countrySpendingData[5].color}20` }]}
                  onPress={() => setSelectedCountry(countrySpendingData[5])}
                >
                  <Text style={styles.countryFlag}>{countrySpendingData[5].flag}</Text>
                </TouchableOpacity>
                <View style={styles.mapCell} />
              </View>
            </View>
            
            {/* Legend */}
            <View style={styles.mapLegend}>
              <Text style={styles.legendTitle}>Tap countries to see details</Text>
              <View style={styles.legendItems}>
                {countrySpendingData.slice(0, 3).map((country, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: country.color }]} />
                    <Text style={styles.legendText}>{country.flag} {country.country}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Selected Country Details */}
          {selectedCountry && (
            <View style={styles.countryDetailsContainer}>
              <View style={styles.countryDetailsHeader}>
                <Text style={styles.countryDetailsFlag}>{selectedCountry.flag}</Text>
                <View style={styles.countryDetailsInfo}>
                  <Text style={styles.countryDetailsName}>{selectedCountry.country}</Text>
                  <Text style={styles.countryDetailsStats}>
                    {selectedCountry.transactions} transactions
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedCountry(null)}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.countryDetailsStats}>
                <View style={styles.countryStatItem}>
                  <Text style={styles.countryStatLabel}>Total Spent</Text>
                  <Text style={styles.countryStatValue}>
                    {selectedCountry.amount} {selectedCountry.currency}
                  </Text>
                </View>
                <View style={styles.countryStatItem}>
                  <Text style={styles.countryStatLabel}>Percentage</Text>
                  <Text style={styles.countryStatValue}>{selectedCountry.percentage}%</Text>
                </View>
                <View style={styles.countryStatItem}>
                  <Text style={styles.countryStatLabel}>Transactions</Text>
                  <Text style={styles.countryStatValue}>{selectedCountry.transactions}</Text>
                </View>
              </View>
              
              <View style={styles.countryProgressContainer}>
                <View style={styles.countryProgressBar}>
                  <View style={[
                    styles.countryProgressFill, 
                    { 
                      width: `${selectedCountry.percentage}%`,
                      backgroundColor: selectedCountry.color 
                    }
                  ]} />
                </View>
                <Text style={styles.countryProgressText}>
                  {selectedCountry.percentage}% of total spending
                </Text>
              </View>
            </View>
          )}

          {/* Country List */}
          <View style={styles.countryListContainer}>
            <Text style={styles.countryListTitle}>All Countries</Text>
            {countrySpendingData.map((country, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.countryListItem}
                onPress={() => setSelectedCountry(country)}
              >
                <View style={styles.countryListLeft}>
                  <Text style={styles.countryListFlag}>{country.flag}</Text>
                  <View style={styles.countryListInfo}>
                    <Text style={styles.countryListName}>{country.country}</Text>
                    <Text style={styles.countryListTransactions}>
                      {country.transactions} transactions
                    </Text>
                  </View>
                </View>
                <View style={styles.countryListRight}>
                  <Text style={styles.countryListAmount}>
                    {country.amount} {country.currency}
                  </Text>
                  <Text style={styles.countryListPercentage}>
                    {country.percentage}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Assistant Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Assistant Suggestions</Text>
          <Text style={styles.sectionSubtitle}>Personalized recommendations powered by Galiant</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsCarousel}
            contentContainerStyle={styles.suggestionsCarouselContent}
            decelerationRate="fast"
            snapToInterval={width * 0.85}
            snapToAlignment="start"
          >
            {aiSuggestions.map((suggestion, index) => (
              <TouchableOpacity key={suggestion.id} style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <View style={[styles.suggestionIcon, { backgroundColor: `${suggestion.color}15` }]}>
                    <Ionicons name={suggestion.icon as any} size={24} color={suggestion.color} />
                  </View>
                  <View style={styles.suggestionHeaderInfo}>
                    <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    <View style={styles.suggestionMeta}>
                      <View style={[styles.categoryBadge, { backgroundColor: `${suggestion.color}20` }]}>
                        <Text style={[styles.categoryText, { color: suggestion.color }]}>
                          {suggestion.category.toUpperCase()}
                        </Text>
                      </View>
                      <View style={[styles.priorityDot, { backgroundColor: suggestion.color }]} />
                    </View>
                  </View>
                  {suggestion.value && (
                    <View style={[styles.valueBadge, { backgroundColor: suggestion.color }]}>
                      <Text style={styles.valueText}>{suggestion.value}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { borderColor: suggestion.color }]}
                  onPress={() => {
                    // Handle suggestion action
                    console.log('Action pressed for:', suggestion.title);
                  }}
                >
                  <Text style={[styles.actionButtonText, { color: suggestion.color }]}>
                    {suggestion.action}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={suggestion.color} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* AI Insights Summary */}
          <View style={styles.insightsSummary}>
            <View style={styles.insightsHeader}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.insightsIcon}
              >
                <Ionicons name="bulb" size={24} color="white" />
              </LinearGradient>
              <View style={styles.insightsContent}>
                <Text style={styles.insightsTitle}>Smart Insights</Text>
                <Text style={styles.insightsSubtitle}>
                  Based on your spending patterns, you could save up to $2,400 annually
                </Text>
              </View>
            </View>
            
            <View style={styles.insightsStats}>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>$2,400</Text>
                <Text style={styles.insightStatLabel}>Annual Savings</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>12</Text>
                <Text style={styles.insightStatLabel}>Recommendations</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={styles.insightStatValue}>85%</Text>
                <Text style={styles.insightStatLabel}>Accuracy</Text>
              </View>
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  worldMapContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mapGrid: {
    marginBottom: 20,
  },
  mapRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mapCell: {
    flex: 1,
    height: 40,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  countryCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  countryFlag: {
    fontSize: 20,
  },
  mapLegend: {
    alignItems: 'center',
  },
  legendTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  countryDetailsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryDetailsFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  countryDetailsInfo: {
    flex: 1,
  },
  countryDetailsName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  countryDetailsStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryDetailsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  countryStatItem: {
    alignItems: 'center',
  },
  countryStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  countryStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  countryProgressContainer: {
    marginTop: 8,
  },
  countryProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  countryProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  countryProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  countryListContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryListFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryListInfo: {
    flex: 1,
  },
  countryListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  countryListTransactions: {
    fontSize: 12,
    color: '#6B7280',
  },
  countryListRight: {
    alignItems: 'flex-end',
  },
  countryListAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  countryListPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  suggestionsCarousel: {
    marginBottom: 24,
  },
  suggestionsCarouselContent: {
    paddingRight: 24,
  },
  suggestionCard: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  suggestionHeaderInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  suggestionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  valueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  suggestionDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  insightsSummary: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  insightsIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightsContent: {
    flex: 1,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  insightsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightStat: {
    alignItems: 'center',
  },
  insightStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  insightStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
