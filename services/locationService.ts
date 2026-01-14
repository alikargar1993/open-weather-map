import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { Alert, Platform } from "react-native";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationError {
  code: string;
  message: string;
}

class LocationService {
  /**
   * Request location permissions and get current position
   */
  async getCurrentLocation(retryCount: number = 0): Promise<LocationCoords> {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // Show alert to user
        return new Promise((resolve, reject) => {
          Alert.alert(
            "Location Permission Required",
            "This app needs location access to show weather for your current location. Please grant location permission in settings or try again.",
            [
              {
                text: "Open Settings",
                onPress: async () => {
                  if (Platform.OS === "ios") {
                    await Linking.openURL("app-settings:");
                  } else {
                    await Linking.openSettings();
                  }
                  reject(
                    new Error(
                      "Location permission denied. Please grant permission in settings."
                    )
                  );
                },
              },
              {
                text: "Try Again",
                onPress: async () => {
                  if (retryCount < 2) {
                    try {
                      const result = await this.getCurrentLocation(
                        retryCount + 1
                      );
                      resolve(result);
                    } catch (error) {
                      reject(error);
                    }
                  } else {
                    reject(
                      new Error(
                        "Location permission denied after multiple attempts."
                      )
                    );
                  }
                },
              },
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  reject(new Error("Location permission denied by user."));
                },
              },
            ],
            { cancelable: false }
          );
        });
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to get location");
    }
  }

  /**
   * Check if location permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  }
}

export const locationService = new LocationService();
