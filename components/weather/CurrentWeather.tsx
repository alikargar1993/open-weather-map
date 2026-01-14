import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentWeather } from '@/store/slices/weatherSlice';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature, formatWindSpeed, getWindDirection } from '@/utils/weatherUtils';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export const CurrentWeather: React.FC = () => {
  const currentWeather = useAppSelector(selectCurrentWeather);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!currentWeather) {
    return null;
  }

  const weather = currentWeather.weather[0];
  const main = currentWeather.main;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.cityName}>
          {currentWeather.name}
        </ThemedText>
        <ThemedText style={[styles.description, { color: colors.icon }]}>
          {weather.description}
        </ThemedText>
      </View>

      <View style={styles.mainInfo}>
        <WeatherIcon iconCode={weather.icon} size={120} />
        <View style={styles.temperatureContainer}>
          <ThemedText type="title" style={styles.temperature}>
            {formatTemperature(main.temp)}
          </ThemedText>
          <ThemedText style={[styles.feelsLike, { color: colors.icon }]}>
            Feels like {formatTemperature(main.feels_like)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Humidity</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {main.humidity}%
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Wind Speed</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {formatWindSpeed(currentWeather.wind.speed)} {getWindDirection(currentWeather.wind.deg)}
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Pressure</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {main.pressure} hPa
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={styles.detailLabel}>Visibility</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.detailValue}>
            {(currentWeather.visibility / 1000).toFixed(1)} km
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  temperatureContainer: {
    marginLeft: 20,
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    lineHeight: 80,
  },
  feelsLike: {
    fontSize: 16,
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
});
