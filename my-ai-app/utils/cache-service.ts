import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinanceTable } from './supabase';

interface CacheData {
  data: FinanceTable[];
  timestamp: number;
  version: string;
}

interface CacheOptions {
  maxAge?: number; // Cache max age in milliseconds
  version?: string; // Cache version for invalidation
}

class CacheService {
  private static instance: CacheService;
  private memoryCache: Map<string, CacheData> = new Map();
  private readonly DEFAULT_MAX_AGE = 30 * 60 * 1000; // 30 minutes
  private readonly CACHE_VERSION = '1.0.0';

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Generate cache key
   */
  private getCacheKey(key: string): string {
    return `finance_cache_${key}`;
  }

  /**
   * Check if cached data is valid
   */
  private isValidCache(cacheData: CacheData, maxAge: number): boolean {
    const now = Date.now();
    const isNotExpired = (now - cacheData.timestamp) < maxAge;
    const isValidVersion = cacheData.version === this.CACHE_VERSION;
    
    return isNotExpired && isValidVersion;
  }

  /**
   * Get data from cache (memory first, then AsyncStorage)
   */
  async get<T = FinanceTable[]>(
    key: string, 
    options: CacheOptions = {}
  ): Promise<T | null> {
    const { maxAge = this.DEFAULT_MAX_AGE } = options;
    const cacheKey = this.getCacheKey(key);

    try {
      // Check memory cache first
      const memoryData = this.memoryCache.get(cacheKey);
      if (memoryData && this.isValidCache(memoryData, maxAge)) {
        console.log(`📱 Cache HIT (memory): ${key}`);
        return memoryData.data as T;
      }

      // Check AsyncStorage cache
      const storageData = await AsyncStorage.getItem(cacheKey);
      if (storageData) {
        const parsedData: CacheData = JSON.parse(storageData);
        
        if (this.isValidCache(parsedData, maxAge)) {
          console.log(`💾 Cache HIT (storage): ${key}`);
          // Update memory cache
          this.memoryCache.set(cacheKey, parsedData);
          return parsedData.data as T;
        } else {
          console.log(`⏰ Cache EXPIRED: ${key}`);
          // Remove expired cache
          await this.remove(key);
        }
      }

      console.log(`❌ Cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error(`Error reading cache for ${key}:`, error);
      return null;
    }
  }

  /**
   * Set data in cache (both memory and AsyncStorage)
   */
  async set<T = FinanceTable[]>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const { version = this.CACHE_VERSION } = options;
    const cacheKey = this.getCacheKey(key);
    
    const cacheData: CacheData = {
      data: data as FinanceTable[],
      timestamp: Date.now(),
      version,
    };

    try {
      // Set in memory cache
      this.memoryCache.set(cacheKey, cacheData);
      
      // Set in AsyncStorage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      console.log(`💾 Cache SET: ${key} (${Array.isArray(data) ? data.length : 1} items)`);
    } catch (error) {
      console.error(`Error setting cache for ${key}:`, error);
    }
  }

  /**
   * Remove data from cache
   */
  async remove(key: string): Promise<void> {
    const cacheKey = this.getCacheKey(key);
    
    try {
      // Remove from memory cache
      this.memoryCache.delete(cacheKey);
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(cacheKey);
      
      console.log(`🗑️ Cache REMOVED: ${key}`);
    } catch (error) {
      console.error(`Error removing cache for ${key}:`, error);
    }
  }

  /**
   * Clear all cache data
   */
  async clearAll(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear();
      
      // Get all AsyncStorage keys and remove finance cache keys
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('finance_cache_'));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
      
      console.log(`🧹 Cache CLEARED: ${cacheKeys.length} items`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache info for debugging
   */
  async getCacheInfo(): Promise<{
    memoryKeys: string[];
    storageKeys: string[];
    totalSize: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('finance_cache_'));
      
      return {
        memoryKeys: Array.from(this.memoryCache.keys()),
        storageKeys: cacheKeys,
        totalSize: cacheKeys.length,
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return {
        memoryKeys: [],
        storageKeys: [],
        totalSize: 0,
      };
    }
  }

  /**
   * Check if data exists in cache and is valid
   */
  async has(key: string, maxAge: number = this.DEFAULT_MAX_AGE): Promise<boolean> {
    const data = await this.get(key, { maxAge });
    return data !== null;
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Export cache keys as constants
export const CACHE_KEYS = {
  TRANSACTIONS: 'transactions',
  RAW_TRANSACTIONS: 'raw_transactions',
  COUNTRY_DATA: 'country_data',
  VENDOR_DATA: 'vendor_data',
} as const;
