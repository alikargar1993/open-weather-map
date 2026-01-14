import "@testing-library/jest-native/extend-expect";

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () => {
  const storage = new Map();
  return {
    default: {
      setItem: jest.fn((key, value) => {
        return Promise.resolve(storage.set(key, value));
      }),
      getItem: jest.fn((key) => {
        return Promise.resolve(storage.get(key) || null);
      }),
      removeItem: jest.fn((key) => {
        return Promise.resolve(storage.delete(key));
      }),
      clear: jest.fn(() => {
        return Promise.resolve(storage.clear());
      }),
      getAllKeys: jest.fn(() => {
        return Promise.resolve(Array.from(storage.keys()));
      }),
      multiGet: jest.fn((keys) => {
        return Promise.resolve(
          keys.map((key: string) => [key, storage.get(key) || null])
        );
      }),
      multiSet: jest.fn((keyValuePairs: [string, string][]) => {
        keyValuePairs.forEach(([key, value]) => storage.set(key, value));
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: string[]) => {
        keys.forEach((key) => storage.delete(key));
        return Promise.resolve();
      }),
    },
  };
});

// Mock expo-location
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  getForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    })
  ),
  Accuracy: {
    Balanced: 3,
  },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});
