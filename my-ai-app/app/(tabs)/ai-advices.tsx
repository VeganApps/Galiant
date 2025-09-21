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
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import Animated, { FadeInUp, SlideInLeft } from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  category: "upselling" | "insight" | "savings" | "navigation";
  priority: "high" | "medium" | "low";
  icon: string;
  color: string;
  action: string;
  value?: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  confidence: number;
}

const aiSuggestions: AISuggestion[] = [
  {
    id: "1",
    title: "Credit Card Recommendation",
    description:
      "Save on transaction fees with our premium credit card. Based on your international spending pattern, you could save up to CHF 110 annually.",
    category: "upselling",
    priority: "high",
    icon: "card",
    color: "#10B981",
    action: "Apply Now",
    value: "Save CHF 110/year",
  },
  {
    id: "2",
    title: "Subscription Monitor",
    description:
      "Track all your monthly subscriptions in one place. You have 8 active subscriptions costing CHF 82/month.",
    category: "insight",
    priority: "medium",
    icon: "list",
    color: "#3B82F6",
    action: "View Details",
    value: "CHF 82/month",
  },
  {
    id: "3",
    title: "Spending Heatmap",
    description:
      "Get your personalized spending recap like Spotify Wrapped. See your financial journey across countries and categories.",
    category: "upselling",
    priority: "medium",
    icon: "map",
    color: "#F59E0B",
    action: "Generate Report",
    value: "Free Report",
  },
  {
    id: "4",
    title: "Smart Savings",
    description:
      "Switch from COOP to LIDL for groceries and save CHF 42/month. Based on your current spending pattern.",
    category: "savings",
    priority: "high",
    icon: "trending-down",
    color: "#8B5CF6",
    action: "Save Now",
    value: "Save CHF 42/month",
  },
  {
    id: "5",
    title: "Navigation Helper",
    description:
      "Having trouble finding something? Our AI assistant can guide you through any feature in the app.",
    category: "navigation",
    priority: "low",
    icon: "compass",
    color: "#EC4899",
    action: "Ask Galiant",
    value: "AI Powered",
  },
  {
    id: "6",
    title: "Credit Line Increase",
    description:
      "For your upcoming home renovation, consider increasing your credit line. You qualify for up to CHF 23,000.",
    category: "upselling",
    priority: "medium",
    icon: "trending-up",
    color: "#EF4444",
    action: "Apply",
    value: "Up to CHF 23,000",
  },
];

const aiInsights: AIInsight[] = [
  {
    id: "1",
    title: "Spending Pattern Analysis",
    description: "Your dining expenses increased 23% this month compared to last month. Consider meal planning to optimize costs.",
    icon: "analytics",
    color: "#10B981",
    confidence: 94,
  },
  {
    id: "2",
    title: "Investment Opportunity",
    description: "Based on your savings rate, you could potentially invest CHF 500/month in low-risk funds.",
    icon: "trending-up",
    color: "#3B82F6",
    confidence: 87,
  },
  {
    id: "3",
    title: "Budget Optimization",
    description: "You're spending 15% more on entertainment than your target. Consider reducing dining out frequency.",
    icon: "wallet",
    color: "#F59E0B",
    confidence: 91,
  },
];

export default function AIAssistantScreen() {
  const [quickQuestion, setQuickQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All", icon: "grid", color: "#6B7280" },
    { id: "upselling", name: "Products", icon: "storefront", color: "#10B981" },
    { id: "insight", name: "Insights", icon: "bulb", color: "#3B82F6" },
    { id: "savings", name: "Savings", icon: "trending-down", color: "#8B5CF6" },
    { id: "navigation", name: "Help", icon: "compass", color: "#EC4899" },
  ];

  const filteredSuggestions = selectedCategory 
    ? aiSuggestions.filter(s => s.category === selectedCategory)
    : aiSuggestions;

  const handleQuickQuestion = () => {
    if (quickQuestion.trim()) {
      // Save the question to localStorage/AsyncStorage for the chat page
      const savedQuestion = quickQuestion.trim();
      
      // Clear the input
      setQuickQuestion("");
      
      // Switch to the ai-chat page (page 3)
      router.push({
        pathname: "/ai-chat",
        params: { 
          preloadedQuestion: savedQuestion,
          source: "ai-advices"
        }
      });
    }
  };

  const handleSuggestionAction = (suggestion: AISuggestion) => {
    Alert.alert(
      suggestion.title,
      `Action: ${suggestion.action}\n\nThis will be implemented to provide the specific functionality for ${suggestion.title}.`,
      [{ text: "Got it" }]
    );
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
            <View style={styles.headerTop}>
              <View style={styles.headerIconContainer}>
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.headerIcon}
                >
                  <Ionicons name="sparkles" size={24} color="white" />
                </LinearGradient>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>AI Advices</Text>
                <Text style={styles.subtitle}>Your intelligent financial companion</Text>
              </View>
            </View>
          </View>

          {/* Quick Question Input */}
          <Animated.View
            style={styles.quickQuestionContainer}
            entering={FadeInUp.delay(100).duration(600).springify()}
          >
            <Text style={styles.sectionTitle}>Ask Galiant Anything</Text>
            <View style={styles.questionInputContainer}>
              <TextInput
                style={styles.questionInput}
                placeholder="Ask a question about your finances..."
                value={quickQuestion}
                onChangeText={setQuickQuestion}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: quickQuestion.trim() ? 1 : 0.5 }
                ]}
                onPress={handleQuickQuestion}
                disabled={!quickQuestion.trim()}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* AI Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Smart Insights</Text>
            <Text style={styles.sectionSubtitle}>
              AI-powered analysis of your financial patterns
            </Text>
            
            {aiInsights.map((insight, index) => (
              <Animated.View
                key={insight.id}
                style={styles.insightCard}
                entering={FadeInUp.delay(200 + index * 100).duration(600).springify()}
              >
                <View style={styles.insightHeader}>
                  <View style={[
                    styles.insightIcon,
                    { backgroundColor: `${insight.color}15` }
                  ]}>
                    <Ionicons name={insight.icon as any} size={24} color={insight.color} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                  </View>
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceText}>{insight.confidence}%</Text>
                    <Text style={styles.confidenceLabel}>Confidence</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id === "all" ? null : category.id)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color={selectedCategory === category.id ? "white" : category.color}
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* AI Suggestions Carousel */}
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsCarousel}
              contentContainerStyle={styles.suggestionsCarouselContent}
              decelerationRate="fast"
              snapToInterval={width * 0.85}
              snapToAlignment="start"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <Animated.View
                  key={suggestion.id}
                  style={styles.suggestionCard}
                  entering={FadeInUp.delay(300 + index * 100).duration(600).springify()}
                >
                  <View style={styles.suggestionHeader}>
                    <View
                      style={[
                        styles.suggestionIcon,
                        { backgroundColor: `${suggestion.color}15` },
                      ]}
                    >
                      <Ionicons
                        name={suggestion.icon as any}
                        size={24}
                        color={suggestion.color}
                      />
                    </View>
                    <View style={styles.suggestionHeaderInfo}>
                      <Text style={styles.suggestionTitle}>
                        {suggestion.title}
                      </Text>
                      <View style={styles.suggestionMeta}>
                        <View
                          style={[
                            styles.categoryBadge,
                            { backgroundColor: `${suggestion.color}20` },
                          ]}
                        >
                          <Text
                            style={[
                              styles.categoryText,
                              { color: suggestion.color },
                            ]}
                          >
                            {suggestion.category.toUpperCase()}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.priorityDot,
                            { backgroundColor: suggestion.color },
                          ]}
                        />
                      </View>
                    </View>
                    {suggestion.value && (
                      <View
                        style={[
                          styles.valueBadge,
                          { backgroundColor: suggestion.color },
                        ]}
                      >
                        <Text style={styles.valueText}>{suggestion.value}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.suggestionDescription}>
                    {suggestion.description}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { borderColor: suggestion.color },
                    ]}
                    onPress={() => handleSuggestionAction(suggestion)}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: suggestion.color },
                      ]}
                    >
                      {suggestion.action}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={suggestion.color}
                    />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </View>

          {/* AI Stats Summary */}
          <View style={styles.section}>
            <View style={styles.statsSummary}>
              <View style={styles.statsHeader}>
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.statsIcon}
                >
                  <Ionicons name="stats-chart" size={24} color="white" />
                </LinearGradient>
                <View style={styles.statsContent}>
                  <Text style={styles.statsTitle}>AI Performance</Text>
                  <Text style={styles.statsSubtitle}>
                    Your AI advisor is continuously learning from your financial patterns
                  </Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>CHF 2,200</Text>
                  <Text style={styles.statLabel}>Potential Annual Savings</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Active Recommendations</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>94%</Text>
                  <Text style={styles.statLabel}>Prediction Accuracy</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Help & Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
            <View style={styles.helpContainer}>
              <TouchableOpacity style={styles.helpItem}>
                <View style={styles.helpIcon}>
                  <Ionicons name="chatbubble" size={24} color="#10B981" />
                </View>
                <View style={styles.helpContent}>
                  <Text style={styles.helpTitle}>Live Chat</Text>
                  <Text style={styles.helpDescription}>Get instant help from our support team</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpItem}>
                <View style={styles.helpIcon}>
                  <Ionicons name="help-circle" size={24} color="#3B82F6" />
                </View>
                <View style={styles.helpContent}>
                  <Text style={styles.helpTitle}>FAQ</Text>
                  <Text style={styles.helpDescription}>Find answers to common questions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpItem}>
                <View style={styles.helpIcon}>
                  <Ionicons name="mail" size={24} color="#F59E0B" />
                </View>
                <View style={styles.helpContent}>
                  <Text style={styles.helpTitle}>Contact Us</Text>
                  <Text style={styles.helpDescription}>Send us a message or feedback</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
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
    paddingTop: 70,
    paddingVertical: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconContainer: {
    marginRight: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  quickQuestionContainer: {
    marginBottom: 30,
  },
  questionInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  questionInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  sendButton: {
    marginLeft: 12,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  insightCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  confidenceContainer: {
    alignItems: "center",
    marginLeft: 16,
  },
  confidenceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
  },
  confidenceLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    color: "white",
  },
  suggestionsCarousel: {
    marginBottom: 24,
  },
  suggestionsCarouselContent: {
    paddingRight: 24,
  },
  suggestionCard: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  suggestionHeaderInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  suggestionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
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
    fontWeight: "600",
    color: "white",
  },
  suggestionDescription: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  statsSummary: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  helpContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
});