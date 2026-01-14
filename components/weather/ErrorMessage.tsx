import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectError, clearError } from '@/store/slices/weatherSlice';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export const ErrorMessage: React.FC = () => {
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!error) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <Ionicons name="alert-circle" size={24} color={colors.tint} style={styles.icon} />
      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Error
        </ThemedText>
        <ThemedText style={styles.message}>{error}</ThemedText>
      </View>
      <TouchableOpacity onPress={() => dispatch(clearError())} style={styles.closeButton}>
        <Ionicons name="close" size={20} color={colors.icon} />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    opacity: 0.8,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
