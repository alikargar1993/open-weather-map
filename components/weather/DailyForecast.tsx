import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { selectDailyForecast } from '@/store/slices/weatherSlice';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '@/utils/weatherUtils';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { DailyForecast as DailyForecastType } from '@/types/weather';

export const DailyForecast: React.FC = () => {
  const dailyForecast = useAppSelector(selectDailyForecast);

  if (!dailyForecast || dailyForecast.length === 0) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        5-Day Forecast
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dailyForecast.map((day, index) => (
          <DailyForecastItem key={`${day.date}-${index}`} day={day} />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

interface DailyForecastItemProps {
  day: DailyForecastType;
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({ day }) => {
  return (
    <View style={styles.dayContainer}>
      <ThemedText style={styles.dayName}>{day.dayName}</ThemedText>
      <WeatherIcon iconCode={day.icon} size={48} />
      <View style={styles.temps}>
        <ThemedText type="defaultSemiBold" style={styles.high}>
          {formatTemperature(day.high)}
        </ThemedText>
        <ThemedText style={styles.low}>
          {formatTemperature(day.low)}
        </ThemedText>
      </View>
      <ThemedText style={styles.condition}>{day.condition}</ThemedText>
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
  dayContainer: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 100,
  },
  dayName: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  temps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  high: {
    fontSize: 18,
  },
  low: {
    fontSize: 16,
    opacity: 0.6,
  },
  condition: {
    fontSize: 12,
    marginTop: 4,
    textTransform: 'capitalize',
    opacity: 0.7,
  },
});
