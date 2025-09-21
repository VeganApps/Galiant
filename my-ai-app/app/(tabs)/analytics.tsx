import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, SlideInLeft } from "react-native-reanimated";
import CountryDetails from "../../components/country-details";
import VendorAnalytics from "../../components/vendor-analytics";
import { useTransactions } from "../../contexts/TransactionContext";
import { generateCountrySpendingData } from "../../utils/country-analytics";

const { width } = Dimensions.get("window");

interface CountrySpending {
  country: string;
  flag: string;
  currency: string;
  amount: string;
  percentage: number;
  transactions: number;
  color: string;
}


export default function AnalyticsScreen() {
  const { rawTransactions, isDataLoaded } = useTransactions();
  const [selectedCountry, setSelectedCountry] =
    useState<CountrySpending | null>(null);
  const [showVendorAnalytics, setShowVendorAnalytics] = useState(false);
  const [showCountryDetails, setShowCountryDetails] = useState(false);
  const [selectedCountryForDetails, setSelectedCountryForDetails] =
    useState<CountrySpending | null>(null);

  // Generate real country spending data from transactions
  const countrySpendingData = React.useMemo(() => {
    if (!isDataLoaded || rawTransactions.length === 0) {
      return []; // Return empty array while loading
    }

    return generateCountrySpendingData(rawTransactions);
  }, [rawTransactions, isDataLoaded]);

  const handleShowCountryDetails = (country: CountrySpending) => {
    setSelectedCountryForDetails(country);
    setShowCountryDetails(true);
  };

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
          entering={SlideInLeft.duration(300).springify()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Track your financial progress</Text>
          </View>

          {/* Monthly Overview Cards */}
          <Animated.View
            style={styles.statsRow}
            entering={FadeInUp.delay(100).duration(600).springify()}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="trending-up" size={24} color="#10B981" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>This Month</Text>
                <Text style={styles.statValue}>+CHF 2,200</Text>
                {/* TODO: Replace with real value */}
                <Text style={styles.statChange}>+12% from last month</Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["#22C55E", "#16A34A"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color="#22C55E" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Savings Goal</Text>
                <Text style={styles.statValue}>CHF 8,200</Text>
                <Text style={styles.statChange}>82% complete</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Spending Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <View style={styles.categoriesContainer}>
              <View style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    style={styles.categoryIconGradient}
                  >
                    <Ionicons name="restaurant" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Food & Dining</Text>
                  <Text style={styles.categoryAmount}>CHF 116</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryProgress,
                      { width: "40%", backgroundColor: "#4ADE80" },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <LinearGradient
                    colors={["#34D399", "#10B981"]}
                    style={styles.categoryIconGradient}
                  >
                    <Ionicons name="car" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Transportation</Text>
                  <Text style={styles.categoryAmount}>CHF 170</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryProgress,
                      { width: "55%", backgroundColor: "#34D399" },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <LinearGradient
                    colors={["#4ADE80", "#22C55E"]}
                    style={styles.categoryIconGradient}
                  >
                    <Ionicons name="shirt" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Shopping</Text>
                  <Text style={styles.categoryAmount}>CHF 384</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryProgress,
                      { width: "75%", backgroundColor: "#EF4444" },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <LinearGradient
                    colors={["#6EE7B7", "#34D399"]}
                    style={styles.categoryIconGradient}
                  >
                    <Ionicons name="medical" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Healthcare</Text>
                  <Text style={styles.categoryAmount}>CHF 110</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryProgress,
                      { width: "25%", backgroundColor: "#6EE7B7" },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Monthly Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Trends</Text>
            <View style={styles.trendsContainer}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
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
                colors={["#22C55E", "#16A34A"]}
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
                  <Text style={styles.goalAmount}>CHF 8,200 / CHF 10,000</Text>
                </View>
                <View style={styles.goalProgressBar}>
                  <View style={[styles.goalProgress, { width: "82%" }]} />
                </View>
                <Text style={styles.goalDescription}>
                  82% complete • CHF 1,800 remaining
                </Text>
              </View>

              <View style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>Vacation Fund</Text>
                  <Text style={styles.goalAmount}>CHF 1,900 / CHF 4,500</Text>
                </View>
                <View style={styles.goalProgressBar}>
                  <View
                    style={[
                      styles.goalProgress,
                      { width: "42%", backgroundColor: "#34D399" },
                    ]}
                  />
                </View>
                <Text style={styles.goalDescription}>
                  42% complete • CHF 2,600 remaining
                </Text>
              </View>
            </View>
          </View>

          {/* World Map Spending */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending by Country</Text>
            {/* TODO: Make this show only the values from this year */}
            <Text style={styles.sectionSubtitle}>
              {isDataLoaded
                ? "Your international spending activity"
                : "Loading spending data..."}
            </Text>

            {/* Interactive World Map Visualization */}
            <View style={styles.worldMapContainer}>
              {countrySpendingData.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.flagRowScroll}
                  contentContainerStyle={styles.flagRowContent}
                  decelerationRate="fast"
                  snapToInterval={76}
                  snapToAlignment="start"
                >
                  {countrySpendingData.map((country) => (
                    <TouchableOpacity
                      key={country.country}
                      style={[
                        styles.flagBox,
                        { backgroundColor: `${country.color}20` },
                      ]}
                      onPress={() => setSelectedCountry(country)}
                    >
                      <Text style={styles.flagBoxFlag}>{country.flag}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>
                    Loading country data...
                  </Text>
                </View>
              )}

              {/* Legend */}
              <View style={styles.mapLegend}>
                <Text style={styles.legendTitle}>
                  Tap countries to see details
                </Text>
              </View>
            </View>

            {/* Selected Country Details */}
            {selectedCountry && (
              <View style={styles.countryDetailsContainer}>
                <View style={styles.countryDetailsHeader}>
                  <Text style={styles.countryDetailsFlag}>
                    {selectedCountry.flag}
                  </Text>
                  <View style={styles.countryDetailsInfo}>
                    <Text style={styles.countryDetailsName}>
                      {selectedCountry.country}
                    </Text>
                    <Text style={styles.countryDetailsText}>
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
                    <Text style={styles.countryStatValue}>
                      {selectedCountry.percentage}%
                    </Text>
                  </View>
                  <View style={styles.countryStatItem}>
                    <Text style={styles.countryStatLabel}>Transactions</Text>
                    <Text style={styles.countryStatValue}>
                      {selectedCountry.transactions}
                    </Text>
                  </View>
                </View>

                <View style={styles.countryProgressContainer}>
                  <View style={styles.countryProgressBar}>
                    <View
                      style={[
                        styles.countryProgressFill,
                        {
                          width: `${selectedCountry.percentage}%`,
                          backgroundColor: selectedCountry.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.countryProgressText}>
                    {selectedCountry.percentage}% of total spending
                  </Text>
                </View>
              </View>
            )}


            {/* See All Vendors Button */}
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => setShowVendorAnalytics(true)}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.seeAllButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="people" size={20} color="white" />
                <Text style={styles.seeAllButtonText}>See All Vendors</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Spending Trends Analysis */}
          {/* TODO: Remove or use real values? */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending Trends</Text>
            <Text style={styles.sectionSubtitle}>
              Detailed analysis of your spending patterns over time
            </Text>
            
            <View style={styles.trendsAnalysisContainer}>
              <View style={styles.analysisCard}>
                <View style={styles.analysisIconContainer}>
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    style={styles.analysisIcon}
                  >
                    <Ionicons name="trending-up" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.analysisContent}>
                  <Text style={styles.analysisTitle}>Highest Spending Day</Text>
                  <Text style={styles.analysisValue}>Friday</Text>
                  <Text style={styles.analysisDescription}>Average CHF 180/day</Text>
                </View>
              </View>

              <View style={styles.analysisCard}>
                <View style={styles.analysisIconContainer}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.analysisIcon}
                  >
                    <Ionicons name="trending-down" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.analysisContent}>
                  <Text style={styles.analysisTitle}>Lowest Spending Day</Text>
                  <Text style={styles.analysisValue}>Tuesday</Text>
                  <Text style={styles.analysisDescription}>Average CHF 95/day</Text>
                </View>
              </View>
            </View>

            <View style={styles.trendsAnalysisContainer}>
              <View style={styles.analysisCard}>
                <View style={styles.analysisIconContainer}>
                  <LinearGradient
                    colors={["#3B82F6", "#2563EB"]}
                    style={styles.analysisIcon}
                  >
                    <Ionicons name="time" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.analysisContent}>
                  <Text style={styles.analysisTitle}>Peak Spending Time</Text>
                  <Text style={styles.analysisValue}>7-9 PM</Text>
                  <Text style={styles.analysisDescription}>Evening activities</Text>
                </View>
              </View>

              <View style={styles.analysisCard}>
                <View style={styles.analysisIconContainer}>
                  <LinearGradient
                    colors={["#F59E0B", "#D97706"]}
                    style={styles.analysisIcon}
                  >
                    <Ionicons name="location" size={20} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.analysisContent}>
                  <Text style={styles.analysisTitle}>Most Frequent Location</Text>
                  <Text style={styles.analysisValue}>Zurich</Text>
                  <Text style={styles.analysisDescription}>78% of transactions</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Export & Reports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reports & Export</Text>
            <Text style={styles.sectionSubtitle}>
              Download your financial data and generate reports
            </Text>
            
            <View style={styles.reportsContainer}>
              <TouchableOpacity style={styles.reportCard}>
                <View style={styles.reportIcon}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.reportIconGradient}
                  >
                    <Ionicons name="download" size={24} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>Export to CSV</Text>
                  <Text style={styles.reportDescription}>Download all transaction data</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.reportCard}>
                <View style={styles.reportIcon}>
                  <LinearGradient
                    colors={["#3B82F6", "#2563EB"]}
                    style={styles.reportIconGradient}
                  >
                    <Ionicons name="document-text" size={24} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>Monthly Report</Text>
                  <Text style={styles.reportDescription}>Generate detailed monthly analysis</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.reportCard}>
                <View style={styles.reportIcon}>
                  <LinearGradient
                    colors={["#F59E0B", "#D97706"]}
                    style={styles.reportIconGradient}
                  >
                    <Ionicons name="pie-chart" size={24} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>Visual Charts</Text>
                  <Text style={styles.reportDescription}>Create spending visualization</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Vendor Analytics Modal */}
      <VendorAnalytics
        visible={showVendorAnalytics}
        onClose={() => setShowVendorAnalytics(false)}
      />

      {/* Country Details Modal */}
      {selectedCountryForDetails && (
        <CountryDetails
          visible={showCountryDetails}
          onClose={() => {
            setShowCountryDetails(false);
            setSelectedCountryForDetails(null);
          }}
          countryName={selectedCountryForDetails.country}
          countryFlag={selectedCountryForDetails.flag}
          countryColor={selectedCountryForDetails.color}
          rawTransactions={rawTransactions}
        />
      )}
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
    paddingTop: 70,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statChange: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  categoriesContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 14,
    color: "#6B7280",
  },
  categoryBar: {
    width: 60,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginLeft: 12,
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
  },
  trendsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trendCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 8,
    fontWeight: "500",
  },
  trendValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  trendDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  goalsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  goalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  goalAmount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 6,
  },
  goalProgress: {
    height: 8,
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  goalDescription: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  worldMapContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mapGrid: {
    marginBottom: 20,
  },
  mapRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  mapCell: {
    flex: 1,
    height: 40,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  countryCell: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  countryFlag: {
    fontSize: 20,
  },
  mapLegend: {
    alignItems: "center",
  },
  flagRowScroll: {
    marginBottom: 20,
  },
  flagRowContent: {
    paddingHorizontal: 4,
  },
  flagBox: {
    width: 72,
    height: 48,
    marginRight: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  flagBoxFlag: {
    fontSize: 24,
  },
  legendTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    fontWeight: "500",
  },
  legendItems: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#6B7280",
  },
  countryDetailsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  countryDetailsText: {
    fontSize: 14,
    color: "#6B7280",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  countryDetailsStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  countryStatItem: {
    alignItems: "center",
  },
  countryStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  countryStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  countryProgressContainer: {
    marginTop: 8,
  },
  countryProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  countryProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  countryProgressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  seeAllButton: {
    marginTop: 20,
  },
  seeAllButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  seeAllButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginHorizontal: 12,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
  },
  trendsAnalysisContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  analysisCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  analysisIconContainer: {
    marginBottom: 12,
  },
  analysisIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  analysisContent: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  analysisDescription: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  reportsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  reportIcon: {
    marginRight: 16,
  },
  reportIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  bottomSpacing: {
    height: 100,
  },
});
