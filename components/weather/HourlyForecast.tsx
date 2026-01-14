import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { selectHourlyForecast } from '@/store/slices/weatherSlice';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature, formatTime } from '@/utils/weatherUtils';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ForecastItem } from '@/services/weatherApi';

export const HourlyForecast: React.FC = () => {
  const hourlyForecast = useAppSelector(selectHourlyForecast);

  if (!hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Hourly Forecast
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hourlyForecast.map((hour, index) => (
          <HourlyForecastItem key={`${hour.dt}-${index}`} hour={hour} />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

interface HourlyForecastItemProps {
  hour: ForecastItem;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({ hour }) => {
  const weather = hour.weather[0];

  return (
    <View style={styles.hourContainer}>
      <ThemedText style={styles.time}>{formatTime(hour.dt)}</ThemedText>
      <WeatherIcon iconCode={weather.icon} size={40} />
      <ThemedText type="defaultSemiBold" style={styles.temp}>
        {formatTemperature(hour.main.temp)}
      </ThemedText>
      <ThemedText style={styles.condition}>{weather.main}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '600',
  },
  hourContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  time: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.7,
  },
  temp: {
    fontSize: 16,
    marginTop: 8,
  },
  condition: {
    fontSize: 10,
    marginTop: 4,
    textTransform: 'capitalize',
    opacity: 0.6,
  },
});
