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

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>LK</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Lasso Kayne</Text>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Income & Expenditure Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>$21,000</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#F472B6', '#FB7185']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-down" size={24} color="#F472B6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Expenditure</Text>
              <Text style={styles.statValue}>$11,000</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Account Balance Card */}
        <LinearGradient
          colors={['#F472B6', '#FB7185']}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.cardName}>Lasso Kayne</Text>
          </View>
          <View style={styles.cardNumber}>
            <Text style={styles.cardNumberText}>4551 5667 8886 7775</Text>
          </View>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
            <Text style={styles.balanceAmount}>$121,000</Text>
          </View>
        </LinearGradient>

        {/* Pay Bills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pay Bills</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.billsContainer}>
            <View style={styles.billItem}>
              <LinearGradient
                colors={['#60A5FA', '#3B82F6']}
                style={styles.billIcon}
              >
                <Ionicons name="water" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.billLabel}>Water</Text>
            </View>
            <View style={styles.billItem}>
              <LinearGradient
                colors={['#FB923C', '#F97316']}
                style={styles.billIcon}
              >
                <Ionicons name="flash" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.billLabel}>Power</Text>
            </View>
            <View style={styles.billItem}>
              <LinearGradient
                colors={['#34D399', '#10B981']}
                style={styles.billIcon}
              >
                <Ionicons name="wifi" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.billLabel}>Wi-Fi</Text>
            </View>
            <View style={styles.billItem}>
              <LinearGradient
                colors={['#4ADE80', '#22C55E']}
                style={styles.billIcon}
              >
                <Ionicons name="bag" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.billLabel}>Grocery</Text>
            </View>
          </View>
        </View>

        {/* Transactions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsContainer}>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="storefront" size={24} color="#60A5FA" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>Saber convenience Store</Text>
                <Text style={styles.transactionDate}>22 September 2021</Text>
              </View>
              <Text style={styles.transactionAmount}>-$22</Text>
            </View>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name="wifi" size={24} color="#60A5FA" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>Act Wi-Fi Bill</Text>
                <Text style={styles.transactionDate}>14 September 2021</Text>
              </View>
              <Text style={styles.transactionAmount}>-$120</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  },
  balanceCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceHeader: {
    marginBottom: 16,
  },
  cardName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  cardNumber: {
    marginBottom: 20,
  },
  cardNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCD34D',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  billsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billItem: {
    alignItems: 'center',
  },
  billIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  billLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});