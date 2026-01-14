import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { ErrorMessage } from "@/components/weather/ErrorMessage";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { LoadingSpinner } from "@/components/weather/LoadingSpinner";
import { SearchBar } from "@/components/weather/SearchBar";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchWeatherByCity,
  fetchWeatherByLocation,
  loadCachedWeather,
  selectLastUpdated,
  selectLoading,
} from "@/store/slices/weatherSlice";
import { formatDateTime, formatLastUpdated } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const currentWeather = useAppSelector(
    (state) => state.weather.currentWeather
  );
  const lastUpdated = useAppSelector(selectLastUpdated);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Load cached data first
    dispatch(loadCachedWeather())
      .then(() => {
        dispatch(fetchWeatherByLocation());
      })
      .catch((error) => {
        console.error(error);
      });

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (currentWeather) {
        await dispatch(fetchWeatherByCity(currentWeather.name));
      } else {
        await dispatch(fetchWeatherByLocation());
      }
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLocationPress = () => {
    dispatch(fetchWeatherByLocation());
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <SearchBar />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(50)}>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeRow}>
              <Ionicons name="time-outline" size={16} color={colors.icon} />
              <ThemedText style={[styles.dateTimeText, { color: colors.icon }]}>
                {formatDateTime(currentTime)}
              </ThemedText>
            </View>
            {lastUpdated && (
              <View style={styles.dateTimeRow}>
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color={colors.icon}
                />
                <ThemedText
                  style={[styles.lastUpdatedText, { color: colors.icon }]}
                >
                  Last updated: {formatLastUpdated(lastUpdated)}
                </ThemedText>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <ErrorMessage />
        </Animated.View>

        {loading && !currentWeather ? (
          <LoadingSpinner />
        ) : (
          <>
            <Animated.View entering={FadeInDown.duration(600).delay(200)}>
              <CurrentWeather />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(300)}>
              <HourlyForecast />
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(400)}>
              <DailyForecast />
            </Animated.View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={handleLocationPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Ionicons name="location" size={24} color={colors.background} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dateTimeContainer: {
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.8,
  },
  lastUpdatedText: {
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.7,
  },
});
