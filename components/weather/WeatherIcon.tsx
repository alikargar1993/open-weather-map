import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getWeatherIconUrl } from '@/utils/weatherUtils';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  size = 64,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: getWeatherIconUrl(iconCode) }}
        style={[styles.icon, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 64,
    height: 64,
  },
});
