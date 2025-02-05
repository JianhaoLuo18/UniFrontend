import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BookingDTO } from './types/BookingDTO';
import BookingCard from './components/BookingCard';

const BACKEND_HOST = "3.67.172.45:8080";

export default function BookingSummaryScreen() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

    const fetchActiveBookings = useCallback(async () => {
    setLoading(true);
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        console.log("📡 Retrieved stored email:", storedEmail);
        setUserEmail(storedEmail); 
      }

      const url = `http://${BACKEND_HOST}/api/bookings/active?userEmail=${storedEmail}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings.');
      }
      const data: BookingDTO[] = await response.json();
      setBookings(data);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveBookings();
  }, [fetchActiveBookings]);

  const handleCancelRefresh = () => {
    fetchActiveBookings();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveBookings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Active Bookings</Text>

      {!userEmail ? (
        <Text style={styles.noBookingsText}>
          You haven't made a booking yet. Please book a flat to see your active bookings.
        </Text>
      ) : loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No active bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookingCard booking={item} />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  listContainer: { paddingBottom: 20 },
  noBookingsText: { textAlign: 'center', color: '#888', fontSize: 16, marginTop: 20 },
});
