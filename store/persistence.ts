import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Storage } from "redux-persist";

// Create a storage adapter for redux-persist using AsyncStorage
export const asyncStorage: Storage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving to AsyncStorage:", error);
      throw error;
    }
  },
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? null;
    } catch (error) {
      console.error("Error reading from AsyncStorage:", error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from AsyncStorage:", error);
      throw error;
    }
  },
};

// Export AsyncStorage directly for use in weatherSlice
export { AsyncStorage as storage };
